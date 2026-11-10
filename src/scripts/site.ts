import { sunPosition, isDaylight, compass } from '../lib/sun';
import { site } from '../data/site';
import { sheets } from '../data/sheets';

const root = document.documentElement;
const $ = <T extends Element>(s: string) => document.querySelector<T>(s);
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const { lat, lon, tz } = site.place;

/* ── clock & light ─────────────────────────────────────────── */
const clocks = document.querySelectorAll<HTMLTimeElement>('[data-clock]');
const status = $<HTMLElement>('[data-light-status]');
const lightBtn = $<HTMLButtonElement>('[data-light-btn]');
const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
const store = (k: string, v: string | null) => { try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} };

function refresh() {
  const now = new Date();
  clocks.forEach((c) => { c.textContent = fmt.format(now); c.dateTime = now.toISOString(); });
  const s = sunPosition(now, lat, lon);
  const up = isDaylight(s.elevation);
  const mode = root.dataset.light ?? 'auto';
  if (mode === 'auto') {
    const want = up ? 'day' : 'night';
    if (root.dataset.theme !== want) { root.dataset.theme = want; document.dispatchEvent(new Event('themechange')); }
  }
  if (status) status.textContent = up ? `Sun ${Math.round(s.elevation)}° up, ${compass(s.azimuth)}` : 'Sun down, lamp lit';
  if (lightBtn) lightBtn.textContent = mode === 'auto' ? 'Auto' : mode === 'day' ? 'Day' : 'Night';
}
function cycleLight() {
  const order = ['auto', 'day', 'night'];
  const next = order[(order.indexOf(root.dataset.light ?? 'auto') + 1) % 3];
  root.dataset.light = next;
  store('light', next === 'auto' ? null : next);
  if (next !== 'auto') root.dataset.theme = next;
  refresh();
  document.dispatchEvent(new Event('themechange'));
  toast(next === 'auto' ? 'Light: following the sun' : `Light: ${next}, held`);
}
lightBtn?.addEventListener('click', cycleLight);
refresh();
setInterval(refresh, 1000);

/* ── grid ──────────────────────────────────────────────────── */
const gridBtn = $<HTMLButtonElement>('[data-grid-btn]');
const syncGrid = () => gridBtn?.setAttribute('aria-pressed', String(root.dataset.grid === '1'));
function toggleGrid() {
  if (root.dataset.grid === '1') { delete root.dataset.grid; store('grid', null); }
  else { root.dataset.grid = '1'; store('grid', '1'); }
  syncGrid();
}
gridBtn?.addEventListener('click', toggleGrid);
syncGrid();

/* ── legend ────────────────────────────────────────────────── */
const legend = $<HTMLDialogElement>('[data-legend]');
const openLegend = () => { if (legend && !legend.open) legend.showModal(); };
$('[data-legend-btn]')?.addEventListener('click', openLegend);
legend?.addEventListener('click', (e) => { if (e.target === legend) legend.close(); });

/* ── rail (small screens) ──────────────────────────────────── */
const rail = $<HTMLElement>('[data-rail]');
const railToggle = $<HTMLButtonElement>('[data-rail-toggle]');
const setRail = (open: boolean) => {
  rail?.classList.toggle('is-open', open);
  railToggle?.setAttribute('aria-expanded', String(open));
  const label = $('[data-rail-label]'); if (label) label.textContent = open ? 'Close' : 'Sheets';
};
railToggle?.addEventListener('click', () => setRail(!rail?.classList.contains('is-open')));

/* ── list ↔ plan: hovering one lights the other ─────────────── */
const roomEls = document.querySelectorAll<HTMLElement>('[data-room]:not(body)');
const hot = (room: string | null) => roomEls.forEach((el) => el.classList.toggle('is-hot', !!room && el.dataset.room === room));
roomEls.forEach((el) => {
  if (!el.matches('a')) return;
  el.addEventListener('pointerenter', () => hot(el.dataset.room!));
  el.addEventListener('pointerleave', () => hot(null));
  el.addEventListener('focus', () => hot(el.dataset.room!));
  el.addEventListener('blur', () => hot(null));
});

/* ── toast ─────────────────────────────────────────────────── */
const toastEl = $<HTMLElement>('[data-toast]');
let toastT = 0;
function toast(msg: string) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('is-on');
  clearTimeout(toastT);
  toastT = window.setTimeout(() => toastEl.classList.remove('is-on'), 2600);
}
document.addEventListener('toast', (e) => toast((e as CustomEvent<string>).detail));

/* ── keys ──────────────────────────────────────────────────── */
let typed = '';
document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const t = e.target as HTMLElement;
  if (t.closest('input, textarea, select, [contenteditable], [data-keys-off]')) return;
  if (e.key === 'Escape') { setRail(false); return; }
  if (legend?.open) return;
  const k = e.key.toLowerCase();
  if (k >= '1' && k <= '7') { location.href = base + sheets[Number(k) - 1].path; return; }
  if (k === '?') { e.preventDefault(); openLegend(); return; }
  if (k === 'n') cycleLight();
  if (k === 'g') toggleGrid();
  // a small courtesy for anyone who greets the house
  if (k.length === 1) {
    typed = (typed + k).slice(-6);
    if (typed.endsWith('salam')) { typed = ''; toast('wa ʿalaykum as-salām'); }
  }
});

console.info('%cRifat Hasan%c  seven sheets. Press ? for the legend.', 'font:italic 20px Georgia,serif', 'font:12px monospace');
