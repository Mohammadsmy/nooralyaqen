import { useEffect, useState } from 'react'
import { usePlace } from '../hooks/usePlace'
import { usePrayerTimes } from '../hooks/usePrayerTimes'
import { useNow } from '../hooks/useNow'
import { usePageTitle } from '../hooks/usePageTitle'
import { formatTime, formatCountdown, getNextPrayer, PRAYER_NAMES } from '../utils/helpers'
import PlacePicker from '../components/PlacePicker'

const PRAYER_DISPLAY = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

export default function PrayerTimes() {
  usePageTitle('Prayer times', 'Today’s prayer times for your city, with a countdown to the next prayer.')
  const { place } = usePlace()
  const { data, loading, error } = usePrayerTimes(place?.lat, place?.lon)
  const now = useNow()
  const [picking, setPicking] = useState(false)
  useEffect(() => { if (place) setPicking(false) }, [place])

  const next = data?.timings ? getNextPrayer(data.timings) : null
  const countdown = next ? Math.max(0, Math.floor((next.date - now) / 1000)) : 0

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="page-title">
        Prayer times <span lang="ar" dir="rtl" className="font-arabic font-normal">· أوقات الصلاة</span>
      </h1>
      <p className="page-sub">
        {place
          ? <>For <strong className="font-semibold">{place.name}</strong>{place.region ? `, ${place.region}` : ''}. {!picking && <button type="button" onClick={() => setPicking(true)} className="underline underline-offset-4 min-h-11">Change city</button>}</>
          : 'Choose your city to see today’s times. The site remembers it.'}
      </p>

      {(!place || picking) && (
        <div className="mt-6">
          <PlacePicker onDone={() => setPicking(false)} />
        </div>
      )}

      {error && (
        <p role="alert" className="mt-8 card text-red-800 dark:text-red-200">
          Prayer times could not be loaded for {place?.name}. Check your connection and try again, or choose another city.
        </p>
      )}

      {loading && (
        <div className="mt-8 space-y-3" aria-hidden="true">
          {PRAYER_DISPLAY.map(k => <div key={k} className="h-16 rounded-lg bg-stone-200 dark:bg-emerald-900" />)}
        </div>
      )}

      {data && !loading && (
        <>
          {next && (
            <section aria-label="Next prayer" className="mt-10 rounded-lg bg-emerald-900 text-white p-6 sm:p-8 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-emerald-100">Next prayer</p>
                <p className="mt-1 flex items-baseline gap-3">
                  <span className="text-4xl font-bold">{PRAYER_NAMES[next.name].en}</span>
                  <span lang="ar" dir="rtl" className="font-arabic text-3xl text-gold-200">{PRAYER_NAMES[next.name].ar}</span>
                </p>
                <p className="mt-1 text-lg text-emerald-100 tabular-nums">{formatTime(next.time)}</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-100">Time left</p>
                <p className="text-5xl font-bold tabular-nums" aria-live="off">{formatCountdown(countdown)}</p>
              </div>
            </section>
          )}

          <ul className="mt-6 divide-y divide-stone-200 dark:divide-emerald-900">
            {PRAYER_DISPLAY.map(name => {
              const isNext = next?.name === name
              return (
                <li key={name} className={`flex items-center justify-between min-h-16 px-4 ${isNext ? 'bg-emerald-50 dark:bg-emerald-900/60 rounded-lg' : ''}`}>
                  <span className="flex items-baseline gap-3">
                    <span className={`text-lg ${isNext ? 'font-bold text-emerald-900 dark:text-gold-200' : 'text-stone-900 dark:text-stone-100'}`}>{PRAYER_NAMES[name].en}</span>
                    <span lang="ar" dir="rtl" className="font-arabic text-lg text-stone-600 dark:text-stone-300">{PRAYER_NAMES[name].ar}</span>
                    {name === 'Sunrise' && <span className="text-sm text-stone-600 dark:text-stone-300">(not a prayer)</span>}
                  </span>
                  <span className={`text-lg tabular-nums ${isNext ? 'font-bold text-emerald-900 dark:text-gold-200' : 'text-stone-800 dark:text-stone-200'}`}>
                    {formatTime(data.timings[name])}
                  </span>
                </li>
              )
            })}
          </ul>

          <dl className="mt-10 grid gap-6 sm:grid-cols-3 text-base">
            <div>
              <dt className="text-sm text-stone-600 dark:text-stone-300">Date</dt>
              <dd className="mt-1 font-medium">{data.date.readable}</dd>
            </div>
            <div>
              <dt className="text-sm text-stone-600 dark:text-stone-300">Hijri date</dt>
              <dd lang="ar" dir="rtl" className="mt-1 font-arabic text-xl text-left">{data.date.hijri.day} {data.date.hijri.month.ar} {data.date.hijri.year} هـ</dd>
            </div>
            <div>
              <dt className="text-sm text-stone-600 dark:text-stone-300">Calculation method</dt>
              <dd className="mt-1 font-medium">{data.meta.method.name}</dd>
            </div>
          </dl>
        </>
      )}
    </div>
  )
}
