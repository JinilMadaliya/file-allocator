# FileAlloc — Interactive File Allocation Visualizer v2.0

A multi-page OS project demo built with **React 18 + Vite + Tailwind CSS + Framer Motion + React Router**.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📄 Pages & Routes

| Route      | Page            | Description                                              |
|------------|-----------------|----------------------------------------------------------|
| `/`        | Visualizer      | Main disk simulator with dynamic block size              |
| `/theory`  | Theory          | Animated step-by-step walkthroughs for each method       |
| `/compare` | Compare + Quiz  | Feature comparison table + 8-question interactive quiz   |
| `/seek`    | Seek Time       | Disk scheduling simulation (FCFS, SSTF, SCAN, C-SCAN)   |

---

## ✨ Features

### Visualizer Page
- **Dynamic disk size** — slider + presets (32 / 64 / 80 / 100 / 128 / 200 blocks)
- Three allocation methods: **Contiguous**, **Linked**, **Indexed**
- Animated block-by-block allocation with adjustable speed
- **Step-by-step mode** — manually advance one block at a time
- Hover tooltips on every block (file name, block ID, pointer info)
- Delete individual files to free their blocks
- Real-time **Activity Log** with timestamps
- Live **fragmentation meter** and stats panel

### Theory Page
- Deep-dive on all 3 methods with:
  - Overview + real-world usage (CD-ROM, FAT, UNIX ext4)
  - 4-step animated walkthrough with visual block diagrams
  - Pros / Cons lists
  - Complexity analysis (access time, space, directory entry)
  - Formula reference

### Compare Page
- **Performance ratings** (speed, flexibility, fragmentation, reliability, simplicity)
- **11-row feature comparison table** across all 3 methods
- **8-question quiz** with:
  - Instant feedback + explanation
  - Score tracker with visual answer breakdown
  - Retake mode

### Seek Time Page
- Add up to 20 track requests (0–199)
- Adjustable initial head position
- Algorithms: **FCFS**, **SSTF**, **SCAN (Elevator)**, **C-SCAN**
- Animated SVG chart showing head movement path
- Auto-comparison table ranks all algorithms by total seek distance
- Path sequence display with per-step displacement

---

## 📁 Project Structure

```
file-allocator/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx              ← Entry with BrowserRouter
    ├── App.jsx               ← Route definitions + AnimatePresence
    ├── index.css             ← Tailwind + custom glass/glow utilities
    ├── pages/
    │   ├── VisualizerPage.jsx
    │   ├── TheoryPage.jsx
    │   ├── ComparePage.jsx
    │   └── SeekPage.jsx
    ├── components/
    │   ├── Navbar.jsx         ← Sticky nav with mobile hamburger
    │   ├── PageWrapper.jsx    ← Framer Motion page transition wrapper
    │   ├── DiskSizeControl.jsx← Dynamic disk size slider + presets
    │   ├── ControlPanel.jsx   ← File form + method selector + file list
    │   ├── DiskGrid.jsx       ← Responsive block grid
    │   ├── Block.jsx          ← Individual block with tooltip + animations
    │   ├── StatsPanel.jsx     ← Usage, fragmentation, legend
    │   ├── ActivityLog.jsx    ← Real-time event log
    │   └── Toast.jsx          ← Notification toasts
    └── logic/
        ├── allocation.js      ← Contiguous / Linked / Indexed algorithms
        └── colors.js          ← 12-color palette for file distinction
```

---

## 🛠 Tech Stack

| Package          | Version  | Purpose                         |
|------------------|----------|---------------------------------|
| React            | ^18.2    | UI framework                    |
| Vite             | ^5.2     | Build tool + dev server         |
| Tailwind CSS     | ^3.4     | Utility-first styling           |
| Framer Motion    | ^11.0    | Animations + page transitions   |
| React Router DOM | ^6.23    | Multi-page routing              |
| Lucide React     | ^0.395   | Icon library                    |

---

## 📦 Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

The `dist/` folder contains the production-ready static files.

---

## 🎓 Academic Context

This project demonstrates the following OS File System concepts:
- **Contiguous Allocation** — sequential block assignment, external fragmentation
- **Linked Allocation** — FAT-style pointer chains, dynamic growth
- **Indexed Allocation** — UNIX i-node style, O(1) random access
- **Disk Scheduling** — FCFS, SSTF, SCAN, C-SCAN algorithms and seek time optimization
- **Fragmentation Analysis** — external fragmentation calculation, largest free run detection
