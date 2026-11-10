// The drawing set. One sheet per section; `room` is the key used on the plan.
export const sheets = [
  { no: 'A-01', room: 'plan', name: 'Plan', label: 'Index', path: '/' },
  { no: 'A-02', room: 'sitting', name: 'Sitting Room', label: 'About', path: '/about/' },
  { no: 'A-03', room: 'workshop', name: 'Workshop', label: 'Work', path: '/work/' },
  { no: 'A-04', room: 'lab', name: 'Laboratory', label: 'Experiments', path: '/lab/' },
  { no: 'A-05', room: 'library', name: 'Library', label: 'Notes', path: '/notes/' },
  { no: 'A-06', room: 'courtyard', name: 'Courtyard', label: 'Now', path: '/now/' },
  { no: 'A-07', room: 'door', name: 'Front Door', label: 'Contact', path: '/contact/' },
] as const;

export type RoomKey = (typeof sheets)[number]['room'];
export const sheetFor = (room: RoomKey) => sheets.find((s) => s.room === room)!;
