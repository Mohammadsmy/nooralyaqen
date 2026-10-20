// Format 24h time string to 12h AM/PM
export function formatTime(timeStr) {
  if (!timeStr) return '--:--'
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

// Seconds → mm:ss or hh:mm:ss
export function formatCountdown(totalSeconds) {
  if (totalSeconds <= 0) return '00:00'
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

// Convert prayer time string to today's Date object
export function prayerTimeToDate(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d
}

// Find the next upcoming prayer from timings object
// Sunrise is shown in the timetable but is not a prayer, so it is never "next".
export function getNextPrayer(timings) {
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
  const now = new Date()
  for (const name of prayers) {
    const t = prayerTimeToDate(timings[name])
    if (t > now) return { name, time: timings[name], date: t }
  }
  // All passed — next is Fajr tomorrow
  const fajr = prayerTimeToDate(timings['Fajr'])
  fajr.setDate(fajr.getDate() + 1)
  return { name: 'Fajr', time: timings['Fajr'], date: fajr }
}

// Degrees to cardinal direction
export function degreesToCardinal(deg) {
  const dirs = ['N','NE','E','SE','S','SW','W','NW']
  return dirs[Math.round(deg / 45) % 8]
}

// LocalStorage helpers
export const ls = {
  get: (key, fallback = null) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
    catch { return fallback }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)) }
    catch {}
  },
}

// Which part of the day it is, by today's prayer times (or the clock as a fallback).
// Drives the colour of the home page: the site's name means "light".
export function skyPhase(timings, now = new Date()) {
  if (timings) {
    const at = (k) => prayerTimeToDate(timings[k])
    if (now < at('Fajr')) return 'isha'
    if (now < at('Sunrise')) return 'fajr'
    if (now < at('Dhuhr')) return 'morning'
    if (now < at('Asr')) return 'dhuhr'
    if (now < at('Maghrib')) return 'asr'
    if (now < at('Isha')) return 'maghrib'
    return 'isha'
  }
  const h = now.getHours() + now.getMinutes() / 60
  if (h < 4.5) return 'isha'
  if (h < 6.5) return 'fajr'
  if (h < 12) return 'morning'
  if (h < 15) return 'dhuhr'
  if (h < 17.5) return 'asr'
  if (h < 19.5) return 'maghrib'
  return 'isha'
}

export const PRAYER_NAMES = {
  Fajr:    { en: 'Fajr',    ar: 'الفجر'  },
  Sunrise: { en: 'Sunrise', ar: 'الشروق' },
  Dhuhr:   { en: 'Dhuhr',   ar: 'الظهر'  },
  Asr:     { en: 'Asr',     ar: 'العصر'  },
  Maghrib: { en: 'Maghrib', ar: 'المغرب' },
  Isha:    { en: 'Isha',    ar: 'العشاء' },
}
