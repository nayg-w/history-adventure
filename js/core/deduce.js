/* 추론판 — '탐구 질문'을 하나 고르고, 그 질문에 답이 될 단서 두 개를 이어 결론을 끌어낸다.
   - 질문마다 빈칸 두 개에 '어떤 관계의 단서'를 넣을지 안내한다 (정답 단서 이름은 말하지 않음).
   - 단서 카드는 종류별로 묶어 보여 주고, ⓘ로 얻은 곳과 내용을 다시 볼 수 있다.
   - 힌트는 학생이 누를 때만 3단계(생각 방향 → 찾아볼 범위 → 구체적인 연결)로 보여 준다.
   - 틀린 연결에는 고른 단서에 맞춘 이유를 알려 주고, 벌점은 없다.
   - 처음 한 번만 짧은 사용법 안내(건너뛰기 가능)를 보여 준다. */
HA.deduce = (() => {
  const { h, esc, shuffle } = HA.util;
  let activeId = null;
  const hintLevels = {}; // 질문별 힌트 단계 (이번 접속 동안)

  function questionList(game) {
    const st = game.st;
    return Object.entries(game.ep.insights || {}).map(([id, q], i) => ({
      id,
      q,
      no: i + 1,
      solved: st.clues.includes(id),
      locked: q.unlock ? !q.unlock(game) : false,
    }));
  }

  /** 틀린 연결: 고른 단서에 맞춘 설명 */
  function feedback(game, list, cur, a, b) {
    const q = cur.q;
    const other = list.find((x) => x !== cur && !x.solved && x.q.from.includes(a) && x.q.from.includes(b));
    if (other) return { head: '🔀 다른 질문의 짝이에요!', lines: [`이 두 단서는 서로 이어지지만, 지금 질문이 아니라 '${other.q.pill}' 질문에 답이 될 것 같아요. 그 질문에서 이어 봐요.`] };
    const note = (id) => q.notes[id] || q.defaultNote;
    const inA = q.from.includes(a);
    const inB = q.from.includes(b);
    const head = '🪢 실이 끊어졌어요.';
    if (inA || inB) return { head, lines: ['두 단서 가운데 하나는 이 질문과 이어져 있어요.', note(inA ? b : a)] };
    const lines = [note(a)];
    if (note(b) !== note(a)) lines.push(note(b));
    return { head, lines };
  }

  function render(page, game, rerender) {
    const ep = game.ep;
    const st = game.st;
    const list = questionList(game);
    const sceneId = st.scene;
    let cur = list.find((x) => x.id === activeId && !x.locked);
    if (!cur) cur = list.find((x) => !x.solved && !x.locked && x.q.scene === sceneId) || list.find((x) => !x.solved && !x.locked) || list.find((x) => !x.locked) || list[0];
    const q = cur.q;
    const owned = st.clues.filter((id) => ep.clues[id]);
    const missing = q.from.some((id) => !owned.includes(id));
    const pick = [null, null];
    const lvl = () => hintLevels[cur.id] || 0;

    const groups = (ep.clueGroups || [{ id: 'all', icon: '📜', title: '단서' }])
      .map((gr) => ({ ...gr, ids: owned.filter((id) => (ep.clues[id].group || 'all') === gr.id) }))
      .filter((gr) => gr.ids.length);

    const root = h(`<div class="ded2">
      <nav class="dq-steps" aria-label="추론 단계">
        ${list
          .map((x) => `<button class="dq-step ${x.id === cur.id ? 'cur' : ''} ${x.solved ? 'done' : ''}" data-q="${x.id}" ${x.locked ? 'disabled' : ''}>
            <span>${x.solved ? '✓' : x.locked ? '🔒' : x.no}</span>${esc(x.locked ? '나중에 열려요' : x.q.pill)}</button>`)
          .join('')}
      </nav>
      <section class="dq-goal" data-tut="goal">
        <div class="dq-goal-top"><small>🎯 지금 풀 탐구 질문 · 추론 ${list.filter((x) => x.solved).length}/${list.length}</small>
          ${cur.solved ? '' : `<button class="btn tiny dq-hint">💡 힌트 <b>${lvl()}/3</b></button>`}</div>
        <h3>${esc(q.question)}</h3>
        ${!cur.solved && missing ? '<p class="dq-missing">🔎 이 질문에 필요한 단서를 아직 다 모으지 못했을 수도 있어요. 장면을 더 살펴봐요.</p>' : ''}
        <p class="dq-hinttext" aria-live="polite"></p>
      </section>
      ${cur.solved
        ? `<div class="dq-solved"><b>✅ ${esc(ep.insights[cur.id].title)}</b><p>${esc(ep.insights[cur.id].text)}</p></div>`
        : `<div class="dq-link" data-tut="link">
            <button class="dq-slot" data-s="0"><em>${esc(q.slots[0])}</em><span class="dq-pick">아래에서 단서를 골라요</span></button>
            <svg class="dq-thread" viewBox="0 0 120 40" aria-hidden="true"><path d="M2 20 Q60 4 118 20"/></svg>
            <button class="dq-slot" data-s="1"><em>${esc(q.slots[1])}</em><span class="dq-pick">아래에서 단서를 골라요</span></button>
            <button class="btn primary dq-go" disabled>🧵 이어 보기</button>
          </div>
          <div class="dq-result" aria-live="polite"></div>`}
      <div class="dq-clues" data-tut="clues">
        ${groups
          .map((gr) => `<section class="dq-group"><h4>${gr.icon} ${esc(gr.title)}</h4>
            ${gr.ids
              .map((id) => {
                const c = ep.clues[id];
                return `<div class="dq-card" data-id="${id}">
                  <button class="dq-sel" data-id="${id}" ${cur.solved ? 'disabled' : ''}><span class="ico">${c.icon}</span><span class="t"><b>${esc(c.title)}</b><small>${esc(c.short || '')}</small></span><i class="num"></i></button>
                  <button class="dq-info" data-id="${id}" aria-label="${esc(c.title)} 다시 보기">ⓘ</button></div>`;
              })
              .join('')}</section>`)
          .join('')}
      </div>
      <div class="dq-detail" hidden></div>
    </div>`);
    page.appendChild(root);

    const $ = (s) => root.querySelector(s);
    root.querySelectorAll('.dq-step').forEach((b) => {
      b.onclick = () => {
        HA.audio.play('page');
        activeId = b.dataset.q;
        rerender();
      };
    });

    // 단서 다시 보기: 얻은 곳 + 내용 (+ 그림)
    root.querySelectorAll('.dq-info').forEach((b) => {
      b.onclick = () => {
        HA.audio.play('page');
        const c = ep.clues[b.dataset.id];
        const d = $('.dq-detail');
        d.hidden = false;
        d.innerHTML = `<div class="dq-detail-card" role="dialog" aria-label="단서 다시 보기">
          <div class="dq-detail-head"><span class="ico">${c.icon}</span><b>${esc(c.title)}</b></div>
          ${c.from ? `<p class="dq-from">📍 얻은 곳: ${esc(c.from)}</p>` : ''}
          <p class="dq-text">${esc(c.text)}</p>
          ${c.picture ? `<div class="dq-pic">${c.picture()}</div>` : ''}
          <button class="btn tiny dq-close">닫기</button></div>`;
        d.querySelector('.dq-close').onclick = () => (d.hidden = true);
        d.onclick = (e) => e.target === d && (d.hidden = true);
        d.querySelector('.dq-close').focus();
      };
    });

    if (!cur.solved) {
      const slots = root.querySelectorAll('.dq-slot');
      const go = $('.dq-go');
      const res = $('.dq-result');
      const sync = () => {
        slots.forEach((s, i) => {
          const id = pick[i];
          s.classList.toggle('full', !!id);
          s.querySelector('.dq-pick').innerHTML = id ? `${ep.clues[id].icon} <b>${esc(ep.clues[id].title)}</b>` : '아래에서 단서를 골라요';
        });
        root.querySelectorAll('.dq-card').forEach((c) => {
          const i = pick.indexOf(c.dataset.id);
          c.classList.toggle('sel', i >= 0);
          c.querySelector('.num').textContent = i >= 0 ? '①②'[i] : '';
        });
        root.classList.toggle('two', !!(pick[0] && pick[1]));
        go.disabled = !(pick[0] && pick[1]);
        $('.dq-link').classList.remove('snap', 'tied');
      };
      root.querySelectorAll('.dq-sel').forEach((b) => {
        b.onclick = () => {
          HA.audio.play('click');
          const id = b.dataset.id;
          const at = pick.indexOf(id);
          if (at >= 0) pick[at] = null;
          else pick[pick[0] ? 1 : 0] = id; // 둘 다 차 있으면 ②를 바꾼다
          res.innerHTML = '';
          sync();
        };
      });
      slots.forEach((s, i) => {
        s.onclick = () => {
          if (!pick[i]) return;
          HA.audio.play('click');
          pick[i] = null;
          res.innerHTML = '';
          sync();
        };
      });

      $('.dq-hint').onclick = () => {
        const n = lvl();
        const steps = ['생각 방향', '찾아볼 범위', '연결 힌트'];
        const i = Math.min(n, 2);
        if (n < 3) {
          hintLevels[cur.id] = n + 1;
          st.stats.hints = (st.stats.hints || 0) + 1;
          HA.store.save();
        }
        HA.audio.play('page');
        $('.dq-hint b').textContent = `${hintLevels[cur.id]}/3`;
        // 가장 최근 단계만 보여 준다 (화면이 길어지지 않게). 다시 누르면 다음 단계
        $('.dq-hinttext').innerHTML = `<span class="lv${i + 1}"><b>${i + 1}단계 · ${steps[i]}</b> ${esc(q.hints[i])}</span>`;
      };

      go.onclick = () => {
        const [a, b] = pick;
        const link = $('.dq-link');
        if (q.from.includes(a) && q.from.includes(b)) {
          HA.audio.play('good');
          link.classList.add('tied');
          go.disabled = true;
          res.innerHTML = `<div class="dq-q"><p class="dq-msg good">✨ 실이 단단히 이어졌어요! 두 단서를 함께 보면 무엇을 알 수 있을까요?</p><div class="dq-choices"></div><p class="dq-why"></p></div>`;
          const box = res.querySelector('.dq-choices');
          const why = res.querySelector('.dq-why');
          const ins = ep.insights[cur.id];
          shuffle(ins.choices).forEach((ch) => {
            const cb = h(`<button class="dq-choice">${esc(ch.text)}</button>`);
            cb.onclick = async () => {
              if (ch.correct) {
                box.querySelectorAll('button').forEach((x) => (x.disabled = true));
                cb.classList.add('right');
                why.className = 'dq-why good';
                why.textContent = ins.text;
                await game.addClue(cur.id);
                activeId = null;
                setTimeout(rerender, 250);
              } else {
                HA.audio.play('wrong');
                cb.disabled = true;
                cb.classList.add('wrong');
                why.className = 'dq-why bad';
                why.textContent = ch.why;
              }
            };
            box.appendChild(cb);
          });
          return;
        }
        HA.audio.play('wrong');
        link.classList.add('snap');
        const fb = feedback(game, list, cur, a, b);
        res.innerHTML = `<div class="dq-msg bad"><b>${fb.head}</b>${fb.lines.map((t) => `<p>${esc(t)}</p>`).join('')}<small>단서를 바꿔 다시 이어 봐요. 틀려도 괜찮아요!</small></div>`;
      };
      sync();
    }

    if (!HA.store.data.settings.dedTutorialSeen) tutorial(root);
  }

  /** 처음 한 번만 보이는 사용법 안내 (건너뛸 수 있음, 정답은 채워 주지 않음) */
  function tutorial(root) {
    const steps = [
      { el: 'goal', title: '① 질문 읽기', text: '맨 위의 탐구 질문이 지금 풀 문제예요. 위쪽 단계 버튼으로 다른 질문을 고를 수도 있어요.' },
      { el: 'clues', title: '② 단서 고르기', text: '단서 카드를 누르면 빈칸에 들어가요. 다시 누르면 빠져요. ⓘ를 누르면 그 단서를 어디서 얻었는지 다시 볼 수 있어요.' },
      { el: 'link', title: '③ 이어 보고 확인하기', text: "두 단서를 고르고 '이어 보기'! 실이 이어지면 알맞은 결론을 고르고, 끊어지면 이유를 읽고 다시 해 봐요. 막히면 💡힌트를 눌러요." },
    ];
    let i = 0;
    const box = h(`<div class="dq-tut" role="dialog" aria-label="추론판 사용법"><div class="dq-tut-card">
      <small>추론판 사용법 <span class="n"></span></small><h4></h4><p></p>
      <div class="row"><button class="btn ghost-dark dq-skip">건너뛰기</button><button class="btn primary dq-next"></button></div></div></div>`);
    // 수첩(스크롤 영역) 바깥, 무대 위에 띄워 항상 보이게 한다
    document.getElementById('stage').appendChild(box);
    const clear = () => document.querySelectorAll('.tut-focus').forEach((x) => x.classList.remove('tut-focus'));
    const end = () => {
      HA.store.data.settings.dedTutorialSeen = true;
      HA.store.save();
      clear();
      box.remove();
    };
    const show = () => {
      const s = steps[i];
      clear();
      const el = root.querySelector(`[data-tut="${s.el}"]`);
      if (el) {
        el.classList.add('tut-focus');
        el.scrollIntoView({ block: 'nearest' });
      }
      box.classList.toggle('top', s.el === 'clues');
      box.querySelector('.n').textContent = `${i + 1}/${steps.length}`;
      box.querySelector('h4').textContent = s.title;
      box.querySelector('p').textContent = s.text;
      box.querySelector('.dq-next').textContent = i < steps.length - 1 ? '다음 ▶' : '시작하기';
      box.querySelector('.dq-next').focus();
    };
    box.querySelector('.dq-skip').onclick = end;
    box.querySelector('.dq-next').onclick = () => (++i < steps.length ? show() : end());
    // 수첩을 닫으면 안내도 함께 닫는다 (다음에 다시 보이도록 '봤음'으로 남기지 않음)
    const watch = setInterval(() => {
      if (!document.body.contains(root)) {
        clearInterval(watch);
        clear();
        box.remove();
      }
    }, 300);
    show();
  }

  /** 새로 '풀 준비가 된' 질문이 생겼는지 (어느 질문·어느 단서인지는 말하지 않음) */
  function readyQuestions(game) {
    return questionList(game).filter((x) => !x.solved && !x.locked && x.q.from.every((id) => game.st.clues.includes(id)));
  }

  /** 수첩을 새로 열 때: 지금 장면에서 풀 질문부터 보여 준다 */
  function reset() {
    activeId = null;
  }

  return { render, readyQuestions, reset };
})();
