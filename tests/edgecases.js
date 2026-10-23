/* 진행 불가·저장·퍼즐 초기화와 관련된 경계 상황 테스트.
   실행: node tests/edgecases.js */
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const KEY = 'history-adventure-save-v1';
const ok = (m) => console.log('  ✔ ' + m);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const talking = () => page.evaluate(() => document.getElementById('dialogue').classList.contains('on'));
  async function until(cond, label, t = 20000) {
    const t0 = Date.now();
    while (Date.now() - t0 < t) {
      if (await page.evaluate(cond)) return;
      if (await page.evaluate(() => document.getElementById('toast').classList.contains('wait'))) await page.click('#toast').catch(() => {});
      else if (await talking()) await page.click('#dialogue', { position: { x: 640, y: 600 } }).catch(() => {});
      await page.waitForTimeout(80);
    }
    throw new Error('시간 초과: ' + label);
  }
  await page.goto('file://' + path.join(ROOT, 'index.html'));

  console.log('■ 옛 버전(1차 프로토타입) 저장 → 새 내용으로 안전하게 초기화');
  await page.evaluate((k) => {
    localStorage.setItem(k, JSON.stringify({ version: 1, settings: { sound: false }, episodes: { 'goryeo-khitan': {
      status: 'playing', scene: 'camp', clues: ['claims', 'name'], items: [], flags: {}, seen: [], met: [], restored: true, completions: 1 } } }));
  }, KEY);
  await page.reload();
  await page.click('[data-a="continue"]');
  await until(() => document.querySelector('.scene[data-scene="court"]') && !document.getElementById('fader').classList.contains('on'), '초기화 후 조정');
  const st = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)).episodes['goryeo-khitan'], KEY);
  if (st.clues.length || st.contentVersion !== 2 || !st.restored) throw new Error('옛 저장 처리 오류 ' + JSON.stringify(st));
  ok('옛 저장의 없는 단서·장면 대신 새 에피소드로 시작, 복원한 연대표 기록은 유지');

  console.log('■ 담판 결렬 → 같은 단계부터 다시 (처음으로 돌아가지 않음)');
  await page.evaluate((k) => {
    const s = JSON.parse(localStorage.getItem(k));
    const e = s.episodes['goryeo-khitan'];
    e.clues = ['claimLand', 'claimSong', 'nameGoryeo', 'seogyeong', 'jurchen', 'anyung', 'balhae'];
    e.flags = { entered_court: true, debateStage: 1 };
    localStorage.setItem(k, JSON.stringify(s));
  }, KEY);
  await page.reload();
  await page.click('[data-a="continue"]');
  await until(() => document.querySelector('.hs[data-hs="seohui"]') && !document.getElementById('fader').classList.contains('on') && !HA.main.game.busy, '조정');
  await page.click('.hs[data-hs="seohui"]');
  await until(() => document.querySelector('.db-hand .clue-card') && !document.getElementById('dialogue').classList.contains('on'), '첫째 주장');
  // 안융진 카드(-20)를 계속 내밀어 태도를 바닥내기
  let broke = false;
  for (let i = 0; i < 6 && !broke; i++) {
    await page.click('.clue-card[data-id="anyung"]');
    await page.waitForTimeout(700);
    if (await talking()) {
      const t = await page.textContent('.dlg-text');
      broke = /돌아가시오|깨질 뻔/.test(t);
      await until(() => !document.getElementById('dialogue').classList.contains('on'), '결렬 대사');
    }
  }
  if (!broke) throw new Error('결렬이 일어나지 않음');
  const stageAfter = await page.evaluate(() => document.querySelector('.db-steps .cur').textContent);
  const mood = await page.evaluate(() => parseFloat(document.querySelector('.db-meter .bar i').style.width));
  if (!/첫째 주장/.test(stageAfter) || mood !== 30) throw new Error(`결렬 후 상태 오류: ${stageAfter}, ${mood}`);
  ok('태도가 0이 되면 결렬 직전 → 같은 단계(첫째 주장), 태도 30에서 재개');

  console.log('■ 퍼즐 안 힌트는 단계적으로');
  const hints = [];
  for (let i = 0; i < 3; i++) {
    await page.click('.hud-hint');
    await until(() => document.getElementById('dialogue').classList.contains('on'), '힌트');
    await page.waitForTimeout(400);
    await page.click('#dialogue');
    hints.push(await page.textContent('.dlg-text'));
    await until(() => !document.getElementById('dialogue').classList.contains('on'), '힌트 닫기');
  }
  if (new Set(hints).size !== 3 || /추론 카드/.test(hints[0]) || !/추론 카드/.test(hints[2])) throw new Error('힌트 단계 오류: ' + hints.join(' | '));
  ok('1단계는 방향, 3단계에서야 구체적인 카드 이름');

  console.log('■ 담판 도중 나가기 → 다시 들어오면 단계 유지');
  await page.keyboard.press('Escape');
  await page.click('[data-a="exit"]');
  await until(() => document.querySelector('.eras-screen'), '시대 선택');
  await page.click('.era-card[data-era="goryeo"]');
  await page.click('[data-m="continue"]');
  await until(() => document.querySelector('.hs[data-hs="seohui"]') && !document.getElementById('fader').classList.contains('on') && !HA.main.game.busy, '재입장');
  await page.click('.hs[data-hs="seohui"]');
  await until(() => document.querySelector('.db-steps .cur') && !document.getElementById('dialogue').classList.contains('on'), '담판 재입장');
  if (!/첫째 주장/.test(await page.textContent('.db-steps .cur'))) throw new Error('단계 유지 안 됨');
  ok('메뉴로 나갔다 와도 담판 단계 유지');

  await browser.close();
  if (errors.length) throw new Error('브라우저 오류: ' + errors.join('\n'));
  console.log('\n경계 상황 테스트 통과 ✅');
})().catch((e) => {
  console.error('\n✘ 실패:', e.message);
  process.exit(1);
});
