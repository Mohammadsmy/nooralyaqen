import { ImageResponse } from '@vercel/og'
import { FONT_B64 } from './_font.js'
import { FONT_BOLD_B64 } from './_fontBold.js'

export const config = { runtime: 'edge' }

function h(type, props, ...children) {
  const c = children.filter(x => x != null && x !== false)
  return {
    $$typeof: Symbol.for('react.element'),
    type, key: null, ref: null,
    props: { ...props, ...(c.length === 1 ? { children: c[0] } : c.length > 1 ? { children: c } : {}) },
    _owner: null, _store: {},
  }
}

const LABELS   = { quran:'VERSE OF THE DAY', hadith:'HADITH OF THE DAY', dhikr:'DHIKR OF THE DAY', dua:'DUA OF THE DAY' }
const AR_LABEL = { quran:'آية اليوم',        hadith:'حديث اليوم',        dhikr:'ذكر اليوم',        dua:'دعاء اليوم'   }

function b64ToBuffer(b64) {
  const bin = atob(b64)
  const buf = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i)
  return buf.buffer
}

// Strip harakat (tashkeel) — diacritical marks that clutter image rendering
function stripHarakat(text) {
  return text.replace(/[ً-ٰٟۖ-ۜ۟-۪ۤۧۨ-ۭؐ-ؚ]/g, '')
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url)
  const english = searchParams.get('e') || 'Indeed, with hardship will be ease.'
  const arabic  = stripHarakat(searchParams.get('a') || '')
  const ref     = searchParams.get('r') || 'Al-Inshirah · 94:6'
  const type    = searchParams.get('t') || 'quran'
  const label   = LABELS[type]   || LABELS.quran
  const arLabel = AR_LABEL[type] || AR_LABEL.quran

  const engSize = english.length > 180 ? '26px' : english.length > 110 ? '32px' : '38px'
  const arSize  = arabic.length  > 80  ? '38px' : arabic.length  > 45  ? '46px' : '56px'

  const gold    = '#f0b429'
  const goldDim = 'rgba(240,180,41,0.7)'

  const fonts = [
    { name: 'Tajawal', data: b64ToBuffer(FONT_B64),      weight: 400, style: 'normal' },
    { name: 'Tajawal', data: b64ToBuffer(FONT_BOLD_B64), weight: 700, style: 'normal' },
  ]

  return new ImageResponse(
    h('div', {
      style: {
        width:'100%', height:'100%', display:'flex',
        flexDirection:'column', alignItems:'center', justifyContent:'center',
        background:'#0d3d29', fontFamily:'Tajawal, sans-serif', padding:'60px',
      }
    },

      // Floating card
      h('div', {
        style: {
          display:'flex', flexDirection:'column', width:'100%', maxWidth:'940px',
          background:'rgba(255,255,255,0.08)', border:'1.5px solid rgba(255,255,255,0.15)',
          borderRadius:'28px', padding:'60px 72px 52px', gap:'0',
        }
      },

        // Header row
        h('div', {
          style: {
            display:'flex', flexDirection:'row', alignItems:'center',
            justifyContent:'space-between', marginBottom: arabic ? '40px' : '44px',
          }
        },
          h('div', { style: { display:'flex', alignItems:'center', gap:'10px' } },
            h('span', { style: { color: gold, fontSize:'22px', display:'flex' } }, '✨'),
            h('span', { style: { color: gold, fontSize:'16px', fontWeight:700, letterSpacing:'0.2em', display:'flex' } }, label),
          ),
          h('span', { style: { color: gold, fontSize:'18px', fontFamily:'Tajawal', fontWeight:400, display:'flex' } }, arLabel),
        ),

        // Arabic text — Bold, no harakat, larger
        arabic && h('div', {
          style: {
            fontFamily:'Tajawal', fontWeight:700,
            direction:'rtl', textAlign:'right',
            fontSize: arSize, color:'#ffffff', lineHeight:1.7,
            display:'flex', flexWrap:'wrap', justifyContent:'flex-end',
            marginBottom:'36px', width:'100%',
          }
        }, arabic),

        // English quote
        h('div', {
          style: {
            color:'rgba(255,255,255,0.85)', fontSize: engSize, fontStyle:'italic',
            lineHeight:1.65, display:'flex', flexWrap:'wrap', marginBottom:'32px',
          }
        }, `"${english}"`),

        // Reference
        h('div', {
          style: { color: gold, fontSize:'17px', fontWeight:600, letterSpacing:'0.06em', display:'flex' }
        }, ref ? `— ${ref}` : ''),
      ),

      // Footer
      h('div', {
        style: { position:'absolute', bottom:'40px', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }
      },
        h('span', { style: { color: goldDim, fontSize:'13px', letterSpacing:'0.24em', fontWeight:700, display:'flex' } }, '✦  NOOR AL-YAQEEN  ✦'),
        h('span', { style: { color:'rgba(255,255,255,0.22)', fontSize:'11px', letterSpacing:'0.14em', display:'flex' } }, 'noorpath-iota.vercel.app'),
      ),
    ),
    { width: 1080, height: 1080, fonts }
  )
}
