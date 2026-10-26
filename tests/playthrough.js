/* 고려 에피소드 전체를 브라우저에서 처음부터 끝까지 자동으로 플레이하는 기능 테스트.
   실행: npm install && npm test   (스크린숏은 tests/shots/ 에 저장)
   일부러 틀린 선택도 해 보고, 틀려도 처음부터 다시 하지 않는지 확인한다. */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const SHOTS = path.join(__dirname, 'shots');
const EP = 'goryeo-khitan';
fs.mkdirSync(SHOTS, { recursive: true });

let page;
const errors = [];
let step = 0;
const log = (m) => console.log(`  ✔ ${m}`);
async function shot(name) {
  await page.screenshot({ path: path.join(SHOTS, `${String(++step).padStart(2, '0')}-${name}.png`) });
}
const save = () => page.evaluate(() => JSON.parse(localStorage.getItem('history-adventure-save-v1') || '{}'));
const epSave = async () => ((await save()).episodes || {})['goryeo-khitan'] || {};

/** 대화가 나오면 넘기면서 조건이 참이 될 때까지 기다린다 */
async function until(cond, label, timeout = 40000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    if (await page.evaluate(cond)) return;
    const waiting = await page.evaluate(() => document.getElementById('toast').classList.contains('wait'));
    if (waiting) {
      await page.click('#toast', { position: { x: 640, y: 600 } }).catch(() => {});
      await page.waitForTimeout(80);
      continue;
    }
    const talking = await page.evaluate(() => document.getElementById('dialogue').classList.contains('on'));
    if (talking) await page.click('#dialogue', { position: { x: 640, y: 600 } }).catch(() => {});
    await page.waitForTimeout(talking ? 60 : 120);
  }
  await shot('TIMEOUT');
  console.error(await page.evaluate(() => ({ busy: HA.main.game && HA.main.game.busy, fader: document.getElementById('fader').className, dlg: document.getElementById('dialogue').className, gain: !!document.querySelector('.gain-card'), idle: window.__idle && window.__idle() })));
  throw new Error('시간 초과: ' + label);
}
const idle = () =>
  !document.getElementById('dialogue').classList.contains('on') &&
  !document.getElementById('fader').classList.contains('on') &&
  !document.querySelector('.gain-card') &&
  !(HA.main.game && HA.main.game.busy);
const hasClue = (id) => `(() => { const s = JSON.parse(localStorage.getItem('history-adventure-save-v1')); return s.episodes['${EP}'].clues.includes('${id}'); })()`;

async function clickHs(id) {
  await until(idle, 'idle before ' + id);
  await page.click(`.hs[data-hs="${id}"]`);
}

/** 지도 좌표(800x640)를 화면 좌표로 바꿔 클릭 */
async function clickMap(x, y) {
  const r = await page.locator('.map-svg').boundingBox();
  await page.mouse.click(r.x + (x * r.width) / 800, r.y + (y * r.height) / 640);
}

(async () => {
  const browser = await chromium.launch();
  page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.addInitScript(`window.__idle = ${idle.toString()}`);
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('file://' + path.join(ROOT, 'index.html'));
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  console.log('■ 메인 메뉴 → 시대 선택');
  await shot('title');
  await page.click('[data-a="eras"]');
  await page.click('.era-card[data-era="prehistory"]');
  await until(() => /준비 중/.test(document.getElementById('toast').textContent), '준비 중 안내');
  log('준비 중 시대는 안내만 표시');
  await page.click('.era-card[data-era="goryeo"]');
  await page.click('[data-m="start"]');
  log('고려 에피소드 시작');

  console.log('■ 장면 1: 993년 고려 조정 — 부분 단서 모으기');
  await until(() => document.querySelector('.hs[data-hs="report"]') && window.__idle(), '조정 장면');
  await shot('court');
  await clickHs('report');
  await until(hasClue('claimLand'), 'claimLand');
  // 단계별 힌트: 같은 목표에서 누를 때마다 더 구체적으로
  await until(idle, 'idle');
  await page.click('.hud-hint');
  await until(() => /조정 사람에게/.test(document.querySelector('.dlg-text')?.textContent || ''), '힌트 1단계');
  await until(idle, 'idle');
  await page.click('.hud-hint');
  await until(() => /초록 옷/.test(document.querySelector('.dlg-text')?.textContent || ''), '힌트 2단계');
  log('힌트는 단계적으로 구체화됨 (1단계: 방향 → 2단계: 위치)');
  await clickHs('seohui');
  await until(hasClue('seogyeong'), 'seogyeong (서희와 대화)');
  await clickHs('seohui');
  await until(() => /먼저 거란이 무엇을/.test(document.querySelector('.dlg-text')?.textContent || ''), '주장 모르면 담판 불가');
  log('상대 주장을 모두 알기 전에는 담판에 갈 수 없음');
  await clickHs('official');
  await until(hasClue('claimSong'), 'claimSong');

  console.log('■ 근거 없이 담판에 먼저 가 보기 → 반론 → 물러나기');
  await clickHs('seohui');
  await until(() => document.querySelector('.db-choice') && !document.getElementById('dialogue').classList.contains('on'), '담판(예법)');
  await shot('debate-stance');
  await page.click('.db-choice:has-text("칼을")');
  await until(() => [...document.querySelectorAll('.db-choice')].some((b) => /칼을/.test(b.textContent) && b.disabled) && !document.getElementById('dialogue').classList.contains('on'), '틀린 태도');
  const mood1 = await page.evaluate(() => parseFloat(document.querySelector('.db-meter .bar i').style.width));
  if (!(mood1 < 50)) throw new Error('태도 게이지가 줄지 않음: ' + mood1);
  log('틀린 태도 → 소손녕의 태도 게이지 감소, 선택지만 비활성');
  await page.click('.db-choice:has-text("대등하다")');
  await until(() => document.querySelector('.db-hand .clue-card') && !document.getElementById('dialogue').classList.contains('on'), '첫째 주장');
  await page.click('.clue-card[data-id="seogyeong"]');
  await until(() => /하나로 엮어/.test(document.querySelector('.db-bubble')?.textContent || ''), '반쯤 맞는 카드 반론');
  await shot('debate-partial');
  log('부분 근거 → 정답 공개 없이 "무엇이 부족한지" 반론');
  await page.click('.db-withdraw');
  await until(() => !document.querySelector('.pz-debate') && window.__idle(), '물러나기');
  if ((await epSave()).flags.debateStage !== 1) throw new Error('담판 진행 단계 저장 안 됨');
  log('물러나기 → 조정으로 복귀, 담판 단계(1) 저장');

  console.log('■ 조사 마저 하기 + 숨은 기록');
  await clickHs('banner');
  await until(hasClue('nameGoryeo'), 'nameGoryeo');
  await clickHs('map');
  await until(() => document.querySelector('.pic-ok'), '지도 그림');
  await page.click('.pic-ok');
  await until(hasClue('jurchen'), 'jurchen');
  await clickHs('messenger');
  await until(hasClue('anyung'), 'anyung');
  await clickHs('books');
  await until(hasClue('balhae'), 'balhae');
  await clickHs('cat');
  await until(() => (JSON.parse(localStorage.getItem('history-adventure-save-v1')).episodes['goryeo-khitan'].secrets || []).includes('halji'), '숨은 기록 halji');
  await clickHs('coin');
  await until(() => (JSON.parse(localStorage.getItem('history-adventure-save-v1')).episodes['goryeo-khitan'].secrets || []).includes('coin'), '숨은 기록 coin');
  await until(idle, 'idle');
  log('조정 단서 7개 + 숨은 기록 2개');

  console.log('■ 추론판 — 처음 사용 안내');
  await page.click('.hud-deduce');
  await until(() => document.querySelector('.dq-tut'), '사용법 안내 표시');
  await shot('deduce-tutorial');
  await page.click('.dq-next');
  if (!/단서 고르기/.test(await page.textContent('.dq-tut h4'))) throw new Error('안내 2단계 아님');
  await page.click('.dq-skip');
  if (await page.locator('.dq-tut').count()) throw new Error('건너뛰기 안 됨');
  if ((await page.locator('.dq-card.sel').count()) || (await page.locator('.dq-step.done').count())) throw new Error('안내가 답을 채움');
  await page.click('.modal-x');
  await page.keyboard.press('d');
  await until(() => document.querySelector('.ded2'), '단축키 D');
  if (await page.locator('.dq-tut').count()) throw new Error('안내가 다시 나타남');
  log('첫 사용 안내(3단계, 건너뛰기 가능) — 답을 채우지 않고, 다시 나타나지 않음');

  console.log('■ 추론판 — 질문·단서·힌트·피드백');
  const goal = await page.textContent('.dq-goal h3');
  if (!/고구려의 옛 땅/.test(goal)) throw new Error('첫 질문이 아님: ' + goal);
  if ((await page.locator('.dq-group').count()) !== 3) throw new Error('단서 갈래 표시 오류');
  await page.click('.dq-info[data-id="seogyeong"]');
  await until(() => /서희의 이야기/.test(document.querySelector('.dq-from')?.textContent || ''), '얻은 곳 다시 보기');
  await shot('deduce-detail');
  await page.click('.dq-close');
  log('탐구 질문 표시, 단서 3갈래, ⓘ로 얻은 곳·내용 다시 보기');
  // 3단계 힌트 (누를 때만)
  if (await page.locator('.dq-hinttext span').count()) throw new Error('힌트가 저절로 보임');
  for (let i = 1; i <= 3; i++) {
    await page.click('.dq-hint');
    if (!new RegExp(i + '단계').test(await page.textContent('.dq-hinttext'))) throw new Error('힌트 단계 오류 ' + i);
  }
  const h3 = await page.textContent('.dq-hinttext');
  if (/나라 이름 '高麗'|서경\(평양\)/.test(h3) || !/연결 힌트/.test(h3)) throw new Error('힌트가 단서 이름을 그대로 공개함');
  await shot('deduce-hints');
  log('힌트는 요청할 때만, 1 생각 방향 → 2 찾아볼 범위 → 3 연결 힌트 (단서 이름은 공개 안 함)');
  async function pickPair(a, b) {
    await page.click(`.dq-sel[data-id="${a}"]`);
    await page.click(`.dq-sel[data-id="${b}"]`);
    await page.click('.dq-go');
  }
  async function clearSlots() {
    for (const i of [1, 0]) if (await page.locator(`.dq-slot[data-s="${i}"].full`).count()) await page.click(`.dq-slot[data-s="${i}"]`);
  }
  await pickPair('balhae', 'jurchen');
  const fb1 = await page.textContent('.dq-msg.bad');
  await clearSlots();
  await pickPair('nameGoryeo', 'claimLand');
  const fb2 = await page.textContent('.dq-msg.bad');
  await clearSlots();
  await pickPair('jurchen', 'claimSong');
  const fb3 = await page.textContent('.dq-msg.bad');
  await shot('deduce-wrong');
  if (!/발해 이야기/.test(fb1) || !/하나는 이 질문과/.test(fb2) || !/주장 그 자체/.test(fb2) || !/교류를 못 했나/.test(fb3)) throw new Error('오답 피드백 오류:\n' + [fb1, fb2, fb3].join('\n'));
  log('오답 피드백이 고른 단서마다 다름 (관련 없는 단서 / 반쪽 근거 / 다른 질문의 짝)');
  await clearSlots();
  async function solve(q, a, b, wrongText, rightText) {
    await page.click(`.dq-step[data-q="${q}"]`);
    await pickPair(a, b);
    await until(() => document.querySelector('.dq-link.tied'), '실 이어짐');
    if (wrongText) {
      await page.click(`.dq-choice:has-text("${wrongText}")`);
      await until(() => document.querySelector('.dq-why.bad'), '틀린 결론 이유');
    }
    await page.click(`.dq-choice:has-text("${rightText}")`);
    await until(hasClue(q), 'insight ' + q);
    await until(`!document.querySelector('#toast .gain-card') && !!document.querySelector('.dq-step.done[data-q="${q}"]')`, '추론판 갱신');
  }
  await solve('heir', 'nameGoryeo', 'seogyeong', '같은 해에', '이어받은 나라');
  log('맞는 짝 → 실이 이어지고, 근거에 맞는 결론 고르기 → heir');
  if (!/거란의 속셈|교류를 못/.test(await page.textContent('.dq-step.cur'))) throw new Error('다음 질문으로 넘어가지 않음');
  await solve('route', 'claimSong', 'jurchen', null, '길이 열리면');
  await solve('aim', 'anyung', 'claimSong', '모두 차지할', '송 대신');
  if ((await page.locator('.dq-step.done').count()) !== 3) throw new Error('해결 표시 오류');
  if (!(await page.locator('.dq-step[data-q="why3"]').isDisabled())) throw new Error('4번째 질문이 미리 열림');
  await shot('deduce-done');
  await page.click('.modal-x');
  log('조정 질문 3개 해결, 1018년 질문은 잠김 상태');

  console.log('■ 퍼즐 1: 담판 (이어서)');
  await clickHs('seohui');
  await until(() => document.querySelector('.db-hand .clue-card') && !document.getElementById('dialogue').classList.contains('on'), '담판 재개(첫째 주장)');
  log('담판이 저장된 단계(첫째 주장)부터 재개');
  await page.click('.clue-card[data-id="heir"]');
  await until(() => /송나라와만/.test(document.querySelector('.db-bubble')?.textContent || '') && document.querySelector('.clue-card') && !document.getElementById('dialogue').classList.contains('on'), '둘째 주장');
  await page.click('.clue-card[data-id="jurchen"]');
  await until(() => /그래서 어쩌겠다/.test(document.querySelector('.db-bubble')?.textContent || ''), '여진 단독 카드 반론');
  await page.click('.clue-card[data-id="route"]');
  await until(() => document.querySelector('.deal-opt') && !document.getElementById('dialogue').classList.contains('on'), '협상안');
  await page.click('.deal-opt[data-o="give"]');
  await page.click('.deal-opt[data-o="retreat"]');
  await page.click('.deal-go');
  await until(() => /땅을 내주지 않으려고/.test(document.querySelector('.dlg-text')?.textContent || ''), '땅 내주기 반응');
  await until(() => !document.getElementById('dialogue').classList.contains('on'), 'd');
  await shot('debate-deal');
  await page.click('.deal-opt[data-o="trade"]');
  await page.click('.deal-go');
  log('협상안: 잘못된 조건 → 반응, 고쳐서 성사');

  console.log('■ 퍼즐 2: 강동 6주 지도');
  await until(() => document.querySelector('.castle-token') && !document.getElementById('dialogue').classList.contains('on'), '지도 퍼즐');
  await page.click('.castle-token[data-id="heunghwa"]');
  await clickMap(600, 450);
  await until(() => /이미 고려가/.test(document.querySelector('.map-fb').textContent), '남쪽 피드백');
  for (const id of ['yong', 'cheol', 'tong', 'gwak', 'gwi', 'heunghwa']) {
    await page.click(`.castle-token[data-id="${id}"]`);
    await clickMap(320, 300);
  }
  await until(hasClue('gangdong'), 'gangdong');
  log('강동 6주 완성');

  console.log('■ 장면 2: 1018년 흥화진 진영 (25년 뒤 표시)');
  await until(() => /25년 뒤/.test(document.getElementById('fader').textContent), '시간 간격 표시');
  await page.waitForTimeout(1200);
  await shot('time-jump');
  log('993 → 1018 시간 간격 띠 표시');
  await until(() => document.querySelector('.scene[data-scene="camp"]') && window.__idle(), '진영');
  await shot('camp');
  await clickHs('bau');
  await until(hasClue('invasion2'), 'invasion2');
  await clickHs('letter');
  await until(hasClue('demand'), 'demand');
  await clickHs('gang');
  await until(hasClue('scout'), 'scout');
  await clickHs('gate');
  await until(() => (JSON.parse(localStorage.getItem('history-adventure-save-v1')).episodes['goryeo-khitan'].secrets || []).includes('yanggyu'), 'yanggyu');
  await clickHs('tent');
  await until(() => (JSON.parse(localStorage.getItem('history-adventure-save-v1')).episodes['goryeo-khitan'].secrets || []).includes('nakseong'), 'nakseong');
  await until(idle, 'idle');
  await page.click('.hud-deduce');
  await until(() => /1018년, 거란은 왜/.test(document.querySelector('.dq-goal h3')?.textContent || ''), '진영에서는 새 질문이 바로 열림');
  await pickPair('invasion2', 'demand');
  if (!/8년 전 2차 침입/.test(await page.textContent('.dq-msg.bad'))) throw new Error('진영 오답 피드백 오류');
  await clearSlots();
  await solve('why3', 'demand', 'gangdong', '거짓 약속', '되찾으려');
  await page.click('.modal-x');
  log('추론: 강동 6주 + 거란의 글 → 3차 침입의 까닭 (앞 구간 단서 활용)');
  await clickHs('gang');
  await until(() => /6주의 성이오/.test(document.querySelector('.dlg-text')?.textContent || ''), '강감찬 반응');
  await clickHs('cowhide');
  await until(() => document.querySelector('.inv-item[data-item="cowhide"]') && window.__idle(), 'cowhide');
  await clickHs('rope');
  await until(() => document.querySelector('.inv-item[data-item="rope"]') && window.__idle(), 'rope');
  await page.click('.inv-item[data-item="cowhide"]');
  await page.click('.inv-item[data-item="rope"]');
  await until(() => document.querySelector('.inv-item[data-item="damKit"]') && window.__idle(), '쇠가죽 둑');
  await page.click('.inv-item[data-item="damKit"]');
  await page.click('.hs[data-hs="stream"]');

  console.log('■ 퍼즐 3: 흥화진 작전도');
  await until(() => document.querySelector('.pz-plan .plan-token') && !document.getElementById('dialogue').classList.contains('on'), '작전도');
  async function plan(d, a, t) {
    await page.click('.plan-token[data-id="dam"]');
    await page.click(`.plan-spot[aria-label="${d}"]`);
    await page.click('.plan-token[data-id="ambush"]');
    await page.click(`.plan-spot[aria-label="${a}"]`);
    await page.check(`input[name="tm"][value="${t}"]`);
    await page.click('.plan-go');
  }
  await page.click('.plan-token[data-id="dam"]');
  await page.click('.plan-spot[aria-label="골짜기 숲"]');
  await until(() => /후보 자리/.test(document.querySelector('.plan-fb').textContent), '종류 다른 자리');
  await page.click('.plan-token[data-id="dam"]'); // 선택 해제
  await plan('냇물 오른쪽', '골짜기 숲', 'middle');
  await until(() => /작전 실패/.test(document.querySelector('.plan-fb').textContent) && /차올랐/.test(document.querySelector('.plan-fb').textContent), '하류 둑 실패');
  await shot('plan-fail');
  await until(() => !document.querySelector('.plan-go').disabled && !document.getElementById('dialogue').classList.contains('on'), '재시도 가능');
  await plan('냇물 왼쪽', '탁 트인 눈밭', 'middle');
  await until(() => /눈에 띄었/.test(document.querySelector('.plan-fb').textContent), '눈밭 실패');
  await until(() => !document.querySelector('.plan-go').disabled && !document.getElementById('dialogue').classList.contains('on'), '재시도 가능2');
  await plan('냇물 왼쪽', '골짜기 숲', 'early');
  await until(() => /먼저 쏟아져/.test(document.querySelector('.plan-fb').textContent), '이른 시점 실패');
  await until(() => !document.querySelector('.plan-go').disabled && !document.getElementById('dialogue').classList.contains('on'), '재시도 가능3');
  log('둑 위치·매복 위치·시점이 각각 틀리면 서로 다른 장면 피드백, 배치는 유지된 채 재시도');
  await page.check('input[name="tm"][value="middle"]');
  await page.click('.plan-go');
  await until(hasClue('heunghwa'), 'heunghwa');
  log('흥화진 작전 성공');

  console.log('■ 퍼즐 4: 3차 침입 작전');
  await until(() => document.querySelector('.camp-side .db-choice') && !document.getElementById('dialogue').classList.contains('on'), '예측 단계');
  await shot('campaign-predict');
  await page.click('.camp-side .db-choice:has-text("오래오래")');
  await until(() => /오래 버틸/.test(document.querySelector('.dlg-text')?.textContent || ''), '예측 오답 반론');
  await until(() => !document.getElementById('dialogue').classList.contains('on'), 'x');
  await page.click('.camp-side .db-choice:has-text("되돌아간다")');
  await until(() => document.querySelector('.map-target') && !document.getElementById('dialogue').classList.contains('on'), '길목 단계');
  log('예측: 정보에 비춘 반론 후 정답');
  // 길목 단계에서 새로고침 → 이어하기로 같은 단계 복귀
  await page.reload();
  await page.click('[data-a="continue"]');
  await until(() => document.querySelector('.map-target'), '이어하기 후 길목 단계', 30000);
  log('작전 도중 새로고침 → 같은 단계(길목 고르기)에서 이어하기');
  await shot('campaign-route');
  await page.click('.map-target:has-text("개경")');
  await until(() => /이미 개경을 떠나/.test(document.querySelector('.map-fb').textContent), '개경 오답');
  await page.click('.map-target:has-text("귀주")');
  await until(() => document.querySelector('.battle-go') && !document.getElementById('dialogue').classList.contains('on'), '결전 단계');
  await shot('campaign-wind');
  await page.click('.battle-go');
  await until(() => /바람이 우리 쪽으로/.test(document.querySelector('.dlg-text')?.textContent || ''), '북풍 공격 실패');
  await until(() => !document.getElementById('dialogue').classList.contains('on'), 'y');
  // 지나치게 기다리면 거란군이 빠져나감 → 처음 상황부터
  for (let i = 0; i < 4; i++) {
    await page.click('.battle-wait');
    await page.waitForTimeout(120);
  }
  await until(() => /빠져나가 버렸소/.test(document.querySelector('.dlg-text')?.textContent || ''), '너무 오래 기다림');
  await until(() => !document.getElementById('dialogue').classList.contains('on'), 'z');
  log('북풍에 공격 → 반격당함 / 너무 오래 기다림 → 적이 빠져나가 재도전');
  for (let i = 0; i < 3; i++) {
    await page.click('.battle-wait');
    await page.waitForTimeout(120);
  }
  if ((await page.getAttribute('.pz-campaign', 'data-wind')) !== 'south') throw new Error('남풍이 아님');
  await page.click('.battle-go');
  await page.waitForTimeout(2000);
  await shot('guiju-banner');
  await until(hasClue('guiju'), 'guiju');
  log('남풍 + 지원군 도착 때 총공격 → 귀주대첩');

  console.log('■ 퍼즐 5: 시간 순서 복원 (첫 확인은 개수만)');
  await until(() => document.querySelector('.pz-timeline .tl-card') && !document.getElementById('dialogue').classList.contains('on'), '타임라인');
  const order = ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'];
  const wrongOrder = ['t1', 't3', 't2', 't4', 't6', 't5', 't7', 't8'];
  for (let i = 0; i < 8; i++) {
    await page.click(`.tl-card[data-id="${wrongOrder[i]}"]`);
    await page.click(`.tl-slot[data-i="${i}"]`);
  }
  await page.click('.tl-check');
  await until(() => /8개 가운데 4개/.test(document.querySelector('.tl-fb').textContent), '개수만 알려 줌');
  if (await page.locator('.tl-card.locked').count()) throw new Error('첫 확인에서 고정되면 안 됨');
  await shot('timeline-count');
  log('첫 확인: "8개 가운데 4개" — 어느 것인지는 비밀');
  await page.click('.tl-check');
  await page.waitForTimeout(900);
  if ((await page.locator('.tl-card.locked').count()) !== 4) throw new Error('두 번째 확인 고정 수 오류');
  log('두 번째 확인부터 맞은 조각 고정');
  for (const i of [1, 2, 4, 5]) {
    await page.click(`.tl-card[data-id="${order[i]}"]`);
    await page.click(`.tl-slot[data-i="${i}"]`);
  }
  await page.click('.tl-check');

  console.log('■ 퍼즐 6: 원인과 결과 잇기');
  await until(() => document.querySelector('.pz-link .lk-node') && !document.getElementById('dialogue').classList.contains('on'), '원인-결과');
  await page.click('.lk-node[data-side="c"][data-i="0"]');
  await page.click('.lk-node[data-side="e"][data-i="1"]');
  await until(() => /바로 이어지지/.test(document.querySelector('.lk-fb').textContent), '틀린 연결');
  for (let i = 0; i < 6; i++) {
    await page.click(`.lk-node[data-side="c"][data-i="${i}"]`);
    await page.click(`.lk-node[data-side="e"][data-i="${i}"]`);
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(400);
  await shot('links');
  log('원인-결과 6쌍 연결');

  console.log('■ 기록 복원 · 완료');
  await until(() => document.querySelector('.rs-next') && !document.querySelector('.rs-next').hidden, '복원 연출');
  await shot('restore');
  await page.click('.rs-next');
  await until(() => document.querySelector('.complete-screen'), '완료 화면');
  await page.waitForTimeout(1000);
  await shot('complete');
  const st = await epSave();
  if (st.status !== 'done' || !st.restored) throw new Error('완료 상태가 저장되지 않음');
  log('완료 상태 저장 (status=done, restored=true)');
  const statsText = await page.textContent('.cp-stats');
  if (!/추론 4\/4/.test(statsText) || !/숨은 기록 4\/4/.test(statsText)) throw new Error('탐험 기록 표시 오류: ' + statsText);
  log('완료 화면 탐험 기록: ' + statsText.trim());
  await page.click('[data-a="chronicle"]');
  await page.waitForTimeout(500);
  await shot('chronicle');
  if (!(await page.locator('.chron-era[data-era="goryeo"] .restored').count())) throw new Error('연대표에 복원 기록 없음');
  log('연대표에 고려 기록 표시');

  console.log('■ 다시 플레이해도 연대표 유지 + 저장/이어하기');
  await page.click('[data-a="eras"]');
  await page.click('.era-card[data-era="goryeo"]');
  await page.click('[data-m="restart"]');
  await until(() => document.querySelector('.hs[data-hs="report"]') && window.__idle(), '재시작');
  await clickHs('banner');
  await until(hasClue('nameGoryeo'), 'name again');
  await until(idle, 'idle');
  await page.reload();
  await until(() => document.querySelector('[data-a="continue"]'), '이어하기 버튼');
  await shot('title-continue');
  await page.click('[data-a="continue"]');
  await until(() => document.querySelector('.hs[data-hs="report"]') && window.__idle(), '이어하기 장면');
  const st2 = await epSave();
  if (!st2.clues.includes('nameGoryeo') || st2.clues.length !== 1 || !st2.restored) throw new Error('이어하기 상태 오류');
  log('다시 플레이 후 새로고침·이어하기 — 단서 1개 유지, 연대표 복원 유지');

  // 키보드 조작
  await page.keyboard.press('Escape');
  await until(() => document.querySelector('.menu-list'), '메뉴');
  await page.keyboard.press('Escape');
  await page.keyboard.press('n');
  await until(() => document.querySelector('.notebook'), '수첩 단축키');
  await page.keyboard.press('Escape');
  await page.keyboard.press('Tab');
  log('키보드: Esc 메뉴, N 수첩');

  // 태블릿 크기
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.waitForTimeout(300);
  await shot('tablet-1024x768');
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.waitForTimeout(300);
  await shot('tablet-portrait');

  await browser.close();
  if (errors.length) {
    console.error('\n✘ 브라우저 오류:\n' + errors.join('\n'));
    process.exit(1);
  }
  console.log('\n모든 테스트 통과 ✅ (스크린숏: tests/shots/)');
})().catch(async (e) => {
  console.error('\n✘ 실패:', e.message);
  if (errors.length) console.error('브라우저 오류:\n' + errors.join('\n'));
  process.exit(1);
});
