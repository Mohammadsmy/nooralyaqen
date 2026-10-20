import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { NAV_LINKS } from '../components/Navbar'

export default function NotFound() {
  usePageTitle('Page not found')
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
      <h1 className="page-title">This page does not exist · <span lang="ar" dir="rtl" className="font-arabic font-normal">الصفحة غير موجودة</span></h1>
      <p className="page-sub">The link may be mistyped or out of date. Here is everything on the site:</p>
      <ul className="mt-8 grid gap-2 sm:grid-cols-2">
        {NAV_LINKS.map(({ to, en, ar }) => (
          <li key={to}>
            <Link to={to} className="flex items-baseline justify-between min-h-12 px-4 py-3 rounded-lg bg-white dark:bg-emerald-900/50 hover:bg-stone-100 dark:hover:bg-emerald-900">
              <span className="text-lg">{en}</span>
              <span lang="ar" dir="rtl" className="font-arabic text-xl text-emerald-800 dark:text-gold-200">{ar}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
