/* 퍼즐 ③ 작전도 — 지형을 살펴 부대·도구를 놓을 자리와 시점을 정한 뒤 '작전 개시'로 결과를 확인한다.
   틀리면 무엇이 문제였는지 장면으로 보여 주고, 배치는 그대로 둔 채 고쳐서 다시 시도한다.
   cfg: { goal, caption, bg(), river, intro[], note, tokens[{id,icon,label}], spots[{id,type,x,y,label,ok,fail}],
          timing{title, options[{id,text,ok,fail}]}, hints[], success[] } */
HA.puzzles.battlePlan = function (cfg, g) {
  const { h, esc, sleep } = HA.util;
  return new Promise((resolve) => {
    const root = HA.ui.openOverlay('pz-plan');
    const riders = (color, flag, pos, facing) => pos.map(([x, y]) => `<g transform="translate(${x} ${y}) scale(1.3)">${HA.art.rider(color, flag, facing)}</g>`).join('');
    root.innerHTML = `
      <div class="pz-bg">${cfg.bg()}</div>
      <svg class="dam-svg" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="planRiver"><path d="${cfg.river}"/></clipPath>
          <linearGradient id="pwave" x1="0" x2="1"><stop offset="0" stop-color="#2f6f9a" stop-opacity="0"/><stop offset=".6" stop-color="#2f6f9a"/><stop offset="1" stop-color="#dff1fb"/></linearGradient></defs>
        <g clip-path="url(#planRiver)">
          <rect class="w-up" x="0" y="280" width="232" height="200" fill="#4f93bf"/>
          <rect class="w-down" x="232" y="280" width="1048" height="200" fill="#4f93bf"/>
          <g class="flow" fill="none" stroke="#d6ecf7" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".9">
            ${[90, 330, 470, 900, 1060, 1200].map((x) => `<path d="M${x} 360 l14 12 l-14 12"/>`).join('')}
          </g>
          <rect class="pwave" x="-500" y="280" width="500" height="200" fill="url(#pwave)"/>
        </g>
        <path class="trib" d="M770 96 Q786 160 796 220 Q806 280 846 326" stroke="#4f93bf" stroke-width="16" fill="none" stroke-linecap="round"/>
        <g class="enemy">${riders('#6b3f22', '#d9c3a0', [[560, 0], [640, 26], [720, 0], [600, -56], [690, -50]], -1)}</g>
        <g class="ally">${riders('#2f5d8a', '#b8352a', [[0, 0], [50, 26], [100, 0]], 1)}</g>
        <g class="dam-mark"></g>
      </svg>
      <div class="plan-spots"></div>
      <aside class="plan-panel">
        <h3>흥화진 작전도</h3>
        <p class="plan-note">${esc(cfg.note)}</p>
        <div class="plan-tokens"></div>
        <fieldset class="plan-timing"><legend>${esc(cfg.timing.title)}</legend>
          ${cfg.timing.options.map((o) => `<label><input type="radio" name="tm" value="${o.id}"> ${esc(o.text)}</label>`).join('')}
        </fieldset>
        <button class="btn primary plan-go" disabled>⚔ 작전 개시</button>
        <p class="plan-fb" aria-live="polite"></p>
      </aside>`;
    const $ = (s) => root.querySelector(s);
    const spotsEl = $('.plan-spots');
    const tokEl = $('.plan-tokens');
    const fb = $('.plan-fb');
    const go = $('.plan-go');
    const enemy = $('.enemy');
    const ally = $('.ally');
    const place = {}; // tokenId -> spotId
    let sel = null;
    let timing = null;
    let running = false;
    let fails = 0;
    let hl = 0;

    g.puzzleHint = () => cfg.hints[Math.min(hl++, cfg.hints.length - 1)];
    const say = (t, cls = '') => {
      fb.className = 'plan-fb ' + cls;
      fb.textContent = t;
    };

    function render() {
      tokEl.innerHTML = '';
      cfg.tokens.forEach((t) => {
        const b = h(`<button class="plan-token ${sel === t.id ? 'sel' : ''} ${place[t.id] ? 'placed' : ''}" data-id="${t.id}" aria-pressed="${sel === t.id}">
          <span class="ico">${t.icon}</span><span>${esc(t.label)}${place[t.id] ? ' ✓' : ''}</span></button>`);
        b.onclick = () => {
          if (running) return;
          HA.audio.play('click');
          sel = sel === t.id ? null : t.id;
          render();
          if (sel) say('지도에서 놓을 자리(동그라미)를 눌러요.');
        };
        tokEl.appendChild(b);
      });
      spotsEl.innerHTML = '';
      cfg.spots.forEach((s) => {
        const who = Object.keys(place).find((k) => place[k] === s.id);
        const tk = who && cfg.tokens.find((t) => t.id === who);
        const b = h(`<button class="plan-spot type-${s.type} ${tk ? 'has' : ''} ${sel && cfg.tokens.find((t) => t.id === sel).type === s.type ? 'can' : ''}"
          style="left:${s.x}px;top:${s.y}px" aria-label="${esc(s.label)}">${tk ? tk.icon : ''}<small>${esc(s.label)}</small></button>`);
        b.onclick = () => drop(s);
        spotsEl.appendChild(b);
      });
      go.disabled = running || !cfg.tokens.every((t) => place[t.id]) || !timing;
    }

    function drop(s) {
      if (running) return;
      if (!sel) return say('먼저 오른쪽에서 놓을 것을 골라요.');
      const tk = cfg.tokens.find((t) => t.id === sel);
      if (tk.type !== s.type) {
        HA.audio.play('wrong');
        return say(`이 자리는 '${cfg.tokens.find((t) => t.type === s.type).label}'을(를) 놓을 후보 자리예요.`, 'bad');
      }
      HA.audio.play('click');
      place[sel] = s.id;
      sel = null;
      say('');
      render();
    }

    root.querySelectorAll('input[name="tm"]').forEach((r) =>
      r.addEventListener('change', () => {
        timing = r.value;
        render();
      })
    );

    const spot = (id) => cfg.spots.find((s) => s.id === id);
    const pos = (el, x, y, ms, extra = '') => {
      el.style.transition = `transform ${ms}ms ease-in-out, opacity .6s`;
      el.style.transform = `translate(${x}px, ${y}px) ${extra}`;
    };

    function reset() {
      root.classList.remove('dammed', 'released', 'flooded');
      enemy.style.transition = 'none';
      enemy.style.transform = 'translate(0px, -220px)';
      enemy.style.opacity = '1';
      const a = spot(place.ambush);
      ally.style.transition = 'none';
      ally.style.transform = a ? `translate(${a.x - 50}px, ${a.y - 10}px)` : 'translate(-300px, 600px)';
      ally.style.opacity = a ? (a.ok ? '.4' : '1') : '0';
      $('.dam-mark').innerHTML = '';
    }

    go.onclick = async () => {
      running = true;
      render();
      say('작전 개시!');
      reset();
      const d = spot(place.dam);
      const a = spot(place.ambush);
      const tm = cfg.timing.options.find((o) => o.id === timing);
      $('.dam-mark').innerHTML = `<path d="M${d.x} ${d.y - 50} Q${d.x + 14} ${d.y} ${d.x} ${d.y + 50}" stroke="#7b4a2b" stroke-width="18" fill="none" stroke-linecap="round"/>`;
      void enemy.getBoundingClientRect();
      if (d.ok) root.classList.add('dammed');
      else if (d.id === cfg.floodSpot) root.classList.add('flooded');
      await sleep(900);
      // 거란군이 여울로 다가온다
      pos(enemy, 0, 200, 1600);
      await sleep(1700);
      let fail = null;
      if (!d.ok) fail = d.fail;
      else if (!a.ok) fail = a.fail;
      if (!fail) {
        if (tm.id !== 'middle') {
          if (tm.id === 'late') {
            pos(enemy, 0, 560, 1400);
            await sleep(1400);
          }
          root.classList.add('released');
          HA.audio.play('water');
          await sleep(1300);
          fail = tm.fail;
        } else {
          pos(enemy, 0, 360, 900);
          await sleep(1000);
          root.classList.add('released');
          HA.audio.play('water');
          pos(enemy, 420, 420, 1400, 'rotate(8deg)');
          enemy.style.opacity = '0';
          ally.style.opacity = '1';
          pos(ally, 520, 330, 1400);
          await sleep(1800);
          HA.audio.play('win');
          say('작전 성공!', 'good');
          await g.say(cfg.success);
          return resolve();
        }
      } else if (a && !a.ok && d.ok) {
        // 숨은 기병이 들킨 경우: 거란군이 멈춘다
        pos(enemy, 0, 150, 600);
        await sleep(700);
      }
      fails++;
      HA.audio.play('wrong');
      say('작전 실패… ' + fail, 'bad');
      await g.say([{ who: 'gang', text: fails < 2 ? '무엇이 문제였는지 살펴보고 작전도를 고쳐 보시오.' : '지형을 다시 살펴보시오. 물은 어느 쪽으로 흐르고, 적은 어디로 건너오오?' }]);
      running = false;
      reset();
      render();
    };

    reset();
    render();
    (async () => {
      await g.say(cfg.intro);
      say('놓을 것을 고른 뒤, 지도 위 동그라미를 눌러 자리를 정해요.');
    })();
  });
};
