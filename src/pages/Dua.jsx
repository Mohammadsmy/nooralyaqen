import { useState, useMemo } from 'react'
import { ls } from '../utils/helpers'

const CATEGORIES = [
  { id: 'all',      en: 'All Duas',      ar: 'جميع الأدعية',     icon: '🤲' },
  { id: 'morning',  en: 'Morning',        ar: 'أذكار الصباح',     icon: '🌅' },
  { id: 'evening',  en: 'Evening',        ar: 'أذكار المساء',     icon: '🌆' },
  { id: 'salah',    en: 'Prayer',         ar: 'الصلاة',           icon: '🕌' },
  { id: 'food',     en: 'Food & Drink',   ar: 'الطعام والشراب',   icon: '🍽' },
  { id: 'sleep',    en: 'Sleep',          ar: 'النوم',            icon: '🌙' },
  { id: 'travel',   en: 'Travel',         ar: 'السفر',            icon: '✈️' },
  { id: 'stress',   en: 'Distress',       ar: 'الكرب والهم',      icon: '🫀' },
  { id: 'family',   en: 'Family',         ar: 'الأسرة',           icon: '👨‍👩‍👧' },
  { id: 'forgive',  en: 'Forgiveness',    ar: 'الاستغفار',        icon: '💚' },
  { id: 'quran',    en: 'Quranic',        ar: 'من القرآن',        icon: '📖' },
  { id: 'general',  en: 'General',        ar: 'عامة',             icon: '⭐' },
]

const DUAS = [
  // MORNING
  {
    id: 1, category: 'morning',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: 'Asbahna wa asbahal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah',
    en: 'We have entered the morning and the whole kingdom of Allah has also entered the morning. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.',
    source: 'Abu Dawud',
  },
  {
    id: 2, category: 'morning',
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilaykan-nushur",
    en: 'O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.',
    source: 'Tirmidhi',
  },
  {
    id: 3, category: 'morning',
    arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ — اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    transliteration: "A'udhu billahi minash-shaytanir-rajim — Allahu la ilaha illa huwal-hayyul-qayyum",
    en: 'I seek refuge in Allah from Satan the outcast — Allah! There is no god but He, the Ever-Living, the Self-Sustaining. (Ayatul Kursi)',
    source: 'Quran 2:255',
  },
  // EVENING
  {
    id: 4, category: 'evening',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: 'Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah',
    en: 'We have entered the evening and the whole kingdom of Allah has also entered the evening. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.',
    source: 'Abu Dawud',
  },
  {
    id: 5, category: 'evening',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
    transliteration: 'Allahumma anta rabbi la ilaha illa ant, khalaqtani wa ana abduk, wa ana ala ahdika wa wa\'dika mastata\'t',
    en: 'O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant, and I abide to Your covenant and promise as best I can.',
    source: 'Bukhari — Sayyidul Istighfar',
  },
  // PRAYER
  {
    id: 6, category: 'salah',
    arabic: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ',
    transliteration: "Allahummagh-fir li dhanbi kullahu, diqqahu wa jillahu, wa awwalahu wa akhirahu, wa 'alaniyatahu wa sirrahu",
    en: 'O Allah, forgive me all my sins, the small and the great, the first and the last, the open and the secret.',
    source: 'Muslim',
  },
  {
    id: 7, category: 'salah',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar",
    en: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
    source: 'Quran 2:201',
  },
  {
    id: 8, category: 'salah',
    arabic: 'اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي',
    transliteration: "Allahumma inni zalamtu nafsi zulman kathiran, wa la yaghfirudh-dhunuba illa ant, faghfir li maghfiratan min 'indika warhamni",
    en: 'O Allah, I have greatly wronged myself and no one forgives sins but You. So grant me forgiveness and have mercy on me.',
    source: 'Bukhari & Muslim',
  },
  // FOOD
  {
    id: 9, category: 'food',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    en: 'In the name of Allah. (Said before eating)',
    source: 'Abu Dawud',
  },
  {
    id: 10, category: 'food',
    arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَأَطْعِمْنَا خَيْرًا مِنْهُ',
    transliteration: 'Allahumma barik lana fihi wa at\'imna khayran minh',
    en: 'O Allah, bless it for us and provide us with better than it.',
    source: 'Tirmidhi — after drinking milk',
  },
  {
    id: 11, category: 'food',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    transliteration: "Alhamdulillahil-ladhi at'amana wa saqana wa ja'alana muslimin",
    en: 'All praise is for Allah who fed us, gave us drink, and made us Muslims.',
    source: 'Abu Dawud & Tirmidhi',
  },
  // SLEEP
  {
    id: 12, category: 'sleep',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    en: 'In Your name O Allah, I die and I live.',
    source: 'Bukhari',
  },
  {
    id: 13, category: 'sleep',
    arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
    transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
    en: 'O Allah, protect me from Your punishment on the day You resurrect Your servants.',
    source: 'Abu Dawud & Tirmidhi',
  },
  {
    id: 14, category: 'sleep',
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
    transliteration: 'Subhanakallahumma wa bihamdika, ashhadu an la ilaha illa ant, astaghfiruka wa atubu ilayk',
    en: 'Glory be to You O Allah, and praise be to You. I bear witness that there is no god but You. I seek Your forgiveness and repent to You.',
    source: 'Muslim',
  },
  // TRAVEL
  {
    id: 15, category: 'travel',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration: "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun",
    en: 'Glory be to Him who has subjected this to us, and we were not able to do it. And indeed to our Lord we shall return.',
    source: 'Quran 43:13-14 — when boarding transport',
  },
  {
    id: 16, category: 'travel',
    arabic: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى',
    transliteration: "Allahumma inna nas'aluka fi safarina hadhal-birra wat-taqwa, wa minal-'amali ma tarda",
    en: 'O Allah, we ask You for goodness and piety on this journey, and for deeds that please You.',
    source: 'Muslim',
  },
  // DISTRESS
  {
    id: 17, category: 'stress',
    arabic: 'اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ',
    transliteration: "Allahumma inni 'abduk, ibnu 'abdik, ibnu amatik, nasiyati biyadik, madin fiyya hukmuk, 'adlun fiyya qada'uk",
    en: 'O Allah, I am Your servant, son of Your servant, son of Your maidservant. My forelock is in Your hand, Your command over me is forever executed, Your decree over me is just.',
    source: 'Ahmad — Dua for grief',
  },
  {
    id: 18, category: 'stress',
    arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin',
    en: 'There is no god but You, glorified be You! Indeed I have been of the wrongdoers.',
    source: 'Quran 21:87 — Dua of Yunus (AS)',
  },
  {
    id: 19, category: 'stress',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: 'Hasbunallahu wa ni\'mal-wakil',
    en: 'Allah is sufficient for us, and He is the best Disposer of affairs.',
    source: 'Quran 3:173',
  },
  // FAMILY
  {
    id: 20, category: 'family',
    arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama",
    en: 'Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.',
    source: 'Quran 25:74',
  },
  {
    id: 21, category: 'family',
    arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
    transliteration: "Rabbij-'alni muqimas-salati wa min dhurriyyati, rabbana wa taqabbal du'a'",
    en: 'My Lord, make me an establisher of prayer, and from my descendants. Our Lord, and accept my supplication.',
    source: 'Quran 14:40 — Dua of Ibrahim (AS)',
  },
  // FORGIVENESS
  {
    id: 22, category: 'forgive',
    arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
    transliteration: "Rabbigh-fir li wa tub 'alayya innaka antat-tawwabur-rahim",
    en: 'My Lord, forgive me and accept my repentance. Indeed You are the Accepting of repentance, the Merciful.',
    source: 'Abu Dawud & Tirmidhi',
  },
  {
    id: 23, category: 'forgive',
    arabic: 'اللَّهُمَّ اغْفِرْ لِي خَطِيئَتِي وَجَهْلِي وَإِسْرَافِي فِي أَمْرِي، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي',
    transliteration: "Allahummagh-fir li khati'ati wa jahli wa israfi fi amri, wa ma anta a'lamu bihi minni",
    en: 'O Allah, forgive my sins, my ignorance, my extravagance in my affairs, and what You know about me better than I do.',
    source: 'Bukhari & Muslim',
  },
  // QURANIC
  {
    id: 24, category: 'quran',
    arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ',
    transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana mil ladunka rahmah, innaka antal-wahhab",
    en: 'Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.',
    source: 'Quran 3:8',
  },
  {
    id: 25, category: 'quran',
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    transliteration: "Rabbi zidni 'ilma",
    en: 'My Lord, increase me in knowledge.',
    source: 'Quran 20:114',
  },
  {
    id: 26, category: 'quran',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    transliteration: 'Rabbish-rah li sadri wa yassir li amri',
    en: 'My Lord, expand for me my breast (with assurance) and ease for me my task.',
    source: 'Quran 20:25-26 — Dua of Musa (AS)',
  },
  {
    id: 27, category: 'quran',
    arabic: 'رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    transliteration: "Rabbana ighfir lana dhunubana wa israfana fi amrina wa thabbit aqdamana wansurna 'alal-qawmil-kafirin",
    en: 'Our Lord, forgive us our sins and the excess in our affairs, and plant firmly our feet, and give us victory over the disbelieving people.',
    source: 'Quran 3:147',
  },
  // GENERAL
  {
    id: 28, category: 'general',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
    transliteration: "Allahumma inni as'alukal-'afiyata fid-dunya wal-akhirah",
    en: 'O Allah, I ask You for well-being in this world and the Hereafter.',
    source: 'Abu Dawud',
  },
  {
    id: 29, category: 'general',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    transliteration: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik",
    en: 'O Allah, help me to remember You, to give thanks to You, and to worship You well.',
    source: 'Abu Dawud & Ahmad',
  },
  {
    id: 30, category: 'general',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-jubni wal-bukhl, wa dhala'id-dayni wa ghalabatir-rijal",
    en: 'O Allah, I seek refuge in You from worry, grief, incapacity, laziness, cowardice, miserliness, the burden of debt, and the oppression of men.',
    source: 'Bukhari',
  },
]

export default function Dua() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState(() => ls.get('noorpath-dua-favs', []))
  const [copied, setCopied] = useState(null)
  const [showFavs, setShowFavs] = useState(false)

  const filtered = useMemo(() => {
    let list = showFavs ? DUAS.filter(d => favorites.includes(d.id)) : DUAS
    if (activeCategory !== 'all') list = list.filter(d => d.category === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(d =>
        d.en.toLowerCase().includes(q) ||
        d.arabic.includes(q) ||
        d.transliteration.toLowerCase().includes(q) ||
        d.source.toLowerCase().includes(q)
      )
    }
    return list
  }, [activeCategory, search, favorites, showFavs])

  function toggleFav(id) {
    const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id]
    setFavorites(next)
    ls.set('noorpath-dua-favs', next)
  }

  function copyDua(dua) {
    const text = `${dua.arabic}\n\n${dua.transliteration}\n\n${dua.en}\n\n— ${dua.source}`
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(dua.id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">🤲</span>
        <div>
          <h1 className="text-2xl font-bold text-emerald-800 dark:text-gold-300 font-arabic">
            أذكار · <span className="font-sans">Adhkar</span>
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm">
            Authentic duas from Quran & Sunnah · <span className="font-arabic">أدعية مأثورة من القرآن والسنة</span>
          </p>
        </div>
      </div>

      {/* Search + favs toggle */}
      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Search duas… · ابحث عن دعاء"
          value={search}
          onChange={e => { setSearch(e.target.value); setShowFavs(false) }}
          className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-stone-200 dark:border-emerald-700 bg-white dark:bg-emerald-900/40 text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={() => { setShowFavs(!showFavs); setSearch('') }}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
            showFavs
              ? 'bg-gold-500 border-gold-400 text-stone-900'
              : 'bg-white dark:bg-emerald-900/40 border-stone-200 dark:border-emerald-700 text-stone-600 dark:text-stone-300 hover:border-gold-400'
          }`}
        >
          ❤️ {favorites.length}
        </button>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setShowFavs(false) }}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              activeCategory === cat.id && !showFavs
                ? 'bg-emerald-700 text-white border-emerald-600 shadow-sm'
                : 'bg-white dark:bg-emerald-900/30 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-emerald-700 hover:border-emerald-400'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.en}</span>
            <span className="font-arabic opacity-70">· {cat.ar}</span>
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-xs text-stone-400 dark:text-stone-500 mb-4">
        {filtered.length} {filtered.length === 1 ? 'dua' : 'duas'} · <span className="font-arabic">{filtered.length} دعاء</span>
        {showFavs && <span className="ml-2 text-gold-500">❤️ Favorites · المفضلة</span>}
      </p>

      {/* Duas list */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12 text-stone-400 dark:text-stone-500">
          <p className="text-4xl mb-3">🤲</p>
          <p>No duas found · <span className="font-arabic">لا توجد نتائج</span></p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(dua => {
            const cat = CATEGORIES.find(c => c.id === dua.category)
            const isFav = favorites.includes(dua.id)
            const isCopied = copied === dua.id
            return (
              <div key={dua.id} className="card border-l-4 border-l-emerald-200 dark:border-l-emerald-700 hover:border-l-emerald-500 dark:hover:border-l-gold-500 transition-all animate-slide-up">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-800/50 text-emerald-700 dark:text-gold-400 border border-emerald-200 dark:border-emerald-700">
                    {cat?.icon} {cat?.en} · <span className="font-arabic">{cat?.ar}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyDua(dua)}
                      className={`p-1.5 rounded-lg text-sm transition-colors ${
                        isCopied
                          ? 'bg-emerald-100 dark:bg-emerald-800 text-emerald-600'
                          : 'text-stone-400 hover:text-emerald-600 hover:bg-stone-100 dark:hover:bg-emerald-800'
                      }`}
                      title="Copy · نسخ"
                    >
                      {isCopied ? '✓' : '⧉'}
                    </button>
                    <button
                      onClick={() => toggleFav(dua.id)}
                      className={`p-1.5 rounded-lg text-sm transition-colors ${
                        isFav
                          ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'text-stone-300 hover:text-red-400 hover:bg-stone-100 dark:hover:bg-emerald-800'
                      }`}
                      title={isFav ? 'Remove from favorites · إزالة من المفضلة' : 'Add to favorites · أضف للمفضلة'}
                    >
                      {isFav ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>

                {/* Arabic */}
                <p className="font-arabic text-xl sm:text-2xl text-right leading-loose text-emerald-800 dark:text-gold-300 arabic mb-3">
                  {dua.arabic}
                </p>

                {/* Transliteration */}
                <p className="text-sm text-stone-400 dark:text-stone-500 italic mb-2 leading-relaxed">
                  {dua.transliteration}
                </p>

                {/* Translation */}
                <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed mb-3">
                  {dua.en}
                </p>

                {/* Source */}
                <p className="text-xs text-gold-600 dark:text-gold-500 font-medium">
                  📚 {dua.source}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
