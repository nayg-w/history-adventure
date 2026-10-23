/* =====================================================================
   에피소드: 고려의 사라진 기록 — 거란의 침입과 고려의 대응
   ---------------------------------------------------------------------
   ● 실제 역사: 단서(clues)의 kind:'history', 마지막 정리(summary.points)
   ● 게임 속 설정: 필이·바우·근심 많은 관리, 정찰 보고서, 시간의 서고 등
   ● 실존 인물의 대사는 『고려사』 등에 전하는 내용을 바탕으로 쉽게 다시 쓴 창작 대사
   ===================================================================== */
(() => {
  const ART = HA.art.goryeo;
  const fig = HA.art.figure;

  /* ---------- 인물 ---------- */
  const looks = {
    seohui: { robe: '#2f5d8a', dark: '#244a70', hat: 'bokdu', beard: 'black', expr: 'proud', hold: 'fan' },
    sosonnyeong: { robe: '#7a4a2a', dark: '#5e3a20', trim: '#d9c3a0', belt: '#d9c3a0', hat: 'fur', beard: 'black', expr: 'serious' },
    official: { robe: '#5f8a52', dark: '#4b7040', hat: 'bokdu', expr: 'worried', hold: 'scroll' },
    gang: { robe: '#8e2a22', dark: '#6e1f19', hat: 'helmet', beard: 'white', armor: true, expr: 'proud' },
    bau: { robe: '#4a6a8a', dark: '#3a5670', hat: 'cap', expr: 'smile', hold: 'spear' },
  };
  const REAL = '실존 인물 · 대사는 창작';
  const FICTION = '게임 속 가상 인물';
  const characters = {
    pili: { name: '필이', tag: FICTION, real: false, color: '#d9a43b', portrait: () => HA.art.pili({ portrait: true }), bio: '시간의 서고를 지키는 붓이에요. 기록자를 돕는 길잡이로, 게임에서 만든 캐릭터예요.' },
    seohui: { name: '서희', tag: REAL, real: true, color: '#2f5d8a', portrait: () => fig(looks.seohui, { portrait: true }), bio: '고려의 관리(942~998). 993년 거란의 1차 침입 때 소손녕과 담판을 벌여 거란군을 돌려보내고 강동 6주를 얻었어요.' },
    sosonnyeong: { name: '소손녕', tag: REAL, real: true, color: '#7a4a2a', portrait: () => fig(looks.sosonnyeong, { portrait: true }), bio: '거란의 장수. 993년 고려에 쳐들어와 서희와 담판을 벌였어요.' },
    official: { name: '근심 많은 관리', tag: FICTION, real: false, color: '#5f8a52', portrait: () => fig(looks.official, { portrait: true }), bio: '993년 고려 조정의 분위기를 전해 주는, 게임에서 만든 인물이에요.' },
    gang: { name: '강감찬', tag: REAL, real: true, color: '#8e2a22', portrait: () => fig(looks.gang, { portrait: true }), bio: '고려의 관리이자 장수(948~1031). 거란의 3차 침입 때 상원수(총사령관)가 되어 1019년 귀주대첩을 이끌었어요.' },
    bau: { name: '병사 바우', tag: FICTION, real: false, color: '#4a6a8a', portrait: () => fig(looks.bau, { portrait: true }), bio: '흥화진 근처 고려군 진영의 젊은 병사. 게임에서 만든 인물이에요.' },
  };

  /* ---------- 단서 (실제 역사) ---------- */
  const clues = {
    claims: { icon: '📜', title: '소손녕의 두 가지 주장', short: '고구려 땅 · 송과의 교류', year: '993년', kind: 'history',
      text: '① 고려는 신라 땅에서 일어났으니 고구려의 옛 땅은 거란의 것이다. ② 고려는 거란과 땅이 맞닿아 있는데 왜 바다 건너 송과만 교류하는가? (실제 담판에서 소손녕이 한 주장이에요.)' },
    name: { icon: '🚩', title: "나라 이름 '고려'", short: '고구려를 잇는다는 뜻', kind: 'history',
      text: "'고려'라는 이름에는 고구려를 이어받았다는 뜻이 담겨 있어요. 고려는 고구려의 옛 도읍 평양을 '서경'이라 부르며 중요하게 여겼어요." },
    jurchen: { icon: '🗺️', title: '압록강 가의 여진', short: '고려와 거란 사이를 막음', kind: 'history',
      text: '압록강 주변에는 여진이 살고 있었어요. 그래서 고려와 거란 사이를 오가는 길이 막혀 있었어요.' },
    balhae: { icon: '📚', title: '발해의 멸망', short: '거란이 발해를 무너뜨림', year: '926년', kind: 'history',
      text: '926년 거란이 발해를 멸망시켰어요. 고려는 발해 사람들을 받아들이고, 거란을 경계했어요.' },
    gangdong: { icon: '🧱', title: '강동 6주', short: '압록강 동쪽의 6개 성', year: '994년~', kind: 'history',
      text: '서희의 담판 뒤 고려는 압록강 동쪽의 여진을 몰아내고 흥화진·용주·통주·철주·귀주·곽주에 성을 쌓았어요. 고려의 땅이 압록강까지 넓어졌어요.' },
    invasion2: { icon: '🔥', title: '거란의 2차 침입', short: '개경이 함락됨', year: '1010년', kind: 'history',
      text: '1010년 거란 임금이 직접 군대를 이끌고 쳐들어왔어요. 개경이 함락되어 현종은 남쪽 나주까지 피란했어요. 양규 등이 끝까지 맞서 싸웠어요.' },
    demand: { icon: '✉️', title: '거란의 요구', short: '강동 6주를 돌려 달라', year: '1018년', kind: 'history',
      text: '거란은 고려 임금이 직접 와서 예를 갖출 것과 강동 6주를 돌려줄 것을 요구했어요. 고려가 거절하자 1018년 소배압이 10만 군사를 이끌고 세 번째로 쳐들어왔어요.' },
    heunghwa: { icon: '🌊', title: '흥화진 냇물 작전', short: '쇠가죽으로 막았다 터뜨림', year: '1018년', kind: 'history',
      text: '강감찬은 쇠가죽(소가죽)을 밧줄로 꿰어 냇물을 막고 기병을 숨겨 두었다가, 거란군이 건널 때 물을 터뜨리고 공격했다고 전해져요.' },
    guiju: { icon: '🏆', title: '귀주대첩', short: '강감찬의 큰 승리', year: '1019년', kind: 'history',
      text: '1019년 강감찬이 이끄는 고려군이 귀주에서 돌아가던 거란군을 크게 물리쳤어요. 살아 돌아간 거란군은 몇 천 명뿐이었다고 해요.' },
  };

  /* ---------- 도구 ---------- */
  const items = {
    cowhide: { icon: '🐂', title: '쇠가죽', text: '소의 가죽이에요. 단단하고 물이 잘 새지 않아요.' },
    rope: { icon: '🪢', title: '굵은 밧줄', text: '무언가를 줄줄이 꿰어 묶을 수 있어요.' },
    damKit: { icon: '🛡️', title: '쇠가죽 둑', text: '밧줄로 쇠가죽을 줄줄이 꿰어 만든 물막이예요.' },
  };
  const recipes = [
    { a: 'cowhide', b: 'rope', result: 'damKit',
      lines: [{ who: 'pili', text: '밧줄로 쇠가죽을 줄줄이 꿰었어요! 이걸로 냇물을 막을 수 있겠어요.' }] },
  ];

  /* ---------- 퍼즐 설정 ---------- */
  const debate = {
    goal: '소손녕의 주장에 맞는 단서 카드를 내밀어요',
    bg: ART.tent,
    left: 'seohui',
    right: 'sosonnyeong',
    leftFig: () => fig(looks.seohui),
    rightFig: () => fig(looks.sosonnyeong),
    intro: [
      { who: 'pili', text: '서희가 거란 진영에 도착했어요. 드디어 담판이 시작돼요!' },
      { who: 'sosonnyeong', text: '나는 큰 나라의 귀한 장수요. 그대는 뜰 아래에서 내게 절을 하시오!' },
      { who: 'seohui', text: '뜰에서 절하는 것은 신하가 임금을 뵐 때의 예법이오. 두 나라의 신하가 만나는 자리에서 어찌 그러겠소?' },
      { who: 'pili', text: '기록에 따르면 서희는 숙소로 돌아가 물러서지 않았고, 결국 두 사람은 대등하게 마주 앉았대요.' },
      { who: 'pili', text: '이제 소손녕의 말을 잘 듣고, 아래 카드 중에서 반박할 단서를 내밀어요!' },
    ],
    rounds: [
      {
        claim: '고려는 신라 땅에서 일어난 나라요. 고구려의 옛 땅은 우리 거란의 것인데, 어찌 고려가 차지하고 있소?',
        answer: 'name',
        success: [
          { who: 'seohui', text: "그렇지 않소. 우리나라는 고구려를 이은 나라요. 그래서 나라 이름을 '고려'라 하고, 평양을 서경으로 삼았소." },
          { who: 'seohui', text: '땅의 경계로 따진다면, 거란의 동경도 본래 고구려 땅이었으니 오히려 우리 땅이라 해야 하오!' },
          { who: 'sosonnyeong', text: '으음…!' },
        ],
        wrong: {
          claims: '그건 내가 한 말 아니오! 내 말을 되풀이해서 무엇 하겠소?',
          balhae: '발해 이야기는 지금 상관없소! 고구려 땅이 누구 것이냐고 물었소.',
          jurchen: '여진 이야기는 나중에 하시오. 고구려 땅의 주인이 누구냐고 물었소!',
        },
        hints: [
          '소손녕은 고려가 고구려와 상관없는 나라라고 해요. 고려가 고구려를 이었다는 걸 보여 줄 단서는 무엇일까요?',
          "나라 이름에 비밀이 있어요. '나라 이름 고려' 카드를 내밀어 보세요!",
        ],
      },
      {
        claim: '그렇다면 묻겠소. 고려는 우리 거란과 땅이 맞닿아 있는데, 어째서 바다 건너 송나라와만 사귀는 것이오?',
        answer: 'jurchen',
        success: [
          { who: 'seohui', text: '압록강 안팎을 여진이 가로막고 있어서, 거란으로 가는 길이 막혀 있기 때문이오.' },
          { who: 'seohui', text: '여진을 몰아내고 우리 옛 땅에 성을 쌓아 길을 통하게 한다면, 어찌 거란과 사귀지 않겠소?' },
          { who: 'pili', text: "서희는 알아챘어요. 거란이 정말 바란 것은 땅보다 '고려가 송과 가까이 지내지 않는 것'이었어요!" },
        ],
        wrong: {
          claims: '그건 내가 한 말 아니오! 왜 우리와 사귀지 않느냐고 물었소.',
          name: '나라 이름 이야기는 이미 들었소. 왜 우리와 교류하지 않느냐고 물었소!',
          balhae: '발해 일은 지난 일이오. 지금 왜 우리와 교류하지 않느냐 이 말이오!',
        },
        hints: [
          '고려와 거란 사이에 무엇이 있어서 오가기 어려웠을까요? 지도에서 찾은 단서를 떠올려 봐요.',
          "'압록강 가의 여진' 카드를 내밀어 보세요!",
        ],
      },
    ],
    wrongDefault: '그것으로는 나를 설득할 수 없소!',
    outro: [
      { who: 'sosonnyeong', text: '…그대의 말에 일리가 있소. 군대를 물리겠소.' },
      { who: 'pili', text: '서희가 싸우지 않고 말로 거란군을 돌려보냈어요!' },
      { who: 'pili', text: '게다가 압록강 동쪽 땅에 성을 쌓아도 좋다는 약속까지 받아 냈어요.' },
    ],
  };

  const M = ART.map;
  const mapCfg = {
    goal: '강동 6주를 알맞은 곳에 쌓아요',
    caption: { year: '994년~', place: '압록강 동쪽' },
    title: '강동 6주 쌓기',
    text: '고려는 압록강 동쪽의 여진을 몰아내고 성 6개를 쌓았어요. 성을 지도 위 알맞은 곳에 끌어다 놓거나, 성을 누른 다음 지도를 눌러요.',
    base: ART.mapBase,
    zones: {
      gangdong: { poly: M.zones.gangdong, label: '압록강과 청천강 사이 바닷가 쪽' },
      khitan: { poly: M.zones.khitan, label: '압록강 북쪽', feedback: '압록강 너머 북쪽은 거란 땅이에요. 압록강 안쪽, 고려 쪽에 쌓아야 해요!' },
      inland: { poly: M.zones.inland, label: '압록강과 청천강 사이 깊은 산골', feedback: '조금 더 서쪽이에요! 6주는 바다와 가까운 쪽에 쌓았어요.' },
      south: { poly: M.zones.south, label: '청천강 남쪽', feedback: '청천강 남쪽은 이미 고려가 다스리던 땅이에요(서경이 있는 곳). 더 북쪽으로!' },
    },
    correctZone: 'gangdong',
    outside: '바다에는 성을 쌓을 수 없어요!',
    tokens: [
      { id: 'heunghwa', label: '흥화진', x: 250, y: 242 },
      { id: 'yong', label: '용주', x: 262, y: 286 },
      { id: 'cheol', label: '철주', x: 290, y: 330 },
      { id: 'tong', label: '통주', x: 340, y: 312 },
      { id: 'gwak', label: '곽주', x: 318, y: 362 },
      { id: 'gwi', label: '귀주', x: 400, y: 268 },
    ],
    borderPath: M.rivers.amnok,
    doneLabel: '강동 6주 완성! 고려의 땅이 압록강까지 넓어졌어요.',
    intro: [
      { who: 'pili', text: '994년부터 고려는 압록강 동쪽의 여진을 몰아내고 성을 쌓기 시작했어요. 서희가 앞장섰지요.' },
      { who: 'pili', text: "'강동'은 '강의 동쪽'이라는 뜻이에요. 6개의 성을 지도의 알맞은 곳에 놓아 볼까요?" },
    ],
    hints: [
      "'강동'은 강의 동쪽이라는 뜻이에요. 어느 강일까요? 수첩의 '압록강 가의 여진' 단서를 떠올려 봐요.",
      '압록강과 청천강 사이, 바닷가 쪽이에요. 지도에 빛나는 곳을 보세요!',
    ],
    success: [
      { who: 'pili', text: "고려의 땅이 압록강까지 넓어졌어요! 이 성들을 '강동 6주'라고 불러요." },
      { who: 'pili', text: "'흥화진'과 '귀주'를 기억해 두세요. 곧 다시 나온답니다!" },
    ],
  };

  const damCfg = {
    goal: '강감찬의 냇물 작전을 펼쳐요',
    caption: { year: '1018년 12월', place: '흥화진 앞 냇물' },
    bg: ART.damField,
    kit: { label: '쇠가죽 둑', icon: '🛡️' },
    steps: ['쇠가죽 둑으로 냇물 위쪽 막기', '골짜기 숲에 기병 숨기기', '거란군이 냇바닥을 건널 때 둑 터뜨리기'],
    intro: [
      { who: 'gang', text: '적은 흥화진 앞 냇물을 건너올 것이오. 작전은 세 가지요.' },
      { who: 'gang', text: '첫째, 쇠가죽 둑으로 냇물 위쪽을 막는다. 둘째, 기병을 골짜기 숲에 숨긴다.' },
      { who: 'gang', text: '셋째, 적이 마른 냇바닥을 건널 때 둑을 터뜨린다!' },
    ],
    msg: {
      start: "오른쪽 '쇠가죽 둑'을 왼쪽 '둑 자리'로 끌어다 놓아요. (눌러서 고른 뒤 둑 자리를 눌러도 돼요)",
      pickSpot: "이제 왼쪽의 '둑 자리'를 눌러요.",
      needKit: "먼저 오른쪽 '쇠가죽 둑'을 골라요.",
      wrongSpot: "거기가 아니에요. 냇물 위쪽(왼쪽)의 '둑 자리'에 놓아요.",
      dammed: '냇물이 막혔어요! 아래쪽 냇바닥이 말라 가요.',
      hidden: '기병들이 골짜기 숲에 몸을 숨겼어요.',
      hideFirst: '아직이에요! 먼저 골짜기 숲에 기병을 숨겨요.',
      wait: '거란군이 다가와요… 냇바닥 한가운데에 들어올 때를 기다려요!',
      now: '지금이에요! 둑을 터뜨려요!',
      early: '아직이에요! 거란군이 냇바닥 한가운데에 들어올 때까지 기다려요.',
      missed: '거란군이 지나가 버렸어요. 곧 다음 무리가 와요!',
      success: '물이 쏟아져 거란군이 흩어졌어요!',
    },
    hints: {
      dam: "작전 1번! '쇠가죽 둑'을 냇물 왼쪽 '둑 자리'에 놓아요.",
      hide: "작전 2번! 오른쪽 아래 '골짜기 숲'을 눌러 기병을 숨겨요.",
      release: "거란군이 냇바닥 한가운데에 오면 '둑 터뜨리기!'를 눌러요. 놓쳐도 다음 무리가 와요.",
    },
    success: [
      { who: 'gang', text: '지금이다! 숨어 있던 기병들, 공격하라!' },
      { who: 'pili', text: '기록에 따르면 강감찬은 이렇게 흥화진에서 거란군에게 큰 피해를 주었대요.' },
    ],
  };

  const guijuCfg = {
    goal: '깃발로 공격 신호를 보내요',
    caption: { year: '1019년 2월', place: '귀주' },
    bg: ART.guiju,
    layer: () => {
      const r = (c, f, list) => list.map(([x, y]) => `<g transform="translate(${x} ${y}) scale(1.4)">${HA.art.rider(c, f, 1)}</g>`).join('');
      return `<svg viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
        <g class="enemy-army">${r('#6b3f22', '#d9c3a0', [[820, 450], [900, 480], [980, 440], [1060, 470], [860, 530], [960, 540], [1050, 530], [1140, 500]])}</g>
        <g class="ally-army">${r('#2f5d8a', '#b8352a', [[380, 520], [460, 560], [540, 520], [620, 560], [420, 620], [520, 640], [610, 620]])}</g>
        <svg x="60" y="390" width="150" height="244" viewBox="0 0 160 260">${fig(looks.gang).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg>
      </svg>`;
    },
    target: {
      x: 200, y: 270, w: 150, h: 300, label: '고려군 깃발',
      art: () => `<svg viewBox="0 0 150 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M30 296 V20" stroke="#5a4030" stroke-width="8"/>
        <circle cx="30" cy="16" r="8" fill="#d4a63c"/>
        <path class="flag-cloth" d="M34 26 Q90 16 146 30 Q126 70 146 110 Q90 100 34 112 Z" fill="#b8352a" stroke="#e8c55a" stroke-width="3"/>
      </svg>`,
    },
    intro: [
      { who: 'gang', text: '지친 거란군이 돌아가고 있구나. 여기 귀주에서 결판을 내자!' },
      { who: 'pili', text: '기록에 따르면 싸움이 한창일 때 남쪽에서 비바람이 불어와, 고려군 깃발이 적군 쪽으로 휘날렸대요.' },
      { who: 'pili', text: '바람이 고려군을 돕고 있어요!' },
    ],
    prompt: '반짝이는 깃발을 눌러 공격 신호를 보내요!',
    hints: ['반짝이는 깃발을 눌러 보세요!'],
    banner: { title: '귀주대첩', sub: '1019년 · 강감찬' },
    success: [
      { who: 'pili', text: "고려군이 거란군을 크게 물리쳤어요! 이 싸움을 '귀주대첩'이라고 해요." },
      { who: 'pili', text: '거란군 10만 명 가운데 살아 돌아간 사람은 몇 천 명뿐이었다고 해요.' },
    ],
  };

  const timelineCfg = {
    goal: '기록 조각을 일어난 순서대로 놓아요',
    caption: { year: '시간의 서고', place: '기록 복원 ①' },
    title: '찢어진 기록 붙이기 ① — 순서',
    text: '일이 일어난 순서대로 조각을 놓아요. 제자리에 놓인 조각에는 연도가 나타나요.',
    cards: [
      { id: 't1', icon: '📚', text: '거란이 발해를 멸망시키다', year: '926년' },
      { id: 't2', icon: '🗣️', text: '서희가 소손녕과 담판을 벌이다', year: '993년' },
      { id: 't3', icon: '🧱', text: '고려가 강동 6주를 쌓다', year: '994년~' },
      { id: 't4', icon: '🔥', text: '거란의 2차 침입으로 개경이 함락되다', year: '1010년' },
      { id: 't5', icon: '🌊', text: '흥화진에서 냇물을 터뜨려 거란군을 치다', year: '1018년' },
      { id: 't6', icon: '🏆', text: '강감찬이 귀주에서 크게 이기다', year: '1019년' },
    ],
    intro: [
      { who: 'pili', text: '기록자님 덕분에 단서가 모두 모였어요!' },
      { who: 'pili', text: '먼저 찢어진 기록 조각을 일어난 순서대로 붙여 봐요. 헷갈리면 📖수첩의 단서에 적힌 연도를 살펴봐요!' },
    ],
    hints: [
      '원인이 먼저, 결과가 나중이에요. 담판을 해야 성을 쌓을 수 있겠죠? 수첩의 단서 카드에도 연도가 적혀 있어요.',
      '다른 조각도 수첩의 연도를 보며 맞춰 봐요.',
    ],
    success: [{ who: 'pili', text: '순서가 딱 맞았어요! 이제 사건들이 왜 이어졌는지 실로 묶어 봐요.' }],
  };

  const linkCfg = {
    goal: '원인과 결과를 실로 이어요',
    caption: { year: '시간의 서고', place: '기록 복원 ②' },
    title: '찢어진 기록 붙이기 ② — 원인과 결과',
    text: '왼쪽의 원인과 오른쪽의 결과를 이어요. 모두 이으면 기록이 완성돼요.',
    pairs: [
      { cause: '거란이 발해를 멸망시켰어요', effect: '고려가 거란을 경계했어요', explain: '발해를 무너뜨린 거란을 고려는 믿지 않고 경계했어요.' },
      { cause: '서희가 거란이 정말 바라는 것을 알아챘어요', effect: '싸우지 않고 강동 6주를 얻었어요', explain: '거란은 고려가 송과 가까이 지내는 것을 막고 싶어 했어요. 서희는 이 점을 이용해 협상했어요.' },
      { cause: '고려가 강동 6주를 돌려주지 않았어요', effect: '거란이 1018년에 다시 쳐들어왔어요', explain: '거란은 강동 6주를 돌려 달라고 했지만 고려는 거절했어요.' },
      { cause: '강감찬이 귀주에서 크게 이겼어요', effect: '거란이 더는 크게 쳐들어오지 못했어요', explain: '귀주대첩 뒤 고려와 거란은 화해했고, 오랫동안 평화가 이어졌어요.' },
      { cause: '거란의 침입을 여러 번 겪었어요', effect: '침입에 대비해 나성과 천리장성을 쌓았어요', explain: '고려는 개경을 둘러싼 나성과, 북쪽 국경을 따라 천리장성을 쌓았어요.' },
    ],
    intro: [{ who: 'pili', text: "역사는 '왜?'와 '그래서'로 이어져 있어요. 원인과 결과를 실로 이어 볼까요?" }],
    hints: ["오른쪽 결과를 하나 골라 '이 일은 왜 일어났을까?' 하고 거꾸로 생각해 봐요."],
    success: [{ who: 'pili', text: '모든 실이 이어졌어요! 이제 기록이 다시 쓰여요…!' }],
  };

  /* ---------- 진행 흐름 ---------- */
  const COURT_KEYS = ['claims', 'name', 'jurchen', 'balhae'];
  const CAMP_KEYS = ['invasion2', 'demand'];
  const count = (g, keys) => keys.filter((k) => g.has(k)).length;

  async function mapStep(g) {
    await g.puzzle('mapPlace', mapCfg);
    g.setFlag('mapDone');
    await g.addClue('gangdong');
    await g.say([
      { who: 'pili', text: '그런데 거란은 강동 6주를 내준 것을 곧 아까워했대요…' },
      { who: 'pili', text: '시간을 건너 25년 뒤, 1018년으로 가 봐요!' },
    ]);
    await g.goto('camp');
  }

  async function guijuStep(g) {
    await g.say([
      { who: 'pili', text: '흥화진에서 피해를 입었지만, 소배압은 개경을 노리고 남쪽으로 계속 내려갔어요.' },
      { who: 'pili', text: '하지만 고려가 개경을 굳게 지키자, 거란군은 어쩔 수 없이 되돌아가기 시작했어요.' },
      { who: 'pili', text: '강감찬은 돌아가는 거란군을 귀주에서 기다렸어요. 1019년 2월이에요!' },
    ]);
    await g.puzzle('signal', guijuCfg);
    g.setFlag('guijuDone');
    await g.addClue('guiju');
    await g.say([{ who: 'pili', text: '이제 모은 단서로 찢어진 기록을 복원하러 가요!' }]);
    await g.goto('archive');
  }

  async function restoreStep(g) {
    if (!g.flag('timelineDone')) {
      await g.puzzle('timeline', timelineCfg);
      g.setFlag('timelineDone');
    }
    if (!g.flag('linksDone')) {
      await g.puzzle('causeLink', linkCfg);
      g.setFlag('linksDone');
    }
    await g.puzzle('restore', { goal: '기록이 복원되고 있어요', title: '고려의 사라진 기록', points: summary.points });
    await g.complete();
  }

  /* ---------- 마지막 정리 (실제 역사) ---------- */
  const summary = {
    title: '고려의 사라진 기록 — 거란의 침입',
    points: [
      { year: '926년', text: '거란이 발해를 멸망시켰어요. 고려는 거란을 경계했어요.' },
      { year: '993년', text: '거란의 1차 침입. 서희가 소손녕과 담판을 벌여 싸우지 않고 거란군을 돌려보냈어요.' },
      { year: '994년~', text: '고려가 압록강 동쪽의 여진을 몰아내고 강동 6주를 쌓았어요.' },
      { year: '1010년', text: '거란의 2차 침입. 개경이 함락되었지만 고려는 끝까지 맞섰어요.' },
      { year: '1018년', text: '거란의 3차 침입. 강감찬이 흥화진에서 냇물을 이용해 거란군을 공격했어요.' },
      { year: '1019년', text: '강감찬이 귀주에서 거란군을 크게 물리쳤어요(귀주대첩).' },
      { year: '그 뒤', text: '고려는 개경에 나성, 북쪽 국경에 천리장성을 쌓아 대비했어요. 고려·송·거란 사이에 평화가 이어졌어요.' },
    ],
    keyIdea: '서희는 말(외교)로, 강감찬은 지혜로운 작전으로 나라를 지켰어요.',
    think: ['서희가 싸우지 않고도 땅을 얻을 수 있었던 까닭은 무엇일까요?', '1차 침입과 3차 침입은 서로 어떻게 이어져 있을까요?'],
    fiction: [
      '필이, 병사 바우, 근심 많은 관리는 게임에서 만든 인물이에요.',
      '시간의 서고, 정찰 보고서, 궁궐의 고양이와 깃발 장식은 게임 속 설정이에요.',
      '서희·소손녕·강감찬의 대사는 역사 기록을 바탕으로 쉽게 다시 쓴 창작 대사예요.',
      '지도는 단순하게 그렸고, 성의 위치는 대략적이에요.',
      '냇물 작전·깃발 신호 퍼즐의 진행 방식은 게임을 위해 만든 것이에요.',
    ],
  };

  /* ---------- 장면 ---------- */
  const scenes = {
    court: {
      id: 'court',
      caption: { year: '993년', place: '고려 조정' },
      bg: ART.court,
      objective: (g) =>
        count(g, COURT_KEYS) < 4 ? `서희를 도울 단서 찾기 (${count(g, COURT_KEYS)}/4)` : '서희에게 말을 걸어 담판을 떠나요',
      hint: (g) => {
        const n = count(g, COURT_KEYS);
        if (n >= 4) return '단서를 모두 모았어요! 파란 옷을 입은 서희를 눌러 보세요.';
        if (!g.has('claims')) return '왼쪽 탁자 위 두루마리를 살펴봐요. 거란이 무엇을 주장하는지 알 수 있어요.';
        if (!g.has('jurchen')) return '가운데 탁자 위의 지도를 살펴봐요.';
        if (!g.has('name')) return '오른쪽 벽에 걸린 붉은 깃발을 살펴봐요.';
        return '오른쪽 아래 책 더미를 살펴봐요.';
      },
      onEnter: async (g, first) => {
        if (g.flag('debateDone') && !g.flag('mapDone')) return mapStep(g);
        if (first)
          await g.say([
            { who: 'official', text: '큰일이오! 거란 장수 소손녕이 대군을 이끌고 쳐들어왔소!' },
            { who: 'official', text: '어떤 신하들은 서경 북쪽 땅을 떼어 주고 화해하자고까지 하오…' },
            { who: 'seohui', text: '땅을 내주는 것은 안 될 말이오. 내가 적진에 가서 소손녕과 담판을 짓겠소.' },
            { who: 'pili', text: "'담판'은 서로 만나 따지고 의논해서 일을 결정하는 거예요." },
            { who: 'pili', text: '서희가 말로 이길 수 있도록, 이 방에서 단서 4개를 찾아 줘요! 반짝이는(✦) 곳을 눌러 봐요.' },
          ]);
      },
      hotspots: [
        {
          id: 'report', label: '탁자 위 두루마리', x: 30, y: 470, w: 180, h: 130, art: ART.reportTable,
          onClick: async (g) => {
            if (g.has('claims')) return g.say([{ who: 'pili', text: '소손녕의 두 가지 주장이 적혀 있어요. 수첩에서 다시 볼 수 있어요.' }]);
            await g.say([
              { who: 'pili', text: '거란 진영을 살피고 온 정찰병의 보고서예요. (이 보고서는 게임 속 설정이에요.)' },
              { who: 'pili', text: "'소손녕은 이렇게 따질 것입니다. 첫째, 고구려의 옛 땅은 거란의 것이다!'" },
              { who: 'pili', text: "'둘째, 고려는 왜 이웃한 거란을 두고 바다 건너 송나라와만 사귀는가!'" },
            ]);
            await g.addClue('claims');
            await g.say([{ who: 'pili', text: '이 두 주장을 반박할 단서가 필요해요!' }]);
          },
        },
        {
          id: 'seohui', label: '서희', x: 240, y: 280, w: 150, h: 245, art: () => fig(looks.seohui),
          onClick: async (g) => {
            const n = count(g, COURT_KEYS);
            if (n < 4)
              return g.say([
                { who: 'seohui', text: '소손녕은 말솜씨가 대단하다 하오. 그를 설득하려면 근거가 더 필요하오.' },
                { who: 'pili', text: `지금까지 찾은 단서는 ${n}개예요. 방을 더 둘러봐요!` },
              ]);
            await g.say([
              { who: 'seohui', text: '단서를 모두 모았구려. 이제 소손녕을 만나러 가겠소!' },
              { who: 'pili', text: '기록자님, 담판에서는 소손녕의 말에 맞는 단서 카드를 내밀어 서희를 도와요.' },
            ]);
            await g.puzzle('debate', Object.assign({ caption: { year: '993년', place: '거란 진영' } }, debate));
            g.setFlag('debateDone');
            await mapStep(g);
          },
        },
        {
          id: 'map', label: '탁자 위 지도', x: 470, y: 480, w: 280, h: 140, art: ART.mapTable,
          onClick: async (g) => {
            await g.showPicture(`<svg viewBox="0 0 800 640" xmlns="http://www.w3.org/2000/svg">${ART.mapBase()}</svg>`, '고려 북쪽 지도 (단순하게 그린 지도)');
            if (g.has('jurchen')) return g.say([{ who: 'pili', text: '압록강 주변의 여진이 길을 막고 있었지요.' }]);
            await g.say([
              { who: 'pili', text: "지도의 압록강 근처에 '여진'이라고 적혀 있어요." },
              { who: 'pili', text: '여진이 사는 땅이 고려와 거란 사이를 가로막고 있네요!' },
            ]);
            await g.addClue('jurchen');
          },
        },
        {
          id: 'official', label: '근심 많은 관리', x: 790, y: 290, w: 150, h: 245, art: () => fig(looks.official),
          onClick: async (g) => {
            if (count(g, COURT_KEYS) >= 4) return g.say([{ who: 'official', text: '서희 공이 기다리고 계시오. 어서 가 보시오!' }]);
            await g.say([
              { who: 'official', text: '거란이 왜 쳐들어왔는지 아시오? 그들이 무엇을 바라는지부터 알아야 하오.' },
              { who: 'official', text: '저 탁자 위에 정찰병이 가져온 보고서가 있소. 그리고 지도와 옛 기록도 살펴보시오.' },
            ]);
          },
        },
        {
          id: 'banner', label: '붉은 깃발', x: 990, y: 120, w: 100, h: 260, art: ART.banner,
          onClick: async (g) => {
            if (g.has('name')) return g.say([{ who: 'pili', text: "'고려'라는 이름에는 고구려를 잇는다는 뜻이 있어요." }]);
            await g.say([
              { who: 'pili', text: "'高麗(고려)'라고 쓰여 있어요. (이 깃발은 게임 속 장식이에요.)" },
              { who: 'pili', text: "그런데 '고려'라는 이름, 어디서 들어 본 것 같지 않나요? 바로 '고구려'예요!" },
              { who: 'pili', text: '고려라는 나라 이름에는 고구려를 이어받았다는 뜻이 담겨 있대요.' },
            ]);
            await g.addClue('name');
          },
        },
        {
          id: 'books', label: '옛 기록', x: 1000, y: 500, w: 180, h: 140, art: ART.books,
          onClick: async (g) => {
            if (g.has('balhae')) return g.say([{ who: 'pili', text: '926년 거란이 발해를 멸망시킨 기록이에요.' }]);
            await g.say([
              { who: 'pili', text: '옛 기록이에요. 926년, 거란이 발해를 멸망시켰다고 적혀 있어요.' },
              { who: 'pili', text: '그 뒤로 고려는 거란을 경계했대요. 발해에서 온 사람들도 받아들였고요.' },
            ]);
            await g.addClue('balhae');
          },
        },
        {
          id: 'cat', label: '잠자는 고양이', x: 400, y: 620, w: 110, h: 74, sparkle: () => false,
          art: (g) => HA.art.cat(g.flag('catAwake')),
          onClick: async (g) => {
            g.setFlag('catAwake', !g.flag('catAwake'));
            g.refresh();
            await g.say([{ who: 'pili', text: g.flag('catAwake') ? '냐옹~ 고양이도 나라 걱정에 잠이 깼나 봐요. (게임 속 장식이에요)' : '다시 잠들었어요. 쉿!' }]);
          },
        },
      ],
    },

    camp: {
      id: 'camp',
      caption: { year: '1018년 겨울', place: '흥화진 근처 고려군 진영' },
      bg: ART.camp,
      objective: (g) => {
        const n = count(g, CAMP_KEYS);
        if (n < 2) return `진영을 살펴 단서 찾기 (${n}/2)` + (g.hasItem('damKit') ? '' : ' · 쓸 만한 물건 찾기');
        if (g.hasItem('damKit')) return "'쇠가죽 둑'을 냇물에 써 보세요";
        if (g.hasItem('cowhide') && g.hasItem('rope')) return '도구 칸에서 두 도구를 합쳐 보세요';
        return '냇물을 막을 재료 찾기';
      },
      hint: (g) => {
        if (!g.has('invasion2')) return '오른쪽 창을 든 병사에게 말을 걸어 봐요.';
        if (!g.has('demand')) return '강감찬 옆 나무 받침대 위의 글을 살펴봐요.';
        if (!g.hasItem('damKit')) {
          if (!g.hasItem('cowhide')) return '왼쪽 아래 갈색 가죽 더미를 살펴봐요.';
          if (!g.hasItem('rope')) return '가죽 더미 옆의 밧줄을 살펴봐요.';
          return "화면 아래 도구 칸에서 '쇠가죽'을 누르고, 이어서 '굵은 밧줄'을 눌러 합쳐 봐요.";
        }
        return "도구 칸의 '쇠가죽 둑'을 누른 다음, 파란 냇물을 눌러요. (끌어다 놓아도 돼요)";
      },
      onEnter: async (g, first) => {
        if (g.flag('damDone') && !g.flag('guijuDone')) return guijuStep(g);
        if (first)
          await g.say([
            { who: 'gang', text: '거란 장수 소배압이 10만 군사를 이끌고 압록강을 건너왔소!' },
            { who: 'gang', text: '나는 고려군을 이끄는 강감찬이오. 흥화진 앞에서 적을 막아야 하오.' },
            { who: 'pili', text: '강감찬은 이때 일흔 살쯤이었대요! 진영을 둘러보며 단서와 쓸 만한 물건을 찾아봐요.' },
          ]);
      },
      hotspots: [
        {
          id: 'cowhide', label: '가죽 더미', x: 50, y: 470, w: 170, h: 140, art: ART.cowhides,
          visible: (g) => !g.hasItem('cowhide') && !g.hasItem('damKit') && !g.flag('damDone'),
          onClick: async (g) => {
            await g.say([{ who: 'pili', text: '쇠가죽(소의 가죽)이 잔뜩 쌓여 있어요. 단단하고 물이 잘 새지 않아요.' }]);
            await g.addItem('cowhide');
            if (g.hasItem('rope')) await g.say([{ who: 'pili', text: '두 도구를 합쳐 볼까요? 아래 도구 칸에서 하나를 누르고, 다른 하나를 눌러 보세요.' }]);
          },
        },
        {
          id: 'rope', label: '밧줄', x: 240, y: 570, w: 120, h: 110, art: ART.rope,
          visible: (g) => !g.hasItem('rope') && !g.hasItem('damKit') && !g.flag('damDone'),
          onClick: async (g) => {
            await g.say([{ who: 'pili', text: '굵은 밧줄이에요. 무언가를 줄줄이 꿸 수 있겠어요.' }]);
            await g.addItem('rope');
            if (g.hasItem('cowhide')) await g.say([{ who: 'pili', text: '두 도구를 합쳐 볼까요? 아래 도구 칸에서 하나를 누르고, 다른 하나를 눌러 보세요.' }]);
          },
        },
        {
          id: 'gang', label: '강감찬', x: 390, y: 260, w: 150, h: 245, art: () => fig(looks.gang),
          onClick: async (g) => {
            if (count(g, CAMP_KEYS) < 2)
              return g.say([{ who: 'gang', text: '적이 왜 다시 쳐들어왔는지 알아야 싸울 수 있소. 진영을 둘러보시오.' }]);
            if (!g.hasItem('damKit'))
              return g.say([{ who: 'gang', text: '흥화진 앞 냇물을 이용할 생각이오. 물을 막을 단단한 것을 만들어 주시오.' }]);
            await g.say([{ who: 'gang', text: "좋소! 그 '쇠가죽 둑'을 냇물에 써 보시오." }]);
          },
        },
        {
          id: 'letter', label: '받침대 위의 글', x: 570, y: 380, w: 120, h: 130, art: ART.letterStand,
          onClick: async (g) => {
            if (g.has('demand')) return g.say([{ who: 'pili', text: '거란은 강동 6주를 돌려 달라고 했어요. 고려는 거절했고요.' }]);
            await g.say([
              { who: 'pili', text: '거란이 보낸 요구가 적혀 있어요. (글의 모습은 게임 속 장치지만, 요구 내용은 실제 기록에 있어요.)' },
              { who: 'pili', text: "'고려 임금은 직접 와서 예를 갖추고, 강동 6주를 돌려 달라!'" },
              { who: 'pili', text: '고려가 이것을 거절하자, 거란이 세 번째로 쳐들어온 거예요!' },
            ]);
            await g.addClue('demand');
          },
        },
        {
          id: 'stream', label: '냇물', x: 760, y: 480, w: 250, h: 230, cls: 'area',
          onClick: async (g) => {
            await g.say([{ who: 'pili', text: '흥화진 앞을 흐르는 냇물이에요. 물살이 꽤 세요.' }]);
            if (g.hasItem('damKit')) await g.say([{ who: 'pili', text: "아래 도구 칸에서 '쇠가죽 둑'을 누른 다음, 냇물을 다시 눌러 보세요!" }]);
            else await g.say([{ who: 'pili', text: '무언가로 물을 막을 수 있다면 좋을 텐데…' }]);
          },
          onItem: {
            damKit: async (g) => {
              if (count(g, CAMP_KEYS) < 2)
                return g.say([
                  { who: 'gang', text: '잠깐! 작전을 펼치기 전에, 적이 왜 다시 쳐들어왔는지부터 알아 두시오.' },
                  { who: 'pili', text: `진영의 단서를 더 찾아봐요. (${count(g, CAMP_KEYS)}/2)` },
                ]);
              await g.puzzle('dam', damCfg);
              g.removeItem('damKit');
              g.setFlag('damDone');
              await g.addClue('heunghwa');
              await guijuStep(g);
            },
            cowhide: (g) => g.say([{ who: 'pili', text: '쇠가죽만으로는 물살에 떠내려가요. 밧줄과 합쳐 볼까요?' }]),
            rope: (g) => g.say([{ who: 'pili', text: '밧줄만으로는 물을 막을 수 없어요. 쇠가죽과 합쳐 볼까요?' }]),
          },
        },
        {
          id: 'bau', label: '병사 바우', x: 1080, y: 330, w: 150, h: 245, art: () => fig(looks.bau),
          onClick: async (g) => {
            if (g.has('invasion2')) return g.say([{ who: 'bau', text: '강감찬 장군님의 작전이라면 꼭 이길 거예요!' }]);
            await g.say([
              { who: 'bau', text: '8년 전, 1010년에도 거란이 쳐들어왔어요. 그때는 거란 임금이 직접 왔대요.' },
              { who: 'bau', text: '개경이 함락되고, 임금님(현종)께서 멀리 나주까지 피란하셨어요.' },
              { who: 'bau', text: '이번엔 꼭 막아야 해요!' },
            ]);
            await g.addClue('invasion2');
          },
        },
      ],
    },

    archive: {
      id: 'archive',
      caption: { year: '시간의 서고', place: '고려의 기록 복원' },
      bg: ART.archive,
      objective: () => '찢어진 기록을 복원해요',
      hint: () => '가운데 빛나는 기록을 눌러 복원을 시작해요.',
      onEnter: (g) => restoreStep(g),
      hotspots: [
        {
          id: 'scroll', label: '찢어진 고려의 기록', x: 500, y: 200, w: 280, h: 200, cls: 'area glow',
          onClick: (g) => restoreStep(g),
        },
      ],
    },
  };

  HA.episodes['goryeo-khitan'] = {
    id: 'goryeo-khitan',
    era: 'goryeo',
    title: '고려의 사라진 기록',
    subtitle: '거란의 침입과 고려의 대응',
    blurb: '거란이 쳐들어왔어요! 서희의 외교 담판과 강감찬의 귀주대첩까지, 뒤섞인 고려의 기록을 바로잡아요.',
    minutes: '약 8~12분',
    startScene: 'court',
    characters,
    clues,
    items,
    recipes,
    scenes,
    summary,
    introArt: ART.archive,
    intro: (g) =>
      g.say([
        { who: 'pili', text: '기록자님, 큰일 났어요! 시간의 서고에 있던 고려의 기록이 찢어져 흩어졌어요!' },
        { who: 'pili', text: "저는 시간의 붓 '필이'예요. 기록자님이 단서를 모아 오면, 찢어진 기록을 다시 붙일 수 있어요." },
        { who: 'pili', text: '반짝이는(✦) 곳을 눌러 살펴보고, 막히면 오른쪽 위 💡힌트를 눌러요. 모은 단서는 📖수첩에 담겨요.' },
        { who: 'pili', text: '자, 993년 고려로 가요! 거란이 쳐들어왔다는 소식에 조정이 시끌시끌하대요.' },
      ]),
  };
})();
