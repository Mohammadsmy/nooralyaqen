import { useEffect, useRef, useState } from 'react'
import { SAHABA, companionOfDay, quoteLabel } from '../data/sahaba'
import { usePageTitle } from '../hooks/usePageTitle'
import Icon from '../components/Icon'

function Quote({ s, size = 'lg' }) {
  const label = quoteLabel(s)
  return (
    <blockquote>
      <p className="text-sm font-semibold text-emerald-800 dark:text-gold-200">
        {label.en} <span lang="ar" dir="rtl" className="font-arabic">· {label.ar}</span>
      </p>
      <p lang="ar" dir="rtl" className={`mt-3 font-arabic leading-[1.9] text-stone-900 dark:text-stone-50 ${size === 'lg' ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>
        {s.quote}
      </p>
      <p className={`mt-3 leading-relaxed text-stone-800 dark:text-stone-200 ${size === 'lg' ? 'text-lg' : 'text-base'}`}>{s.quoteEn}</p>
      <footer className="mt-2 text-sm text-stone-700 dark:text-stone-300">
        — {s.sourceEn} <span lang="ar" dir="rtl" className="font-arabic">· {s.source}</span>
      </footer>
    </blockquote>
  )
}

export default function Sahaba() {
  usePageTitle('Sahaba', 'Fifteen companions of the Prophet ﷺ: their lives and their words, each quote with its source.')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const dialogRef = useRef(null)
  const today = companionOfDay()

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (selected && !d.open) d.showModal()
    if (!selected && d.open) d.close()
  }, [selected])

  const q = search.trim().toLowerCase()
  const filtered = SAHABA.filter(s =>
    !q || s.name.includes(search.trim()) || s.nameEn.toLowerCase().includes(q) || s.titleEn.toLowerCase().includes(q)
  )

  return (
    <>
      <section aria-labelledby="sahaba-title" className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h1 id="sahaba-title" className="page-title">
            The Companions <span lang="ar" dir="rtl" className="font-arabic font-normal">· الصحابة</span>
          </h1>
          <p className="page-sub">
            Fifteen companions of the Prophet ﷺ, <span lang="ar" dir="rtl" className="font-arabic">رضي الله عنهم</span>. Each quote says whose words it is and where it is recorded.
          </p>
        </div>
        <div className="lg:col-span-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/50 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Today: <span lang="ar" dir="rtl" className="font-arabic text-2xl">{today.name}</span> · {today.nameEn}
          </h2>
          <p className="text-stone-700 dark:text-stone-300">{today.titleEn}</p>
          <div className="mt-6"><Quote s={today} /></div>
        </div>
      </section>

      <section aria-labelledby="all-title" className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="all-title" className="text-3xl font-bold text-emerald-900 dark:text-gold-200">All fifteen</h2>
          <label className="w-full sm:w-80">
            <span className="sr-only">Search companions</span>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name · ابحث بالاسم"
              className="w-full h-12 px-4 rounded-lg border border-stone-300 dark:border-emerald-700 bg-white dark:bg-emerald-900/40 text-stone-900 dark:text-stone-100 text-base"
            />
          </label>
        </div>

        <ul className="mt-8 grid gap-x-12 md:grid-cols-2 divide-y divide-stone-200 dark:divide-emerald-900 md:divide-y-0">
          {filtered.map(s => (
            <li key={s.id} className="md:border-b md:border-stone-200 md:dark:border-emerald-900">
              <button
                onClick={() => setSelected(s)}
                className="group w-full text-left py-5 flex items-start justify-between gap-6 hover:bg-stone-100 dark:hover:bg-emerald-900/50 px-3 -mx-3 rounded-lg"
              >
                <span>
                  <span lang="ar" dir="rtl" className="block font-arabic text-2xl text-stone-900 dark:text-stone-50">{s.name}</span>
                  <span className="block text-lg text-stone-900 dark:text-stone-100">{s.nameEn}</span>
                  <span className="block text-base text-stone-700 dark:text-stone-300">{s.titleEn}</span>
                </span>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-emerald-800 dark:text-gold-200 shrink-0">
                  Read <Icon name="arrow" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </li>
          ))}
        </ul>
        {filtered.length === 0 && (
          <p className="mt-8 text-lg text-stone-700 dark:text-stone-300">No companion matches “{search}”. Try the Arabic or English name.</p>
        )}
      </section>

      <dialog
        ref={dialogRef}
        onClose={() => setSelected(null)}
        onClick={e => { if (e.target === dialogRef.current) setSelected(null) }}
        className="w-[min(40rem,calc(100vw-2rem))] max-h-[90vh] rounded-lg p-0 bg-stone-50 dark:bg-emerald-950 text-stone-900 dark:text-stone-100 backdrop:bg-black/60"
        aria-labelledby="companion-name"
      >
        {selected && (
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="companion-name" lang="ar" dir="rtl" className="font-arabic text-3xl">{selected.name}</h2>
                <p className="text-lg">{selected.nameEn}</p>
                <p className="text-stone-700 dark:text-stone-300">{selected.titleEn}</p>
              </div>
              <button onClick={() => setSelected(null)} className="btn-icon shrink-0" aria-label="Close" autoFocus>
                <Icon name="close" />
              </button>
            </div>
            <div className="mt-6"><Quote s={selected} size="md" /></div>
            <h3 className="mt-8 text-lg font-semibold">Life <span lang="ar" dir="rtl" className="font-arabic font-normal">· نبذة</span></h3>
            <p lang="ar" dir="rtl" className="mt-2 font-arabic text-xl leading-loose">{selected.bio}</p>
            <p className="mt-3 text-base leading-relaxed text-stone-800 dark:text-stone-200">{selected.bioEn}</p>
          </div>
        )}
      </dialog>
    </>
  )
}
