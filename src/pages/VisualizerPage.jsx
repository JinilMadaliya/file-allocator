import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import ControlPanel from '../components/ControlPanel'
import DiskGrid from '../components/DiskGrid'
import StatsPanel from '../components/StatsPanel'
import Toast from '../components/Toast'
import DiskSizeControl from '../components/DiskSizeControl'
import ActivityLog from '../components/ActivityLog'
import { contiguousAllocate, linkedAllocate, indexedAllocate } from '../logic/allocation'
import { getNextColor, resetColors } from '../logic/colors'

function initDisk(size) {
  return Array.from({ length: size }, (_, i) => ({
    id: i, fileId: null, fileName: null, color: null, isIndex: false, linkedNext: null,
  }))
}

export default function VisualizerPage() {
  const [diskSize, setDiskSize] = useState(80)
  const [disk, setDisk] = useState(() => initDisk(80))
  const [files, setFiles] = useState([])
  const [allocating, setAllocating] = useState(false)
  const [highlightBlocks, setHighlightBlocks] = useState([])
  const [toast, setToast] = useState(null)
  const [animSpeed, setAnimSpeed] = useState(120)
  const [stepMode, setStepMode] = useState(false)
  const [pendingSteps, setPendingSteps] = useState(null)
  const [log, setLog] = useState([])
  const stepResolveRef = useRef(null)

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }

  const addLog = (entry) => setLog(prev => [{ id: Date.now(), ...entry }, ...prev].slice(0, 40))

  const handleDiskResize = useCallback((newSize) => {
    setDiskSize(newSize)
    setDisk(initDisk(newSize))
    setFiles([])
    setHighlightBlocks([])
    setAllocating(false)
    setPendingSteps(null)
    resetColors()
    setLog([])
    showToast(`Disk resized to ${newSize} blocks`, 'info')
  }, [])

  const allocateFile = useCallback(async ({ name, size, method }) => {
    if (allocating) return
    if (!name.trim()) { showToast('Enter a file name', 'error'); return }
    if (size < 1 || size > Math.floor(diskSize * 0.4)) { showToast(`Size must be 1–${Math.floor(diskSize * 0.4)} blocks`, 'error'); return }
    if (files.find(f => f.name === name)) { showToast(`"${name}" already exists`, 'error'); return }

    setAllocating(true)
    const currentDisk = [...disk]
    let blocksToAllocate = []
    let indexBlock = null

    if (method === 'contiguous') {
      const result = contiguousAllocate(currentDisk, size)
      if (!result) { showToast('Not enough contiguous space!', 'error'); setAllocating(false); return }
      blocksToAllocate = result
    } else if (method === 'linked') {
      const result = linkedAllocate(currentDisk, size)
      if (!result) { showToast('Not enough free blocks!', 'error'); setAllocating(false); return }
      blocksToAllocate = result
    } else if (method === 'indexed') {
      const result = indexedAllocate(currentDisk, size)
      if (!result) { showToast('Not enough free blocks!', 'error'); setAllocating(false); return }
      indexBlock = result.indexBlock
      blocksToAllocate = [result.indexBlock, ...result.dataBlocks]
    }

    const color = getNextColor()
    const fileId = `${name}-${Date.now()}`
    const newDisk = currentDisk.map(b => ({ ...b }))

    for (let i = 0; i < blocksToAllocate.length; i++) {
      const bi = blocksToAllocate[i]
      if (stepMode) {
        await new Promise(resolve => { stepResolveRef.current = resolve; setPendingSteps({ current: i + 1, total: blocksToAllocate.length }) })
      } else {
        await new Promise(r => setTimeout(r, animSpeed))
      }
      newDisk[bi] = {
        ...newDisk[bi], fileId, fileName: name, color, isIndex: method === 'indexed' && bi === indexBlock,
        linkedNext: method === 'linked' && i < blocksToAllocate.length - 1 ? blocksToAllocate[i + 1] : null,
      }
      setDisk([...newDisk])
      setHighlightBlocks([bi])
    }

    setHighlightBlocks([])
    setPendingSteps(null)
    stepResolveRef.current = null

    const fileEntry = { id: fileId, name, method, size, blocks: blocksToAllocate, indexBlock, color }
    setFiles(prev => [...prev, fileEntry])
    addLog({ type: 'alloc', text: `"${name}" allocated — ${blocksToAllocate.length} blocks [${method}]`, color: color.bg })
    showToast(`"${name}" allocated (${blocksToAllocate.length} blocks)`, 'success')
    setAllocating(false)
  }, [disk, files, allocating, animSpeed, stepMode, diskSize])

  const deleteFile = useCallback((fileId) => {
    const f = files.find(f => f.id === fileId)
    setDisk(prev => prev.map(b => b.fileId === fileId
      ? { ...b, fileId: null, fileName: null, color: null, isIndex: false, linkedNext: null } : b))
    setFiles(prev => prev.filter(f => f.id !== fileId))
    if (f) { addLog({ type: 'delete', text: `"${f.name}" deleted — ${f.blocks.length} blocks freed`, color: '#f43f5e' }); showToast(`"${f.name}" deleted`, 'info') }
  }, [files])

  const resetDisk = useCallback(() => {
    setDisk(initDisk(diskSize))
    setFiles([]); setHighlightBlocks([]); setAllocating(false); setPendingSteps(null)
    resetColors(); setLog([])
    showToast('Disk reset', 'info')
  }, [diskSize])

  const advanceStep = () => { if (stepResolveRef.current) { stepResolveRef.current(); stepResolveRef.current = null } }

  return (
    <PageWrapper>
      {/* Page header */}
      <div className="mb-4">
        <h1 className="font-display font-bold text-xl text-white">Disk Block Visualizer</h1>
        <p className="text-slate-400 text-sm">Simulate file allocation on a virtual disk in real-time</p>
      </div>

      {/* Disk Size Control — full width bar */}
      <DiskSizeControl diskSize={diskSize} onResize={handleDiskResize} fileCount={files.length} />

      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col gap-3">
          <ControlPanel
            onAllocate={allocateFile} onReset={resetDisk} onDelete={deleteFile}
            files={files} allocating={allocating} animSpeed={animSpeed} setAnimSpeed={setAnimSpeed}
            stepMode={stepMode} setStepMode={setStepMode} pendingSteps={pendingSteps}
            onAdvanceStep={advanceStep} diskSize={diskSize}
          />
        </aside>
        <section className="flex-1 min-w-0 flex flex-col gap-4">
          <DiskGrid disk={disk} files={files} highlightBlocks={highlightBlocks} diskSize={diskSize} />
          <ActivityLog entries={log} />
        </section>
        <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
          <StatsPanel disk={disk} files={files} />
        </aside>
      </div>

      <AnimatePresence>{toast && <Toast msg={toast.msg} type={toast.type} />}</AnimatePresence>
    </PageWrapper>
  )
}
