/* 진행 상황 저장 — 브라우저 localStorage만 사용하며 개인정보는 저장하지 않습니다. */
HA.store = (() => {
  const KEY = 'history-adventure-save-v1';
  let data = null;

  function blank() {
    return { version: 1, episodes: {}, settings: { sound: true } };
  }

  function newEpisode(prev) {
    return {
      status: 'new', // new | playing | done
      scene: null,
      clues: [],
      items: [],
      flags: {},
      seen: [],
      met: [],
      newClues: 0,
      // 한 번 복원한 기록은 다시 플레이해도 연대표에 남는다
      restored: prev ? !!prev.restored : false,
      completions: prev ? prev.completions || 0 : 0,
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      data = parsed && parsed.version === 1 && parsed.episodes ? parsed : blank();
    } catch (e) {
      data = blank();
    }
    data.settings = Object.assign({ sound: true }, data.settings);
    return data;
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      /* 저장소를 쓸 수 없는 환경(사생활 보호 모드 등)에서도 게임은 계속된다 */
    }
  }

  return {
    load,
    save,
    get data() {
      return data || load();
    },
    ep(id) {
      const d = this.data;
      if (!d.episodes[id]) d.episodes[id] = newEpisode();
      return d.episodes[id];
    },
    resetEpisode(id) {
      const d = this.data;
      d.episodes[id] = newEpisode(d.episodes[id]);
      save();
      return d.episodes[id];
    },
    resetAll() {
      data = blank();
      save();
    },
  };
})();
