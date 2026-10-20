import { useEffect, useRef, useState } from 'react'
import { usePlace } from '../hooks/usePlace'
import { geoApi } from '../utils/api'
import Icon from './Icon'

// Choose where prayer times and the Qibla are calculated for:
// the device's location, or any city by name.
export default function PlacePicker({ onDone, compact = false, tone = 'page' }) {
  const { setPlace, locate, locating, error } = usePlace()
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchErr, setSearchErr] = useState(null)
  const timer = useRef(null)

  useEffect(() => {
    clearTimeout(timer.current)
    if (q.trim().length < 2) { setResults([]); setSearchErr(null); return }
    timer.current = setTimeout(() => {
      setSearching(true)
      geoApi.searchCity(q.trim())
        .then(r => { setResults(r); setSearchErr(r.length ? null : `No city called “${q.trim()}” was found.`) })
        .catch(() => setSearchErr('City search is not reachable right now. Check your connection and try again.'))
        .finally(() => setSearching(false))
    }, 300)
    return () => clearTimeout(timer.current)
  }, [q])

  function choose(r) {
    setPlace({ ...r, source: 'city' })
    setQ('')
    setResults([])
    onDone?.()
  }

  // tone: 'page' follows the site theme; 'light' / 'dark' sit on the home page's sky colour.
  const STYLE = {
    dark: {
      field: 'bg-white/10 text-white placeholder-white/70 border-white/40 focus:border-gold-300',
      button: 'btn-on-dark',
      note: 'text-gold-100', quiet: 'text-white/80',
      list: 'bg-white text-stone-900', row: 'hover:bg-stone-100', region: 'text-stone-600',
    },
    light: {
      field: 'bg-white text-stone-900 placeholder-stone-500 border-stone-400 focus:border-emerald-700',
      button: 'inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded-full bg-stone-900/10 text-stone-900 font-medium hover:bg-stone-900/20 disabled:opacity-60',
      note: 'text-red-800', quiet: 'text-stone-700',
      list: 'bg-white text-stone-900 border border-stone-300', row: 'hover:bg-stone-100', region: 'text-stone-600',
    },
    page: {
      field: 'bg-white dark:bg-emerald-900 text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-400 border-stone-300 dark:border-emerald-700 focus:border-emerald-600 dark:focus:border-gold-400',
      button: 'btn-secondary',
      note: 'text-red-700 dark:text-red-300', quiet: 'text-stone-600 dark:text-stone-300',
      list: 'bg-white dark:bg-emerald-900 border border-stone-200 dark:border-emerald-800',
      row: 'hover:bg-stone-100 dark:hover:bg-emerald-800', region: 'text-stone-600 dark:text-stone-300',
    },
  }
  const st = STYLE[tone] || STYLE.page
  const field = st.field

  return (
    <div className={compact ? '' : 'max-w-md'}>
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="flex-1">
          <span className="sr-only">Search for your city</span>
          <input
            type="search"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search for your city · ابحث عن مدينتك"
            autoComplete="off"
            className={`w-full h-12 px-4 rounded-lg border text-base outline-none ${field}`}
          />
        </label>
        <button
          type="button"
          onClick={locate}
          disabled={locating}
          className={st.button}
        >
          <Icon name="pin" className="w-4 h-4" />
          {locating ? 'Locating…' : 'Use my location'}
        </button>
      </div>

      {(error || searchErr) && (
        <p role="status" className={`mt-3 text-sm ${st.note}`}>
          {searchErr || error}
        </p>
      )}
      {searching && <p className={`mt-3 text-sm ${st.quiet}`}>Searching…</p>}

      {results.length > 0 && (
        <ul className={`mt-2 rounded-lg overflow-hidden ${st.list}`}>
          {results.map(r => (
            <li key={`${r.lat},${r.lon}`}>
              <button
                type="button"
                onClick={() => choose(r)}
                className={`w-full min-h-12 px-4 py-2 text-left focus-visible:bg-stone-100 ${st.row}`}
              >
                <span className="font-medium">{r.name}</span>
                {r.region && <span className={st.region}> · {r.region}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
