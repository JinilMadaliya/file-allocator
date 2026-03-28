import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Info } from 'lucide-react'

const CONFIGS = {
  success: { icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
  error: { icon: XCircle, color: '#f43f5e', bg: 'rgba(244,63,94,0.12)', border: 'rgba(244,63,94,0.3)' },
  info: { icon: Info, color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)' },
}

export default function Toast({ msg, type = 'info' }) {
  const cfg = CONFIGS[type] || CONFIGS.info
  const Icon = cfg.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        backdropFilter: 'blur(16px)',
        minWidth: 220,
      }}
    >
      <Icon size={16} style={{ color: cfg.color, flexShrink: 0 }} />
      <span className="text-sm font-mono text-slate-200">{msg}</span>
    </motion.div>
  )
}
