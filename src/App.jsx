import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'
import Home from './pages/Home'
import Quran from './pages/Quran'
import PrayerTimes from './pages/PrayerTimes'
import Qibla from './pages/Qibla'
import Tasbeeh from './pages/Tasbeeh'
import Dua from './pages/Dua'
import Logos from './pages/Logos'
import CardImage from './pages/CardImage'
import Sahaba from './pages/Sahaba'

export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('noorpath-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('noorpath-theme', dark ? 'dark' : 'light')
  }, [dark])

  // Card image page — no nav/footer, full screen
  const isCardImage = window.location.pathname === '/card-image'
  if (isCardImage) return <BrowserRouter><Routes><Route path="/card-image" element={<CardImage />} /></Routes></BrowserRouter>

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar dark={dark} setDark={setDark} />
        <main className="flex-1 page-enter">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quran" element={<Quran />} />
            <Route path="/quran/:surahId" element={<Quran />} />
            <Route path="/prayer-times" element={<PrayerTimes />} />
            <Route path="/qibla" element={<Qibla />} />
            <Route path="/tasbeeh" element={<Tasbeeh />} />
            <Route path="/dua" element={<Dua />} />
            <Route path="/logos" element={<Logos />} />
            <Route path="/sahaba" element={<Sahaba />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
