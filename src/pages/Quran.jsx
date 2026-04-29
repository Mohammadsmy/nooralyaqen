import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { quranApi } from '../utils/api'
import { ls } from '../utils/helpers'

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
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden animate-fade-in">
      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 fixed md:relative z-30 md:z-auto
        w-72 h-full bg-white dark:bg-emerald-950 border-r border-stone-200 dark:border-emerald-800
        flex flex-col transition-transform duration-300
      `}>
        <div className="p-4 border-b border-stone-200 dark:border-emerald-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-emerald-800 dark:text-gold-300">Surahs</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 rounded-lg text-stone-400 hover:text-stone-600"
            >✕</button>
          </div>
          <input
            type="text"
            placeholder="Search surah..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-emerald-700 bg-stone-50 dark:bg-emerald-900 text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-emerald-50 dark:hover:bg-emerald-800/40 transition-colors ${
                      activeSurahId === s.number ? 'bg-emerald-50 dark:bg-emerald-800/60 border-r-2 border-emerald-600' : ''
                    }`}
                  >
                    <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-gold-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {s.number}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">{s.englishName}</p>
                      <p className="text-xs text-stone-400 dark:text-stone-500">{s.numberOfAyahs} verses · {s.revelationType}</p>
                    </div>
                    <span className="ml-auto font-arabic text-sm text-emerald-700 dark:text-gold-400">{s.name}</span>
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
            className="p-2 rounded-lg bg-stone-100 dark:bg-emerald-800 text-stone-600 dark:text-stone-300"
          >
            ☰
          </button>
          <span className="font-semibold text-emerald-800 dark:text-gold-300">
            {surah ? `${surah.arabic.englishName} · ${surah.arabic.name}` : 'Quran'}
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
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-slide-up">
            {/* Surah header */}
            <div className="text-center mb-10 pb-8 border-b border-stone-200 dark:border-emerald-800">
              <h1 className="font-bold text-2xl text-emerald-800 dark:text-gold-300 mb-1">
                {surah.arabic.number}. {surah.arabic.englishName}
              </h1>
              <p className="text-stone-500 dark:text-stone-400 text-sm mb-4">
                {surah.arabic.englishNameTranslation} · {surah.arabic.numberOfAyahs} verses · {surah.arabic.revelationType}
              </p>
              <p className="font-arabic text-3xl text-emerald-700 dark:text-gold-400">{surah.arabic.name}</p>
              {activeSurahId !== 1 && activeSurahId !== 9 && (
                <p className="mt-4 font-arabic text-xl text-stone-500 dark:text-stone-400">
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
                    className={`card border-l-4 ${bmked ? 'border-l-gold-400' : 'border-l-transparent'} hover:border-l-emerald-500 transition-all`}
                  >
                    {/* Verse number + controls */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-gold-300 text-xs font-bold flex items-center justify-center">
                        {ayah.numberInSurah}
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Play button */}
                        <button
                          onClick={() => playVerse(ayah.audio, ayah.numberInSurah)}
                          className={`p-2 rounded-xl text-sm transition-colors ${
                            playingVerse === ayah.numberInSurah
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-100 dark:bg-emerald-800 text-stone-600 dark:text-stone-300 hover:bg-emerald-100 dark:hover:bg-emerald-700'
                          }`}
                          title="Play recitation"
                        >
                          {playingVerse === ayah.numberInSurah ? '⏸' : '▶'}
                        </button>
                        {/* Bookmark */}
                        <button
                          onClick={() => toggleBookmark(surah.arabic.number, ayah.numberInSurah)}
                          className={`p-2 rounded-xl text-sm transition-colors ${
                            bmked
                              ? 'bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400'
                              : 'bg-stone-100 dark:bg-emerald-800 text-stone-400 hover:text-gold-500'
                          }`}
                          title={bmked ? 'Remove bookmark' : 'Bookmark verse'}
                        >
                          {bmked ? '🔖' : '🏷'}
                        </button>
                      </div>
                    </div>

                    {/* Arabic text */}
                    <p className="font-arabic text-2xl sm:text-3xl text-right leading-loose text-stone-800 dark:text-stone-100 arabic mb-3">
                      {ayah.text}
                    </p>

                    {/* Transliteration */}
                    {trAyah && (
                      <p className="text-sm text-stone-400 dark:text-stone-500 italic mb-2 leading-relaxed">
                        {trAyah.text}
                      </p>
                    )}

                    {/* Translation */}
                    {enAyah && (
                      <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
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
