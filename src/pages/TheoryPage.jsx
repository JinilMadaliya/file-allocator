import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { LayoutGrid, Link, Layers, ChevronRight, ChevronLeft, CheckCircle, XCircle, Info, BookOpen } from 'lucide-react'

const METHODS = [
  {
    id: 'contiguous',
    label: 'Contiguous Allocation',
    icon: LayoutGrid,
    color: '#6366f1',
    light: '#818cf8',
    tagline: 'Files occupy consecutive disk blocks',
    overview: 'In contiguous allocation, each file occupies a set of contiguous (adjacent) blocks on the disk. The directory entry stores the starting block address and the length of the file. This is the simplest allocation strategy and mirrors how arrays work in memory.',
    realWorld: 'Used in CD-ROM file systems (ISO 9660) and older magnetic tape drives where sequential access is dominant.',
    pros: ['Excellent read/write performance — minimal disk head movement', 'Simple directory structure (start + length)', 'Supports both sequential and direct (random) access', 'Easy to implement'],
    cons: ['External fragmentation — holes between files grow over time', 'File size must be declared at creation time', 'Difficult to grow a file if next blocks are occupied', 'Compaction is expensive (O(n) disk writes)'],
    complexity: { access: 'O(1)', space: 'O(n)', directoryEntry: 'Start + Length' },
    steps: [
      { title: 'Directory lookup', desc: 'OS finds file entry — reads start block S and length L from directory.', visual: 'dir' },
      { title: 'Calculate range', desc: 'Blocks S, S+1, S+2, … S+L-1 are identified as belonging to this file.', visual: 'calc' },
      { title: 'Sequential allocation', desc: 'All L blocks are written consecutively. No pointers needed — position implies next block.', visual: 'alloc' },
      { title: 'Direct access', desc: 'To access block i of a file: disk_block = start + i. Constant time lookup!', visual: 'access' },
    ],
    formula: 'Block Address = Start + Offset',
    fragType: 'External Fragmentation',
  },
  {
    id: 'linked',
    label: 'Linked Allocation',
    icon: Link,
    color: '#22d3ee',
    light: '#67e8f9',
    tagline: 'Each block holds a pointer to the next block',
    overview: 'In linked allocation, each file is a linked list of disk blocks scattered anywhere on the disk. Each block contains a pointer (usually 4 bytes) to the next block. The directory stores only the first block address. The last block points to null (end of file).',
    realWorld: 'The FAT (File Allocation Table) file system used in Windows and USB drives is a variation of linked allocation where the pointer chain is stored in a separate table rather than inside each block.',
    pros: ['No external fragmentation — any free block can be used', 'Files can grow dynamically without pre-declaring size', 'No compaction needed', 'Simple free-space management'],
    cons: ['No direct access — must follow pointers sequentially (O(n) for block n)', 'Pointer storage wastes disk space (4 bytes/block)', 'Reliability risk — one bad pointer corrupts entire file chain', 'Poor cache performance due to scattered access'],
    complexity: { access: 'O(n)', space: 'O(n) + pointer overhead', directoryEntry: 'Start Block only' },
    steps: [
      { title: 'Directory lookup', desc: 'OS reads the starting block address from the directory entry.', visual: 'dir' },
      { title: 'Read first block', desc: 'Load block at start address. The last few bytes contain a pointer to next block.', visual: 'read1' },
      { title: 'Follow the chain', desc: 'Jump to next block, read data + pointer. Repeat until NULL pointer (EOF).', visual: 'chain' },
      { title: 'Random access cost', desc: 'To reach block i, must traverse i blocks from the start. No shortcut!', visual: 'random' },
    ],
    formula: 'Next Block = pointer stored in current block',
    fragType: 'Internal Fragmentation (pointer space)',
  },
  {
    id: 'indexed',
    label: 'Indexed Allocation',
    icon: Layers,
    color: '#f59e0b',
    light: '#fbbf24',
    tagline: 'One index block stores all block addresses',
    overview: 'Indexed allocation solves the direct-access problem of linked allocation. Each file has one special index block that contains an array of pointers to all the file\'s data blocks. The directory entry points to this index block. UNIX i-nodes use a multi-level variation of this approach.',
    realWorld: 'UNIX/Linux ext2/ext3/ext4 use i-nodes — a sophisticated multi-level indexed structure with direct, single-indirect, double-indirect, and triple-indirect block pointers to support files from tiny to several terabytes.',
    pros: ['Supports direct access — O(1) for any block via index', 'No external fragmentation', 'Files can grow dynamically (add entries to index)', 'Index block consolidates all metadata in one place'],
    cons: ['Index block consumes one full disk block overhead', 'Small files waste an entire block just for the index', 'Index block itself can be a bottleneck / single point of failure', 'Very large files may need multi-level indexing'],
    complexity: { access: 'O(1)', space: 'O(n) + 1 index block', directoryEntry: 'Index Block address' },
    steps: [
      { title: 'Directory → Index Block', desc: 'Directory stores address of the index block (not data directly).', visual: 'dir' },
      { title: 'Load index block', desc: 'Index block is read into memory — it contains an array of N pointers, one per data block.', visual: 'index' },
      { title: 'Look up pointer array', desc: 'To access data block i, read pointer[i] from the index. This gives the actual disk address.', visual: 'lookup' },
      { title: 'Fetch data block', desc: 'Go directly to that disk address. No chain traversal needed — true O(1) random access!', visual: 'fetch' },
    ],
    formula: 'Block Address = IndexBlock[i]',
    fragType: 'Internal Fragmentation (index block waste for small files)',
  },
]

function BlockViz({ method, step, color }) {
  const blocks = Array.from({ length: 10 }, (_, i) => i)
  if (method === 'contiguous') {
    const allocated = step >= 2 ? [3, 4, 5, 6] : []
    const highlight = step === 3 ? [3 + 2] : step === 2 ? [3, 4, 5, 6] : []
    return (
      <div className="flex gap-1 flex-wrap justify-center">
        {blocks.map(i => (
          <motion.div key={i} className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-mono border"
            animate={{ scale: highlight.includes(i) ? 1.2 : 1 }}
            style={{
              background: allocated.includes(i) ? `${color}30` : 'rgba(30,41,59,0.6)',
              borderColor: allocated.includes(i) ? `${color}80` : '#334155',
              color: allocated.includes(i) ? color : '#475569',
              boxShadow: highlight.includes(i) ? `0 0 12px ${color}80` : 'none',
            }}>{i}</motion.div>
        ))}
        {step === 0 && <div className="w-full text-center text-xs text-slate-500 font-mono mt-2">Directory → start=3, len=4</div>}
        {step === 3 && <div className="w-full text-center text-xs font-mono mt-2" style={{ color }}>Access block 2 → disk[3+2] = disk[5] ✓</div>}
      </div>
    )
  }
  if (method === 'linked') {
    const chain = [1, 5, 3, 8]
    const visible = step === 0 ? [] : step === 1 ? [chain[0]] : step === 2 ? chain.slice(0, 3) : chain
    return (
      <div className="flex gap-1 flex-wrap justify-center">
        {blocks.map(i => {
          const chainIdx = chain.indexOf(i)
          const isVisible = visible.includes(i)
          const hasNext = isVisible && chainIdx < chain.length - 1 && visible.includes(chain[chainIdx + 1])
          return (
            <motion.div key={i} animate={{ scale: isVisible ? 1.05 : 1 }}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-mono border relative"
              style={{
                background: isVisible ? `${color}25` : 'rgba(30,41,59,0.6)',
                borderColor: isVisible ? `${color}70` : '#334155',
                color: isVisible ? color : '#475569',
              }}>
              {i}
              {hasNext && <span className="absolute -right-2 text-[10px] z-10" style={{ color }}>→</span>}
            </motion.div>
          )
        })}
        {step === 3 && <div className="w-full text-center text-xs font-mono mt-2 text-rose-400">To reach block 3: must read 1→5→3 (3 disk seeks!)</div>}
      </div>
    )
  }
  if (method === 'indexed') {
    const indexBlock = 2
    const dataBlocks = [0, 4, 7, 9]
    const showIndex = step >= 1
    const showData = step >= 2
    const highlight = step === 3 ? [dataBlocks[2]] : []
    return (
      <div className="space-y-3">
        <div className="flex gap-1 flex-wrap justify-center">
          {blocks.map(i => {
            const isIdx = i === indexBlock && showIndex
            const isData = dataBlocks.includes(i) && showData
            const isHl = highlight.includes(i)
            return (
              <motion.div key={i} animate={{ scale: isHl ? 1.2 : 1 }}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-mono border"
                style={{
                  background: isIdx ? '#f59e0b30' : isData ? `${color}25` : 'rgba(30,41,59,0.6)',
                  borderColor: isIdx ? '#f59e0b80' : isData ? `${color}60` : '#334155',
                  color: isIdx ? '#f59e0b' : isData ? color : '#475569',
                  boxShadow: isHl ? `0 0 12px ${color}80` : 'none',
                }}>
                {isIdx ? 'IDX' : i}
              </motion.div>
            )
          })}
        </div>
        {showIndex && <div className="text-center text-xs font-mono" style={{ color: '#f59e0b' }}>Index Block [2] → [0, 4, 7, 9]</div>}
        {step === 3 && <div className="text-center text-xs font-mono" style={{ color }}>Access[2] → Index[2] = block 7 → direct jump ✓</div>}
      </div>
    )
  }
  return null
}

function MethodCard({ method, active, onClick }) {
  const Icon = method.icon
  return (
    <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={onClick}
      className={`w-full text-left rounded-2xl p-5 border transition-all duration-200 ${
        active ? 'border-opacity-60' : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600'
      }`}
      style={active ? { background: `${method.color}12`, borderColor: `${method.color}55` } : {}}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${method.color}25` }}>
          <Icon size={16} style={{ color: method.color }} />
        </div>
        <div>
          <div className="font-display font-bold text-sm text-white">{method.label}</div>
          <div className="text-xs text-slate-500">{method.tagline}</div>
        </div>
      </div>
    </motion.button>
  )
}

export default function TheoryPage() {
  const [activeId, setActiveId] = useState('contiguous')
  const [stepIdx, setStepIdx] = useState(0)
  const method = METHODS.find(m => m.id === activeId)
  const Icon = method.icon

  const nextStep = () => setStepIdx(i => Math.min(i + 1, method.steps.length - 1))
  const prevStep = () => setStepIdx(i => Math.max(i - 1, 0))

  const switchMethod = (id) => { setActiveId(id); setStepIdx(0) }

  return (
    <PageWrapper>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={16} className="text-violet-400" />
          <h1 className="font-display font-bold text-xl text-white">Theory & Concepts</h1>
        </div>
        <p className="text-slate-400 text-sm">Interactive deep-dive into each file allocation strategy with animated walkthroughs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {METHODS.map(m => <MethodCard key={m.id} method={m} active={activeId === m.id} onClick={() => switchMethod(m.id)} />)}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeId} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }} className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Main theory content */}
          <div className="xl:col-span-2 space-y-4">
            {/* Overview */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${method.color}25` }}>
                  <Icon size={18} style={{ color: method.color }} />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-white">{method.label}</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: `${method.color}20`, color: method.color }}>
                    {method.fragType}
                  </span>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">{method.overview}</p>

              {/* Formula */}
              <div className="rounded-xl px-4 py-3 font-mono text-sm" style={{ background: `${method.color}12`, border: `1px solid ${method.color}30` }}>
                <span className="text-slate-500 text-xs">Formula: </span>
                <span style={{ color: method.light }}>{method.formula}</span>
              </div>
            </div>

            {/* Step-by-step walkthrough */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-bold text-base text-white">Step-by-Step Walkthrough</h3>
                <div className="flex items-center gap-2">
                  {method.steps.map((_, i) => (
                    <button key={i} onClick={() => setStepIdx(i)}
                      className="w-2.5 h-2.5 rounded-full transition-all"
                      style={{ background: i === stepIdx ? method.color : '#334155', transform: i === stepIdx ? 'scale(1.3)' : 'scale(1)' }} />
                  ))}
                </div>
              </div>

              {/* Visual */}
              <div className="rounded-xl p-5 mb-5 min-h-[120px] flex items-center justify-center"
                style={{ background: 'rgba(15,23,42,0.6)', border: `1px solid ${method.color}20` }}>
                <AnimatePresence mode="wait">
                  <motion.div key={stepIdx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="w-full">
                    <BlockViz method={method.id} step={stepIdx} color={method.color} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Step description */}
              <AnimatePresence mode="wait">
                <motion.div key={stepIdx} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="rounded-xl p-4 mb-5" style={{ background: `${method.color}10`, border: `1px solid ${method.color}25` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold"
                      style={{ background: method.color, color: '#000' }}>{stepIdx + 1}</div>
                    <span className="font-display font-semibold text-sm text-white">{method.steps[stepIdx].title}</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed pl-7">{method.steps[stepIdx].desc}</p>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-3">
                <button onClick={prevStep} disabled={stepIdx === 0} className="btn-secondary flex items-center gap-1.5 disabled:opacity-30">
                  <ChevronLeft size={14} /> Prev
                </button>
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: method.color }}
                    animate={{ width: `${((stepIdx + 1) / method.steps.length) * 100}%` }} />
                </div>
                <button onClick={nextStep} disabled={stepIdx === method.steps.length - 1} className="btn-primary flex items-center gap-1.5 disabled:opacity-30">
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Real-world */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info size={14} className="text-cyan-400" />
                <h3 className="font-display font-semibold text-sm text-white">Real-World Usage</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{method.realWorld}</p>
            </div>
          </div>

          {/* Right column: Pros/Cons + Complexity */}
          <div className="space-y-4">
            {/* Pros */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={14} className="text-emerald-400" />
                <h3 className="font-display font-semibold text-sm text-emerald-400">Advantages</h3>
              </div>
              <ul className="space-y-2.5">
                {method.pros.map((p, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-2.5 text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    {p}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <XCircle size={14} className="text-rose-400" />
                <h3 className="font-display font-semibold text-sm text-rose-400">Disadvantages</h3>
              </div>
              <ul className="space-y-2.5">
                {method.cons.map((c, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-2.5 text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                    {c}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Complexity */}
            <div className="glass rounded-2xl p-5">
              <h3 className="font-display font-semibold text-sm text-white mb-4">Complexity Analysis</h3>
              <div className="space-y-3">
                {Object.entries(method.complexity).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between gap-3 py-2 border-b border-slate-800 last:border-0">
                    <span className="text-xs text-slate-500 font-mono capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-xs font-mono font-bold" style={{ color: method.light }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </PageWrapper>
  )
}
