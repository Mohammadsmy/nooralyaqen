import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { quranApi } from '../utils/api'
import { usePlace } from '../hooks/usePlace'
import { usePrayerTimes } from '../hooks/usePrayerTimes'
import { useNow } from '../hooks/useNow'
import { usePageTitle } from '../hooks/usePageTitle'
import { formatTime, formatCountdown, getNextPrayer, skyPhase, PRAYER_NAMES } from '../utils/helpers'
import { companionOfDay, quoteLabel } from '../data/sahaba'
import PlacePicker from '../components/PlacePicker'
import Icon from '../components/Icon'

// The site is called "light of certainty": the first screen takes the colour of
// the sky at the current prayer time, from the deep blue of Fajr to the night of Isha.
const SKY = {
  fajr:    { bg: '#1d3557', ink: '#f5f5f4', soft: '#c9d4e3', accent: '#fcd34d', btnInk: '#1d3557', dark: true },
  morning: { bg: '#e3edf0', ink: '#022c22', soft: '#33504a', accent: '#065f46', btnInk: '#ffffff', dark: false },
  dhuhr:   { bg: '#f1f4ec', ink: '#022c22', soft: '#3d4d46', accent: '#065f46', btnInk: '#ffffff', dark: false },
  asr:     { bg: '#e6d5ae', ink: '#2b1d07', soft: '#57462a', accent: '#7c2d12', btnInk: '#ffffff', dark: false },
  maghrib: { bg: '#7c2d12', ink: '#fef3c7', soft: '#f6d6b0', accent: '#fcd34d', btnInk: '#7c2d12', dark: true },
  isha:    { bg: '#022c22', ink: '#f5f5f4', soft: '#a9c6ba', accent: '#fcd34d', btnInk: '#022c22', dark: true },
}

const TIMETABLE = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

const TOOLS = [
  { to: '/quran',        ar: 'القرآن الكريم', en: 'Quran',        desc: 'All 114 surahs with recitation, transliteration and translation. Bookmark any verse.' },
  { to: '/prayer-times', ar: 'أوقات الصلاة',  en: 'Prayer times', desc: 'Today’s five prayers for your city, with a countdown to the next one.' },
  { to: '/qibla',        ar: 'القبلة',         en: 'Qibla',        desc: 'The direction of the Kaaba from where you are, with your phone’s compass.' },
  { to: '/tasbeeh',      ar: 'التسبيح',        en: 'Tasbeeh',      desc: 'A dhikr counter for the six common phrases. Counts reset every day.' },
  { to: '/adhkar',       ar: 'الأذكار',        en: 'Adhkar',       desc: 'Morning, evening and everyday supplications, each with its source.' },
  { to: '/sahaba',       ar: 'الصحابة',        en: 'Sahaba',       desc: 'Fifteen companions of the Prophet ﷺ: their lives and their words.' },
]

export default function Home() {
  usePageTitle(null)
  const { place } = usePlace()
  const { data, error: ptError } = usePrayerTimes(place?.lat, place?.lon)
  const now = useNow()
  const [verse, setVerse] = useState(null)
  const [verseErr, setVerseErr] = useState(false)
  const [picking, setPicking] = useState(false)

  useEffect(() => {
    quranApi.getVerseOfDay().then(setVerse).catch(() => setVerseErr(true))
  }, [])
  useEffect(() => { if (place) setPicking(false) }, [place])

  const timings = data?.timings
  const sky = SKY[skyPhase(timings, now)]
  const next = timings ? getNextPrayer(timings) : null
  const companion = companionOfDay(now)
  const label = quoteLabel(companion)

  return (
    <>
      {/* First screen: the name, and the next prayer where the visitor is */}
      <section
        aria-labelledby="site-title"
        style={{ backgroundColor: sky.bg, color: sky.ink, transition: 'background-color 1s' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-14 sm:pt-20 sm:pb-20 grid gap-12 lg:grid-cols-2 lg:items-end">
          <div className="lg:order-2 text-right">
            <h1 id="site-title" lang="ar" dir="rtl" className="font-arabic font-bold leading-none" style={{ fontSize: 'clamp(4.5rem, 13vw, 10rem)' }}>
              نور اليقين
            </h1>
            <p className="mt-4 text-2xl font-semibold">Noor Al-Yaqeen</p>
            <p className="mt-2 text-lg max-w-md ml-auto" style={{ color: sky.soft }}>
              The Quran, today’s prayer times, the Qibla and daily dhikr — in Arabic and English.
            </p>
            <Link
              to="/quran"
              className="mt-8 inline-flex items-center gap-2 min-h-12 px-6 rounded-full font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: sky.accent, color: sky.btnInk }}
            >
              Read the Quran <Icon name="arrow" className="w-4 h-4" />
            </Link>
          </div>

          <div className="lg:order-1">
            {next ? (
              <>
                <p className="text-lg" style={{ color: sky.soft }}>
                  Next prayer in <span className="font-semibold" style={{ color: sky.ink }}>{place.name}</span>
                </p>
                <p className="mt-1 flex items-baseline gap-4 flex-wrap">
                  <span className="text-5xl sm:text-6xl font-bold">{PRAYER_NAMES[next.name].en}</span>
                  <span lang="ar" dir="rtl" className="font-arabic text-4xl sm:text-5xl">{PRAYER_NAMES[next.name].ar}</span>
                </p>
                <p className="mt-2 text-2xl tabular-nums">
                  {formatTime(next.time)} · in {formatCountdown(Math.max(0, Math.floor((next.date - now) / 1000)))}
                </p>
                <ol className="mt-8 grid grid-cols-3 sm:grid-cols-6 gap-x-4 gap-y-3 max-w-xl" aria-label="Today’s prayer times">
                  {TIMETABLE.map(k => (
                    <li key={k} className={k === next.name ? 'font-bold' : ''} style={{ color: k === next.name ? sky.ink : sky.soft }}>
                      <span className="block text-sm">{PRAYER_NAMES[k].en}</span>
                      <span className="block text-lg tabular-nums">{formatTime(timings[k]).replace(' ', ' ')}</span>
                    </li>
                  ))}
                </ol>
                {!picking && (
                  <button type="button" onClick={() => setPicking(true)} className="mt-6 underline underline-offset-4 min-h-11" style={{ color: sky.soft }}>
                    Not in {place.name}? Change city
                  </button>
                )}
              </>
            ) : place ? (
              <p className="text-2xl max-w-md" role="status">
                {ptError
                  ? <>Prayer times for {place.name} could not be loaded. Check your connection, or <button type="button" className="underline min-h-11" onClick={() => setPicking(true)}>choose another city</button>.</>
                  : <>Loading today’s prayer times for {place.name}…</>}
              </p>
            ) : (
              <>
                <p className="text-3xl sm:text-4xl font-bold max-w-md">When is the next prayer where you are?</p>
                <p className="mt-3 text-lg max-w-md" style={{ color: sky.soft }}>
                  Choose your city once; the site remembers it for prayer times and the Qibla.
                </p>
              </>
            )}
            {(!place || picking) && (
              <div className="mt-6">
                <PlacePicker tone={sky.dark ? 'dark' : 'page'} onDone={() => setPicking(false)} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Verse of the day, beside a page of the Blue Qur'an */}
      <section aria-labelledby="verse-title" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 grid gap-12 lg:grid-cols-5 lg:items-center">
        <div className="lg:col-span-3">
          <h2 id="verse-title" className="text-3xl font-bold text-emerald-900 dark:text-gold-200">
            Today’s verse <span lang="ar" dir="rtl" className="font-arabic font-normal text-stone-600 dark:text-stone-300">· آية اليوم</span>
          </h2>
          {verse ? (
            <>
              <p lang="ar" dir="rtl" className="mt-8 font-arabic text-3xl sm:text-4xl leading-[2] text-stone-900 dark:text-stone-50">
                {verse.arabic.text}
              </p>
              <p className="mt-6 text-lg leading-relaxed text-stone-800 dark:text-stone-200">{verse.english.text}</p>
              <p className="mt-4 text-base text-stone-600 dark:text-stone-300">
                <Link to={`/quran/${verse.arabic.surah.number}`} className="underline underline-offset-4 hover:text-emerald-800 dark:hover:text-gold-200">
                  {verse.arabic.surah.englishName} {verse.arabic.surah.number}:{verse.arabic.numberInSurah}
                </Link>
                {' · '}<span lang="ar" dir="rtl" className="font-arabic">{verse.arabic.surah.name}، الآية {verse.arabic.numberInSurah}</span>
              </p>
            </>
          ) : verseErr ? (
            <p className="mt-8 text-lg text-stone-700 dark:text-stone-300">
              Today’s verse could not be loaded. Check your connection, or <Link to="/quran" className="underline">open the Quran</Link>.
            </p>
          ) : (
            <div className="mt-8 space-y-4" aria-hidden="true">
              <div className="h-10 rounded-lg bg-stone-200 dark:bg-emerald-900" />
              <div className="h-10 w-4/5 rounded-lg bg-stone-200 dark:bg-emerald-900" />
              <div className="h-5 w-2/3 rounded-lg bg-stone-200 dark:bg-emerald-900" />
            </div>
          )}
        </div>
        <figure className="lg:col-span-2">
          <img
            src="https://images.metmuseum.org/CRDImages/is/web-large/DP167100.jpg"
            alt="A page of the Blue Qur’an: gold Kufic script on deep blue parchment"
            className="w-full aspect-[4/3] object-cover"
            loading="lazy"
            width="800"
            height="600"
          />
          <figcaption className="mt-3 text-sm text-stone-600 dark:text-stone-300">
            Folio from the Blue Qur’an, North Africa, 9th–10th century. The Metropolitan Museum of Art.
          </figcaption>
        </figure>
      </section>

      {/* Companion of the day */}
      <section aria-labelledby="companion-title" className="bg-emerald-900 text-stone-50 dark:bg-emerald-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 id="companion-title" className="text-3xl font-bold text-gold-200">Companion of the day</h2>
            <p lang="ar" dir="rtl" className="mt-6 font-arabic text-4xl text-right lg:text-left">{companion.name}</p>
            <p className="mt-2 text-lg">{companion.nameEn}</p>
            <p className="mt-1 text-stone-300">{companion.titleEn}</p>
            <Link to="/sahaba" className="mt-8 inline-flex items-center gap-2 min-h-12 px-6 rounded-full bg-white/15 hover:bg-white/25 font-medium">
              All fifteen companions <Icon name="arrow" className="w-4 h-4" />
            </Link>
          </div>
          <blockquote className="lg:col-span-3">
            <p className="text-sm font-semibold text-gold-200">{label.en} · <span lang="ar" dir="rtl" className="font-arabic">{label.ar}</span></p>
            <p lang="ar" dir="rtl" className="mt-4 font-arabic text-3xl leading-[1.9]">{companion.quote}</p>
            <p className="mt-4 text-lg leading-relaxed text-stone-200">{companion.quoteEn}</p>
            <footer className="mt-4 text-stone-300">— {companion.sourceEn}</footer>
          </blockquote>
        </div>
      </section>

      {/* Everything in the app */}
      <section aria-labelledby="tools-title" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <h2 id="tools-title" className="text-3xl font-bold text-emerald-900 dark:text-gold-200">Everything in Noor Al-Yaqeen</h2>
        <ul className="mt-10 grid gap-x-12 gap-y-2 md:grid-cols-2">
          {TOOLS.map(t => (
            <li key={t.to}>
              <Link to={t.to} className="group flex items-start justify-between gap-6 py-5 px-4 -mx-4 rounded-lg hover:bg-stone-100 dark:hover:bg-emerald-900/60">
                <span>
                  <span className="flex items-baseline gap-3">
                    <span className="text-2xl font-semibold text-stone-900 dark:text-stone-50">{t.en}</span>
                    <span lang="ar" dir="rtl" className="font-arabic text-2xl text-emerald-800 dark:text-gold-200">{t.ar}</span>
                  </span>
                  <span className="mt-1 block text-base text-stone-700 dark:text-stone-300">{t.desc}</span>
                </span>
                <Icon name="arrow" className="w-5 h-5 mt-2 shrink-0 text-stone-500 group-hover:text-emerald-800 dark:group-hover:text-gold-200 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
