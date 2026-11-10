import type { Rect } from '../lib/plan';

type P = [number, number];

function hull(pts: P[]): P[] {
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: P, a: P, b: P) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const build = (list: P[]) => {
    const out: P[] = [];
    for (const p of list) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 0) out.pop();
      out.push(p);
    }
    out.pop();
    return out;
  };
  return build(pts).concat(build(pts.slice().reverse()));
}

/**
 * One SVG path: every wall's shadow thrown away from a point light.
 * Each corner is pushed along its ray from the light; the shadow is the
 * convex hull of the wall and its pushed copy. `reach` scales the length.
 */
export function shadowPath(rects: Rect[], lx: number, ly: number, reach = 1): string {
  let d = '';
  for (const r of rects) {
    const corners: P[] = [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.h], [r.x, r.y + r.h]];
    const pts: P[] = corners.slice();
    for (const [cx, cy] of corners) {
      const dx = cx - lx, dy = cy - ly;
      const dist = Math.hypot(dx, dy) || 1;
      const len = (Math.min(dist * 0.12, 84) + 4) * reach;
      pts.push([cx + (dx / dist) * len, cy + (dy / dist) * len]);
    }
    const hp = hull(pts);
    d += 'M' + hp.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z';
  }
  return d;
}

/** Client coordinates → the SVG's own coordinate system. */
export function toSvg(svg: SVGSVGElement, clientX: number, clientY: number): P {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const p = new DOMPoint(clientX, clientY).matrixTransform(m.inverse());
  return [p.x, p.y];
}
