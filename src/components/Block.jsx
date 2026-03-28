import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function Block({ block, isHighlighted, fileInfo }) {
  const [hovered, setHovered] = useState(false)
  const occupied = !!block.fileId
  const color = block.color

  return (
    <motion.div
      layout
      initial={occupied ? { scale: 0, opacity: 0 } : false}
      animate={{
        scale: isHighlighted ? [1, 1.25, 1] : 1,
        opacity: 1,
      }}
      transition={
        isHighlighted
          ? { duration: 0.3, times: [0, 0.4, 1] }
          : { type: 'spring', stiffness: 400, damping: 20 }
      }
      className="relative aspect-square rounded-lg cursor-default select-none"
      style={{
        background: occupied
          ? `linear-gradient(135deg, ${color.bg}dd, ${color.dark}aa)`
          : 'rgba(30, 41, 59, 0.6)',
        border: occupied
          ? `1px solid ${color.light}55`
          : '1px solid rgba(51, 65, 85, 0.5)',
        boxShadow: occupied
          ? `0 0 ${isHighlighted ? 16 : 8}px ${color.bg}55, inset 0 1px 0 ${color.light}30`
          : 'none',
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Block number */}
      <span className="absolute top-0.5 left-1 text-[8px] font-mono leading-none"
        style={{ color: occupied ? `${color.light}99` : '#334155' }}>
        {block.id}
      </span>

      {/* Index block indicator */}
      {block.isIndex && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-sm border flex items-center justify-center"
            style={{ borderColor: color.light, background: `${color.light}30` }}>
            <span className="text-[5px] font-mono font-bold" style={{ color: color.light }}>IDX</span>
          </div>
        </div>
      )}

      {/* Linked arrow indicator */}
      {block.linkedNext !== null && block.linkedNext !== undefined && (
        <div className="absolute bottom-0.5 right-0.5">
          <div className="text-[7px]" style={{ color: color.light }}>→</div>
        </div>
      )}

      {/* Occupied fill pattern */}
      {occupied && !block.isIndex && (
        <div className="absolute inset-0 rounded-lg overflow-hidden opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 3px, ${color.light}40 3px, ${color.light}40 4px)`,
          }} />
      )}

      {/* Tooltip */}
      {hovered && occupied && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1 pointer-events-none"
        >
          <div className="rounded-lg px-2.5 py-1.5 text-xs font-mono whitespace-nowrap shadow-xl"
            style={{
              background: 'rgba(2, 6, 23, 0.95)',
              border: `1px solid ${color.bg}70`,
              color: color.light,
              backdropFilter: 'blur(8px)',
            }}>
            <div className="font-semibold">{block.fileName}</div>
            <div className="text-slate-500 text-[10px]">
              Block #{block.id}
              {block.isIndex && ' · INDEX'}
              {block.linkedNext !== null && block.linkedNext !== undefined && ` → #${block.linkedNext}`}
            </div>
          </div>
          {/* Arrow */}
          <div className="w-2 h-2 mx-auto -mt-1 rotate-45 rounded-sm"
            style={{ background: 'rgba(2, 6, 23, 0.95)', border: `1px solid ${color.bg}70` }} />
        </motion.div>
      )}

      {/* Highlight pulse ring */}
      {isHighlighted && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={{ opacity: 0.8, scale: 0.9 }}
          animate={{ opacity: 0, scale: 1.4 }}
          transition={{ duration: 0.5 }}
          style={{ border: `2px solid ${color?.bg || '#6366f1'}` }}
        />
      )}
    </motion.div>
  )
}
