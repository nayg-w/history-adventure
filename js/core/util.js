/* 공용 도우미 함수 — 모든 스크립트보다 먼저 불러옵니다. */
window.HA = window.HA || {};

HA.util = {
  /** HTML 문자열로 요소 하나를 만든다 */
  h(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  },
  esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  },
  sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  },
  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
  /** 원래 순서와 너무 비슷하지 않게 섞는다 (퍼즐용) */
  scramble(arr) {
    if (arr.length < 3) return arr.slice().reverse();
    let a;
    let tries = 0;
    do {
      a = HA.util.shuffle(arr);
      tries++;
    } while (tries < 30 && a.filter((x, i) => x === arr[i]).length > 1);
    return a;
  },
  /** 다각형 안에 점이 있는지 (ray casting) */
  inPoly(x, y, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i];
      const [xj, yj] = poly[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  },
  /** 화면 좌표 → 스테이지(1280x720) 좌표 */
  toStage(clientX, clientY) {
    const r = document.getElementById('stage').getBoundingClientRect();
    const s = r.width / 1280;
    return { x: (clientX - r.left) / s, y: (clientY - r.top) / s };
  },
  /** 한국어 조사 '을/를', '이/가' 선택 */
  josa(word, pair) {
    const c = word.charCodeAt(word.length - 1);
    const has = c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0;
    const [a, b] = pair.split('/');
    return word + (has ? a : b);
  },
};
