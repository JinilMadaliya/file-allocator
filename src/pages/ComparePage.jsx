import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { BarChart3, CheckCircle, XCircle, Trophy, RefreshCw, HelpCircle, ChevronRight } from 'lucide-react'

const TABLE_DATA = [
  { aspect: 'Access Type', contiguous: 'Sequential & Direct', linked: 'Sequential only', indexed: 'Sequential & Direct' },
  { aspect: 'Access Speed', contiguous: 'O(1) — fastest', linked: 'O(n) — slowest', indexed: 'O(1) — fast' },
  { aspect: 'External Fragmentation', contiguous: 'High', linked: 'None', indexed: 'None' },
  { aspect: 'Internal Fragmentation', contiguous: 'None', linked: 'Pointer space waste', indexed: 'Index block waste' },
  { aspect: 'File Size Flexibility', contiguous: 'Fixed at creation', linked: 'Dynamic', indexed: 'Dynamic' },
  { aspect: 'Space Overhead', contiguous: 'None', linked: 'Pointer per block', indexed: 'One index block' },
  { aspect: 'Disk Seek Overhead', contiguous: 'Minimal', linked: 'High (scattered)', indexed: 'Moderate (2 seeks)' },
  { aspect: 'Implementation', contiguous: 'Simple', linked: 'Moderate', indexed: 'Complex' },
  { aspect: 'Real-world Use', contiguous: 'CD-ROM, DVDs', linked: 'FAT file system', indexed: 'UNIX i-nodes (ext4)' },
  { aspect: 'Reliability', contiguous: 'High', linked: 'Low (bad pointer = lost file)', indexed: 'Moderate' },
  { aspect: 'Suitable for', contiguous: 'Read-only, known size', linked: 'Frequent appends', indexed: 'General purpose' },
]

const RATINGS = {
  contiguous: { speed: 5, flexibility: 1, fragmentation: 1, reliability: 5, simplicity: 5 },
  linked:     { speed: 1, flexibility: 5, fragmentation: 5, reliability: 2, simplicity: 3 },
  indexed:    { speed: 4, flexibility: 4, fragmentation: 4, reliability: 4, simplicity: 2 },
}

const QUIZ_QUESTIONS = [
  {
    q: 'Which allocation method requires the file size to be declared before allocation?',
    options: ['Contiguous', 'Linked', 'Indexed', 'All of the above'],
    answer: 0,
    explanation: 'Contiguous allocation must know the file size upfront to find a large enough free space on disk.',
  },
  {
    q: 'FAT (File Allocation Table) file system is a variation of which method?',
    options: ['Contiguous', 'Linked', 'Indexed', 'Hybrid'],
    answer: 1,
    explanation: 'FAT stores the linked-list chain in a separate table (FAT) rather than in each block, but it is fundamentally linked allocation.',
  },
  {
    q: 'To directly access the 10th block of a file using linked allocation, how many disk reads are needed?',
    options: ['1 read', '2 reads', '10 reads', 'Depends on file size'],
    answer: 2,
    explanation: 'You must follow the chain: block0 → block1 → ... → block9. That is 10 sequential reads.',
  },
  {
    q: 'Which method suffers most from external fragmentation?',
    options: ['Indexed', 'Linked', 'Contiguous', 'None of them'],
    answer: 2,
    explanation: 'Contiguous allocation leaves holes (gaps) between files that grow over time — classic external fragmentation.',
  },
  {
    q: 'UNIX i-nodes are an advanced form of which allocation method?',
    options: ['Contiguous', 'Linked', 'Indexed', 'Segmentation'],
    answer: 2,
    explanation: 'i-nodes use multi-level indexed allocation with direct, single-indirect, double-indirect, and triple-indirect block pointers.',
  },
  {
    q: 'Which allocation method has the least disk-head movement for reading a full file?',
    options: ['Indexed', 'Linked', 'Contiguous', 'All are equal'],
    answer: 2,
    explanation: 'Contiguous blocks are stored adjacently, so the disk head moves minimally — ideal for sequential read performance.',
  },
  {
    q: 'An index block in indexed allocation stores:',
    options: ['File metadata', 'Actual file data', 'Pointers to data blocks', 'The next block number'],
    answer: 2,
    explanation: 'The index block contains an array of disk block addresses pointing to the actual data blocks of the file.',
  },
  {
    q: 'Which method is BEST for a file system that stores fixed-size video chapters that never change?',
    options: ['Linked', 'Indexed', 'Contiguous', 'None of the above'],
    answer: 2,
    explanation: 'CD-ROMs and read-only media use contiguous allocation — file size is fixed, no fragmentation occurs, and performance is maximum.',
  },
]

function RatingBar({ value, max = 5, color }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: max }, (_, i) => (
          <motion.div key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.05 }}
            className="w-3 h-3 rounded-sm" style={{ background: i < value ? color : '#1e293b', transformOrigin: 'bottom' }} />
        ))}
      </div>
      <span className="text-xs font-mono text-slate-500">{value}/{max}</span>
    </div>
  )
}

export default function ComparePage() {
  const [quizIdx, setQuizIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [answers, setAnswers] = useState([])

  const q = QUIZ_QUESTIONS[quizIdx]

  const choose = (idx) => {
    if (selected !== null) return
    setSelected(idx)
    const correct = idx === q.answer
    if (correct) setScore(s => s + 1)
    setAnswers(prev => [...prev, { correct, selected: idx, answer: q.answer }])
  }

  const nextQ = () => {
    if (quizIdx + 1 >= QUIZ_QUESTIONS.length) { setDone(true) }
    else { setQuizIdx(i => i + 1); setSelected(null) }
  }

  const resetQuiz = () => { setQuizIdx(0); setSelected(null); setScore(0); setDone(false); setAnswers([]) }

  const scoreColor = score >= 7 ? '#10b981' : score >= 5 ? '#f59e0b' : '#f43f5e'
  const scoreLabel = score >= 7 ? 'Excellent!' : score >= 5 ? 'Good!' : 'Keep studying!'

  return (
    <PageWrapper>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={16} className="text-violet-400" />
          <h1 className="font-display font-bold text-xl text-white">Compare & Quiz</h1>
        </div>
        <p className="text-slate-400 text-sm">Side-by-side comparison of all three methods + test your knowledge</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* LEFT: Comparison Table + Ratings */}
        <div className="space-y-4">
          {/* Ratings */}
          <div className="glass rounded-2xl p-5">
            <h2 className="font-display font-bold text-base text-white mb-5">Performance Ratings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-mono text-slate-500 pb-3 pr-4 w-32">Metric</th>
                    {[
                      { label: 'Contiguous', color: '#6366f1' },
                      { label: 'Linked', color: '#22d3ee' },
                      { label: 'Indexed', color: '#f59e0b' },
                    ].map(m => (
                      <th key={m.label} className="text-center pb-3 px-2">
                        <span className="text-xs font-display font-semibold" style={{ color: m.color }}>{m.label}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(RATINGS.contiguous).map(metric => (
                    <tr key={metric} className="border-t border-slate-800">
                      <td className="text-xs text-slate-400 font-mono py-2.5 pr-4 capitalize">{metric}</td>
                      {['contiguous', 'linked', 'indexed'].map((m, i) => {
                        const colors = ['#6366f1', '#22d3ee', '#f59e0b']
                        return (
                          <td key={m} className="py-2.5 px-2">
                            <div className="flex justify-center">
                              <RatingBar value={RATINGS[m][metric]} color={colors[i]} />
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="glass rounded-2xl p-5">
            <h2 className="font-display font-bold text-base text-white mb-4">Feature Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left font-mono text-slate-500 pb-2.5 pr-3">Aspect</th>
                    <th className="text-center font-display text-indigo-400 pb-2.5 px-2">Contiguous</th>
                    <th className="text-center font-display text-cyan-400 pb-2.5 px-2">Linked</th>
                    <th className="text-center font-display text-amber-400 pb-2.5 px-2">Indexed</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE_DATA.map((row, i) => (
                    <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="border-b border-slate-800/60 hover:bg-slate-800/20 transition-colors">
                      <td className="font-mono text-slate-400 py-2 pr-3 font-medium">{row.aspect}</td>
                      <td className="text-center py-2 px-2 text-slate-300">{row.contiguous}</td>
                      <td className="text-center py-2 px-2 text-slate-300">{row.linked}</td>
                      <td className="text-center py-2 px-2 text-slate-300">{row.indexed}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: Quiz */}
        <div>
          <div className="glass rounded-2xl p-6 sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <HelpCircle size={15} className="text-violet-400" />
                <h2 className="font-display font-bold text-base text-white">Knowledge Quiz</h2>
              </div>
              {!done && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">{quizIdx + 1}/{QUIZ_QUESTIONS.length}</span>
                  <div className="flex gap-0.5">
                    {QUIZ_QUESTIONS.map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full"
                        style={{ background: i < quizIdx ? (answers[i]?.correct ? '#10b981' : '#f43f5e') : i === quizIdx ? '#6366f1' : '#1e293b' }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: `${scoreColor}20`, border: `2px solid ${scoreColor}` }}>
                    <Trophy size={32} style={{ color: scoreColor }} />
                  </motion.div>
                  <div className="font-display font-bold text-3xl mb-1" style={{ color: scoreColor }}>{score}/{QUIZ_QUESTIONS.length}</div>
                  <div className="font-display font-semibold text-lg text-white mb-1">{scoreLabel}</div>
                  <div className="text-sm text-slate-400 mb-6">
                    {score >= 7 ? 'You have a strong understanding of file allocation methods.' : score >= 5 ? 'Good grasp — review the theory page for the methods you missed.' : 'Visit the Theory page to strengthen your understanding.'}
                  </div>
                  {/* Score breakdown */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {answers.map((a, i) => (
                      <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono ${a.correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'}`}>
                        {a.correct ? <CheckCircle size={11} /> : <XCircle size={11} />}
                        Q{i + 1}: {a.correct ? 'Correct' : `Should be ${QUIZ_QUESTIONS[i].options[a.answer]}`}
                      </div>
                    ))}
                  </div>
                  <button onClick={resetQuiz} className="btn-primary flex items-center gap-2 mx-auto">
                    <RefreshCw size={14} /> Retake Quiz
                  </button>
                </motion.div>
              ) : (
                <motion.div key={quizIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  {/* Progress bar */}
                  <div className="h-1 bg-slate-800 rounded-full mb-5 overflow-hidden">
                    <motion.div className="h-full rounded-full bg-violet-600"
                      animate={{ width: `${((quizIdx) / QUIZ_QUESTIONS.length) * 100}%` }} />
                  </div>

                  <p className="font-display font-semibold text-white text-base mb-5 leading-snug">{q.q}</p>

                  <div className="space-y-2.5 mb-5">
                    {q.options.map((opt, i) => {
                      let cls = 'border-slate-700 bg-slate-800/40 text-slate-300 hover:border-violet-500/50 hover:bg-violet-600/10'
                      if (selected !== null) {
                        if (i === q.answer) cls = 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300'
                        else if (i === selected && i !== q.answer) cls = 'border-rose-500/60 bg-rose-500/15 text-rose-300'
                        else cls = 'border-slate-800 bg-slate-800/20 text-slate-600'
                      }
                      return (
                        <motion.button key={i} whileHover={selected === null ? { x: 3 } : {}} whileTap={selected === null ? { scale: 0.98 } : {}}
                          onClick={() => choose(i)}
                          className={`quiz-option ${cls} ${selected !== null ? 'cursor-default' : 'cursor-pointer'}`}>
                          <span className="text-slate-600 mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                          {selected !== null && i === q.answer && <CheckCircle size={13} className="inline ml-2 text-emerald-400" />}
                          {selected !== null && i === selected && i !== q.answer && <XCircle size={13} className="inline ml-2 text-rose-400" />}
                        </motion.button>
                      )
                    })}
                  </div>

                  <AnimatePresence>
                    {selected !== null && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className={`rounded-xl px-4 py-3 mb-5 text-sm ${selected === q.answer ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/25 text-rose-300'}`}>
                        <strong>{selected === q.answer ? '✓ Correct! ' : '✗ Incorrect. '}</strong>
                        {q.explanation}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button onClick={nextQ} disabled={selected === null}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-30">
                    {quizIdx + 1 === QUIZ_QUESTIONS.length ? 'See Results' : 'Next Question'}
                    <ChevronRight size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}


