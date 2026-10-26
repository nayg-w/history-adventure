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
    messenger: { robe: '#8a6a3a', dark: '#6b5230', hat: 'cap', expr: 'worried', hold: 'scroll' },
  };
  const REAL = '실존 인물 · 대사는 창작';
  const FICTION = '게임 속 가상 인물';
  const characters = {
    pili: { name: '필이', tag: FICTION, real: false, color: '#d9a43b', portrait: () => HA.art.pili({ portrait: true }), bio: '시간의 서고를 지키는 붓이에요. 기록자를 돕는 길잡이로, 게임에서 만든 캐릭터예요.' },
    seohui: { name: '서희', tag: REAL, real: true, color: '#2f5d8a', portrait: () => fig(looks.seohui, { portrait: true }), bio: '고려의 관리(942~998). 993년 거란의 1차 침입 때 소손녕과 담판을 벌여 거란군을 돌려보내고 강동 6주를 얻었어요.' },
    sosonnyeong: { name: '소손녕', tag: REAL, real: true, color: '#7a4a2a', portrait: () => fig(looks.sosonnyeong, { portrait: true }), bio: '거란의 장수. 993년 고려에 쳐들어와 서희와 담판을 벌였어요.' },
    official: { name: '근심 많은 관리', tag: FICTION, real: false, color: '#5f8a52', portrait: () => fig(looks.official, { portrait: true }), bio: '993년 고려 조정의 분위기를 전해 주는, 게임에서 만든 인물이에요.' },
    gang: { name: '강감찬', tag: REAL, real: true, color: '#8e2a22', portrait: () => fig(looks.gang, { portrait: true }), bio: '고려의 관리이자 장수(948~1031). 거란의 3차 침입 때 상원수(총사령관)가 되어 1019년 귀주대첩을 이끌었어요.' },
    messenger: { name: '전령', tag: FICTION, real: false, color: '#8a6a3a', portrait: () => fig(looks.messenger, { portrait: true }), bio: '급한 소식을 전하는 사람. 게임에서 만든 인물이지만, 전하는 소식은 실제 기록에 있는 일이에요.' },
    bau: { name: '병사 바우', tag: FICTION, real: false, color: '#4a6a8a', portrait: () => fig(looks.bau, { portrait: true }), bio: '흥화진 근처 고려군 진영의 젊은 병사. 게임에서 만든 인물이에요.' },
  };

  /* ---------- 단서 (실제 역사) ---------- */

  /* ---------- 단서: 하나만으로는 답이 되지 않는 '부분 정보' ---------- */
  const clues = {
    claimLand: { group: 'khitan', from: '993년 조정 · 탁자 위 정찰 보고서', icon: '📜', title: '소손녕의 주장 ①', short: '고구려 땅은 거란 것?', kind: 'history',
      text: "정찰 보고: 소손녕은 '고려는 신라 땅에서 일어난 나라다. 고구려의 옛 땅은 거란의 것이다!'라고 말한대요." },
    claimSong: { group: 'khitan', from: '993년 조정 · 근심 많은 관리의 이야기', icon: '🗯️', title: '소손녕의 주장 ②', short: '왜 송과만 사귀나?', kind: 'history',
      text: "거란 쪽의 불평: '고려는 땅이 맞닿은 거란을 두고, 바다 건너 송나라와만 사귄다!'" },
    nameGoryeo: { group: 'goryeo', from: '993년 조정 · 벽에 걸린 붉은 깃발', icon: '🚩', title: "나라 이름 '高麗'", short: '우리 나라의 이름', kind: 'history',
      text: "우리 나라의 이름은 '고려(高麗)'예요. 어디서 들어 본 이름과 닮지 않았나요?" },
    seogyeong: { group: 'goryeo', from: '993년 조정 · 서희의 이야기', icon: '🏙️', title: '서경(평양)', short: '고려가 아끼는 도시', kind: 'history',
      text: "고려는 평양을 '서경'이라 부르며 아주 중요하게 여겨요. 평양은 오래전 고구려의 도읍이었어요." },
    jurchen: { group: 'field', from: '993년 조정 · 탁자 위 지도', picture: () => `<svg viewBox="0 0 800 640" xmlns="http://www.w3.org/2000/svg">${ART.mapBase()}</svg>`, icon: '🗺️', title: '압록강 가의 여진', short: '고려와 거란 사이', kind: 'history',
      text: '지도를 보면 압록강 주변에 여진이 살고 있어요. 고려와 거란 사이에 여진의 땅이 끼어 있어요.' },
    anyung: { group: 'khitan', from: '993년 조정 · 전령의 급보', icon: '📯', title: '안융진의 급보', short: '거란군이 멈췄다', kind: 'history',
      text: "급보: 소손녕의 군대가 안융진을 공격했다가 고려군에게 막혔어요. 그 뒤로 거란군은 더 내려오지 않고 '항복하라'는 글만 보내고 있어요." },
    balhae: { group: 'goryeo', from: '993년 조정 · 옛 기록 더미', icon: '📚', title: '발해의 멸망', short: '거란이 무너뜨린 나라', kind: 'history',
      text: '옛 기록: 거란이 발해를 멸망시켰어요. 그 뒤 고려는 발해 사람들을 받아들이고 거란을 경계했어요.' },
    gangdong: { group: 'goryeo', from: '994년~ · 강동 6주를 쌓은 뒤', icon: '🧱', title: '강동 6주', short: '담판으로 얻은 땅의 성', kind: 'history',
      text: '서희의 담판 뒤 고려는 여진을 몰아내고 압록강 동쪽에 흥화진·용주·통주·철주·귀주·곽주의 성을 쌓았어요.' },
    invasion2: { group: 'goryeo', from: '1018년 진영 · 병사 바우의 이야기', icon: '🔥', title: '8년 전의 침입', short: '개경이 불탔다', kind: 'history',
      text: '병사 바우의 이야기: 1010년 거란 임금이 직접 쳐들어와 개경이 함락되었고, 현종은 나주까지 피란했어요.' },
    demand: { group: 'khitan', from: '1018년 진영 · 받침대 위의 글', icon: '✉️', title: '거란이 보낸 글', short: '거란의 요구', kind: 'history',
      text: "'고려 임금은 직접 와서 예를 갖추라. 그리고 ○○ 6주를 돌려 달라!' — 고려 조정은 거절했어요. (글자 일부가 번져 있어요)" },
    scout: { group: 'field', from: '1018년 진영 · 강감찬이 보여 준 정찰 보고', icon: '🔭', title: '정찰병의 보고', short: '적이 건널 곳', kind: 'game',
      text: '거란군은 흥화진 앞 냇물의 얕은 여울로 건너올 것 같아요. (정찰병과 여울의 위치는 게임 속 설정이에요)' },
    heunghwa: { group: 'field', from: '1018년 · 흥화진 작전을 펼친 뒤', icon: '🌊', title: '흥화진 전투', short: '냇물을 막았다 터뜨림', kind: 'history',
      text: '강감찬은 쇠가죽을 꿰어 큰 냇물을 막고 기병을 산골짜기에 숨겼다가, 적이 건널 때 물을 터뜨리고 공격했다고 전해져요.' },
    guiju: { group: 'field', from: '1019년 · 귀주 결전 뒤', icon: '🏆', title: '귀주대첩', short: '강감찬의 큰 승리', kind: 'history',
      text: '1019년, 강감찬이 이끄는 고려군이 귀주에서 돌아가던 거란군을 크게 물리쳤어요. 살아 돌아간 거란군은 몇 천 명뿐이었다고 해요.' },
  };

  // 추론판에서 단서를 묶어 보여 주는 갈래
  const clueGroups = [
    { id: 'khitan', icon: '🏹', title: '거란 쪽 이야기' },
    { id: 'goryeo', icon: '🏯', title: '고려 쪽 기록' },
    { id: 'field', icon: '🗺️', title: '지도와 현장' },
  ];

  /* ---------- 추론: 단서 두 개를 이어 얻는 결론 ---------- */
  const insights = {
    heir: { from: ['nameGoryeo', 'seogyeong'], icon: '🔗', title: '고구려를 이은 나라', short: '고려 = 고구려의 계승자',
      scene: 'court', pill: '고려는 어떤 나라?',
      question: "소손녕은 '고구려의 옛 땅은 거란의 것'이라고 해요. 고려는 자기가 어떤 나라라고 맞설 수 있을까?",
      slots: ['우리 나라(고려)에 대한 단서', '그것을 고구려와 이어 주는 단서'],
      hints: [
        '소손녕의 말을 뒤집으려면 고려와 고구려가 어떤 관계인지 보여 주면 돼요. 무엇이 둘을 이어 줄까요?',
        "거란 쪽 주장 말고 '고려 쪽 기록'에서 찾아봐요. 나라를 보여 주는 이름이나 아끼는 도시 같은 것들이요.",
        '나라 이름이 어떤 옛 나라와 닮았는지, 고려가 아끼는 도시가 옛날 어느 나라의 도읍이었는지 견주어 봐요.',
      ],
      notes: {
        claimLand: '이건 소손녕이 한 주장 그 자체예요. 주장을 반박하려면 고려 쪽 근거가 필요해요.',
        claimSong: '송나라와의 교류 이야기는 고구려 땅 문제와 다른 질문이에요.',
        jurchen: '여진이 어디에 사는지는 고려가 어떤 나라인지 알려 주지 않아요.',
        anyung: '안융진 급보는 거란군의 형편을 알려 줄 뿐, 고려와 고구려의 관계는 보여 주지 않아요.',
        balhae: '발해 이야기는 거란과의 옛 일이에요. 고려가 고구려를 이었다는 근거로는 부족해요.',
      },
      defaultNote: '이 단서는 이 질문과 거리가 있어요. 질문을 다시 읽어 봐요.',
      text: "나라 이름을 '고려'라 하고 고구려의 옛 도읍 평양을 서경으로 삼은 것은, 고려가 고구려를 이은 나라라는 근거예요.",
      choices: [
        { text: '고려는 고구려를 이어받은 나라라는 근거가 된다.', correct: true },
        { text: '고려와 고구려는 같은 해에 세워졌다.', why: '단서에는 나라를 세운 해 이야기가 없어요.' },
        { text: '평양은 원래 거란의 도읍이었다.', why: '단서를 다시 읽어 봐요. 평양은 누구의 도읍이었나요?' },
      ] },
    route: { from: ['jurchen', 'claimSong'], icon: '🚧', title: '막힌 길', short: '여진 때문에 오가기 어렵다',
      scene: 'court', pill: '왜 교류를 못 했나?',
      question: "소손녕은 '왜 이웃한 거란을 두고 송과만 사귀냐'고 따져요. 고려가 거란과 오가기 어려웠던 까닭은 무엇일까?",
      slots: ['거란이 따진 불만', '오가기 어려웠던 까닭을 보여 주는 단서'],
      hints: [
        '두 나라 사람이 오가려면 땅을 지나가야 해요. 고려와 거란 사이에는 무엇이 있었을까요?',
        "말로 들은 이야기보다 '지도와 현장' 단서를 살펴봐요.",
        '거란의 불만과, 고려와 거란 사이에 누가 살았는지 보여 주는 단서를 이어 봐요.',
      ],
      notes: {
        claimLand: '이건 땅이 누구 것이냐는 주장이에요. 오가는 길과는 다른 이야기예요.',
        nameGoryeo: '나라 이름은 거란으로 가는 길과 상관이 없어요.',
        seogyeong: '서경은 고려 안쪽의 도시예요. 거란으로 가는 길이 막힌 까닭은 보여 주지 않아요.',
        anyung: '안융진 급보는 이번 전쟁에서 거란군이 멈춘 이야기예요. 평소 오가기 어려웠던 까닭은 아니에요.',
        balhae: '발해 멸망은 오래전 일이에요. 지금 길이 막힌 까닭을 설명하지는 못해요.',
      },
      defaultNote: '이 단서는 이 질문과 거리가 있어요. 질문을 다시 읽어 봐요.',
      text: '고려와 거란 사이에 여진의 땅이 있어 오가기 어려웠어요. 여진을 몰아내고 길을 열면 교류할 수 있어요.',
      choices: [
        { text: '여진 땅이 가운데 있어 거란과 오가기 어렵다. 길이 열리면 교류할 수 있다.', correct: true },
        { text: '고려는 거란과 절대로 교류할 수 없다.', why: "'절대로'라고 할 근거가 단서에 있나요?" },
        { text: '송나라가 여진을 보내 길을 막았다.', why: '단서에 그런 내용은 없어요. 확인된 것만 말해요.' },
      ] },
    aim: { from: ['anyung', 'claimSong'], icon: '🎯', title: '거란의 속셈', short: '싸움보다 교류를 원한다',
      scene: 'court', pill: '거란의 속셈은?',
      question: '거란은 큰소리로 항복하라고 해요. 그런데 정말로 바라는 것은 무엇일까?',
      slots: ['거란군이 실제로 한 행동', '거란이 말로 따진 것'],
      hints: [
        '말과 행동이 다를 때가 있어요. 거란군이 실제로 어떻게 움직였는지 살펴봐요.',
        "'거란 쪽 이야기' 가운데 거란군의 형편을 알려 주는 소식이 있어요.",
        '거란군이 더 내려오지 않았다는 소식과, 거란이 송나라 일로 따진 말을 함께 봐요.',
      ],
      notes: {
        claimLand: '땅 주장은 거란이 내세운 말이에요. 거란군이 실제로 어떻게 했는지 보여 주는 단서가 필요해요.',
        nameGoryeo: '나라 이름은 거란의 속셈과 상관이 없어요.',
        seogyeong: '서경 이야기는 고려 쪽 사정이에요. 거란이 바라는 것을 보여 주지 않아요.',
        jurchen: '여진의 위치는 길이 막힌 까닭이에요. 거란이 정말 바라는 것은 보여 주지 않아요.',
        balhae: '발해 멸망은 오래전 일이에요. 지금 거란이 바라는 것을 보여 주지 않아요.',
      },
      defaultNote: '이 단서는 이 질문과 거리가 있어요. 질문을 다시 읽어 봐요.',
      text: '거란군은 막힌 뒤 더 내려오지 않고 송과의 관계를 따졌어요. 거란이 바란 것은 땅보다, 고려가 송 대신 거란과 교류하는 것이었어요.',
      choices: [
        { text: '거란은 싸움보다, 고려가 송 대신 거란과 교류하기를 바라는 것 같다.', correct: true },
        { text: '거란은 고려 땅을 모두 차지할 때까지 싸우려 한다.', why: '그렇다면 왜 더 내려오지 않고 글만 보내고 있을까요?' },
        { text: '거란군은 이미 고려를 이겼다.', why: '안융진에서 누가 막혔는지 급보를 다시 봐요.' },
      ] },
    why3: { from: ['gangdong', 'demand'], icon: '🧩', title: '다시 쳐들어온 까닭', short: '거란이 6주를 원함',
      scene: 'camp', pill: '왜 다시 왔나?',
      unlock: (g) => g.flag('mapDone'),
      question: '1018년, 거란은 왜 또다시 쳐들어왔을까?',
      slots: ['거란이 요구한 것', '그 요구와 이어지는 예전 일'],
      hints: [
        '거란이 이번에 고려에게 무엇을 요구했는지부터 확인해 봐요.',
        "번진 글자 '○○ 6주'는 25년 전의 일과 관계있어요. 그때 고려가 얻은 것을 떠올려 봐요.",
        '거란이 보낸 글과, 서희의 담판 뒤에 쌓은 성들에 대한 단서를 이어 봐요.',
      ],
      notes: {
        invasion2: '8년 전 2차 침입은 이미 지난 일이에요. 이번 침입 직전에 거란이 무엇을 요구했는지와 이어 봐야 해요.',
        scout: '정찰 보고는 적이 어디로 건너오는지 알려 줘요. 왜 왔는지는 알려 주지 않아요.',
        claimLand: '25년 전 담판 때의 주장이에요. 이번 침입 직전의 요구가 필요해요.',
        claimSong: '25년 전 담판 때의 불만이에요. 이번 침입 직전의 요구가 필요해요.',
      },
      defaultNote: '이 단서는 993년 담판 무렵의 것이에요. 1018년의 일과 바로 이어지지는 않아요.',
      text: '번진 글자는 바로 강동 6주! 서희가 얻은 강동 6주를 거란이 돌려 달라 했고, 고려가 거절하자 거란이 다시 쳐들어왔어요.',
      choices: [
        { text: '서희가 얻은 강동 6주를 거란이 되찾으려 했고, 고려가 거절했다.', correct: true },
        { text: '고려가 송나라 땅을 빼앗았기 때문이다.', why: '두 단서에는 송나라 땅 이야기가 없어요.' },
        { text: '서희가 담판에서 거짓 약속을 했기 때문이다.', why: '단서 어디에도 그런 말은 없어요. 거란이 무엇을 돌려 달라고 했나요?' },
      ] },
  };

  /* ---------- 숨은 기록: 찾지 않아도 진행되지만, 찾으면 더 알게 되는 이야기 ---------- */
  const secrets = {
    coin: { title: '송나라에서 온 물건', kind: 'history', text: '고려는 송나라와 활발히 교류했어요. 송의 책과 비단 같은 물건이 고려에 들어왔지요. 거란은 이것이 못마땅했어요.' },
    halji: { title: '땅을 떼어 주자는 의견', kind: 'history', text: "거란이 쳐들어오자 조정에서는 '서경 북쪽 땅을 떼어 주고 화해하자'는 의견까지 나왔어요. 서희는 이에 반대했어요." },
    yanggyu: { title: '흥화진을 지킨 양규', kind: 'history', text: '1010년 2차 침입 때 양규는 흥화진을 굳게 지켜 냈고, 거란군에게 끌려가던 백성들을 구하기도 했어요.' },
    nakseong: { title: '낙성대 이야기', kind: 'legend', text: "강감찬이 태어날 때 큰 별이 떨어졌다는 이야기가 전해져요. 그래서 그곳을 '낙성대'라고 불러요. (전해지는 이야기예요)" },
  };

  const items = {
    cowhide: { icon: '🐂', title: '쇠가죽', text: '소의 가죽이에요. 단단하고 물이 잘 새지 않아요.' },
    rope: { icon: '🪢', title: '굵은 밧줄', text: '무언가를 줄줄이 꿰어 묶을 수 있어요.' },
    damKit: { icon: '🛡️', title: '쇠가죽 둑', text: '밧줄로 쇠가죽을 줄줄이 꿰어 만든 물막이예요.' },
  };
  const recipes = [
    { a: 'cowhide', b: 'rope', result: 'damKit',
      lines: [{ who: 'pili', text: '밧줄로 쇠가죽을 줄줄이 꿰었어요! 이걸로 물을 막을 수 있겠어요.' }] },
  ];

  /* ---------- 퍼즐 ① 외교 담판 ---------- */
  const so = (text) => ({ who: 'sosonnyeong', text });
  const debate = {
    goal: '담판으로 거란군을 돌려보내요',
    caption: { year: '993년', place: '거란 진영' },
    saveKey: 'debateStage',
    bg: ART.tent,
    left: 'seohui',
    right: 'sosonnyeong',
    leftFig: () => fig(looks.seohui),
    rightFig: (expr) => fig(Object.assign({}, looks.sosonnyeong, expr ? { expr } : {})),
    winBanner: '993년 · 서희, 말로 나라를 지키다',
    moodLabel: '소손녕의 태도',
    startMood: 50,
    intro: [
      { who: 'pili', text: '서희가 거란 진영에 도착했어요. 소손녕의 태도를 잘 살피며 협상해요!' },
      { who: 'pili', text: '막히면 언제든 물러나서 더 조사할 수 있어요. 진행은 저장돼요.' },
    ],
    resumeIntro: [{ who: 'pili', text: '다시 담판 자리로 돌아왔어요. 아까 멈춘 곳부터 이어 가요!' }],
    breakLines: [
      so('더 들을 것 없소! 돌아가시오!'),
      { who: 'pili', text: '협상이 깨질 뻔했어요! 서희가 겨우 소손녕을 다시 자리에 앉혔어요. 이번엔 더 신중하게!' },
    ],
    stages: [
      {
        type: 'stance', name: '예법',
        prompt: '나는 큰 나라의 귀한 장수요. 그대는 뜰 아래에서 내게 절부터 하시오!',
        choices: [
          { text: '얼른 절하고 본론으로 들어간다', mood: -5,
            lines: [{ who: 'seohui', text: '(잠깐… 처음부터 고개를 숙이면, 고려가 낮은 자리에서 협상하게 되겠지.)' }] },
          { text: '칼을 뽑아 들고 맞선다', mood: -25,
            lines: [so('감히 칼을 뽑아?!'), { who: 'seohui', text: '(아차, 싸우러 온 것이 아닌데… 이러면 군대가 쳐들어올 것이다.)' }] },
          { text: '두 나라 신하는 대등하다며, 숙소로 돌아가 기다린다', ok: true,
            lines: [
              { who: 'seohui', text: '뜰에서 절하는 것은 신하가 임금을 뵐 때의 예법이오. 두 나라의 신하가 만나는데 어찌 그러겠소?' },
              { who: 'pili', text: '기록에 따르면 서희는 숙소로 돌아가 물러서지 않았고, 결국 두 사람은 대등하게 마주 앉았대요.' },
            ] },
        ],
        hints: ['두 나라의 신하가 만나는 자리예요. 누가 더 높고 낮을까요?', '서희는 고려를 낮추지도, 싸움을 걸지도 않았어요.'],
      },
      {
        type: 'claim', name: '첫째 주장',
        claim: '고려는 신라 땅에서 일어난 나라요. 고구려의 옛 땅은 우리 거란의 것인데, 어찌 고려가 차지하고 있소?',
        weak: [
          { text: '고려는 신라 땅에서 일어난 나라요', ok: true, reply: '(바로 이 말이 틀렸소! 고려가 어떤 나라인지 보여 주면 소손녕의 말이 무너지겠군.)' },
          { text: '고구려의 옛 땅은 우리 거란의 것', reply: '(이건 소손녕이 내세운 결론이오. 결론을 받치고 있는 앞의 이유를 무너뜨려야 하오.)' },
          { text: '어찌 고려가 차지하고 있소', reply: '(이건 따지는 말일 뿐이오. 주장의 바탕이 되는 말을 찾아야 하오.)' },
        ],
        responses: {
          heir: { result: 'win' },
          nameGoryeo: { result: 'partial', text: '이름이 비슷하다고 고구려를 이었다 할 수 있소? 더 확실한 근거를 대 보시오!' },
          seogyeong: { result: 'partial', text: '평양을 아낀다고? 그것만으로 고려가 고구려를 이었다는 말이오? 근거를 하나로 엮어 말해 보시오!' },
          route: { result: 'partial', text: '그 이야기는 나중에 하시오. 지금은 땅 이야기를 하고 있소!' },
          aim: { result: 'partial', text: '내 속셈을 읽었다고? 흥, 먼저 땅 이야기에나 답하시오!' },
          claimLand: { result: 'miss', text: '그건 내가 한 말이오! 내 말에 대답을 하시오.' },
          balhae: { result: 'miss', text: '발해를 들먹여 우리를 탓하려는 것이오?' },
          anyung: { result: 'miss', text: '안융진 일로 나를 놀리는 것이오?!', mood: -20 },
        },
        missDefault: '그것으로는 나를 설득할 수 없소!',
        win: [
          { who: 'seohui', text: "그렇지 않소. 우리나라는 고구려를 이은 나라요. 그래서 나라 이름을 '고려'라 하고, 평양을 서경으로 삼았소." },
          { who: 'seohui', text: '땅의 경계로 따진다면, 거란의 동경도 본래 고구려 땅이었으니 오히려 우리 땅이라 해야 하오!' },
          so('으음…!'),
        ],
        hints: [
          "먼저 말풍선에서 사실이 아닌 '이유'를 찾아 눌러요. 소손녕은 고려가 어디서 일어난 나라라고 했나요?",
          "근거 하나로는 부족해요. 📖수첩 추론판에서 '나라 이름'과 다른 단서를 이어 보세요.",
          "'나라 이름 高麗'와 '서경(평양)'을 이어 만든 추론 카드를 내밀어요.",
        ],
      },
      {
        type: 'claim', name: '둘째 주장',
        claim: '그렇다면 묻겠소. 고려는 우리와 땅이 맞닿아 있는데, 어째서 바다 건너 송나라와만 사귀는 것이오?',
        weak: [
          { text: '우리와 땅이 맞닿아 있는데', ok: true, reply: '(정말 두 나라 땅이 바로 맞닿아 있나? 이 말의 허점을 근거로 보여 주면 되겠군.)' },
          { text: '바다 건너 송나라와만 사귀는 것', reply: '(고려가 송과 사귀는 것은 사실이오. 거란과 오가지 못한 까닭과 관련된 말을 찾아야 하오.)' },
        ],
        responses: {
          route: { result: 'win' },
          jurchen: { result: 'partial', text: '여진이 사는 것은 나도 아오. 그래서 어쩌겠다는 것이오?' },
          aim: { result: 'partial', text: '흠… 내 속을 꿰뚫어 보는구려. 하지만 먼저 대답하시오. 왜 우리와 사귀지 않소?', mood: 0 },
          claimSong: { result: 'miss', text: '그건 내가 한 말 아니오! 대답을 하시오.' },
          heir: { result: 'miss', text: '고구려 이야기는 이미 끝났소.', mood: -5 },
          anyung: { result: 'miss', text: '안융진 일로 나를 놀리는 것이오?!', mood: -20 },
        },
        missDefault: '동문서답이구려!',
        win: [
          { who: 'seohui', text: '압록강 안팎을 여진이 가로막고 있어, 거란으로 가는 길이 막혀 있기 때문이오.' },
          { who: 'seohui', text: '여진을 몰아내고 우리 옛 땅에 성을 쌓아 길을 연다면, 어찌 거란과 사귀지 않겠소?' },
          so('…그 말은 들어 볼 만하구려.'),
        ],
        hints: [
          "말풍선에서 정말 사실인지 의심스러운 말을 눌러요. 두 나라 땅은 정말 바로 맞닿아 있었을까요? 지도를 떠올려 봐요.",
          "'압록강 가의 여진'과 소손녕의 둘째 주장을 추론판에서 이어 보세요.",
          "추론 카드 '막힌 길'을 내밀어요.",
        ],
      },
      {
        type: 'deal', name: '협상안',
        prompt: '좋소. 그럼 고려는 무엇을 하고, 우리 거란은 무엇을 하자는 것이오?',
        scales: ['거란의 만족', '고려가 얻는 것'],
        columns: [
          { title: '고려가 약속할 것', options: [
            { id: 'give', text: '서경 북쪽 땅을 거란에 떼어 준다', who: 'seohui', mood: -5, k: 2, gr: -3 },
            { id: 'trade', ok: true, text: '길이 열리면 거란과 사신을 주고받으며 교류한다', k: 2, gr: 0 },
            { id: 'ally', text: '송나라와 힘을 합쳐 거란을 막겠다고 경고한다', who: 'sosonnyeong', mood: -25, k: -3, gr: 0 },
          ] },
          { title: '거란에게 요구할 것', options: [
            { id: 'balhaeLand', text: '옛 발해 땅을 모두 고려에 돌려준다', who: 'sosonnyeong', mood: -15, k: -3, gr: 2 },
            { id: 'retreat', ok: true, text: '군대를 물리고, 압록강 동쪽 여진 땅을 고려가 차지하도록 인정한다', k: -1, gr: 3 },
            { id: 'apology', text: '거란 임금이 고려에 사과한다', who: 'sosonnyeong', mood: -20, k: -3, gr: 1 },
          ] },
        ],
        win: [
          so('…좋소. 고려가 우리와 교류한다면 군대를 물리겠소. 압록강 동쪽 땅도 고려가 차지하시오.'),
          { who: 'pili', text: '서희는 거란이 진짜 바라는 것을 꿰뚫어 보고, 싸우지 않고 땅까지 얻어 냈어요!' },
        ],
        hints: [
          "거란이 진짜 바라는 것이 무엇이었죠? 추론판의 '거란의 속셈'을 떠올려 봐요.",
          '땅은 내주지 않으면서, 거란이 원하는 것을 주는 방법은? 그리고 우리가 얻을 것은 막힌 길 너머의 땅!',
          "'거란과 교류한다'와 '군대를 물리고 압록강 동쪽 땅을 인정한다'를 골라요.",
        ],
      },
    ],
    outro: [{ who: 'pili', text: '실제 역사에서도 993년 서희의 담판 뒤 거란군은 물러갔어요.' }],
  };
  // 협상안에서 고르면 나오는 반응
  const dealReact = {
    give: '땅을 내주지 않으려고 여기 온 것 아니었소? 다른 방법을 찾아야 하오.',
    ally: '지금 전쟁을 하자는 것이오?!',
    balhaeLand: '발해 땅을 통째로 내놓으라고? 어림없소!',
    apology: '우리 황제께 사과를 하라고?! 무례하오!',
  };
  debate.stages[3].columns.forEach((c) => c.options.forEach((o) => (o.react = dealReact[o.id])));

  /* ---------- 퍼즐 ② 강동 6주 ---------- */
  const M = ART.map;
  // 성의 위치 기록(hint)은 실제 위치를 아주 단순하게 바꾼 게임용 설명이에요
  const castleTokens = [
    { id: 'heunghwa', label: '흥화진', x: 250, y: 242, hint: '압록강과 가장 가까운 성. 거란과 맞닿은 맨 앞이에요.', why: '거란이 쳐들어오면 가장 먼저 맞서는 성이에요.' },
    { id: 'yong', label: '용주', x: 262, y: 286, hint: '흥화진 바로 아래, 바닷가에 있어요.', why: '바닷가 길을 지키는 성이에요.' },
    { id: 'cheol', label: '철주', x: 290, y: 330, hint: '용주보다 더 아래, 역시 바닷가에 있어요.', why: '바닷가를 따라 성들이 이어졌어요.' },
    { id: 'tong', label: '통주', x: 340, y: 312, hint: '철주와 곽주 사이에서, 바다보다 조금 안쪽으로 들어간 곳이에요.', why: '성과 성 사이를 이어 주는 자리예요.' },
    { id: 'gwak', label: '곽주', x: 318, y: 362, hint: '청천강에 가장 가까운 바닷가 성이에요.', why: '6주의 남쪽 끝을 지켜요.' },
    { id: 'gwi', label: '귀주', x: 400, y: 268, hint: '바다에서 멀리 떨어진 안쪽 산길에 있어요.', why: '이 이름, 꼭 기억해 두세요!' },
  ];
  const mapCfg = {
    goal: '담판으로 얻은 땅에 성 6개를 쌓아요',
    caption: { year: '994년~', place: '새로 얻은 땅' },
    title: '강동 6주 쌓기',
    text: '고려는 여진을 몰아내고 성 6개를 쌓았어요. 담판에서 인정받은 땅은 어디였을까요? 성을 지도에 끌어다 놓거나, 성을 누른 뒤 지도를 눌러요.',
    base: ART.mapBase,
    zones: {
      gangdong: { poly: M.zones.gangdong, label: '압록강과 청천강 사이 바닷가 쪽' },
      khitan: { poly: M.zones.khitan, label: '압록강 북쪽', feedback: '여기는 압록강 너머, 거란 땅이에요. 담판에서 얻은 땅은 강의 어느 쪽이었나요?' },
      inland: { poly: M.zones.inland, label: '압록강과 청천강 사이 깊은 산골', feedback: '방향은 맞아요! 그런데 6주는 이보다 바다 쪽, 서쪽 길을 따라 쌓았어요.' },
      south: { poly: M.zones.south, label: '청천강 남쪽', feedback: '여기는 이미 고려가 다스리던 곳이에요(서경 근처). 새로 얻은 땅은 더 북쪽이에요.' },
    },
    correctZone: 'gangdong',
    outside: '바다에는 성을 쌓을 수 없어요!',
    tokens: castleTokens,
    borderPath: M.rivers.amnok,
    doneLabel: '강동 6주 완성! 고려의 땅이 압록강까지 넓어졌어요.',
    intro: [
      { who: 'pili', text: '994년부터 고려는 여진을 몰아내고 성을 쌓기 시작했어요. 서희가 앞장섰지요.' },
      { who: 'pili', text: '협상안에서 거란이 인정한 땅을 떠올려 6개의 성을 놓아 볼까요?' },
    ],
    bannerText: '고려의 땅이 압록강까지 넓어졌어요!',
    hints: [
      '협상안에서 거란은 어느 강의 어느 쪽 땅을 인정했나요?',
      "이 성들을 '강동 6주'라고 해요. '강동'은 '강의 동쪽'이라는 뜻이에요.",
      '압록강과 청천강 사이, 바닷가 쪽이에요. 지도에 빛나는 곳을 보세요!',
      '성을 누르면 위치 기록이 보여요. 압록강·청천강·바닷가와 견주어 알맞은 성터를 찾아요. 흥화진처럼 쉬운 것부터!',
    ],
    success: [
      { who: 'pili', text: "고려의 땅이 압록강까지 넓어졌어요! 이 성들을 '강동 6주'라고 불러요." },
      { who: 'pili', text: '이 성들은 나중에 아주 중요한 역할을 해요. 잘 기억해 두세요!' },
    ],
  };

  /* ---------- 퍼즐 ③ 흥화진 작전도 ---------- */
  const planCfg = {
    goal: '작전도를 짜서 흥화진 앞에서 거란군을 막아요',
    caption: { year: '1018년 12월', place: '흥화진 앞 냇물' },
    bg: ART.planField,
    river: ART.river,
    note: '기록: 쇠가죽으로 큰 냇물을 막고, 기병을 산골짜기에 숨겼다가, 적이 건널 때 물을 터뜨려 공격했다고 전해져요. 자리·시점·움직임은 게임을 위해 만든 것이에요.',
    tokens: [
      { id: 'dam', type: 'dam', icon: '🛡️', label: '쇠가죽 둑' },
      { id: 'ambush', type: 'ambush', icon: '🐎', label: '숨은 기병' },
    ],
    spots: [
      { id: 'd1', type: 'dam', x: 200, y: 380, label: '냇물 왼쪽', ok: true, preview: 'dry', tag: '💧 아래쪽 냇바닥이 말라요' },
      { id: 'd2', type: 'dam', x: 900, y: 392, label: '냇물 오른쪽', preview: 'flood', tag: '🌊 여울 쪽 물이 불어나요',
        fail: '둑이 여울보다 물이 흘러가는 쪽에 있어서, 여울에 오히려 물이 차올랐어요. 거란군은 깊은 물 앞에서 건너기를 멈췄어요.' },
      { id: 'd3', type: 'dam', x: 790, y: 200, label: '작은 물줄기', preview: 'trib', tag: '〰️ 큰 냇물은 그대로예요',
        fail: '이 물줄기는 여울을 지난 뒤에야 큰 냇물과 만나요. 둑을 터뜨려도 여울에는 아무 일도 없었어요.' },
      { id: 'a1', type: 'ambush', x: 780, y: 610, label: '골짜기 숲', ok: true, preview: 'hidden', tag: '🌲 나무 뒤에 숨었어요' },
      { id: 'a2', type: 'ambush', x: 440, y: 548, label: '탁 트인 눈밭', preview: 'seen', tag: '👀 멀리서도 잘 보여요',
        fail: '탁 트인 눈밭이라 숨은 기병이 거란군 눈에 띄었어요! 거란군이 경계하며 멈췄어요.' },
      { id: 'a3', type: 'ambush', x: 150, y: 540, label: '흥화진 성 앞', preview: 'far', tag: '🐢 여울까지 멀어요',
        fail: '흥화진 성 앞은 여울에서 너무 멀어요. 기병이 닿기 전에 거란군이 다시 대열을 갖췄어요.' },
    ],
    release: {
      from: 270,
      to: 430,
      lateAt: 560,
      early: '거란군이 냇물에 들어서기 전에 물이 쏟아져 버렸어요. 거란군은 물이 빠질 때까지 기다리기로 했어요.',
      late: '거란군이 이미 냇물을 다 건넜어요. 쏟아진 물살이 아무도 막지 못했어요.',
    },
    intro: [
      { who: 'gang', text: '정찰병 말로는 적이 저 여울로 건너올 것이오.' },
      { who: 'gang', text: '기록자, 둑과 숨은 기병을 놓아 작전도를 짜 보시오. 작전이 시작되면 둑을 터뜨릴 때는 그대가 정하시오!' },
    ],
    hints: [
      "물은 어느 쪽으로 흐르나요? 냇물 속 '>' 모양 물결을 보고, 둑을 여기저기 놓아 보며 여울이 어떻게 바뀌는지 살펴봐요.",
      '여울(거란군이 건너는 곳)이 말라야 적이 안심하고 들어와요. 숨은 기병은 적의 눈에 띄지 않으면서도 여울과 가까워야 해요.',
      "작전을 시작하면 아래 '거란군 위치' 막대를 보세요. 적이 냇바닥 한가운데에 있을 때 둑을 터뜨려요!",
    ],
    success: [
      { who: 'gang', text: '물살에 적이 흩어졌다! 숨은 기병들, 공격하라!' },
      { who: 'pili', text: '기록에 따르면 강감찬은 흥화진에서 이렇게 거란군에게 큰 피해를 주었어요.' },
    ],
  };

  /* ---------- 퍼즐 ④ 3차 침입 작전 (개경 → 귀주) ---------- */
  const campaignCfg = {
    goal: '돌아가는 거란군을 막을 작전을 세워요',
    caption: { year: '1018년 12월 ~ 1019년 2월', place: '거란의 3차 침입' },
    saveKey: 'campaignPhase',
    mapBase: ART.mapBase,
    castles: castleTokens,
    routeDown: 'M250 242 Q300 330 360 400 T470 520 T515 585',
    routeBack: 'M512 578 Q470 500 440 420 T402 282',
    routeEscape: 'M402 282 Q360 230 300 170',
    khitanZone: M.zones.khitan,
    intro: [
      { who: 'pili', text: '흥화진에서 큰 피해를 입고도, 소배압은 개경을 노리고 남쪽으로 서둘러 내려갔어요.' },
      { who: 'gang', text: '적의 다음 움직임을 내다봐야 하오. 들어온 정보를 살펴보시오.' },
    ],
    A: {
      title: '거란군은 어떻게 할까?',
      question: '소식이 하나씩 들어와요. 지도와 정보 카드를 보고, 거란군이 앞으로 어떻게 할지 예측해 보세요.',
      intel: [
        { icon: '🐎', title: '거란군의 움직임', text: '흥화진에서 피해를 입은 거란군이 성들을 지나쳐 개경 쪽으로 서둘러 내려가요.' },
        { icon: '🌾', title: '개경 주변 들판', text: '고려는 성 밖 백성을 성 안으로 들이고 들판을 비웠어요.' },
        { icon: '🍚', title: '거란군의 사정', text: '먼 길을 서둘러 온 거란군은 가져온 식량이 줄어들고 있어요.' },
        { icon: '🏯', title: '개경의 성벽', text: '개경 성 위에는 고려군이 단단히 지키고 있어요.' },
      ],
      progress: [0.3, 0.6, 0.85, 1],
      moreNews: "소식을 더 받아 보면 판단이 쉬워질 것이오. '다음 소식 받기'를 눌러 보시오.",
      early: '소식을 다 듣기도 전에 알아차리다니, 날카로운 판단이오!',
      options: [
        { id: 'siege', text: '개경을 둘러싸고 오래오래 공격한다', why: '들판은 비었고 식량은 줄어드오. 적이 오래 버틸 수 있겠소?' },
        { id: 'deeper', text: '개경을 지나쳐 더 남쪽으로 내려간다', why: '단단한 성을 등 뒤에 두고 더 깊이 들어가면, 돌아갈 길은 어찌 되겠소?' },
        { id: 'back', text: '공격을 포기하고 거란으로 되돌아간다', ok: true },
      ],
      win: [
        { who: 'gang', text: '그렇소! 실제로 거란군은 개경 가까이까지 왔다가 되돌아가기 시작했소.' },
        { who: 'gang', text: '이제 돌아가는 적을 어디서 막을지 정해야 하오.' },
      ],
    },
    B: {
      title: '어디서 기다릴까?',
      question: "거란군은 압록강을 건너 돌아가려 해요. '🚩 고려군'을 끌어서 기다릴 곳에 놓아요.",
      tip: '💡 25년 전, 서희의 담판 뒤에 쌓은 성들을 떠올려 보세요. 깃발을 지도 어디에 놓든 거란군이 어떻게 움직이는지 보여 줘요.',
      onRoute: { why: '이 길목도 거란군이 지나가지만, 기댈 성이 없는 들판이에요. 성을 끼고 기다릴 수 있는 길목을 찾아봐요. (게임 속 판단)' },
      offRoute: { why: '거란군이 돌아가는 길(파란 점선)에서 너무 멀어요. 길 위에서 기다려야 막을 수 있어요.' },
      targets: [
        { id: 'gaegyeong', label: '개경', x: 470, y: 560, why: '거란군은 이미 개경을 떠나 북쪽으로 가고 있어요. 뒤에 남으면 따라잡기 어려워요.' },
        { id: 'guiju', label: '귀주', x: 372, y: 236, ok: true, why: '귀주는 강동 6주 가운데 하나로, 거란군이 압록강으로 돌아가는 길목이에요!' },
        { id: 'beyond', label: '압록강 너머', x: 400, y: 60, why: '압록강 너머는 거란 땅이에요. 적이 강을 건너기 전에, 고려 땅 안에서 막아야 해요.' },
      ],
      win: [
        { who: 'gang', text: '귀주에서 기다리겠소!' },
        { who: 'pili', text: '서희가 얻은 강동 6주의 성, 귀주가 25년 뒤 결전의 무대가 된 거예요!' },
      ],
    },
    C: {
      title: '귀주 · 1019년 2월',
      bg: ART.guijuTop,
      winds: ['north', 'north', 'calm', 'south', 'south'],
      reinforceAt: 3,
      goodWind: 'south',
      windInfo: {
        north: { name: '북풍', desc: '북쪽(거란군 쪽)에서 고려군 얼굴로 불어와요.', arrow: '↓' },
        calm: { name: '바람 잠잠', desc: '바람이 거의 불지 않아요.', arrow: '·' },
        south: { name: '남풍', desc: '남쪽(고려군 뒤)에서 거란군 쪽으로 불어요.', arrow: '↑' },
      },
      turnLog: [
        '두 군대가 맞섰어요. 바람이 고려군 쪽으로 불어와요.',
        '눈보라가 고려군의 앞을 가려요.',
        '바람이 잦아들었어요. 거란군이 조금씩 물러나요.',
        '남쪽에서 비바람이 불기 시작했어요! 지원군도 도착했어요.',
        '거란군이 압록강 쪽으로 빠져나가려 해요. 서둘러야 해요!',
      ],
      early: {
        north: '바람이 우리 쪽으로 불어 화살이 힘을 잃고 앞이 보이지 않소! 일단 물러나 기회를 봅시다.',
        calm: '아직 기세가 부족하오. 조금만 더 지켜봅시다.',
      },
      afterFail: '고려군이 물러나 다시 대열을 갖췄어요. 그사이 시간이 흘렀어요.',
      escape: [
        { who: 'gang', text: '거란군이 빠져나가 버렸소! 처음 상황부터 다시 살펴봅시다.' },
        { who: 'pili', text: '(게임 속 재도전) 너무 오래 기다리면 기회를 놓쳐요.' },
      ],
      restart: '다시 두 군대가 맞섰어요.',
      intro: [
        { who: 'gang', text: '귀주에서 거란군과 맞섰소. 언제 총공격할지 판단해야 하오.' },
        { who: 'pili', text: "바람의 방향과 지원군을 살펴봐요. '지켜본다'를 누르면 시간이 흘러요." },
      ],
      note: '기록: 싸움이 한창일 때 남쪽에서 비바람이 몰아쳐 깃발이 북쪽을 가리켰고, 김종현의 군사가 도착해 고려군이 크게 이겼어요. 공격할 때를 고르는 판단은 게임에서 만든 장치예요.',
      banner: { title: '귀주대첩', sub: '1019년 · 강감찬' },
      win: [
        { who: 'pili', text: "고려군이 거란군을 크게 물리쳤어요! 이 싸움이 '귀주대첩'이에요." },
        { who: 'pili', text: '살아 돌아간 거란군은 몇 천 명뿐이었다고 해요.' },
      ],
    },
    hints: {
      A: ["'다음 소식 받기'로 정보를 모두 모아 비교해 봐요. 들판이 비어 있다면 거란군은 무엇을 구하기 어려울까요?", '식량을 구하기 어렵고 성은 단단해요. 이런 군대가 오래 머물 수 있을까요?'],
      B: ['거란군은 어디로 돌아가나요? 파란 점선을 따라가 보세요.', '강동 6주 가운데, 돌아가는 길(점선) 위에 있는 성을 찾아봐요.', "'귀주'에 깃발을 놓아 보세요."],
      C: ['바람이 고려군 등 뒤에서 거란군 쪽으로 불 때가 유리해요.', "'남풍'일 때 총공격! 너무 오래 기다리면 거란군이 빠져나가요."],
    },
  };

  /* ---------- 퍼즐 ⑤⑥ 기록 복원 ---------- */
  const timelineCfg = {
    goal: '기록 조각을 일어난 순서대로 놓아요',
    caption: { year: '시간의 서고', place: '기록 복원 ①' },
    title: '찢어진 기록 붙이기 ① — 순서',
    text: '여행에서 겪은 일을 떠올려 순서대로 놓아요. 첫 확인에서는 몇 개가 맞았는지만 알려 줘요!',
    countFirst: true,
    cards: [
      { id: 't1', icon: '📚', text: '거란이 발해를 멸망시키다', year: '926년' },
      { id: 't2', icon: '📯', text: '소손녕의 군대가 안융진에서 막히다', year: '993년' },
      { played: true, id: 't3', icon: '🗣️', text: '서희가 소손녕과 담판을 벌이다', year: '993년' },
      { played: true, id: 't4', icon: '🧱', text: '고려가 강동 6주를 쌓다', year: '994년~' },
      { id: 't5', icon: '🔥', text: '거란의 2차 침입, 개경이 함락되다', year: '1010년' },
      { id: 't6', icon: '✉️', text: '거란이 강동 6주를 돌려 달라고 하다', year: '1010년 이후' },
      { played: true, id: 't7', icon: '🌊', text: '흥화진에서 냇물을 터뜨려 거란군을 치다', year: '1018년' },
      { played: true, id: 't8', icon: '🏆', text: '강감찬이 귀주에서 크게 이기다', year: '1019년' },
    ],
    intro: [
      { who: 'pili', text: '이제 찢어진 기록을 붙일 차례예요. 이번엔 연도가 지워져 있어요!' },
      { who: 'pili', text: "'무엇 때문에 무엇이 일어났는지'를 떠올리면 순서가 보여요." },
    ],
    hints: [
      '원인이 먼저, 결과가 나중이에요. 담판이 있어야 성을 쌓을 수 있고, 성이 있어야 돌려 달라고 할 수 있겠죠?',
      '조정에서 받은 급보와 서희의 담판, 어느 쪽이 먼저였을까요?',
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
      { cause: '거란군이 안융진에서 막혔어요', effect: '거란이 싸움 대신 협상을 요구했어요', explain: '거란군은 더 내려오지 않고 글을 보내 협상을 요구했어요.' },
      { cause: '서희가 거란이 진짜 바라는 것을 알아챘어요', effect: '싸우지 않고 강동 6주를 얻었어요', explain: '거란은 고려가 송 대신 자기와 교류하길 바랐고, 서희는 이 점을 이용해 협상했어요.' },
      { cause: '고려가 강동 6주를 돌려주지 않았어요', effect: '거란이 1018년에 다시 쳐들어왔어요', explain: '거란은 강동 6주를 돌려 달라고 했지만 고려는 거절했어요.' },
      { cause: '강감찬이 귀주에서 크게 이겼어요', effect: '거란이 더는 크게 쳐들어오지 못했어요', explain: '귀주대첩 뒤 고려와 거란은 화해했고, 오랫동안 평화가 이어졌어요.' },
      { cause: '거란의 침입을 여러 번 겪었어요', effect: '나성과 천리장성을 쌓아 대비했어요', explain: '고려는 개경을 둘러싼 나성과, 북쪽 국경을 따라 천리장성을 쌓았어요.' },
    ],
    intro: [{ who: 'pili', text: "역사는 '왜?'와 '그래서'로 이어져 있어요. 원인과 결과를 실로 이어 볼까요?" }],
    hints: ["오른쪽 결과를 하나 골라 '이 일은 왜 일어났을까?' 하고 거꾸로 생각해 봐요."],
    success: [{ who: 'pili', text: '모든 실이 이어졌어요! 이제 기록이 다시 쓰여요…!' }],
  };

  /* ---------- 진행 흐름 ---------- */
  const COURT_KEYS = ['claimLand', 'claimSong', 'nameGoryeo', 'seogyeong', 'jurchen', 'anyung', 'balhae'];
  const CAMP_KEYS = ['invasion2', 'demand', 'scout'];
  const count = (g, keys) => keys.filter((k) => g.has(k)).length;
  const insightCount = (g, ids) => ids.filter((k) => g.has(k)).length;

  async function debateStep(g) {
    const r = await g.puzzle('debate', debate);
    if (r === 'withdraw') {
      await g.say([{ who: 'pili', text: '조정으로 돌아왔어요. 더 조사하고, 📖추론판에서 단서를 이어 본 뒤 서희에게 다시 말을 걸어요.' }]);
      return;
    }
    g.setFlag('debateDone');
    await mapStep(g);
  }

  async function mapStep(g) {
    await g.puzzle('mapPlace', mapCfg);
    g.setFlag('mapDone');
    await g.addClue('gangdong');
    await g.say([
      { who: 'pili', text: '그 뒤로 고려와 거란 사이에는 어떤 일이 있었을까요?' },
      { who: 'pili', text: '시간을 건너 25년 뒤로 가 봐요!' },
    ]);
    await g.goto('camp');
  }

  async function planStep(g) {
    await g.puzzle('battlePlan', planCfg);
    g.removeItem('damKit');
    g.setFlag('damDone');
    await g.addClue('heunghwa');
    await campaignStep(g);
  }

  async function campaignStep(g) {
    await g.puzzle('campaign', campaignCfg);
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
    await g.puzzle('restore', { goal: '기록이 복원되고 있어요', title: '고려의 사라진 기록', era: 'goryeo', points: summary.points });
    await g.complete();
  }

  /* ---------- 마지막 정리 (실제 역사) ---------- */
  const summary = {
    title: '고려의 사라진 기록 — 거란의 침입',
    points: [
      { year: '926년', text: '거란이 발해를 멸망시켰어요. 고려는 거란을 경계했어요.' },
      { year: '993년', text: '거란의 1차 침입. 안융진에서 막힌 거란이 협상을 요구했고, 서희가 소손녕과 담판을 벌여 싸우지 않고 거란군을 돌려보냈어요.' },
      { year: '994년~', text: '고려가 압록강 동쪽의 여진을 몰아내고 강동 6주를 쌓았어요.' },
      { year: '1010년', text: '거란의 2차 침입. 개경이 함락되었지만 고려는 끝까지 맞섰어요.' },
      { year: '1018년', text: '거란이 강동 6주를 돌려 달라 했다가 거절당하자 3차로 침입했어요. 강감찬이 흥화진에서 냇물을 이용해 거란군을 공격했어요.' },
      { year: '1019년', text: '강감찬이 돌아가던 거란군을 귀주에서 크게 물리쳤어요(귀주대첩).' },
      { year: '그 뒤', text: '고려는 개경에 나성, 북쪽 국경에 천리장성을 쌓아 대비했어요. 고려·송·거란 사이에 평화가 이어졌어요.' },
    ],
    keyIdea: '서희는 상대의 속셈을 읽은 외교로, 강감찬은 지형과 때를 살핀 작전으로 나라를 지켰어요. 그리고 서희가 얻은 강동 6주는 25년 뒤 귀주대첩의 무대가 되었어요.',
    think: ['서희가 싸우지 않고도 땅을 얻을 수 있었던 까닭은 무엇일까요?', '1차 침입의 결과가 3차 침입과 어떻게 이어졌을까요?'],
    fiction: [
      '필이, 병사 바우, 근심 많은 관리, 전령은 게임에서 만든 인물이에요.',
      '시간의 서고, 정찰 보고서와 정찰병, 담판 중 태도 게이지는 게임 속 설정이에요.',
      '서희·소손녕·강감찬의 대사는 역사 기록을 바탕으로 쉽게 다시 쓴 창작 대사예요.',
      '지도는 단순하게 그렸고, 성·여울·숲의 위치는 대략적이거나 게임을 위해 만든 것이에요.',
      '작전도의 자리 고르기, 정보 카드, 바람을 보고 공격할 때를 고르는 판단은 게임을 위해 만든 장치예요.',
    ],
  };

  /* ---------- 장면 ---------- */
  const say1 = (g, who, text) => g.say([{ who, text }]);
  const scenes = {
    court: {
      id: 'court',
      caption: { year: '993년', place: '고려 조정' },
      bg: ART.court,
      objective: (g) => {
        if (!g.has('claimLand') || !g.has('claimSong')) return `거란이 무엇을 따지는지 알아내요 (${count(g, ['claimLand', 'claimSong'])}/2)`;
        const n = count(g, COURT_KEYS);
        const k = insightCount(g, ['heir', 'route', 'aim']);
        if (g.flag('debateStage')) return `조사를 더 하고 서희와 담판으로 돌아가요 · 단서 ${n}/7 · 추론 ${k}/3`;
        return `서희의 근거 모으기 · 단서 ${n}/7 · 추론 ${k}/3 · 준비되면 서희에게`;
      },
      hint: (g) => {
        if (!g.has('claimLand')) return ['거란 장수가 무엇을 주장하는지부터 알아야 해요. 방 안에 거란 진영 소식이 있을까요?', '왼쪽 탁자 위의 두루마리를 살펴봐요.'];
        if (!g.has('claimSong')) return ['거란의 불만이 하나 더 있대요. 조정 사람에게 물어볼까요?', '초록 옷의 관리에게 말을 걸어 봐요.'];
        const missing = COURT_KEYS.filter((k) => !g.has(k));
        if (missing.length)
          return ['방에는 아직 살펴보지 않은 곳이 있어요. 사람에게 말을 걸고, 물건을 조사해 봐요.',
            { nameGoryeo: '오른쪽 벽의 붉은 깃발을 살펴봐요.', seogyeong: '서희에게 말을 걸어 봐요.', jurchen: '가운데 탁자 위 지도를 살펴봐요.', anyung: '문 앞에 막 도착한 전령이 있어요.', balhae: '오른쪽 아래 책 더미를 살펴봐요.' }[missing[0]]];
        if (!g.has('heir') || !g.has('route') || !g.has('aim'))
          return ['단서 하나만으로는 소손녕을 설득하기 어려워요. 오른쪽 위 🧩추론판의 탐구 질문을 풀어 봐요.',
            '추론판에서 막히면, 추론판 안의 💡힌트를 눌러 보세요. 질문마다 3단계로 도와줘요.'];
        return '준비가 다 됐어요! 파란 옷의 서희에게 말을 걸어 담판을 시작해요.';
      },
      onEnter: async (g, first) => {
        if (g.flag('debateDone') && !g.flag('mapDone')) return mapStep(g);
        if (first)
          await g.say([
            { who: 'official', text: '큰일이오! 거란 장수 소손녕이 대군을 이끌고 쳐들어와 항복하라 하오!' },
            { who: 'seohui', text: '내가 소손녕을 만나 담판을 짓겠소. 그 전에 저들의 주장과 우리의 근거를 알아야 하오.' },
            { who: 'pili', text: '단서는 조각조각이에요. 단서를 모아 오른쪽 위 🧩추론판의 탐구 질문을 풀어 봐요!' },
          ]);
      },
      hotspots: [
        {
          id: 'report', label: '탁자 위 두루마리', x: 30, y: 470, w: 180, h: 130, art: ART.reportTable,
          onClick: async (g) => {
            if (g.has('claimLand')) return say1(g, 'pili', '정찰 보고서예요. 소손녕의 첫째 주장이 적혀 있어요.');
            await say1(g, 'pili', '거란 진영을 살피고 온 정찰 보고서예요. (보고서는 게임 속 설정, 주장은 실제 기록이에요)');
            await g.addClue('claimLand');
          },
        },
        {
          id: 'seohui', label: '서희', x: 240, y: 280, w: 150, h: 245, art: () => fig(looks.seohui),
          onClick: async (g) => {
            if (!g.has('seogyeong')) {
              await g.say([
                { who: 'seohui', text: '어떤 신하들은 서경 북쪽 땅을 떼어 주자고 하오. 하지만 서경은 그리 쉽게 내줄 곳이 아니오.' },
                { who: 'seohui', text: '평양, 곧 서경은 옛 고구려의 도읍이었소. 우리 고려가 무척 아끼는 곳이오.' },
              ]);
              return g.addClue('seogyeong');
            }
            if (!g.has('claimLand') || !g.has('claimSong'))
              return say1(g, 'seohui', '먼저 거란이 무엇을 따지는지 알아 오시오. 상대의 주장을 알아야 맞설 수 있소.');
            const k = insightCount(g, ['heir', 'route', 'aim']);
            await say1(g, 'seohui', k < 2 ? '근거가 아직 부족해 보이지만… 직접 부딪쳐 보는 것도 방법이오. 가 보겠소?' : '근거가 꽤 모였구려. 소손녕을 만나러 갑시다!');
            await debateStep(g);
          },
        },
        {
          id: 'messenger', label: '전령', x: 600, y: 300, w: 120, h: 196, art: () => fig(looks.messenger),
          onClick: async (g) => {
            if (g.has('anyung')) return say1(g, 'messenger', '거란군은 여전히 그 자리에서 글만 보내고 있습니다!');
            await g.say([{ who: 'messenger', text: '급보요! 급보! 안융진 소식입니다!' }]);
            await g.addClue('anyung');
          },
        },
        {
          id: 'map', label: '탁자 위 지도', x: 470, y: 480, w: 280, h: 140, art: ART.mapTable,
          onClick: async (g) => {
            await g.showPicture(`<svg viewBox="0 0 800 640" xmlns="http://www.w3.org/2000/svg">${ART.mapBase()}</svg>`, '고려 북쪽 지도 (단순하게 그린 지도)');
            if (!g.has('jurchen')) await g.addClue('jurchen');
          },
        },
        {
          id: 'official', label: '근심 많은 관리', x: 790, y: 290, w: 150, h: 245, art: () => fig(looks.official),
          onClick: async (g) => {
            if (g.has('claimSong')) return say1(g, 'official', '거란이 송나라 이야기를 할 때면 얼굴이 붉어진다더군요.');
            await g.say([
              { who: 'official', text: '거란 사신이 오갈 때마다 하는 불평이 있소.' },
              { who: 'official', text: "'고려는 이웃한 거란을 두고 바다 건너 송나라와만 사귄다!' 하고 말이오." },
            ]);
            await g.addClue('claimSong');
          },
        },
        {
          id: 'banner', label: '붉은 깃발', x: 990, y: 120, w: 100, h: 260, art: ART.banner,
          onClick: async (g) => {
            if (g.has('nameGoryeo')) return say1(g, 'pili', "'高麗(고려)'. 이 이름, 무언가와 닮지 않았나요?");
            await say1(g, 'pili', "'高麗(고려)'라고 쓰여 있어요. (깃발은 게임 속 장식이에요)");
            await g.addClue('nameGoryeo');
          },
        },
        {
          id: 'books', label: '옛 기록', x: 1000, y: 500, w: 180, h: 140, art: ART.books,
          onClick: async (g) => {
            if (g.has('balhae')) return say1(g, 'pili', '거란이 발해를 멸망시킨 옛 기록이에요.');
            await g.addClue('balhae');
          },
        },
        {
          id: 'cat', label: '잠자는 고양이', x: 400, y: 620, w: 110, h: 74, sparkle: () => false,
          art: (g) => HA.art.cat(g.flag('catAwake')),
          onClick: async (g) => {
            g.setFlag('catAwake', !g.flag('catAwake'));
            g.refresh();
            await say1(g, 'pili', '어? 고양이 밑에 구겨진 상소문 한 장이 깔려 있어요!');
            await g.findSecret('halji');
          },
        },
        {
          id: 'coin', label: '반짝이는 것', x: 860, y: 640, w: 50, h: 40, sparkle: () => false, cls: 'tiny-spot',
          visible: (g) => !g.st.secrets.includes('coin'),
          art: () => '<svg viewBox="0 0 50 40"><ellipse cx="25" cy="22" rx="12" ry="7" fill="#c9a14a"/><rect x="22" y="19" width="6" height="5" fill="#7a5a20"/></svg>',
          onClick: (g) => g.findSecret('coin'),
        },
      ],
    },

    camp: {
      id: 'camp',
      caption: {
        year: '1018년 겨울',
        place: '흥화진 근처 고려군 진영',
        jump: { gap: '⏳ 25년 뒤', marks: [{ y: '993', t: '서희의 담판' }, { y: '994~', t: '강동 6주' }, { y: '1010', t: '거란의 2차 침입' }, { y: '1018', t: '거란의 3차 침입' }] },
      },
      bg: ART.camp,
      objective: (g) => {
        if (!g.has('why3')) return `거란이 왜 다시 왔는지 밝혀요 · 단서 ${count(g, CAMP_KEYS)}/3 · 추론 ${g.has('why3') ? 1 : 0}/1`;
        if (!g.hasItem('damKit')) return g.hasItem('cowhide') && g.hasItem('rope') ? '두 도구를 합쳐 보세요' : '냇물을 막을 재료를 찾아요';
        return "'쇠가죽 둑'을 냇물에 쓰고 작전을 짜요";
      },
      hint: (g) => {
        const missing = CAMP_KEYS.filter((k) => !g.has(k));
        if (missing.length)
          return ['진영 사람들의 이야기와 물건을 살펴봐요.', { invasion2: '오른쪽 창을 든 병사에게 말을 걸어 봐요.', demand: '깃발 옆 나무 받침대의 글을 살펴봐요.', scout: '강감찬에게 말을 걸어 봐요.' }[missing[0]]];
        if (!g.has('why3')) return ["'거란이 보낸 글'의 번진 글자는 무엇일까요? 🧩추론판에 새 탐구 질문이 열렸어요.", '추론판의 질문 "왜 다시 왔나?"에서 막히면 추론판 안의 💡힌트를 눌러 보세요.'];
        if (!g.hasItem('damKit')) {
          if (!g.hasItem('cowhide') || !g.hasItem('rope')) return ['물을 막으려면 단단한 재료와 묶을 것이 필요해요.', '왼쪽 아래 가죽 더미와 밧줄을 살펴봐요.'];
          return "도구 칸에서 '쇠가죽'을 누르고, 이어서 '굵은 밧줄'을 눌러 합쳐 봐요.";
        }
        return ['만든 도구를 어디에 쓸까요?', "도구 칸의 '쇠가죽 둑'을 누른 다음, 파란 냇물을 눌러요."];
      },
      onEnter: async (g, first) => {
        if (g.flag('damDone') && !g.flag('guijuDone')) return campaignStep(g);
        if (first)
          await g.say([
            { who: 'gang', text: '거란 장수 소배압이 10만 군사를 이끌고 압록강을 건너왔소! 나는 고려군을 이끄는 강감찬이오.' },
            { who: 'gang', text: '그런데 거란은 왜 또 쳐들어온 것이오? 그 까닭부터 밝혀 주시오.' },
          ]);
      },
      hotspots: [
        {
          id: 'cowhide', label: '가죽 더미', x: 50, y: 470, w: 170, h: 140, art: ART.cowhides,
          visible: (g) => !g.hasItem('cowhide') && !g.hasItem('damKit') && !g.flag('damDone'),
          onClick: (g) => g.addItem('cowhide'),
        },
        {
          id: 'rope', label: '밧줄', x: 240, y: 570, w: 120, h: 110, art: ART.rope,
          visible: (g) => !g.hasItem('rope') && !g.hasItem('damKit') && !g.flag('damDone'),
          onClick: (g) => g.addItem('rope'),
        },
        {
          id: 'tent', label: '천막', x: 230, y: 310, w: 170, h: 110, sparkle: () => false, cls: 'area secret',
          onClick: async (g) => {
            await say1(g, 'bau', '장군님은 별이 떨어진 날 태어나셨다는 이야기가 있어요!');
            await g.findSecret('nakseong');
          },
        },
        {
          id: 'gang', label: '강감찬', x: 390, y: 260, w: 150, h: 245, art: () => fig(looks.gang),
          onClick: async (g) => {
            if (!g.has('scout')) {
              await say1(g, 'gang', '정찰병이 적의 길을 알아 왔소. 이걸 보시오.');
              await g.addClue('scout');
              return;
            }
            if (!g.has('why3')) return say1(g, 'gang', '거란이 왜 다시 왔는지 밝혀 주시오. 단서를 이어 보면 보일 것이오.');
            if (!g.flag('toldWhy')) {
              g.setFlag('toldWhy');
              await g.say([
                { who: 'gang', text: '그렇군. 서희 공이 얻은 강동 6주를 거란이 탐내는 것이오. 흥화진도 바로 그 6주의 성이오!' },
                { who: 'gang', text: '반드시 지켜야 하오. 흥화진 앞 냇물을 이용할 방법이 있소. 물을 막을 것을 만들어 주시오.' },
              ]);
              return;
            }
            await say1(g, 'gang', g.hasItem('damKit') ? "그 '쇠가죽 둑'을 냇물에 써 보시오." : '물을 막을 단단한 것을 만들어 주시오.');
          },
        },
        {
          id: 'letter', label: '받침대 위의 글', x: 570, y: 380, w: 120, h: 130, art: ART.letterStand,
          onClick: async (g) => {
            if (g.has('demand')) return say1(g, 'pili', '번진 글자 "○○ 6주"… 어디서 들어 본 것 같지 않나요?');
            await say1(g, 'pili', '거란이 보낸 글이에요. 그런데 글자 일부가 번져 있어요!');
            await g.addClue('demand');
          },
        },
        {
          id: 'stream', label: '냇물', x: 760, y: 480, w: 250, h: 230, cls: 'area',
          onClick: async (g) => {
            await say1(g, 'pili', g.hasItem('damKit') ? "아래 도구 칸에서 '쇠가죽 둑'을 누른 다음, 냇물을 다시 눌러 보세요!" : '흥화진 앞을 흐르는 냇물이에요. 물살이 꽤 세요.');
          },
          onItem: {
            damKit: async (g) => {
              if (!g.has('why3') || !g.has('scout'))
                return g.say([{ who: 'gang', text: '잠깐! 적이 왜 왔는지, 어디로 오는지부터 알아 두시오.' }]);
              await planStep(g);
            },
            cowhide: (g) => say1(g, 'pili', '쇠가죽만으로는 물살에 떠내려가요. 무엇과 함께 쓰면 좋을까요?'),
            rope: (g) => say1(g, 'pili', '밧줄만으로는 물을 막을 수 없어요.'),
          },
        },
        {
          id: 'gate', label: '흥화진 성문', x: 1050, y: 200, w: 90, h: 80, sparkle: () => false, cls: 'area secret',
          onClick: async (g) => {
            await say1(g, 'pili', '성문 옆에 오래된 이름이 새겨져 있어요…');
            await g.findSecret('yanggyu');
          },
        },
        {
          id: 'bau', label: '병사 바우', x: 1080, y: 330, w: 150, h: 245, art: () => fig(looks.bau),
          onClick: async (g) => {
            if (g.has('invasion2')) return say1(g, 'bau', '강감찬 장군님의 작전이라면 꼭 이길 거예요!');
            await g.say([
              { who: 'bau', text: '8년 전에도 거란이 쳐들어왔어요. 그때는 개경까지 불탔대요.' },
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
        { id: 'scroll', label: '찢어진 고려의 기록', x: 500, y: 200, w: 280, h: 200, cls: 'area glow', onClick: (g) => restoreStep(g) },
      ],
    },
  };

  HA.episodes['goryeo-khitan'] = {
    id: 'goryeo-khitan',
    version: 2,
    era: 'goryeo',
    title: '고려의 사라진 기록',
    subtitle: '거란의 침입과 고려의 대응',
    blurb: '거란이 쳐들어왔어요! 조각난 단서를 이어 서희의 담판을 성공시키고, 25년 뒤 강감찬의 작전을 세워 뒤섞인 고려의 기록을 바로잡아요.',
    minutes: '약 15~20분 (구간마다 저장)',
    startScene: 'court',
    characters,
    clues,
    insights,
    clueGroups,
    secrets,
    items,
    recipes,
    scenes,
    summary,
    introArt: ART.archive,
    intro: (g) =>
      g.say([
        { who: 'pili', text: '기록자님, 큰일 났어요! 시간의 서고에 있던 고려의 기록이 찢어져 흩어졌어요!' },
        { who: 'pili', text: "저는 시간의 붓 '필이'예요. 이번 기록은 조각조각 흩어져 있어서, 단서를 서로 이어 봐야 진실이 보여요." },
        { who: 'pili', text: '막히면 💡힌트를 눌러요. 누를수록 조금씩 더 자세히 알려 줄게요. 자, 993년 고려로 가요!' },
      ]),
  };
})();
