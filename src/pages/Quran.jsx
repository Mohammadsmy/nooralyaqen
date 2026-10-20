import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { quranApi } from '../utils/api'
import { ls } from '../utils/helpers'
import { usePageTitle } from '../hooks/usePageTitle'
import Icon from '../components/Icon'

export default function Quran() {
  const { surahId } = useParams()
  const navigate = useNavigate()

  const [surahList, setSurahList] = useState([])
  const [surah, setSurah] = useState(null)
  const [loadingList, setLoadingList] = useState(true)
  const [loadingSurah, setLoadingSurah] = useState(false)
  const [search, setSearch] = useState('')
  const [bookmarks, setBookmarks] = useState(() => ls.get('noorpath-bookmarks', []))
  const [playingVerse, setPlayingVerse] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const audioRef = useRef(null)
  const surahRef = useRef(null)   // always holds latest surah without stale closure
  const activeSurahId = surahId ? Number(surahId) : 1

  useEffect(() => { surahRef.current = surah }, [surah])
  usePageTitle(surah ? `${surah.arabic.englishName} (${surah.arabic.number})` : 'Quran', 'Read and listen to the Quran: all 114 surahs with transliteration and translation.')

  // Load surah list
  useEffect(() => {
    quranApi.getSurahList()
      .then(d => setSurahList(d.data))
      .finally(() => setLoadingList(false))
  }, [])

  // Load selected surah
  useEffect(() => {
    setLoadingSurah(true)
    setSurah(null)
    quranApi.getSurah(activeSurahId)
      .then(setSurah)
      .finally(() => setLoadingSurah(false))
  }, [activeSurahId])

  const filtered = surahList.filter(s =>
    s.englishName.toLowerCase().includes(search.toLowerCase()) ||
    s.name.includes(search) ||
    String(s.number).includes(search)
  )

  function toggleBookmark(surahNum, verseNum) {
    const key = `${surahNum}:${verseNum}`
    const next = bookmarks.includes(key)
      ? bookmarks.filter(b => b !== key)
      : [...bookmarks, key]
    setBookmarks(next)
    ls.set('noorpath-bookmarks', next)
  }

  function isBookmarked(surahNum, verseNum) {
    return bookmarks.includes(`${surahNum}:${verseNum}`)
  }

  function playVerse(audioUrl, verseNum) {
    if (playingVerse === verseNum) {
      audioRef.current?.pause()
      setPlayingVerse(null)
      return
    }
    setPlayingVerse(verseNum)
    if (audioRef.current) {
      audioRef.current.src = audioUrl
      audioRef.current.play().catch(() => {})
    }
  }

  function playNext(currentVerseNum) {
    const s = surahRef.current
    if (!s) return
    const ayahs = s.arabic.ayahs
    const idx = ayahs.findIndex(a => a.numberInSurah === currentVerseNum)
    if (idx === -1 || idx >= ayahs.length - 1) {
      setPlayingVerse(null)
      return
    }
    const next = ayahs[idx + 1]
    setPlayingVerse(next.numberInSurah)
    // scroll the next verse into view
    setTimeout(() => {
      document.getElementById(`verse-${next.numberInSurah}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
    if (audioRef.current) {
      audioRef.current.src = next.audio
      audioRef.current.play().catch(() => {})
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 fixed md:relative z-30 md:z-auto
        w-72 h-full bg-white dark:bg-emerald-950 border-r border-stone-200 dark:border-emerald-800
        flex flex-col transition-transform duration-300
      `}>
        <div className="p-4 border-b border-stone-200 dark:border-emerald-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg text-emerald-900 dark:text-gold-200">Surahs</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden btn-icon"
              aria-label="Close the surah list"
            ><Icon name="close" /></button>
          </div>
          <input
            type="text"
            placeholder="Search by name or number"
            aria-label="Search surahs"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-11 px-3 text-base rounded-lg border border-stone-300 dark:border-emerald-700 bg-stone-50 dark:bg-emerald-900 text-stone-900 dark:text-stone-100"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-10 bg-stone-100 dark:bg-emerald-900/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <ul>
              {filtered.map(s => (
                <li key={s.number}>
                  <button
                    onClick={() => { navigate(`/quran/${s.number}`); setSidebarOpen(false) }}
                    aria-current={activeSurahId === s.number ? 'page' : undefined}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-stone-100 dark:hover:bg-emerald-900 transition-colors ${
                      activeSurahId === s.number ? 'bg-emerald-50 dark:bg-emerald-900' : ''
                    }`}
                  >
                    <span className="w-8 text-right text-sm tabular-nums text-stone-600 dark:text-stone-300 flex-shrink-0">
                      {s.number}
                    </span>
                    <div className="min-w-0">
                      <p className="text-base font-medium text-stone-900 dark:text-stone-100 truncate">{s.englishName}</p>
                      <p className="text-sm text-stone-600 dark:text-stone-300">{s.numberOfAyahs} verses · {s.revelationType}</p>
                    </div>
                    <span lang="ar" dir="rtl" className="ml-auto font-arabic text-lg text-emerald-800 dark:text-gold-200">{s.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <div className="md:hidden sticky top-0 z-10 bg-white dark:bg-emerald-950 border-b border-stone-200 dark:border-emerald-800 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn-secondary"
            aria-expanded={sidebarOpen}
          >
            Surahs
          </button>
          <span className="font-semibold text-emerald-900 dark:text-gold-200 truncate">
            {surah ? surah.arabic.englishName : 'Quran'}
          </span>
        </div>

        {loadingSurah ? (
          <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="h-8 bg-stone-100 dark:bg-emerald-900/50 rounded-xl" />
                <div className="h-4 bg-stone-100 dark:bg-emerald-900/50 rounded-lg w-2/3" />
              </div>
            ))}
          </div>
        ) : surah ? (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
            {/* Surah header */}
            <div className="text-center mb-10 pb-8 border-b border-stone-200 dark:border-emerald-800">
              <h1 className="page-title mb-1">
                {surah.arabic.englishName}
              </h1>
              <p className="text-stone-700 dark:text-stone-300 text-base mb-4">
                Surah {surah.arabic.number} · 
                {surah.arabic.englishNameTranslation} · {surah.arabic.numberOfAyahs} verses · {surah.arabic.revelationType}
              </p>
              <p lang="ar" dir="rtl" className="font-arabic text-4xl text-emerald-800 dark:text-gold-200">{surah.arabic.name}</p>
              {activeSurahId !== 1 && activeSurahId !== 9 && (
                <p lang="ar" dir="rtl" className="mt-6 font-arabic text-2xl text-stone-800 dark:text-stone-200">
                  بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
                </p>
              )}
            </div>

            {/* Verses */}
            <div className="space-y-6">
              {surah.arabic.ayahs.map((ayah, idx) => {
                const enAyah = surah.english.ayahs[idx]
                const trAyah = surah.translit.ayahs[idx]
                const bmked = isBookmarked(surah.arabic.number, ayah.numberInSurah)

                return (
                  <div
                    key={ayah.number}
                    id={`verse-${ayah.numberInSurah}`}
                    className={`card ${bmked ? 'bg-gold-50 dark:bg-emerald-900' : ''}`}
                  >
                    {/* Verse number + controls */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm tabular-nums text-stone-600 dark:text-stone-300" aria-label={`Verse ${ayah.numberInSurah}`}>
                        {ayah.numberInSurah}
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Play button */}
                        <button
                          onClick={() => playVerse(ayah.audio, ayah.numberInSurah)}
                          className={`btn-icon ${playingVerse === ayah.numberInSurah ? 'bg-emerald-800 text-white hover:bg-emerald-700 dark:bg-gold-200 dark:text-emerald-950' : ''}`}
                          aria-label={playingVerse === ayah.numberInSurah ? `Pause verse ${ayah.numberInSurah}` : `Play verse ${ayah.numberInSurah}`}
                        >
                          <Icon name={playingVerse === ayah.numberInSurah ? 'pause' : 'play'} />
                        </button>
                        {/* Bookmark */}
                        <button
                          onClick={() => toggleBookmark(surah.arabic.number, ayah.numberInSurah)}
                          className={`btn-icon ${bmked ? 'text-gold-700 dark:text-gold-200' : ''}`}
                          aria-pressed={bmked}
                          aria-label={bmked ? `Remove bookmark from verse ${ayah.numberInSurah}` : `Bookmark verse ${ayah.numberInSurah}`}
                        >
                          <Icon name="bookmark" filled={bmked} />
                        </button>
                      </div>
                    </div>

                    {/* Arabic text */}
                    <p lang="ar" className="font-arabic text-3xl sm:text-4xl text-right leading-[2] text-stone-900 dark:text-stone-50 arabic mb-4">
                      {ayah.text}
                    </p>

                    {/* Transliteration */}
                    {trAyah && (
                      <p className="text-base text-stone-600 dark:text-stone-300 italic mb-2 leading-relaxed">
                        {trAyah.text}
                      </p>
                    )}

                    {/* Translation */}
                    {enAyah && (
                      <p className="text-stone-900 dark:text-stone-100 text-lg leading-relaxed">
                        {enAyah.text}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={() => playNext(playingVerse)}
        className="hidden"
      />
    </div>
  )
}
