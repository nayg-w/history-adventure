/* 퍼즐 ③ 냇물 작전 — 도구로 냇물을 막고, 군사를 숨기고, 알맞은 때에 둑을 터뜨린다.
   cfg: { goal, bg(), kit{label,icon}, intro[], steps[3], msg{}, hints[], success[] } */
HA.puzzles.dam = function (cfg, g) {
  const { h, esc, sleep } = HA.util;
  const river = 'M0 316 Q320 296 640 318 T1280 312 L1280 444 Q960 462 640 440 T0 446 Z';
  return new Promise((resolve) => {
    const root = HA.ui.openOverlay('pz-dam');
    const riders = (color, flag, pos, facing) => pos.map(([x, y]) => `<g transform="translate(${x} ${y}) scale(1.5)">${HA.art.rider(color, flag, facing)}</g>`).join('');
    root.innerHTML = `
      <div class="pz-bg">${cfg.bg()}</div>
      <svg class="dam-svg" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="riverClip"><path d="${river}"/></clipPath>
          <linearGradient id="wave" x1="0" x2="1"><stop offset="0" stop-color="#2f6f9a" stop-opacity="0"/><stop offset=".6" stop-color="#2f6f9a"/><stop offset="1" stop-color="#dff1fb"/></linearGradient>
        </defs>
        <g clip-path="url(#riverClip)">
          <rect class="water-up" x="0" y="280" width="232" height="200" fill="#4f93bf"/>
          <rect class="water-down" x="232" y="280" width="1048" height="200" fill="#4f93bf"/>
          <g class="ripples" stroke="#cfe6f3" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8">
            <path d="M300 360 q20 -8 40 0 M520 390 q20 -8 40 0 M760 370 q20 -8 40 0 M980 400 q20 -8 40 0 M1160 360 q20 -8 40 0"/>
          </g>
          <rect class="wave" x="-500" y="280" width="500" height="200" fill="url(#wave)"/>
        </g>
        <ellipse class="pond" cx="110" cy="380" rx="10" ry="10" fill="#4f93bf" opacity="0"/>
        <g class="dam-wall" opacity="0">
          <path d="M226 300 Q240 380 226 460" stroke="#7b4a2b" stroke-width="22" fill="none" stroke-linecap="round"/>
          <path d="M226 310 Q240 380 226 450" stroke="#c9a46a" stroke-width="4" fill="none" stroke-dasharray="10 8"/>
        </g>
        <g class="ally">${riders('#2f5d8a', '#b8352a', [[300, 600], [350, 630], [400, 600], [450, 630]], 1)}</g>
        <g class="enemy">${riders('#6b3f22', '#d9c3a0', [[640, 0], [720, 30], [800, 0], [680, -60], [760, -50]], -1)}</g>
      </svg>
      <button class="dam-spot" aria-label="둑을 놓을 자리"><span>둑 자리</span></button>
      <button class="valley-spot" aria-label="골짜기 숲"><span>골짜기 숲</span></button>
      <aside class="dam-panel">
        <h3>강감찬의 작전</h3>
        <ol class="steps">${cfg.steps.map((s, i) => `<li data-i="${i}">${esc(s)}</li>`).join('')}</ol>
        <button class="kit-token" aria-pressed="false"><span class="ico">${cfg.kit.icon}</span><span>${esc(cfg.kit.label)}</span></button>
        <p class="dam-fb" aria-live="polite"></p>
      </aside>`;
    const $ = (s) => root.querySelector(s);
    const enemy = $('.enemy');
    const ally = $('.ally');
    const damBtn = $('.dam-spot');
    const valBtn = $('.valley-spot');
    const kit = $('.kit-token');
    const fb = $('.dam-fb');
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    root._cleanup = () => timers.forEach(clearTimeout);

    let kitSel = false;
    let dammed = false;
    let hidden = false;
    let phase = 'none';
    let finished = false;
    let hintLevel = 0;

    function say(t, cls = '') {
      fb.className = 'dam-fb ' + cls;
      fb.textContent = t;
    }
    function check(i) {
      root.querySelector(`.steps li[data-i="${i}"]`).classList.add('done');
    }
    const setEnemy = (y, ms) => {
      enemy.style.transition = `transform ${ms}ms linear, opacity .4s`;
      enemy.style.transform = `translate(0px, ${y}px)`;
    };

    g.puzzleHint = () => {
      let t;
      if (!dammed) t = cfg.hints.dam;
      else if (!hidden) t = cfg.hints.hide;
      else t = cfg.hints.release;
      hintLevel++;
      return t;
    };

    function placeDam() {
      if (dammed) return;
      dammed = true;
      kitSel = false;
      kit.remove();
      HA.audio.play('good');
      root.classList.add('dammed');
      check(0);
      say(cfg.msg.dammed, 'good');
      maybeStart();
    }
    function hide() {
      if (hidden) return;
      hidden = true;
      HA.audio.play('good');
      root.classList.add('hidden-ally');
      check(1);
      say(cfg.msg.hidden, 'good');
      maybeStart();
    }
    function maybeStart() {
      if (dammed && hidden) {
        damBtn.querySelector('span').textContent = '둑 터뜨리기!';
        damBtn.setAttribute('aria-label', '둑 터뜨리기');
        later(() => say(cfg.msg.wait), 1500);
        later(wave, 2000);
      }
    }

    // 거란군 한 무리가 내려와 냇물을 건넌다. 놓치면 다음 무리가 온다 (실패 없음)
    function wave() {
      if (finished) return;
      enemy.style.transition = 'none';
      enemy.style.transform = 'translate(0px, -200px)';
      enemy.style.opacity = '1';
      void enemy.getBoundingClientRect();
      phase = 'approach';
      setEnemy(190, 2600);
      later(() => {
        if (finished) return;
        setEnemy(370, 1300);
      }, 2600);
      later(() => {
        if (finished) return;
        phase = 'crossing';
        say(cfg.msg.now, 'now');
        root.classList.add('crossing');
      }, 3700);
      later(() => {
        if (finished) return;
        phase = 'passed';
        root.classList.remove('crossing');
        setEnemy(860, 2600);
        say(cfg.msg.missed, 'bad');
      }, 7700);
      later(wave, 10600);
    }

    async function release() {
      if (phase !== 'crossing') {
        HA.audio.play('wrong');
        say(phase === 'passed' ? cfg.msg.missed : cfg.msg.early, 'bad');
        return;
      }
      finished = true;
      timers.forEach(clearTimeout);
      check(2);
      root.classList.remove('crossing');
      root.classList.add('released');
      HA.audio.play('water');
      enemy.style.transition = 'transform 1.4s ease-in, opacity 1.4s';
      enemy.style.transform = 'translate(420px, 380px) rotate(8deg)';
      enemy.style.opacity = '0';
      say(cfg.msg.success, 'good');
      await sleep(1600);
      HA.audio.play('win');
      await sleep(600);
      await g.say(cfg.success);
      resolve();
    }

    kit.onclick = () => {
      kitSel = !kitSel;
      kit.classList.toggle('sel', kitSel);
      kit.setAttribute('aria-pressed', kitSel);
      HA.audio.play('click');
      if (kitSel) say(cfg.msg.pickSpot);
    };
    // 도구 끌어다 놓기
    let drag = null;
    kit.addEventListener('pointerdown', (e) => {
      drag = { x: e.clientX, y: e.clientY, ghost: null };
      kit.setPointerCapture(e.pointerId);
    });
    kit.addEventListener('pointermove', (e) => {
      if (!drag) return;
      if (!drag.ghost && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 8) {
        drag.ghost = h(`<div class="drag-ghost">${cfg.kit.icon}</div>`);
        document.getElementById('stage').appendChild(drag.ghost);
      }
      if (drag.ghost) {
        const p = HA.util.toStage(e.clientX, e.clientY);
        drag.ghost.style.left = p.x + 'px';
        drag.ghost.style.top = p.y + 'px';
      }
    });
    kit.addEventListener('pointerup', (e) => {
      if (!drag) return;
      const had = drag.ghost;
      if (had) had.remove();
      drag = null;
      if (!had) return;
      kit._skip = true;
      const p = HA.util.toStage(e.clientX, e.clientY);
      if (p.x > 170 && p.x < 290 && p.y > 280 && p.y < 480) placeDam();
      else say(cfg.msg.wrongSpot, 'bad');
    });
    kit.addEventListener(
      'click',
      (e) => {
        if (kit._skip) {
          kit._skip = false;
          e.stopImmediatePropagation();
        }
      },
      true
    );

    damBtn.onclick = () => {
      if (!dammed) {
        if (kitSel) placeDam();
        else {
          HA.audio.play('wrong');
          say(cfg.msg.needKit, 'bad');
        }
        return;
      }
      if (!hidden) {
        say(cfg.msg.hideFirst, 'bad');
        return;
      }
      release();
    };
    valBtn.onclick = () => {
      if (kitSel) {
        HA.audio.play('wrong');
        say(cfg.msg.wrongSpot, 'bad');
        return;
      }
      hide();
    };

    (async () => {
      await g.say(cfg.intro);
      say(cfg.msg.start);
    })();
  });
};
