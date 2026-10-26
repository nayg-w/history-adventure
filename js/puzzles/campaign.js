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

    /* ---------- A. 예측 ---------- */
    function phaseA() {
      const A = cfg.A;
      root.innerHTML = `${mapView()}
        <aside class="map-side camp-side">
          <h3>${esc(A.title)}</h3>
          <p class="q">${esc(A.question)}</p>
          <div class="intel">${A.intel.map((c) => `<article class="intel-card"><span>${c.icon}</span><div><b>${esc(c.title)}</b><p>${esc(c.text)}</p></div></article>`).join('')}</div>
          <div class="opts">${A.options.map((o) => `<button class="db-choice" data-id="${o.id}">${esc(o.text)}</button>`).join('')}</div>
        </aside>`;
      root.querySelectorAll('.opts button').forEach((b) => {
        b.onclick = async () => {
          if (HA.ui.isTalking()) return;
          const o = A.options.find((x) => x.id === b.dataset.id);
          if (!o.ok) {
            HA.audio.play('wrong');
            b.disabled = true;
            b.classList.add('nope');
            return g.say([{ who: 'gang', text: o.why }]);
          }
          HA.audio.play('good');
          root.querySelector('.route.down').classList.add('back');
          await g.say(A.win);
          setPhase(1);
          phaseB();
        };
      });
    }

    /* ---------- B. 길목 고르기 ---------- */
    function phaseB() {
      const B = cfg.B;
      root.innerHTML = `${mapView(`<path class="route back" d="${cfg.routeBack}"/>`)}
        <aside class="map-side camp-side">
          <h3>${esc(B.title)}</h3>
          <p class="q">${esc(B.question)}</p>
          <p class="tip">${esc(B.tip)}</p>
          <p class="map-fb" aria-live="polite"></p>
        </aside>`;
      const wrap = root.querySelector('.map-targets');
      const fb = root.querySelector('.map-fb');
      B.targets.forEach((t) => {
        const b = h(`<button class="map-target" style="left:${t.x * 0.95}px;top:${t.y * 0.95}px">${esc(t.label)}</button>`);
        b.onclick = async () => {
          if (HA.ui.isTalking()) return;
          if (!t.ok) {
            HA.audio.play('wrong');
            fb.className = 'map-fb bad';
            fb.textContent = t.why;
            b.classList.add('nope');
            setTimeout(() => b.classList.remove('nope'), 500);
            return;
          }
          HA.audio.play('good');
          b.classList.add('chosen');
          fb.className = 'map-fb good';
          fb.textContent = t.why;
          await sleep(600);
          await g.say(B.win);
          setPhase(2);
          phaseC();
        };
        wrap.appendChild(b);
      });
    }

    /* ---------- C. 결전의 순간 ---------- */
    function phaseC() {
      const C = cfg.C;
      let t = 0;
      const riders = (color, flag, pos, f) => pos.map(([x, y]) => `<g transform="translate(${x} ${y}) scale(1.3)">${HA.art.rider(color, flag, f)}</g>`).join('');
      root.innerHTML = `<div class="pz-bg">${C.bg()}</div>
        <div class="windfield" aria-hidden="true">${'<i></i>'.repeat(16)}</div>
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
