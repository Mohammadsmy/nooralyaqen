import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'

const navLinks = [
  { to: '/',            ar: 'الرئيسية',    en: 'Home',         icon: '🏠' },
  { to: '/quran',       ar: 'القرآن',      en: 'Quran',        icon: '📖' },
  { to: '/prayer-times',ar: 'أوقات الصلاة',en: 'Prayer Times', icon: '🕌' },
  { to: '/qibla',       ar: 'القبلة',      en: 'Qibla',        icon: '🧭' },
  { to: '/tasbeeh',     ar: 'التسبيح',     en: 'Tasbeeh',      icon: '📿' },
  { to: '/dua',         ar: 'أذكار',       en: 'Adhkar',       icon: '🤲' },
  { to: '/sahaba',      ar: 'الصحابة',     en: 'Sahaba',       icon: '⭐' },
]

export default function Navbar({ dark, setDark }) {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-emerald-950/90 backdrop-blur-md border-b border-stone-200 dark:border-emerald-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/logo.svg" alt="Noor Al-Yaqeen" className="w-9 h-9 rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-200" />
          <div className="leading-tight">
            <p className="font-bold text-base text-emerald-800 dark:text-gold-300 font-arabic">نور اليقين</p>
            <p className="text-xs font-semibold text-emerald-600 dark:text-gold-500 tracking-wide">Noor Al-Yaqeen</p>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map(({ to, ar, en, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center leading-tight transition-colors duration-200 ${isActive ? 'nav-link-active' : 'nav-link'}`
              }
            >
              <span className="text-base font-arabic">{icon} {ar}</span>
              <span className="text-xs opacity-60 tracking-wide">{en}</span>
            </NavLink>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
            className="p-2 rounded-xl bg-stone-100 dark:bg-emerald-800 hover:bg-stone-200 dark:hover:bg-emerald-700 transition-colors text-lg"
          >
            {dark ? '☀️' : '🌙'}
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl bg-stone-100 dark:bg-emerald-800 hover:bg-stone-200 dark:hover:bg-emerald-700 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5 text-stone-600 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-stone-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 px-4 py-3 space-y-1 animate-fade-in">
          {navLinks.map(({ to, ar, en, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-800/50 text-emerald-700 dark:text-gold-300'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-emerald-800/30'
                }`
              }
            >
              <span className="font-arabic">{icon} {ar}</span>
              <span className="text-xs opacity-60">{en}</span>
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
