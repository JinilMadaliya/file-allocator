import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import VisualizerPage from './pages/VisualizerPage'
import TheoryPage from './pages/TheoryPage'
import ComparePage from './pages/ComparePage'
import SeekPage from './pages/SeekPage'

export default function App() {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <div className="app-bg min-h-screen">
      <div className="blob-violet" />
      <div className="blob-cyan" />
      <div className="relative z-10 flex flex-col min-h-screen">
        {!isLanding && <Navbar />}
        {isLanding && <LandingNavbar />}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/app" element={<VisualizerPage />} />
              <Route path="/theory" element={<TheoryPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/seek" element={<SeekPage />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

/* ── Minimal landing nav (transparent, no bottom border initially) ── */
function LandingNavbar() {
  const [scrolled, setScrolled] = React.useState(false)
  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(2,6,23,0.92)' : 'rgba(2,6,23,0.4)',
        backdropFilter: 'blur(18px)',
        borderBottom: scrolled ? '1px solid rgba(99,102,241,0.15)' : '1px solid transparent',
      }}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12H2"/><path d="M5 4l-3 8 3 8"/><path d="M19 4l3 8-3 8"/>
            </svg>
          </div>
          <span className="font-display font-bold text-base text-white">
            File<span style={{ background: 'linear-gradient(90deg,#818cf8,#22d3ee)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Alloc</span>
          </span>
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: '/theory', label: 'Theory' },
            { href: '/compare', label: 'Compare' },
            { href: '/seek', label: 'Seek Time' },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a href="/app">
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-semibold text-sm text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              border: '1px solid rgba(99,102,241,0.4)',
              boxShadow: '0 0 20px rgba(99,102,241,0.25)',
            }}>
            Launch App
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </a>
      </div>
    </header>
  )
}
