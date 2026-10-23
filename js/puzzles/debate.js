/* 퍼즐 ① 담판 — 상대의 주장에 맞서 수첩의 단서 카드를 내민다.
   cfg: { goal, bg(), left, right, leftFig(), rightFig(), intro[], rounds[{claim, answer, success[], wrong{}, hints[]}], outro[] } */
HA.puzzles.debate = function (cfg, g) {
  const { h, esc, sleep } = HA.util;
  return new Promise((resolve) => {
    const root = HA.ui.openOverlay('pz-debate');
    root.innerHTML = `
      <div class="pz-bg">${cfg.bg()}</div>
      <div class="db-fig left">${cfg.leftFig()}</div>
      <div class="db-fig right">${cfg.rightFig()}</div>
      <div class="db-bubble" aria-live="polite"></div>
      <div class="db-meter" aria-label="설득 정도"><span>설득</span><div class="bar"><i></i></div></div>
      <div class="db-hand">
        <div class="db-hand-title">📖 수첩에서 <b>반박할 단서</b>를 골라 내밀어요</div>
        <div class="cards"></div>
      </div>`;
    const bubble = root.querySelector('.db-bubble');
    const cardsEl = root.querySelector('.cards');
    const bar = root.querySelector('.bar i');
    let round = 0;
    let wrongs = 0;
    let hintLevel = 0;
    let locked = true;

    g.puzzleHint = () => {
      const r = cfg.rounds[round];
      if (!r) return null;
      const t = r.hints[Math.min(hintLevel, r.hints.length - 1)];
      hintLevel++;
      return t;
    };

    function claimBubble(text, cls = '') {
      bubble.className = 'db-bubble on ' + cls;
      bubble.innerHTML = `<b>${esc(g.ep.characters[cfg.right].name)}</b><p>${esc(text)}</p>`;
    }

    function renderCards() {
      cardsEl.innerHTML = '';
      g.st.clues.forEach((id) => {
        const c = g.ep.clues[id];
        const b = h(`<button class="clue-card" data-id="${id}"><span class="ico">${c.icon}</span><b>${esc(c.title)}</b><small>${esc(c.short || '')}</small></button>`);
        b.onclick = () => present(id, b);
        cardsEl.appendChild(b);
      });
    }

    async function showRound() {
      const r = cfg.rounds[round];
      hintLevel = 0;
      wrongs = 0;
      claimBubble(r.claim);
      renderCards();
      locked = false;
    }

    async function present(id, btn) {
      if (locked || HA.ui.isTalking()) return;
      locked = true;
      const r = cfg.rounds[round];
      btn.classList.add('played');
      await sleep(350);
      if (id === r.answer) {
        HA.audio.play('good');
        bubble.className = 'db-bubble on shaken';
        await g.say(r.success);
        round++;
        bar.style.width = (round / cfg.rounds.length) * 100 + '%';
        if (round < cfg.rounds.length) {
          await showRound();
        } else {
          bubble.className = 'db-bubble';
          await g.say(cfg.outro);
          resolve();
        }
      } else {
        HA.audio.play('wrong');
        wrongs++;
        btn.classList.remove('played');
        btn.classList.add('nope');
        claimBubble((r.wrong && r.wrong[id]) || r.wrongDefault || '그것으로는 나를 설득할 수 없소!', 'laugh');
        await sleep(1700);
        btn.classList.remove('nope');
        claimBubble(r.claim);
        if (wrongs === 2) {
          await g.say([{ who: 'pili', text: r.hints[0] }]);
          hintLevel = 1;
        }
        locked = false;
      }
    }

    (async () => {
      await g.say(cfg.intro);
      await showRound();
    })();
  });
};
