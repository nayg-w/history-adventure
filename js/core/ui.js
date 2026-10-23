/* 화면 공통 UI: 화면 맞춤, 대화창, 알림, 모달, 퍼즐 오버레이, 기록 수첩 */
HA.ui = (() => {
  const { h, esc, sleep } = HA.util;
  const $ = (id) => document.getElementById(id);
  const ui = {};

  /* ---------- 화면 크기 맞춤 (1280x720 무대를 비율 유지하며 확대/축소) ---------- */
  ui.fit = function () {
    const stage = $('stage');
    const s = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    stage.style.transform = `translate(-50%, -50%) scale(${s})`;
    document.body.classList.toggle('portrait', window.innerHeight > window.innerWidth && window.innerWidth < 900);
  };

  /* ---------- 대화창 ---------- */
  let dlgState = null; // { advance }
  ui.isTalking = () => !!dlgState;

  // 대화가 겹치면 앞의 대화가 끝난 뒤 이어서 보여 준다
  let dlgQueue = Promise.resolve();
  ui.dialogue = function (lines, chars) {
    dlgQueue = dlgQueue.then(() => showDialogue(lines, chars));
    return dlgQueue;
  };
  ui._resetDialogueQueue = () => (dlgQueue = Promise.resolve());

  function showDialogue(lines, chars) {
    const box = $('dialogue');
    return new Promise((resolve) => {
      let i = 0;
      let typing = null;
      let full = '';
      const textEl = () => box.querySelector('.dlg-text');

      function render() {
        const line = typeof lines[i] === 'string' ? { text: lines[i] } : lines[i];
        const ch = line.who && chars[line.who];
        full = line.text;
        box.innerHTML = '';
        const el = h(`
          <div class="dlg ${ch ? '' : 'narr'}" role="dialog" aria-live="polite">
            ${ch ? `<div class="dlg-portrait" style="--c:${ch.color || '#7a5230'}">${ch.portrait()}</div>` : ''}
            <div class="dlg-body">
              ${ch ? `<div class="dlg-name"><b>${esc(ch.name)}</b><span class="tag ${ch.real ? 'real' : 'fiction'}">${esc(ch.tag)}</span></div>` : ''}
              <p class="dlg-text"></p>
              <div class="dlg-next" aria-hidden="true">${i < lines.length - 1 ? '▼' : '■'}</div>
            </div>
          </div>`);
        box.appendChild(el);
        box.classList.add('on');
        // 타자 효과 (누르면 바로 전체 표시)
        let n = 0;
        clearInterval(typing);
        typing = setInterval(() => {
          n += 2;
          textEl().textContent = full.slice(0, n);
          if (n >= full.length) {
            clearInterval(typing);
            typing = null;
          }
        }, 28);
        HA.audio.play('page');
      }

      function advance() {
        if (typing) {
          clearInterval(typing);
          typing = null;
          textEl().textContent = full;
          return;
        }
        i++;
        if (i >= lines.length) {
          box.classList.remove('on');
          box.innerHTML = '';
          box.onclick = null;
          dlgState = null;
          resolve();
        } else render();
      }
      dlgState = { advance };
      box.onclick = (e) => {
        e.stopPropagation();
        advance();
      };
      render();
    });
  }
  ui.advanceDialogue = () => dlgState && dlgState.advance();
  ui._forceEndDialogue = () => (dlgState = null);

  /* ---------- 짧은 알림 ---------- */
  let toastTimer = null;
  ui.toast = function (text, kind = '') {
    const t = $('toast');
    t.innerHTML = '';
    t.appendChild(h(`<div class="toast ${kind}">${esc(text)}</div>`));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (t.innerHTML = ''), 2600);
  };

  /** 새 단서/도구를 얻었을 때 카드가 나타났다가 수첩으로 날아간다 */
  ui.gainCard = async function (obj, kind) {
    const t = $('toast');
    const card = h(`
      <div class="gain-card ${kind}">
        <div class="gain-label">${{ item: '새 도구!', insight: '추론 성공! 새 결론', secret: '숨은 기록 발견!' }[kind] || '새 단서 발견!'}</div>
        <div class="gain-icon">${obj.icon || '📜'}</div>
        <div class="gain-title">${esc(obj.title)}</div>
        ${obj.text && kind !== 'insight' ? `<p class="gain-text">${esc(obj.text)}</p><small class="gain-more">눌러서 계속 ▶</small>` : ''}
      </div>`);
    t.appendChild(card);
    HA.audio.play(kind === 'item' ? 'item' : kind === 'insight' ? 'win' : 'clue');
    if (obj.text && kind !== 'insight') {
      // 단서 내용을 읽을 시간: 누르면 바로 넘어간다
      t.classList.add('wait');
      await new Promise((res) => {
        const done = () => {
          clearTimeout(tm);
          t.removeEventListener('click', done);
          document.removeEventListener('keydown', done, true);
          res();
        };
        const tm = setTimeout(done, 9000);
        setTimeout(() => {
          t.addEventListener('click', done);
          document.addEventListener('keydown', done, true);
        }, 300);
      });
      t.classList.remove('wait');
    } else await sleep(1300);
    card.classList.add('fly');
    await sleep(550);
    card.remove();
    const nb = document.querySelector('.hud-notebook');
    if (nb) {
      nb.classList.remove('bump');
      void nb.offsetWidth;
      nb.classList.add('bump');
    }
  };

  /* ---------- 모달 ---------- */
  let modalClose = null;
  ui.isModalOpen = () => !!modalClose;
  ui.modal = function (inner, { cls = '', onClose } = {}) {
    const m = $('modal');
    m.innerHTML = '';
    const el = h(`<div class="modal-back"><div class="modal ${cls}" role="dialog" aria-modal="true">
      <button class="modal-x" aria-label="닫기">✕</button><div class="modal-inner"></div></div></div>`);
    const innerEl = el.querySelector('.modal-inner');
    if (typeof inner === 'string') innerEl.innerHTML = inner;
    else innerEl.appendChild(inner);
    m.appendChild(el);
    const close = () => {
      m.innerHTML = '';
      modalClose = null;
      onClose && onClose();
    };
    modalClose = close;
    el.querySelector('.modal-x').onclick = close;
    el.addEventListener('click', (e) => {
      if (e.target === el) close();
    });
    setTimeout(() => el.querySelector('.modal-x').focus(), 30);
    return { el: innerEl, close };
  };
  ui.closeModal = () => modalClose && modalClose();

  ui.confirm = function (text, ok = '네', cancel = '아니요') {
    return new Promise((resolve) => {
      let answered = false;
      const body = h(`<div class="confirm"><p>${esc(text)}</p><div class="row">
        <button class="btn ghost" data-v="0">${esc(cancel)}</button>
        <button class="btn primary" data-v="1">${esc(ok)}</button></div></div>`);
      const m = ui.modal(body, { cls: 'small', onClose: () => !answered && resolve(false) });
      body.querySelectorAll('button').forEach((b) => {
        b.onclick = () => {
          answered = true;
          m.close();
          resolve(b.dataset.v === '1');
        };
      });
    });
  };

  /* ---------- 퍼즐 오버레이 ---------- */
  ui.openOverlay = function (cls) {
    const o = $('overlay');
    o.innerHTML = '';
    const root = h(`<div class="pz ${cls}"></div>`);
    o.appendChild(root);
    $('stage').classList.add('in-puzzle');
    return root;
  };
  ui.closeOverlay = function () {
    const r = $('overlay').firstElementChild;
    if (r && r._cleanup) r._cleanup();
    $('overlay').innerHTML = '';
    $('stage').classList.remove('in-puzzle');
  };

  /* ---------- 화면 전환 ---------- */
  ui.fade = async function (fn, caption) {
    const f = $('fader');
    const j = caption && caption.jump;
    f.innerHTML = caption
      ? `<div class="fade-cap">${j ? `<div class="jump"><em>${esc(j.gap)}</em><ol>${j.marks
            .map((m, i) => `<li class="${i === j.marks.length - 1 ? 'now' : ''}" style="--d:${i * 0.35}s"><b>${esc(m.y)}</b><span>${esc(m.t)}</span></li>`)
            .join('')}</ol></div>` : ''}<small>${esc(caption.year || '')}</small><b>${esc(caption.place || '')}</b></div>`
      : '';
    f.classList.add('on');
    await sleep(450);
    await fn();
    await sleep(j ? 3000 : caption ? 1100 : 150);
    f.classList.remove('on');
    await sleep(400);
  };

  /* ---------- 기록 수첩 ---------- */
  ui.notebook = function (game, tab = 'clues') {
    const ep = game.ep;
    const st = game.st;
    st.newClues = 0;
    HA.store.save();
    game.refreshHud && game.refreshHud();
    const total = Object.keys(ep.clues).length;
    const insights = ep.insights || {};
    const canDeduce = !!game.addClue && Object.keys(insights).length > 0;
    const nClues = st.clues.filter((c) => ep.clues[c]).length;
    const nIns = st.clues.filter((c) => insights[c]).length;
    const secrets = ep.secrets || {};
    const root = h(`<div class="notebook">
      <div class="nb-tabs" role="tablist">
        <button role="tab" data-t="clues">단서 <small>${nClues}/${total}</small></button>
        ${canDeduce ? `<button role="tab" data-t="deduce">🧩 추론판 <small>${nIns}/${Object.keys(insights).length}</small></button>` : ''}
        <button role="tab" data-t="items">도구 <small>${st.items.length}</small></button>
        <button role="tab" data-t="people">인물</button>
        ${Object.keys(secrets).length ? `<button role="tab" data-t="secrets">숨은 기록 <small>${(st.secrets || []).length}/${Object.keys(secrets).length}</small></button>` : ''}
      </div>
      <div class="nb-page"></div>
    </div>`);
    const page = root.querySelector('.nb-page');

    function kindTag(k) {
      if (k === 'game') return '<span class="tag fiction">게임 속 설정</span>';
      if (k === 'legend') return '<span class="tag legend">전해지는 이야기</span>';
      return '<span class="tag real">실제 역사</span>';
    }
    function show(t) {
      root.querySelectorAll('.nb-tabs button').forEach((b) => b.setAttribute('aria-selected', b.dataset.t === t));
      page.innerHTML = '';
      if (t === 'clues') {
        const grid = h('<div class="nb-grid"></div>');
        st.clues.filter((id) => insights[id]).forEach((id) => {
          const c = insights[id];
          grid.appendChild(h(`<article class="nb-card insight"><div class="nb-icon">${c.icon}</div><h4>${esc(c.title)}</h4>
            <p>${esc(c.text)}</p><span class="tag insight">🧩 추론한 결론</span></article>`));
        });
        Object.entries(ep.clues).forEach(([id, c]) => {
          const got = st.clues.includes(id);
          grid.appendChild(
            h(`<article class="nb-card ${got ? '' : 'empty'}">
              ${got
                ? `<div class="nb-icon">${c.icon}</div><h4>${esc(c.title)}${c.year ? ` <em>${esc(c.year)}</em>` : ''}</h4>
                   <p>${esc(c.text)}</p>${kindTag(c.kind)}`
                : `<div class="nb-icon">❔</div><h4>아직 찾지 못한 단서</h4><p>장면을 더 살펴보세요.</p>`}
            </article>`)
          );
        });
        page.appendChild(grid);
      } else if (t === 'deduce') {
        deduceTab(page, game, () => show('deduce'));
      } else if (t === 'secrets') {
        const grid = h('<div class="nb-grid"></div>');
        Object.entries(secrets).forEach(([id, s]) => {
          const got = (st.secrets || []).includes(id);
          grid.appendChild(h(`<article class="nb-card ${got ? '' : 'empty'}"><div class="nb-icon">${got ? '✨' : '❔'}</div>
            <h4>${got ? esc(s.title) : '아직 못 찾은 숨은 기록'}</h4><p>${got ? esc(s.text) : '장면 속 작은 것들을 눌러 보세요.'}</p>
            ${got ? kindTag(s.kind) : ''}</article>`));
        });
        page.appendChild(grid);
      } else if (t === 'items') {
        if (!st.items.length) page.appendChild(h('<p class="nb-empty">가지고 있는 도구가 없어요.</p>'));
        const grid = h('<div class="nb-grid"></div>');
        st.items.forEach((id) => {
          const it = ep.items[id];
          grid.appendChild(h(`<article class="nb-card"><div class="nb-icon">${it.icon}</div><h4>${esc(it.title)}</h4><p>${esc(it.text)}</p></article>`));
        });
        page.appendChild(grid);
        page.appendChild(h('<p class="nb-tip">💡 도구는 화면 아래 도구 칸에서 골라 쓸 수 있어요. 도구끼리 합칠 수도 있어요!</p>'));
      } else {
        const grid = h('<div class="nb-grid people"></div>');
        const ids = st.met.filter((w) => ep.characters[w]);
        if (!ids.length) page.appendChild(h('<p class="nb-empty">아직 만난 인물이 없어요.</p>'));
        ids.forEach((w) => {
          const c = ep.characters[w];
          grid.appendChild(h(`<article class="nb-card person">
            <div class="nb-portrait" style="--c:${c.color}">${c.portrait()}</div>
            <h4>${esc(c.name)}</h4><span class="tag ${c.real ? 'real' : 'fiction'}">${esc(c.tag)}</span>
            <p>${esc(c.bio || '')}</p></article>`));
        });
        page.appendChild(grid);
        page.appendChild(h('<p class="nb-tip">실존 인물의 대사는 역사 기록을 바탕으로 쉽게 다시 쓴 <b>창작 대사</b>예요.</p>'));
      }
    }
    root.querySelectorAll('.nb-tabs button').forEach((b) => (b.onclick = () => (HA.audio.play('page'), show(b.dataset.t))));
    show(tab);
    ui.modal(root, { cls: 'wide' });
  };

  /** 추론판: 단서 두 개를 이어 결론을 끌어낸다. 정답 문장을 바로 보여 주지 않고, 근거를 따져 고르게 한다. */
  function deduceTab(page, game, rerender) {
    const ep = game.ep;
    const st = game.st;
    const insights = ep.insights || {};
    const pick = [];
    const owned = st.clues;
    page.appendChild(h(`<div class="ded">
      <p class="ded-intro">단서 두 개를 골라 <b>이어 보기</b>를 눌러요. 둘 사이에 연결고리가 있으면 새로운 결론을 끌어낼 수 있어요.</p>
      <div class="ded-chips"></div>
      <div class="ded-bar"><div class="ded-slot" data-s="0">단서 ①</div><span>+</span><div class="ded-slot" data-s="1">단서 ②</div>
        <button class="btn primary ded-go" disabled>이어 보기</button></div>
      <div class="ded-result" aria-live="polite"></div>
    </div>`));
    const chips = page.querySelector('.ded-chips');
    const go = page.querySelector('.ded-go');
    const res = page.querySelector('.ded-result');
    const slots = page.querySelectorAll('.ded-slot');
    owned.forEach((id) => {
      const c = game.info(id);
      const b = h(`<button class="ded-chip ${insights[id] ? 'ins' : ''}" data-id="${id}"><span>${c.icon}</span>${esc(c.title)}</button>`);
      b.onclick = () => {
        HA.audio.play('click');
        const i = pick.indexOf(id);
        if (i >= 0) pick.splice(i, 1);
        else {
          if (pick.length === 2) pick.shift();
          pick.push(id);
        }
        res.innerHTML = '';
        sync();
      };
      chips.appendChild(b);
    });
    function sync() {
      chips.querySelectorAll('.ded-chip').forEach((b) => b.classList.toggle('sel', pick.includes(b.dataset.id)));
      slots.forEach((s, i) => {
        s.textContent = pick[i] ? game.info(pick[i]).title : `단서 ${i ? '②' : '①'}`;
        s.classList.toggle('full', !!pick[i]);
      });
      go.disabled = pick.length < 2;
    }
    go.onclick = () => {
      const [a, b] = pick;
      const found = Object.entries(insights).find(([, ins]) => ins.from.includes(a) && ins.from.includes(b));
      if (!found) {
        HA.audio.play('wrong');
        const near = Object.entries(insights).some(([iid, ins]) => !owned.includes(iid) && (ins.from.includes(a) || ins.from.includes(b)));
        res.innerHTML = `<p class="ded-msg bad">${near ? '🤔 이 둘은 바로 이어지지 않아요. 하지만 둘 중 하나는 다른 단서와 짝이 될 것 같아요!' : '🤔 두 단서 사이에 연결고리가 보이지 않아요.'}</p>`;
        return;
      }
      const [iid, ins] = found;
      if (owned.includes(iid)) {
        res.innerHTML = `<p class="ded-msg">이미 끌어낸 결론이에요: <b>${esc(ins.title)}</b></p>`;
        return;
      }
      HA.audio.play('good');
      res.innerHTML = `<div class="ded-q"><p class="ded-msg good">💡 연결고리가 보여요! 두 단서를 함께 보면 무엇을 알 수 있을까요?</p><div class="ded-choices"></div><p class="ded-why"></p></div>`;
      const box = res.querySelector('.ded-choices');
      const why = res.querySelector('.ded-why');
      HA.util.shuffle(ins.choices).forEach((ch) => {
        const cb = h(`<button class="ded-choice">${esc(ch.text)}</button>`);
        cb.onclick = async () => {
          if (ch.correct) {
            box.querySelectorAll('button').forEach((x) => (x.disabled = true));
            cb.classList.add('right');
            why.className = 'ded-why good';
            why.textContent = ins.text;
            await game.addClue(iid);
            setTimeout(rerender, 900);
          } else {
            HA.audio.play('wrong');
            cb.disabled = true;
            cb.classList.add('wrong');
            why.className = 'ded-why bad';
            why.textContent = ch.why;
          }
        };
        box.appendChild(cb);
      });
    };
    sync();
  }

  return ui;
})();

/** 다른 화면으로 나갈 때 남아 있는 대화·퍼즐·모달을 모두 정리 */
HA.ui.reset = function () {
  ['dialogue', 'overlay', 'modal', 'toast', 'hud'].forEach((id) => {
    const el = document.getElementById(id);
    if (id === 'overlay' && el.firstElementChild && el.firstElementChild._cleanup) el.firstElementChild._cleanup();
    el.innerHTML = '';
    el.classList.remove('on');
    el.onclick = null;
  });
  document.getElementById('stage').classList.remove('in-puzzle');
  // 진행 중이던 대화 상태 초기화
  if (HA.ui.isTalking()) HA.ui._forceEndDialogue();
  HA.ui._resetDialogueQueue();
};
