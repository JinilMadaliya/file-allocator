import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, RefreshCw, Zap, Layers, Link, LayoutGrid, ChevronRight, Gauge, Footprints } from 'lucide-react'

const METHODS = [
  { value: 'contiguous', label: 'Contiguous', icon: LayoutGrid, desc: 'Sequential blocks', color: '#6366f1' },
  { value: 'linked',     label: 'Linked',     icon: Link,        desc: 'Scattered + pointers', color: '#22d3ee' },
  { value: 'indexed',    label: 'Indexed',    icon: Layers,      desc: 'Index + data blocks',  color: '#f59e0b' },
]

export default function ControlPanel({ onAllocate, onReset, onDelete, files, allocating, animSpeed, setAnimSpeed, stepMode, setStepMode, pendingSteps, onAdvanceStep, diskSize }) {
  const [name, setName] = useState('')
  const [size, setSize] = useState(5)
  const [method, setMethod] = useState('contiguous')
  const maxSize = Math.floor(diskSize * 0.4)

  const handleAllocate = () => { onAllocate({ name: name.trim(), size: parseInt(size), method }); setName(''); setSize(5) }

  return (
    <div className="flex flex-col gap-3">
      {/* New File */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="card">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-violet-600/30 flex items-center justify-center"><Plus size={13} className="text-violet-400" /></div>
          <h2 className="font-display font-semibold text-sm text-slate-200">New File</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="label">File Name</label>
            <input className="input-field" placeholder="e.g. document.txt" value={name}
              onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && !allocating && handleAllocate()} disabled={allocating} />
          </div>
          <div>
            <label className="label">Size — <span className="text-violet-400 normal-case font-mono">{size} block{size !== 1 ? 's' : ''}</span></label>
            <input type="range" min="1" max={maxSize} value={Math.min(size, maxSize)} onChange={e => setSize(e.target.value)} disabled={allocating} className="w-full accent-violet-500 cursor-pointer" />
            <div className="flex justify-between text-xs text-slate-600 font-mono mt-0.5"><span>1</span><span>{Math.floor(maxSize/2)}</span><span>{maxSize}</span></div>
          </div>
          <div>
            <label className="label">Allocation Method</label>
            <div className="space-y-1.5">
              {METHODS.map(m => {
                const Icon = m.icon; const selected = method === m.value
                return (
                  <motion.button key={m.value} onClick={() => !allocating && setMethod(m.value)} disabled={allocating}
                    whileHover={{ x: selected ? 0 : 2 }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-150 text-left ${selected ? '' : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600'}`}
                    style={selected ? { background: `${m.color}15`, borderColor: `${m.color}50` } : {}}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: selected ? `${m.color}25` : 'rgba(51,65,85,0.5)' }}>
                      <Icon size={13} style={{ color: selected ? m.color : '#94a3b8' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-display font-semibold" style={{ color: selected ? m.color : '#cbd5e1' }}>{m.label}</div>
                      <div className="text-xs text-slate-500 truncate">{m.desc}</div>
                    </div>
                    {selected && <motion.div layoutId="sel" className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: m.color }} />}
                  </motion.button>
                )
              })}
            </div>
          </div>
          <motion.button onClick={handleAllocate} disabled={allocating || !name.trim()} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="btn-primary w-full flex items-center justify-center gap-2">
            {allocating
              ? <><motion.div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />Allocating…</>
              : <><Zap size={14} />Allocate File</>}
          </motion.button>
        </div>
      </motion.div>

      {/* Animation controls */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="card">
        <div className="flex items-center gap-2 mb-3"><Gauge size={13} className="text-cyan-400" /><h2 className="font-display font-semibold text-sm text-slate-200">Animation</h2></div>
        <div className="space-y-3">
          <div>
            <label className="label">Speed — <span className="text-cyan-400 normal-case font-mono">{animSpeed <= 50 ? 'Fast' : animSpeed <= 150 ? 'Normal' : 'Slow'}</span></label>
            <input type="range" min="20" max="400" step="20" value={animSpeed} onChange={e => setAnimSpeed(Number(e.target.value))} className="w-full accent-cyan-500 cursor-pointer" />
          </div>
          <button onClick={() => setStepMode(s => !s)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-sm font-display font-medium ${stepMode ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600'}`}>
            <Footprints size={13} />Step-by-Step
            <div className={`ml-auto w-7 h-4 rounded-full transition-colors ${stepMode ? 'bg-amber-500' : 'bg-slate-700'}`}>
              <motion.div className="w-3 h-3 rounded-full bg-white mt-0.5 ml-0.5" animate={{ x: stepMode ? 12 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} />
            </div>
          </button>
          <AnimatePresence>
            {pendingSteps && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-2">
                <div className="text-xs text-slate-400 font-mono text-center">Block {pendingSteps.current} / {pendingSteps.total}</div>
                <button onClick={onAdvanceStep} className="btn-secondary w-full flex items-center justify-center gap-2"><ChevronRight size={14} />Next Block</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* File list */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2"><Layers size={13} className="text-slate-400" /><h2 className="font-display font-semibold text-sm text-slate-200">Allocated Files</h2></div>
          <span className="text-xs font-mono bg-slate-800 border border-slate-700 rounded-md px-2 py-0.5 text-slate-400">{files.length}</span>
        </div>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          <AnimatePresence>
            {files.length === 0
              ? <p className="text-xs text-slate-600 text-center py-4 font-mono">No files allocated</p>
              : files.map(f => (
                <motion.div key={f.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12, scale: 0.9 }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/40 group hover:border-slate-600/60 transition-colors">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: f.color.bg, boxShadow: `0 0 6px ${f.color.bg}60` }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono font-semibold text-slate-300 truncate">{f.name}</div>
                    <div className="text-xs text-slate-600 capitalize">{f.method} · {f.blocks.length}b</div>
                  </div>
                  <motion.button onClick={() => onDelete(f.id)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-lg bg-rose-600/20 flex items-center justify-center text-rose-400 hover:bg-rose-600/40">
                    <Trash2 size={11} />
                  </motion.button>
                </motion.div>
              ))
            }
          </AnimatePresence>
        </div>
        {files.length > 0 && (
          <motion.button onClick={onReset} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="btn-danger w-full flex items-center justify-center gap-2 mt-3">
            <RefreshCw size={13} />Reset Disk
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}
