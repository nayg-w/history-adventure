/* 고려 에피소드 그림 (배경·사물). 모두 SVG 문자열. */
HA.art.goryeo = (() => {
  const A = {};
  const svg = (vb, body, extra = '') =>
    `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true" ${extra}>${body}</svg>`;

  const pine = (x, y, s = 1, snow = true) => `<g transform="translate(${x} ${y}) scale(${s})">
      <rect x="-5" y="0" width="10" height="22" fill="#5a4030"/>
      <path d="M0 -70 L30 -18 L-30 -18 Z M0 -50 L36 6 L-36 6 Z" fill="#2f5a4a"/>
      ${snow ? '<path d="M0 -70 L12 -49 Q0 -44 -12 -49 Z M-20 -12 Q0 -20 22 -10 L36 6 Q0 -6 -36 6 Z" fill="#f4f7f9"/>' : ''}
    </g>`;

  /* ---------------- 고려 조정 (993) ---------------- */
  A.court = () => {
    let boards = '';
    for (let xb = -480; xb <= 1760; xb += 130) {
      const xt = 640 + (xb - 640) * 0.38;
      boards += `<path d="M${xt} 480 L${xb} 720" stroke="#4b2e19" stroke-width="2" opacity=".5"/>`;
    }
    const lantern = (x) => `<g transform="translate(${x} 114)">
      <path d="M0 0 V40" stroke="#3b2a1a" stroke-width="3"/>
      <rect x="-24" y="40" width="48" height="8" rx="3" fill="#3b2a1a"/>
      <path d="M-22 48 Q-30 80 -18 108 H18 Q30 80 22 48 Z" fill="#c8402f"/>
      <path d="M-8 48 Q-12 80 -6 108 M8 48 Q12 80 6 108" stroke="#e58a5a" stroke-width="3" fill="none"/>
      <rect x="-20" y="106" width="40" height="8" rx="3" fill="#3b2a1a"/>
      <path d="M0 114 V140" stroke="#d4a63c" stroke-width="4"/>
      <circle cx="0" cy="80" r="40" fill="#ffd27a" opacity=".18"/>
    </g>`;
    return svg(
      '0 0 1280 720',
      `<defs>
        <linearGradient id="cw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3dfb7"/><stop offset="1" stop-color="#d9b580"/></linearGradient>
        <linearGradient id="cf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a06e44"/><stop offset="1" stop-color="#5a371f"/></linearGradient>
        <pattern id="lat" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="#f8eed6"/><path d="M0 0H22M0 11H22M0 0V22M11 0V22" stroke="#8a4a2a" stroke-width="2.2"/></pattern>
        <pattern id="dan" width="80" height="30" patternUnits="userSpaceOnUse"><rect width="80" height="30" fill="#2f7d6d"/>
          <circle cx="20" cy="15" r="9" fill="#e8d27a"/><circle cx="20" cy="15" r="4.5" fill="#b8352a"/>
          <circle cx="60" cy="15" r="9" fill="#3d6b8f"/><circle cx="60" cy="15" r="4" fill="#f4f0e0"/>
          <path d="M0 2H80M0 28H80" stroke="#f4f0e0" stroke-width="2"/></pattern>
        <radialGradient id="cg" cx=".5" cy=".35" r=".65"><stop offset="0" stop-color="#fff3cf" stop-opacity=".5"/><stop offset="1" stop-color="#fff3cf" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="1280" height="480" fill="url(#cw)"/>
      <rect y="392" width="1280" height="88" fill="#b98a55"/>
      <path d="M0 392 H1280" stroke="#8a5a2b" stroke-width="4"/>
      <rect x="400" y="138" width="480" height="324" fill="#6b2a1c" rx="4"/>
      <rect x="414" y="152" width="144" height="230" fill="url(#lat)"/>
      <rect x="568" y="152" width="144" height="230" fill="url(#lat)"/>
      <rect x="722" y="152" width="144" height="230" fill="url(#lat)"/>
      <rect x="414" y="390" width="144" height="60" fill="#a8743f"/><rect x="568" y="390" width="144" height="60" fill="#a8743f"/><rect x="722" y="390" width="144" height="60" fill="#a8743f"/>
      <rect x="0" y="0" width="1280" height="72" fill="#5c2418"/>
      <path d="M0 18 H1280 M0 46 H1280" stroke="#4a1c12" stroke-width="3"/>
      <rect y="72" width="1280" height="30" fill="url(#dan)"/>
      <rect y="102" width="1280" height="14" fill="#7a3022"/>
      ${lantern(310)}${lantern(970)}
      <g><rect x="78" y="102" width="66" height="420" fill="#9e2f23"/><rect x="88" y="102" width="12" height="420" fill="#c4493a"/>
         <rect x="66" y="500" width="90" height="34" rx="6" fill="#8d8a80"/></g>
      <g><rect x="1136" y="102" width="66" height="420" fill="#9e2f23"/><rect x="1146" y="102" width="12" height="420" fill="#c4493a"/>
         <rect x="1124" y="500" width="90" height="34" rx="6" fill="#8d8a80"/></g>
      <polygon points="0,480 1280,480 1280,720 0,720" fill="url(#cf)"/>
      ${boards}
      <path d="M0 540 H1280 M0 616 H1280" stroke="#4b2e19" stroke-width="2" opacity=".35"/>
      <polygon points="520,480 760,480 880,720 400,720" fill="#8e2a22"/>
      <polygon points="532,486 748,486 860,720 420,720" fill="none" stroke="#d4a63c" stroke-width="4"/>
      <rect width="1280" height="720" fill="url(#cg)"/>`
    );
  };

  A.reportTable = () =>
    svg(
      '0 0 180 130',
      `<ellipse cx="90" cy="122" rx="80" ry="7" fill="rgba(0,0,0,.25)"/>
      <rect x="14" y="66" width="152" height="14" rx="4" fill="#7a4a26"/>
      <rect x="24" y="80" width="12" height="40" fill="#5e3a1e"/><rect x="144" y="80" width="12" height="40" fill="#5e3a1e"/>
      <g transform="rotate(-8 90 50)">
        <rect x="40" y="36" width="100" height="30" rx="4" fill="#f4e9cf" stroke="#9a7b4a" stroke-width="2"/>
        <rect x="32" y="32" width="12" height="38" rx="5" fill="#8a5a2b"/><rect x="136" y="32" width="12" height="38" rx="5" fill="#8a5a2b"/>
        <path d="M56 46 H120 M56 56 H110" stroke="#5a4a3a" stroke-width="3" stroke-linecap="round"/>
      </g>
      <circle cx="132" cy="30" r="9" fill="#b8352a"/>`,
      'preserveAspectRatio="xMidYMid meet"'
    );

  A.mapTable = () =>
    svg(
      '0 0 280 140',
      `<ellipse cx="140" cy="132" rx="130" ry="8" fill="rgba(0,0,0,.25)"/>
      <polygon points="20,60 260,60 276,84 4,84" fill="#7a4a26"/>
      <rect x="4" y="84" width="272" height="12" fill="#5e3a1e"/>
      <rect x="20" y="96" width="14" height="34" fill="#5e3a1e"/><rect x="246" y="96" width="14" height="34" fill="#5e3a1e"/>
      <polygon points="50,24 230,18 250,70 30,76" fill="#efe0b8" stroke="#9a7b4a" stroke-width="2"/>
      <path d="M60 40 Q100 30 140 36 T226 28" stroke="#4f8db3" stroke-width="4" fill="none"/>
      <path d="M50 60 Q110 50 160 54 T240 50" stroke="#4f8db3" stroke-width="3" fill="none"/>
      <path d="M44 72 Q40 50 62 26" stroke="#7aa9c4" stroke-width="10" fill="none" opacity=".5"/>
      <circle cx="120" cy="46" r="4" fill="#b8352a"/><circle cx="170" cy="42" r="4" fill="#b8352a"/>
      <path d="M190 34 l6 6 m0 -6 l-6 6" stroke="#2b1d14" stroke-width="2"/>`,
      'preserveAspectRatio="xMidYMid meet"'
    );

  A.banner = () =>
    svg(
      '0 0 100 260',
      `<rect x="6" y="4" width="88" height="10" rx="5" fill="#5e3a1e"/>
      <path d="M12 14 H88 V226 L50 252 L12 226 Z" fill="#b8352a"/>
      <path d="M18 20 H82 V222 L50 244 L18 222 Z" fill="none" stroke="#e8c55a" stroke-width="3"/>
      <text x="50" y="104" text-anchor="middle" font-size="52" font-family="serif" font-weight="700" fill="#fbf2d8">高</text>
      <text x="50" y="176" text-anchor="middle" font-size="52" font-family="serif" font-weight="700" fill="#fbf2d8">麗</text>`,
      'preserveAspectRatio="xMidYMid meet"'
    );

  A.books = () =>
    svg(
      '0 0 180 140',
      `<ellipse cx="90" cy="132" rx="84" ry="7" fill="rgba(0,0,0,.25)"/>
      <rect x="20" y="70" width="140" height="60" rx="5" fill="#6e3b22"/>
      <rect x="20" y="70" width="140" height="12" fill="#8a4e2c"/>
      <rect x="78" y="92" width="24" height="16" rx="3" fill="#d4a63c"/>
      <g transform="rotate(-4 90 50)">
        <rect x="34" y="44" width="110" height="18" rx="3" fill="#2f5d8a"/><rect x="34" y="44" width="10" height="18" fill="#efe3c2"/>
        <rect x="40" y="26" width="104" height="18" rx="3" fill="#8e2a22"/><rect x="40" y="26" width="10" height="18" fill="#efe3c2"/>
        <rect x="30" y="8" width="106" height="18" rx="3" fill="#2f7d6d"/><rect x="30" y="8" width="10" height="18" fill="#efe3c2"/>
      </g>`,
      'preserveAspectRatio="xMidYMid meet"'
    );

  /* ---------------- 흥화진 근처 고려군 진영 (1018) ---------------- */
  A.camp = () =>
    svg(
      '0 0 1280 720',
      `<defs>
        <linearGradient id="ks" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9c3dc"/><stop offset="1" stop-color="#eef3f7"/></linearGradient>
        <linearGradient id="kg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2f6f8"/><stop offset="1" stop-color="#d6e1e8"/></linearGradient>
        <linearGradient id="kw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5e9cc2"/><stop offset="1" stop-color="#3f7fa8"/></linearGradient>
      </defs>
      <rect width="1280" height="440" fill="url(#ks)"/>
      <path d="M0 300 L120 200 L220 260 L360 150 L480 250 L600 180 L760 270 L900 160 L1040 240 L1160 170 L1280 230 V420 H0 Z" fill="#9fb3c8"/>
      <path d="M360 150 L392 176 L370 172 L350 184 L330 174 Z M900 160 L934 188 L910 182 L890 194 L870 184 Z M1160 170 L1188 192 L1164 188 L1146 196 Z M600 180 L628 202 L606 198 L586 206 Z" fill="#f4f7f9"/>
      <path d="M0 360 Q200 300 420 340 T820 320 Q900 300 1000 290 L1280 270 V460 H0 Z" fill="#c4d3dd"/>
      <path d="M840 340 Q980 250 1280 236 V420 H840 Z" fill="#b3c4d0"/>
      <g fill="#8d8478">
        <rect x="900" y="236" width="380" height="40"/>
        ${Array.from({ length: 19 }, (_, i) => `<rect x="${900 + i * 20}" y="226" width="12" height="12"/>`).join('')}
      </g>
      <rect x="900" y="250" width="380" height="4" fill="#6f675d"/>
      <rect x="1040" y="200" width="90" height="44" fill="#9b6b40"/>
      <path d="M1020 204 Q1085 176 1150 204 L1140 210 Q1085 188 1030 210 Z" fill="#3c3a40"/>
      <rect x="1068" y="236" width="34" height="40" rx="14" fill="#3a2a1e"/>
      <text x="1085" y="226" text-anchor="middle" font-size="16" fill="#fbf2d8" font-weight="700">흥화진</text>
      <rect y="400" width="1280" height="320" fill="url(#kg)"/>
      <path d="M0 410 Q300 390 640 412 T1280 404" stroke="#ffffff" stroke-width="8" fill="none" opacity=".7"/>
      <path d="M690 400 Q770 430 770 490 Q770 560 850 620 Q910 670 905 720 L1065 720 Q1050 650 990 600 Q910 540 910 476 Q905 420 780 398 Z" fill="url(#kw)"/>
      <path d="M760 430 Q800 450 800 490 M840 560 Q870 590 900 610 M930 640 Q960 670 970 700" stroke="#cfe6f3" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>
      <g fill="#e9eef1" stroke="#b8c6cf" stroke-width="2">
        <ellipse cx="770" cy="470" rx="16" ry="8"/><ellipse cx="900" cy="470" rx="14" ry="7"/><ellipse cx="840" cy="610" rx="14" ry="7"/><ellipse cx="1010" cy="640" rx="18" ry="8"/>
      </g>
      <g>
        <path d="M60 420 L160 280 L260 420 Z" fill="#efe6d2"/><path d="M160 280 L260 420 L200 420 Z" fill="#d7ccb4"/><path d="M140 420 L160 360 L180 420 Z" fill="#6a5a46"/>
        <path d="M230 425 L320 310 L410 425 Z" fill="#e8dcc2"/><path d="M320 310 L410 425 L360 425 Z" fill="#cfc1a4"/><path d="M302 425 L320 375 L338 425 Z" fill="#6a5a46"/>
        <path d="M160 280 V250" stroke="#5a4030" stroke-width="4"/><path d="M160 250 L196 260 L160 270 Z" fill="#b8352a"/>
        <path d="M320 310 V276" stroke="#5a4030" stroke-width="4"/><path d="M320 276 L356 286 L320 296 Z" fill="#2f5d8a"/>
      </g>
      <g><path d="M560 520 V180" stroke="#5a4030" stroke-width="7"/>
        <path d="M564 186 Q620 196 650 186 Q640 240 656 290 Q616 300 564 290 Z" fill="#b8352a"/>
        <circle cx="606" cy="238" r="22" fill="none" stroke="#fbf2d8" stroke-width="5"/><circle cx="606" cy="238" r="7" fill="#fbf2d8"/></g>
      ${pine(1230, 470, 1.1)}${pine(660, 640, 0.9)}${pine(30, 640, 1)}${pine(1200, 690, 1.2)}
      <g fill="#fff" opacity=".85">${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 137) % 1280}" cy="${(i * 89) % 420}" r="${1.5 + (i % 3)}"/>`).join('')}</g>`
    );

  A.cowhides = () =>
    svg(
      '0 0 170 140',
      `<ellipse cx="85" cy="130" rx="78" ry="7" fill="rgba(0,0,0,.2)"/>
      <path d="M14 116 Q20 92 50 94 Q70 84 100 92 Q140 86 156 110 Q150 126 120 124 Q80 132 40 126 Q18 126 14 116Z" fill="#7b4a2b"/>
      <path d="M22 94 Q30 70 60 74 Q84 62 112 72 Q146 70 150 94 Q136 106 104 102 Q70 110 42 104 Q24 104 22 94Z" fill="#9a5f36"/>
      <path d="M30 70 Q40 48 70 52 Q96 42 120 52 Q142 54 140 74 Q120 84 94 80 Q64 88 44 82 Q30 80 30 70Z" fill="#b8784a"/>
      <path d="M60 60 q8 -6 16 0 M96 58 q10 -4 16 4" stroke="#7b4a2b" stroke-width="3" fill="none"/>
      <circle cx="84" cy="66" r="5" fill="#f2e2c8"/><circle cx="110" cy="64" r="4" fill="#f2e2c8"/>`,
      'preserveAspectRatio="xMidYMid meet"'
    );

  A.rope = () =>
    svg(
      '0 0 120 120',
      `<ellipse cx="60" cy="108" rx="52" ry="8" fill="rgba(0,0,0,.2)"/>
      <ellipse cx="60" cy="86" rx="48" ry="20" fill="none" stroke="#c9a46a" stroke-width="12"/>
      <ellipse cx="60" cy="72" rx="42" ry="17" fill="none" stroke="#d8b67c" stroke-width="12"/>
      <ellipse cx="60" cy="58" rx="34" ry="14" fill="none" stroke="#c9a46a" stroke-width="12"/>
      <path d="M90 60 Q108 40 100 22" stroke="#d8b67c" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M30 86 l6 -6 M48 92 l6 -6 M70 92 l6 -6 M88 88 l6 -6" stroke="#a7834c" stroke-width="2"/>`,
      'preserveAspectRatio="xMidYMid meet"'
    );

  A.letterStand = () =>
    svg(
      '0 0 120 130',
      `<ellipse cx="60" cy="124" rx="50" ry="6" fill="rgba(0,0,0,.2)"/>
      <path d="M30 124 L46 60 M90 124 L74 60" stroke="#6b4a2a" stroke-width="7"/>
      <rect x="22" y="40" width="76" height="40" rx="4" fill="#f4e9cf" stroke="#9a7b4a" stroke-width="2"/>
      <rect x="16" y="36" width="10" height="48" rx="4" fill="#8a5a2b"/><rect x="94" y="36" width="10" height="48" rx="4" fill="#8a5a2b"/>
      <path d="M34 52 H86 M34 62 H80 M34 72 H70" stroke="#5a4a3a" stroke-width="3" stroke-linecap="round"/>
      <circle cx="84" cy="34" r="8" fill="#5a3a8a"/>`,
      'preserveAspectRatio="xMidYMid meet"'
    );

  /* ---------------- 시간의 서고 ---------------- */
  A.archive = () => {
    let shelves = '';
    [40, 1040].forEach((x0) => {
      for (let r = 0; r < 4; r++) {
        const y = 130 + r * 130;
        shelves += `<rect x="${x0}" y="${y + 92}" width="200" height="12" fill="#5b3a26"/>`;
        for (let k = 0; k < 7; k++) {
          const cx = x0 + 22 + k * 26;
          shelves += `<circle cx="${cx}" cy="${y + 78}" r="12" fill="${['#efe3c2', '#e4cf9e', '#f3e9d2'][(k + r) % 3]}" stroke="#8a6a3a" stroke-width="2"/><circle cx="${cx}" cy="${y + 78}" r="4" fill="#8a5a2b"/>`;
          if ((k + r) % 3 === 0) shelves += `<path d="M${cx - 6} ${y + 58} L${cx + 6} ${y + 58}" stroke="#b8352a" stroke-width="4"/>`;
        }
      }
    });
    return svg(
      '0 0 1280 720',
      `<defs>
        <radialGradient id="ab" cx=".5" cy=".45" r=".75"><stop offset="0" stop-color="#3c3a6e"/><stop offset="1" stop-color="#14132a"/></radialGradient>
        <radialGradient id="ag" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe7a0" stop-opacity=".7"/><stop offset="1" stop-color="#ffe7a0" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#ab)"/>
      <rect x="30" y="100" width="220" height="560" fill="#2a2140"/><rect x="1030" y="100" width="220" height="560" fill="#2a2140"/>
      ${shelves}
      <circle cx="640" cy="300" r="250" fill="url(#ag)"/>
      <g fill="none" stroke="#ffd98a" stroke-width="3" opacity=".75">
        <circle cx="640" cy="300" r="170" stroke-dasharray="8 14"/>
        <circle cx="640" cy="300" r="128"/>
        <path d="M640 172 V200 M640 400 V428 M512 300 H540 M740 300 H768"/>
        <path d="M640 300 L640 220 M640 300 L700 330" stroke-width="6" stroke-linecap="round"/>
      </g>
      <circle cx="640" cy="300" r="10" fill="#ffd98a"/>
      <g fill="#f3e9d2" opacity=".85">
        <rect x="420" y="140" width="40" height="26" rx="3" transform="rotate(-18 440 153)"/>
        <rect x="830" y="170" width="44" height="28" rx="3" transform="rotate(14 852 184)"/>
        <rect x="470" y="450" width="36" height="24" rx="3" transform="rotate(24 488 462)"/>
        <rect x="790" y="460" width="42" height="26" rx="3" transform="rotate(-10 811 473)"/>
      </g>
      <ellipse cx="640" cy="680" rx="520" ry="50" fill="#2b2650"/>
      <g fill="#fff" opacity=".7">${Array.from({ length: 30 }, (_, i) => `<circle cx="${(i * 211) % 1280}" cy="${(i * 97) % 300 + 20}" r="${1 + (i % 2)}"/>`).join('')}</g>`
    );
  };

  /* ---------------- 담판 장소 (거란 진영의 천막) ---------------- */
  A.tent = () => {
    let folds = '';
    for (let x = 0; x <= 1280; x += 80) folds += `<path d="M${x} 60 Q${x + 40} 300 ${x} 470" stroke="#cdb48a" stroke-width="3" fill="none" opacity=".6"/>`;
    return svg(
      '0 0 1280 720',
      `<defs><linearGradient id="tf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ead8b4"/><stop offset="1" stop-color="#d7bf92"/></linearGradient>
        <radialGradient id="tl" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#fff2c9" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></radialGradient></defs>
      <rect width="1280" height="480" fill="url(#tf)"/>
      ${folds}
      <path d="M0 0 H1280 V60 ${Array.from({ length: 16 }, (_, i) => `Q${1280 - i * 80 - 40} 100 ${1280 - (i + 1) * 80} 60`).join(' ')} Z" fill="#7a3b22"/>
      <path d="M0 60 ${Array.from({ length: 16 }, (_, i) => `Q${i * 80 + 40} 100 ${(i + 1) * 80} 60`).join(' ')}" stroke="#d4a63c" stroke-width="4" fill="none"/>
      <rect y="470" width="1280" height="250" fill="#6e2a20"/>
      <rect y="470" width="1280" height="16" fill="#4e1c15"/>
      <polygon points="200,520 1080,520 1180,700 100,700" fill="#8e3a2a" stroke="#d4a63c" stroke-width="5"/>
      <polygon points="260,546 1020,546 1100,676 180,676" fill="none" stroke="#d4a63c" stroke-width="2" stroke-dasharray="10 8"/>
      <rect x="560" y="140" width="160" height="230" fill="#2f4a5e"/>
      <path d="M560 140 H720 V370 L640 400 L560 370 Z" fill="#2f4a5e"/>
      <circle cx="640" cy="250" r="44" fill="none" stroke="#d9c3a0" stroke-width="6"/>
      <path d="M640 206 V294 M596 250 H684" stroke="#d9c3a0" stroke-width="5"/>
      <rect width="1280" height="720" fill="url(#tl)"/>`
    );
  };

  /* ---------------- 흥화진 냇물 작전 (위에서 본 모습) ---------------- */
  A.damField = () =>
    svg(
      '0 0 1280 720',
      `<defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3ebf0"/><stop offset="1" stop-color="#f4f7f9"/></linearGradient></defs>
      <rect width="1280" height="720" fill="url(#dg)"/>
      <path d="M0 0 H1280 V110 Q1100 150 900 120 Q700 90 500 130 Q300 160 0 120 Z" fill="#b8c7d2"/>
      <path d="M0 0 H1280 V60 Q1000 90 800 60 Q560 30 300 70 Q140 90 0 60 Z" fill="#9fb3c8"/>
      <path d="M0 316 Q320 296 640 318 T1280 312 L1280 444 Q960 462 640 440 T0 446 Z" fill="#c9b79a"/>
      <g fill="#a99878">${Array.from({ length: 36 }, (_, i) => `<ellipse cx="${30 + i * 36}" cy="${360 + ((i * 37) % 60)}" rx="${8 + (i % 3) * 3}" ry="5"/>`).join('')}</g>
      <path d="M140 300 Q120 380 150 460 L250 460 Q270 380 250 300 Z" fill="#8a9aa6" opacity=".25"/>
      ${pine(1000, 600, 1)}${pine(1080, 640, 1.2)}${pine(1170, 590, 1)}${pine(940, 680, 1.1)}${pine(1240, 680, 1.2)}${pine(1110, 540, 0.9)}
      <path d="M880 700 Q900 520 1060 500 Q1220 490 1280 520 V720 Z" fill="#7d8f80" opacity=".18"/>
      <g transform="translate(70 560)">
        <rect x="0" y="40" width="220" height="70" fill="#8d8478"/>
        ${Array.from({ length: 11 }, (_, i) => `<rect x="${i * 20}" y="30" width="12" height="12" fill="#8d8478"/>`).join('')}
        <rect x="70" y="0" width="80" height="44" fill="#9b6b40"/><path d="M54 6 Q110 -22 166 6 L156 12 Q110 -8 64 12 Z" fill="#3c3a40"/>
        <text x="110" y="92" text-anchor="middle" font-size="20" font-weight="700" fill="#fbf2d8">흥화진</text>
      </g>
      <text x="640" y="40" text-anchor="middle" font-size="22" font-weight="700" fill="#4a5a6a">↓ 거란군이 내려오는 쪽 (북쪽)</text>`
    );

  /* ---------------- 흥화진 작전도 (위에서 본 모습, 게임용 단순화) ---------------- */
  A.river = 'M0 316 Q320 296 640 318 T1280 312 L1280 444 Q960 462 640 440 T0 446 Z';
  A.planField = () =>
    svg(
      '0 0 1280 720',
      `<defs><linearGradient id="pf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3ebf0"/><stop offset="1" stop-color="#f4f7f9"/></linearGradient></defs>
      <rect width="1280" height="720" fill="url(#pf)"/>
      <path d="M0 0 H1280 V110 Q1100 150 900 120 Q700 90 500 130 Q300 160 0 120 Z" fill="#b8c7d2"/>
      <path d="M0 0 H1280 V60 Q1000 90 800 60 Q560 30 300 70 Q140 90 0 60 Z" fill="#9fb3c8"/>
      <path d="M0 316 Q320 296 640 318 T1280 312 L1280 444 Q960 462 640 440 T0 446 Z" fill="#c9b79a"/>
      <path d="M752 96 Q770 160 780 220 Q790 280 830 326 L860 326 Q820 280 812 220 Q804 160 790 96 Z" fill="#c9b79a"/>
      <g fill="#a99878">${Array.from({ length: 9 }, (_, i) => `<ellipse cx="${540 + i * 22}" cy="${352 + ((i * 37) % 60)}" rx="9" ry="5"/>`).join('')}</g>
      <path d="M520 470 Q600 486 700 470" stroke="#8a7a5a" stroke-width="3" stroke-dasharray="6 6" fill="none"/>
      <text x="610" y="500" text-anchor="middle" font-size="18" font-weight="800" fill="#6b5a3a">여울 (얕아서 건너기 쉬운 곳)</text>
      ${pine(660, 600, 0.9)}${pine(720, 640, 1.05)}${pine(800, 590, 0.95)}${pine(860, 650, 1.1)}${pine(760, 690, 1)}${pine(900, 590, 0.85)}${pine(620, 680, 0.9)}
      <text x="780" y="520" text-anchor="middle" font-size="17" font-weight="800" fill="#2f5a4a">골짜기 숲</text>
      <text x="440" y="590" text-anchor="middle" font-size="17" font-weight="800" fill="#8a9aa6">탁 트인 눈밭</text>
      <g transform="translate(50 580)">
        <rect x="0" y="40" width="200" height="70" fill="#8d8478"/>
        ${Array.from({ length: 10 }, (_, i) => `<rect x="${i * 20}" y="30" width="12" height="12" fill="#8d8478"/>`).join('')}
        <rect x="60" y="0" width="80" height="44" fill="#9b6b40"/><path d="M44 6 Q100 -22 156 6 L146 12 Q100 -8 54 12 Z" fill="#3c3a40"/>
        <text x="100" y="92" text-anchor="middle" font-size="20" font-weight="700" fill="#fbf2d8">흥화진</text>
      </g>
      <g transform="translate(56 180)"><circle r="26" fill="#fff" stroke="#6b5a3a" stroke-width="3"/><path d="M0 -20 L7 4 L0 0 L-7 4 Z" fill="#b8352a"/><text y="-30" text-anchor="middle" font-size="16" font-weight="800" fill="#3b2a1a">북</text></g>
      <text x="740" y="40" text-anchor="middle" font-size="20" font-weight="700" fill="#4a5a6a">↓ 거란군이 내려오는 쪽 (북쪽)</text>`
    );

  /* ---------------- 귀주 결전 (위에서 본 작전도) ---------------- */
  A.guijuTop = () =>
    svg(
      '0 0 1280 720',
      `<defs><linearGradient id="gt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe6e0"/><stop offset="1" stop-color="#eef2ec"/></linearGradient></defs>
      <rect width="1280" height="720" fill="url(#gt)"/>
      <path d="M0 0 H900 V90 Q700 120 450 96 Q200 76 0 110 Z" fill="#b5c2b6"/>
      <text x="680" y="50" text-anchor="middle" font-size="20" font-weight="800" fill="#4a5a4a">↑ 압록강 · 거란으로 돌아가는 길 (북쪽)</text>
      <g transform="translate(80 640)"><rect width="180" height="50" fill="#8d8478"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${i * 20}" y="-10" width="12" height="12" fill="#8d8478"/>`).join('')}
        <text x="90" y="34" text-anchor="middle" font-size="20" font-weight="700" fill="#fbf2d8">귀주</text></g>
      <g transform="translate(56 180)"><circle r="26" fill="#fff" stroke="#6b5a3a" stroke-width="3"/><path d="M0 -20 L7 4 L0 0 L-7 4 Z" fill="#b8352a"/><text y="-30" text-anchor="middle" font-size="16" font-weight="800" fill="#3b2a1a">북</text></g>`
    );

  /* ---------------- 귀주 들판 (1019) ---------------- */
  A.guiju = () =>
    svg(
      '0 0 1280 720',
      `<defs><linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fa9c4"/><stop offset="1" stop-color="#e7ecef"/></linearGradient>
        <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6ece6"/><stop offset="1" stop-color="#c9d4c4"/></linearGradient></defs>
      <rect width="1280" height="420" fill="url(#gs)"/>
      <g fill="#fff" opacity=".8"><ellipse cx="200" cy="90" rx="110" ry="28"/><ellipse cx="280" cy="76" rx="70" ry="24"/><ellipse cx="900" cy="120" rx="140" ry="30"/><ellipse cx="1000" cy="100" rx="80" ry="26"/></g>
      <path d="M0 330 L160 250 L300 310 L460 230 L620 300 L800 220 L960 300 L1120 240 L1280 300 V420 H0 Z" fill="#a3b4c2"/>
      <rect y="380" width="1280" height="340" fill="url(#gg)"/>
      <g transform="translate(40 330)"><rect x="0" y="30" width="200" height="50" fill="#8d8478"/>
        ${Array.from({ length: 10 }, (_, i) => `<rect x="${i * 20}" y="20" width="12" height="12" fill="#8d8478"/>`).join('')}
        <text x="100" y="66" text-anchor="middle" font-size="20" font-weight="700" fill="#fbf2d8">귀주</text></g>`
    );

  /* ---------------- 지도 (단순화) ---------------- */
  // 좌표계 0~800 x 0~640. 실제 지형을 아주 단순하게 나타낸 것.
  A.map = {
    sea: [[0, 250], [120, 236], [208, 224], [226, 252], [214, 290], [250, 320], [234, 352], [270, 382], [258, 402], [284, 450], [274, 490], [306, 520], [290, 560], [330, 600], [360, 640], [0, 640]],
    rivers: {
      amnok: 'M800 52 Q700 66 640 90 Q560 118 470 136 Q380 156 300 190 Q250 210 210 224',
      cheongcheon: 'M640 248 Q560 270 500 300 Q440 328 380 350 Q320 374 262 400',
      daedong: 'M660 376 Q580 400 520 420 Q460 440 420 456 Q360 480 300 508',
    },
    zones: {
      khitan: [[0, 0], [800, 0], [800, 52], [640, 90], [470, 136], [300, 190], [208, 224], [120, 236], [0, 250]],
      gangdong: [[208, 224], [300, 190], [470, 136], [440, 325], [380, 350], [262, 400], [270, 382], [234, 352], [250, 320], [214, 290], [226, 252]],
      inland: [[470, 136], [640, 90], [800, 52], [800, 248], [640, 248], [500, 300], [440, 325]],
      south: [[262, 400], [380, 350], [440, 325], [500, 300], [640, 248], [800, 248], [800, 640], [360, 640], [330, 600], [290, 560], [306, 520], [274, 490], [284, 450], [258, 402]],
    },
  };
  A.mapBase = () => {
    const M = A.map;
    const pts = (p) => p.map((q) => q.join(',')).join(' ');
    return `
      <rect width="800" height="640" fill="#e8d9b4"/>
      <polygon points="${pts(M.sea)}" fill="#9cc4d8"/>
      <g stroke="#7fb0c9" stroke-width="2" fill="none" opacity=".7"><path d="M40 330 q20 -8 40 0 t40 0"/><path d="M90 480 q20 -8 40 0 t40 0"/><path d="M30 560 q20 -8 40 0 t40 0"/></g>
      <g fill="#c9b98e" opacity=".8">
        <path d="M560 180 l20 -30 l20 30 z M610 200 l16 -24 l16 24 z M680 170 l22 -34 l22 34 z M720 220 l18 -28 l18 28 z M600 330 l18 -26 l18 26 z M700 320 l22 -32 l22 32 z M560 520 l18 -26 l18 26 z M680 470 l22 -32 l22 32 z"/>
      </g>
      <path d="${M.rivers.amnok}" stroke="#3f86b5" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="${M.rivers.cheongcheon}" stroke="#3f86b5" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="${M.rivers.daedong}" stroke="#3f86b5" stroke-width="6" fill="none" stroke-linecap="round"/>
      <g font-weight="700" fill="#2b4f6b" font-size="20">
        <text x="560" y="96" transform="rotate(-14 560 96)">압록강</text>
        <text x="500" y="282" transform="rotate(-22 500 282)">청천강</text>
        <text x="520" y="404" transform="rotate(-18 520 404)">대동강</text>
      </g>
      <g font-weight="800" fill="#6b4a2a">
        <text x="330" y="80" font-size="30">거란</text>
        <text x="90" y="420" font-size="24" fill="#2b5f80">서해</text>
        <text x="600" y="580" font-size="30" fill="#8e2a22">고려</text>
      </g>
      <g><circle cx="430" cy="470" r="8" fill="#8e2a22"/><text x="444" y="494" font-size="18" font-weight="700" fill="#3b2a1a">서경(평양)</text>
        <circle cx="520" cy="610" r="10" fill="#8e2a22" stroke="#d4a63c" stroke-width="3"/><text x="538" y="616" font-size="18" font-weight="700" fill="#3b2a1a">개경</text></g>
      <g class="jurchen" font-size="16" font-weight="700" fill="#5a6a3a">
        <text x="300" y="268">여진</text><text x="370" y="214">여진</text><text x="560" y="214">여진</text>
      </g>
      <text x="790" y="630" text-anchor="end" font-size="14" fill="#6b5a3a">※ 단순하게 그린 지도예요. 위치는 대략적이에요.</text>`;
  };

  return A;
})();
HA.art.archive = HA.art.archive || HA.art.goryeo.archive; // 공용 배경(시간의 서고)으로도 사용
