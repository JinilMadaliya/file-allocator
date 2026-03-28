// Distinct, vivid colors for files
const FILE_COLORS = [
  { bg: '#6366f1', light: '#818cf8', dark: '#4338ca', text: '#eef2ff' }, // indigo
  { bg: '#22d3ee', light: '#67e8f9', dark: '#0891b2', text: '#083344' }, // cyan
  { bg: '#f59e0b', light: '#fbbf24', dark: '#b45309', text: '#1c1403' }, // amber
  { bg: '#10b981', light: '#34d399', dark: '#047857', text: '#022c22' }, // emerald
  { bg: '#f43f5e', light: '#fb7185', dark: '#be123c', text: '#fff1f2' }, // rose
  { bg: '#a78bfa', light: '#c4b5fd', dark: '#7c3aed', text: '#2e1065' }, // violet
  { bg: '#fb923c', light: '#fdba74', dark: '#c2410c', text: '#1c0a00' }, // orange
  { bg: '#4ade80', light: '#86efac', dark: '#15803d', text: '#052e16' }, // green
  { bg: '#e879f9', light: '#f0abfc', dark: '#a21caf', text: '#2e0636' }, // fuchsia
  { bg: '#38bdf8', light: '#7dd3fc', dark: '#0369a1', text: '#082f49' }, // sky
  { bg: '#fda4af', light: '#fecdd3', dark: '#e11d48', text: '#1f0208' }, // pink
  { bg: '#86efac', light: '#bbf7d0', dark: '#16a34a', text: '#052e16' }, // light green
];

let colorIndex = 0;
export function getNextColor() {
  const color = FILE_COLORS[colorIndex % FILE_COLORS.length];
  colorIndex++;
  return color;
}

export function resetColors() {
  colorIndex = 0;
}
