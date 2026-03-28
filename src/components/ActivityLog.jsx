import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal } from 'lucide-react'

export default function ActivityLog({ entries }) {
  if (entries.length === 0) return null
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Terminal size={13} className="text-emerald-400" />
        <h3 className="font-display font-semibold text-sm text-slate-200">Activity Log</h3>
        <span className="ml-auto text-xs font-mono text-slate-600">{entries.length} events</span>
      </div>
      <div className="space-y-1 max-h-32 overflow-y-auto font-mono text-xs pr-1">
        <AnimatePresence initial={false}>
          {entries.map(e => (
            <motion.div key={e.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2.5 py-1 border-b border-slate-800/60 last:border-0">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: e.color }} />
              <span className="text-slate-400">{e.text}</span>
              <span className="ml-auto text-slate-700 text-[10px] flex-shrink-0">
                {new Date(e.id).toLocaleTimeString()}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
