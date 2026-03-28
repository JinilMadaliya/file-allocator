import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import VisualizerPage from './pages/VisualizerPage'
import TheoryPage from './pages/TheoryPage'
import ComparePage from './pages/ComparePage'
import SeekPage from './pages/SeekPage'

export default function App() {
  const location = useLocation()
  return (
    <div className="app-bg min-h-screen">
      <div className="blob-violet" />
      <div className="blob-cyan" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<VisualizerPage />} />
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
