// Logo System Preview — نور اليقين / Noor Al-Yaqeen

/* ── Logo 01 — Crescent Monogram ─────────────────────────── */
function LogoCrescentMonogram({ size = 320, dark = false }) {
  const bg     = dark ? '#022c22' : '#065f46';
  const accent = '#fbbf24';
  const ring   = dark ? '#0f3a30' : '#047857';
  return (
    <svg viewBox="0 0 320 320" width={size} height={size} className="block">
      <defs>
        <linearGradient id="l1bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={dark ? '#064e3b' : '#047857'} />
          <stop offset="100%" stopColor={bg} />
        </linearGradient>
        <radialGradient id="l1glow" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#fcd34d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="320" rx="68" fill="url(#l1bg)" />
      <circle cx="160" cy="160" r="140" fill="url(#l1glow)" />
      <g transform="translate(160 160)" fill="none" stroke={ring} strokeWidth="1.2" opacity="0.6">
        <rect x="-110" y="-110" width="220" height="220" rx="6" />
        <rect x="-110" y="-110" width="220" height="220" rx="6" transform="rotate(45)" />
      </g>
      <g transform="translate(160 160)" fill="none" stroke={accent} strokeWidth="1" opacity="0.45">
        <circle r="118" />
        <circle r="92" />
      </g>
      <mask id="l1m">
        <rect width="320" height="320" fill="white" />
        <circle cx="190" cy="160" r="62" fill="black" />
      </mask>
      <circle cx="158" cy="160" r="74" fill={accent} mask="url(#l1m)" />
      <polygon points="208,108 213,121 227,122 216,131 220,145 208,138 196,145 200,131 189,122 203,121" fill="#fcd34d" />
      <rect x="68" y="252" width="184" height="2" fill={accent} opacity="0.6" />
      <text x="160" y="280" textAnchor="middle" fill={accent} fontSize="14"
            style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.32em', fontWeight: 600 }}>
        NOOR AL-YAQEEN
      </text>
    </svg>
  );
}

/* ── Logo 02 — Horizontal Lockup ────────────────────────────── */
function LogoHorizontalLockup({ width = 520, dark = false }) {
  const fg     = dark ? '#fcd34d' : '#065f46';
  const sub    = dark ? '#fbbf24' : '#047857';
  const accent = '#d97706';
  return (
    <svg viewBox="0 0 520 140" width={width} className="block">
      <g transform="translate(0 10)">
        <rect width="120" height="120" rx="26" fill={dark ? '#022c22' : '#065f46'} />
        <g transform="translate(60 60)" fill="none" stroke={dark ? '#fcd34d' : '#fbbf24'} opacity="0.35" strokeWidth="0.9">
          <rect x="-42" y="-42" width="84" height="84" />
          <rect x="-42" y="-42" width="84" height="84" transform="rotate(45)" />
          <circle r="36" />
        </g>
        <mask id="l2m">
          <rect width="120" height="120" fill="white" />
          <circle cx="74" cy="60" r="22" fill="black" />
        </mask>
        <circle cx="62" cy="60" r="26" fill="#fbbf24" mask="url(#l2m)" />
        <polygon points="86,38 88.6,44.6 96,45.2 90.2,49.8 92,57 86,53.2 80,57 81.8,49.8 76,45.2 83.4,44.6" fill="#fcd34d" />
      </g>
      <g transform="translate(146 0)">
        <text x="0" y="58" fill={fg}
              style={{ fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: '52px', direction: 'rtl' }}>
          نور اليقين
        </text>
        <line x1="0" y1="74" x2="320" y2="74" stroke={accent} strokeWidth="1" opacity="0.5" />
        <text x="0" y="100" fill={sub}
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '22px', letterSpacing: '0.08em' }}>
          Noor Al-Yaqeen
        </text>
        <text x="0" y="122" fill={dark ? '#34d399' : '#0f766e'}
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '11px', letterSpacing: '0.32em', textTransform: 'uppercase' }}>
          Your Daily Islamic Companion
        </text>
      </g>
    </svg>
  );
}

/* ── Logo 03 — Stamp / Seal ─────────────────────────────────── */
function LogoStampSeal({ size = 320, dark = false }) {
  const bg     = dark ? '#022c22' : '#fffbeb';
  const ink    = dark ? '#fcd34d' : '#065f46';
  const accent = dark ? '#fbbf24' : '#b45309';
  return (
    <svg viewBox="0 0 320 320" width={size} height={size} className="block">
      <rect width="320" height="320" fill={bg} rx="20" />
      <circle cx="160" cy="160" r="138" fill="none" stroke={ink} strokeWidth="2" />
      <circle cx="160" cy="160" r="128" fill="none" stroke={accent} strokeWidth="0.8" />
      <circle cx="160" cy="160" r="92"  fill="none" stroke={ink} strokeWidth="1" opacity="0.6" />
      <defs>
        <path id="topArc3" d="M 40,160 A 120,120 0 0 1 280,160" />
        <path id="botArc3" d="M 50,170 A 110,110 0 0 0 270,170" />
      </defs>
      <text fill={ink} style={{ fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: '22px' }}>
        <textPath href="#topArc3" startOffset="50%" textAnchor="middle">رفيقك الإسلامي اليومي</textPath>
      </text>
      <text fill={accent} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', letterSpacing: '0.32em' }}>
        <textPath href="#botArc3" startOffset="50%" textAnchor="middle">DAILY · DHIKR · DUA · QURAN</textPath>
      </text>
      <g transform="translate(160 158)">
        <g fill={accent} opacity="0.18">
          <rect x="-58" y="-58" width="116" height="116" />
          <rect x="-58" y="-58" width="116" height="116" transform="rotate(45)" />
        </g>
        <mask id="l3m">
          <rect x="-80" y="-80" width="160" height="160" fill="white" />
          <circle cx="14" cy="0" r="34" fill="black" />
        </mask>
        <circle cx="-4" cy="0" r="40" fill={ink} mask="url(#l3m)" />
        <polygon points="32,-30 35,-22 43,-21 36.5,-15 39,-7 32,-12 25,-7 27.5,-15 21,-21 29,-22" fill={accent} />
      </g>
      <g fill={accent}>
        <circle cx="40" cy="160" r="3" />
        <circle cx="280" cy="160" r="3" />
      </g>
    </svg>
  );
}

/* ── Logo 04 — Kufic Wordmark ───────────────────────────────── */
function LogoKufic({ width = 520, dark = false }) {
  const ink    = dark ? '#fcd34d' : '#065f46';
  const accent = '#d97706';
  return (
    <svg viewBox="0 0 520 220" width={width} className="block">
      <g stroke={accent} strokeWidth="1.4" fill="none" opacity="0.85">
        <path d="M30 110 Q 50 60 90 80" />
        <path d="M30 110 Q 50 160 90 140" />
        <circle cx="30" cy="110" r="3" fill={accent} />
      </g>
      <g stroke={accent} strokeWidth="1.4" fill="none" opacity="0.85">
        <path d="M490 110 Q 470 60 430 80" />
        <path d="M490 110 Q 470 160 430 140" />
        <circle cx="490" cy="110" r="3" fill={accent} />
      </g>
      <text x="260" y="120" textAnchor="middle" fill={ink}
            style={{ fontFamily: "'Reem Kufi', 'Amiri', serif", fontWeight: 700, fontSize: '78px', direction: 'rtl' }}>
        نور اليقين
      </text>
      <line x1="160" y1="146" x2="360" y2="146" stroke={accent} strokeWidth="1.2" />
      <g transform="translate(260 146)" fill={accent}>
        <polygon points="-7,0 0,-5 7,0 0,5" />
      </g>
      <text x="260" y="180" textAnchor="middle" fill={accent}
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '18px', letterSpacing: '0.42em' }}>
        NOOR · AL · YAQEEN
      </text>
    </svg>
  );
}

/* ── Logo 05 — Mihrab Arch ──────────────────────────────────── */
function LogoMihrab({ size = 320, dark = false }) {
  const bg     = dark ? '#022c22' : '#065f46';
  const accent = '#fbbf24';
  return (
    <svg viewBox="0 0 320 360" width={size} height={size * 360 / 320} className="block">
      <rect width="320" height="360" rx="18" fill={bg} />
      <path d="M 60 180 L 60 320 L 260 320 L 260 180 Q 160 40 60 180 Z"
            fill="none" stroke={accent} strokeWidth="2" opacity="0.85" />
      <path d="M 78 188 L 78 304 L 242 304 L 242 188 Q 160 70 78 188 Z"
            fill="none" stroke={accent} strokeWidth="0.8" opacity="0.55" />
      <g transform="translate(160 180)" fill={accent} opacity="0.95">
        <rect x="-26" y="-26" width="52" height="52" />
        <rect x="-26" y="-26" width="52" height="52" transform="rotate(45)" />
      </g>
      <circle cx="160" cy="180" r="10" fill={bg} />
      <circle cx="160" cy="180" r="6"  fill={accent} />
      <text x="160" y="260" textAnchor="middle" fill={accent}
            style={{ fontFamily: 'Amiri, serif', fontWeight: 700, fontSize: '34px', direction: 'rtl' }}>
        نور اليقين
      </text>
      <line x1="100" y1="280" x2="220" y2="280" stroke={accent} opacity="0.6" />
      <text x="160" y="340" textAnchor="middle" fill={accent}
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '12px', letterSpacing: '0.36em' }}>
        NOOR AL-YAQEEN
      </text>
    </svg>
  );
}

/* ── Logo 06 — Favicon Tile ─────────────────────────────────── */
function FaviconTile({ size, label }) {
  const id = `fm-${size}`;
  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ width: size, height: size, borderRadius: '18%' }}
           className="bg-gradient-to-br from-emerald-700 to-emerald-950 flex items-center justify-center overflow-hidden shadow-md">
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <g transform="translate(50 50)" fill="none" stroke="#fbbf24" opacity="0.35" strokeWidth="0.6">
            <rect x="-32" y="-32" width="64" height="64" />
            <rect x="-32" y="-32" width="64" height="64" transform="rotate(45)" />
          </g>
          <mask id={id}>
            <rect width="100" height="100" fill="white" />
            <circle cx="59" cy="50" r="20" fill="black" />
          </mask>
          <circle cx="49" cy="50" r="24" fill="#fbbf24" mask={`url(#${id})`} />
          <polygon points="74,32 76,37 81,37.4 77,40.5 78.4,45.5 74,42.6 69.6,45.5 71,40.5 67,37.4 72,37" fill="#fcd34d" />
        </svg>
      </div>
      <span className="text-xs font-semibold text-emerald-300 tracking-wider">{label}px</span>
    </div>
  );
}

/* ── Section wrapper ────────────────────────────────────────── */
function Section({ num, title, children }) {
  return (
    <div className="mb-14">
      <p className="text-xs font-bold tracking-widest uppercase text-stone-400 border-b border-emerald-900 pb-2 mb-6">
        {String(num).padStart(2, '0')} — {title}
      </p>
      {children}
    </div>
  );
}

function Tile({ label, bg = 'bg-stone-100 dark:bg-stone-900', children }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${bg} rounded-2xl p-6 flex items-center justify-center`}>{children}</div>
      <span className="text-xs font-medium text-stone-400 tracking-wide uppercase">{label}</span>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
export default function Logos() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 animate-fade-in">

      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-xs font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 mb-1">
          Brand Identity System
        </p>
        <h1 className="font-arabic text-4xl text-emerald-800 dark:text-gold-300 mb-1">نور اليقين</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm tracking-widest">NOOR AL-YAQEEN · LOGO SYSTEM</p>
      </div>

      {/* 01 Crescent Monogram */}
      <Section num={1} title="Crescent Monogram — App Icon">
        <div className="flex flex-wrap gap-8 items-end">
          <Tile label="Light" bg="bg-emerald-50 dark:bg-emerald-950/50">
            <LogoCrescentMonogram size={200} dark={false} />
          </Tile>
          <Tile label="Dark" bg="bg-emerald-950">
            <LogoCrescentMonogram size={200} dark={true} />
          </Tile>
          <Tile label="100px" bg="bg-stone-100 dark:bg-stone-800">
            <LogoCrescentMonogram size={100} dark={false} />
          </Tile>
          <Tile label="64px" bg="bg-stone-100 dark:bg-stone-800">
            <LogoCrescentMonogram size={64} dark={false} />
          </Tile>
        </div>
      </Section>

      {/* 02 Horizontal Lockup */}
      <Section num={2} title="Horizontal Lockup — Header / Nav">
        <div className="flex flex-col gap-5">
          <div className="bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl p-6">
            <LogoHorizontalLockup width={500} dark={false} />
          </div>
          <div className="bg-emerald-950 rounded-2xl p-6">
            <LogoHorizontalLockup width={500} dark={true} />
          </div>
        </div>
      </Section>

      {/* 03 Stamp Seal */}
      <Section num={3} title="Stamp / Seal — Circular Badge">
        <div className="flex flex-wrap gap-8">
          <Tile label="Light" bg="bg-amber-50">
            <LogoStampSeal size={220} dark={false} />
          </Tile>
          <Tile label="Dark" bg="bg-emerald-950">
            <LogoStampSeal size={220} dark={true} />
          </Tile>
        </div>
      </Section>

      {/* 04 Kufic Wordmark */}
      <Section num={4} title="Kufic / Calligraphic Wordmark">
        <div className="flex flex-col gap-5">
          <div className="bg-stone-50 dark:bg-stone-900 rounded-2xl p-8">
            <LogoKufic width={500} dark={false} />
          </div>
          <div className="bg-emerald-950 rounded-2xl p-8">
            <LogoKufic width={500} dark={true} />
          </div>
        </div>
      </Section>

      {/* 05 Mihrab */}
      <Section num={5} title="Mihrab Arch Emblem — Architectural">
        <div className="flex flex-wrap gap-8">
          <Tile label="Light" bg="bg-stone-100">
            <LogoMihrab size={200} dark={false} />
          </Tile>
          <Tile label="Dark" bg="bg-emerald-950">
            <LogoMihrab size={200} dark={true} />
          </Tile>
        </div>
      </Section>

      {/* 06 Favicons */}
      <Section num={6} title="Favicon Sheet — 16 → 180px">
        <div className="bg-emerald-950 rounded-2xl p-8 flex items-end gap-8 flex-wrap">
          <FaviconTile size={16}  label="16" />
          <FaviconTile size={32}  label="32" />
          <FaviconTile size={64}  label="64" />
          <FaviconTile size={128} label="128" />
          <FaviconTile size={180} label="180" />
        </div>
      </Section>

    </div>
  );
}
