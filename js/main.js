/* 화면 흐름: 처음 화면 → 시대 선택 → 에피소드 → 완료 화면 / 연대표 */
HA.main = (() => {
  const { h, esc } = HA.util;
  const screen = () => document.getElementById('screen');
  let game = null;

  const saved = (id) => HA.store.data.episodes[id];
  const epStatus = (id) => {
    const s = saved(id);
    if (!s) return 'new';
    if (s.status === 'playing') return 'playing';
    if (s.restored) return 'done';
    return 'new';
  };
  function eraStatus(era) {
    if (!era.episodes.length) return 'soon';
    const st = era.episodes.map(epStatus);
    if (st.every((s) => s === 'done')) return 'done';
    if (st.some((s) => s === 'playing' || s === 'done')) return 'playing';
    return 'new';
  }
  const STATUS_LABEL = { soon: '준비 중', done: '복원 완료 ✓', playing: '탐험 중', new: '새 기록' };

  function clear() {
    HA.ui.reset();
    if (game) game.alive = false;
    game = null;
    screen().innerHTML = '';
  }

  function bindActions(root, actions) {
    root.querySelectorAll('[data-a]').forEach((b) => {
      b.addEventListener('click', () => {
        HA.audio.play('click');
        actions[b.dataset.a] && actions[b.dataset.a](b);
      });
    });
  }

  /* ---------- 처음 화면 ---------- */
  function showTitle() {
    clear();
    const playing = Object.keys(HA.episodes).find((id) => epStatus(id) === 'playing');
    const root = h(`<div class="title-screen">
      <div class="scene-bg">${HA.art.archive()}</div>
      <div class="title-box">
        <div class="title-pili">${HA.art.pili()}</div>
        <h1><small>시간의 기록자</small>사라진 역사</h1>
        <p class="title-sub">뒤섞인 한국사의 기록을 바로잡는 탐험 어드벤처</p>
        <div class="title-btns">
          ${playing ? `<button class="btn primary big" data-a="continue">▶ 이어하기 <small>${esc(HA.episodes[playing].title)}</small></button>` : ''}
          <button class="btn ${playing ? '' : 'primary'} big" data-a="eras">🏛 시대 선택</button>
          <div class="row">
            <button class="btn" data-a="chronicle">📜 역사 연대표</button>
            <button class="btn" data-a="settings">⚙ 설정</button>
          </div>
        </div>
        <p class="privacy">회원가입 없이 플레이해요. 진행 상황은 이 기기의 브라우저에만 저장되고, 개인정보는 모으지 않아요.</p>
      </div>
    </div>`);
    screen().appendChild(root);
    bindActions(root, {
      continue: () => playEpisode(playing, false),
      eras: showEras,
      chronicle: showChronicle,
      settings,
    });
    const first = root.querySelector('.btn.primary');
    if (first) first.focus();
  }

  /* ---------- 시대 선택 ---------- */
  function showEras() {
    clear();
    const doneCount = HA.eras.filter((e) => eraStatus(e) === 'done').length;
    const root = h(`<div class="eras-screen">
      <header class="top-bar">
        <button class="btn ghost" data-a="back">← 처음 화면</button>
        <h2>어느 시대로 떠날까요?</h2>
        <div class="progress-pill">복원한 시대 <b>${doneCount}</b> / ${HA.eras.length}</div>
      </header>
      <div class="era-grid">
        ${HA.eras
          .map((e) => {
            const s = eraStatus(e);
            return `<button class="era-card st-${s}" data-era="${e.id}" style="--c:${e.color}" aria-label="${e.no}. ${esc(e.name)} — ${STATUS_LABEL[s]}">
              <span class="no">${e.no}</span><span class="ico">${e.icon}</span>
              <b>${esc(e.name)}</b><small>${esc(e.period)}</small>
              <span class="badge">${STATUS_LABEL[s]}</span></button>`;
          })
          .join('')}
      </div>
      <footer class="bottom-bar"><button class="btn" data-a="chronicle">📜 역사 연대표 보기</button></footer>
    </div>`);
    screen().appendChild(root);
    bindActions(root, { back: showTitle, chronicle: showChronicle });
    root.querySelectorAll('.era-card').forEach((b) => {
      b.onclick = () => {
        HA.audio.play('click');
        const era = HA.eras.find((e) => e.id === b.dataset.era);
        if (!era.episodes.length) HA.ui.toast(`'${era.name}' 시대의 기록은 아직 준비 중이에요. 곧 열릴 거예요!`);
        else eraPanel(era);
      };
    });
    const g = root.querySelector('.era-card.st-playing, .era-card.st-new');
    if (g) g.focus();
  }

  function eraPanel(era) {
    const body = h(`<div class="era-panel" style="--c:${era.color}">
      <div class="era-panel-head"><span class="ico">${era.icon}</span><div><small>${era.no}. ${esc(era.period)}</small><h3>${esc(era.name)}</h3></div></div>
      ${era.episodes
        .map((id) => {
          const ep = HA.episodes[id];
          const s = epStatus(id);
          const st = saved(id);
          return `<article class="ep-item">
            <h4>${esc(ep.title)} <small>${esc(ep.subtitle)}</small></h4>
            <p>${esc(ep.blurb)}</p>
            <p class="meta">⏱ ${esc(ep.minutes)} · ${STATUS_LABEL[s]}${st && st.status === 'playing' ? ` · 단서 ${st.clues.length}/${Object.keys(ep.clues).length}` : ''}</p>
            <div class="row">
              ${s === 'playing' ? `<button class="btn primary" data-ep="${id}" data-m="continue">▶ 이어하기</button><button class="btn" data-ep="${id}" data-m="restart">처음부터</button>` : ''}
              ${s === 'done' ? `<button class="btn primary" data-ep="${id}" data-m="restart">🔄 다시 플레이</button><button class="btn" data-ep="${id}" data-m="record">복원한 기록 보기</button>` : ''}
              ${s === 'new' ? `<button class="btn primary" data-ep="${id}" data-m="start">▶ 시작하기</button>` : ''}
            </div>
          </article>`;
        })
        .join('')}
    </div>`);
    const m = HA.ui.modal(body, { cls: 'small' });
    body.querySelectorAll('[data-ep]').forEach((b) => {
      b.onclick = async () => {
        const id = b.dataset.ep;
        const mode = b.dataset.m;
        if (mode === 'record') {
          m.close();
          return showComplete(id);
        }
        if (mode === 'restart' && epStatus(id) === 'playing') {
          if (!(await HA.ui.confirm('처음부터 다시 할까요? 지금까지 모은 단서가 사라져요.', '처음부터', '취소'))) return;
        }
        HA.ui.closeModal();
        playEpisode(id, mode !== 'continue');
      };
    });
  }

  function playEpisode(id, fresh) {
    clear();
    game = new HA.Game(HA.episodes[id], {
      onExit: () => {
        game = null;
        showEras();
      },
    });
    game.start(fresh);
  }

  /* ---------- 완료 화면 ---------- */
  function showComplete(id) {
    clear();
    const ep = HA.episodes[id];
    const sm = ep.summary;
    const root = h(`<div class="complete-screen">
      <div class="scene-bg dim">${HA.art.archive()}</div>
      <div class="cp-card">
        <div class="cp-stamp" aria-hidden="true">복원<br>완료</div>
        <p class="cp-kicker">기록 복원 완료!</p>
        <h2>${esc(sm.title)}</h2>
        <p class="cp-key">💡 ${esc(sm.keyIdea)}</p>
        <div class="cp-cols">
          <section class="cp-real">
            <h3>📜 실제 역사 한눈에 보기</h3>
            <ol>${sm.points.map((p) => `<li><b>${esc(p.year)}</b> ${esc(p.text)}</li>`).join('')}</ol>
          </section>
          <section class="cp-side">
            <h3>🤔 더 생각해 보기</h3>
            <ul>${sm.think.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
            <h3>🎭 게임 속 이야기와 실제 역사</h3>
            <ul class="fiction">${sm.fiction.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          </section>
        </div>
        <div class="cp-btns">
          <button class="btn primary" data-a="chronicle">📜 연대표에서 보기</button>
          <button class="btn" data-a="notebook">📖 모은 단서 보기</button>
          <button class="btn" data-a="replay">🔄 다시 플레이</button>
          <button class="btn" data-a="eras">🏛 시대 선택</button>
        </div>
      </div>
    </div>`);
    screen().appendChild(root);
    bindActions(root, {
      chronicle: () => showChronicle(ep.era),
      notebook: () => HA.ui.notebook({ ep, st: HA.store.ep(id) }),
      replay: () => playEpisode(id, true),
      eras: showEras,
    });
    root.querySelector('.btn.primary').focus({ preventScroll: true });
  }

  /* ---------- 연대표 ---------- */
  function showChronicle(focusEra) {
    clear();
    const doneCount = HA.eras.filter((e) => eraStatus(e) === 'done').length;
    const root = h(`<div class="chron-screen">
      <header class="top-bar">
        <button class="btn ghost" data-a="back">← 처음 화면</button>
        <h2>한국사 연대표</h2>
        <div class="progress-pill">복원한 시대 <b>${doneCount}</b> / ${HA.eras.length}</div>
      </header>
      <div class="chron-scroll" tabindex="0" aria-label="연대표 (옆으로 넘겨 보세요)">
        <div class="chron-track">
          ${HA.eras
            .map((e) => {
              const s = eraStatus(e);
              let body;
              if (s === 'soon') body = `<div class="torn">아직 준비 중인 기록이에요</div>`;
              else {
                body = e.episodes
                  .map((id) => {
                    const ep = HA.episodes[id];
                    if (epStatus(id) !== 'done')
                      return `<div class="torn">찢어진 기록 — '${esc(ep.title)}'을 플레이해 복원해요<button class="btn tiny" data-play="${id}">▶ 떠나기</button></div>`;
                    return `<div class="restored"><h4>${esc(ep.title)}</h4><ul>${ep.summary.points.map((p) => `<li><b>${esc(p.year)}</b>${esc(p.text)}</li>`).join('')}</ul></div>`;
                  })
                  .join('');
              }
              return `<section class="chron-era st-${s}" data-era="${e.id}" style="--c:${e.color}">
                <div class="chron-head"><span class="ico">${e.icon}</span><div><small>${e.no} · ${esc(e.period)}</small><b>${esc(e.name)}</b></div></div>
                <div class="chron-body">${body}</div></section>`;
            })
            .join('')}
        </div>
      </div>
      <footer class="bottom-bar"><button class="btn" data-a="eras">🏛 시대 선택</button><span class="tip">← 옆으로 밀어서 넘겨 보세요 →</span></footer>
    </div>`);
    screen().appendChild(root);
    bindActions(root, { back: showTitle, eras: showEras });
    root.querySelectorAll('[data-play]').forEach((b) => (b.onclick = () => playEpisode(b.dataset.play, epStatus(b.dataset.play) !== 'playing')));
    const target = root.querySelector(`.chron-era[data-era="${focusEra || ''}"]`) || root.querySelector('.chron-era.st-done, .chron-era.st-playing');
    if (target) {
      const sc = root.querySelector('.chron-scroll');
      sc.scrollLeft = target.offsetLeft - 40;
      if (focusEra) target.classList.add('just');
    }
  }

  /* ---------- 설정 ---------- */
  function settings() {
    const s = HA.store.data.settings;
    const body = h(`<div class="menu-list">
      <h3>설정</h3>
      <button class="btn" data-a="sound">${s.sound ? '🔊 소리 끄기' : '🔈 소리 켜기'}</button>
      <button class="btn danger" data-a="wipe">🗑 모든 진행 기록 지우기</button>
      <p class="small-note">조작: 마우스 클릭 · 손가락 터치 · 키보드(Tab으로 이동, Enter로 선택, H 힌트, N 수첩, Esc 메뉴)</p>
    </div>`);
    const m = HA.ui.modal(body, { cls: 'small' });
    body.querySelector('[data-a="sound"]').onclick = () => {
      s.sound = !s.sound;
      HA.store.save();
      m.close();
      HA.ui.toast(s.sound ? '소리를 켰어요.' : '소리를 껐어요.');
    };
    body.querySelector('[data-a="wipe"]').onclick = async () => {
      m.close();
      if (await HA.ui.confirm('모든 진행 기록과 복원한 연대표를 지울까요? 되돌릴 수 없어요.', '모두 지우기', '취소')) {
        HA.store.resetAll();
        showTitle();
        HA.ui.toast('모든 기록을 지웠어요.');
      }
    };
  }

  /* ---------- 키보드 ---------- */
  function onKey(e) {
    if (HA.ui.isTalking()) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat) HA.ui.advanceDialogue();
      }
      return;
    }
    if (e.key === 'Escape') {
      if (HA.ui.isModalOpen()) return HA.ui.closeModal();
      if (game && game.alive) return game.menu();
    }
    if (HA.ui.isModalOpen() || !game || !game.alive) return;
    if (e.key === 'h' || e.key === 'H' || e.key === 'ㅗ') game.hint();
    if (e.key === 'n' || e.key === 'N' || e.key === 'ㅜ') game.openNotebook();
  }

  function init() {
    HA.store.load();
    HA.ui.fit();
    window.addEventListener('resize', HA.ui.fit);
    window.addEventListener('orientationchange', () => setTimeout(HA.ui.fit, 200));
    window.addEventListener('keydown', onKey, true);
    showTitle();
  }

  return { init, showTitle, showEras, showChronicle, showComplete, playEpisode, get game() { return game; } };
})();

document.addEventListener('DOMContentLoaded', HA.main.init);
