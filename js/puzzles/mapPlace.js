/* 퍼즐 ② 지도 배치 — 토큰(성)을 지도 위 알맞은 지역에 끌어다 놓는다.
   cfg: { goal, title, text, intro[], base(), zones{id:{poly,label,feedback}}, correctZone, outside,
          tokens[{id,label,x,y}], hints[], success[], doneLabel } */
HA.puzzles.mapPlace = function (cfg, g) {
  const { h, esc, sleep, inPoly } = HA.util;
  const CASTLE = '<svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="#8e2a22" stroke="#f3d27a" stroke-width="3"/><path d="M10 28 V14 L14 10 L17 14 L20 10 L23 14 L26 10 L30 14 V28 Z" fill="#fbf2d8"/><rect x="17" y="20" width="6" height="8" rx="3" fill="#8e2a22"/></svg>';
  return new Promise((resolve) => {
    const root = HA.ui.openOverlay('pz-map');
    root.innerHTML = `
      <div class="map-wrap">
        <svg class="map-svg" viewBox="0 0 800 640" xmlns="http://www.w3.org/2000/svg">
          ${cfg.base()}
          <path class="territory" d="" />
          <path class="zone-glow" d="" />
          <path class="border-line" d="" />
          <g class="sites"></g>
          <g class="placed"></g>
        </svg>
      </div>
      <aside class="map-side">
        <h3>${esc(cfg.title)}</h3>
        <p>${esc(cfg.text)}</p>
        <div class="tokens"></div>
        <div class="tok-card" hidden></div>
        <div class="map-fb" aria-live="polite"></div>
        <div class="kbd-zones" aria-label="키보드로 지역 고르기"></div>
      </aside>`;
    const svgEl = root.querySelector('.map-svg');
    const tokensEl = root.querySelector('.tokens');
    const fb = root.querySelector('.map-fb');
    const placedG = root.querySelector('.placed');
    const kbd = root.querySelector('.kbd-zones');
    let sel = null;
    let hintLevel = 0;
    let done = false;
    let sitesOn = false; // 알맞은 땅을 찾은 뒤에 성터가 나타난다
    const left = new Set(cfg.tokens.map((t) => t.id));
    const SITE_R = 30;

    const zoneAt = (x, y) => {
      for (const [id, z] of Object.entries(cfg.zones)) if (inPoly(x, y, z.poly)) return id;
      return null;
    };
    const toMap = (cx, cy) => {
      const r = svgEl.getBoundingClientRect();
      return { x: ((cx - r.left) * 800) / r.width, y: ((cy - r.top) * 640) / r.height };
    };
    const pts = (p) => 'M' + p.map((q) => q.join(',')).join(' L') + ' Z';

    g.puzzleHint = () => {
      const t = cfg.hints[Math.min(hintLevel, cfg.hints.length - 1)];
      if (hintLevel >= 1 && !sitesOn) root.querySelector('.zone-glow').setAttribute('d', pts(cfg.zones[cfg.correctZone].poly));
      hintLevel++;
      return t;
    };

    function say(text, cls) {
      fb.className = 'map-fb ' + (cls || '');
      fb.textContent = text;
    }

    function renderTokens() {
      tokensEl.innerHTML = '';
      cfg.tokens.forEach((t) => {
        if (!left.has(t.id)) return;
        const b = h(`<button class="castle-token ${sel === t.id ? 'sel' : ''}" data-id="${t.id}" aria-pressed="${sel === t.id}">
          <span class="ico">${CASTLE}</span><span>${esc(t.label)}</span></button>`);
        bindDrag(b, t.id);
        tokensEl.appendChild(b);
      });
      kbd.innerHTML = '';
      if (sel && sitesOn) {
        cfg.tokens.filter((t) => left.has(t.id)).forEach((t, i) => {
          const zb = h(`<button class="sr-only-focusable">성터 ${i + 1}에 놓기</button>`);
          zb.onclick = () => drop(sel, t.x, t.y);
          kbd.appendChild(zb);
        });
      } else if (sel) {
        Object.entries(cfg.zones).forEach(([id, z]) => {
          const zb = h(`<button class="sr-only-focusable">${esc(z.label)}에 놓기</button>`);
          const c = z.poly.reduce((a, p) => [a[0] + p[0] / z.poly.length, a[1] + p[1] / z.poly.length], [0, 0]);
          zb.onclick = () => drop(sel, c[0], c[1]);
          kbd.appendChild(zb);
        });
      }
    }

    function bindDrag(btn, id) {
      let start = null;
      let ghost = null;
      let moved = false;
      btn.addEventListener('pointerdown', (e) => {
        if (done) return;
        start = { x: e.clientX, y: e.clientY };
        moved = false;
        btn.setPointerCapture(e.pointerId);
      });
      btn.addEventListener('pointermove', (e) => {
        if (!start) return;
        if (!moved && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 8) {
          moved = true;
          ghost = h(`<div class="drag-ghost castle">${CASTLE}</div>`);
          document.getElementById('stage').appendChild(ghost);
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
        if (ghost) ghost.remove();
        ghost = null;
        if (!moved) return;
        btn._skip = true;
        const r = svgEl.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
        const m = toMap(e.clientX, e.clientY);
        drop(id, m.x, m.y);
      });
      btn.addEventListener('pointercancel', () => {
        start = null;
        if (ghost) ghost.remove();
        ghost = null;
      });
      btn.addEventListener('click', () => {
        if (btn._skip) return (btn._skip = false);
        HA.audio.play('click');
        sel = sel === id ? null : id;
        renderTokens();
        if (sel) say(sitesOn ? '이 성의 위치 기록을 읽고, 알맞은 성터(○)에 놓아요.' : '지도에서 성을 쌓을 땅을 찾아 눌러 보세요.');
        showTokCard();
      });
    }

    svgEl.addEventListener('click', (e) => {
      if (!sel || done) return;
      const m = toMap(e.clientX, e.clientY);
      drop(sel, m.x, m.y);
    });

    function showTokCard() {
      const card = root.querySelector('.tok-card');
      const tok = sel && cfg.tokens.find((t) => t.id === sel);
      card.hidden = !(tok && tok.hint && sitesOn);
      if (!card.hidden) card.innerHTML = `<b>📜 ${esc(tok.label)}의 위치 기록</b><p>${esc(tok.hint)}</p><small>※ 위치 설명은 게임을 위해 단순하게 바꾼 것이에요</small>`;
    }

    /** 알맞은 땅을 처음 찾으면: 땅이 빛나고 성터 6곳이 드러난다 */
    function revealSites() {
      sitesOn = true;
      root.querySelector('.zone-glow').setAttribute('d', pts(cfg.zones[cfg.correctZone].poly));
      root.querySelector('.zone-glow').classList.add('found');
      root.querySelector('.sites').innerHTML = cfg.tokens
        .map((t, i) => `<g class="site" data-site="${t.id}" transform="translate(${t.x} ${t.y})"><g class="site-in" style="--d:${i * 0.08}s"><circle r="${SITE_R - 12}"/><text y="6" text-anchor="middle">?</text></g></g>`)
        .join('');
      // 키보드용 성터 버튼
      kbdSites = true;
    }
    let kbdSites = false;

    function build(tok) {
      HA.audio.play('item');
      left.delete(tok.id);
      sel = null;
      const site = root.querySelector(`.site[data-site="${tok.id}"]`);
      if (site) site.remove();
      placedG.appendChild(
        h(`<svg><g class="castle-mark" transform="translate(${tok.x} ${tok.y})">
            <g class="dust"><circle cx="-14" cy="10" r="8"/><circle cx="14" cy="10" r="8"/><circle cx="0" cy="14" r="9"/></g>
            <g class="rise">
              <circle r="15" fill="#8e2a22" stroke="#f3d27a" stroke-width="3"/>
              <path d="M-8 6 V-4 L-4 -8 L0 -4 L4 -8 L8 -4 V6 Z" fill="#fbf2d8"/>
            </g>
            <text class="lbl" y="-20" text-anchor="middle" font-size="16" font-weight="800" fill="#3b2a1a" stroke="#f6ecd6" stroke-width="4" paint-order="stroke">${esc(tok.label)}</text>
          </g></svg>`).firstElementChild
      );
      say(`🏯 ${tok.label} 완성! ${tok.why || ''} (${cfg.tokens.length - left.size}/${cfg.tokens.length})`, 'good');
      renderTokens();
      showTokCard();
      if (left.size === 0) finish();
    }

    async function drop(id, x, y) {
      const zone = zoneAt(x, y);
      const tok = cfg.tokens.find((t) => t.id === id);
      if (zone === cfg.correctZone) {
        if (!sitesOn) {
          HA.audio.play('good');
          revealSites();
          say('바로 이 땅이에요! 빈 성터(?) 6곳이 나타났어요. 성마다 위치 기록을 읽고 알맞은 터에 놓아요.', 'good');
          showTokCard();
          return;
        }
        const near = cfg.tokens
          .filter((t) => left.has(t.id))
          .map((t) => ({ t, d: Math.hypot(t.x - x, t.y - y) }))
          .sort((a, b) => a.d - b.d)[0];
        if (!near || near.d > SITE_R) {
          HA.audio.play('click');
          return say('성터(?) 위에 정확히 놓아요. 성터를 눌러도 돼요.');
        }
        if (near.t.id === id) return build(tok);
        HA.audio.play('wrong');
        say(`이 터는 ${tok.label}에 맞지 않아요. 위치 기록: ${tok.hint}`, 'bad');
        const site = root.querySelector(`.site[data-site="${near.t.id}"]`);
        if (site) {
          site.classList.remove('nope');
          void site.getBoundingClientRect();
          site.classList.add('nope');
        }
        return;
      } else {
        HA.audio.play('wrong');
        const fbText = zone ? cfg.zones[zone].feedback : cfg.outside;
        say(fbText, 'bad');
        const b = tokensEl.querySelector(`[data-id="${id}"]`);
        if (b) {
          b.classList.add('nope');
          setTimeout(() => b.classList.remove('nope'), 500);
        }
      }
    }

    async function finish() {
      done = true;
      root.querySelector('.zone-glow').setAttribute('d', '');
      const terr = root.querySelector('.territory');
      terr.setAttribute('d', pts(cfg.zones[cfg.correctZone].poly));
      terr.classList.add('on');
      root.querySelector('.map-wrap').appendChild(h(`<div class="map-banner">🎉 ${esc(cfg.bannerText || '영토 확장!')}</div>`));
      const bl = root.querySelector('.border-line');
      bl.setAttribute('d', cfg.borderPath);
      bl.classList.add('draw');
      root.querySelectorAll('.jurchen').forEach((j) => j.classList.add('gone'));
      say(cfg.doneLabel, 'good');
      HA.audio.play('win');
      await sleep(1400);
      await g.say(cfg.success);
      resolve();
    }

    (async () => {
      await g.say(cfg.intro);
      renderTokens();
    })();
  });
};
