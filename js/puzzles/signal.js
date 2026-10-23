/* 연출 퍼즐 — 장면 속 목표물을 눌러 결정적 순간을 일으킨다 (예: 귀주대첩 공격 신호).
   cfg: { goal, bg(), layer(), target{x,y,w,h,label,art()}, intro[], prompt, hints[], banner{title,sub}, success[] } */
HA.puzzles.signal = function (cfg, g) {
  const { h, esc, sleep } = HA.util;
  return new Promise((resolve) => {
    const root = HA.ui.openOverlay('pz-signal');
    const t = cfg.target;
    root.innerHTML = `
      <div class="pz-bg">${cfg.bg()}</div>
      <div class="sig-layer">${cfg.layer()}</div>
      <div class="wind" aria-hidden="true">${'<i></i>'.repeat(14)}</div>
      <button class="sig-target" style="left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px" aria-label="${esc(t.label)}" disabled>
        ${t.art()}<span class="hs-label">${esc(t.label)}</span></button>
      <div class="sig-prompt" aria-live="polite"></div>
      <div class="sig-banner"><b>${esc(cfg.banner.title)}</b><small>${esc(cfg.banner.sub)}</small></div>`;
    const btn = root.querySelector('.sig-target');
    const prompt = root.querySelector('.sig-prompt');
    let hl = 0;
    g.puzzleHint = () => cfg.hints[Math.min(hl++, cfg.hints.length - 1)];

    btn.onclick = async () => {
      btn.disabled = true;
      prompt.classList.remove('on');
      root.classList.add('go');
      HA.audio.play('good');
      await sleep(1800);
      root.classList.add('banner-on');
      HA.audio.play('win');
      await sleep(1800);
      await g.say(cfg.success);
      resolve();
    };

    (async () => {
      await g.say(cfg.intro);
      root.classList.add('windy');
      prompt.textContent = cfg.prompt;
      prompt.classList.add('on');
      btn.disabled = false;
      btn.classList.add('pulse');
      btn.focus();
    })();
  });
};
