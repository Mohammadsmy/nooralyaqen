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
  return text.replace(/[ً-ٰٟ]/g, '')
}

// 45 daily posts — rotated by ?i=0..44
const POSTS = [
  // ── Quran (original 5) ──────────────────────────────────────────────────────
  { type:'quran',  ar:'ومن يتق الله يجعل له مخرجا ويرزقه من حيث لا يحتسب ومن يتوكل على الله فهو حسبه', en:'Whoever fears Allah, He will make a way out for him and provide from where he does not expect. And whoever relies upon Allah — then He is sufficient for him.', ref:'Al-Talaq 65:2-3' },
  { type:'quran',  ar:'فان مع العسر يسرا ان مع العسر يسرا فإذا فرغت فانصب وإلى ربك فارغب', en:'Indeed, with hardship comes ease. Indeed, with hardship comes ease. So when you are free, strive hard. And to your Lord turn your attention.', ref:'Ash-Sharh 94:5-8' },
  { type:'quran',  ar:'وإذا سالك عبادي عني فاني قريب اجيب دعوة الداع إذا دعان فليستجيبوا لي وليؤمنوا بي لعلهم يرشدون', en:'When My servants ask about Me — I am near. I respond to the caller when he calls. So let them respond to Me and believe in Me, that they may be guided.', ref:'Al-Baqarah 2:186' },
  { type:'quran',  ar:'يا بني اذهبوا فتحسسوا من يوسف واخيه ولا تياسوا من روح الله انه لا يياس من روح الله الا القوم الكافرون', en:'O my sons, go and find out about Yusuf and his brother, and do not despair of relief from Allah. Indeed, no one despairs of relief from Allah except the disbelieving people.', ref:'Yusuf 12:87' },
  { type:'quran',  ar:'الله لا اله الا هو الحي القيوم لا تاخذه سنة ولا نوم له ما في السماوات وما في الارض وسع كرسيه السماوات والارض وهو العلي العظيم', en:'Allah — there is no deity except Him, the Ever-Living, the Sustainer. Neither drowsiness nor sleep overtakes Him. His Kursi extends over the heavens and the earth. He is the Most High, the Most Great.', ref:'Al-Baqarah 2:255 — Ayat al-Kursi' },
  // ── Hadith (original 5) ─────────────────────────────────────────────────────
  { type:'hadith', ar:'انما الاعمال بالنيات وانما لكل امرئ ما نوى', en:'Actions are judged only by intentions, and each person will have only what they intended.', ref:'Sahih al-Bukhari' },
  { type:'hadith', ar:'المؤمن القوي خير واحب الى الله من المؤمن الضعيف وفي كل خير', en:'The strong believer is better and more beloved to Allah than the weak believer, though both have goodness.', ref:'Sahih Muslim' },
  { type:'hadith', ar:'من سلك طريقا يلتمس فيه علما سهل الله له طريقا الى الجنة', en:'Whoever takes a path seeking knowledge, Allah will make easy for him the path to Paradise.', ref:'Sahih Muslim' },
  { type:'hadith', ar:'تبسمك في وجه اخيك صدقة', en:'Your smile in the face of your brother is charity.', ref:'Sunan al-Tirmidhi' },
  { type:'hadith', ar:'من كان يؤمن بالله واليوم الاخر فليقل خيرا او ليصمت', en:'Whoever believes in Allah and the Last Day, let him speak good or remain silent.', ref:'Sahih al-Bukhari' },
  // ── Dhikr (original 5) ──────────────────────────────────────────────────────
  { type:'dhikr',  ar:'سبحان الله وبحمده سبحان الله العظيم', en:'Glory be to Allah and His praise. Glory be to Allah the Magnificent.', ref:'Sahih al-Bukhari & Muslim' },
  { type:'dhikr',  ar:'لا اله الا الله وحده لا شريك له له الملك وله الحمد وهو على كل شيء قدير', en:'None has the right to be worshipped but Allah alone. His is the dominion and all praise belongs to Him.', ref:'Sahih al-Bukhari' },
  { type:'dhikr',  ar:'اللهم انت ربي لا اله الا انت خلقتني وانا عبدك', en:'O Allah, You are my Lord. There is no god but You. You created me and I am Your servant.', ref:'Sayyid al-Istighfar — al-Bukhari' },
  { type:'dhikr',  ar:'حسبنا الله ونعم الوكيل', en:'Allah is sufficient for us, and He is the best Disposer of affairs.', ref:'Al-Imran 3:173' },
  { type:'dhikr',  ar:'اللهم اني اسالك العفو والعافية في الدنيا والاخرة', en:'O Allah, I ask You for forgiveness and wellbeing in this world and the next.', ref:'Sunan Abu Dawud' },

  // ── Quran (new 15) ──────────────────────────────────────────────────────────
  { type:'quran',  ar:'فاذكروني اذكركم واشكروا لي ولا تكفرون', en:'Remember Me, and I will remember you. Be grateful to Me and do not deny Me.', ref:'Al-Baqarah 2:152' },
  { type:'quran',  ar:'يا ايها الذين امنوا استعينوا بالصبر والصلاة ان الله مع الصابرين', en:'O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.', ref:'Al-Baqarah 2:153' },
  { type:'quran',  ar:'انا لله وانا اليه راجعون', en:'Indeed, to Allah we belong and to Him we shall return.', ref:'Al-Baqarah 2:156' },
  { type:'quran',  ar:'ربنا اتنا في الدنيا حسنة وفي الاخرة حسنة وقنا عذاب النار', en:'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.', ref:'Al-Baqarah 2:201' },
  { type:'quran',  ar:'لا يكلف الله نفسا الا وسعها لها ما كسبت وعليها ما اكتسبت', en:'Allah does not burden a soul beyond what it can bear. For it is what it has earned, and against it is what it has done wrong.', ref:'Al-Baqarah 2:286' },
  { type:'quran',  ar:'الا بذكر الله تطمئن القلوب', en:'Verily, in the remembrance of Allah do hearts find rest.', ref:"Ar-Ra'd 13:28" },
  { type:'quran',  ar:'وإذ تاذن ربكم لئن شكرتم لازيدنكم ولئن كفرتم ان عذابي لشديد', en:'If you are grateful, I will surely increase you in favor. But if you are ungrateful, indeed My punishment is severe.', ref:'Ibrahim 14:7' },
  { type:'quran',  ar:'إذ اوى الفتية الى الكهف فقالوا ربنا اتنا من لدنك رحمة وهيئ لنا من امرنا رشدا', en:'When the youths took refuge in the cave and said: Our Lord, grant us mercy from Yourself and guide us in our affair.', ref:'Al-Kahf 18:10' },
  { type:'quran',  ar:'رب اني لما انزلت الي من خير فقير', en:'My Lord, indeed I am in need of whatever good You would send down to me.', ref:'Al-Qasas 28:24' },
  { type:'quran',  ar:'يا ايها الذين امنوا اذكروا الله ذكرا كثيرا وسبحوه بكرة واصيلا', en:'O you who have believed, remember Allah with much remembrance, and exalt Him morning and afternoon.', ref:'Al-Ahzab 33:41-42' },
  { type:'quran',  ar:'قل يا عبادي الذين اسرفوا على انفسهم لا تقنطوا من رحمة الله ان الله يغفر الذنوب جميعا انه هو الغفور الرحيم', en:'Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.', ref:'Az-Zumar 39:53' },
  { type:'quran',  ar:'وقال ربكم ادعوني استجب لكم', en:'And your Lord says: Call upon Me, and I will respond to you.', ref:'Ghafir 40:60' },
  { type:'quran',  ar:'وهو الذي يقبل التوبة عن عباده ويعفو عن السيئات ويعلم ما تفعلون', en:'And it is He who accepts repentance from His servants and pardons misdeeds, and He knows what you do.', ref:'Ash-Shura 42:25' },
  { type:'quran',  ar:'ما ودعك ربك وما قلى وللاخرة خير لك من الاولى ولسوف يعطيك ربك فترضى', en:'Your Lord has not forsaken you, nor has He detested you. And the Hereafter is better for you than the first. And your Lord is going to give you, and you will be satisfied.', ref:'Ad-Duha 93:3-5' },
  { type:'quran',  ar:'الم نشرح لك صدرك ووضعنا عنك وزرك الذي انقض ظهرك ورفعنا لك ذكرك', en:'Did We not expand your breast for you, and remove from you your burden which had weighed upon your back, and raise high your repute?', ref:'Al-Inshirah 94:1-4' },

  // ── Hadith (new 10) ─────────────────────────────────────────────────────────
  { type:'hadith', ar:'الدعاء هو العبادة', en:"Du'a (supplication) is worship.", ref:'Sunan al-Tirmidhi' },
  { type:'hadith', ar:'خير الناس انفعهم للناس', en:'The best of people are those most beneficial to people.', ref:"Al-Mu'jam al-Awsat — al-Tabarani" },
  { type:'hadith', ar:'من لا يشكر الناس لا يشكر الله', en:'Whoever does not thank people has not thanked Allah.', ref:'Sunan Abu Dawud' },
  { type:'hadith', ar:'ان الله رفيق يحب الرفق في الامر كله', en:'Indeed, Allah is gentle and loves gentleness in all matters.', ref:'Sahih al-Bukhari' },
  { type:'hadith', ar:'من كان في حاجة اخيه كان الله في حاجته', en:'Whoever fulfills the need of his brother, Allah fulfills his need.', ref:'Sahih al-Bukhari' },
  { type:'hadith', ar:'اتق الله حيثما كنت واتبع السيئة الحسنة تمحها وخالق الناس بخلق حسن', en:'Fear Allah wherever you are, follow a bad deed with a good one to erase it, and treat people with good character.', ref:'Sunan al-Tirmidhi' },
  { type:'hadith', ar:'ليس الشديد بالصرعة انما الشديد الذي يملك نفسه عند الغضب', en:'The strong man is not the one who wrestles others. The strong man is the one who controls himself when he is angry.', ref:'Sahih al-Bukhari' },
  { type:'hadith', ar:'ان من اكمل المؤمنين إيمانا احسنهم خلقا', en:'The most complete of the believers in faith are those with the best character.', ref:'Sunan Abu Dawud' },
  { type:'hadith', ar:'من احب ان يبسط له في رزقه وينسا له في اثره فليصل رحمه', en:'Whoever wishes to have his provision expanded and his life extended, let him maintain the ties of kinship.', ref:'Sahih al-Bukhari' },
  { type:'hadith', ar:'لا يدخل الجنة من لا يامن جاره بوائقه', en:'He will not enter Paradise whose neighbor is not safe from his evil.', ref:'Sahih Muslim' },

  // ── Dhikr (new 5) ───────────────────────────────────────────────────────────
  { type:'dhikr',  ar:'استغفر الله العظيم الذي لا اله الا هو الحي القيوم واتوب اليه', en:'I seek forgiveness from Allah the Magnificent, besides whom there is no god, the Ever-Living, the Sustainer, and I repent to Him.', ref:'Sunan al-Tirmidhi' },
  { type:'dhikr',  ar:'اللهم صل على محمد وعلى ال محمد كما صليت على ابراهيم وعلى ال ابراهيم انك حميد مجيد', en:'O Allah, send blessings upon Muhammad and upon the family of Muhammad, as You sent blessings upon Ibrahim and the family of Ibrahim. You are Praiseworthy and Glorious.', ref:'Sahih al-Bukhari' },
  { type:'dhikr',  ar:'لا حول ولا قوة الا بالله', en:'There is no power and no strength except with Allah.', ref:'Sahih al-Bukhari & Muslim' },
  { type:'dhikr',  ar:'سبحان الله والحمد لله ولا اله الا الله والله اكبر', en:'Glory be to Allah. Praise be to Allah. There is no god but Allah. Allah is the Greatest.', ref:'Sahih Muslim' },
  { type:'dhikr',  ar:'بسم الله الذي لا يضر مع اسمه شيء في الارض ولا في السماء وهو السميع العليم', en:'In the name of Allah, with whose name nothing can cause harm on earth or in the heavens. He is the All-Hearing, the All-Knowing.', ref:'Sunan Abu Dawud' },
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
        h('span', { style: { color:'rgba(255,255,255,0.22)', fontSize:'11px', letterSpacing:'0.14em', display:'flex' } }, 'nooralyaqeen.vercel.app'),
      ),
    ),
    { width: 1080, height: 1080, fonts }
  )
}
