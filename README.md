# The Genius Index — Book Site

The official promotional website for *The Genius Index* by D. Antione Dixon
(E.A.T. Media). React + Vite + Tailwind, "Dark Alchemy" design system.

Live at: https://dixon8303.github.io/genius-index-booksite/

## Development

```bash
pnpm install
pnpm dev
# Opens at http://localhost:3000
```

## Build

```bash
pnpm exec vite build
# Outputs to dist/public
```

Pushing to `main` deploys automatically via `.github/workflows/pages.yml`.

## Notes

- `client/src/lib/config.ts` holds `ASSESSMENT_URL`, pointing at the separate
  online assessment (dixon8303.github.io/ImaginariumOzone) — update it there
  if that site's URL ever changes.
- The author portrait (`client/public/images/author-portrait-placeholder.svg`)
  is a placeholder monogram. Replace `AUTHOR_PORTRAIT_URL` in
  `client/src/components/AuthorSection.tsx` once a real photo exists.
- The book cover and three diagrams are original SVGs built to match the
  brand system described in `ideas.md` — swap them for higher-fidelity art
  whenever that's ready; same file paths under `client/public/images/`.
