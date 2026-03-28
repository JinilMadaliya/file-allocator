import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Database, AlertTriangle } from 'lucide-react'

const PRESETS = [32, 64, 80, 100, 128, 200]

export default function DiskSizeControl({ diskSize, onResize, fileCount }) {
  const [draft, setDraft] = useState(diskSize)

  const apply = (val) => {
    const n = Math.max(20, Math.min(200, Number(val)))
    setDraft(n)
    onResize(n)
  }

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl px-5 py-4 flex flex-wrap items-center gap-5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-cyan-600/25 flex items-center justify-center">
          <Database size={15} className="text-cyan-400" />
        </div>
        <div>
          <div className="font-display font-semibold text-sm text-white">Disk Size</div>
          <div className="text-xs text-slate-500 font-mono">{diskSize} blocks total</div>
        </div>
      </div>

      {/* Slider */}
      <div className="flex items-center gap-3 flex-1 min-w-[180px]">
        <span className="text-xs font-mono text-slate-600">20</span>
        <input type="range" min="20" max="200" step="4" value={draft}
          onChange={e => setDraft(Number(e.target.value))}
          onMouseUp={e => apply(e.target.value)}
          onTouchEnd={e => apply(e.target.value)}
          className="flex-1 accent-cyan-500 cursor-pointer" />
        <span className="text-xs font-mono text-slate-600">200</span>
        <span className="w-10 text-center text-sm font-mono font-bold text-cyan-400">{draft}</span>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {PRESETS.map(p => (
          <button key={p} onClick={() => { setDraft(p); apply(p) }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
              diskSize === p
                ? 'bg-cyan-600/30 border border-cyan-500/50 text-cyan-300'
                : 'bg-slate-800 border border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'
            }`}>{p}</button>
        ))}
      </div>

      {fileCount > 0 && (
        <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono">
          <AlertTriangle size={12} />
          Resize will reset disk
        </div>
      )}
    </motion.div>
  )
}
