/* 공용 그림 도구 — 모든 그림은 SVG 문자열로 만들어 외부 이미지 파일 없이 동작한다. */
HA.art = HA.art || {};

/**
 * 인물 그리기 (귀여운 2등신 스타일)
 * o.robe 옷 색, o.dark 그림자 색, o.trim 깃 색, o.belt 띠 색,
 * o.hat: bokdu(복두) | helmet(투구) | fur(털모자) | topknot(상투) | cap(병사 모자)
 * o.beard: none | black | white, o.expr: smile | serious | worried, o.armor: true/false
 */
HA.art.figure = function (o = {}, opt = {}) {
  const robe = o.robe || '#3d6b8f';
  const dark = o.dark || '#2c4f6b';
  const trim = o.trim || '#efe3c2';
  const skin = o.skin || '#f6d5b5';
  const vb = opt.portrait ? '8 6 144 144' : '0 0 160 260';
  const ink = '#2b1d14';

  const hats = {
    bokdu: `<path d="M47 60 Q47 26 80 26 Q113 26 113 60 Z" fill="#1d1a22"/>
      <rect x="43" y="54" width="74" height="11" rx="4" fill="#26222c"/>
      <rect x="6" y="51" width="40" height="6" rx="3" fill="#1d1a22"/>
      <rect x="114" y="51" width="40" height="6" rx="3" fill="#1d1a22"/>`,
    helmet: `<path d="M43 66 Q43 24 80 22 Q117 24 117 66 Z" fill="#8d949c"/>
      <path d="M43 66 Q43 24 80 22 L80 66 Z" fill="#a7aeb6"/>
      <rect x="39" y="58" width="82" height="10" rx="5" fill="#6d737b"/>
      <path d="M80 22 L80 6" stroke="#6d737b" stroke-width="4"/>
      <path d="M80 8 Q70 18 74 30 M80 8 Q90 18 86 30" stroke="#c0392b" stroke-width="5" fill="none" stroke-linecap="round"/>
      <circle cx="80" cy="7" r="5" fill="#d4a63c"/>`,
    fur: `<path d="M44 64 Q46 22 80 22 Q114 22 116 64 Z" fill="#6b3f22"/>
      <path d="M58 30 Q80 18 102 30" stroke="#8a5530" stroke-width="5" fill="none"/>
      <rect x="37" y="55" width="86" height="17" rx="8.5" fill="#dcc7a1"/>
      <path d="M40 60 q4 -6 8 0 q4 -6 8 0 q4 -6 8 0 q4 -6 8 0 q4 -6 8 0 q4 -6 8 0 q4 -6 8 0 q4 -6 8 0 q4 -6 8 0 q4 -6 8 0" stroke="#c6ad84" stroke-width="2" fill="none"/>
      <path d="M118 62 Q136 80 128 110" stroke="#dcc7a1" stroke-width="9" fill="none" stroke-linecap="round"/>`,
    topknot: `<path d="M45 66 Q44 34 80 32 Q116 34 115 66 Q100 50 80 50 Q60 50 45 66Z" fill="#231c1c"/>
      <ellipse cx="80" cy="30" rx="10" ry="12" fill="#231c1c"/>
      <rect x="45" y="54" width="70" height="7" rx="3" fill="#3a3030"/>`,
    cap: `<path d="M42 64 L80 20 L118 64 Z" fill="#5b4636"/>
      <path d="M42 64 L80 20 L80 64 Z" fill="#6c5543"/>
      <rect x="36" y="58" width="88" height="9" rx="4" fill="#3f3026"/>
      <circle cx="80" cy="20" r="5" fill="#b8352a"/>`,
  };

  const eyes = {
    smile: `<path d="M62 80 Q67 74 72 80" stroke="${ink}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      <path d="M88 80 Q93 74 98 80" stroke="${ink}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`,
    serious: `<ellipse cx="67" cy="80" rx="4" ry="5" fill="${ink}"/><ellipse cx="93" cy="80" rx="4" ry="5" fill="${ink}"/>
      <circle cx="68.5" cy="78" r="1.4" fill="#fff"/><circle cx="94.5" cy="78" r="1.4" fill="#fff"/>
      <path d="M59 69 L74 72 M101 69 L86 72" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`,
    worried: `<ellipse cx="67" cy="81" rx="4" ry="5" fill="${ink}"/><ellipse cx="93" cy="81" rx="4" ry="5" fill="${ink}"/>
      <circle cx="68.5" cy="79" r="1.4" fill="#fff"/><circle cx="94.5" cy="79" r="1.4" fill="#fff"/>
      <path d="M60 71 L73 68 M100 71 L87 68" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`,
    proud: `<ellipse cx="67" cy="80" rx="4" ry="4" fill="${ink}"/><ellipse cx="93" cy="80" rx="4" ry="4" fill="${ink}"/>
      <path d="M59 72 L74 70 M101 72 L86 70" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`,
  };
  const mouths = {
    smile: `<path d="M72 97 Q80 105 88 97" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    serious: `<path d="M73 99 L87 99" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`,
    worried: `<path d="M72 101 Q80 95 88 101" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    proud: `<path d="M72 98 Q80 102 88 96" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  };
  const expr = o.expr || 'smile';
  const beard =
    o.beard === 'white'
      ? `<path d="M58 94 Q62 132 80 146 Q98 132 102 94 Q92 106 80 106 Q68 106 58 94Z" fill="#f1f0ea"/>
         <path d="M66 98 Q80 92 94 98" stroke="#f1f0ea" stroke-width="6" fill="none" stroke-linecap="round"/>
         <path d="M72 101 L88 101" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"/>`
      : o.beard === 'black'
      ? `<path d="M70 106 Q80 128 90 106 Q80 110 70 106Z" fill="#231c1c"/>
         <path d="M68 96 Q80 90 92 96" stroke="#231c1c" stroke-width="4" fill="none" stroke-linecap="round"/>`
      : '';
  const armor = o.armor
    ? `<path d="M52 124 Q80 114 108 124 L112 172 L48 172 Z" fill="#8d949c"/>
       <g stroke="#6d737b" stroke-width="2" fill="none">
         <path d="M54 134 H106 M52 146 H108 M51 158 H109"/>
         <path d="M62 124 V172 M74 120 V172 M86 120 V172 M98 124 V172" stroke-dasharray="4 8"/>
       </g>
       <ellipse cx="52" cy="128" rx="14" ry="9" fill="#a7aeb6"/><ellipse cx="108" cy="128" rx="14" ry="9" fill="#a7aeb6"/>`
    : '';

  return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${opt.portrait ? '' : '<ellipse cx="80" cy="252" rx="50" ry="8" fill="rgba(0,0,0,.2)"/>'}
    <ellipse cx="63" cy="246" rx="13" ry="6" fill="#2a1d14"/><ellipse cx="97" cy="246" rx="13" ry="6" fill="#2a1d14"/>
    <path d="M36 248 Q40 172 54 122 Q80 108 106 122 Q120 172 124 248 Z" fill="${robe}"/>
    <path d="M80 122 V248" stroke="${dark}" stroke-width="3" opacity=".55"/>
    <path d="M40 236 Q80 246 120 236" stroke="${dark}" stroke-width="5" fill="none" opacity=".5"/>
    <path d="M62 118 L80 150 L98 118" fill="none" stroke="${trim}" stroke-width="7" stroke-linejoin="round"/>
    ${armor}
    <rect x="48" y="170" width="64" height="10" rx="5" fill="${o.belt || '#c9a14a'}"/>
    <path d="M56 126 Q28 160 38 198 L58 198 Q56 166 68 140 Z" fill="${dark}"/>
    <path d="M104 126 Q132 160 122 198 L102 198 Q104 166 92 140 Z" fill="${dark}"/>
    <circle cx="48" cy="202" r="8.5" fill="${skin}"/><circle cx="112" cy="202" r="8.5" fill="${skin}"/>
    ${o.hold === 'scroll' ? '<rect x="98" y="178" width="12" height="40" rx="4" fill="#efe3c2" stroke="#8a6a3a" stroke-width="2" transform="rotate(-20 104 198)"/>' : ''}
    ${o.hold === 'fan' ? '<path d="M112 200 L92 170 Q104 160 122 166 Z" fill="#efe3c2" stroke="#8a6a3a" stroke-width="2"/>' : ''}
    ${o.hold === 'spear' ? '<path d="M118 240 L118 70" stroke="#6b4a2a" stroke-width="5"/><path d="M118 52 L111 74 L125 74 Z" fill="#a7aeb6"/><path d="M114 76 Q118 90 122 76" fill="#c0392b"/>' : ''}
    <rect x="72" y="104" width="16" height="12" fill="${skin}"/>
    <circle cx="44" cy="82" r="7" fill="${skin}"/><circle cx="116" cy="82" r="7" fill="${skin}"/>
    <circle cx="80" cy="78" r="37" fill="${skin}"/>
    ${o.hat === 'topknot' || o.hat === 'cap' || o.hat === 'helmet' ? '' : '<path d="M45 70 Q46 46 80 44 Q114 46 115 70 Q100 58 80 58 Q60 58 45 70Z" fill="#231c1c"/>'}
    <circle cx="60" cy="92" r="6.5" fill="#f19a8a" opacity=".35"/><circle cx="100" cy="92" r="6.5" fill="#f19a8a" opacity=".35"/>
    ${eyes[expr]}
    ${o.beard === 'white' ? '' : mouths[expr]}
    ${beard}
    ${hats[o.hat] || ''}
  </svg>`;
};

/** 길잡이 '필이' — 시간의 붓 (게임 속 가상 캐릭터) */
HA.art.pili = function (opt = {}) {
  return `<svg viewBox="${opt.portrait ? '14 4 92 92' : '0 0 120 170'}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><radialGradient id="pg${opt.portrait ? 'p' : ''}" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#fff6c8" stop-opacity=".9"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></radialGradient></defs>
    <circle cx="60" cy="70" r="58" fill="url(#pg${opt.portrait ? 'p' : ''})"/>
    <rect x="38" y="12" width="44" height="92" rx="20" fill="#dcb46e"/>
    <rect x="38" y="12" width="16" height="92" rx="8" fill="#e9c98c"/>
    <path d="M40 40 H80 M40 84 H80" stroke="#b58a46" stroke-width="3"/>
    <rect x="36" y="96" width="48" height="13" rx="5" fill="#8a5a2b"/>
    <path d="M38 108 Q34 136 60 162 Q86 136 82 108 Z" fill="#1f1b2e"/>
    <path d="M48 112 Q46 132 58 150" stroke="#4a4466" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="50" cy="58" r="7.5" fill="#fff"/><circle cx="70" cy="58" r="7.5" fill="#fff"/>
    <circle cx="51" cy="59" r="4" fill="#2b1d14"/><circle cx="71" cy="59" r="4" fill="#2b1d14"/>
    <circle cx="52.5" cy="57" r="1.5" fill="#fff"/><circle cx="72.5" cy="57" r="1.5" fill="#fff"/>
    <circle cx="44" cy="70" r="4.5" fill="#f19a8a" opacity=".55"/><circle cx="76" cy="70" r="4.5" fill="#f19a8a" opacity=".55"/>
    <path d="M54 70 Q60 76 66 70" stroke="#2b1d14" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    ${opt.portrait ? '' : '<path d="M14 30 l4 8 l8 4 l-8 4 l-4 8 l-4 -8 l-8 -4 l8 -4z M104 96 l3 6 l6 3 l-6 3 l-3 6 l-3 -6 l-6 -3 l6 -3z" fill="#ffd866"/>'}
  </svg>`;
};

/** 잠자는 고양이 (장면 속 작은 재미 요소) */
HA.art.cat = function (awake) {
  return `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="60" cy="72" rx="48" ry="6" fill="rgba(0,0,0,.18)"/>
    <ellipse cx="62" cy="52" rx="42" ry="22" fill="#e39a4c"/>
    <path d="M30 50 Q40 34 62 34" stroke="#c97b32" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M100 58 Q118 52 108 36" stroke="#e39a4c" stroke-width="9" fill="none" stroke-linecap="round"/>
    <circle cx="30" cy="48" r="20" fill="#e39a4c"/>
    <path d="M14 36 L16 18 L28 30 Z M34 28 L46 18 L46 36 Z" fill="#e39a4c"/>
    <path d="M18 32 L19 23 L25 29 Z M38 28 L44 23 L44 32 Z" fill="#f4c3a0"/>
    ${awake
      ? '<circle cx="23" cy="48" r="3.4" fill="#2b1d14"/><circle cx="37" cy="48" r="3.4" fill="#2b1d14"/>'
      : '<path d="M19 48 Q23 52 27 48 M33 48 Q37 52 41 48" stroke="#2b1d14" stroke-width="2.4" fill="none" stroke-linecap="round"/>'}
    <path d="M28 55 Q30 57 32 55" stroke="#2b1d14" stroke-width="2" fill="none"/>
    ${awake ? '' : '<text x="52" y="22" font-size="16" font-weight="700" fill="#7a5a3a">z</text><text x="64" y="12" font-size="12" font-weight="700" fill="#7a5a3a">z</text>'}
  </svg>`;
};

/** 기마병 아이콘 (작은 크기, 색으로 편 구분) */
HA.art.rider = function (color = '#6b3f22', flag = '#d9c3a0', facing = 1) {
  return `<g transform="scale(${facing} 1)">
    <ellipse cx="0" cy="22" rx="20" ry="4" fill="rgba(0,0,0,.18)"/>
    <path d="M-16 6 Q-14 -6 4 -6 Q14 -8 18 -16 L22 -12 Q20 -2 14 2 L14 18 L10 18 L9 6 L-8 6 L-10 18 L-14 18 Z" fill="#6e5038"/>
    <rect x="-6" y="-22" width="10" height="16" rx="4" fill="${color}"/>
    <circle cx="-1" cy="-27" r="6" fill="#f6d5b5"/>
    <path d="M-7 -29 Q-1 -38 5 -29 Z" fill="${color}"/>
    <path d="M-6 -20 L-6 -46" stroke="#4a3a2a" stroke-width="2"/>
    <path d="M-6 -46 L8 -42 L-6 -37 Z" fill="${flag}"/>
  </g>`;
};
