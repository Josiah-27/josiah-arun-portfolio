// Animated SVG illustrations for the project cards (pure SVG + CSS, no images).

const radar = () => `
<div class="viz viz--radar">
  <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <defs>
      <radialGradient id="dr-sweep" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(200 125) scale(135)">
        <stop offset="0" stop-color="#5eead4" stop-opacity=".55" />
        <stop offset="1" stop-color="#5eead4" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="dr-trail" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stop-color="#f472b6" />
        <stop offset="1" stop-color="#a78bfa" />
      </linearGradient>
    </defs>
    <g fill="none" stroke="rgba(94,234,212,.16)">
      <circle cx="200" cy="125" r="40" />
      <circle cx="200" cy="125" r="80" />
      <circle cx="200" cy="125" r="120" />
      <circle cx="200" cy="125" r="160" />
      <path d="M200 -40V290M-40 125H440" />
    </g>
    <path class="viz-spin" d="M200 125 L200 -10 A135 135 0 0 1 316.9 57.5 Z" fill="url(#dr-sweep)" />
    <path d="M112 196 L136 176 L150 150 L178 140 L196 112 L226 104 L240 80 L268 72 L292 58" fill="none" stroke="rgba(167,139,250,.25)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
    <path class="viz-dash" d="M112 196 L136 176 L150 150 L178 140 L196 112 L226 104 L240 80 L268 72 L292 58" fill="none" stroke="url(#dr-trail)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="112" cy="196" r="5" fill="#f472b6" />
    <text x="124" y="214" font-size="9" fill="rgba(244,114,182,.9)" letter-spacing="1.5">START</text>
    <circle class="viz-pulse" cx="292" cy="58" r="6" fill="none" stroke="#5eead4" stroke-width="2" />
    <circle cx="292" cy="58" r="5" fill="#5eead4" />
    <text x="200" y="16" text-anchor="middle" font-size="10" fill="rgba(255,255,255,.55)">N</text>
    <g font-size="9" fill="rgba(226,232,255,.72)" letter-spacing="1.2">
      <text x="14" y="22">GPS ✕ · IMU + CAMERA</text>
      <text x="14" y="238">MODE: WALKING · ZUPT</text>
      <text x="386" y="238" text-anchor="end">RETRACE ⟲</text>
    </g>
  </svg>
</div>`;

const voice = () => {
  const n = 30;
  let bars = '';
  for (let i = 0; i < n; i++) {
    const x = 52 + i * 10;
    const env = Math.sin((i / (n - 1)) * Math.PI);
    const h = Math.round(16 + env * 104 * (0.65 + 0.35 * Math.abs(Math.sin(i * 1.7))));
    const dur = (0.75 + (i % 5) * 0.13).toFixed(2);
    const delay = (-((i * 0.17) % 1.1)).toFixed(2);
    bars += `<rect class="viz-bar" x="${x}" y="${118 - h / 2}" width="5" height="${h}" rx="2.5" fill="url(#qf-g)" style="animation-duration:${dur}s;animation-delay:${delay}s" />`;
  }
  return `
<div class="viz viz--voice">
  <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="qf-g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f0abfc" />
        <stop offset=".5" stop-color="#a78bfa" />
        <stop offset="1" stop-color="#5eead4" />
      </linearGradient>
    </defs>
    <path d="M20 118H380" stroke="rgba(255,255,255,.12)" />
    ${bars}
    <text x="200" y="226" text-anchor="middle" font-size="9" fill="rgba(255,255,255,.62)" letter-spacing="1.4">VOICE → SARVAM → GEMINI → OWNER ✓ → PAYTM</text>
  </svg>
  <span class="viz-chip" style="left:7%;top:13%;--d:5s">नमस्ते</span>
  <span class="viz-chip" style="right:8%;top:11%;--d:6s">வணக்கம்</span>
  <span class="viz-chip" style="left:11%;bottom:24%;--d:7s">ನಮಸ್ಕಾರ</span>
  <span class="viz-chip" style="right:11%;bottom:26%;--d:5.5s">Hello</span>
</div>`;
};

const breathe = () => `
<div class="viz viz--breathe">
  <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <radialGradient id="cc-g" cx=".5" cy=".42" r=".62">
        <stop offset="0" stop-color="#ccfbf1" />
        <stop offset=".55" stop-color="#2dd4bf" stop-opacity=".85" />
        <stop offset="1" stop-color="#3b82f6" stop-opacity=".35" />
      </radialGradient>
      <filter id="cc-blur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="16" /></filter>
    </defs>
    <circle cx="200" cy="108" r="90" fill="none" stroke="rgba(255,255,255,.1)" />
    <circle cx="200" cy="108" r="72" fill="none" stroke="rgba(255,255,255,.1)" stroke-dasharray="2 7" />
    <circle class="viz-breathe" cx="200" cy="108" r="74" fill="#14b8a6" opacity=".45" filter="url(#cc-blur)" />
    <circle class="viz-breathe" cx="200" cy="108" r="60" fill="url(#cc-g)" />
    <text class="viz-in" x="200" y="112" text-anchor="middle" font-size="12" font-weight="700" fill="#042f2a" letter-spacing="1.6">BREATHE IN</text>
    <text class="viz-out" x="200" y="112" text-anchor="middle" font-size="12" font-weight="700" fill="#042f2a" letter-spacing="1.6">BREATHE OUT</text>
    <path d="M0 220 H120 l10 -16 l8 30 l10 -44 l10 40 l8 -10 H262 l10 -14 l8 24 l10 -30 l8 20 H400" fill="none" stroke="rgba(94,234,212,.18)" stroke-width="2" stroke-linejoin="round" />
    <path class="viz-ecg" d="M0 220 H120 l10 -16 l8 30 l10 -44 l10 40 l8 -10 H262 l10 -14 l8 24 l10 -30 l8 20 H400" fill="none" stroke="#5eead4" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" />
  </svg>
</div>`;

const db = () => {
  let cells = '';
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 10; c++) {
      const x = 46 + c * 29;
      const y = 92 + r * 24;
      const d = ((c * 0.37 + r * 0.91) % 3.6).toFixed(2);
      cells += `<rect class="viz-cell" x="${x}" y="${y}" width="23" height="18" rx="4" fill="#60a5fa" stroke="rgba(147,197,253,.35)" style="animation-delay:-${d}s" />`;
    }
  }
  return `
<div class="viz viz--db">
  <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g font-size="10.5">
      <text x="46" y="58" fill="#5eead4">jql&gt;</text>
      <text x="80" y="58" fill="rgba(255,255,255,.88)">SELECT name FROM sensors WHERE id=7;</text>
      <rect class="viz-caret" x="311" y="49" width="6" height="12" fill="#5eead4" />
    </g>
    <text x="46" y="80" font-size="8.5" fill="rgba(255,255,255,.45)" letter-spacing="1.4">PAGE-BASED STORAGE ENGINE</text>
    ${cells}
    <g transform="translate(366 128)">
      <rect x="-14" y="-2" width="28" height="22" rx="5" fill="rgba(94,234,212,.14)" stroke="#5eead4" stroke-width="1.5" />
      <path d="M-8 -2v-6a8 8 0 0 1 16 0v6" fill="none" stroke="#5eead4" stroke-width="2" />
      <circle cx="0" cy="9" r="3" fill="#5eead4" />
    </g>
    <text x="46" y="214" font-size="9" fill="rgba(255,255,255,.62)" letter-spacing="1.3">AES-256-GCM · ENCRYPTED AT REST</text>
  </svg>
</div>`;
};

const photo = () => `
<div class="viz viz--photo">
  <img src="/images/smart-room-board.webp" alt="" width="1080" height="1440" loading="lazy" decoding="async" />
  <div class="viz__caption">
    <span class="chip">No microcontroller</span>
    <span class="chip">TTL logic only</span>
    <span class="chip">Laser + LDR</span>
  </div>
</div>`;

// Smith chart for a 75 + j25 Ω load on a 50 Ω line (|Γ| = 0.277 ∠ 33.7°), drawn from the real geometry.
const smith = () => {
  const cx = 122;
  const cy = 125;
  const R = 98;
  const f = (n) => n.toFixed(1);
  let grid = '';
  for (const r of [0.2, 0.5, 1, 2, 5]) {
    grid += `<circle cx="${f(cx + (R * r) / (1 + r))}" cy="${cy}" r="${f(R / (1 + r))}" />`;
  }
  for (const x of [0.2, 0.5, 1, 2, 5]) {
    grid += `<circle cx="${cx + R}" cy="${f(cy - R / x)}" r="${f(R / x)}" /><circle cx="${cx + R}" cy="${f(cy + R / x)}" r="${f(R / x)}" />`;
  }
  const g = 0.2774 * R;
  const ang = (33.69 * Math.PI) / 180;
  const lx = cx + g * Math.cos(ang);
  const ly = cy - g * Math.sin(ang);
  const rows = [
    ['zL', '1.5 + j0.5'],
    ['Γ', '0.277 ∠ 33.7°'],
    ['VSWR', '1.77'],
    ['RL', '11.14 dB'],
    ['Vmin', '8.90 cm'],
  ]
    .map(
      ([k, v], i) =>
        `<text x="250" y="${86 + i * 22}" fill="rgba(226,232,255,.55)">${k}</text><text x="292" y="${86 + i * 22}" fill="#fff">${v}</text>`
    )
    .join('');
  return `
<div class="viz viz--smith">
  <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <defs>
      <clipPath id="sm-clip"><circle cx="${cx}" cy="${cy}" r="${R}" /></clipPath>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="rgba(255,255,255,.03)" stroke="rgba(226,232,255,.55)" stroke-width="1.4" />
    <g clip-path="url(#sm-clip)" fill="none" stroke="rgba(147,197,253,.22)" stroke-width=".9">
      ${grid}
      <path d="M${cx - R} ${cy}H${cx + R}" />
    </g>
    <circle class="viz-dash" cx="${cx}" cy="${cy}" r="${f(g)}" fill="none" stroke="#f59e0b" stroke-width="1.8" />
    <path d="M${cx} ${cy}L${f(lx)} ${f(ly)}" stroke="#60a5fa" stroke-width="1.6" />
    <circle cx="${f(cx + g)}" cy="${cy}" r="4" fill="#22c55e" />
    <circle cx="${f(cx - g)}" cy="${cy}" r="4" fill="#c084fc" />
    <circle cx="${f(lx)}" cy="${f(ly)}" r="5" fill="#ef4444" />
    <g class="viz-spin" style="transform-origin:${cx}px ${cy}px;animation-duration:9s">
      <circle cx="${f(lx)}" cy="${f(ly)}" r="3.2" fill="#fde68a" />
      <circle class="viz-pulse" cx="${f(lx)}" cy="${f(ly)}" r="4" fill="none" stroke="#fde68a" stroke-width="1.4" />
    </g>
    <g font-size="10" letter-spacing=".6">${rows}</g>
    <g font-size="8.5" fill="rgba(226,232,255,.62)" letter-spacing="1.3">
      <text x="250" y="52">ZL = 75 + j25 Ω · 1 GHz</text>
      <text x="250" y="212">⟳ TOWARD GENERATOR</text>
      <text x="14" y="240">5 SIMULATIONS · NUMPY + MATPLOTLIB</text>
    </g>
  </svg>
</div>`;
};

export const viz = { radar, voice, breathe, db, photo, smith };
