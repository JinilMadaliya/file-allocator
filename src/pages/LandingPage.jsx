import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  HardDrive, BookOpen, BarChart3, Activity, ArrowRight,
  Zap, Shield, Layers, GitBranch, LayoutGrid, Link2,
  ChevronRight, Cpu, Star, Code2, Database, Play
} from 'lucide-react'

/* ── Reusable fade-up animation wrapper ───────────────────── */
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── Mini disk block preview ──────────────────────────────── */
const DEMO_BLOCKS = [
  { color: '#6366f1', label: 'doc.txt', delay: 'block-float' },
  { color: '#22d3ee', label: 'img.png', delay: 'block-float-delay-1' },
  { color: '#f59e0b', label: 'vid.mp4', delay: 'block-float-delay-2' },
  { color: '#10b981', label: 'db.sql',  delay: 'block-float-delay-3' },
  { color: '#f43f5e', label: 'sys.bin', delay: 'block-float-delay-4' },
  { color: '#a78bfa', label: 'log.txt', delay: 'block-float-delay-5' },
  { color: '#6366f1', label: null,      delay: 'block-float-delay-1' },
  { color: null,      label: null,      delay: '' },
  { color: '#22d3ee', label: null,      delay: 'block-float-delay-3' },
  { color: null,      label: null,      delay: '' },
  { color: '#f59e0b', label: null,      delay: 'block-float-delay-2' },
  { color: '#10b981', label: null,      delay: 'block-float-delay-4' },
]

function DiskPreview() {
  return (
    <div className="relative w-full max-w-md mx-auto select-none">
      {/* Glow behind */}
      <div className="absolute inset-0 rounded-3xl"
        style={{ background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.18) 0%, transparent 70%)' }} />

      <div className="relative rounded-3xl p-5"
        style={{
          background: 'rgba(15,23,42,0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99,102,241,0.2)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)'
        }}>

        {/* Terminal-style header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex-1 text-center text-[11px] font-mono text-slate-500">
            virtual-disk — 64 blocks
          </div>
        </div>

        {/* Block grid */}
        <div className="grid grid-cols-6 gap-1.5">
          {DEMO_BLOCKS.map((b, i) => (
            <div key={i}
              className={`h-10 rounded-lg flex items-end justify-center pb-1 text-[8px] font-mono font-bold transition-all ${b.delay}`}
              style={{
                background: b.color
                  ? `linear-gradient(135deg, ${b.color}cc, ${b.color}88)`
                  : 'rgba(30,41,59,0.6)',
                border: b.color
                  ? `1px solid ${b.color}55`
                  : '1px solid rgba(51,65,85,0.4)',
                boxShadow: b.color ? `0 2px 12px ${b.color}40, inset 0 1px 0 rgba(255,255,255,0.12)` : 'none',
                color: b.color ? 'rgba(255,255,255,0.9)' : 'transparent',
              }}>
              {b.label ? b.label.split('.')[1] : ''}
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #22d3ee)' }}
              initial={{ width: '0%' }}
              animate={{ width: '62%' }}
              transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-400">62% used</span>
        </div>

        {/* Method tags */}
        <div className="mt-3 flex gap-2 flex-wrap">
          {[
            { label: 'Contiguous', color: '#6366f1' },
            { label: 'Linked', color: '#22d3ee' },
            { label: 'Indexed', color: '#f59e0b' },
          ].map(t => (
            <span key={t.label} className="text-[10px] font-mono px-2 py-0.5 rounded-md"
              style={{ background: `${t.color}18`, color: t.color, border: `1px solid ${t.color}35` }}>
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Feature card ─────────────────────────────────────────── */
function FeatureCard({ icon: Icon, color, title, desc, delay }) {
  return (
    <FadeUp delay={delay}>
      <div className="feature-card gradient-border rounded-2xl p-6 h-full"
        style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(16px)' }}>
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 relative"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon size={20} style={{ color }} />
          <div className="absolute inset-0 rounded-2xl"
            style={{ boxShadow: `0 0 20px ${color}20` }} />
        </div>
        <h3 className="font-display font-bold text-white text-base mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </FadeUp>
  )
}

/* ── Stat item ────────────────────────────────────────────── */
function StatItem({ value, label, color }) {
  return (
    <div className="text-center px-6 py-4">
      <div className="text-3xl font-display font-black mb-1"
        style={{ background: `linear-gradient(135deg, ${color}, white)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {value}
      </div>
      <div className="text-slate-400 text-sm font-medium">{label}</div>
    </div>
  )
}

/* ── Step card ────────────────────────────────────────────── */
function StepCard({ num, title, desc, color, delay }) {
  return (
    <FadeUp delay={delay} className="relative">
      <div className="relative z-10 text-center">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 font-display font-black text-lg"
          style={{
            background: `linear-gradient(135deg, ${color}30, ${color}15)`,
            border: `1px solid ${color}40`,
            color,
            boxShadow: `0 0 20px ${color}20`,
          }}>
          {num}
        </div>
        <h3 className="font-display font-bold text-white text-base mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
      </div>
    </FadeUp>
  )
}

/* ── Main Landing Page ────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">

      {/* ─── HERO SECTION ────────────────────────────────── */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center px-4 pt-24 pb-20 overflow-hidden">
        {/* Background orbs */}
        <div className="landing-orb-1" />
        <div className="landing-orb-2" />
        <div className="landing-orb-3" />

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'backOut' }}
          className="mb-8 flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-medium"
          style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.3)',
            backdropFilter: 'blur(12px)',
          }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
          </span>
          <span className="text-violet-300 font-mono text-xs tracking-wide">v2.0 — OS File System Visualizer</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center font-display font-black leading-tight max-w-4xl"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}>
          <span className="text-white">Visualize </span>
          <span className="text-shimmer">File Allocation</span>
          <br />
          <span className="text-white">like never before</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="text-center text-slate-400 mt-6 max-w-2xl leading-relaxed"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>
          An interactive disk simulator that brings OS file-system concepts to life —
          contiguous, linked, and indexed allocation with real-time animations.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.34 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <Link to="/app">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn-glow flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-display font-bold text-base text-white"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: '1px solid rgba(99,102,241,0.5)',
              }}>
              <Play size={16} fill="white" />
              Launch Visualizer
              <ArrowRight size={16} />
            </motion.button>
          </Link>
          <Link to="/theory">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-display font-semibold text-base text-slate-300"
              style={{
                background: 'rgba(30,41,59,0.6)',
                border: '1px solid rgba(99,102,241,0.2)',
                backdropFilter: 'blur(12px)',
              }}>
              <BookOpen size={16} />
              Learn the Theory
            </motion.button>
          </Link>
        </motion.div>

        {/* Tech badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-10">
          {['React 18', 'Framer Motion', 'Vite', 'Tailwind CSS'].map(t => (
            <span key={t} className="text-[11px] font-mono text-slate-500 px-3 py-1 rounded-full"
              style={{ border: '1px solid rgba(51,65,85,0.7)', background: 'rgba(15,23,42,0.5)' }}>
              {t}
            </span>
          ))}
        </motion.div>

        {/* Hero disk preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 w-full max-w-md">
          <DiskPreview />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs font-mono text-slate-600 tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-0.5 h-8 rounded-full"
            style={{ background: 'linear-gradient(180deg, rgba(99,102,241,0.6), transparent)' }} />
        </motion.div>
      </section>

      {/* ─── STATS BAR ───────────────────────────────────── */}
      <FadeUp>
        <div className="mx-4 md:mx-auto max-w-5xl rounded-3xl mb-4"
          style={{
            background: 'rgba(15,23,42,0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99,102,241,0.15)',
          }}>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-800/50">
            <StatItem value="3" label="Allocation Methods" color="#6366f1" />
            <StatItem value="4" label="Scheduling Algorithms" color="#22d3ee" />
            <StatItem value="200" label="Max Disk Blocks" color="#f59e0b" />
            <StatItem value="8" label="Quiz Questions" color="#10b981" />
          </div>
        </div>
      </FadeUp>

      {/* ─── FEATURES GRID ───────────────────────────────── */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
        <FadeUp className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-4"
            style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', color: '#22d3ee' }}>
            <Zap size={11} />
            Features
          </div>
          <h2 className="font-display font-black text-white text-3xl md:text-4xl leading-tight">
            Everything you need to master<br />
            <span style={{ background: 'linear-gradient(90deg, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              File Systems
            </span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-base leading-relaxed">
            From interactive simulations to in-depth theory, every concept is visualized with precision and real-time feedback.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureCard
            icon={LayoutGrid}
            color="#6366f1"
            title="Disk Block Visualizer"
            desc="Simulate contiguous, linked, and indexed allocation on a virtual disk with animated step-by-step block assignment."
            delay={0.05}
          />
          <FeatureCard
            icon={BookOpen}
            color="#22d3ee"
            title="Interactive Theory"
            desc="Deep-dive walkthroughs for each allocation method with animated diagrams, complexity analysis, and formula references."
            delay={0.12}
          />
          <FeatureCard
            icon={BarChart3}
            color="#f59e0b"
            title="Compare + Quiz"
            desc="Side-by-side performance ratings for all methods plus an 8-question interactive quiz with instant feedback."
            delay={0.19}
          />
          <FeatureCard
            icon={Activity}
            color="#10b981"
            title="Seek Time Simulator"
            desc="Visualize FCFS, SSTF, SCAN and C-SCAN disk scheduling with an animated SVG chart and auto-ranking comparison."
            delay={0.26}
          />
        </div>

        {/* Secondary features row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <FeatureCard
            icon={Zap}
            color="#a78bfa"
            title="Real-time Animation"
            desc="Adjustable animation speed and step-by-step mode to watch each block being allocated one at a time."
            delay={0.1}
          />
          <FeatureCard
            icon={Database}
            color="#f43f5e"
            title="Fragmentation Meter"
            desc="Live fragmentation analysis with external fragmentation percentage, free run detection, and smart recommendations."
            delay={0.17}
          />
          <FeatureCard
            icon={Code2}
            color="#fb923c"
            title="Activity Log"
            desc="Timestamped event log tracking every allocation, deletion, and disk operation with color-coded file markers."
            delay={0.24}
          />
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────── */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-4"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8' }}>
              <GitBranch size={11} />
              How It Works
            </div>
            <h2 className="font-display font-black text-white text-3xl md:text-4xl">
              Three steps to understand
              <br />
              <span style={{ background: 'linear-gradient(90deg, #6366f1, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                File Allocation
              </span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connectors (hidden on mobile) */}
            <div className="hidden md:block absolute top-6 left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-px"
              style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.4), rgba(34,211,238,0.2))' }} />

            <StepCard
              num="01"
              title="Choose Your Disk"
              desc="Select a disk size from 32 to 200 blocks using the slider or preset buttons to match your learning scenario."
              color="#6366f1"
              delay={0.05}
            />
            <StepCard
              num="02"
              title="Allocate Files"
              desc="Name a file, set its block size, and pick an allocation method. Watch the blocks fill in real-time with color coding."
              color="#22d3ee"
              delay={0.15}
            />
            <StepCard
              num="03"
              title="Analyze Results"
              desc="Monitor live fragmentation stats, check the activity log, and explore the theory pages to understand the trade-offs."
              color="#10b981"
              delay={0.25}
            />
          </div>
        </div>
      </section>

      {/* ─── METHODS SHOWCASE ────────────────────────────── */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
        <FadeUp className="text-center mb-12">
          <h2 className="font-display font-black text-white text-3xl md:text-4xl mb-4">
            Three Allocation Methods
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Each method has unique characteristics. Learn them all through interactive simulation.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: 'Contiguous',
              icon: LayoutGrid,
              color: '#6366f1',
              tag: 'Sequential',
              points: ['Fast sequential access', 'External fragmentation', 'Used in CD-ROMs'],
              delay: 0.05,
            },
            {
              title: 'Linked',
              icon: Link2,
              color: '#22d3ee',
              tag: 'FAT-style',
              points: ['No contiguous space needed', 'Pointer overhead per block', 'Used in FAT filesystems'],
              delay: 0.15,
            },
            {
              title: 'Indexed',
              icon: Layers,
              color: '#f59e0b',
              tag: 'iNode-style',
              points: ['O(1) random access', 'Index block overhead', 'Used in UNIX ext4'],
              delay: 0.25,
            },
          ].map(m => (
            <FadeUp key={m.title} delay={m.delay}>
              <div className="gradient-border rounded-2xl p-6 h-full relative overflow-hidden"
                style={{ background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(16px)' }}>
                {/* Glow bg */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${m.color}12 0%, transparent 70%)` }} />

                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${m.color}18`, border: `1px solid ${m.color}30` }}>
                    <m.icon size={18} style={{ color: m.color }} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white">{m.title}</h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
                      style={{ background: `${m.color}18`, color: m.color }}>{m.tag}</span>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {m.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: m.color, boxShadow: `0 0 6px ${m.color}` }} />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link to="/theory">
                  <motion.div whileHover={{ x: 4 }}
                    className="mt-5 flex items-center gap-1.5 text-sm font-display font-semibold cursor-pointer"
                    style={{ color: m.color }}>
                    Learn more <ChevronRight size={14} />
                  </motion.div>
                </Link>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ─── CTA BANNER ──────────────────────────────────── */}
      <FadeUp>
        <section className="py-10 px-4 md:px-8 mb-8">
          <div className="max-w-4xl mx-auto rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(34,211,238,0.08) 100%)',
              border: '1px solid rgba(99,102,241,0.25)',
              backdropFilter: 'blur(20px)',
            }}>
            {/* Corner glows */}
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)' }} />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)' }} />

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star size={16} className="text-amber-400" fill="currentColor" />
                <span className="text-amber-400 font-mono text-sm">OS Project · Academic Visualizer</span>
                <Star size={16} className="text-amber-400" fill="currentColor" />
              </div>
              <h2 className="font-display font-black text-white text-3xl md:text-4xl mb-4">
                Ready to explore file systems?
              </h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                Jump into the interactive disk simulator and start allocating files across virtual disk blocks.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/app">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-glow flex items-center gap-2.5 px-8 py-4 rounded-2xl font-display font-bold text-base text-white"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      border: '1px solid rgba(99,102,241,0.5)',
                    }}>
                    <HardDrive size={18} />
                    Open Visualizer
                  </motion.button>
                </Link>
                <Link to="/compare">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-display font-semibold text-base text-slate-300"
                    style={{
                      background: 'rgba(30,41,59,0.6)',
                      border: '1px solid rgba(99,102,241,0.2)',
                      backdropFilter: 'blur(12px)',
                    }}>
                    <BarChart3 size={18} />
                    Take the Quiz
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </FadeUp>

      {/* ─── FOOTER ──────────────────────────────────────── */}
      <footer className="border-t py-10 px-6" style={{ borderColor: 'rgba(99,102,241,0.1)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}>
              <HardDrive size={15} className="text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-sm">
                File<span style={{ background: 'linear-gradient(90deg,#818cf8,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Alloc</span>
              </div>
              <div className="text-[10px] text-slate-600 font-mono">OS Visualizer v2.0</div>
            </div>
          </div>

          <nav className="flex items-center gap-1 flex-wrap justify-center">
            {[
              { to: '/app', label: 'Visualizer' },
              { to: '/theory', label: 'Theory' },
              { to: '/compare', label: 'Compare' },
              { to: '/seek', label: 'Seek Time' },
            ].map(({ to, label }) => (
              <Link key={to} to={to}
                className="px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-300 font-medium transition-colors">
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
            <Cpu size={12} />
            <span>Built with React + Framer Motion</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
