const QURAN_BASE = 'https://api.alquran.cloud/v1'
const ALADHAN_BASE = 'https://api.aladhan.com/v1'

async function get(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return data
}

// Quran API
export const quranApi = {
  getSurahList: () => get(`${QURAN_BASE}/surah`),

  getSurah: (number) =>
    Promise.all([
      get(`${QURAN_BASE}/surah/${number}/ar.mahermuaiqly`),  // Arabic + audio
      get(`${QURAN_BASE}/surah/${number}/en.asad`),         // English translation
      get(`${QURAN_BASE}/surah/${number}/en.transliteration`), // Transliteration
    ]).then(([arabic, english, translit]) => ({
      arabic: arabic.data,
      english: english.data,
      translit: translit.data,
    })),

  getVerseOfDay: () => {
    // Pick a verse based on day of year for consistency
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    )
    const verseNumber = (dayOfYear % 6236) + 1
    return Promise.all([
      get(`${QURAN_BASE}/ayah/${verseNumber}/ar.mahermuaiqly`),
      get(`${QURAN_BASE}/ayah/${verseNumber}/en.asad`),
    ]).then(([ar, en]) => ({ arabic: ar.data, english: en.data }))
  },

  searchSurah: (query) => get(`${QURAN_BASE}/surah`).then(d =>
    d.data.filter(s =>
      s.englishName.toLowerCase().includes(query.toLowerCase()) ||
      s.name.includes(query) ||
      String(s.number).includes(query)
    )
  ),
}

// Aladhan Prayer Times API
export const aladhanApi = {
  getPrayerTimes: (lat, lon, date, method = 5) => {
    const d = date || new Date()
    const dateStr = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
    // method=5: Egyptian General Authority of Survey (matches Lebanon/Levant region)
    // timezonestring derived from browser to ensure times display in local clock
    const tz = encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone)
    return get(
      `${ALADHAN_BASE}/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=${method}&timezonestring=${tz}`
    )
  },

  getQibla: (lat, lon) =>
    get(`${ALADHAN_BASE}/qibla/${lat}/${lon}`),
}
