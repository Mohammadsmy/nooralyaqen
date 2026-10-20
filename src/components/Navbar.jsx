import { Link, NavLink, useLocation as useRoute } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Icon from './Icon'

export const NAV_LINKS = [
  { to: '/',             ar: 'الرئيسية',     en: 'Home' },
  { to: '/quran',        ar: 'القرآن',       en: 'Quran' },
  { to: '/prayer-times', ar: 'أوقات الصلاة', en: 'Prayer times' },
  { to: '/qibla',        ar: 'القبلة',       en: 'Qibla' },
  { to: '/tasbeeh',      ar: 'التسبيح',      en: 'Tasbeeh' },
  { to: '/adhkar',       ar: 'الأذكار',      en: 'Adhkar' },
  { to: '/sahaba',       ar: 'الصحابة',      en: 'Sahaba' },
]

export default function Navbar({ dark, setDark }) {
  const [open, setOpen] = useState(false)
  const route = useRoute()
  useEffect(() => setOpen(false), [route.pathname])

  return (
    <header className="sticky top-0 z-50 bg-stone-50 dark:bg-emerald-950 border-b border-stone-200 dark:border-emerald-900">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 btn-primary">Skip to content</a>
      <nav aria-label="Main" className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5 min-h-11">
          <img src="/logo.svg" alt="" className="w-9 h-9 rounded-lg" width="36" height="36" />
          <span className="leading-tight">
            <span lang="ar" dir="rtl" className="block font-arabic font-bold text-lg text-emerald-900 dark:text-gold-200">نور اليقين</span>
            <span className="block text-xs font-medium text-stone-600 dark:text-stone-300">Noor Al-Yaqeen</span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.slice(1).map(({ to, ar, en }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => `flex flex-col items-center leading-tight py-1 border-b-2 ${isActive ? 'nav-link-active border-current' : 'nav-link border-transparent'}`}
              >
                <span lang="ar" dir="rtl" className="font-arabic text-base">{ar}</span>
                <span className="text-xs">{en}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <button onClick={() => setDark(!dark)} className="btn-icon" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
            <Icon name={dark ? 'sun' : 'moon'} />
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="btn-icon lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </nav>

      {open && (
        <ul id="mobile-menu" className="lg:hidden border-t border-stone-200 dark:border-emerald-900 bg-stone-50 dark:bg-emerald-950 px-4 py-2">
          {NAV_LINKS.map(({ to, ar, en }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between min-h-12 px-3 rounded-lg ${
                    isActive ? 'bg-stone-200 dark:bg-emerald-900 text-emerald-900 dark:text-gold-200' : 'text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-emerald-900/60'
                  }`
                }
              >
                <span>{en}</span>
                <span lang="ar" dir="rtl" className="font-arabic text-lg">{ar}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
