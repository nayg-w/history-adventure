/* 에피소드 실행 엔진 — 장면, 핫스팟, 단서, 도구, 퍼즐, 힌트, 저장을 다룬다.
   역사 내용은 js/data/episodes/*.js 에 있고, 이 파일은 어느 시대에나 쓰인다. */
HA.puzzles = HA.puzzles || {};

HA.Game = class {
  constructor(ep, { onExit }) {
    this.ep = ep;
    this.st = HA.store.ep(ep.id);
    this.onExit = onExit;
    this.busy = false;
    this.alive = true;
    this.selItem = null;
    this.puzzleHint = null;
    this.puzzleGoal = null;
  }

  /* ---------- 상태 ---------- */
  has(clueId) {
    return this.st.clues.includes(clueId);
  }
  hasItem(id) {
    return this.st.items.includes(id);
  }
  flag(k) {
    return !!this.st.flags[k];
  }
  setFlag(k, v = true) {
    this.st.flags[k] = v;
    HA.store.save();
  }
  save() {
    HA.store.save();
  }

  /* ---------- 진행 ---------- */
  async start(fresh) {
    if (fresh || this.st.status !== 'playing') {
      this.st = HA.store.resetEpisode(this.ep.id);
      this.st.status = 'playing';
      this.st.scene = this.ep.startScene;
      HA.store.save();
      if (this.ep.intro) {
        document.getElementById('screen').innerHTML = `<div class="scene-bg">${this.ep.introArt ? this.ep.introArt() : ''}</div>`;
        await this.ep.intro(this);
      }
    }
    if (!this.alive) return;
    await this.goto(this.st.scene);
  }

  async goto(id) {
    const sc = this.ep.scenes[id];
    if (!sc) throw new Error('없는 장면: ' + id);
    this.selItem = null;
    // 화면이 바뀌는 동안(페이드 포함)에는 클릭을 받지 않는다
    const outer = this.busy;
    this.busy = true;
    try {
      await HA.ui.fade(() => {
        this.st.scene = id;
        HA.store.save();
        this.render();
      }, sc.caption);
    } finally {
      if (!outer) this.busy = false;
    }
    if (!this.alive) return;
    const key = 'entered_' + id;
    const first = !this.flag(key);
    this.setFlag(key);
    if (sc.onEnter) await this.run(() => sc.onEnter(this, first));
  }

  get scene() {
    return this.ep.scenes[this.st.scene];
  }

  /** 행동 하나를 실행하는 동안 다른 클릭을 막는다 */
  async run(fn) {
    if (this.busy) return fn(); // 이미 진행 중인 행동 안에서 부른 경우
    this.busy = true;
    try {
      await fn();
    } finally {
      this.busy = false;
      if (this.alive) this.refresh();
    }
  }

  async say(lines) {
    if (!this.alive) return;
    lines.forEach((l) => {
      if (l.who && !this.st.met.includes(l.who) && this.ep.characters[l.who]) this.st.met.push(l.who);
    });
    HA.store.save();
    await HA.ui.dialogue(lines, this.ep.characters);
  }

  async addClue(id) {
    if (this.has(id)) return;
    this.st.clues.push(id);
    this.st.newClues = (this.st.newClues || 0) + 1;
    HA.store.save();
    this.refreshHud();
    await HA.ui.gainCard(this.ep.clues[id], 'clue');
  }

  async addItem(id) {
    if (this.hasItem(id)) return;
    this.st.items.push(id);
    HA.store.save();
    this.refreshHud();
    await HA.ui.gainCard(this.ep.items[id], 'item');
  }

  removeItem(id) {
    this.st.items = this.st.items.filter((x) => x !== id);
    if (this.selItem === id) this.selItem = null;
    HA.store.save();
    this.refreshHud();
  }

  /** 퍼즐 실행: 풀 때까지 기다린다. 퍼즐 도중 힌트 버튼은 퍼즐 전용 힌트를 준다 */
  async puzzle(type, cfg) {
    const fn = HA.puzzles[type];
    if (!fn) throw new Error('없는 퍼즐: ' + type);
    this.puzzleGoal = cfg.goal || null;
    this.puzzleCaption = cfg.caption || null;
    this.refreshHud();
    try {
      await fn(cfg, this);
    } finally {
      this.puzzleHint = null;
      this.puzzleGoal = null;
      this.puzzleCaption = null;
      HA.ui.closeOverlay();
      if (this.alive) this.refreshHud();
    }
  }

  /* ---------- 그리기 ---------- */
  render() {
    const sc = this.scene;
    const screen = document.getElementById('screen');
    screen.innerHTML = '';
    screen.appendChild(HA.util.h(`<div class="scene" data-scene="${sc.id}"><div class="scene-bg">${sc.bg(this)}</div><div class="hotspots"></div></div>`));
    this.renderHud();
    this.refresh();
  }

  refresh() {
    this.renderHotspots();
    this.refreshHud();
  }

  renderHotspots() {
    const layer = document.querySelector('#screen .hotspots');
    if (!layer) return;
    layer.innerHTML = '';
    this.scene.hotspots.forEach((hs) => {
      if (hs.visible && !hs.visible(this)) return;
      const fresh = hs.sparkle ? hs.sparkle(this) : !this.st.seen.includes(this.st.scene + ':' + hs.id);
      const b = HA.util.h(`<button class="hs ${fresh ? 'fresh' : ''} ${hs.cls || ''}" data-hs="${hs.id}"
        style="left:${hs.x}px;top:${hs.y}px;width:${hs.w}px;height:${hs.h}px"
        aria-label="${HA.util.esc(hs.label)}">
        <span class="hs-art">${hs.art ? hs.art(this) : ''}</span>
        <span class="hs-label">${HA.util.esc(hs.label)}</span>
        ${fresh ? '<span class="sparkle" aria-hidden="true">✦</span>' : ''}
      </button>`);
      b.onclick = () => this.clickHotspot(hs);
      layer.appendChild(b);
    });
  }

  markSeen(hs) {
    const k = this.st.scene + ':' + hs.id;
    if (!this.st.seen.includes(k)) {
      this.st.seen.push(k);
      HA.store.save();
    }
  }

  clickHotspot(hs) {
    if (this.busy || HA.ui.isTalking()) return;
    HA.audio.play('click');
    if (this.selItem) return this.useItemOn(this.selItem, hs);
    this.run(async () => {
      this.markSeen(hs);
      await hs.onClick(this);
    });
  }

  useItemOn(itemId, hs) {
    this.selItem = null;
    const handler = hs.onItem && hs.onItem[itemId];
    const item = this.ep.items[itemId];
    this.run(async () => {
      if (handler) {
        this.markSeen(hs);
        await handler(this);
      } else {
        HA.audio.play('wrong');
        HA.ui.toast(`${HA.util.josa(item.title, '은/는')} 여기에 쓸 수 없어요.`);
      }
    });
  }

  combine(a, b) {
    this.selItem = null;
    const r = (this.ep.recipes || []).find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a));
    if (!r) {
      HA.audio.play('wrong');
      HA.ui.toast('이 두 도구는 함께 쓸 수 없어요.');
      this.refreshHud();
      return;
    }
    this.run(async () => {
      this.removeItem(a);
      this.removeItem(b);
      await this.addItem(r.result);
      if (r.lines) await this.say(r.lines);
    });
  }

  selectItem(id) {
    if (this.busy || HA.ui.isTalking()) return;
    HA.audio.play('click');
    if (!this.selItem) this.selItem = id;
    else if (this.selItem === id) this.selItem = null;
    else return this.combine(this.selItem, id);
    this.refreshHud();
  }

  renderHud() {
    const hud = document.getElementById('hud');
    hud.innerHTML = `
      <div class="hud-cap"><small></small><b></b></div>
      <div class="hud-btns">
        <button class="hud-btn hud-hint" aria-label="힌트 (H)"><span class="ico">💡</span><span>힌트</span></button>
        <button class="hud-btn hud-notebook" aria-label="기록 수첩 (N)"><span class="ico">📖</span><span>수첩</span><i class="badge"></i></button>
        <button class="hud-btn hud-menu" aria-label="메뉴 (Esc)"><span class="ico">☰</span><span>메뉴</span></button>
      </div>
      <div class="hud-inv" aria-label="도구 칸"><span class="inv-title">도구</span><div class="inv-items"></div></div>
      <div class="hud-sel"></div>`;
    hud.querySelector('.hud-hint').onclick = () => this.hint();
    hud.querySelector('.hud-notebook').onclick = () => this.openNotebook();
    hud.querySelector('.hud-menu').onclick = () => this.menu();
  }

  refreshHud() {
    const hud = document.getElementById('hud');
    if (!hud.firstElementChild) return;
    const sc = this.scene;
    const cap = hud.querySelector('.hud-cap');
    const c = this.puzzleCaption || (sc && sc.caption);
    cap.querySelector('small').textContent = c ? `${c.year} · ${c.place}` : '';
    cap.querySelector('b').textContent = this.puzzleGoal || (sc && sc.objective ? sc.objective(this) : '');
    const badge = hud.querySelector('.badge');
    badge.textContent = this.st.newClues || '';
    badge.style.display = this.st.newClues ? '' : 'none';

    const inv = hud.querySelector('.hud-inv');
    const wrap = hud.querySelector('.inv-items');
    wrap.innerHTML = '';
    inv.style.display = this.st.items.length ? '' : 'none';
    this.st.items.forEach((id) => {
      const it = this.ep.items[id];
      const b = HA.util.h(`<button class="inv-item ${this.selItem === id ? 'sel' : ''}" data-item="${id}"
        aria-pressed="${this.selItem === id}" aria-label="도구: ${HA.util.esc(it.title)}">
        <span class="ico">${it.icon}</span><span>${HA.util.esc(it.title)}</span></button>`);
      this.bindItemDrag(b, id);
      wrap.appendChild(b);
    });
    const sel = hud.querySelector('.hud-sel');
    if (this.selItem) {
      const it = this.ep.items[this.selItem];
      sel.innerHTML = `<span>'${HA.util.esc(it.title)}' 선택됨 — 쓸 곳을 누르거나, 다른 도구를 눌러 합쳐 보세요.</span><button class="btn tiny">취소</button>`;
      sel.querySelector('button').onclick = () => {
        this.selItem = null;
        this.refreshHud();
      };
      sel.classList.add('on');
    } else {
      sel.classList.remove('on');
      sel.innerHTML = '';
    }
  }

  /** 도구를 끌어서 핫스팟이나 다른 도구에 놓을 수도 있다 (마우스·터치 공통) */
  bindItemDrag(btn, id) {
    let start = null;
    let ghost = null;
    let dragged = false;
    btn.addEventListener('pointerdown', (e) => {
      if (this.busy || HA.ui.isTalking()) return;
      start = { x: e.clientX, y: e.clientY };
      dragged = false;
      btn.setPointerCapture(e.pointerId);
    });
    btn.addEventListener('pointermove', (e) => {
      if (!start) return;
      if (!dragged && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 10) {
        dragged = true;
        ghost = HA.util.h(`<div class="drag-ghost">${this.ep.items[id].icon}</div>`);
        document.getElementById('stage').appendChild(ghost);
      }
      if (ghost) {
        const p = HA.util.toStage(e.clientX, e.clientY);
        ghost.style.left = p.x + 'px';
        ghost.style.top = p.y + 'px';
      }
    });
    const end = (e) => {
      if (!start) return;
      start = null;
      if (ghost) ghost.remove();
      ghost = null;
      if (!dragged) return;
      btn._suppressClick = true;
      const under = document.elementFromPoint(e.clientX, e.clientY);
      const hsEl = under && under.closest('.hs');
      const itEl = under && under.closest('.inv-item');
      if (hsEl) {
        const hs = this.scene.hotspots.find((x) => x.id === hsEl.dataset.hs);
        if (hs) this.useItemOn(id, hs);
      } else if (itEl && itEl.dataset.item !== id) {
        this.combine(id, itEl.dataset.item);
      }
    };
    btn.addEventListener('pointerup', end);
    btn.addEventListener('pointercancel', () => {
      start = null;
      if (ghost) ghost.remove();
      ghost = null;
    });
    btn.addEventListener('click', () => {
      if (btn._suppressClick) {
        btn._suppressClick = false;
        return;
      }
      this.selectItem(id);
    });
  }

  /* ---------- 힌트 · 수첩 · 메뉴 ---------- */
  async hint() {
    if (HA.ui.isTalking() || HA.ui.isModalOpen()) return;
    if (this.busy && !this.puzzleHint) return;
    HA.audio.play('click');
    let text;
    if (this.puzzleHint) text = await this.puzzleHint();
    else text = this.scene.hint ? this.scene.hint(this) : '주변을 눌러 살펴보세요.';
    if (text) await this.say([{ who: 'pili', text }]);
  }

  /** 그림을 크게 보여 주고, 닫으면 다음으로 진행 */
  showPicture(svgHtml, caption) {
    return new Promise((resolve) => {
      HA.ui.modal(`<figure class="picture">${svgHtml}<figcaption>${HA.util.esc(caption || '')}</figcaption>
        <button class="btn primary pic-ok">다 봤어요</button></figure>`, { cls: 'wide', onClose: resolve });
      document.querySelector('.pic-ok').onclick = () => HA.ui.closeModal();
    });
  }

  openNotebook() {
    if (HA.ui.isTalking()) return;
    HA.audio.play('page');
    HA.ui.notebook(this);
  }

  menu() {
    if (HA.ui.isTalking()) return;
    const s = HA.store.data.settings;
    const root = HA.util.h(`<div class="menu-list">
      <h3>메뉴</h3>
      <button class="btn primary" data-a="close">계속하기</button>
      <button class="btn" data-a="notebook">📖 기록 수첩</button>
      <button class="btn" data-a="sound">${s.sound ? '🔊 소리 끄기' : '🔈 소리 켜기'}</button>
      <button class="btn" data-a="exit">🏛 시대 선택으로 나가기 <small>(자동 저장)</small></button>
      <button class="btn danger" data-a="restart">🔄 이 에피소드 처음부터</button>
    </div>`);
    const m = HA.ui.modal(root, { cls: 'small' });
    root.querySelectorAll('button').forEach((b) => {
      b.onclick = async () => {
        const a = b.dataset.a;
        m.close();
        if (a === 'notebook') this.openNotebook();
        if (a === 'sound') {
          s.sound = !s.sound;
          HA.store.save();
          HA.ui.toast(s.sound ? '소리를 켰어요.' : '소리를 껐어요.');
        }
        if (a === 'exit') this.exit();
        if (a === 'restart') {
          if (await HA.ui.confirm('이 에피소드를 처음부터 다시 할까요? 모은 단서가 사라져요. (연대표에 복원한 기록은 남아요)', '처음부터', '취소')) {
            this.exit(() => HA.main.playEpisode(this.ep.id, true));
          }
        }
      };
    });
  }

  exit(then) {
    this.alive = false;
    HA.ui.reset();
    if (then) then();
    else this.onExit();
  }

  /** 에피소드를 마쳤을 때 */
  async complete() {
    this.st.status = 'done';
    this.st.restored = true;
    this.st.completions = (this.st.completions || 0) + 1;
    HA.store.save();
    this.alive = false;
    HA.ui.reset();
    HA.main.showComplete(this.ep.id);
  }
};
