// Full-screen 1080×1080 verse card for Instagram screenshot
// Usage: /card-image?a=arabic&e=english&r=reference&t=quran|hadith|dhikr|dua

const LABELS   = { quran:'VERSE OF THE DAY', hadith:'HADITH OF THE DAY', dhikr:'DHIKR OF THE DAY', dua:'DUA OF THE DAY' }
const AR_LABEL = { quran:'آية اليوم',        hadith:'حديث اليوم',        dhikr:'ذكر اليوم',        dua:'دعاء اليوم'   }

export default function CardImage() {
  const p      = new URLSearchParams(window.location.search)
  const arabic  = p.get('a') || 'إِنَّ مَعَ الْعُسْرِ يُسْرًا'
  const english = p.get('e') || 'Indeed, with hardship will be ease.'
  const ref     = p.get('r') || 'Ash-Sharh · 94:6'
  const type    = p.get('t') || 'quran'
  const label   = LABELS[type]   || LABELS.quran
  const arLabel = AR_LABEL[type] || AR_LABEL.quran

  return (
    <div style={{
      width: '1080px', height: '1080px', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#0d3d29',
      fontFamily: "'Noto Naskh Arabic', 'Amiri', 'Cairo', serif",
      padding: '60px', boxSizing: 'border-box',
      position: 'relative',
    }}>

      {/* Card panel */}
      <div style={{
        width: '100%', display: 'flex', flexDirection: 'column',
        background: 'rgba(255,255,255,0.08)',
        border: '1.5px solid rgba(255,255,255,0.15)',
        borderRadius: '28px', padding: '60px 72px 56px',
        boxSizing: 'border-box',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#f0b429', fontSize: '22px' }}>✨</span>
            <span style={{ color: '#f0b429', fontSize: '16px', fontWeight: 700, letterSpacing: '0.2em', fontFamily: 'sans-serif' }}>
              {label}
            </span>
          </div>
          <span style={{ color: '#f0b429', fontSize: '20px', fontFamily: "'Noto Naskh Arabic', 'Cairo', sans-serif" }}>
            {arLabel}
          </span>
        </div>

        {/* Arabic text */}
        {arabic && (
          <p style={{
            fontFamily: "'Noto Naskh Arabic', 'Amiri', 'Cairo', sans-serif",
            direction: 'rtl', textAlign: 'right',
            fontSize: arabic.length > 80 ? '40px' : arabic.length > 45 ? '50px' : '62px',
            color: '#ffffff', lineHeight: 1.9, fontWeight: 700,
            margin: '0 0 36px 0', padding: 0,
          }}>
            {arabic}
          </p>
        )}

        {/* English */}
        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: english.length > 160 ? '26px' : english.length > 100 ? '32px' : '38px',
          color: 'rgba(255,255,255,0.88)', fontStyle: 'italic',
          lineHeight: 1.65, margin: '0 0 32px 0', padding: 0,
        }}>
          "{english}"
        </p>

        {/* Reference */}
        <p style={{
          fontFamily: 'sans-serif', fontSize: '18px',
          color: '#f0b429', fontWeight: 600, letterSpacing: '0.06em',
          margin: 0, padding: 0,
        }}>
          — {ref}
        </p>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: '44px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
      }}>
        <span style={{ color: 'rgba(240,180,41,0.75)', fontSize: '14px', letterSpacing: '0.24em', fontWeight: 700, fontFamily: 'sans-serif' }}>
          ✦  NOOR AL-YAQEEN  ✦
        </span>
        <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: '12px', letterSpacing: '0.14em', fontFamily: 'sans-serif' }}>
          noorpath-iota.vercel.app
        </span>
      </div>
    </div>
  )
}
