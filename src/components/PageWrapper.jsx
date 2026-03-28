import React from 'react'
import { motion } from 'framer-motion'

export default function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
      className="px-4 py-5 max-w-[1600px] mx-auto w-full"
    >
      {children}
    </motion.div>
  )
}
