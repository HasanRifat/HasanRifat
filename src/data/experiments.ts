// Add an experiment: create src/pages/lab/<slug>.astro and list it here.
export const experiments = [
  {
    slug: 'light-study',
    no: 'X-01',
    title: 'Light study',
    kind: 'Visual',
    blurb: 'Draw walls, carry a lamp through them. The shadow engine behind the plan on the front page, left open on the bench.',
  },
  {
    slug: 'wazn',
    no: 'X-02',
    title: 'Wazn machine',
    kind: 'Language',
    blurb: 'Pour a three-letter Arabic root into the standard verb patterns and watch the letters take their places.',
  },
  {
    slug: 'sundial',
    no: 'X-03',
    title: 'Sundial',
    kind: 'Technical',
    blurb: 'Where the sun is over Los Angeles, computed in the browser. Scrub through the day; this is what lights the house.',
  },
] as const;
