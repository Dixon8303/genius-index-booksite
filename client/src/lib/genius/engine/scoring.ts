/* The scoring engine, ported verbatim from the original results() math.
   Pure functions only — no DOM, no state.

   Streams and weights:
     A (behavioral self-report)  50%  — 5 items/domain, 0-4 each, max 20
     B (micro-performance)       30%  — station-normalized 0..1
     C (trait disposition)       20%  — 3 items/domain, 0-4 each, max 12
   A skipped station redistributes proportionally: (0.5A + 0.2C) / 0.7. */

import { DOMAINS, type DomainId } from "../data/domains";
import { A_ITEMS } from "../data/items";

export interface DomainResult {
  A: number;
  B: number;
  C: number;
  score: number;
  skipped: boolean;
}

export type ResultMap = Record<DomainId, DomainResult>;

export type Likert = 0 | 1 | 2 | 3 | 4;

export function scoreDomains(
  respA: Record<DomainId, number[]>,
  respC: Record<DomainId, number[]>,
  B: Partial<Record<DomainId, number>>,
): ResultMap {
  const R = {} as ResultMap;
  DOMAINS.forEach((d) => {
    const a = respA[d.id]
      .map((v, i) => (A_ITEMS[d.id][i].reverse ? 4 - v : v))
      .reduce((x, y) => x + y, 0);
    const c = respC[d.id].reduce((x, y) => x + y, 0);
    const A100 = (a / 20) * 100;
    const C100 = (c / 12) * 100;
    const skipped = B[d.id] == null;
    const B100 = (B[d.id] ?? 0) * 100;
    const score = skipped
      ? Math.round((0.5 * A100 + 0.2 * C100) / 0.7)
      : Math.round(0.5 * A100 + 0.3 * B100 + 0.2 * C100);
    R[d.id] = { A: A100, B: B100, C: C100, score, skipped };
  });
  return R;
}

/* High-rater / social-desirability flag: both SDR items answered Agree or
   Strongly agree. Advisory only — never adjusts a score. */
export function sdrFlag(respSDR: [number, number]): boolean {
  return respSDR[0] >= 3 && respSDR[1] >= 3;
}

/* ---- Pure per-station scorers (Stream B), each returning 0..1. ---- */

export const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

/* KIN: correct-in-position arrow presses out of 6. */
export const kinScore = (correctInPosition: number): number =>
  clamp01(correctInPosition / 6);

/* SEN: pitch trials correct out of 5. */
export const senScore = (correct: number): number => clamp01(correct / 5);

/* MEM: recognition hits minus false alarms, floor 0, out of 12. */
export const memScore = (hits: number, falseAlarms: number): number =>
  clamp01(Math.max(0, hits - falseAlarms) / 12);

/* ANL: series items correct out of 4. */
export const anlScore = (correct: number): number => clamp01(correct / 4);

/* GEN: unique alternative uses, capped at 12. */
export const genScore = (uniqueCount: number): number =>
  clamp01(Math.min(uniqueCount, 12) / 12);

/* REL: vignette consensus reads correct out of 5. */
export const relScore = (correct: number): number => clamp01(correct / 5);

/* EXP: self-rated clarity 0-2 + hold 0-2, out of 4. */
export const expScore = (clarity: number, hold: number): number =>
  clamp01((clarity + hold) / 4);

/* ADP: Beighton checklist 0-9 (60%) + breath-hold seconds capped at 90 (40%). */
export const adpScore = (beighton: number, breathSec: number): number =>
  clamp01(0.6 * (beighton / 9) + 0.4 * (Math.min(breathSec, 90) / 90));

/* PER: time-estimation error banding (<=2s: 2, <=5s: 1, else 0) + north
   self-verify 0/1 + nearest-exit recall 0/1, out of 4. */
export const perScore = (
  timeErrSec: number,
  north: 0 | 1,
  exit: 0 | 1,
): number => {
  const timePts = timeErrSec <= 2 ? 2 : timeErrSec <= 5 ? 1 : 0;
  return clamp01((timePts + north + exit) / 4);
};

/* GEN helper: dedupe free-text uses the same way the original did. */
export function uniqueUses(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((l) => {
      const k = l.toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        out.push(l);
      }
    });
  return out;
}
