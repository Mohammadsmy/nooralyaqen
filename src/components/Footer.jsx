import { Link } from 'react-router-dom'
import { NAV_LINKS } from './Navbar'

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-stone-200 dark:bg-black/30 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-10">
        <p lang="ar" dir="rtl" className="font-arabic text-gold-200 text-5xl sm:text-7xl leading-tight text-right">نور اليقين</p>
        <p className="mt-2 text-lg text-stone-200 text-right">Noor Al-Yaqeen — the Quran, prayer times, Qibla and dhikr, in Arabic and English.</p>

        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          <nav aria-label="Footer">
            <h2 className="text-base font-semibold text-white">Pages</h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-6">
              {NAV_LINKS.slice(1).map(({ to, en, ar }) => (
                <li key={to}>
                  <Link to={to} className="flex items-baseline justify-between gap-3 min-h-11 py-2 text-stone-200 hover:text-gold-200">
                    <span>{en}</span>
                    <span lang="ar" dir="rtl" className="font-arabic text-stone-300">{ar}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-base font-semibold text-white">Sources</h2>
            <ul className="mt-3 space-y-2 text-stone-300">
              <li>Quran text, translation (Sahih International) and recitation: <a className="underline hover:text-gold-200" href="https://alquran.cloud" rel="noopener">AlQuran.cloud</a></li>
              <li>Prayer times and Qibla: <a className="underline hover:text-gold-200" href="https://aladhan.com" rel="noopener">Aladhan.com</a></li>
              <li>City search: <a className="underline hover:text-gold-200" href="https://open-meteo.com" rel="noopener">Open-Meteo</a></li>
              <li>Folio from the Blue Qur’an, 9th–10th century: <a className="underline hover:text-gold-200" href="https://www.metmuseum.org/art/collection/search/454662" rel="noopener">The Metropolitan Museum of Art</a>, public domain</li>
            </ul>
          </div>
        </div>

        <p className="mt-12 text-sm text-stone-400">© {new Date().getFullYear()} Noor Al-Yaqeen · <span lang="ar" dir="rtl" className="font-arabic">نور اليقين</span></p>
      </div>
    </footer>
  )
}
