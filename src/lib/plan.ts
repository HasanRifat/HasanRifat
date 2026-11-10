// The house, as data. Units are arbitrary; the footprint is 960 × 600.
// Walls are axis-aligned rectangles so the shadow engine can stay simple.
export type Rect = { x: number; y: number; w: number; h: number };
export const T = 12; // wall thickness

const h = (x1: number, x2: number, y: number): Rect => ({ x: x1, y: y - T / 2, w: x2 - x1, h: T });
const v = (y1: number, y2: number, x: number): Rect => ({ x: x - T / 2, y: y1, w: T, h: y2 - y1 });
const col = (x: number, y: number): Rect => ({ x: x - 8, y: y - 8, w: 16, h: 16 });

export const walls: Rect[] = [
  // envelope
  h(-6, 966, 0), v(-6, 606, 0), v(-6, 606, 960),
  h(-6, 266, 600), h(634, 820, 600), h(900, 966, 600),
  // workshop | laboratory | library
  v(0, 150, 400), v(210, 260, 400),
  v(0, 60, 640), v(120, 266, 640),
  // the long wall under the north rooms
  h(0, 100, 260), h(160, 300, 260), h(360, 490, 260), h(550, 640, 260),
  // sitting room | courtyard | hall
  v(260, 400, 260), v(470, 600, 260),
  v(266, 430, 640), v(500, 600, 640),
  // library | hall
  h(640, 830, 340), h(900, 960, 340),
  // courtyard colonnade
  col(355, 600), col(450, 600), col(545, 600),
];

// hinge → closed jamb → open leaf end
export const doors = [
  { h: [100, 260], c: [160, 260], o: [100, 320] },
  { h: [360, 260], c: [300, 260], o: [360, 320] },
  { h: [490, 260], c: [550, 260], o: [490, 320] },
  { h: [400, 210], c: [400, 150], o: [460, 210] },
  { h: [640, 60], c: [640, 120], o: [700, 60] },
  { h: [260, 400], c: [260, 470], o: [190, 400] },
  { h: [640, 500], c: [640, 430], o: [710, 500] },
  { h: [900, 340], c: [830, 340], o: [900, 270] },
  { h: [820, 600], c: [900, 600], o: [820, 520], front: true },
] as { h: number[]; c: number[]; o: number[]; front?: boolean }[];

export const doorPath = (d: { h: number[]; c: number[]; o: number[] }) => {
  const r = Math.hypot(d.c[0] - d.h[0], d.c[1] - d.h[1]);
  const cross = (d.o[0] - d.h[0]) * (d.c[1] - d.h[1]) - (d.o[1] - d.h[1]) * (d.c[0] - d.h[0]);
  return `M${d.h[0]} ${d.h[1]}L${d.o[0]} ${d.o[1]}A${r} ${r} 0 0 ${cross > 0 ? 1 : 0} ${d.c[0]} ${d.c[1]}`;
};

export const rooms = {
  workshop: { x: 0, y: 0, w: 400, h: 260 },
  lab: { x: 400, y: 0, w: 240, h: 260 },
  library: { x: 640, y: 0, w: 320, h: 340 },
  sitting: { x: 0, y: 260, w: 260, h: 340 },
  courtyard: { x: 260, y: 260, w: 380, h: 340 },
  door: { x: 640, y: 340, w: 320, h: 260 },
} as const;

export const fountain = { x: 450, y: 430 };
