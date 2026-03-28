// allocation.js — core disk allocation algorithms

export function contiguousAllocate(disk, size) {
  let count = 0, start = -1
  for (let i = 0; i < disk.length; i++) {
    if (!disk[i].fileId) {
      if (start === -1) start = i
      count++
      if (count === size) return Array.from({ length: size }, (_, k) => start + k)
    } else { count = 0; start = -1 }
  }
  return null
}

export function linkedAllocate(disk, size) {
  const free = disk.map((b, i) => (!b.fileId ? i : -1)).filter(i => i !== -1)
  if (free.length < size) return null
  const step = Math.max(1, Math.floor(free.length / size))
  const chosen = []
  for (let i = 0; i < size; i++) chosen.push(free[Math.min(i * step, free.length - 1)])
  return [...new Set(chosen)].slice(0, size)
}

export function indexedAllocate(disk, size) {
  const needed = size + 1
  const free = disk.map((b, i) => (!b.fileId ? i : -1)).filter(i => i !== -1)
  if (free.length < needed) return null
  return { indexBlock: free[0], dataBlocks: free.slice(1, needed) }
}

export function getFragmentation(disk) {
  const freeBlocks = disk.filter(b => !b.fileId)
  if (freeBlocks.length === 0) return { external: 0, largest: 0, freeCount: 0, runs: 0 }
  let runs = 0, largest = 0, current = 0
  for (const block of disk) {
    if (!block.fileId) { current++; largest = Math.max(largest, current) }
    else { if (current > 0) runs++; current = 0 }
  }
  if (current > 0) runs++
  const external = (1 - largest / freeBlocks.length) * 100
  return { external: Math.round(external), largest, freeCount: freeBlocks.length, runs }
}
