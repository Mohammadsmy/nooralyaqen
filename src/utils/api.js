import { stripBasmala, verseOfDayRef } from './quran'

const QURAN_BASE = 'https://api.alquran.cloud/v1'
const ALADHAN_BASE = 'https://api.aladhan.com/v1'
const GEO_BASE = 'https://geocoding-api.open-meteo.com/v1'

async function get(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

function cleanAyahs(surah) {
  return {
    ...surah,
    ayahs: surah.ayahs.map(a => ({ ...a, text: stripBasmala(a.text, surah.number, a.numberInSurah) })),
  }
}

// Quran API
export const quranApi = {
  getSurahList: () => get(`${QURAN_BASE}/surah`),

  getSurah: (number) =>
    Promise.all([
      get(`${QURAN_BASE}/surah/${number}/ar.mahermuaiqly`),     // Arabic + audio
      get(`${QURAN_BASE}/surah/${number}/en.sahih`),            // Sahih International
      get(`${QURAN_BASE}/surah/${number}/en.transliteration`),
    ]).then(([arabic, english, translit]) => ({
      arabic: cleanAyahs(arabic.data),
      english: english.data,
      translit: translit.data,
    })),

  getVerseOfDay: () =>
    get(`${QURAN_BASE}/ayah/${verseOfDayRef()}/editions/quran-uthmani,en.sahih`).then(d => {
      const [ar, en] = d.data
      return {
        arabic: { ...ar, text: stripBasmala(ar.text, ar.surah.number, ar.numberInSurah) },
        english: en,
      }
    }),
}

// Aladhan Prayer Times API
export const aladhanApi = {
  getPrayerTimes: (lat, lon, date, method = 5) => {
    const d = date || new Date()
    const dateStr = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
    // method=5: Egyptian General Authority of Survey (matches Lebanon/Levant region)
    const tz = encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone)
    return get(
      `${ALADHAN_BASE}/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=${method}&timezonestring=${tz}`
    )
  },

  getQibla: (lat, lon) => get(`${ALADHAN_BASE}/qibla/${lat}/${lon}`),
}

// City search (Open-Meteo geocoding — free, no key)
export const geoApi = {
  searchCity: (name) =>
    get(`${GEO_BASE}/search?name=${encodeURIComponent(name)}&count=6&language=en&format=json`)
      .then(d => (d.results || []).map(r => ({
        name: r.name,
        region: [r.admin1, r.country].filter(Boolean).join(', '),
        lat: r.latitude,
        lon: r.longitude,
      }))),
}
