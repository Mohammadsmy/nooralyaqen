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
const AR_LABEL = { quran:'آية اليوم', hadith:'حديث اليوم', dhikr:'ذكر اليوم', dua:'دعاء اليوم' }

function b64ToBuffer(b64) {
  const bin = atob(b64)
  const buf = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i)
  return buf.buffer
}

function stripHarakat(text) {
  return text.replace(/[ً-ٰٟ]/g, '')
}

// 15 daily posts — rotated by ?i=0..14
const POSTS = [
  { type:'quran',  ar:'ومن يتق الله يجعل له مخرجا ويرزقه من حيث لا يحتسب', en:'Whoever fears Allah, He will make a way out for him and provide from where he does not expect.', ref:'Al-Talaq 65:2-3' },
  { type:'quran',  ar:'فان مع العسر يسرا ان مع العسر يسرا', en:'Indeed, with hardship comes ease. Indeed, with hardship comes ease.', ref:'Ash-Sharh 94:5-6' },
  { type:'quran',  ar:'وإذا سالك عبادي عني فاني قريب اجيب دعوة الداع إذا دعان', en:'When My servants ask about Me, I am near. I respond to the caller when he calls.', ref:'Al-Baqarah 2:186' },
  { type:'quran',  ar:'ولا تياسوا من روح الله انه لا يياس من روح الله الا القوم الكافرون', en:'Do not despair of the mercy of Allah. No one despairs of His mercy except the disbelieving people.', ref:'Yusuf 12:87' },
  { type:'quran',  ar:'الله لا اله الا هو الحي القيوم لا تاخذه سنة ولا نوم', en:'Allah, there is no deity except Him, the Ever-Living, the Sustainer. Neither drowsiness nor sleep overtakes Him.', ref:'Al-Baqarah 2:255' },
  { type:'hadith', ar:'انما الاعمال بالنيات وانما لكل امرئ ما نوى', en:'Actions are judged only by intentions, and each person will have only what they intended.', ref:'Sahih al-Bukhari' },
  { type:'hadith', ar:'المؤمن القوي خير واحب الى الله من المؤمن الضعيف وفي كل خير', en:'The strong believer is better and more beloved to Allah than the weak believer, though both have goodness.', ref:'Sahih Muslim' },
  { type:'hadith', ar:'من سلك طريقا يلتمس فيه علما سهل الله له طريقا الى الجنة', en:'Whoever takes a path seeking knowledge, Allah will make easy for him the path to Paradise.', ref:'Sahih Muslim' },
  { type:'hadith', ar:'تبسمك في وجه اخيك صدقة', en:'Your smile in the face of your brother is charity.', ref:'Sunan al-Tirmidhi' },
  { type:'hadith', ar:'من كان يؤمن بالله واليوم الاخر فليقل خيرا او ليصمت', en:'Whoever believes in Allah and the Last Day, let him speak good or remain silent.', ref:'Sahih al-Bukhari' },
  { type:'dhikr',  ar:'سبحان الله وبحمده سبحان الله العظيم', en:'Glory be to Allah and His praise. Glory be to Allah the Magnificent.', ref:'Sahih al-Bukhari & Muslim' },
  { type:'dhikr',  ar:'لا اله الا الله وحده لا شريك له له الملك وله الحمد وهو على كل شيء قدير', en:'None has the right to be worshipped but Allah alone. His is the dominion and all praise belongs to Him.', ref:'Sahih al-Bukhari' },
  { type:'dhikr',  ar:'اللهم انت ربي لا اله الا انت خلقتني وانا عبدك', en:'O Allah, You are my Lord. There is no god but You. You created me and I am Your servant.', ref:'Sayyid al-Istighfar — al-Bukhari' },
  { type:'dhikr',  ar:'حسبنا الله ونعم الوكيل', en:'Allah is sufficient for us, and He is the best Disposer of affairs.', ref:'Al-Imran 3:173' },
  { type:'dhikr',  ar:'اللهم اني اسالك العفو والعافية في الدنيا والاخرة', en:'O Allah, I ask You for forgiveness and wellbeing in this world and the next.', ref:'Sunan Abu Dawud' },
]

export default async function handler(req) {
  const { searchParams } = new URL(req.url)

  let arabic, english, ref, type

  const idx = searchParams.get('i')
  if (idx !== null) {
    const post = POSTS[parseInt(idx) % POSTS.length]
    arabic  = post.ar
    english = post.en
    ref     = post.ref
    type    = post.type
  } else {
    const verseNum = searchParams.get('n')
    if (verseNum) {
      try {
        const apiUrl = `https://api.alquran.cloud/v1/ayah/${verseNum}/editions/ar.alafasy,en.asad`
        const res  = await fetch(apiUrl)
        const data = (await res.json()).data
        const ar   = data.find(e => e.edition.identifier === 'ar.alafasy')
        const en   = data.find(e => e.edition.identifier === 'en.asad')
        arabic  = stripHarakat(ar.text)
        english = en.text.length > 200 ? en.text.slice(0, 197) + '...' : en.text
        ref     = `${ar.surah.englishName} ${ar.surah.number}:${ar.numberInSurah}`
        type    = 'quran'
      } catch(e) {
        arabic = ''; english = 'Indeed, with hardship will be ease.'; ref = 'Al-Inshirah 94:6'; type = 'quran'
      }
    } else {
      english = searchParams.get('e') || 'Indeed, with hardship will be ease.'
      arabic  = stripHarakat(searchParams.get('a') || '')
      ref     = searchParams.get('r') || 'Al-Inshirah 94:6'
      type    = searchParams.get('t') || 'quran'
    }
  }

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
    h('div', { style: { width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#0d3d29', fontFamily:'Tajawal, sans-serif', padding:'60px' } },
      h('div', { style: { display:'flex', flexDirection:'column', width:'100%', maxWidth:'940px', background:'rgba(255,255,255,0.08)', border:'1.5px solid rgba(255,255,255,0.15)', borderRadius:'28px', padding:'60px 72px 52px', gap:'0' } },
        h('div', { style: { display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom: arabic ? '40px' : '44px' } },
          h('div', { style: { display:'flex', alignItems:'center', gap:'10px' } },
            h('span', { style: { color: gold, fontSize:'22px', display:'flex' } }, '✨'),
            h('span', { style: { color: gold, fontSize:'16px', fontWeight:700, letterSpacing:'0.2em', display:'flex' } }, label),
          ),
          h('span', { style: { color: gold, fontSize:'18px', fontFamily:'Tajawal', fontWeight:400, display:'flex' } }, arLabel),
        ),
        arabic && h('div', { style: { fontFamily:'Tajawal', fontWeight:700, direction:'rtl', textAlign:'right', fontSize: arSize, color:'#ffffff', lineHeight:1.7, display:'flex', flexWrap:'wrap', justifyContent:'flex-end', marginBottom:'36px', width:'100%' } }, arabic),
        h('div', { style: { color:'rgba(255,255,255,0.85)', fontSize: engSize, fontStyle:'italic', lineHeight:1.65, display:'flex', flexWrap:'wrap', marginBottom:'32px' } }, `"${english}"`),
        h('div', { style: { color: gold, fontSize:'17px', fontWeight:600, letterSpacing:'0.06em', display:'flex' } }, ref ? `— ${ref}` : ''),
      ),
      h('div', { style: { position:'absolute', bottom:'40px', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' } },
        h('span', { style: { color: goldDim, fontSize:'13px', letterSpacing:'0.24em', fontWeight:700, display:'flex' } }, 'NOOR AL-YAQEEN'),
        h('span', { style: { color:'rgba(255,255,255,0.22)', fontSize:'11px', letterSpacing:'0.14em', display:'flex' } }, 'noorpath-iota.vercel.app'),
      ),
    ),
    { width: 1080, height: 1080, fonts }
  )
}
