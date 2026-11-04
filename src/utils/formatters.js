export function formatWindow(start, end) {
  const fmt = value => `${String(Math.floor(value / 100)).padStart(2, '0')}:${String(value % 100).padStart(2, '0')}`;
  return `${fmt(start)}–${fmt(end)}`;
}
