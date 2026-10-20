// AlQuran.cloud prefixes verse 1 of every surah (except Al-Fatiha, where the
// Basmala IS verse 1, and At-Tawba, which has none) with the Basmala.
// The Basmala is not part of those verses, so it must be removed before display.

const BASMALA = ['بسم', 'الله', 'الرحمن', 'الرحيم']

// Remove harakat, Quranic marks and tatweel; normalise alif wasla to alif.
function bare(word) {
  return word
    .replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g, '')
    .replace(/ٱ/g, 'ا')
}

export function stripBasmala(text, surahNumber, numberInSurah) {
  if (!text || numberInSurah !== 1 || surahNumber === 1 || surahNumber === 9) return text
  const words = text.trim().split(/\s+/)
  const head = words.slice(0, 4).map(bare)
  if (BASMALA.every((w, i) => head[i] === w)) return words.slice(4).join(' ')
  return text
}

// Verse of the day: a fixed, reviewed list of complete, self-contained verses
// (no isolated letters like "Alif Lam Mim", no verse that needs its context).
export const DAILY_VERSES = [
  '2:152', '2:153', '2:186', '2:201', '2:286', '3:139', '3:173', '3:200',
  '7:56', '9:51', '10:62', '12:87', '13:28', '14:7', '16:97', '20:114',
  '21:87', '29:69', '39:53', '40:60', '49:13', '50:16', '55:13', '65:3',
  '93:5', '94:5', '94:6', '112:1', '2:255', '3:8', '25:74',
]

export function verseOfDayRef(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0)
  const day = Math.floor((date - start) / 86400000)
  return DAILY_VERSES[day % DAILY_VERSES.length]
}
