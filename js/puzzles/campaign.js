/* 퍼즐 ④ 3차 침입 작전 — 세 단계의 상황 판단.
   A. 정보 카드를 읽고 적의 다음 행동을 예측한다.
   B. 지도에서 기다릴 곳(길목)을 고른다.
   C. 결전: 바람과 지원군 상황을 살피며 '기다릴지, 공격할지' 판단한다. 너무 오래 기다리면 적이 빠져나간다.
   틀리면 정답을 알려 주지 않고, 정보에 비추어 왜 어려운지 되짚어 준다. 진행 단계는 저장된다.
   cfg: { goal, caption, saveKey, mapBase(), castles[], routeDown, routeBack, A{}, B{}, C{}, hints{A,B,C} } */
HA.puzzles.campaign = function (cfg, g) {
  const { h, esc, sleep } = HA.util;
  return new Promise((resolve) => {
    const root = HA.ui.openOverlay('pz-campaign');
    let phase = g.st.flags[cfg.saveKey] || 0;
    let hl = 0;
    g.puzzleHint = () => {
      const hs = cfg.hints['ABC'[phase]];
      return hs[Math.min(hl++, hs.length - 1)];
    };
    const setPhase = (p) => {
      phase = p;
      hl = 0;
      g.setFlag(cfg.saveKey, p);
    };

    function mapView(extra) {
      const castles = cfg.castles
        .map((c) => `<g transform="translate(${c.x} ${c.y})"><circle r="11" fill="#8e2a22" stroke="#f3d27a" stroke-width="3"/>
          <text y="-15" text-anchor="middle" font-size="14" font-weight="800" fill="#3b2a1a" stroke="#f6ecd6" stroke-width="4" paint-order="stroke">${esc(c.label)}</text></g>`)
        .join('');
      return `<div class="map-wrap"><svg class="map-svg" viewBox="0 0 800 640" xmlns="http://www.w3.org/2000/svg">
        ${cfg.mapBase()}${castles}
        <path class="route down" d="${cfg.routeDown}"/>
        ${extra || ''}
      </svg><div class="map-targets"></div></div>`;
    }

    /* 지도 위 이동 표시: 경로를 따라 말(거란군·고려군)을 옮긴다 */
    function pathPoint(svgEl, d, f) {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', d);
      p.style.visibility = 'hidden';
      svgEl.appendChild(p);
      const pt = p.getPointAtLength(p.getTotalLength() * f);
      p.remove();
      return pt;
    }
    function moveMarker(m, pt) {
      m.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
    }
    const marker = (cls, label) => `<g class="mk ${cls}"><circle r="16"/><text y="6" text-anchor="middle">${label}</text></g>`;

    /* ---------- A. 예측: 소식이 하나씩 들어오고, 적이 지도 위에서 움직인다 ---------- */
    function phaseA() {
      const A = cfg.A;
      let shown = 1;
      root.innerHTML = `${mapView(`<path class="route trail" d=""/>${marker('enemy', '거')}<g class="whatif"></g>`)}
        <aside class="map-side camp-side">
          <h3>${esc(A.title)}</h3>
          <p class="q">${esc(A.question)}</p>
          <div class="intel"></div>
          <button class="btn tiny next-news">⏩ 다음 소식 받기</button>
          <div class="opts">${A.options.map((o) => `<button class="db-choice" data-id="${o.id}">${esc(o.text)}</button>`).join('')}</div>
        </aside>`;
      const svgEl = root.querySelector('.map-svg');
      const enemyMk = root.querySelector('.mk.enemy');
      const intelEl = root.querySelector('.intel');
      const nextBtn = root.querySelector('.next-news');
      root.querySelector('.route.down').classList.add('ghost');
      function renderIntel() {
        intelEl.innerHTML = A.intel
          .slice(0, shown)
          .map((c, i) => `<article class="intel-card ${i === shown - 1 ? 'new' : ''}"><span>${c.icon}</span><div><b>${esc(c.title)}</b><p>${esc(c.text)}</p></div></article>`)
          .join('');
        const f = A.progress[shown - 1];
        moveMarker(enemyMk, pathPoint(svgEl, cfg.routeDown, f));
        root.querySelector('.route.trail').setAttribute('d', cfg.routeDown);
        root.querySelector('.route.trail').style.strokeDasharray = `${f * 600} 2000`;
        nextBtn.hidden = shown >= A.intel.length;
      }
      nextBtn.onclick = () => {
        HA.audio.play('page');
        shown++;
        renderIntel();
      };
      /** '만약에' 장면: 잘못된 예측이 어떻게 될지 지도 위에 짧게 보여 준다 (게임 속 상상) */
      async function whatIf(o) {
        const w = root.querySelector('.whatif');
        const end = pathPoint(svgEl, cfg.routeDown, 1);
        if (o.id === 'siege') {
          w.innerHTML = `<g transform="translate(${end.x} ${end.y})"><circle class="siege-ring" r="34"/><text class="food" y="-30" text-anchor="middle">🍚</text></g>`;
        } else {
          w.innerHTML = `<path class="cut" d="M${end.x} ${end.y} L${end.x + 60} ${end.y + 50}"/><text x="${end.x + 70}" y="${end.y + 70}" class="food">❓</text>`;
        }
        w.innerHTML += `<text x="${end.x - 150}" y="${end.y - 50}" class="whatif-label">만약에… (게임 속 상상)</text>`;
        await sleep(1300);
        w.innerHTML = '';
      }
      root.querySelectorAll('.opts button').forEach((b) => {
        b.onclick = async () => {
          if (HA.ui.isTalking()) return;
          const o = A.options.find((x) => x.id === b.dataset.id);
          if (!o.ok) {
            HA.audio.play('wrong');
            b.disabled = true;
            b.classList.add('nope');
            await whatIf(o);
            return g.say([{ who: 'gang', text: shown < A.intel.length ? o.why + ' ' + A.moreNews : o.why }]);
          }
          HA.audio.play('good');
          const early = shown < A.intel.length; // 소식을 다 보기 전에 맞힌 경우
          shown = A.intel.length;
          renderIntel();
          root.querySelector('.route.down').classList.add('back');
          await g.say(early ? [{ who: 'gang', text: A.early }, ...A.win] : A.win);
          setPhase(1);
          phaseB();
        };
      });
      renderIntel();
    }

    /* ---------- B. 길목 고르기: 고려군 깃발을 지도에 놓으면, 돌아가는 거란군의 움직임으로 결과를 보여 준다 ---------- */
    function phaseB() {
      const B = cfg.B;
      root.innerHTML = `${mapView(`<path class="route back" d="${cfg.routeBack}"/>${marker('enemy', '거')}${marker('ally', '고')}<g class="clash"></g>`)}
        <aside class="map-side camp-side">
          <h3>${esc(B.title)}</h3>
          <p class="q">${esc(B.question)}</p>
          <p class="tip">${esc(B.tip)}</p>
          <button class="army-token">🚩 고려군<small>끌어서 지도에 놓기 (또는 아래 후보 누르기)</small></button>
          <p class="map-fb" aria-live="polite"></p>
        </aside>`;
      const svgEl = root.querySelector('.map-svg');
      const enemyMk = root.querySelector('.mk.enemy');
      const allyMk = root.querySelector('.mk.ally');
      const wrap = root.querySelector('.map-targets');
      const fb = root.querySelector('.map-fb');
      const token = root.querySelector('.army-token');
      let busy = false;
      allyMk.style.opacity = '0';
      moveMarker(enemyMk, pathPoint(svgEl, cfg.routeBack, 0));
      const toMap = (cx, cy) => {
        const r = svgEl.getBoundingClientRect();
        return { x: ((cx - r.left) * 800) / r.width, y: ((cy - r.top) * 640) / r.height };
      };
      /** 놓은 곳이 어떤 자리인지 판단 */
      function classify(x, y) {
        const near = B.targets.map((t) => ({ t, d: Math.hypot(t.x - x, t.y - y) })).sort((a, b) => a.d - b.d)[0];
        if (near.d < 60) return near.t;
        if (HA.util.inPoly(x, y, cfg.khitanZone)) return B.targets.find((t) => t.id === 'beyond');
        // 돌아가는 길 가까이인지
        for (let f = 0; f <= 1.0001; f += 0.05) {
          const p = pathPoint(svgEl, cfg.routeBack, f);
          if (Math.hypot(p.x - x, p.y - y) < 45) return B.onRoute;
        }
        return B.offRoute;
      }
      async function place(x, y) {
        if (busy || HA.ui.isTalking()) return;
        busy = true;
        const t = classify(x, y);
        allyMk.style.transition = 'none';
        moveMarker(allyMk, { x, y });
        allyMk.style.opacity = '1';
        HA.audio.play('click');
        fb.className = 'map-fb';
        fb.textContent = '거란군이 돌아가기 시작해요…';
        // 거란군이 돌아가는 길을 따라 움직인다
        enemyMk.style.transition = 'none';
        moveMarker(enemyMk, pathPoint(svgEl, cfg.routeBack, 0));
        void enemyMk.getBoundingClientRect();
        enemyMk.style.transition = 'transform .18s linear';
        for (let f = 0.08; f <= (t.ok ? 0.97 : 1.0001); f += 0.08) {
          moveMarker(enemyMk, pathPoint(svgEl, cfg.routeBack, Math.min(1, f)));
          await sleep(180);
        }
        if (!t.ok) {
          // 막지 못하면 압록강을 건너 빠져나간다
          for (let f = 0.25; f <= 1.0001; f += 0.25) {
            moveMarker(enemyMk, pathPoint(svgEl, cfg.routeEscape, f));
            await sleep(180);
          }
        }
        if (t.ok) {
          HA.audio.play('good');
          root.querySelector('.clash').innerHTML = `<g transform="translate(${x} ${y})"><circle class="clash-ring" r="30"/><text y="8" text-anchor="middle" font-size="28">⚔️</text></g>`;
          fb.className = 'map-fb good';
          fb.textContent = t.why;
          await sleep(900);
          await g.say(B.win);
          setPhase(2);
          return phaseC();
        }
        HA.audio.play('wrong');
        fb.className = 'map-fb bad';
        fb.textContent = '거란군이 빠져나갔어요! ' + t.why;
        await sleep(600);
        enemyMk.style.transition = 'none';
        moveMarker(enemyMk, pathPoint(svgEl, cfg.routeBack, 0));
        busy = false;
      }
      B.targets.forEach((t) => {
        const b = h(`<button class="map-target small" style="left:${t.x * 0.95}px;top:${t.y * 0.95}px">${esc(t.label)}</button>`);
        b.onclick = () => place(t.x, t.y);
        wrap.appendChild(b);
      });
      // 끌어다 놓기
      let start = null;
      let ghost = null;
      token.addEventListener('pointerdown', (e) => {
        start = { x: e.clientX, y: e.clientY };
        token.setPointerCapture(e.pointerId);
      });
      token.addEventListener('pointermove', (e) => {
        if (!start) return;
        if (!ghost && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 8) {
          ghost = h('<div class="drag-ghost">🚩</div>');
          document.getElementById('stage').appendChild(ghost);
        }
        if (ghost) {
          const p = HA.util.toStage(e.clientX, e.clientY);
          ghost.style.left = p.x + 'px';
          ghost.style.top = p.y + 'px';
        }
      });
      token.addEventListener('pointerup', (e) => {
        if (!start) return;
        start = null;
        if (!ghost) {
          fb.textContent = '깃발을 끌어서 지도 위에 놓아 보세요. 후보 이름을 눌러도 돼요.';
          return;
        }
        ghost.remove();
        ghost = null;
        const r = svgEl.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
        const m = toMap(e.clientX, e.clientY);
        place(m.x, m.y);
      });
      token.addEventListener('pointercancel', () => {
        start = null;
        if (ghost) ghost.remove();
        ghost = null;
      });
    }

    /* ---------- C. 결전의 순간 ---------- */
    function phaseC() {
      const C = cfg.C;
      let t = 0;
      const riders = (color, flag, pos, f) => pos.map(([x, y]) => `<g transform="translate(${x} ${y}) scale(1.3)">${HA.art.rider(color, flag, f)}</g>`).join('');
      root.innerHTML = `<div class="pz-bg">${C.bg()}</div>
        <div class="windfield" aria-hidden="true">${'<i></i>'.repeat(16)}</div>
        <div class="rain" aria-hidden="true">${'<i></i>'.repeat(30)}</div>
        <svg class="dam-svg" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
          <g class="enemy-army">${riders('#6b3f22', '#d9c3a0', [[300, 200], [380, 220], [460, 200], [540, 220], [620, 200], [340, 260], [500, 262], [580, 258]], -1)}</g>
          <g class="ally-army">${riders('#2f5d8a', '#b8352a', [[320, 520], [400, 540], [480, 520], [560, 540], [640, 520]], 1)}</g>
          <g class="reinforce">${riders('#2f5d8a', '#e8c55a', [[-60, 470], [-10, 500], [40, 470]], 1)}<text x="0" y="430" font-size="18" font-weight="800" fill="#2f5d8a">지원군</text></g>
          <g class="gflag" transform="translate(720 470)"><path d="M0 60 V-40" stroke="#5a4030" stroke-width="5"/><path class="cloth" d="M2 -38 L52 -26 L2 -14 Z" fill="#b8352a"/></g>
        </svg>
        <aside class="battle-panel">
          <h3>${esc(C.title)}</h3>
          <div class="gauge"><div class="vane"><span class="arr">↓</span></div><div><b class="wind-name"></b><p class="wind-desc"></p></div></div>
          <div class="time"><span>거란군이 빠져나가기까지</span><div class="pips"></div></div>
          <p class="battle-log" aria-live="polite"></p>
          <div class="row"><button class="btn battle-wait">⏳ 지켜본다</button><button class="btn primary battle-go">⚔ 총공격!</button></div>
          <p class="note">${esc(C.note)}</p>
        </aside>`;
      const log = root.querySelector('.battle-log');
      const enemy = root.querySelector('.enemy-army');
      function draw() {
        const w = C.winds[t];
        const info = C.windInfo[w];
        root.dataset.wind = w;
        root.querySelector('.wind-name').textContent = info.name;
        root.querySelector('.wind-desc').textContent = info.desc;
        root.querySelector('.arr').textContent = info.arrow;
        root.querySelector('.pips').innerHTML = C.winds.map((_, i) => `<i class="${i < C.winds.length - t ? 'on' : ''}"></i>`).join('');
        enemy.style.transform = `translate(0px, ${-t * 22}px)`;
        root.classList.toggle('reinforced', t >= C.reinforceAt);
      }
      async function advance(msg) {
        t++;
        if (t >= C.winds.length) {
          HA.audio.play('wrong');
          await g.say(C.escape);
          t = 0;
          log.textContent = C.restart;
        } else log.textContent = msg || C.turnLog[t] || '';
        draw();
      }
      root.querySelector('.battle-wait').onclick = async () => {
        if (HA.ui.isTalking()) return;
        HA.audio.play('click');
        await advance();
      };
      root.querySelector('.battle-go').onclick = async () => {
        if (HA.ui.isTalking()) return;
        const w = C.winds[t];
        if (w === C.goodWind) {
          root.classList.add('go');
          HA.audio.play('good');
          await sleep(1600);
          root.appendChild(h(`<div class="sig-banner"><b>${esc(C.banner.title)}</b><small>${esc(C.banner.sub)}</small></div>`));
          await sleep(50);
          root.classList.add('banner-on');
          HA.audio.play('win');
          await sleep(1600);
          await g.say(C.win);
          return resolve();
        }
        HA.audio.play('wrong');
        root.classList.add('repulsed');
        setTimeout(() => root.classList.remove('repulsed'), 900);
        await g.say([{ who: 'gang', text: C.early[w] }]);
        await advance(C.afterFail);
      };
      draw();
      log.textContent = C.turnLog[0];
      g.say(C.intro);
    }

    (async () => {
      if (phase === 0) {
        await g.say(cfg.intro);
        phaseA();
      } else if (phase === 1) phaseB();
      else phaseC();
    })();
  });
};
