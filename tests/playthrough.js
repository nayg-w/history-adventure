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
    const talking = await page.evaluate(() => document.getElementById('dialogue').classList.contains('on'));
    if (talking) await page.click('#dialogue', { position: { x: 640, y: 600 } });
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

  console.log('■ 장면 1: 993년 고려 조정');
  await until(() => document.querySelector('.hs[data-hs="report"]') && window.__idle(), '조정 장면');
  await shot('court');
  // 단서를 다 모으기 전에 서희에게 말 걸기 → 진행 안 됨
  await clickHs('seohui');
  await until(() => document.querySelector('.dlg-text') && /근거가 더 필요/.test(document.querySelector('.dlg-text').textContent) || false, '서희 거절 대사');
  await until(idle, 'idle');
  if (await page.locator('.pz-debate').count()) throw new Error('단서 없이 담판이 시작됨');
  log('단서가 부족하면 담판이 시작되지 않음');
  await clickHs('report');
  await until(hasClue('claims'), 'claims');
  await clickHs('map');
  await until(() => document.querySelector('.pic-ok'), '지도 그림');
  await shot('map-picture');
  await page.click('.pic-ok');
  await until(hasClue('jurchen'), 'jurchen');
  await clickHs('banner');
  await until(hasClue('name'), 'name');
  // 힌트 버튼
  await until(idle, 'idle');
  await page.click('.hud-hint');
  await until(() => /책 더미/.test(document.querySelector('.dlg-text')?.textContent || ''), '힌트 대사');
  log('힌트가 다음에 할 일을 알려 줌');
  await clickHs('books');
  await until(hasClue('balhae'), 'balhae');
  await clickHs('cat');
  await until(idle, 'idle');
  log('단서 4개 수집');
  // 수첩 열기
  await page.click('.hud-notebook');
  await page.waitForTimeout(200);
  await shot('notebook');
  if ((await page.locator('.nb-card:not(.empty)').count()) !== 4) throw new Error('수첩 단서 수가 다름');
  await page.click('[data-t="people"]');
  await page.waitForTimeout(150);
  await shot('notebook-people');
  await page.click('.modal-x');
  log('기록 수첩(단서·인물) 표시');

  console.log('■ 퍼즐 1: 서희의 담판');
  await clickHs('seohui');
  await until(() => document.querySelector('.clue-card') && document.querySelector('.db-bubble.on') && !document.getElementById('dialogue').classList.contains('on'), '담판 시작');
  await shot('debate');
  await page.click('.clue-card[data-id="balhae"]');
  await until(() => document.querySelector('.db-bubble.laugh'), '틀린 카드 반응');
  await shot('debate-wrong');
  await until(() => !document.querySelector('.db-bubble.laugh'), '반응 끝');
  log('틀린 카드 → 소손녕이 반박, 진행은 유지');
  await page.waitForTimeout(200);
  await page.click('.clue-card[data-id="name"]');
  await until(() => /송나라/.test(document.querySelector('.db-bubble')?.textContent || '') && document.querySelector('.clue-card') && !document.getElementById('dialogue').classList.contains('on'), '2라운드');
  await page.click('.clue-card[data-id="jurchen"]');
  log('담판 2라운드 통과');

  console.log('■ 퍼즐 2: 강동 6주 지도');
  await until(() => document.querySelector('.castle-token') && !document.getElementById('dialogue').classList.contains('on'), '지도 퍼즐');
  await shot('map-puzzle');
  await page.click('.castle-token[data-id="heunghwa"]');
  await clickMap(100, 500); // 바다
  await until(() => /바다/.test(document.querySelector('.map-fb').textContent), '바다 피드백');
  await clickMap(600, 450); // 청천강 남쪽
  await until(() => /이미 고려/.test(document.querySelector('.map-fb').textContent), '남쪽 피드백');
  await clickMap(400, 60); // 거란 땅
  await until(() => /거란 땅/.test(document.querySelector('.map-fb').textContent), '북쪽 피드백');
  log('잘못된 지역마다 다른 피드백');
  // 끌어다 놓기로 한 개 배치
  const tok = await page.locator('.castle-token[data-id="heunghwa"]').boundingBox();
  const mr = await page.locator('.map-svg').boundingBox();
  await page.mouse.move(tok.x + 20, tok.y + 20);
  await page.mouse.down();
  await page.mouse.move(tok.x - 100, tok.y + 50, { steps: 5 });
  await page.mouse.move(mr.x + (300 * mr.width) / 800, mr.y + (300 * mr.height) / 640, { steps: 10 });
  await page.mouse.up();
  await until(() => !document.querySelector('.castle-token[data-id="heunghwa"]'), '드래그 배치');
  log('드래그로 성 배치');
  for (const id of ['yong', 'cheol', 'tong', 'gwak', 'gwi']) {
    await page.click(`.castle-token[data-id="${id}"]`);
    await clickMap(320, 300);
  }
  await page.waitForTimeout(600);
  await shot('map-done');
  await until(hasClue('gangdong'), 'gangdong');
  log('강동 6주 완성');

  console.log('■ 장면 2: 1018년 흥화진 진영');
  await until(() => document.querySelector('.scene[data-scene="camp"]') && window.__idle(), '진영 장면');
  await shot('camp');
  await clickHs('cowhide');
  await until(() => document.querySelector('.inv-item[data-item="cowhide"]') && window.__idle(), 'cowhide');
  await clickHs('rope');
  await until(() => document.querySelector('.inv-item[data-item="rope"]') && window.__idle(), 'rope');
  // 도구 합치기 (누르기 → 누르기)
  await page.click('.inv-item[data-item="cowhide"]');
  await page.click('.inv-item[data-item="rope"]');
  await until(() => document.querySelector('.inv-item[data-item="damKit"]') && window.__idle(), '쇠가죽 둑');
  log('도구 합치기: 쇠가죽 + 밧줄 = 쇠가죽 둑');
  // 단서 없이 쓰려 하면 막힘 (끌어다 놓기로 시도)
  const kitBox = await page.locator('.inv-item[data-item="damKit"]').boundingBox();
  await page.mouse.move(kitBox.x + 30, kitBox.y + 20);
  await page.mouse.down();
  await page.mouse.move(kitBox.x + 200, kitBox.y - 50, { steps: 5 });
  await page.mouse.move(880, 600, { steps: 10 });
  await page.mouse.up();
  await until(() => /왜 다시 쳐들어왔는지/.test(document.querySelector('.dlg-text')?.textContent || ''), '단서 부족 안내');
  await until(idle, 'idle');
  log('드래그로 도구 사용 · 단서가 부족하면 작전 보류');
  await clickHs('bau');
  await until(hasClue('invasion2'), 'invasion2');
  await clickHs('letter');
  await until(hasClue('demand'), 'demand');
  await until(idle, 'idle');
  await page.click('.inv-item[data-item="damKit"]');
  await page.click('.hs[data-hs="stream"]');

  console.log('■ 퍼즐 3: 흥화진 냇물 작전');
  await until(() => document.querySelector('.pz-dam') && /둑 자리/.test(document.querySelector('.dam-fb').textContent), '냇물 작전');
  await page.click('.dam-spot');
  await until(() => /골라요/.test(document.querySelector('.dam-fb').textContent), '도구 먼저 안내');
  await page.click('.kit-token');
  await page.click('.dam-spot');
  await until(() => document.querySelector('.pz-dam.dammed'), '둑 설치');
  await page.click('.dam-spot');
  await until(() => /숨겨요/.test(document.querySelector('.dam-fb').textContent), '숨기기 먼저 안내');
  await page.click('.valley-spot');
  await page.waitForTimeout(2600);
  await page.click('.dam-spot'); // 너무 이름
  await until(() => /들어올 때까지/.test(document.querySelector('.dam-fb').textContent), '너무 이른 터뜨리기');
  await shot('dam-early');
  log('너무 일찍 터뜨리면 기다리라는 피드백');
  await until(() => document.querySelector('.pz-dam.crossing'), '건너는 중', 20000);
  await shot('dam-crossing');
  await page.click('.dam-spot');
  await page.waitForTimeout(900);
  await shot('dam-released');
  await until(hasClue('heunghwa'), 'heunghwa');
  log('냇물 작전 성공');

  console.log('■ 퍼즐 4: 귀주 깃발 신호');
  await until(() => document.querySelector('.sig-target') && !document.querySelector('.sig-target').disabled && !document.getElementById('dialogue').classList.contains('on'), '귀주');
  await shot('guiju');
  await page.click('.sig-target');
  await page.waitForTimeout(3800);
  await shot('guiju-banner');
  await until(hasClue('guiju'), 'guiju');
  log('귀주대첩');

  console.log('■ 퍼즐 5: 시간 순서 복원');
  await until(() => document.querySelector('.pz-timeline .tl-card') && !document.getElementById('dialogue').classList.contains('on'), '타임라인');
  await shot('timeline');
  const order = ['t1', 't2', 't3', 't4', 't5', 't6'];
  const wrongOrder = ['t1', 't2', 't4', 't3', 't6', 't5'];
  for (let i = 0; i < 6; i++) {
    await page.click(`.tl-card[data-id="${wrongOrder[i]}"]`);
    await page.click(`.tl-slot[data-i="${i}"]`);
  }
  await page.click('.tl-check');
  await page.waitForTimeout(900);
  await shot('timeline-partial');
  const lockedCount = await page.locator('.tl-card.locked').count();
  if (lockedCount !== 2) throw new Error('부분 정답 고정 수가 다름: ' + lockedCount);
  log('부분 정답 2개는 고정되고 틀린 조각만 돌아옴');
  for (let i = 2; i < 6; i++) {
    await page.click(`.tl-card[data-id="${order[i]}"]`);
    await page.click(`.tl-slot[data-i="${i}"]`);
  }
  await page.click('.tl-check');

  console.log('■ 퍼즐 6: 원인과 결과 잇기');
  await until(() => document.querySelector('.pz-link .lk-node') && !document.getElementById('dialogue').classList.contains('on'), '원인-결과');
  await page.click('.lk-node[data-side="c"][data-i="0"]');
  await page.click('.lk-node[data-side="e"][data-i="1"]');
  await until(() => /바로 이어지지/.test(document.querySelector('.lk-fb').textContent), '틀린 연결');
  log('틀린 연결 피드백');
  // 힌트로 하나 자동 연결 (두 번째 힌트)
  await page.click('.hud-hint');
  await until(() => /거꾸로/.test(document.querySelector('.dlg-text')?.textContent || ''), 'h1 text');
  await until(() => !document.getElementById('dialogue').classList.contains('on'), 'h1');
  await page.click('.hud-hint');
  await until(() => document.querySelectorAll('.lk-node.done').length === 2, '힌트 자동 연결');
  await until(() => !document.getElementById('dialogue').classList.contains('on'), 'h2');
  log('두 번째 힌트는 실 하나를 이어 줌');
  for (let i = 1; i < 5; i++) {
    // 끌어서 잇기와 눌러서 잇기 섞어 쓰기
    if (i === 1) {
      const a = await page.locator(`.lk-node[data-side="c"][data-i="${i}"]`).boundingBox();
      const b = await page.locator(`.lk-node[data-side="e"][data-i="${i}"]`).boundingBox();
      await page.mouse.move(a.x + 50, a.y + 30);
      await page.mouse.down();
      await page.mouse.move(a.x + 200, a.y + 40, { steps: 5 });
      await page.mouse.move(b.x + 60, b.y + 30, { steps: 10 });
      await page.mouse.up();
    } else {
      await page.click(`.lk-node[data-side="c"][data-i="${i}"]`);
      await page.click(`.lk-node[data-side="e"][data-i="${i}"]`);
    }
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(400);
  await shot('links');

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
  await until(hasClue('name'), 'name again');
  await until(idle, 'idle');
  await page.reload();
  await until(() => document.querySelector('[data-a="continue"]'), '이어하기 버튼');
  await shot('title-continue');
  await page.click('[data-a="continue"]');
  await until(() => document.querySelector('.hs[data-hs="report"]') && window.__idle(), '이어하기 장면');
  const st2 = await epSave();
  if (!st2.clues.includes('name') || st2.clues.length !== 1 || !st2.restored) throw new Error('이어하기 상태 오류');
  const cap = await page.textContent('.hud-cap b');
  if (!/1\/4/.test(cap)) throw new Error('목표 표시 오류: ' + cap);
  log('새로고침 후 이어하기 — 단서 1/4 유지, 연대표 복원 유지');

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
