/* 효과음 — 외부 파일 없이 Web Audio로 짧은 소리를 만든다 */
HA.audio = (() => {
  let ctx = null;
  function ac() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, start, dur, type = 'sine', vol = 0.12) {
    const c = ac();
    if (!c) return;
    const t = c.currentTime + start;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
  const sounds = {
    click: () => tone(660, 0, 0.08, 'triangle', 0.06),
    page: () => tone(420, 0, 0.1, 'triangle', 0.05),
    clue: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.07, 0.25, 'triangle', 0.09)),
    item: () => [392, 587].forEach((f, i) => tone(f, i * 0.08, 0.2, 'square', 0.04)),
    good: () => [659, 880].forEach((f, i) => tone(f, i * 0.09, 0.25, 'sine', 0.12)),
    wrong: () => [262, 220].forEach((f, i) => tone(f, i * 0.12, 0.2, 'sine', 0.08)),
    win: () => [523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.35, 'triangle', 0.1)),
    water: () => {
      for (let i = 0; i < 10; i++) tone(180 + Math.random() * 200, i * 0.05, 0.3, 'sawtooth', 0.02);
    },
  };
  return {
    play(name) {
      if (!HA.store.data.settings.sound) return;
      try {
        sounds[name] && sounds[name]();
      } catch (e) {
        /* 소리는 없어도 진행에 지장 없음 */
      }
    },
  };
})();
