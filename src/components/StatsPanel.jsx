import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, PieChart, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { getFragmentation } from '../logic/allocation'

function AnimatedNumber({ value, className }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      {value}
    </motion.span>
  )
}

export default function StatsPanel({ disk, files }) {
  const stats = useMemo(() => {
    const total = disk.length
    const used = disk.filter(b => b.fileId).length
    const free = total - used
    const frag = getFragmentation(disk)
    const methodCounts = { contiguous: 0, linked: 0, indexed: 0 }
    files.forEach(f => { methodCounts[f.method] = (methodCounts[f.method] || 0) + 1 })
    return { total, used, free, frag, methodCounts }
  }, [disk, files])

  const fragLevel = stats.frag.external
  const fragColor = fragLevel < 20 ? '#10b981' : fragLevel < 50 ? '#f59e0b' : '#f43f5e'
  const fragLabel = fragLevel < 20 ? 'Low' : fragLevel < 50 ? 'Moderate' : 'High'

  return (
    <div className="flex flex-col gap-3 pt-1">
      {/* Disk Usage */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl p-4 glass"
        style={{ border: '1px solid rgba(99,102,241,0.15)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={13} className="text-violet-400" />
          <h2 className="font-display font-semibold text-sm text-slate-200">Disk Usage</h2>
        </div>

        {/* Donut-like bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-mono text-slate-500 mb-1.5">
            <span>0</span><span>{stats.total} blocks</span>
          </div>
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 flex">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #22d3ee)' }}
              animate={{ width: `${(stats.used / stats.total) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Total', value: stats.total, color: '#94a3b8' },
            { label: 'Used', value: stats.used, color: '#818cf8' },
            { label: 'Free', value: stats.free, color: '#22d3ee' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-2.5 bg-slate-800/40 border border-slate-700/40 text-center">
              <AnimatedNumber
                value={s.value}
                className="block text-lg font-display font-bold"
                style={{ color: s.color }}
              />
              <div className="text-[10px] font-mono text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Fragmentation */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl p-4 glass"
        style={{ border: '1px solid rgba(99,102,241,0.12)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <PieChart size={13} className="text-amber-400" />
          <h2 className="font-display font-semibold text-sm text-slate-200">Fragmentation</h2>
        </div>

        <div className="space-y-3">
          {/* External fragmentation */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-mono text-slate-400">External</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold" style={{ color: fragColor }}>
                  {fragLevel}%
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono"
                  style={{ background: `${fragColor}20`, color: fragColor }}>
                  {fragLabel}
                </span>
              </div>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: fragColor }}
                animate={{ width: `${fragLevel}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl p-2.5 bg-slate-800/40 border border-slate-700/40">
              <div className="text-sm font-display font-bold text-cyan-400">
                {stats.frag.largest}
              </div>
              <div className="text-[10px] font-mono text-slate-500">Largest free run</div>
            </div>
            <div className="rounded-xl p-2.5 bg-slate-800/40 border border-slate-700/40">
              <div className="text-sm font-display font-bold text-violet-400">
                {stats.frag.runs || 0}
              </div>
              <div className="text-[10px] font-mono text-slate-500">Free segments</div>
            </div>
          </div>

          {/* Fragmentation tip */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl"
            style={{ background: `${fragColor}10`, border: `1px solid ${fragColor}25` }}>
            {fragLevel < 30
              ? <CheckCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: fragColor }} />
              : <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" style={{ color: fragColor }} />
            }
            <p className="text-[10px] font-mono leading-relaxed" style={{ color: fragColor }}>
              {fragLevel < 20
                ? 'Healthy disk state. Contiguous allocation possible.'
                : fragLevel < 50
                ? 'Moderate fragmentation. Linked/indexed recommended.'
                : 'High fragmentation! Large contiguous allocation may fail.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Method Breakdown */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl p-4 glass"
        style={{ border: '1px solid rgba(99,102,241,0.12)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Info size={13} className="text-slate-400" />
          <h2 className="font-display font-semibold text-sm text-slate-200">Method Breakdown</h2>
        </div>

        <div className="space-y-2">
          {[
            { key: 'contiguous', label: 'Contiguous', color: '#6366f1' },
            { key: 'linked', label: 'Linked', color: '#22d3ee' },
            { key: 'indexed', label: 'Indexed', color: '#f59e0b' },
          ].map(m => {
            const count = stats.methodCounts[m.key] || 0
            const total = files.length || 1
            const pct = Math.round((count / total) * 100)
            return (
              <div key={m.key} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: m.color, boxShadow: `0 0 4px ${m.color}80` }} />
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="font-mono text-slate-400">{m.label}</span>
                    <span className="font-mono" style={{ color: m.color }}>{count} file{count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: m.color }}
                      animate={{ width: `${files.length ? pct : 0}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* File Legend */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-2xl p-4 glass"
            style={{ border: '1px solid rgba(99,102,241,0.12)' }}
          >
            <h2 className="font-display font-semibold text-sm text-slate-200 mb-3">Color Legend</h2>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {files.map(f => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-4 h-4 rounded-md flex-shrink-0"
                    style={{ background: f.color.bg, boxShadow: `0 0 6px ${f.color.bg}60` }} />
                  <div className="flex-1 min-w-0 flex items-baseline gap-1.5">
                    <span className="text-xs font-mono text-slate-300 truncate">{f.name}</span>
                    <span className="text-[10px] text-slate-600 flex-shrink-0">{f.blocks.length}b</span>
                  </div>
                  <span className="text-[10px] font-mono capitalize px-1.5 py-0.5 rounded-md flex-shrink-0"
                    style={{ background: `${f.color.bg}20`, color: f.color.light }}>
                    {f.method.slice(0, 4)}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
