import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { Activity, Play, RefreshCw, Plus, Trash2, Info } from 'lucide-react'

const ALGORITHMS = [
  { id: 'fcfs', label: 'FCFS', desc: 'First Come First Served — process in request order' },
  { id: 'sstf', label: 'SSTF', desc: 'Shortest Seek Time First — always pick nearest track' },
  { id: 'scan', label: 'SCAN (Elevator)', desc: 'Move in one direction, reverse at end' },
  { id: 'cscan', label: 'C-SCAN', desc: 'Circular SCAN — only serve in one direction' },
]

const MAX_TRACK = 199

function fcfs(head, requests) {
  const path = [head, ...requests]
  let total = 0
  for (let i = 1; i < path.length; i++) total += Math.abs(path[i] - path[i - 1])
  return { path, total }
}

function sstf(head, requests) {
  const rem = [...requests]
  const path = [head]
  let total = 0
  let cur = head
  while (rem.length) {
    let minDist = Infinity, minIdx = 0
    rem.forEach((r, i) => { const d = Math.abs(r - cur); if (d < minDist) { minDist = d; minIdx = i } })
    cur = rem[minIdx]; rem.splice(minIdx, 1)
    path.push(cur); total += minDist
  }
  return { path, total }
}

function scan(head, requests) {
  const sorted = [...requests].sort((a, b) => a - b)
  const left = sorted.filter(r => r < head).reverse()
  const right = sorted.filter(r => r >= head)
  const path = [head, ...right, MAX_TRACK, ...left]
  let total = 0
  for (let i = 1; i < path.length; i++) total += Math.abs(path[i] - path[i - 1])
  return { path, total }
}

function cscan(head, requests) {
  const sorted = [...requests].sort((a, b) => a - b)
  const right = sorted.filter(r => r >= head)
  const left = sorted.filter(r => r < head)
  const path = [head, ...right, MAX_TRACK, 0, ...left]
  let total = 0
  for (let i = 1; i < path.length; i++) total += Math.abs(path[i] - path[i - 1])
  return { path, total }
}

function runAlgo(id, head, requests) {
  if (!requests.length) return { path: [head], total: 0 }
  switch (id) {
    case 'fcfs': return fcfs(head, requests)
    case 'sstf': return sstf(head, requests)
    case 'scan': return scan(head, requests)
    case 'cscan': return cscan(head, requests)
    default: return fcfs(head, requests)
  }
}

const CHART_W = 600
const CHART_H = 340
const PAD = { top: 20, bottom: 30, left: 45, right: 20 }

function SeekChart({ path, animProgress }) {
  if (!path || path.length < 2) return null
  const innerW = CHART_W - PAD.left - PAD.right
  const innerH = CHART_H - PAD.top - PAD.bottom

  const toX = (step) => PAD.left + (step / (path.length - 1)) * innerW
  const toY = (track) => PAD.top + (1 - track / MAX_TRACK) * innerH

  const visibleCount = Math.max(2, Math.round(animProgress * path.length))
  const visiblePath = path.slice(0, visibleCount)

  const points = visiblePath.map((t, i) => `${toX(i)},${toY(t)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full rounded-xl" style={{ background: 'rgba(15,23,42,0.8)' }}>
      {/* Grid */}
      {[0, 50, 100, 150, 199].map(t => (
        <g key={t}>
          <line x1={PAD.left} y1={toY(t)} x2={CHART_W - PAD.right} y2={toY(t)} stroke="#1e293b" strokeWidth="1" />
          <text x={PAD.left - 5} y={toY(t) + 4} textAnchor="end" fontSize="10" fill="#475569">{t}</text>
        </g>
      ))}
      {path.map((_, i) => (
        <line key={i} x1={toX(i)} y1={PAD.top} x2={toX(i)} y2={CHART_H - PAD.bottom} stroke="#1e293b" strokeWidth="1" />
      ))}

      {/* Axis labels */}
      <text x={PAD.left - 12} y={CHART_H / 2} textAnchor="middle" fontSize="10" fill="#475569"
        transform={`rotate(-90, ${PAD.left - 28}, ${CHART_H / 2})`}>Track</text>
      <text x={CHART_W / 2} y={CHART_H - 5} textAnchor="middle" fontSize="10" fill="#475569">Request Sequence</text>

      {/* Path line */}
      {visiblePath.length >= 2 && (
        <polyline points={points} fill="none" stroke="#6366f1" strokeWidth="2.5"
          strokeLinejoin="round" strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 4px #6366f180)' }} />
      )}

      {/* Points */}
      {visiblePath.map((t, i) => (
        <g key={i}>
          <circle cx={toX(i)} cy={toY(t)} r={i === 0 ? 7 : 5}
            fill={i === 0 ? '#f59e0b' : '#6366f1'}
            stroke={i === 0 ? '#fbbf24' : '#818cf8'} strokeWidth="1.5"
            style={{ filter: `drop-shadow(0 0 4px ${i === 0 ? '#f59e0b' : '#6366f1'}80)` }} />
          <text x={toX(i)} y={toY(t) - 9} textAnchor="middle" fontSize="9" fill="#94a3b8">{t}</text>
        </g>
      ))}

      {/* Head marker (last visible) */}
      {visiblePath.length >= 1 && (
        <circle cx={toX(visiblePath.length - 1)} cy={toY(visiblePath[visiblePath.length - 1])}
          r={8} fill="none" stroke="#22d3ee" strokeWidth="2"
          style={{ filter: 'drop-shadow(0 0 6px #22d3ee)' }} />
      )}
    </svg>
  )
}

export default function SeekPage() {
  const [head, setHead] = useState(50)
  const [requestInput, setRequestInput] = useState('')
  const [requests, setRequests] = useState([82, 170, 43, 140, 24, 16, 190])
  const [algo, setAlgo] = useState('fcfs')
  const [results, setResults] = useState(null)
  const [animProgress, setAnimProgress] = useState(1)
  const [running, setRunning] = useState(false)
  const animRef = useRef(null)

  const addRequest = () => {
    const vals = requestInput.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n >= 0 && n <= MAX_TRACK)
    if (vals.length) { setRequests(prev => [...new Set([...prev, ...vals])].slice(0, 20)); setRequestInput('') }
  }

  const removeRequest = (r) => setRequests(prev => prev.filter(x => x !== r))

  const runSimulation = useCallback(() => {
    if (requests.length === 0) return
    const result = runAlgo(algo, head, requests)
    setResults(result)
    setRunning(true)
    setAnimProgress(0)
    let start = null
    const duration = Math.min(3000, result.path.length * 350)
    const animate = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setAnimProgress(p)
      if (p < 1) animRef.current = requestAnimationFrame(animate)
      else setRunning(false)
    }
    animRef.current = requestAnimationFrame(animate)
  }, [algo, head, requests])

  useEffect(() => () => cancelAnimationFrame(animRef.current), [])

  const reset = () => { setResults(null); setAnimProgress(1); setRunning(false); cancelAnimationFrame(animRef.current) }

  // Compare all algorithms
  const allResults = requests.length > 0
    ? ALGORITHMS.map(a => ({ ...a, ...runAlgo(a.id, head, requests) }))
    : []

  const minTotal = allResults.length ? Math.min(...allResults.map(a => a.total)) : 0

  return (
    <PageWrapper>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Activity size={16} className="text-violet-400" />
          <h1 className="font-display font-bold text-xl text-white">Disk Seek Time Simulator</h1>
        </div>
        <p className="text-slate-400 text-sm">Visualize how the disk head moves across tracks for different scheduling algorithms</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Controls */}
        <div className="space-y-4">
          {/* Head position */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-display font-semibold text-sm text-white mb-4">Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Initial Head Position — <span className="text-violet-400 font-mono normal-case">{head}</span></label>
                <input type="range" min="0" max="199" value={head} onChange={e => setHead(Number(e.target.value))}
                  className="w-full accent-violet-500 cursor-pointer" />
                <div className="flex justify-between text-xs text-slate-600 font-mono mt-0.5"><span>0</span><span>199</span></div>
              </div>

              <div>
                <label className="label">Add Track Requests (0–199)</label>
                <div className="flex gap-2">
                  <input className="input-field flex-1" placeholder="e.g. 45 120 88" value={requestInput}
                    onChange={e => setRequestInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addRequest()} />
                  <button onClick={addRequest} className="btn-secondary px-3"><Plus size={15} /></button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Requests ({requests.length})</label>
                  <button onClick={() => setRequests([])} className="text-xs text-slate-600 hover:text-rose-400 transition-colors">Clear all</button>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                  <AnimatePresence>
                    {requests.map(r => (
                      <motion.div key={r} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 group">
                        {r}
                        <button onClick={() => removeRequest(r)} className="text-slate-700 group-hover:text-rose-400 transition-colors ml-0.5">×</button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {requests.length === 0 && <span className="text-xs text-slate-600 font-mono">No requests added</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Algorithm selector */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-display font-semibold text-sm text-white mb-3">Scheduling Algorithm</h3>
            <div className="space-y-2">
              {ALGORITHMS.map(a => (
                <button key={a.id} onClick={() => setAlgo(a.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all text-sm ${
                    algo === a.id ? 'border-violet-500/50 bg-violet-600/15 text-violet-300' : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:border-slate-600'
                  }`}>
                  <div className="font-display font-semibold text-xs">{a.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{a.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Run button */}
          <div className="flex gap-2">
            <button onClick={runSimulation} disabled={running || requests.length === 0} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {running ? <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }} /> : <Play size={14} />}
              {running ? 'Simulating…' : 'Run Simulation'}
            </button>
            <button onClick={reset} className="btn-secondary px-3"><RefreshCw size={15} /></button>
          </div>

          {/* All algo comparison */}
          {allResults.length > 0 && (
            <div className="glass rounded-2xl p-4">
              <h3 className="font-display font-semibold text-sm text-white mb-3">Algorithm Comparison</h3>
              <div className="space-y-2">
                {allResults.sort((a, b) => a.total - b.total).map((a, i) => (
                  <div key={a.id} className={`flex items-center gap-3 px-3 py-2 rounded-xl ${a.total === minTotal ? 'bg-emerald-500/10 border border-emerald-500/25' : 'bg-slate-800/30'}`}>
                    <span className="text-xs font-mono w-4 text-slate-600">#{i + 1}</span>
                    <span className={`text-xs font-display font-semibold flex-1 ${a.total === minTotal ? 'text-emerald-400' : 'text-slate-400'}`}>{a.label}</span>
                    <span className={`text-xs font-mono font-bold ${a.total === minTotal ? 'text-emerald-400' : 'text-slate-300'}`}>{a.total} tracks</span>
                    {a.total === minTotal && <span className="text-[10px] text-emerald-500">BEST</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chart + Result */}
        <div className="xl:col-span-2 space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-base text-white">
                {results ? ALGORITHMS.find(a => a.id === algo)?.label : 'Seek Path'} Visualization
              </h3>
              {results && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30">
                  <span className="text-xs text-slate-400 font-mono">Total Seek:</span>
                  <span className="text-sm font-mono font-bold text-violet-300">{results.total} tracks</span>
                </motion.div>
              )}
            </div>

            {results ? (
              <SeekChart path={results.path} animProgress={animProgress} />
            ) : (
              <div className="flex items-center justify-center h-64 rounded-xl" style={{ background: 'rgba(15,23,42,0.8)', border: '1px dashed #1e293b' }}>
                <div className="text-center">
                  <Activity size={32} className="text-slate-700 mx-auto mb-2" />
                  <p className="text-slate-600 text-sm font-mono">Add requests and click Run Simulation</p>
                </div>
              </div>
            )}
          </div>

          {/* Path sequence */}
          {results && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info size={13} className="text-cyan-400" />
                <h3 className="font-display font-semibold text-sm text-white">Head Movement Path</h3>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {results.path.map((t, i) => (
                  <React.Fragment key={i}>
                    <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(i * 0.05, 1.5) }}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold border"
                      style={{
                        background: i === 0 ? '#f59e0b25' : '#6366f115',
                        borderColor: i === 0 ? '#f59e0b60' : '#6366f140',
                        color: i === 0 ? '#f59e0b' : '#818cf8',
                      }}>
                      {t}{i === 0 && <span className="text-[9px] text-amber-600 ml-1">HEAD</span>}
                    </motion.div>
                    {i < results.path.length - 1 && (
                      <span className="text-slate-700 text-xs">
                        →<span className="text-[9px] text-slate-700 mx-0.5">{Math.abs(results.path[i + 1] - t)}</span>
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Movements: {results.path.length - 1}</span>
                <span className="text-slate-500">Total displacement: <strong className="text-violet-400">{results.total} cylinders</strong></span>
                <span className="text-slate-500">Avg per seek: <strong className="text-cyan-400">{results.path.length > 1 ? (results.total / (results.path.length - 1)).toFixed(1) : 0} tracks</strong></span>
              </div>
            </motion.div>
          )}

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: 'FCFS', col: '#6366f1', note: 'Simple but ignores seek optimization. High variance in seek time.' },
              { title: 'SSTF', col: '#22d3ee', note: 'Greedy nearest-first. Fast but causes starvation for distant tracks.' },
              { title: 'SCAN', col: '#f59e0b', note: 'Like an elevator. Predictable, no starvation. Slightly biased toward middle tracks.' },
              { title: 'C-SCAN', col: '#10b981', note: 'Uniform wait time for all tracks. Jumps back to start after reaching end.' },
            ].map(c => (
              <div key={c.title} className="rounded-xl p-3 border border-slate-700/50 bg-slate-800/30">
                <div className="font-display font-semibold text-xs mb-1" style={{ color: c.col }}>{c.title}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{c.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
