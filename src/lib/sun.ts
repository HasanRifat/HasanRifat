// Solar position, low-precision astronomical-almanac formulae (good to ~0.01°
// of what matters here). Self-contained on purpose: the layout serialises
// `sunPosition` into an inline script so the day/night theme is set before paint.
export function sunPosition(date: Date, lat: number, lon: number) {
  const rad = Math.PI / 180;
  const n = date.getTime() / 86400000 + 2440587.5 - 2451545.0;
  const L = (280.46 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) % 360) * rad;
  const lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * rad;
  const eps = (23.439 - 0.0000004 * n) * rad;
  const ra = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda));
  const dec = Math.asin(Math.sin(eps) * Math.sin(lambda));
  const gmst = (18.697374558 + 24.06570982441908 * n) % 24;
  const ha = (gmst * 15 + lon) * rad - ra;
  const phi = lat * rad;
  const elevation = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(ha));
  const azimuth = Math.atan2(Math.sin(ha), Math.cos(ha) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi)) + Math.PI;
  return { azimuth: ((azimuth / rad) % 360 + 360) % 360, elevation: elevation / rad };
}

const HORIZON = -0.833;
export const isDaylight = (elevation: number) => elevation > HORIZON;

/** Sunrise and sunset (as Dates) for the 24 hours starting at `dayStart`. */
export function sunTimes(dayStart: Date, lat: number, lon: number) {
  let rise: Date | null = null;
  let set: Date | null = null;
  let prev = sunPosition(dayStart, lat, lon).elevation;
  for (let m = 1; m <= 1440; m++) {
    const t = new Date(dayStart.getTime() + m * 60000);
    const el = sunPosition(t, lat, lon).elevation;
    if (prev <= HORIZON && el > HORIZON) rise = t;
    if (prev > HORIZON && el <= HORIZON) set = t;
    prev = el;
  }
  return { rise, set };
}

/** The instant of local midnight in `tz` for the day containing `now`. */
export function startOfDay(now: Date, tz: string) {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    .formatToParts(now);
  const v = (t: string) => Number(p.find((x) => x.type === t)!.value);
  return new Date(now.getTime() - (((v('hour') % 24) * 60 + v('minute')) * 60 + v('second')) * 1000 - now.getMilliseconds());
}

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
export const compass = (az: number) => COMPASS[Math.round(az / 45) % 8];
