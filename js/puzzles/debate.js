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

    const stage = () => cfg.stages[idx];
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
      bubble.className = 'db-bubble';
      await g.say(winLines);
      idx++;
      hintLevel = 0;
      g.setFlag(cfg.saveKey, idx);
      if (idx >= cfg.stages.length) {
        if (!usedHints && !broke) g.setFlag('medal_' + cfg.saveKey);
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
        say(s.claim);
        ttl.innerHTML = '📖 반박할 <b>단서</b>나 <b>추론 카드</b>를 내밀어요';
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
              propose.disabled = Object.keys(dealPick).length < s.columns.length;
            };
            c.appendChild(b);
          });
          wrap.appendChild(c);
        });
        const propose = h('<button class="btn primary deal-go" disabled>제안하기</button>');
        propose.onclick = () => proposeDeal(s);
        wrap.appendChild(propose);
        body.appendChild(wrap);
      }
    }

    function renderCards() {
      if (stage().type !== 'claim') return;
      body.innerHTML = '';
      const cards = h('<div class="cards"></div>');
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

    async function present(id, btn) {
      if (locked || HA.ui.isTalking()) return;
      locked = true;
      const s = stage();
      btn.classList.add('played');
      await sleep(300);
      const r = s.responses[id] || { result: 'miss', text: s.missDefault, mood: -15 };
      if (r.result === 'win') return next(s.win);
      btn.classList.remove('played');
      btn.classList.add('nope');
      HA.audio.play(r.result === 'partial' ? 'click' : 'wrong');
      setMood(r.mood != null ? r.mood : r.result === 'partial' ? -5 : -15);
      say(r.text, r.result === 'partial' ? 'partial' : 'laugh');
      setTimeout(() => btn.classList.remove('nope'), 450);
      if (!(await checkBreak())) {
        locked = false;
        return;
      }
      say(s.claim);
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
    (async () => {
      await g.say(idx > 0 && cfg.resumeIntro ? cfg.resumeIntro : cfg.intro);
      show();
    })();
  });
};
