// Full-screen 1080x1080 verse card for Instagram screenshot
// Usage: /card-image?i=0..14  OR  /card-image?a=arabic&e=english&r=ref&t=type

const LABELS   = { quran:'VERSE OF THE DAY', hadith:'HADITH OF THE DAY', dhikr:'DHIKR OF THE DAY', dua:'DUA OF THE DAY' }
const AR_LABEL = { quran:'آية اليوم', hadith:'حديث اليوم', dhikr:'ذكر اليوم', dua:'دعاء اليوم' }

const POSTS = [
  { type:'quran',  ar:'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ', en:'Whoever fears Allah, He will make a way out for him and provide from where he does not expect.', ref:'Al-Talaq 65:2-3' },
  { type:'quran',  ar:'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا', en:'Indeed, with hardship comes ease. Indeed, with hardship comes ease.', ref:'Ash-Sharh 94:5-6' },
  { type:'quran',  ar:'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ', en:'When My servants ask about Me — I am near. I respond to the caller when he calls.', ref:'Al-Baqarah 2:186' },
  { type:'quran',  ar:'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ ۖ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ', en:'Do not despair of the mercy of Allah. No one despairs of His mercy except the disbelieving people.', ref:'Yusuf 12:87' },
  { type:'quran',  ar:'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ', en:'Allah — there is no deity except Him, the Ever-Living, the Sustainer. Neither drowsiness nor sleep overtakes Him.', ref:'Al-Baqarah 2:255' },
  { type:'hadith', ar:'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى', en:'Actions are judged only by intentions, and each person will have only what they intended.', ref:'Sahih al-Bukhari' },
  { type:'hadith', ar:'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ وَفِي كُلٍّ خَيْرٌ', en:'The strong believer is better and more beloved to Allah than the weak believer, though both have goodness.', ref:'Sahih Muslim' },
  { type:'hadith', ar:'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ', en:'Whoever takes a path seeking knowledge, Allah will make easy for him the path to Paradise.', ref:'Sahih Muslim' },
  { type:'hadith', ar:'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ', en:'Your smile in the face of your brother is charity.', ref:'Sunan al-Tirmidhi' },
  { type:'hadith', ar:'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ', en:'Whoever believes in Allah and the Last Day, let him speak good or remain silent.', ref:'Sahih al-Bukhari' },
  { type:'dhikr',  ar:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ۝ سُبْحَانَ اللَّهِ الْعَظِيمِ', en:'Glory be to Allah and His praise. Glory be to Allah the Magnificent.', ref:'Sahih al-Bukhari & Muslim' },
  { type:'dhikr',  ar:'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', en:'None has the right to be worshipped but Allah alone. His is the dominion and all praise belongs to Him.', ref:'Sahih al-Bukhari' },
  { type:'dhikr',  ar:'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ', en:'O Allah, You are my Lord. There is no god but You. You created me and I am Your servant.', ref:'Sayyid al-Istighfar — Sahih al-Bukhari' },
  { type:'dhikr',  ar:'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', en:'Allah is sufficient for us, and He is the best Disposer of affairs.', ref:'Al-Imran 3:173' },
  { type:'dhikr',  ar:'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ', en:'O Allah, I ask You for forgiveness and wellbeing in this world and the next.', ref:'Sunan Abu Dawud' },
]

export default function CardImage() {
  const p = new URLSearchParams(window.location.search)

  let arabic, english, ref, type
  const idx = p.get('i')
  if (idx !== null) {
    const post = POSTS[parseInt(idx) % POSTS.length]
    arabic  = post.ar
    english = post.en
    ref     = post.ref
    type    = post.type
  } else {
    arabic  = p.get('a') || 'إِنَّ مَعَ الْعُسْرِ يُسْرًا'
    english = p.get('e') || 'Indeed, with hardship will be ease.'
    ref     = p.get('r') || 'Ash-Sharh 94:6'
    type    = p.get('t') || 'quran'
  }

  const label   = LABELS[type]   || LABELS.quran
  const arLabel = AR_LABEL[type] || AR_LABEL.quran
  const arSize  = arabic.length > 100 ? '38px' : arabic.length > 60 ? '46px' : '58px'
  const enSize  = english.length > 160 ? '26px' : english.length > 100 ? '30px' : '36px'

  return (
    <div style={{
      width: '1080px', height: '1080px', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#0d3d29',
      padding: '60px', boxSizing: 'border-box',
      position: 'relative',
    }}>

      {/* Card panel */}
      <div style={{
        width: '100%', display: 'flex', flexDirection: 'column',
        background: 'rgba(255,255,255,0.08)',
        border: '1.5px solid rgba(255,255,255,0.15)',
        borderRadius: '28px', padding: '56px 68px 52px',
        boxSizing: 'border-box',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#f0b429', fontSize: '22px' }}>✨</span>
            <span style={{ color: '#f0b429', fontSize: '15px', fontWeight: 700, letterSpacing: '0.18em', fontFamily: 'sans-serif' }}>
              {label}
            </span>
          </div>
          <span style={{ color: '#f0b429', fontSize: '20px', fontFamily: "'Noto Naskh Arabic', 'Cairo', sans-serif", direction: 'rtl' }}>
            {arLabel}
          </span>
        </div>

        {/* Arabic text — full harakat, RTL, large */}
        {arabic && (
          <p style={{
            fontFamily: "'Noto Naskh Arabic', 'Amiri', serif",
            direction: 'rtl', textAlign: 'right',
            fontSize: arSize,
            color: '#ffffff', lineHeight: 2.1, fontWeight: 700,
            margin: '0 0 36px 0', padding: 0,
            unicodeBidi: 'embed',
          }}>
            {arabic}
          </p>
        )}

        {/* English */}
        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: enSize,
          color: 'rgba(255,255,255,0.88)', fontStyle: 'italic',
          lineHeight: 1.7, margin: '0 0 32px 0', padding: 0,
        }}>
          "{english}"
        </p>

        {/* Reference */}
        <p style={{
          fontFamily: 'sans-serif', fontSize: '17px',
          color: '#f0b429', fontWeight: 600, letterSpacing: '0.06em',
          margin: 0, padding: 0,
        }}>
          — {ref}
        </p>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: '42px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
      }}>
        <span style={{ color: 'rgba(240,180,41,0.75)', fontSize: '13px', letterSpacing: '0.24em', fontWeight: 700, fontFamily: 'sans-serif' }}>
          ✦  NOOR AL-YAQEEN  ✦
        </span>
        <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: '11px', letterSpacing: '0.14em', fontFamily: 'sans-serif' }}>
          nooralyaqen-iota.vercel.app
        </span>
      </div>
    </div>
  )
}
