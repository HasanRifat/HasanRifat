# The site

A personal site drawn as a floor plan. Built with [Astro](https://astro.build); output is plain static HTML.

```
npm install
npm run dev      # http://localhost:4321/HasanRifat/
npm run build    # → dist/
```

## Editing content

| To change…                     | Edit…                                                                 |
| ------------------------------ | --------------------------------------------------------------------- |
| Name, role, email, links       | `src/data/site.ts`                                                    |
| The **Now** page               | `src/data/now.json` (bump `updated`)                                  |
| A project / add one            | `src/content/projects/*.md` (copy `_template.md`)                     |
| A note / add one               | `src/content/notes/*.md` (copy `_template.md`, remove `draft: true`)  |
| The About text                 | `src/pages/about.astro`                                               |
| Add a lab experiment           | new `src/pages/lab/<slug>.astro` + an entry in `src/data/experiments.ts` |
| Rooms, walls, doors on the plan | `src/lib/plan.ts`                                                    |

Project links: add `links: [{ label: Live site, url: https://… }]` to a project's frontmatter and they appear on its sheet.

## Deploying

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`.
One-time setup: **Settings → Pages → Source: GitHub Actions**.

The site assumes it lives at `https://hasanrifat.github.io/HasanRifat/`. For a custom domain or a different repo, change `site` and `base` in `astro.config.mjs`.
