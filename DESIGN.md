# Design governance — this repository

This site is governed by the **Visual Design Constitution v1.0** (E.A.T. Media,
2026-08-20), profile **`VDC:INDEX`** (§9.2): light-first on `print-50`,
reference classes C + D + G, Finding Aid on data claims, Amber Pass on cover
imagery only, editorial density, priority order reading → conversion → craft.

Single source of truth for tokens: `client/src/styles/vdc.css` (the
constitution's Appendix A block plus logged amendments). No color, spacing,
duration, or type value may be introduced outside that file.

## Type roster (open-source substitutes per §3.1)

| Role | Face |
|---|---|
| Display | Instrument Serif |
| Body | Newsreader (variable, optical size axis) |
| Utility / metadata | IBM Plex Mono |

Playfair Display, Lato, and Cormorant Garamond were retired in the
Reclaimed Amber retheme (they predate the constitution).

## §13 Amendment log

| # | Date | Change | Rationale |
|---|---|---|---|
| A1 | 2026-08-21 | Added `--realm-soma:#8C3B2E`, `--realm-mind:#54687C`, `--realm-field:#4E6156` as data-visualization tokens. | The Genius Index instrument codes its nine domains by three realms; these hues are load-bearing shared vocabulary with the book and the original assessment. Mapping them onto the closed palette fails semantically — oxblood is reserved for human cost (§2.4) and SOMA is not that. Scope: domain/family coding in data viz only; never text, never decorative. |
| A2 | 2026-08-21 | Staged-compliance rider: legacy inline spacing values and pre-existing drop shadows in ported components are migrated opportunistically rather than in one pass. | The assessment's ported stylesheet predates the constitution; a single-pass rewrite risks behavioral regressions in a live instrument. New code is token-only. G1 applies fully to `client/src/styles/` and all new components. |

## Gate status (G1–G12, §11) as of the Reclaimed Amber retheme

- G2 static frame, G6 reduced motion, G10 motion discipline, G12 default
  check: enforced in code (see `vdc.css` reveal/pass implementations).
- G3 Finding Aid: applied to the results page's evidence, profile-read, and
  stream-table claims.
- G1/G9 (token + measure) fully hold for new styles; legacy ported styles are
  under the A2 rider.
- G7/G11 budgets: fonts swapped to 3 families WOFF2; images served lazy;
  recharts removed in favor of token-compliant inline SVG.
