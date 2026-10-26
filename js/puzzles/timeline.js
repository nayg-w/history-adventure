/* 퍼즐 ④ 시간 순서 복원 — 찢어진 기록 조각을 일어난 순서대로 놓는다. 맞은 조각은 고정되고 틀린 조각만 돌아온다.
   cfg: { goal, title, text, intro[], cards[{id,text,year,icon}] (정답 순서), hints[], success[] } */
HA.puzzles.timeline = function (cfg, g) {
  const { h, esc, sleep, scramble } = HA.util;
  return new Promise((resolve) => {
    const root = HA.ui.openOverlay('pz-timeline');
    const N = cfg.cards.length;
    root.innerHTML = `
      <div class="paper-bg"></div>
      <header class="pz-head"><h3>${esc(cfg.title)}</h3><p>${esc(cfg.text)}</p></header>
      <div class="tl-arrow" aria-hidden="true"><span>먼저</span><i></i><span>나중</span></div>
      <div class="tl-slots">${Array.from({ length: N }, (_, i) => `<div class="tl-slot" data-i="${i}" role="button" tabindex="0" aria-label="${i + 1}번째 자리"><em>${i + 1}</em></div>`).join('')}</div>
      <div class="tl-pool" aria-label="기록 조각 모음"></div>
      <div class="tl-foot"><p class="tl-fb" aria-live="polite"></p><button class="btn primary tl-check" disabled>기록 맞춰 보기</button></div>`;
    const pool = root.querySelector('.tl-pool');
    const slots = [...root.querySelectorAll('.tl-slot')];
    const fb = root.querySelector('.tl-fb');
    const checkBtn = root.querySelector('.tl-check');
    const cards = {};
    const locked = new Set();
    let sel = null;
    let hl = 0;
    let checks = 0;
    root.style.setProperty('--cw', Math.min(182, Math.floor((1200 - (N - 1) * 12) / N)) + 'px');

    scramble(cfg.cards).forEach((c) => {
      const b = h(`<button class="tl-card" data-id="${c.id}"><span class="ico">${c.icon || '📜'}</span><span class="txt">${esc(c.text)}</span><span class="yr">${esc(c.year)}</span></button>`);
      cards[c.id] = b;
      pool.appendChild(b);
      bind(b);
    });

    const say = (t, cls = '') => {
      fb.className = 'tl-fb ' + cls;
      fb.textContent = t;
    };
    const slotOf = (card) => card.closest('.tl-slot');
    const cardIn = (slot) => slot.querySelector('.tl-card');
    function update() {
      Object.values(cards).forEach((c) => c.classList.toggle('sel', sel === c));
      checkBtn.disabled = !slots.every((s) => cardIn(s));
    }

    function moveTo(card, slot) {
      if (locked.has(slot)) return;
      const from = slotOf(card);
      const there = slot ? cardIn(slot) : null;
      if (slot) slot.appendChild(card);
      else pool.appendChild(card);
      if (there && there !== card) {
        if (from) from.appendChild(there);
        else pool.appendChild(there);
      }
      HA.audio.play('click');
      sel = null;
      update();
    }

    function bind(b) {
      let start = null;
      let ghost = null;
      b.addEventListener('pointerdown', (e) => {
        if (b.classList.contains('locked')) return;
        start = { x: e.clientX, y: e.clientY };
        b.setPointerCapture(e.pointerId);
      });
      b.addEventListener('pointermove', (e) => {
        if (!start) return;
        if (!ghost && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 8) {
          ghost = b.cloneNode(true);
          ghost.classList.add('tl-ghost');
          document.getElementById('stage').appendChild(ghost);
          b.classList.add('dragging');
        }
        if (ghost) {
          const p = HA.util.toStage(e.clientX, e.clientY);
          ghost.style.left = p.x + 'px';
          ghost.style.top = p.y + 'px';
        }
      });
      b.addEventListener('pointerup', (e) => {
        if (!start) return;
        start = null;
        if (!ghost) return;
        ghost.remove();
        ghost = null;
        b.classList.remove('dragging');
        b._skip = true;
        const under = document.elementFromPoint(e.clientX, e.clientY);
        const slot = under && under.closest('.tl-slot');
        if (slot && !locked.has(slot)) moveTo(b, slot);
        else if (under && under.closest('.tl-pool')) moveTo(b, null);
      });
      b.addEventListener('pointercancel', () => {
        start = null;
        if (ghost) ghost.remove();
        ghost = null;
        b.classList.remove('dragging');
      });
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        if (b._skip) return (b._skip = false);
        if (b.classList.contains('locked')) return;
        const s = slotOf(b);
        if (sel && sel !== b && s) return moveTo(sel, s); // 다른 조각과 자리 바꾸기
        sel = sel === b ? null : b;
        HA.audio.play('click');
        update();
        if (sel) say('놓을 자리(1~' + N + '번)를 눌러 보세요.');
      });
    }

    slots.forEach((s) => {
      const act = () => {
        if (sel) moveTo(sel, s);
      };
      s.addEventListener('click', act);
      s.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          act();
        }
      });
    });
    pool.addEventListener('click', () => sel && slotOf(sel) && moveTo(sel, null));

    function lock(slot, card) {
      locked.add(slot);
      card.classList.add('locked');
      slot.classList.add('locked');
    }

    checkBtn.onclick = async () => {
      // 첫 확인에서는 몇 개가 맞았는지만 알려 준다 (어느 것인지는 비밀)
      if (cfg.countFirst && checks++ === 0) {
        const n = slots.filter((s, i) => cardIn(s) && cardIn(s).dataset.id === cfg.cards[i].id).length;
        if (n < N) {
          HA.audio.play(n ? 'click' : 'wrong');
          say(`${N}개 가운데 ${n}개가 제자리에 있어요. 어느 것인지는 비밀! 바꿔 보고 다시 확인해요. (다음 확인부터는 맞은 조각이 고정돼요)`, n ? 'good' : 'bad');
          return;
        }
      }
      let right = 0;
      const wrong = [];
      slots.forEach((s, i) => {
        if (locked.has(s)) return right++;
        const c = cardIn(s);
        if (c && c.dataset.id === cfg.cards[i].id) {
          lock(s, c);
          right++;
        } else if (c) wrong.push(c);
      });
      if (!wrong.length) {
        HA.audio.play('win');
        say('모든 조각이 제자리를 찾았어요!', 'good');
        checkBtn.disabled = true;
        await sleep(1200);
        await g.say(cfg.success);
        return resolve();
      }
      HA.audio.play(right ? 'good' : 'wrong');
      wrong.forEach((c) => c.classList.add('nope'));
      say(`${right}개가 제자리를 찾았어요! 반짝이지 않는 조각은 다시 생각해 봐요.`, right ? 'good' : 'bad');
      await sleep(600);
      wrong.forEach((c) => {
        c.classList.remove('nope');
        pool.appendChild(c);
      });
      update();
    };

    g.puzzleHint = () => {
      if (hl++ === 0) return cfg.hints[0];
      const i = slots.findIndex((s) => !locked.has(s));
      if (i < 0) return null;
      const c = cards[cfg.cards[i].id];
      const occupant = cardIn(slots[i]);
      if (occupant && occupant !== c) pool.appendChild(occupant);
      slots[i].appendChild(c);
      lock(slots[i], c);
      update();
      return `${i + 1}번째 조각을 붙여 줬어요: '${cfg.cards[i].text}'. ${cfg.hints[1] || ''}`;
    };

    (async () => {
      await g.say(cfg.intro);
      say('조각을 끌어서 놓거나, 조각을 누른 다음 자리를 눌러요.');
    })();
  });
};
