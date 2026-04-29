import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { quranApi } from '../utils/api'
import GeometricPattern from '../components/GeometricPattern'

const SAHABA = [
  { name: 'أبو بكر الصديق',     nameEn: 'Abu Bakr al-Siddiq',    icon: '👑', title: 'الصدّيق · الخليفة الأول',        quote: 'لا تحزن إن الله معنا.',                                              quoteEn: 'Do not grieve; indeed Allah is with us.',                          source: 'القرآن — التوبة 40' },
  { name: 'عمر بن الخطاب',      nameEn: 'Umar ibn al-Khattab',    icon: '⚔️', title: 'الفاروق · الخليفة الثاني',        quote: 'كنا أذلة فأعزنا الله بالإسلام.',                                     quoteEn: 'We were humiliated and Allah honored us with Islam.',               source: 'عمر بن الخطاب ؓ' },
  { name: 'عثمان بن عفان',      nameEn: 'Uthman ibn Affan',       icon: '📜', title: 'ذو النورين · الخليفة الثالث',     quote: 'ما ضرّ عثمان ما عمل بعد اليوم.',                                     quoteEn: 'Nothing will harm Uthman after what he has done today.',            source: 'النبي ﷺ' },
  { name: 'علي بن أبي طالب',    nameEn: 'Ali ibn Abi Talib',      icon: '🌟', title: 'أمير المؤمنين · الخليفة الرابع', quote: 'الناس نيام، فإذا ماتوا انتبهوا.',                                    quoteEn: 'People are asleep; when they die, they wake up.',                   source: 'علي بن أبي طالب ؓ' },
  { name: 'خالد بن الوليد',     nameEn: 'Khalid ibn al-Walid',    icon: '🗡️', title: 'سيف الله المسلول',                quote: 'ما من ليلة أحب إليّ من ليلة باردة في سرية غازية.',                   quoteEn: 'No night is more beloved to me than a cold night in a raiding party.', source: 'خالد بن الوليد ؓ' },
  { name: 'أبو هريرة',          nameEn: 'Abu Hurairah',           icon: '📚', title: 'راوي الحديث الأكبر',              quote: 'إن كنت لأسأل عن الحديث الواحد ثلاثين من أصحاب النبي ﷺ.',           quoteEn: 'I would ask thirty companions about a single hadith.',              source: 'أبو هريرة ؓ' },
  { name: 'عبدالله بن مسعود',   nameEn: 'Abdullah ibn Masud',     icon: '🕌', title: 'حبر القرآن',                      quote: 'من أراد العلم فليُثِرِ القرآن.',                                     quoteEn: 'Whoever wants knowledge, let him stir the Quran.',                  source: 'ابن مسعود ؓ' },
  { name: 'بلال بن رباح',       nameEn: 'Bilal ibn Rabah',        icon: '🌙', title: 'أول مؤذن في الإسلام',             quote: 'أحد، أحد.',                                                          quoteEn: 'One, One. (He is One)',                                            source: 'كلماته تحت التعذيب' },
  { name: 'معاذ بن جبل',        nameEn: "Mu'adh ibn Jabal",       icon: '⚖️', title: 'أعلم الأمة بالحلال والحرام',      quote: 'إني لأحب الموت لثلاث: لقاء الله، ولقاء نبيه، ولقاء الصالحين.',    quoteEn: 'I love death for three: meeting Allah, His Prophet, and the righteous.', source: 'معاذ بن جبل ؓ' },
  { name: 'سلمان الفارسي',      nameEn: 'Salman al-Farisi',       icon: '🌍', title: 'الباحث عن الحق',                  quote: 'سلمان منا أهل البيت.',                                               quoteEn: 'Salman is from us, the household.',                                source: 'النبي ﷺ' },
  { name: 'أبو ذر الغفاري',     nameEn: 'Abu Dharr al-Ghifari',   icon: '🌿', title: 'صادق اللسان · الزاهد',            quote: 'وددت أني شجرة تُعضد.',                                               quoteEn: 'I wish I were a tree that is cut down.',                           source: 'أبو ذر الغفاري ؓ' },
  { name: 'عائشة بنت أبي بكر', nameEn: 'Aisha bint Abi Bakr',    icon: '💎', title: 'أم المؤمنين',                     quote: 'توفي رسول الله ﷺ وهو على صدري.',                                     quoteEn: 'The Messenger of Allah ﷺ passed away while resting on my chest.',  source: 'عائشة رضي الله عنها' },
  { name: 'أنس بن مالك',        nameEn: 'Anas ibn Malik',         icon: '🌸', title: 'خادم رسول الله',                  quote: 'ما قال لي أفٍّ قط، ولا قال: لِمَ فعلته؟',                           quoteEn: 'He never said "uff" to me, nor asked: "Why did you do that?"',     source: 'أنس عن النبي ﷺ' },
  { name: 'عبدالله بن عباس',    nameEn: 'Abdullah ibn Abbas',     icon: '📖', title: 'حبر الأمة · ترجمان القرآن',       quote: 'اللهم فقّهه في الدين وعلّمه التأويل.',                               quoteEn: 'O Allah, grant him deep understanding and teach him interpretation.', source: 'دعاء النبي ﷺ' },
  { name: 'أبو عبيدة بن الجراح',nameEn: 'Abu Ubaydah ibn al-Jarrah', icon: '🛡️', title: 'أمين هذه الأمة',             quote: 'لكل أمة أمين، وإن أميننا أبو عبيدة بن الجراح.',                     quoteEn: 'Every nation has a trustee, and ours is Abu Ubaydah.',             source: 'النبي ﷺ' },
]

const companionOfDay = SAHABA[Math.floor(Date.now() / 86400000) % SAHABA.length]

const quickCards = [
  { to: '/quran',        icon: '📖', ar: 'القرآن الكريم',  en: 'Quran',        descAr: 'اقرأ واستمع وضع إشارات مرجعية', descEn: 'Read, listen & bookmark verses',     bg: 'from-emerald-600 to-emerald-800' },
  { to: '/prayer-times', icon: '🕌', ar: 'أوقات الصلاة',   en: 'Prayer Times', descAr: 'أوقات تلقائية وعداد تنازلي',     descEn: 'Auto-detected times & countdown',    bg: 'from-teal-600 to-teal-800' },
  { to: '/qibla',        icon: '🧭', ar: 'القبلة',          en: 'Qibla',        descAr: 'اتجاه البوصلة نحو مكة المكرمة',  descEn: 'Compass direction toward Mecca',     bg: 'from-amber-600 to-amber-800' },
  { to: '/tasbeeh',      icon: '📿', ar: 'التسبيح',         en: 'Tasbeeh',      descAr: 'عداد الذكر بعبارات مختارة',      descEn: 'Dhikr counter with preset phrases',  bg: 'from-violet-600 to-violet-800' },
  { to: '/dua',          icon: '🤲', ar: 'أذكار',           en: 'Adhkar',       descAr: 'أدعية مأثورة من القرآن والسنة',   descEn: 'Authentic duas from Quran & Sunnah', bg: 'from-rose-600 to-rose-800' },
  { to: '/sahaba',       icon: '⭐', ar: 'الصحابة الكرام',  en: 'Sahaba',       descAr: 'سير وأقوال صحابة رسول الله ﷺ',    descEn: 'Lives & quotes of the companions',   bg: 'from-amber-500 to-amber-700' },
]

export default function Home() {
  const [verse, setVerse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  useEffect(() => {
    quranApi.getVerseOfDay()
      .then(setVerse)
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 text-white">
        <GeometricPattern className="absolute -top-10 -right-10 w-64 h-64 text-gold-400 rotate-12" />
        <GeometricPattern className="absolute -bottom-16 -left-16 w-80 h-80 text-emerald-400" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
          <p className="text-gold-300 font-arabic text-2xl mb-2 tracking-wide">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-1 font-arabic">
            <span className="text-gold-300">نور اليقين</span>
          </h1>
          <p className="text-emerald-200 text-xl font-semibold mb-1 tracking-wide">Noor Al-Yaqeen</p>
          <p className="text-emerald-300 text-sm mb-1">Your daily Islamic companion</p>
          <p className="text-emerald-400 text-sm font-arabic mb-10">رفيقك الإسلامي اليومي</p>

          {/* Cards row */}
          <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">

          {/* Verse of the day */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 sm:p-8 text-left shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-gold-300 text-xl">✨</span>
                <span className="text-gold-300 font-semibold text-sm uppercase tracking-widest">Verse of the Day</span>
              </div>
              <span className="text-gold-400 font-arabic text-sm">آية اليوم</span>
            </div>

            {loading && (
              <div className="animate-pulse space-y-3">
                <div className="h-8 bg-white/20 rounded-lg" />
                <div className="h-4 bg-white/15 rounded-lg w-3/4" />
              </div>
            )}

            {err && (
              <div>
                <p className="text-red-300 text-sm">Could not load verse. Please check your connection.</p>
                <p className="text-red-400 text-xs font-arabic mt-1">تعذّر تحميل الآية. تحقق من اتصالك.</p>
              </div>
            )}

            {verse && !loading && (
              <>
                <p className="font-arabic text-2xl sm:text-3xl text-right leading-loose text-white mb-4 arabic">
                  {verse.arabic.text}
                </p>
                <p className="text-emerald-200 text-sm sm:text-base italic leading-relaxed mb-3">
                  "{verse.english.text}"
                </p>
                <p className="text-gold-400 text-xs font-medium">
                  — {verse.arabic.surah.englishName} · {verse.arabic.surah.name}، الآية {verse.arabic.numberInSurah}
                </p>
              </>
            )}
          </div>

          {/* Companion of the Day */}
          <Link to="/sahaba" className="bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-gold-400/50 p-6 sm:p-8 text-left shadow-xl transition-all duration-200 group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-gold-300 text-xl">⭐</span>
                <span className="text-gold-300 font-semibold text-sm uppercase tracking-widest">Companion of the Day</span>
              </div>
              <span className="text-gold-400 font-arabic text-sm">صحابي اليوم</span>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-4xl">{companionOfDay.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-arabic text-xl font-bold text-white mb-0.5">{companionOfDay.name}</h3>
                <p className="text-gold-300 font-arabic text-xs mb-3">{companionOfDay.title}</p>
                <p className="font-arabic text-base text-right leading-loose text-white/90 border-r-2 border-gold-400 pr-3 arabic">
                  "{companionOfDay.quote}"
                </p>
                <p className="text-emerald-200 text-xs italic mt-2">"{companionOfDay.quoteEn}"</p>
                <p className="text-gold-400 text-xs mt-2">— {companionOfDay.source}</p>
              </div>
            </div>
            <p className="text-xs text-white/50 group-hover:text-gold-300 mt-4 transition-colors">
              عرض جميع الصحابة · View all companions →
            </p>
          </Link>

          </div>{/* end cards row */}
        </div>
      </section>

      {/* Quick access cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="section-title text-center mb-2">
          <span className="text-gold-500 dark:text-gold-400">✦</span> Quick Access <span className="text-gold-500 dark:text-gold-400">✦</span>
        </h2>
        <p className="text-center font-arabic text-emerald-700 dark:text-gold-400 mb-8">وصول سريع</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickCards.map(({ to, icon, ar, en, descAr, descEn, bg }) => (
            <Link
              key={to}
              to={to}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${bg} text-white p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-250`}
            >
              <GeometricPattern className="absolute -right-6 -top-6 w-32 h-32 text-white group-hover:scale-110 transition-transform duration-500" />
              <span className="text-4xl mb-4 block">{icon}</span>
              <h3 className="font-bold text-lg font-arabic mb-0.5">{ar}</h3>
              <p className="text-sm text-white/80 mb-1 tracking-wide">{en}</p>
              <p className="text-xs text-white/70 font-arabic leading-snug mb-0.5">{descAr}</p>
              <p className="text-xs text-white/60 leading-snug">{descEn}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-white/90 group-hover:gap-2 transition-all font-arabic">
                افتح · <span className="font-sans">Open</span> <span>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Hadith banner */}
      <section className="bg-emerald-50 dark:bg-emerald-900/20 border-y border-emerald-200 dark:border-emerald-800 py-10">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-2">
          <p className="text-emerald-700 dark:text-gold-300 font-arabic text-2xl arabic leading-loose">
            "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ"
          </p>
          <p className="text-stone-600 dark:text-stone-300 italic text-sm">
            "Actions are judged by intentions."
          </p>
          <p className="text-stone-400 dark:text-stone-500 text-xs">— Sahih al-Bukhari · صحيح البخاري</p>
        </div>
      </section>
    </div>
  )
}
