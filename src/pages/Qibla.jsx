import { useEffect, useState } from 'react'
import { usePlace } from '../hooks/usePlace'
import { usePageTitle } from '../hooks/usePageTitle'
import { aladhanApi } from '../utils/api'
import { degreesToCardinal } from '../utils/helpers'
import PlacePicker from '../components/PlacePicker'

export default function Qibla() {
  usePageTitle('Qibla', 'The direction of the Kaaba in Makkah from where you are.')
  const { place } = usePlace()
  const [qibla, setQibla] = useState(null)
  const [qiblaErr, setQiblaErr] = useState(false)
  const [loading, setLoading] = useState(false)
  const [heading, setHeading] = useState(null)
  const [needsPermission, setNeedsPermission] = useState(false)
  const [picking, setPicking] = useState(false)
  useEffect(() => { if (place) setPicking(false) }, [place])

  useEffect(() => {
    if (!place) { setQibla(null); return }
    setLoading(true)
    setQiblaErr(false)
    aladhanApi.getQibla(place.lat, place.lon)
      .then(res => setQibla(res.data.direction))
      .catch(() => { setQibla(null); setQiblaErr(true) })
      .finally(() => setLoading(false))
  }, [place])

  // Compass. iOS asks for permission, which must come from a tap.
  function listen() {
    const onOrient = (e) => {
      const h = e.webkitCompassHeading ?? (e.absolute && e.alpha != null ? 360 - e.alpha : null)
      if (h != null) setHeading(h)
    }
    window.addEventListener('deviceorientationabsolute', onOrient, true)
    window.addEventListener('deviceorientation', onOrient, true)
    return () => {
      window.removeEventListener('deviceorientationabsolute', onOrient, true)
      window.removeEventListener('deviceorientation', onOrient, true)
    }
  }
  useEffect(() => {
    if (typeof DeviceOrientationEvent === 'undefined') return
    if (typeof DeviceOrientationEvent.requestPermission === 'function') { setNeedsPermission(true); return }
    return listen()
  }, [])
  function enableCompass() {
    DeviceOrientationEvent.requestPermission()
      .then(s => { if (s === 'granted') { setNeedsPermission(false); listen() } })
      .catch(() => {})
  }

  const angle = qibla == null ? null : heading == null ? qibla : (qibla - heading + 360) % 360

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="page-title">
        Qibla <span lang="ar" dir="rtl" className="font-arabic font-normal">· القبلة</span>
      </h1>
      <p className="page-sub">
        {place
          ? <>From <strong className="font-semibold">{place.name}</strong>{place.region ? `, ${place.region}` : ''}. {!picking && <button type="button" onClick={() => setPicking(true)} className="underline underline-offset-4 min-h-11">Change city</button>}</>
          : 'Choose your city, or let the site use your location, to find the direction of the Kaaba.'}
      </p>

      {(!place || picking) && (
        <div className="mt-6"><PlacePicker onDone={() => setPicking(false)} /></div>
      )}

      {place && (
        <section aria-label="Compass" className="mt-10 flex flex-col items-center">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-white dark:bg-emerald-900/50 border-2 border-stone-200 dark:border-emerald-800">
            {['N', 'E', 'S', 'W'].map((d, i) => {
              const rad = (i * 90 - 90) * (Math.PI / 180)
              return (
                <span key={d} aria-hidden="true"
                  className={`absolute text-base font-bold ${d === 'N' ? 'text-red-700 dark:text-red-300' : 'text-stone-600 dark:text-stone-300'}`}
                  style={{ left: `${50 + 42 * Math.cos(rad)}%`, top: `${50 + 42 * Math.sin(rad)}%`, transform: 'translate(-50%, -50%)' }}
                >{d}</span>
              )
            })}

            {/* The needle appears only once the direction is known. */}
            {angle != null && (
              <div className="absolute inset-0 transition-transform duration-500" style={{ transform: `rotate(${angle}deg)` }} aria-hidden="true">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <line x1="50" y1="50" x2="50" y2="20" className="stroke-emerald-800 dark:stroke-gold-200" strokeWidth="2.5" strokeLinecap="round" />
                  {/* The Kaaba: a black cube with its gold band */}
                  <rect x="44" y="9" width="12" height="12" fill="#111" />
                  <rect x="44" y="12" width="12" height="2" fill="#d4a017" />
                </svg>
              </div>
            )}
            <span className="absolute left-1/2 top-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-emerald-800 dark:bg-gold-200" aria-hidden="true" />
            {loading && <p className="absolute inset-0 flex items-center justify-center text-stone-600 dark:text-stone-300">Finding the direction…</p>}
          </div>

          {qibla != null && (
            <div className="mt-8 text-center" role="status">
              <p className="text-5xl font-bold text-emerald-900 dark:text-gold-200 tabular-nums">{Math.round(qibla)}°</p>
              <p className="mt-2 text-lg">
                {degreesToCardinal(qibla)} of true north, toward Makkah <span lang="ar" dir="rtl" className="font-arabic">· نحو مكة المكرمة</span>
              </p>
              <p className="mt-3 text-base text-stone-700 dark:text-stone-300 max-w-md">
                {heading != null
                  ? 'Your phone’s compass is on: hold it flat and turn until the Kaaba points straight ahead.'
                  : 'No compass on this device, so the needle is drawn from north. Face north, then turn by the angle above.'}
              </p>
              {needsPermission && heading == null && (
                <button type="button" onClick={enableCompass} className="btn-primary mt-5">Use my phone’s compass</button>
              )}
            </div>
          )}
          {qiblaErr && (
            <p role="alert" className="mt-8 card text-red-800 dark:text-red-200">
              The direction could not be calculated right now. Check your connection and try again.
            </p>
          )}
        </section>
      )}
    </div>
  )
}
