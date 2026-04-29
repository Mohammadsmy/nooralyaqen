import { useState } from 'react'
import GeometricPattern from '../components/GeometricPattern'

const SAHABA = [
  {
    id: 1,
    name: 'أبو بكر الصديق',
    nameEn: 'Abu Bakr al-Siddiq',
    title: 'الصدّيق · الخليفة الأول',
    titleEn: 'The Truthful · First Caliph',
    icon: '👑',
    color: 'from-amber-600 to-amber-800',
    quote: 'لا تحزن إن الله معنا.',
    quoteEn: 'Do not grieve; indeed Allah is with us.',
    source: 'القرآن الكريم — التوبة 40',
    sourceEn: 'Quran 9:40',
    bio: 'أول من أسلم من الرجال الأحرار، وأول الخلفاء الراشدين. أنفق كل ماله في سبيل الله، وكان رفيق النبي ﷺ في الهجرة.',
    bioEn: 'First free adult male to embrace Islam and first of the Rightly Guided Caliphs. He spent all his wealth for Islam and was the Prophet\'s ﷺ companion in migration.',
  },
  {
    id: 2,
    name: 'عمر بن الخطاب',
    nameEn: 'Umar ibn al-Khattab',
    title: 'الفاروق · الخليفة الثاني',
    titleEn: 'Al-Faruq · Second Caliph',
    icon: '⚔️',
    color: 'from-emerald-600 to-emerald-800',
    quote: 'كنا أذلة فأعزنا الله بالإسلام، فإن ابتغينا العزة بغيره أذلنا الله.',
    quoteEn: 'We were humiliated and Allah honored us with Islam; if we seek honor in other than it, Allah will humiliate us.',
    source: 'عمر بن الخطاب ؓ',
    sourceEn: 'Umar ibn al-Khattab ؓ',
    bio: 'ثاني الخلفاء الراشدين، فتحت في عهده مصر والشام وفارس والعراق. عُرف بعدله الشديد حتى مع غير المسلمين.',
    bioEn: 'Second Caliph under whom Egypt, Syria, Persia and Iraq were opened to Islam. Known for his extraordinary justice even with non-Muslims.',
  },
  {
    id: 3,
    name: 'عثمان بن عفان',
    nameEn: 'Uthman ibn Affan',
    title: 'ذو النورين · الخليفة الثالث',
    titleEn: 'Dhul-Nurayn · Third Caliph',
    icon: '📜',
    color: 'from-sky-600 to-sky-800',
    quote: 'ما ضرّ عثمان ما عمل بعد اليوم.',
    quoteEn: 'Nothing will harm Uthman after what he has done today.',
    source: 'النبي ﷺ — بعد تجهيز جيش العسرة',
    sourceEn: 'The Prophet ﷺ after Uthman equipped the army of difficulty',
    bio: 'زوّج النبي ﷺ ابنتيه، وجمّع القرآن الكريم في مصحف واحد، وجهّز جيش العسرة بأمواله. لُقّب بذي النورين.',
    bioEn: 'Married two of the Prophet\'s ﷺ daughters, compiled the Quran into one standard copy, and funded the army with his own wealth.',
  },
  {
    id: 4,
    name: 'علي بن أبي طالب',
    nameEn: 'Ali ibn Abi Talib',
    title: 'أمير المؤمنين · الخليفة الرابع',
    titleEn: 'Commander of the Faithful · Fourth Caliph',
    icon: '🌟',
    color: 'from-violet-600 to-violet-800',
    quote: 'الناس نيام، فإذا ماتوا انتبهوا.',
    quoteEn: 'People are asleep; when they die, they wake up.',
    source: 'علي بن أبي طالب ؓ',
    sourceEn: 'Ali ibn Abi Talib ؓ',
    bio: 'ابن عم النبي ﷺ وزوج فاطمة الزهراء، رابع الخلفاء الراشدين. من أعلم الصحابة بالقضاء والفقه.',
    bioEn: 'Cousin of the Prophet ﷺ and husband of Fatimah al-Zahra. Fourth Caliph and one of the most knowledgeable companions in jurisprudence.',
  },
  {
    id: 5,
    name: 'خالد بن الوليد',
    nameEn: 'Khalid ibn al-Walid',
    title: 'سيف الله المسلول',
    titleEn: 'Sword of Allah',
    icon: '🗡️',
    color: 'from-red-600 to-red-800',
    quote: 'ما من ليلة يُهدى إليّ فيها عروس أحب إليّ من ليلة باردة في سرية غازية.',
    quoteEn: 'No night in which I receive a bride is more beloved to me than a cold night in a raiding party.',
    source: 'خالد بن الوليد ؓ',
    sourceEn: 'Khalid ibn al-Walid ؓ',
    bio: 'قائد عسكري لم يُهزم في حياته، لقّبه النبي ﷺ بـ"سيف الله المسلول". قاد الفتوحات في فارس والشام.',
    bioEn: 'Undefeated military commander nicknamed "Sword of Allah" by the Prophet ﷺ. Led conquests in Persia and Syria.',
  },
  {
    id: 6,
    name: 'أبو هريرة',
    nameEn: 'Abu Hurairah',
    title: 'راوي الحديث الأكبر',
    titleEn: 'Greatest Hadith Narrator',
    icon: '📚',
    color: 'from-teal-600 to-teal-800',
    quote: 'إن كنت لأسأل عن الحديث الواحد ثلاثين من أصحاب النبي ﷺ.',
    quoteEn: 'I would ask thirty of the Prophet\'s ﷺ companions about a single hadith.',
    source: 'أبو هريرة ؓ',
    sourceEn: 'Abu Hurairah ؓ',
    bio: 'أكثر الصحابة رواية للحديث النبوي، روى أكثر من 5000 حديث. كرّس حياته لحفظ سنة النبي ﷺ ونشرها.',
    bioEn: 'Narrated more hadiths than any other companion — over 5,000 narrations. Dedicated his life to preserving the Prophet\'s ﷺ Sunnah.',
  },
  {
    id: 7,
    name: 'عبدالله بن مسعود',
    nameEn: 'Abdullah ibn Masud',
    title: 'حامل نعل النبي · حبر القرآن',
    titleEn: 'Bearer of the Prophet\'s Sandals',
    icon: '🕌',
    color: 'from-indigo-600 to-indigo-800',
    quote: 'من أراد العلم فليُثِرِ القرآن، فإن فيه علم الأولين والآخرين.',
    quoteEn: 'Whoever wants knowledge, let him stir the Quran, for in it is the knowledge of the ancients and the later generations.',
    source: 'ابن مسعود ؓ',
    sourceEn: 'Ibn Masud ؓ',
    bio: 'من أعلم الصحابة بالقرآن الكريم وتفسيره. كان من أقرب المقربين للنبي ﷺ وصاحب سره.',
    bioEn: 'Among the most knowledgeable companions in Quran and its interpretation. One of the closest companions to the Prophet ﷺ.',
  },
  {
    id: 8,
    name: 'بلال بن رباح',
    nameEn: 'Bilal ibn Rabah',
    title: 'أول مؤذن في الإسلام',
    titleEn: 'First Muezzin in Islam',
    icon: '🌙',
    color: 'from-stone-600 to-stone-800',
    quote: 'أحد، أحد.',
    quoteEn: 'One, One. (He is One)',
    source: 'كلماته تحت التعذيب',
    sourceEn: 'His words under torture',
    bio: 'عبد حبشي صبر على أشد العذاب في سبيل الله وهو يردد "أحد أحد". اشتراه أبو بكر ؓ وأعتقه. كان أول من رفع الأذان في الإسلام.',
    bioEn: 'An Ethiopian slave who endured the harshest torture repeating "One, One." Abu Bakr ؓ bought and freed him. He became the first to call the adhan in Islam.',
  },
  {
    id: 9,
    name: 'معاذ بن جبل',
    nameEn: "Mu'adh ibn Jabal",
    title: 'أعلم الأمة بالحلال والحرام',
    titleEn: 'Most Knowledgeable in Halal & Haram',
    icon: '⚖️',
    color: 'from-lime-600 to-lime-800',
    quote: 'إني لأحب الموت لثلاث: لقاء الله، ولقاء نبيه، ولقاء الصالحين.',
    quoteEn: 'I love death for three things: meeting Allah, meeting His Prophet, and meeting the righteous.',
    source: 'معاذ بن جبل ؓ',
    sourceEn: "Mu'adh ibn Jabal ؓ",
    bio: 'قال عنه النبي ﷺ: "أعلم أمتي بالحلال والحرام معاذ بن جبل". أرسله النبي ﷺ قاضياً ومعلماً إلى اليمن.',
    bioEn: 'The Prophet ﷺ said: "The most knowledgeable of my nation in halal and haram is Mu\'adh ibn Jabal." He was sent as a judge and teacher to Yemen.',
  },
  {
    id: 10,
    name: 'سلمان الفارسي',
    nameEn: 'Salman al-Farisi',
    title: 'الباحث عن الحق',
    titleEn: 'The Seeker of Truth',
    icon: '🌍',
    color: 'from-orange-600 to-orange-800',
    quote: 'سلمان منا أهل البيت.',
    quoteEn: 'Salman is from us, the household.',
    source: 'النبي ﷺ',
    sourceEn: 'The Prophet ﷺ',
    bio: 'رحل من فارس طلباً للحق، وخدم عدة رهبان حتى وصل إلى المدينة وأسلم. اقترح حفر الخندق في غزوة الأحزاب.',
    bioEn: 'Traveled from Persia seeking the truth, serving several monks until he reached Madinah and embraced Islam. Suggested digging the trench in the Battle of the Trench.',
  },
  {
    id: 11,
    name: 'أبو ذر الغفاري',
    nameEn: 'Abu Dharr al-Ghifari',
    title: 'صادق اللسان · الزاهد',
    titleEn: 'Truthful Tongue · The Ascetic',
    icon: '🌿',
    color: 'from-green-700 to-green-900',
    quote: 'وددت أني شجرة تُعضد.',
    quoteEn: 'I wish I were a tree that is cut down.',
    source: 'أبو ذر الغفاري ؓ',
    sourceEn: 'Abu Dharr al-Ghifari ؓ',
    bio: 'من أشد الصحابة زهداً في الدنيا وصدقاً مع الله. قال عنه النبي ﷺ: "ما أظلت الخضراء ولا أقلّت الغبراء من ذي لهجة أصدق من أبي ذر".',
    bioEn: 'Among the most ascetic and truthful companions. The Prophet ﷺ said: "The sky has not shaded, nor the earth supported, a man more truthful than Abu Dharr."',
  },
  {
    id: 12,
    name: 'عائشة بنت أبي بكر',
    nameEn: 'Aisha bint Abi Bakr',
    title: 'أم المؤمنين · حبيبة النبي',
    titleEn: 'Mother of the Believers',
    icon: '💎',
    color: 'from-pink-600 to-pink-800',
    quote: 'توفي رسول الله ﷺ وهو على صدري.',
    quoteEn: 'The Messenger of Allah ﷺ passed away while he was resting on my chest.',
    source: 'عائشة رضي الله عنها',
    sourceEn: 'Aisha, may Allah be pleased with her',
    bio: 'أم المؤمنين وزوج النبي ﷺ المحبوبة. أكثر النساء رواية للحديث وأعلمهن بالفقه. كان الصحابة يسألونها عن أحوال النبي ﷺ الخاصة.',
    bioEn: 'Mother of the Believers and beloved wife of the Prophet ﷺ. She narrated the most hadiths among women and was most knowledgeable in Islamic jurisprudence.',
  },
  {
    id: 13,
    name: 'أنس بن مالك',
    nameEn: 'Anas ibn Malik',
    title: 'خادم رسول الله',
    titleEn: 'Servant of the Messenger of Allah',
    icon: '🌸',
    color: 'from-cyan-600 to-cyan-800',
    quote: 'ما قال لي أفٍّ قط، ولا قال لشيء فعلته: لِمَ فعلته؟',
    quoteEn: 'He never said "uff" to me, nor asked about anything I did: "Why did you do that?"',
    source: 'أنس عن النبي ﷺ',
    sourceEn: 'Anas about the Prophet ﷺ',
    bio: 'خدم النبي ﷺ عشر سنوات منذ كان طفلاً، ودعا له النبي بالبركة. روى الكثير من الأحاديث عن سيرة النبي ﷺ الخاصة.',
    bioEn: 'Served the Prophet ﷺ for ten years from childhood. The Prophet ﷺ prayed for his blessings. Narrated many hadiths about the Prophet\'s ﷺ personal life.',
  },
  {
    id: 14,
    name: 'عبدالله بن عباس',
    nameEn: 'Abdullah ibn Abbas',
    title: 'حبر الأمة · ترجمان القرآن',
    titleEn: 'Scholar of the Nation · Interpreter of the Quran',
    icon: '📖',
    color: 'from-purple-600 to-purple-800',
    quote: 'اللهم فقّهه في الدين وعلّمه التأويل.',
    quoteEn: 'O Allah, grant him deep understanding of the religion and teach him the interpretation.',
    source: 'دعاء النبي ﷺ لابن عباس',
    sourceEn: "The Prophet's ﷺ supplication for Ibn Abbas",
    bio: 'ابن عم النبي ﷺ، دعا له النبي بالعلم وهو صغير فكان أعلم الصحابة بتفسير القرآن. لُقّب بـ"حبر الأمة" و"ترجمان القرآن".',
    bioEn: 'Cousin of the Prophet ﷺ. The Prophet prayed for his knowledge when he was young. He became the most knowledgeable companion in Quranic interpretation.',
  },
  {
    id: 15,
    name: 'أبو عبيدة بن الجراح',
    nameEn: 'Abu Ubaydah ibn al-Jarrah',
    title: 'أمين هذه الأمة',
    titleEn: 'Trustee of This Nation',
    icon: '🛡️',
    color: 'from-blue-600 to-blue-800',
    quote: 'لكل أمة أمين، وإن أميننا أيتها الأمة أبو عبيدة بن الجراح.',
    quoteEn: 'Every nation has a trustee, and the trustee of this nation is Abu Ubaydah ibn al-Jarrah.',
    source: 'النبي ﷺ',
    sourceEn: 'The Prophet ﷺ',
    bio: 'أحد العشرة المبشرين بالجنة. قاد الجيوش الإسلامية في فتح الشام، وعُرف بحلمه وتواضعه الشديد.',
    bioEn: 'One of the ten companions promised Paradise. Led Islamic armies in the conquest of Syria. Known for his immense patience and humility.',
  },
]

// Companion of the day — rotates daily
const todayIndex = Math.floor(Date.now() / 86400000) % SAHABA.length
const companionOfDay = SAHABA[todayIndex]

export default function Sahaba() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = SAHABA.filter(s =>
    s.name.includes(search) ||
    s.nameEn.toLowerCase().includes(search.toLowerCase()) ||
    s.titleEn.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade-in">

      {/* Hero — Companion of the Day */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 text-white">
        <GeometricPattern className="absolute -top-10 -right-10 w-64 h-64 text-gold-400 rotate-12" />
        <GeometricPattern className="absolute -bottom-16 -left-16 w-80 h-80 text-emerald-400" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-gold-300 font-arabic text-lg mb-2 tracking-wide">رضي الله عنهم</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-1 font-arabic">
            <span className="text-gold-300">الصحابة الكرام</span>
          </h1>
          <p className="text-emerald-200 text-xl font-semibold mb-6 tracking-wide">The Noble Companions</p>

          {/* Companion of the Day Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 sm:p-8 text-left max-w-2xl mx-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-gold-300 text-xl">⭐</span>
                <span className="text-gold-300 font-semibold text-sm uppercase tracking-widest">Companion of the Day</span>
              </div>
              <span className="text-gold-400 font-arabic text-sm">صحابي اليوم</span>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-5xl">{companionOfDay.icon}</span>
              <div className="flex-1">
                <h2 className="font-arabic text-2xl sm:text-3xl text-white font-bold mb-1">{companionOfDay.name}</h2>
                <p className="text-gold-300 font-arabic text-sm mb-3">{companionOfDay.title}</p>
                <p className="font-arabic text-lg text-right leading-loose text-white/90 mb-3 arabic border-r-2 border-gold-400 pr-4">
                  "{companionOfDay.quote}"
                </p>
                <p className="text-emerald-200 text-sm italic leading-relaxed mb-2">
                  "{companionOfDay.quoteEn}"
                </p>
                <p className="text-gold-400 text-xs">— {companionOfDay.source}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search companion... | ابحث عن صحابي"
              className="w-full px-4 py-3 pl-10 rounded-xl border border-stone-300 dark:border-emerald-700 bg-white dark:bg-emerald-900/40 text-stone-800 dark:text-white placeholder-stone-400 dark:placeholder-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
            <span className="absolute left-3 top-3.5 text-stone-400">🔍</span>
          </div>
        </div>
      </section>

      {/* Companions Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="section-title text-center mb-2">
          <span className="text-gold-500 dark:text-gold-400">✦</span> All Companions <span className="text-gold-500 dark:text-gold-400">✦</span>
        </h2>
        <p className="text-center font-arabic text-emerald-700 dark:text-gold-400 mb-8">جميع الصحابة</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(s => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className="text-left group relative overflow-hidden rounded-2xl bg-white dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-gold-500 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Color strip */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${s.color}`} />

              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{s.icon}</span>
                  <div>
                    <h3 className="font-arabic text-lg font-bold text-stone-800 dark:text-white">{s.name}</h3>
                    <p className="text-xs text-stone-500 dark:text-emerald-400 tracking-wide">{s.nameEn}</p>
                    <p className="font-arabic text-xs text-emerald-700 dark:text-gold-400 mt-0.5">{s.title}</p>
                  </div>
                </div>

                <p className="font-arabic text-sm text-stone-700 dark:text-stone-300 text-right leading-relaxed border-r-2 border-gold-400 pr-3 line-clamp-2 arabic">
                  "{s.quote}"
                </p>

                <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium group-hover:text-gold-500 dark:group-hover:text-gold-400 transition-colors">
                  اقرأ المزيد · Read more →
                </p>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-stone-400 dark:text-emerald-600">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-arabic text-lg">لا نتائج · No results found</p>
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white dark:bg-emerald-950 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header gradient */}
            <div className={`bg-gradient-to-r ${selected.color} p-6 text-white`}>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white text-xl"
              >✕</button>
              <div className="flex items-center gap-4">
                <span className="text-5xl">{selected.icon}</span>
                <div>
                  <h2 className="font-arabic text-2xl font-bold">{selected.name}</h2>
                  <p className="text-white/80 text-sm">{selected.nameEn}</p>
                  <p className="font-arabic text-sm text-white/90 mt-1">{selected.title}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Quote */}
              <div className="bg-emerald-50 dark:bg-emerald-900/40 rounded-xl p-4 border-r-4 border-gold-400">
                <p className="font-arabic text-xl text-right leading-loose text-stone-800 dark:text-white mb-2 arabic">
                  "{selected.quote}"
                </p>
                <p className="text-stone-600 dark:text-stone-300 text-sm italic">
                  "{selected.quoteEn}"
                </p>
                <p className="text-gold-600 dark:text-gold-400 text-xs mt-2 font-medium">— {selected.source}</p>
              </div>

              {/* Bio */}
              <div>
                <h4 className="text-xs font-semibold text-stone-400 dark:text-emerald-500 uppercase tracking-widest mb-2">نبذة · Biography</h4>
                <p className="font-arabic text-right text-stone-700 dark:text-stone-300 leading-loose arabic">{selected.bio}</p>
                <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">{selected.bioEn}</p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
              >
                رضي الله عنه · Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
