// The front-page plan: shadows follow the real sun over Los Angeles,
// a lamp in the courtyard after dark, or your pointer when you take over.
import { walls, fountain } from '../lib/plan';
import { sunPosition, isDaylight } from '../lib/sun';
import { site } from '../data/site';
import { shadowPath, toSvg } from './shadow';

const svg = document.querySelector<SVGSVGElement>('[data-plan="full"]');
if (svg) {
  const shadow = svg.querySelector<SVGPathElement>('[data-shadow]')!;
  const glow = svg.querySelector<SVGCircleElement>('[data-glow]')!;
  const sun = svg.querySelector<SVGGElement>('[data-sun]')!;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const C = { x: 480, y: 300 };

  const ambient = () => {
    const night = document.documentElement.dataset.theme === 'night';
    if (night) return { x: fountain.x, y: fountain.y, sun: false };
    const s = sunPosition(new Date(), site.place.lat, site.place.lon);
    // Plan north is up. A low sun sits far out (long shadows), a high one close in.
    const el = isDaylight(s.elevation) ? s.elevation : 35;
    const az = (isDaylight(s.elevation) ? s.azimuth : 215) * (Math.PI / 180);
    const dist = 250 + 620 * Math.cos((Math.max(el, 2) * Math.PI) / 180);
    return { x: C.x + Math.sin(az) * dist, y: C.y - Math.cos(az) * dist, sun: true };
  };

  let target = ambient();
  let cur = { x: target.x, y: target.y };
  let reach = still ? 1 : 0;
  let held = false;
  let raf = 0;
  let idle = 0;

  const draw = () => {
    shadow.setAttribute('d', shadowPath(walls, cur.x, cur.y, reach));
    glow.setAttribute('cx', cur.x.toFixed(1));
    glow.setAttribute('cy', cur.y.toFixed(1));
    // the sun itself is usually off the sheet; keep its marker on the margin
    const mx = Math.max(-70, Math.min(990, cur.x)), my = Math.max(-84, Math.min(640, cur.y));
    sun.setAttribute('transform', `translate(${mx.toFixed(1)} ${my.toFixed(1)})`);
    sun.style.opacity = !held && target.sun ? '1' : '0';
  };
  const tick = () => {
    cur.x += (target.x - cur.x) * 0.14;
    cur.y += (target.y - cur.y) * 0.14;
    reach += (1 - reach) * 0.06;
    draw();
    const settled = Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) < 0.3 && reach > 0.995;
    raf = settled ? 0 : requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  const release = () => { held = false; target = ambient(); if (still) { cur = { x: target.x, y: target.y }; draw(); } else kick(); };

  const take = (e: PointerEvent) => {
    if (still) return;
    const [x, y] = toSvg(svg, e.clientX, e.clientY);
    held = true;
    target = { x, y, sun: false };
    kick();
    clearTimeout(idle);
    idle = window.setTimeout(release, e.pointerType === 'mouse' ? 6000 : 2500);
  };
  window.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') take(e); }, { passive: true });
  svg.addEventListener('pointerdown', take, { passive: true });
  document.documentElement.addEventListener('pointerleave', release);
  document.addEventListener('themechange', release);
  setInterval(() => { if (!held) release(); }, 60000);

  draw();
  if (!still) kick();
}
