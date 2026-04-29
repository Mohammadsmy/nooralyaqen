import { useState, useEffect, useCallback } from 'react'
import { ls } from '../utils/helpers'

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
  const [counts, setCounts] = useState(() => ls.get('noorpath-tasbeeh-counts', {}))
  const [customTarget, setCustomTarget] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [flash, setFlash] = useState(false)
  const [vibrate, setVibrate] = useState(() => ls.get('noorpath-tasbeeh-vibrate', true))

  const dhikr = DHIKR_PRESETS.find(d => d.id === selected) || DHIKR_PRESETS[0]
  const count = counts[selected] || 0
  const target = parseInt(customTarget) || dhikr.target

  useEffect(() => { ls.set('noorpath-tasbeeh-counts', counts) }, [counts])
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
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">📿</span>
        <div>
          <h1 className="text-2xl font-bold text-emerald-800 dark:text-gold-300">
            Tasbeeh · <span className="font-arabic">التسبيح</span>
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm">
            Dhikr counter · <span className="font-arabic">عداد الذكر</span>
          </p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="ml-auto p-2 rounded-xl bg-stone-100 dark:bg-emerald-800 text-stone-500 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-emerald-700 transition-colors"
          title="Settings · الإعدادات"
        >⚙️</button>
      </div>

      {/* Settings */}
      {showSettings && (
        <div className="card mb-6 animate-slide-up space-y-4">
          <div>
            <label className="text-sm font-medium text-stone-600 dark:text-stone-300 block mb-0.5">
              Custom Target · <span className="font-arabic">هدف مخصص</span>
            </label>
            <input
              type="number" min="1"
              placeholder={`Default: ${dhikr.target}`}
              value={customTarget}
              onChange={e => setCustomTarget(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-emerald-700 bg-stone-50 dark:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={vibrate} onChange={e => setVibrate(e.target.checked)} className="w-4 h-4 accent-emerald-600" />
              <span className="text-sm text-stone-600 dark:text-stone-300">
                Haptic feedback · <span className="font-arabic">اهتزاز (الجوال)</span>
              </span>
            </label>
          </div>
          <button onClick={resetAll} className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors">
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
            className={`rounded-xl px-3 py-2 text-left transition-all text-sm border ${
              selected === d.id
                ? 'bg-emerald-700 text-white border-emerald-600 shadow-md'
                : 'bg-white dark:bg-emerald-900/40 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-emerald-800 hover:border-emerald-400'
            }`}
          >
            <p className="font-arabic text-base mb-0.5 truncate">{d.arabic}</p>
            <p className="text-xs opacity-75 truncate">{d.english}</p>
            <p className={`text-xs mt-0.5 font-medium ${selected === d.id ? 'text-emerald-200' : 'text-stone-400'}`}>
              {counts[d.id] || 0}/{d.target}
            </p>
          </button>
        ))}
      </div>

      {/* Main counter */}
      <div className="card text-center mb-6">
        <p className="font-arabic text-3xl sm:text-4xl text-emerald-800 dark:text-gold-300 mb-1 arabic leading-loose">
          {dhikr.arabic}
        </p>
        <p className="text-stone-600 dark:text-stone-400 text-sm font-medium mb-0.5">{dhikr.english}</p>
        <p className="text-stone-400 dark:text-stone-500 text-xs italic mb-0.5">"{dhikr.meaningEn}"</p>
        <p className="text-stone-400 dark:text-stone-500 text-xs font-arabic mb-6">"{dhikr.meaningAr}"</p>

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
              <span className="text-xs text-stone-400 dark:text-stone-500">
                of · <span className="font-arabic">من</span> {target}
              </span>
              {rounds > 0 && (
                <span className="text-xs text-gold-500 font-medium mt-1">
                  ×{rounds} rounds · <span className="font-arabic">دورات</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {isComplete && (
          <div className="bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800 rounded-xl p-3 mb-4 animate-fade-in">
            <p className="text-gold-700 dark:text-gold-400 font-semibold">🌟 MashaAllah! {target} completed!</p>
            <p className="text-gold-600 dark:text-gold-500 text-sm font-arabic mt-0.5">ما شاء الله! اكتمل {target}</p>
          </div>
        )}

        <button
          onClick={increment}
          className={`w-full py-6 rounded-2xl text-xl font-bold shadow-lg transition-all duration-100 select-none active:scale-95 ${
            isComplete ? 'bg-gold-500 hover:bg-gold-400 text-stone-900' : 'bg-emerald-700 hover:bg-emerald-600 text-white'
          }`}
        >
          Tap to Count · <span className="font-arabic">اضغط للعد</span>
          <span className="block text-sm font-normal opacity-75 mt-1">or press Space / Enter · أو اضغط المسافة</span>
        </button>

        <button onClick={reset} className="mt-4 text-stone-400 hover:text-red-500 text-sm transition-colors">
          Reset · <span className="font-arabic">إعادة تعيين</span>
        </button>
      </div>

      {/* Summary */}
      <div className="card">
        <h3 className="font-semibold text-stone-700 dark:text-stone-300 mb-3 text-sm">
          Today's Summary · <span className="font-arabic">ملخص اليوم</span>
        </h3>
        <div className="space-y-2">
          {DHIKR_PRESETS.map(d => (
            <div key={d.id} className="flex items-center justify-between text-sm">
              <span className="text-stone-600 dark:text-stone-400 font-arabic">{d.arabic}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-stone-100 dark:bg-emerald-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${Math.min(((counts[d.id] || 0) / d.target) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-stone-500 dark:text-stone-400 tabular-nums w-12 text-right">
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
