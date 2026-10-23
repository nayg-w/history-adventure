/* 퍼즐 ⑤ 원인과 결과 잇기 — 왼쪽 '왜?'와 오른쪽 '그래서'를 실로 잇는다.
   cfg: { goal, title, text, intro[], pairs[{cause, effect, explain}], hints[], success[] } */
HA.puzzles.causeLink = function (cfg, g) {
  const { h, esc, sleep, scramble } = HA.util;
  return new Promise((resolve) => {
    const root = HA.ui.openOverlay('pz-link');
    const n = cfg.pairs.length;
    const order = scramble(cfg.pairs.map((_, i) => i));
    const colors = ['#b8352a', '#2f7d6d', '#3d6b8f', '#c98a1c', '#7a4a9a', '#5a6a3a'];
    root.innerHTML = `
      <div class="paper-bg"></div>
      <header class="pz-head"><h3>${esc(cfg.title)}</h3><p>${esc(cfg.text)}</p></header>
      <div class="lk-colhead left">원인 <small>왜 그런 일이?</small></div>
      <div class="lk-colhead right">결과 <small>그래서 어떻게 됐을까?</small></div>
      <svg class="lk-svg" viewBox="0 0 1280 720"><path class="lk-rubber" d=""/></svg>
      <div class="lk-col left">${cfg.pairs.map((p, i) => `<button class="lk-node" data-side="c" data-i="${i}"><span>${esc(p.cause)}</span><i class="dot"></i></button>`).join('')}</div>
      <div class="lk-col right">${order.map((i) => `<button class="lk-node" data-side="e" data-i="${i}"><i class="dot"></i><span>${esc(cfg.pairs[i].effect)}</span></button>`).join('')}</div>
      <p class="lk-fb" aria-live="polite"></p>`;
    const svgEl = root.querySelector('.lk-svg');
    const rubber = root.querySelector('.lk-rubber');
    const fb = root.querySelector('.lk-fb');
    const done = new Set();
    let sel = null;
    let hl = 0;
    const node = (side, i) => root.querySelector(`.lk-node[data-side="${side}"][data-i="${i}"]`);
    const say = (t, cls = '') => {
      fb.className = 'lk-fb ' + cls;
      fb.textContent = t;
    };
    function anchor(el) {
      const s = document.getElementById('stage').getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const k = 1280 / s.width;
      const left = el.dataset.side === 'c';
      return { x: ((left ? r.right : r.left) - s.left) * k, y: ((r.top + r.bottom) / 2 - s.top) * k };
    }
    const curve = (a, b) => `M${a.x} ${a.y} C${a.x + 120} ${a.y} ${b.x - 120} ${b.y} ${b.x} ${b.y}`;

    function select(el) {
      root.querySelectorAll('.lk-node.sel').forEach((x) => x.classList.remove('sel'));
      sel = el;
      if (el) el.classList.add('sel');
    }

    async function tryLink(a, b) {
      select(null);
      rubber.setAttribute('d', '');
      if (!a || !b || a.dataset.side === b.dataset.side) return;
      const c = a.dataset.side === 'c' ? a : b;
      const e = a.dataset.side === 'c' ? b : a;
      const ci = +c.dataset.i;
      if (ci === +e.dataset.i) connect(ci, true);
      else {
        HA.audio.play('wrong');
        const p = h(`<svg><path class="lk-line wrong" d="${curve(anchor(c), anchor(e))}"/></svg>`).firstElementChild;
        svgEl.appendChild(p);
        say('음… 이 둘은 바로 이어지지 않아요. "왜 그렇게 되었을까?"를 생각해 봐요.', 'bad');
        await sleep(700);
        p.remove();
      }
    }

    async function connect(i, byPlayer) {
      if (done.has(i)) return;
      done.add(i);
      const c = node('c', i);
      const e = node('e', i);
      const p = h(`<svg><path class="lk-line" stroke="${colors[i % colors.length]}" d="${curve(anchor(c), anchor(e))}"/></svg>`).firstElementChild;
      svgEl.appendChild(p);
      [c, e].forEach((x) => {
        x.classList.add('done');
        x.style.setProperty('--lc', colors[i % colors.length]);
        x.disabled = true;
      });
      if (byPlayer) HA.audio.play('good');
      say('🧵 ' + cfg.pairs[i].explain, 'good');
      if (done.size === n) {
        await sleep(1600);
        HA.audio.play('win');
        await g.say(cfg.success);
        resolve();
      }
    }

    root.querySelectorAll('.lk-node').forEach((el) => {
      let start = null;
      let moved = false;
      el.addEventListener('pointerdown', (e) => {
        if (el.disabled) return;
        start = { x: e.clientX, y: e.clientY };
        moved = false;
        el.setPointerCapture(e.pointerId);
      });
      el.addEventListener('pointermove', (e) => {
        if (!start) return;
        if (!moved && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 8) {
          moved = true;
          select(el);
        }
        if (moved) rubber.setAttribute('d', `M${anchor(el).x} ${anchor(el).y} L${HA.util.toStage(e.clientX, e.clientY).x} ${HA.util.toStage(e.clientX, e.clientY).y}`);
      });
      el.addEventListener('pointerup', (e) => {
        if (!start) return;
        start = null;
        if (!moved) return;
        el._skip = true;
        const under = document.elementFromPoint(e.clientX, e.clientY);
        tryLink(el, under && under.closest('.lk-node:not([disabled])'));
      });
      el.addEventListener('pointercancel', () => {
        start = null;
        rubber.setAttribute('d', '');
      });
      el.addEventListener('click', () => {
        if (el._skip) return (el._skip = false);
        HA.audio.play('click');
        if (sel && sel !== el && sel.dataset.side !== el.dataset.side) return tryLink(sel, el);
        select(sel === el ? null : el);
        if (sel) say(sel.dataset.side === 'c' ? '이 원인 때문에 생긴 결과를 오른쪽에서 골라요.' : '이 결과가 생긴 원인을 왼쪽에서 골라요.');
      });
    });

    g.puzzleHint = () => {
      if (hl++ === 0) return cfg.hints[0];
      const i = cfg.pairs.findIndex((_, k) => !done.has(k));
      if (i < 0) return null;
      connect(i, false);
      return `실 하나를 이어 줬어요: '${cfg.pairs[i].cause}' → '${cfg.pairs[i].effect}'`;
    };

    (async () => {
      await g.say(cfg.intro);
      say('왼쪽 원인을 누른 다음, 이어지는 오른쪽 결과를 눌러요. (끌어서 이어도 돼요)');
    })();
  });
};
