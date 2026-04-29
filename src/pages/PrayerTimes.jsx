import { useEffect, useState } from 'react'
import { useLocation } from '../hooks/useLocation'
import { usePrayerTimes } from '../hooks/usePrayerTimes'
import { formatTime, formatCountdown, getNextPrayer } from '../utils/helpers'

const PRAYER_ICONS = {
  Fajr: '🌅', Sunrise: '🌄', Dhuhr: '☀️', Asr: '🌤', Maghrib: '🌇', Isha: '🌙',
}

const PRAYER_NAMES = {
  Fajr:    { en: 'Fajr',    ar: 'الفجر'  },
  Sunrise: { en: 'Sunrise', ar: 'الشروق' },
  Dhuhr:   { en: 'Dhuhr',   ar: 'الظهر'  },
  Asr:     { en: 'Asr',     ar: 'العصر'  },
  Maghrib: { en: 'Maghrib', ar: 'المغرب' },
  Isha:    { en: 'Isha',    ar: 'العشاء' },
}

const PRAYER_DISPLAY = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

export default function PrayerTimes() {
  const { location, error: locErr, loading: locLoading } = useLocation()
  const { data, loading: ptLoading, error: ptErr } = usePrayerTimes(
    location?.lat, location?.lon
  )
  const [now, setNow] = useState(new Date())
  const [next, setNext] = useState(null)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!data?.timings) return
    const n = getNextPrayer(data.timings)
    setNext(n)
    setCountdown(Math.max(0, Math.floor((n.date - now) / 1000)))
  }, [data, now])

  const loading = locLoading || ptLoading

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl">🕌</span>
        <div>
          <h1 className="text-2xl font-bold text-emerald-800 dark:text-gold-300">
            Prayer Times · <span className="font-arabic">أوقات الصلاة</span>
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm">
            Based on your current location · <span className="font-arabic">بناءً على موقعك الحالي</span>
          </p>
        </div>
      </div>

      {locErr && (
        <div className="card border-l-4 border-l-red-400 mb-6">
          <p className="text-red-600 dark:text-red-400 font-medium">
            📍 Location Error · <span className="font-arabic">خطأ في الموقع</span>
          </p>
          <p className="text-stone-500 text-sm mt-1">{locErr}</p>
          <p className="text-stone-400 text-xs mt-1">
            Please allow location access to view accurate prayer times.
          </p>
          <p className="text-stone-400 text-xs font-arabic mt-0.5">
            يرجى السماح بالوصول إلى الموقع لعرض أوقات الصلاة الدقيقة.
          </p>
        </div>
      )}

      {ptErr && (
        <div className="card border-l-4 border-l-red-400 mb-6">
          <p className="text-red-600 dark:text-red-400 font-medium">
            ⚠️ Could not fetch prayer times · <span className="font-arabic">تعذّر جلب أوقات الصلاة</span>
          </p>
          <p className="text-stone-500 text-sm mt-1">{ptErr}</p>
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 bg-stone-100 dark:bg-emerald-900/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {data && !loading && (
        <>
          {/* Date card */}
          <div className="card mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400">Gregorian · <span className="font-arabic">الميلادي</span></p>
              <p className="font-semibold text-stone-800 dark:text-stone-100">{data.date.readable}</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-stone-200 dark:bg-emerald-800" />
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400">Hijri · <span className="font-arabic">الهجري</span></p>
              <p className="font-semibold text-emerald-700 dark:text-gold-300 font-arabic text-lg">
                {data.date.hijri.day} {data.date.hijri.month.ar} {data.date.hijri.year} هـ
              </p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-stone-200 dark:bg-emerald-800" />
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400">Method · <span className="font-arabic">الطريقة</span></p>
              <p className="font-semibold text-stone-800 dark:text-stone-100 text-sm">{data.meta.method.name}</p>
            </div>
          </div>

          {/* Next prayer countdown */}
          {next && (
            <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white rounded-2xl p-6 mb-6 shadow-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-emerald-300 text-xs font-medium uppercase tracking-widest">Next Prayer</p>
                <p className="text-emerald-400 text-xs font-arabic">الصلاة القادمة</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{PRAYER_ICONS[next.name]}</span>
                  <div>
                    <p className="text-2xl font-bold">{PRAYER_NAMES[next.name].en}</p>
                    <p className="text-lg font-arabic text-gold-300">{PRAYER_NAMES[next.name].ar}</p>
                    <p className="text-emerald-300 text-sm">{formatTime(next.time)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-emerald-400 mb-0.5">Time remaining</p>
                  <p className="text-xs text-emerald-500 font-arabic mb-1">الوقت المتبقي</p>
                  <p className="text-3xl font-bold font-mono tabular-nums">{formatCountdown(countdown)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Prayer list */}
          <div className="space-y-3">
            {PRAYER_DISPLAY.map(name => {
              const time = data.timings[name]
              const isNext = next?.name === name
              const names = PRAYER_NAMES[name]
              return (
                <div
                  key={name}
                  className={`card flex items-center justify-between transition-all ${
                    isNext ? 'border-emerald-400 dark:border-gold-500 bg-emerald-50 dark:bg-emerald-800/50 shadow-md' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{PRAYER_ICONS[name]}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold ${isNext ? 'text-emerald-700 dark:text-gold-300' : 'text-stone-700 dark:text-stone-200'}`}>
                          {names.en}
                        </p>
                        {isNext && (
                          <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                            Next · <span className="font-arabic">التالية</span>
                          </span>
                        )}
                      </div>
                      <p className={`text-sm font-arabic ${isNext ? 'text-emerald-600 dark:text-gold-400' : 'text-stone-400 dark:text-stone-500'}`}>
                        {names.ar}
                      </p>
                    </div>
                  </div>
                  <p className={`font-bold text-lg tabular-nums ${isNext ? 'text-emerald-700 dark:text-gold-300' : 'text-stone-600 dark:text-stone-300'}`}>
                    {formatTime(time)}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Current time */}
          <div className="mt-6 text-center text-stone-400 dark:text-stone-500 text-sm">
            <span>Current time · <span className="font-arabic">الوقت الحالي</span>: </span>
            <span className="font-mono font-medium text-stone-600 dark:text-stone-300">
              {now.toLocaleTimeString()}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
