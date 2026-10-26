/* 퍼즐 ① 외교 담판 — 여러 단계로 이루어진 협상.
   - stance: 태도 고르기 (예: 예법 다툼)
   - claim : 상대 주장에 맞서 단서·추론 카드를 내민다. 반쯤 맞는 카드는 상대가 되받아치며 '무엇이 부족한지' 알려 준다.
   - deal  : 두 나라가 주고받을 조건을 골라 협상안을 만든다.
   상대의 태도(mood)가 바닥나면 협상이 깨질 뻔하지만, 그 단계만 다시 시도한다. 언제든 물러나 더 조사할 수 있다.
   cfg: { goal, caption, bg(), left, right, leftFig(), rightFig(), moodLabel, startMood, saveKey,
          intro[], resumeIntro[], stages[], breakLines[], outro[] }
   반환: 'done' | 'withdraw' */
HA.puzzles.debate = function (cfg, g) {
  const { h, esc, sleep } = HA.util;
  return new Promise((resolve) => {
    const root = HA.ui.openOverlay('pz-debate');
    root.innerHTML = `
      <div class="pz-bg">${cfg.bg()}</div>
      <div class="db-fig left">${cfg.leftFig()}</div>
      <div class="db-fig right">${cfg.rightFig()}</div>
      <div class="db-bubble" aria-live="polite"></div>
      <div class="db-steps" aria-label="담판 진행"></div>
      <div class="db-rope" aria-label="설득 줄다리기"><span>서희</span><div class="rope"><i class="knot"></i></div><span>소손녕</span></div>
      <div class="db-meter" aria-label="${esc(cfg.moodLabel)}"><span>${esc(cfg.moodLabel)}</span><b class="m-ico">😐</b><div class="bar"><i></i></div></div>
      <div class="db-hand">
        <div class="db-hand-title"><span class="ttl"></span><button class="btn tiny db-withdraw">↩ 물러나서 더 조사하기</button></div>
        <div class="db-body"></div>
      </div>`;
    const bubble = root.querySelector('.db-bubble');
    const body = root.querySelector('.db-body');
    const ttl = root.querySelector('.ttl');
    const bar = root.querySelector('.bar i');
    const ico = root.querySelector('.m-ico');
    const stepsEl = root.querySelector('.db-steps');
    const rightName = g.ep.characters[cfg.right].name;
    let idx = Math.min(g.st.flags[cfg.saveKey] || 0, cfg.stages.length - 1);
    let mood = cfg.startMood;
    let locked = true;
    let hintLevel = 0;
    let usedHints = false;
    let broke = false;
    const dealPick = {};
    let updateScales = () => {};

    const stage = () => cfg.stages[idx];
    let weakFound = false;
    /** 소손녕 표정 바꾸기: smile(여유) · serious(경계) · proud(비웃음) · worried(당황) */
    function face(expr) {
      if (!cfg.rightFig.length) return;
      const el = root.querySelector('.db-fig.right');
      el.innerHTML = cfg.rightFig(expr);
      el.classList.remove('react');
      void el.offsetWidth;
      el.classList.add('react');
    }
    function rope() {
      // 단계를 하나 이길 때마다 매듭이 서희 쪽으로 끌려온다
      root.querySelector('.knot').style.left = 50 - (idx / cfg.stages.length) * 45 + '%';
    }
    g.puzzleHint = () => {
      usedHints = true;
      const hs = stage().hints;
      return hs[Math.min(hintLevel++, hs.length - 1)];
    };

    function setMood(d) {
      mood = Math.max(0, Math.min(100, mood + d));
      bar.style.width = mood + '%';
      bar.style.background = mood < 30 ? '#c0392b' : mood < 60 ? '#d4a63c' : '#2f9d7d';
      ico.textContent = mood < 30 ? '😠' : mood < 60 ? '😐' : '🙂';
      if (d < 0) {
        root.querySelector('.db-meter').classList.remove('hit');
        void root.offsetWidth;
        root.querySelector('.db-meter').classList.add('hit');
      }
    }
    function say(text, cls = '') {
      bubble.className = 'db-bubble on ' + cls;
      bubble.innerHTML = `<b>${esc(rightName)}</b><p>${esc(text)}</p>`;
    }
    function steps() {
      stepsEl.innerHTML = cfg.stages.map((s, i) => `<span class="${i < idx ? 'done' : i === idx ? 'cur' : ''}">${i < idx ? '✓' : i + 1 + '.'} ${esc(s.name)}</span>`).join('');
    }

    /** 태도가 바닥나면: 협상이 깨질 뻔 → 같은 단계부터 다시 */
    async function checkBreak() {
      if (mood > 0) return false;
      broke = true;
      HA.audio.play('wrong');
      await g.say(cfg.breakLines);
      mood = cfg.startMood - 20;
      setMood(0);
      return true;
    }

    async function next(winLines) {
      HA.audio.play('good');
      setMood(18);
      face('worried');
      bubble.className = 'db-bubble';
      await g.say(winLines);
      idx++;
      hintLevel = 0;
      g.setFlag(cfg.saveKey, idx);
      rope();
      if (idx >= cfg.stages.length) {
        if (!usedHints && !broke) g.setFlag('medal_' + cfg.saveKey);
        root.classList.add('won');
        root.appendChild(h(`<div class="sig-banner"><b>담판 성공!</b><small>${esc(cfg.winBanner || '')}</small></div>`));
        HA.audio.play('win');
        await sleep(60);
        root.classList.add('banner-on');
        await sleep(1800);
        await g.say(cfg.outro);
        return resolve('done');
      }
      show();
    }

    /* ----- 단계별 화면 ----- */
    function show() {
      steps();
      const s = stage();
      body.innerHTML = '';
      locked = false;
      if (s.type === 'stance') {
        say(s.prompt);
        ttl.innerHTML = '🗣️ 서희는 어떻게 대응할까요?';
        const row = h('<div class="db-choices"></div>');
        s.choices.forEach((c) => {
          const b = h(`<button class="db-choice">${esc(c.text)}</button>`);
          b.onclick = async () => {
            if (locked || HA.ui.isTalking()) return;
            locked = true;
            if (c.ok) return next(c.lines);
            HA.audio.play('wrong');
            b.disabled = true;
            b.classList.add('nope');
            setMood(c.mood || -15);
            await g.say(c.lines);
            await checkBreak();
            say(s.prompt);
            locked = false;
          };
          row.appendChild(b);
        });
        body.appendChild(row);
      } else if (s.type === 'claim') {
        face('smile');
        weakFound = !s.weak;
        claimBubble(s);
        renderCards();
      } else if (s.type === 'deal') {
        say(s.prompt);
        ttl.innerHTML = '🤝 협상안 만들기 — 각 칸에서 하나씩 골라 제안해요';
        const wrap = h('<div class="db-deal"></div>');
        s.columns.forEach((col, ci) => {
          const c = h(`<div class="deal-col"><h4>${esc(col.title)}</h4></div>`);
          col.options.forEach((o) => {
            const b = h(`<button class="deal-opt" data-c="${ci}" data-o="${o.id}">${esc(o.text)}</button>`);
            b.onclick = () => {
              if (locked) return;
              HA.audio.play('click');
              dealPick[ci] = o.id;
              c.querySelectorAll('.deal-opt').forEach((x) => x.classList.toggle('sel', x === b));
              updateScales();
              propose.disabled = Object.keys(dealPick).length < s.columns.length;
            };
            c.appendChild(b);
          });
          wrap.appendChild(c);
        });
        const side = h(`<div class="deal-side">
            <div class="scale"><span>${esc(s.scales[0])}</span><div class="sbar k"><i></i></div></div>
            <div class="scale"><span>${esc(s.scales[1])}</span><div class="sbar gr"><i></i></div></div>
          </div>`);
        const propose = h('<button class="btn primary deal-go" disabled>제안하기</button>');
        propose.onclick = () => proposeDeal(s);
        side.appendChild(propose);
        wrap.appendChild(side);
        body.appendChild(wrap);
        // 고를 때마다 저울이 움직이고 소손녕의 표정이 바뀐다
        updateScales = () => {
          const picks = s.columns.map((col, ci) => col.options.find((o) => o.id === dealPick[ci])).filter(Boolean);
          const k = picks.reduce((a, o) => a + (o.k || 0), 0);
          const gr = picks.reduce((a, o) => a + (o.gr || 0), 0);
          side.querySelector('.k i').style.width = Math.max(4, Math.min(100, 50 + k * 15)) + '%';
          side.querySelector('.gr i').style.width = Math.max(4, Math.min(100, 50 + gr * 15)) + '%';
          if (picks.length) face(k > 0 ? 'smile' : k < 0 ? 'proud' : 'serious');
        };
        updateScales();
      }
    }

    /** 주장 말풍선: 약점이 될 만한 구절을 눌러 고를 수 있다 */
    function claimBubble(s) {
      bubble.className = 'db-bubble on';
      if (!s.weak || weakFound) {
        bubble.innerHTML = `<b>${esc(rightName)}</b><p>${esc(s.claim)}</p>`;
        if (s.weak) s.weak.filter((w) => w.ok).forEach((w) => (bubble.querySelector('p').innerHTML = bubble.querySelector('p').innerHTML.replace(esc(w.text), `<mark class="weak hit">${esc(w.text)}</mark>`)));
        ttl.innerHTML = '📖 그 약점을 무너뜨릴 <b>단서</b>나 <b>추론 카드</b>를 내밀어요';
        return;
      }
      let html = esc(s.claim);
      s.weak.forEach((w, i) => (html = html.replace(esc(w.text), `<button class="weak" data-w="${i}">${esc(w.text)}</button>`)));
      bubble.innerHTML = `<b>${esc(rightName)}</b><p>${html}</p>`;
      ttl.innerHTML = '🔍 먼저 소손녕 말의 <b>약점</b>을 찾아 말풍선의 밑줄 친 부분을 눌러요';
      bubble.querySelectorAll('.weak').forEach((b) => {
        b.onclick = async () => {
          if (HA.ui.isTalking()) return;
          const w = s.weak[+b.dataset.w];
          if (w.ok) {
            HA.audio.play('good');
            weakFound = true;
            b.classList.add('hit');
            await g.say([{ who: cfg.left, text: w.reply }]);
            claimBubble(s);
            renderCards();
          } else {
            HA.audio.play('click');
            b.classList.add('nope');
            b.disabled = true;
            await g.say([{ who: cfg.left, text: w.reply }]);
          }
        };
      });
    }

    function renderCards() {
      if (stage().type !== 'claim') return;
      body.innerHTML = '';
      const cards = h(`<div class="cards ${weakFound ? '' : 'waiting'}"></div>`);
      // 추론 카드를 앞에 둔다
      const ids = [...g.st.clues].sort((a, b) => g.isInsight(b) - g.isInsight(a));
      ids.forEach((id) => {
        const c = g.info(id);
        const b = h(`<button class="clue-card ${g.isInsight(id) ? 'insight' : ''}" data-id="${id}"><span class="ico">${c.icon}</span><span><b>${esc(c.title)}</b><small>${esc(c.short || '')}</small></span></button>`);
        b.onclick = () => present(id, b);
        cards.appendChild(b);
      });
      body.appendChild(cards);
    }
    const onClues = () => renderCards();
    document.addEventListener('ha:clues', onClues);
    root._cleanup = () => document.removeEventListener('ha:clues', onClues);

    /** 카드가 협상 탁자 한가운데로 날아간다 */
    function fly(btn) {
      const st = HA.util.toStage(btn.getBoundingClientRect().left, btn.getBoundingClientRect().top);
      const ghost = btn.cloneNode(true);
      ghost.className = btn.className + ' flying';
      ghost.style.left = st.x + 'px';
      ghost.style.top = st.y + 'px';
      root.appendChild(ghost);
      void ghost.offsetWidth;
      ghost.style.left = '524px';
      ghost.style.top = '400px';
      ghost.style.transform = 'scale(1.25) rotate(-3deg)';
      setTimeout(() => ghost.classList.add('gone'), 650);
      setTimeout(() => ghost.remove(), 1000);
    }

    async function present(id, btn) {
      if (locked || HA.ui.isTalking()) return;
      if (!weakFound) {
        HA.audio.play('click');
        ttl.classList.remove('blink');
        void ttl.offsetWidth;
        ttl.classList.add('blink');
        return;
      }
      locked = true;
      const s = stage();
      fly(btn);
      HA.audio.play('page');
      await sleep(650);
      const r = s.responses[id] || { result: 'miss', text: s.missDefault, mood: -15 };
      if (r.result === 'win') return next(s.win);
      btn.classList.remove('played');
      btn.classList.add('nope');
      HA.audio.play(r.result === 'partial' ? 'click' : 'wrong');
      setMood(r.mood != null ? r.mood : r.result === 'partial' ? -5 : -15);
      face(r.result === 'partial' ? 'serious' : 'proud');
      say(r.text, r.result === 'partial' ? 'partial' : 'laugh');
      setTimeout(() => btn.classList.remove('nope'), 450);
      if (!(await checkBreak())) {
        locked = false;
        return;
      }
      claimBubble(s);
      locked = false;
    }

    async function proposeDeal(s) {
      if (locked || HA.ui.isTalking()) return;
      locked = true;
      const picks = s.columns.map((col, ci) => col.options.find((o) => o.id === dealPick[ci]));
      const bad = picks.find((o) => !o.ok);
      if (!bad) return next(s.win);
      HA.audio.play('wrong');
      setMood(bad.mood != null ? bad.mood : -15);
      if (bad.who === cfg.right) say(bad.react, 'laugh');
      else await g.say([{ who: bad.who, text: bad.react }]);
      await checkBreak();
      locked = false;
    }

    root.querySelector('.db-withdraw').onclick = async () => {
      if (HA.ui.isTalking()) return;
      HA.audio.play('click');
      resolve('withdraw');
    };

    setMood(0);
    rope();
    (async () => {
      await g.say(idx > 0 && cfg.resumeIntro ? cfg.resumeIntro : cfg.intro);
      show();
    })();
  });
};
