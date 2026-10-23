/* 마무리 연출 — 복원된 기록 두루마리가 펼쳐지고 도장이 찍힌다.
   cfg: { title, points[{year,text}] } */
HA.puzzles.restore = function (cfg, g) {
  const { esc, sleep } = HA.util;
  return new Promise((resolve) => {
    const root = HA.ui.openOverlay('pz-restore');
    root.innerHTML = `
      <div class="rs-glow"></div>
      <div class="rs-scroll">
        <div class="rs-rod top"></div>
        <div class="rs-paper">
          <h2>${esc(cfg.title)}</h2>
          <ol>${cfg.points.map((p) => `<li><b>${esc(p.year)}</b><span>${esc(p.text)}</span></li>`).join('')}</ol>
          <div class="rs-stamp" aria-hidden="true">復元<small>복원</small></div>
        </div>
        <div class="rs-rod bottom"></div>
      </div>
      <button class="btn primary rs-next" hidden>복원 완료! 결과 보기 ▶</button>`;
    g.puzzleHint = () => '기록이 복원되고 있어요. 잠시만 기다려요!';
    const lis = [...root.querySelectorAll('li')];
    const next = root.querySelector('.rs-next');
    (async () => {
      await sleep(200);
      root.classList.add('open');
      HA.audio.play('page');
      await sleep(900);
      for (const li of lis) {
        li.classList.add('on');
        HA.audio.play('click');
        await sleep(380);
      }
      await sleep(300);
      root.classList.add('stamped');
      HA.audio.play('win');
      await sleep(900);
      next.hidden = false;
      next.focus();
    })();
    next.onclick = () => resolve();
  });
};
