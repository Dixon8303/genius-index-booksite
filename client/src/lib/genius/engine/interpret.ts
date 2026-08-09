/* Interpretation compute layer, ported verbatim (it was already pure).
   Derives the full interpretation context `m` from a domain-score map R alone,
   so a stored submission's original scores always run through the exact same
   braid/shape/gap logic as a live completion. */

import {
  BRAIDS,
  braidFor,
  braidKey,
  type Braid,
} from "../data/braids";
import {
  DOMAINS,
  DOMAIN_BY_ID,
  type Domain,
  type DomainId,
  type Family,
} from "../data/domains";
import type { ResultMap } from "./scoring";

export type Band = "Signature" | "Supporting" | "Developing" | "Dormant";
export type Shape = "Tower" | "Ridge" | "Anchored" | "Plateau";

export const BAND_RANK: Record<Band, number> = {
  Signature: 3,
  Supporting: 2,
  Developing: 1,
  Dormant: 0,
};

/* Domain -> book chapter (Ch 7 Kinetic … Ch 15 Perceptive). */
export const chapterOf = (id: DomainId): number =>
  7 + DOMAINS.findIndex((d) => d.id === id);

export interface ShapeMeta {
  bars: number[];
  line: string;
  move: string;
}
export const SHAPE_META: Record<Shape, ShapeMeta> = {
  Tower: {
    bars: [10, 3, 2, 3, 2, 2, 3, 2, 2],
    line: "one tall bar, the rest low",
    move: "give this one peak a partner",
  },
  Ridge: {
    bars: [9, 9, 3, 3, 2, 3, 2, 3, 2],
    line: "two tall bars together",
    move: "decide which strand leads",
  },
  Anchored: {
    bars: [10, 6, 6, 6, 3, 3, 2, 2, 3],
    line: "one tall bar, several mid-height",
    move: "choose one strand and braid it on purpose",
  },
  Plateau: {
    bars: [6, 5, 6, 5, 6, 5, 6, 5, 5],
    line: "an even, flat cluster",
    move: "develop broadly before you specialise",
  },
};

/* Shape classifier. Uses the TRUE signature count from scores (the same isSig
   rule computeM uses), not the display band — which force-names a top domain
   even on a flat profile and would mask a real Plateau. */
export function computeShape(R: ResultMap, sorted: Domain[]): Shape {
  const scores = sorted.map((d) => R[d.id].score);
  const median = scores.slice().sort((a, b) => a - b)[4];
  const isSig = (v: number) => v >= 70 && v >= median + 10;
  const sig = scores.filter(isSig).length;
  const sup = sorted.filter(
    (d) => R[d.id].score >= 55 && !isSig(R[d.id].score),
  ).length;
  const gap = R[sorted[0].id].score - R[sorted[1].id].score;
  if (sig === 1 && gap >= 15) return "Tower";
  if (sig >= 2) return "Ridge";
  if (sig === 1 && sup >= 2) return "Anchored";
  return "Plateau";
}

/* Reachable next braids: canonical pairs where one member is Signature and the
   other is Supporting+, ranked by summed score; fall back to Strong Pairs to
   fill two slots. Excludes the reader's primary braid. */
export function computeReachable(
  R: ResultMap,
  band: (d: Domain) => Band,
  primaryKey: string,
): Braid[] {
  const eligible = (list: Braid[]) =>
    list
      .filter((b) => {
        const bx = band(DOMAIN_BY_ID[b.pair[0]]);
        const by = band(DOMAIN_BY_ID[b.pair[1]]);
        return (
          (bx === "Signature" && BAND_RANK[by] >= 2) ||
          (by === "Signature" && BAND_RANK[bx] >= 2)
        );
      })
      .sort(
        (a, b) =>
          R[b.pair[0]].score +
          R[b.pair[1]].score -
          (R[a.pair[0]].score + R[a.pair[1]].score),
      );
  const notPrimary = (b: Braid) =>
    braidKey(b.pair[0], b.pair[1]) !== primaryKey;
  let picks = eligible(
    BRAIDS.filter((b) => b.tier === "C" && notPrimary(b)),
  ).slice(0, 2);
  if (picks.length < 2) {
    const more = eligible(
      BRAIDS.filter((b) => b.tier === "S" && notPrimary(b) && !picks.includes(b)),
    );
    picks = picks.concat(more).slice(0, 2);
  }
  return picks;
}

export interface ReadNextEntry {
  id: DomainId | "_stack";
  ch: number | string;
  name: string;
  note: string;
}

/* Read Next ordering — labels only, capped at 5. */
export function computeReadNext(
  R: ResultMap,
  band: (d: Domain) => Band,
  sorted: Domain[],
  topUnclaimed: Domain | null,
): ReadNextEntry[] {
  const out: ReadNextEntry[] = [];
  const seen = new Set<string>();
  const add = (id: DomainId | null, note: string) => {
    if (id && !seen.has(id)) {
      seen.add(id);
      out.push({ id, ch: chapterOf(id), name: DOMAIN_BY_ID[id].name, note });
    }
  };
  sorted.filter((d) => band(d) === "Signature").forEach((d) => add(d.id, "your Signature"));
  if (topUnclaimed) add(topUnclaimed.id, "the unclaimed pivot");
  const dormantAspir = DOMAINS.find(
    (d) =>
      band(d) === "Dormant" &&
      !R[d.id].skipped &&
      R[d.id].B - R[d.id].A <= -30,
  );
  if (dormantAspir) add(dormantAspir.id, "the caution chapter");
  out.push({
    id: "_stack",
    ch: `17–18`,
    name: "Stacking & the protocol",
    note: "how to braid on purpose",
  });
  return out.slice(0, 5);
}

export interface Interpretation {
  sig: Domain[];
  topDoms: Domain[];
  sorted: Domain[];
  band: (d: Domain) => Band;
  R: ResultMap;
  primary: Braid | null;
  primaryKey: string;
  adjKeys: Set<string>;
  braidDoms: [Domain, Domain];
  reachable: Braid[];
  readNext: ReadNextEntry[];
  shape: Shape;
  topUnclaimed: Domain | null;
  aspir: Domain[];
  unclaimed: Domain[];
  gapOf: (d: Domain) => number | null;
  leadingFamily: Family;
}

export function computeM(R: ResultMap): Interpretation {
  const sorted = [...DOMAINS].sort((x, y) => R[y.id].score - R[x.id].score);
  const scores = sorted.map((d) => R[d.id].score);
  const median = scores.slice().sort((a, b) => a - b)[4];
  const isSig = (d: Domain) =>
    R[d.id].score >= 70 && R[d.id].score >= median + 10;
  const sig = sorted.filter(isSig).slice(0, 2);
  if (sig.length === 0) sig.push(sorted[0]);
  const braidDoms: [Domain, Domain] =
    sig.length >= 2 ? [sig[0], sig[1]] : [sorted[0], sorted[1]];
  const primary = braidFor(braidDoms[0].id, braidDoms[1].id);
  const primaryKey = braidKey(braidDoms[0].id, braidDoms[1].id);
  const top3 = sorted.slice(0, 3);
  const adjKeys = new Set<string>();
  for (let i = 0; i < top3.length; i++)
    for (let j = i + 1; j < top3.length; j++) {
      const k = braidKey(top3[i].id, top3[j].id);
      if (k !== primaryKey) adjKeys.add(k);
    }
  const band = (d: Domain): Band => {
    if (sig.includes(d)) return "Signature";
    if (R[d.id].score >= 55) return "Supporting";
    if (R[d.id].score < 40) return "Dormant";
    return "Developing";
  };
  const gapOf = (d: Domain): number | null =>
    R[d.id].skipped ? null : Math.round(R[d.id].B - R[d.id].A);
  const unclaimed = DOMAINS.filter(
    (d) => gapOf(d) != null && (gapOf(d) as number) >= 30,
  ).sort((a, b) => (gapOf(b) as number) - (gapOf(a) as number));
  const aspir = DOMAINS.filter(
    (d) => gapOf(d) != null && (gapOf(d) as number) <= -30,
  ).sort((a, b) => (gapOf(a) as number) - (gapOf(b) as number));
  const topUnclaimed = unclaimed[0] || null;
  const shape = computeShape(R, sorted);
  const reachable = computeReachable(R, band, primaryKey);
  const readNext = computeReadNext(R, band, sorted, topUnclaimed);
  const topDoms = sorted.slice(0, 2);
  // Leading family: whichever family averages highest across its three
  // domains — an average, not just the top single domain's family.
  const famAvg = {} as Record<Family, number>;
  DOMAINS.forEach((d) => {
    famAvg[d.meta] = (famAvg[d.meta] || 0) + R[d.id].score;
  });
  (Object.keys(famAvg) as Family[]).forEach((k) => (famAvg[k] /= 3));
  const leadingFamily = (Object.keys(famAvg) as Family[]).sort(
    (a, b) => famAvg[b] - famAvg[a],
  )[0];
  return {
    sig,
    topDoms,
    sorted,
    band,
    R,
    primary,
    primaryKey,
    adjKeys,
    braidDoms,
    reachable,
    readNext,
    shape,
    topUnclaimed,
    aspir,
    unclaimed,
    gapOf,
    leadingFamily,
  };
}
