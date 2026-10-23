/* 전체 시대 목록 — 시대 구분과 소개 문구는 교육과정에 맞게 여기서만 고치면 된다.
   episodes 에 에피소드 id 를 넣으면 시대 선택 화면에서 플레이할 수 있게 된다. */
HA.eras = [
  { id: 'prehistory', no: 1, name: '선사 시대와 고조선', period: '아주 먼 옛날 ~ 기원전 108년', color: '#8a6a4a', icon: '🪨', episodes: [] },
  { id: 'three-kingdoms', no: 2, name: '삼국과 가야', period: '기원전 1세기 무렵 ~ 7세기', color: '#6a7a3a', icon: '⚔️', episodes: [] },
  { id: 'unified-silla', no: 3, name: '통일 신라와 발해', period: '7세기 후반 ~ 10세기 초', color: '#3a6a7a', icon: '🔔', episodes: [] },
  { id: 'goryeo', no: 4, name: '고려', period: '918년 ~ 1392년', color: '#8e2a22', icon: '🏺', episodes: ['goryeo-khitan'] },
  { id: 'joseon-early', no: 5, name: '조선 전기', period: '1392년 ~ 16세기', color: '#2f5d8a', icon: '📖', episodes: [] },
  { id: 'joseon-late', no: 6, name: '조선 후기', period: '17세기 ~ 19세기', color: '#5a3a7a', icon: '🖌️', episodes: [] },
  { id: 'modern', no: 7, name: '개항과 근대', period: '19세기 후반 ~ 1910년', color: '#7a5a2a', icon: '🚂', episodes: [] },
  { id: 'contemporary', no: 8, name: '일제강점기와 현대', period: '1910년 ~ 오늘날', color: '#2f7d6d', icon: '🕊️', episodes: [] },
];
HA.episodes = HA.episodes || {};
