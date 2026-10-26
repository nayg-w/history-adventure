/* 퍼즐 ③ 흥화진 전술 퍼즐 (게임을 위한 가상 전술 퍼즐)
   1) 배치: 둑과 숨은 기병을 지도 위 후보 자리에 끌어다 놓는다(또는 눌러서 놓기).
      놓는 순간 물길·병력의 모습이 바로 바뀐다(관찰).
   2) 실행: '작전 개시'를 누르면 거란군이 내려온다. 적이 어디쯤 왔는지 보고 직접 '둑 터뜨리기'.
      결과(성공·실패)는 물과 병력의 움직임으로 화면에 나타나고, 배치는 그대로 둔 채 바로 다시 할 수 있다.
   cfg: { goal, caption, bg(), river, intro[], note, tokens[{id,type,icon,label}],
          spots[{id,type,x,y,label,ok,preview,tag,fail}], release{early,late,missed}, hints[], success[] } */
HA.puzzles.battlePlan = function (cfg, g) {
  const { h, esc, sleep } = HA.util;
  return new Promise((resolve) => {
    const root = HA.ui.openOverlay('pz-plan');
    const ENEMY = [[560, 0], [640, 26], [720, 0], [600, -56], [690, -50]];
    const rider = (x, y, color, flag, facing, cls) =>
      `<g class="${cls}" transform="translate(${x} ${y})"><g class="body"><g transform="scale(1.3)">${HA.art.rider(color, flag, facing)}</g></g>
       <text class="mark" y="-70" text-anchor="middle" font-size="34" font-weight="900"></text></g>`;
    root.innerHTML = `
      <div class="pz-bg">${cfg.bg()}</div>
      <svg class="dam-svg" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="planRiver"><path d="${cfg.river}"/></clipPath>
          <linearGradient id="pwave" x1="0" x2="1"><stop offset="0" stop-color="#2f6f9a" stop-opacity="0"/><stop offset=".6" stop-color="#2f6f9a"/><stop offset="1" stop-color="#dff1fb"/></linearGradient></defs>
        <ellipse class="flood" cx="620" cy="380" rx="330" ry="120" fill="#3d82b0"/>
        <g clip-path="url(#planRiver)">
          <rect class="w-up" x="0" y="280" width="232" height="200" fill="#4f93bf"/>
          <rect class="w-down" x="232" y="280" width="1048" height="200" fill="#4f93bf"/>
          <g class="flow" fill="none" stroke="#d6ecf7" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".9">
            ${[90, 330, 470, 900, 1060, 1200].map((x) => `<path d="M${x} 360 l14 12 l-14 12"/>`).join('')}
          </g>
          <rect class="pwave" x="-500" y="280" width="500" height="200" fill="url(#pwave)"/>
        </g>
        <path class="trib" d="M770 96 Q786 160 796 220 Q806 280 846 326" stroke="#4f93bf" stroke-width="16" fill="none" stroke-linecap="round"/>
        <path class="far-path" d="" />
        <g class="dam-mark"></g>
        <g class="splash"></g>
        <g class="ally">${[[0, 0], [50, 26], [100, 0]].map(([x, y]) => rider(x, y, '#2f5d8a', '#b8352a', 1, 'ar')).join('')}</g>
        <g class="enemy">${ENEMY.map(([x, y]) => rider(x, y, '#6b3f22', '#d9c3a0', -1, 'er')).join('')}</g>
      </svg>
      <div class="plan-spots"></div>
      <div class="plan-tags"></div>
      <div class="plan-badge">🎲 게임을 위한 가상 전술 퍼즐</div>
      <aside class="plan-panel">
        <h3>흥화진 작전도</h3>
        <p class="plan-note">${esc(cfg.note)}</p>
        <div class="plan-tokens"></div>
        <div class="plan-gauge" hidden><span>거란군 위치</span><div class="track"><i class="zone"></i><b class="dot"></b></div><small><em>강 앞</em><em>냇바닥</em><em>건넘</em></small></div>
        <button class="btn primary plan-go" disabled>⚔ 작전 개시</button>
        <button class="btn primary plan-blast" hidden>💥 둑 터뜨리기!</button>
        <p class="plan-fb" aria-live="polite"></p>
      </aside>
      <div class="plan-result" hidden></div>`;
    const $ = (s) => root.querySelector(s);
    const spotsEl = $('.plan-spots');
    const tagsEl = $('.plan-tags');
    const tokEl = $('.plan-tokens');
    const fb = $('.plan-fb');
    const go = $('.plan-go');
    const blast = $('.plan-blast');
    const enemy = $('.enemy');
    const ally = $('.ally');
    const gauge = $('.plan-gauge');
    const place = {}; // 놓을 것 id -> 자리 id
    let sel = null;
    let running = false;
    let fails = 0;
    let hl = 0;
    let raf = null;
    let ey = -220; // 거란군 무리의 세로 위치(이동량)
    let phaseEnd = null;
    root._cleanup = () => cancelAnimationFrame(raf);

    g.puzzleHint = () => cfg.hints[Math.min(hl++, cfg.hints.length - 1)];
    const say = (t, cls = '') => {
      fb.className = 'plan-fb ' + cls;
      fb.textContent = t;
    };
    const spot = (id) => cfg.spots.find((s) => s.id === id);
    const tokenOf = (id) => cfg.tokens.find((t) => t.id === id);

    /* ---------- 배치와 미리보기 ---------- */
    function render() {
      tokEl.innerHTML = '';
      cfg.tokens.forEach((t) => {
        const b = h(`<button class="plan-token ${sel === t.id ? 'sel' : ''} ${place[t.id] ? 'placed' : ''}" data-id="${t.id}" aria-pressed="${sel === t.id}">
          <span class="ico">${t.icon}</span><span>${esc(t.label)}${place[t.id] ? ' ✓' : ''}</span><small>${place[t.id] ? '옮기려면 다시 끌어요' : '끌어서 지도에 놓기'}</small></button>`);
        bindDrag(b, t.id);
        tokEl.appendChild(b);
      });
      spotsEl.innerHTML = '';
      cfg.spots.forEach((s) => {
        const who = Object.keys(place).find((k) => place[k] === s.id);
        const tk = who && tokenOf(who);
        const can = sel && tokenOf(sel).type === s.type;
        const b = h(`<button class="plan-spot type-${s.type} ${tk ? 'has' : ''} ${can ? 'can' : ''}" data-spot="${s.id}"
          style="left:${s.x}px;top:${s.y}px" aria-label="${esc(s.label)}">${tk ? tk.icon : ''}<small>${esc(s.label)}</small></button>`);
        b.onclick = () => sel && drop(sel, s);
        spotsEl.appendChild(b);
      });
      go.disabled = running || !cfg.tokens.every((t) => place[t.id]);
      preview();
    }

    /** 놓자마자 바뀌는 모습: 물길(마름·불어남·그대로)과 기병(숨음·드러남·멀다) */
    function preview() {
      root.classList.remove('pv-dry', 'pv-flood', 'pv-trib');
      const d = spot(place.dam);
      if (d) root.classList.add('pv-' + d.preview);
      $('.dam-mark').innerHTML = d
        ? `<g transform="translate(${d.x} ${d.y})"><g class="dam-pop"><path d="M0 -${d.preview === 'trib' ? 22 : 56} Q14 0 0 ${d.preview === 'trib' ? 22 : 56}" stroke="#7b4a2b" stroke-width="18" fill="none" stroke-linecap="round"/></g></g>`
        : '';
      const a = spot(place.ambush);
      ally.style.transition = 'none';
      ally.style.transform = a ? `translate(${a.x - 50}px, ${a.y - 10}px)` : 'translate(-400px, 600px)';
      ally.classList.toggle('in-forest', !!a && a.preview === 'hidden');
      ally.style.opacity = a ? '' : '0';
      $('.far-path').setAttribute('d', a && a.preview === 'far' ? `M${a.x} ${a.y} Q${(a.x + 640) / 2} ${a.y + 60} 640 470` : '');
      tagsEl.innerHTML = [d, a]
        .filter(Boolean)
        .map((s) => `<span class="pv-tag ${s.preview}" style="left:${s.x}px;top:${s.y + 52}px">${esc(s.tag)}</span>`)
        .join('');
    }

    function drop(tokenId, s) {
      if (running) return;
      const tk = tokenOf(tokenId);
      if (tk.type !== s.type) {
        HA.audio.play('wrong');
        return say(`이 자리는 '${cfg.tokens.find((t) => t.type === s.type).label}'을(를) 놓는 자리예요.`, 'bad');
      }
      HA.audio.play(tk.type === 'dam' ? 'water' : 'click');
      place[tokenId] = s.id;
      sel = null;
      say('');
      render();
    }

    /** 놓을 것을 끌어다 놓기 (마우스·터치) — 누르기만 하면 '고르기' */
    function bindDrag(btn, id) {
      let start = null;
      let ghost = null;
      btn.addEventListener('pointerdown', (e) => {
        if (running) return;
        start = { x: e.clientX, y: e.clientY };
        btn.setPointerCapture(e.pointerId);
      });
      btn.addEventListener('pointermove', (e) => {
        if (!start) return;
        if (!ghost && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 8) {
          ghost = h(`<div class="drag-ghost">${tokenOf(id).icon}</div>`);
          document.getElementById('stage').appendChild(ghost);
          sel = id;
          spotsEl.querySelectorAll('.plan-spot').forEach((b) => b.classList.toggle('can', spot(b.dataset.spot).type === tokenOf(id).type));
        }
        if (ghost) {
          const p = HA.util.toStage(e.clientX, e.clientY);
          ghost.style.left = p.x + 'px';
          ghost.style.top = p.y + 'px';
        }
      });
      btn.addEventListener('pointerup', (e) => {
        if (!start) return;
        start = null;
        if (!ghost) return;
        ghost.remove();
        ghost = null;
        btn._skip = true;
        const p = HA.util.toStage(e.clientX, e.clientY);
        const near = cfg.spots
          .map((s) => ({ s, d: Math.hypot(s.x - p.x, s.y - p.y) }))
          .sort((a, b) => a.d - b.d)[0];
        if (near && near.d < 70) drop(id, near.s);
        else {
          sel = null;
          render();
          say('동그라미 자리 위에 놓아야 해요.');
        }
      });
      btn.addEventListener('pointercancel', () => {
        start = null;
        if (ghost) ghost.remove();
        ghost = null;
      });
      btn.addEventListener('click', () => {
        if (btn._skip) return (btn._skip = false);
        if (running) return;
        HA.audio.play('click');
        sel = sel === id ? null : id;
        render();
        if (sel) say('지도에서 빛나는 동그라미를 눌러 놓아요.');
      });
    }

    /* ---------- 실행 ---------- */
    const marks = (t) => enemy.querySelectorAll('.mark').forEach((m) => (m.textContent = t));
    const setEnemy = (y) => {
      ey = y;
      enemy.style.transform = `translate(0px, ${y}px)`;
      // 게이지: -220(멀리) ~ 560(다 건넘)
      $('.dot').style.left = Math.max(0, Math.min(100, ((y + 220) / 780) * 100)) + '%';
    };
    // 냇바닥(강 한가운데)을 지나는 구간: 이때 터뜨리면 성공
    const inRiver = () => ey >= cfg.release.from && ey <= cfg.release.to;

    function march(stopAt, onDone) {
      let last = performance.now();
      const step = (now) => {
        const dt = Math.min(50, now - last) / 1000;
        last = now;
        const slow = ey > 120 && ey < 440; // 물가와 냇바닥에서는 천천히
        setEnemy(Math.min(stopAt, ey + (slow ? 62 : 150) * dt));
        if (ey >= stopAt) return onDone();
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }

    function resetScene() {
      cancelAnimationFrame(raf);
      root.classList.remove('released', 'blocked');
      enemy.querySelectorAll('.er').forEach((r) => r.classList.remove('tumble', 'turn'));
      ally.querySelectorAll('.ar').forEach((r) => r.classList.remove('charge'));
      ally.classList.remove('charging', 'late');
      marks('');
      enemy.style.transition = 'none';
      enemy.style.opacity = '1';
      setEnemy(-220);
      $('.splash').innerHTML = '';
      preview();
    }

    async function finish(ok, text) {
      cancelAnimationFrame(raf);
      blast.hidden = true;
      if (ok) {
        HA.audio.play('win');
        $('.plan-result').hidden = false;
        $('.plan-result').innerHTML = `<div class="pr-card good"><b>🎉 흥화진 작전 성공!</b><small>※ 게임을 위한 가상 전술 퍼즐이에요</small></div>`;
        await sleep(1600);
        await g.say(cfg.success);
        return resolve();
      }
      fails++;
      HA.audio.play('wrong');
      $('.plan-result').hidden = false;
      $('.plan-result').innerHTML = `<div class="pr-card bad"><b>작전 실패</b><p>${esc(text)}</p>
        <button class="btn primary pr-retry">🔁 배치 고쳐서 다시 하기</button></div>`;
      $('.pr-retry').onclick = () => {
        HA.audio.play('click');
        $('.plan-result').hidden = true;
        running = false;
        gauge.hidden = true;
        go.hidden = false;
        resetScene();
        render();
        say(fails >= 2 ? '💡 막히면 힌트를 눌러 보세요. 물이 흐르는 방향(>)을 잘 보세요!' : '배치를 바꿔 보거나, 둑을 터뜨리는 때를 바꿔 봐요.');
      };
      $('.pr-retry').focus();
    }

    go.onclick = () => {
      if (running) return;
      running = true;
      render();
      go.hidden = true;
      gauge.hidden = false;
      const d = spot(place.dam);
      const a = spot(place.ambush);
      say('거란군이 내려와요! 적의 위치를 보고 알맞을 때 둑을 터뜨려요.');
      resetScene();
      HA.audio.play('click');
      // 숨지 못한 기병: 적이 다가오다 발견하고 멈춘다
      if (a.preview === 'seen') {
        return march(150, async () => {
          marks('!');
          enemy.querySelectorAll('.er').forEach((r) => r.classList.add('turn'));
          await sleep(1100);
          finish(false, a.fail);
        });
      }
      // 여울이 깊어진 경우: 물가에서 멈칫하고 건너지 않는다
      if (d.preview === 'flood') {
        return march(180, async () => {
          marks('?');
          root.classList.add('blocked');
          await sleep(1300);
          finish(false, d.fail);
        });
      }
      blast.hidden = false;
      blast.disabled = false;
      march(cfg.release.lateAt, () => onBlast(true));
    };

    async function onBlast(auto) {
      if (!running || blast.disabled) return;
      blast.disabled = true;
      cancelAnimationFrame(raf);
      const d = spot(place.dam);
      const a = spot(place.ambush);
      if (auto) {
        // 아무도 터뜨리지 않은 채 다 건넘
        root.classList.add('released');
        HA.audio.play('water');
        await sleep(1000);
        return finish(false, cfg.release.late);
      }
      root.classList.add('released');
      HA.audio.play('water');
      if (d.preview === 'trib') {
        await sleep(1000);
        return finish(false, d.fail);
      }
      if (!inRiver()) {
        await sleep(900);
        if (ey < cfg.release.from) {
          marks('…');
          root.classList.add('blocked');
          await sleep(900);
          return finish(false, cfg.release.early);
        }
        return finish(false, cfg.release.late);
      }
      // 적중: 기수들이 물살에 휩쓸린다
      $('.splash').innerHTML = ENEMY.map(([x, y], i) => `<circle class="drop" style="--i:${i}" cx="${x}" cy="${y + ey}" r="10" fill="#dff1fb"/>`).join('');
      enemy.querySelectorAll('.er').forEach((r, i) => {
        r.style.setProperty('--dx', 260 + i * 40 + 'px');
        r.style.setProperty('--rot', (i % 2 ? -1 : 1) * (40 + i * 12) + 'deg');
        r.classList.add('tumble');
      });
      await sleep(900);
      if (a.preview === 'far') {
        ally.classList.add('late');
        await sleep(1600);
        enemy.querySelectorAll('.er').forEach((r) => r.classList.remove('tumble'));
        marks('💢');
        await sleep(700);
        return finish(false, a.fail);
      }
      ally.classList.add('charging');
      ally.style.transition = 'transform 1.1s ease-in';
      ally.style.transform = `translate(${560}px, ${330}px)`;
      enemy.style.transition = 'opacity 1s .6s';
      enemy.style.opacity = '0';
      await sleep(1400);
      finish(true);
    }
    blast.onclick = () => onBlast(false);

    // 게이지에 냇바닥 구간 표시 (강 앞 ~ 건넘 사이)
    const zone = $('.zone');
    zone.style.left = ((250 + 220) / 780) * 100 + '%';
    zone.style.width = ((450 - 250) / 780) * 100 + '%';
    resetScene();
    render();
    (async () => {
      await g.say(cfg.intro);
      say('🛡️·🐎를 끌어서 지도 위 동그라미에 놓아요. 놓으면 바로 어떻게 바뀌는지 볼 수 있어요.');
    })();
  });
};
