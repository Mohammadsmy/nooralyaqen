import { useState, useEffect, useCallback } from 'react'
import { ls } from '../utils/helpers'
import { usePageTitle } from '../hooks/usePageTitle'
import Icon from '../components/Icon'

const today = () => new Date().toDateString()

const DHIKR_PRESETS = [
  { id: 'subhanallah',    arabic: 'سُبْحَانَ اللَّهِ',           english: 'SubhanAllah',             meaningEn: 'Glory be to Allah',               meaningAr: 'سبحان الله',         target: 33  },
  { id: 'alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ',           english: 'Alhamdulillah',           meaningEn: 'All praise is due to Allah',       meaningAr: 'الحمد لله',          target: 33  },
  { id: 'allahuakbar',   arabic: 'اللَّهُ أَكْبَرُ',            english: 'Allahu Akbar',            meaningEn: 'Allah is the Greatest',           meaningAr: 'الله أكبر',          target: 33  },
  { id: 'lailahaillallah', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', english: 'La ilaha illallah',    meaningEn: 'There is no god but Allah',       meaningAr: 'لا إله إلا الله',    target: 100 },
  { id: 'astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ',       english: 'Astaghfirullah',         meaningEn: 'I seek forgiveness from Allah',   meaningAr: 'أستغفر الله',        target: 100 },
  { id: 'salawat',       arabic: 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ', english: "Sallallahu 'Alayhi Wasallam", meaningEn: 'Peace and blessings be upon him', meaningAr: 'صلى الله عليه وسلم', target: 100 },
]

export default function Tasbeeh() {
  const [selected, setSelected] = useState(() => ls.get('noorpath-tasbeeh-selected', DHIKR_PRESETS[0].id))
  // Counts are kept per day: a new day starts from zero.
  const [counts, setCounts] = useState(() => {
    const saved = ls.get('noorpath-tasbeeh-counts', {})
    return ls.get('noorpath-tasbeeh-day', null) === today() ? saved : {}
  })
  const [customTarget, setCustomTarget] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [flash, setFlash] = useState(false)
  const [vibrate, setVibrate] = useState(() => ls.get('noorpath-tasbeeh-vibrate', true))

  const dhikr = DHIKR_PRESETS.find(d => d.id === selected) || DHIKR_PRESETS[0]
  const count = counts[selected] || 0
  const target = parseInt(customTarget) || dhikr.target

  usePageTitle('Tasbeeh', 'A dhikr counter for SubhanAllah, Alhamdulillah, Allahu Akbar and more.')
  useEffect(() => { ls.set('noorpath-tasbeeh-counts', counts); ls.set('noorpath-tasbeeh-day', today()) }, [counts])
  useEffect(() => { ls.set('noorpath-tasbeeh-selected', selected) }, [selected])
  useEffect(() => { ls.set('noorpath-tasbeeh-vibrate', vibrate) }, [vibrate])

  const increment = useCallback(() => {
    setCounts(prev => ({ ...prev, [selected]: (prev[selected] || 0) + 1 }))
    setFlash(true)
    setTimeout(() => setFlash(false), 120)
    if (vibrate && navigator.vibrate) navigator.vibrate(30)
  }, [selected, vibrate])

  useEffect(() => {
    function onKey(e) {
      // Count with Space/Enter, but never while typing or when another control has focus.
      const t = e.target
      if (t !== document.body) return  // the Count button handles its own keys
      if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); increment() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [increment])

  function reset() { setCounts(prev => ({ ...prev, [selected]: 0 })) }
  function resetAll() { setCounts({}) }

  const progress = Math.min((count / target) * 100, 100)
  const isComplete = count >= target
  const rounds = Math.floor(count / target)

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-start gap-3 mb-8">
        <div>
          <h1 className="page-title">
            Tasbeeh <span lang="ar" dir="rtl" className="font-arabic font-normal">· التسبيح</span>
          </h1>
          <p className="page-sub">Choose a phrase and count. Today’s counts are kept on this device.</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="btn-secondary ml-auto shrink-0"
          aria-expanded={showSettings}
        ><Icon name="settings" className="w-4 h-4" /> Settings</button>
      </div>

      {/* Settings */}
      {showSettings && (
        <div className="card mb-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-stone-800 dark:text-stone-200 block mb-1">
              Custom Target · <span className="font-arabic">هدف مخصص</span>
            </label>
            <input
              type="number" min="1"
              placeholder={`Default: ${dhikr.target}`}
              value={customTarget}
              onChange={e => setCustomTarget(e.target.value)}
              className="w-full h-12 px-3 text-base rounded-lg border border-stone-300 dark:border-emerald-700 bg-stone-50 dark:bg-emerald-900"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={vibrate} onChange={e => setVibrate(e.target.checked)} className="w-4 h-4 accent-emerald-600" />
              <span className="text-sm text-stone-800 dark:text-stone-200">
                Haptic feedback · <span className="font-arabic">اهتزاز (الجوال)</span>
              </span>
            </label>
          </div>
          <button onClick={resetAll} className="min-h-11 text-red-700 dark:text-red-300 hover:underline text-sm font-medium">
            Reset all counters · <span className="font-arabic">إعادة تعيين جميع العدادات</span>
          </button>
        </div>
      )}

      {/* Dhikr selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
        {DHIKR_PRESETS.map(d => (
          <button
            key={d.id}
            onClick={() => setSelected(d.id)}
            aria-pressed={selected === d.id}
            className={`rounded-lg px-3 py-2.5 text-left transition-colors text-sm border ${
              selected === d.id
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-white dark:bg-emerald-900/40 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-emerald-800 hover:border-emerald-600'
            }`}
          >
            <p lang="ar" dir="rtl" className="font-arabic text-lg mb-0.5 text-right">{d.arabic}</p>
            <p className="text-sm">{d.english}</p>
            <p className={`text-sm mt-0.5 tabular-nums ${selected === d.id ? 'text-emerald-100' : 'text-stone-600 dark:text-stone-300'}`}>
              {counts[d.id] || 0}/{d.target}
            </p>
          </button>
        ))}
      </div>

      {/* Main counter */}
      <div className="card text-center mb-6">
        <p lang="ar" className="font-arabic text-4xl sm:text-5xl text-emerald-900 dark:text-gold-200 mb-1 arabic leading-loose">
          {dhikr.arabic}
        </p>
        <p className="text-stone-900 dark:text-stone-100 text-lg font-medium">{dhikr.english}</p>
        <p className="text-stone-700 dark:text-stone-300 text-base mb-6">{dhikr.meaningEn}</p>

        {/* Progress ring */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" className="stroke-stone-100 dark:stroke-emerald-900" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                className={`transition-all duration-300 ${isComplete ? 'stroke-gold-400' : 'stroke-emerald-600 dark:stroke-emerald-400'}`}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold tabular-nums transition-all duration-100 ${flash ? 'scale-110 text-emerald-600 dark:text-gold-300' : 'text-stone-800 dark:text-stone-100'}`}>
                {count % target === 0 && count > 0 ? target : count % target}
              </span>
              <span className="text-sm text-stone-600 dark:text-stone-300 tabular-nums">of {target}</span>
              {rounds > 0 && (
                <span className="text-sm text-emerald-800 dark:text-gold-200 font-medium mt-1">
                  {rounds} {rounds === 1 ? 'round' : 'rounds'} done
                </span>
              )}
            </div>
          </div>
        </div>

        {isComplete && (
          <p role="status" className="rounded-lg bg-gold-100 dark:bg-gold-900/30 text-gold-900 dark:text-gold-100 p-3 mb-4 font-semibold">
            MashaAllah — {target} completed. <span lang="ar" dir="rtl" className="font-arabic font-normal">ما شاء الله</span>
          </p>
        )}

        <button
          id="tasbeeh-count"
          onClick={increment}
          className={`w-full py-8 rounded-lg text-2xl font-bold transition-colors duration-100 select-none active:scale-[0.99] ${
            isComplete ? 'bg-gold-300 hover:bg-gold-200 text-stone-900' : 'bg-emerald-800 hover:bg-emerald-700 text-white'
          }`}
        >
          Count <span lang="ar" dir="rtl" className="font-arabic font-normal">· عُدّ</span>
          <span className="block text-sm font-normal mt-1">or press Space</span>
        </button>

        <button onClick={reset} className="mt-3 min-h-11 px-4 text-stone-700 dark:text-stone-300 hover:text-red-700 dark:hover:text-red-300 text-base">
          Reset this counter
        </button>
      </div>

      {/* Summary */}
      <div className="card">
        <h2 className="font-semibold text-stone-900 dark:text-stone-100 mb-3 text-lg">
          Today <span lang="ar" dir="rtl" className="font-arabic font-normal">· اليوم</span>
        </h2>
        <div className="space-y-2">
          {DHIKR_PRESETS.map(d => (
            <div key={d.id} className="flex items-center justify-between text-sm">
              <span lang="ar" dir="rtl" className="text-stone-800 dark:text-stone-200 font-arabic text-lg">{d.arabic}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-stone-100 dark:bg-emerald-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${Math.min(((counts[d.id] || 0) / d.target) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-stone-700 dark:text-stone-300 tabular-nums w-16 text-right">
                  {counts[d.id] || 0}/{d.target}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
