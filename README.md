# The Genius Index — Site + App

The official website *and* software product for *The Genius Index* by
D. Antione Dixon (E.A.T. Media). One React + Vite app, two faces:

- **`/`** — the promotional one-pager for the book ("Dark Alchemy" design
  system, spec in `ideas.md`).
- **The product** — the full Genius Index software, built around the ported
  assessment:
  - `/assessment` — the complete instrument: 74-item inventory (45 behavioral
    + 27 trait + 2 honesty checks), nine micro-performance stations, forced
    ranking, optional anonymous demographics. Autosaves on every answer —
    refresh mid-run and it resumes.
  - `/results` (+ `/results/:id`) — the full reading: braid, shape, the
    constellation wheel, all 36 pairings, the seven-lens profile, careers,
    protocol, share-card PNG, JSON export. Old `#view=` share links from the
    original assessment replay here through the current engine.
  - `/profile` — dashboard: latest result, nine bands, trend across retakes,
    history, optional Google sign-in for cloud backup (Firebase project
    `the-genius-index`, same Firestore path as the original site).
  - `/protocol` — the 30-day Amplification Protocol tracker (Awareness →
    Assessment → Practice → Integration → Mastery), daily check-ins with
    notes and streaks.
  - `/braids`, `/domains` — explorers for the 36 braids and 9 domains, built
    from the book's content library.

Live at: https://dixon8303.github.io/genius-index-booksite/

## Architecture

The assessment was ported from the original static instrument
(`dixon8303/ImaginariumOzone`, `docs/index.html`) into typed modules under
`client/src/lib/genius/`:

```
data/      domains, item banks (reverse-keying is an explicit flag),
           station fixtures, 36 braids, result-art manifest
engine/    flow builder, scoring (0.5A + 0.3B + 0.2C, skip-reweighted),
           interpretation (bands/shape/braids/gaps), GI-1.0 export contract
content/   careers, hobbies, challenges, protocols, evidence, profiles, shelf
viz/       wheel/grid/field-guide/hero-glyph string builders + share card
storage/   localStorage keys (versioned), mid-run autosave, results history
           (migrates the old site's gi_baseline_v1), protocol state,
           optional Firebase cloud sync (dynamically imported)
```

Scoring math is anchored by a golden-master vitest suite
(`client/src/lib/genius/engine/engine.test.ts`) whose expected numbers were
hand-computed from the original source. Results are stored in the same
GI-1.0 shape the original emitted, so old share links, Firestore saves, and
the Apps Script telemetry sheet all stay compatible (and `braidTier` is now
actually populated).

## Development

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm test       # engine test suite (vitest)
pnpm check      # tsc --noEmit
```

## Build & deploy

```bash
pnpm exec vite build   # outputs to dist/public (+ 404.html SPA fallback)
```

Pushing to `main` deploys automatically via `.github/workflows/pages.yml`
(free GitHub Pages — no server; the app is local-first, with optional
Firebase for cloud backup and a consent-gated Apps Script telemetry ping).

## Notes

- `client/src/lib/config.ts` holds the product paths the marketing CTAs use
  (`ASSESSMENT_URL` now points at the in-app `/assessment`).
- The book cover and three diagrams are original SVGs built to match the
  brand system described in `ideas.md` — swap them for higher-fidelity art
  whenever that's ready; same file paths under `client/public/images/`.
- Result artwork (`client/public/images/results/`, ~15 MB) is the
  commissioned set from the original assessment, copied wholesale.
- The Genius Index™ self-assessment is a reflective and developmental tool,
  not a psychological test, clinical instrument, or diagnostic device.
