import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import Block from './Block'
import { HardDrive, Activity } from 'lucide-react'

export default function DiskGrid({ disk, files, highlightBlocks }) {
  const highlightSet = useMemo(() => new Set(highlightBlocks), [highlightBlocks])
  const fileMap = useMemo(() => { const m = {}; files.forEach(f => { m[f.id] = f }); return m }, [files])
  const usedCount = disk.filter(b => b.fileId).length
  const pct = Math.round((usedCount / disk.length) * 100)

  // Responsive columns based on disk size
  const cols = disk.length <= 40 ? 'minmax(52px, 1fr)' : disk.length <= 80 ? 'minmax(44px, 1fr)' : 'minmax(36px, 1fr)'

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="rounded-2xl p-5 glass flex flex-col min-h-[400px]">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/25 flex items-center justify-center">
            <HardDrive size={14} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="font-display font-bold text-sm text-slate-200">Disk Surface</h2>
            <p className="text-xs text-slate-500 font-mono">{disk.length} blocks · {usedCount} used · {disk.length - usedCount} free</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Activity size={12} className="text-violet-400" />
          <span className="text-xs font-mono text-slate-400">{pct}%</span>
          <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#6366f1,#22d3ee)' }}
              animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
      </div>

      <div className="grid gap-1.5 flex-1" style={{ gridTemplateColumns: `repeat(auto-fill, ${cols})`, alignContent: 'start' }}>
        {disk.map(block => (
          <Block key={block.id} block={block} isHighlighted={highlightSet.has(block.id)} fileInfo={block.fileId ? fileMap[block.fileId] : null} />
        ))}
      </div>

      <div className="mt-4 flex items-center gap-5 flex-shrink-0 flex-wrap border-t border-slate-800 pt-4">
        {[
          { label: 'Free', visual: <div className="w-4 h-4 rounded bg-slate-800 border border-slate-700" /> },
          { label: 'Data Block', visual: <div className="w-4 h-4 rounded border border-indigo-500/50" style={{ background: 'linear-gradient(135deg,#6366f1dd,#4338caaa)' }} /> },
          { label: 'Index Block', visual: <div className="w-4 h-4 rounded border border-amber-400/50 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f59e0bdd,#b45309aa)' }}><span className="text-[5px] font-mono font-bold text-amber-200">IDX</span></div> },
          { label: 'Linked →', visual: <div className="w-4 h-4 rounded border border-cyan-500/50 flex items-end justify-end" style={{ background: 'linear-gradient(135deg,#22d3eedd,#0891b2aa)' }}><span className="text-[8px] text-cyan-300 leading-none pr-0.5 pb-0.5">→</span></div> },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            {item.visual}
            <span className="text-xs font-mono text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
