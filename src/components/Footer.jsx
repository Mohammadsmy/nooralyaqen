import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-emerald-900 dark:bg-black/40 text-stone-300 mt-auto">
      <div className="geo-pattern">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/logo.svg" alt="Noor Al-Yaqeen" className="w-10 h-10 rounded-xl shadow-md" />
                <div className="leading-tight">
                  <p className="font-bold text-base text-white font-arabic">نور اليقين</p>
                  <p className="text-xs text-gold-400 font-semibold tracking-wide">Noor Al-Yaqeen</p>
                </div>
              </div>
              <p className="text-sm text-stone-400 leading-relaxed">
                Your daily Islamic companion for Quran, prayer times, Qibla & dhikr.
              </p>
              <p className="text-xs text-stone-500 font-arabic mt-1 leading-relaxed">
                رفيقك الإسلامي اليومي للقرآن وأوقات الصلاة والقبلة والذكر.
              </p>
              <p className="mt-3 text-xl font-arabic text-gold-400">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold text-white mb-1">Pages</h3>
              <p className="text-xs text-gold-500 font-arabic mb-3">الصفحات</p>
              <ul className="space-y-2 text-sm">
                {[
                  ['/quran',        '📖 القرآن',        'Quran'],
                  ['/prayer-times', '🕌 أوقات الصلاة',  'Prayer Times'],
                  ['/qibla',        '🧭 القبلة',         'Qibla'],
                  ['/tasbeeh',      '📿 التسبيح',        'Tasbeeh'],
                  ['/dua',          '🤲 أذكار',          'Adhkar'],
                ].map(([to, ar, en]) => (
                  <li key={to}>
                    <Link to={to} className="hover:text-gold-300 transition-colors flex items-center justify-between">
                      <span className="font-arabic">{ar}</span>
                      <span className="text-xs text-stone-500 hover:text-gold-400 transition-colors">{en}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Credits */}
            <div>
              <h3 className="font-semibold text-white mb-1">Data Sources</h3>
              <p className="text-xs text-gold-500 font-arabic mb-3">مصادر البيانات</p>
              <ul className="space-y-2 text-sm text-stone-400">
                <li>
                  <span>Quran text & audio: AlQuran.cloud</span>
                  <p className="text-xs font-arabic text-stone-500">نص القرآن والصوت</p>
                </li>
                <li>
                  <span>Prayer times: Aladhan.com</span>
                  <p className="text-xs font-arabic text-stone-500">أوقات الصلاة</p>
                </li>
                <li>
                  <span>Qibla direction: Aladhan.com</span>
                  <p className="text-xs font-arabic text-stone-500">اتجاه القبلة</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-emerald-800 text-center text-sm text-stone-500">
            <p>Made with ♥ for the Ummah · <span className="font-arabic">صُنع بـ ♥ للأمة الإسلامية</span></p>
            <p className="mt-1">نور اليقين · Noor Al-Yaqeen © {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
