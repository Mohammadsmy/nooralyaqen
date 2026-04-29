import { useEffect, useState, useRef } from 'react'
import { useLocation } from '../hooks/useLocation'
import { aladhanApi } from '../utils/api'
import { degreesToCardinal } from '../utils/helpers'

export default function Qibla() {
  const { location, error: locErr, loading: locLoading } = useLocation()
  const [qibla, setQibla] = useState(null)
  const [compass, setCompass] = useState(null)
  const [arrowAngle, setArrowAngle] = useState(0)
  const [manualLat, setManualLat] = useState('')
  const [manualLon, setManualLon] = useState('')
  const [manualErr, setManualErr] = useState('')
  const [loadingQibla, setLoadingQibla] = useState(false)
  const orientationGranted = useRef(false)

  useEffect(() => {
    const lat = location?.lat
    const lon = location?.lon
    if (lat == null || lon == null) return
    fetchQibla(lat, lon)
  }, [location])

  function fetchQibla(lat, lon) {
    setLoadingQibla(true)
    aladhanApi.getQibla(lat, lon)
      .then(res => setQibla(res.data.direction))
      .catch(() => setQibla(null))
      .finally(() => setLoadingQibla(false))
  }

  function handleManual(e) {
    e.preventDefault()
    const lat = parseFloat(manualLat)
    const lon = parseFloat(manualLon)
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setManualErr('Please enter valid coordinates. · يرجى إدخال إحداثيات صحيحة.')
      return
    }
    setManualErr('')
    fetchQibla(lat, lon)
  }

  useEffect(() => {
    function handleOrientation(e) {
      const heading = e.webkitCompassHeading ?? (e.alpha != null ? (360 - e.alpha) : null)
      if (heading != null) {
        setCompass(heading)
        if (qibla != null) setArrowAngle((qibla - heading + 360) % 360)
      }
    }
    if (typeof DeviceOrientationEvent !== 'undefined') {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(s => {
            if (s === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation, true)
              orientationGranted.current = true
            }
          }).catch(() => {})
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true)
        orientationGranted.current = true
      }
    }
    return () => window.removeEventListener('deviceorientation', handleOrientation, true)
  }, [qibla])

  useEffect(() => {
    if (qibla != null && compass != null) setArrowAngle((qibla - compass + 360) % 360)
    else if (qibla != null) setArrowAngle(qibla)
  }, [qibla, compass])

  const loading = locLoading || loadingQibla

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl">🧭</span>
        <div>
          <h1 className="text-2xl font-bold text-emerald-800 dark:text-gold-300">
            Qibla Direction · <span className="font-arabic">اتجاه القبلة</span>
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm">
            Find the direction toward Mecca · <span className="font-arabic">ابحث عن اتجاه مكة المكرمة</span>
          </p>
        </div>
      </div>

      {/* Compass */}
      <div className="card mb-6 flex flex-col items-center py-8">
        {loading ? (
          <div className="w-56 h-56 rounded-full bg-stone-100 dark:bg-emerald-900/50 animate-pulse" />
        ) : (
          <>
            <div className="relative w-56 h-56 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-200 dark:border-emerald-700 bg-stone-50 dark:bg-emerald-900/30 shadow-inner" />
              {['N', 'E', 'S', 'W'].map((d, i) => {
                const angle = i * 90
                const rad = (angle - 90) * (Math.PI / 180)
                const x = 50 + 38 * Math.cos(rad)
                const y = 50 + 38 * Math.sin(rad)
                return (
                  <span
                    key={d}
                    className={`absolute text-xs font-bold ${d === 'N' ? 'text-red-500' : 'text-stone-400 dark:text-stone-500'}`}
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                  >{d}</span>
                )
              })}
              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-500"
                style={{ transform: `rotate(${arrowAngle}deg)` }}
              >
                <div className="flex flex-col items-center" style={{ marginTop: '-28%' }}>
                  <span className="text-2xl">🕋</span>
                  <div className="w-1 bg-gradient-to-b from-gold-500 to-emerald-600 rounded-full" style={{ height: '60px' }} />
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-emerald-600" />
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-emerald-700 dark:bg-gold-400 shadow" />
              </div>
            </div>

            {qibla != null ? (
              <div className="text-center">
                <p className="text-4xl font-bold text-emerald-700 dark:text-gold-300">{Math.round(qibla)}°</p>
                <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
                  {degreesToCardinal(qibla)} · toward Mecca · <span className="font-arabic">نحو مكة المكرمة</span>
                </p>
                {compass != null && (
                  <p className="text-xs text-stone-400 dark:text-stone-500 mt-2">
                    Device heading · <span className="font-arabic">اتجاه الجهاز</span>: {Math.round(compass)}°
                    &nbsp;·&nbsp;
                    Qibla offset · <span className="font-arabic">انحراف القبلة</span>: {Math.round(arrowAngle)}°
                  </p>
                )}
                {compass == null && (
                  <p className="text-xs text-amber-500 dark:text-amber-400 mt-2">
                    ⚠️ No compass sensor · <span className="font-arabic">لا توجد بوصلة</span> — arrow shows direction from North · <span className="font-arabic">السهم يشير من الشمال</span>
                  </p>
                )}
              </div>
            ) : (
              !locErr && (
                <p className="text-stone-400 text-sm text-center">
                  Calculating direction… · <span className="font-arabic">جارٍ الحساب…</span>
                </p>
              )
            )}
          </>
        )}
      </div>

      {/* Manual input */}
      {(locErr || !location) && !locLoading && (
        <div className="card border-l-4 border-l-amber-400">
          <p className="text-amber-600 dark:text-amber-400 font-medium mb-1">
            📍 {locErr || 'Location unavailable'}
          </p>
          <p className="text-amber-500 dark:text-amber-500 text-xs font-arabic mb-3">
            {locErr ? 'خطأ في الموقع' : 'الموقع غير متاح'} — أدخل الإحداثيات يدوياً / Enter coordinates manually
          </p>
          <form onSubmit={handleManual} className="flex flex-col sm:flex-row gap-3">
            <input
              type="number" step="any"
              placeholder="Latitude · خط العرض (e.g. 21.42)"
              value={manualLat}
              onChange={e => setManualLat(e.target.value)}
              className="flex-1 px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-emerald-700 bg-stone-50 dark:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="number" step="any"
              placeholder="Longitude · خط الطول (e.g. 39.82)"
              value={manualLon}
              onChange={e => setManualLon(e.target.value)}
              className="flex-1 px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-emerald-700 bg-stone-50 dark:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Find Qibla · <span className="font-arabic">تحديد القبلة</span>
            </button>
          </form>
          {manualErr && <p className="text-red-500 text-xs mt-2">{manualErr}</p>}
        </div>
      )}

      {/* Info */}
      <div className="card mt-6 text-sm text-stone-500 dark:text-stone-400">
        <p className="font-medium text-stone-700 dark:text-stone-300 mb-1">
          ℹ️ How it works · <span className="font-arabic">كيف يعمل</span>
        </p>
        <ul className="space-y-2 list-disc list-inside">
          <li>
            The arrow points toward the Kaaba in Mecca (21.4225° N, 39.8262° E)
            <p className="font-arabic text-xs mt-0.5 mr-4">السهم يشير نحو الكعبة المشرفة في مكة المكرمة</p>
          </li>
          <li>
            On mobile with a compass, the arrow adjusts to your real-world heading
            <p className="font-arabic text-xs mt-0.5 mr-4">على الجوال بوجود بوصلة، يتكيف السهم مع اتجاهك الفعلي</p>
          </li>
          <li>
            On desktop, the angle is shown from geographic North
            <p className="font-arabic text-xs mt-0.5 mr-4">على الحاسوب، تُعرض الزاوية من الشمال الجغرافي</p>
          </li>
        </ul>
      </div>
    </div>
  )
}
