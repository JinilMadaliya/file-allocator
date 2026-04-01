import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HardDrive, BookOpen, BarChart3, Activity, Menu, X, Cpu } from 'lucide-react'

const LINKS = [
  { to: '/app',     label: 'Visualizer', icon: HardDrive,  desc: 'Simulate disk allocation' },
  { to: '/theory',  label: 'Theory',     icon: BookOpen,   desc: 'Learn each method' },
  { to: '/compare', label: 'Compare',    icon: BarChart3,  desc: 'Side-by-side + quiz' },
  { to: '/seek',    label: 'Seek Time',  icon: Activity,   desc: 'Disk head simulation' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50" style={{ background: 'rgba(2,6,23,0.88)', backdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(99,102,241,0.13)' }}>
      <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <motion.div whileHover={{ rotate: 12, scale: 1.06 }} transition={{ type: 'spring', stiffness: 300 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}>
            <HardDrive size={18} className="text-white" />
          </motion.div>
          <div className="hidden sm:block">
            <div className="font-display font-bold text-base leading-none text-white">
              File<span style={{ background: 'linear-gradient(90deg,#818cf8,#22d3ee)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Alloc</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono tracking-wider">OS Visualizer v2</div>
          </div>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
            <Cpu size={12} className="text-violet-400" />
            <span className="text-xs font-mono text-slate-400">File System Sim</span>
          </div>
          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(o => !o)}
            className="md:hidden w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-slate-800">
            <nav className="px-4 py-3 flex flex-col gap-1">
              {LINKS.map(({ to, label, icon: Icon, desc }) => (
                <NavLink key={to} to={to} end={to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>
                  <Icon size={14} />
                  <span>{label}</span>
                  <span className="text-xs text-slate-600 ml-1">— {desc}</span>
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
