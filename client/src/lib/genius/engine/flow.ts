/* Inventory flow construction, ported from the original: five A rounds
   (one item per domain per round, round-robin), the two SDR items spliced at
   fixed positions 22 and 53, then three C rounds. First-time takers get the
   canonical domain order; retakers get each round freshly shuffled so they
   aren't pattern-matching remembered answer positions. The rng is injectable
   for deterministic tests, and the materialized flow is persisted with the
   run so resume survives the shuffle. */

import { DOMAINS, type DomainId } from "../data/domains";

export type FlowStep =
  | { t: "A"; d: DomainId; i: number }
  | { t: "C"; d: DomainId; i: number }
  | { t: "S"; i: number };

/* The original splices at 22 and 53 — but the second splice runs while the
   array holds only 46 steps (the C rounds aren't pushed yet), so JS clamps it
   to the end and the second SDR item actually lands at index 46, between the
   last A item and the first C item. Preserved exactly. */
export const SDR_EFFECTIVE_POSITIONS = [22, 46] as const;
export const FLOW_LENGTH = 74; // 45 A + 2 SDR + 27 C

function shuffled<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildFlow(
  retake: boolean,
  rng: () => number = Math.random,
): FlowStep[] {
  const flow: FlowStep[] = [];
  for (let i = 0; i < 5; i++) {
    (retake ? shuffled(DOMAINS, rng) : DOMAINS).forEach((d) =>
      flow.push({ t: "A", d: d.id, i }),
    );
  }
  flow.splice(22, 0, { t: "S", i: 0 });
  flow.splice(53, 0, { t: "S", i: 1 }); // clamps to index 46 — see note above
  for (let i = 0; i < 3; i++) {
    (retake ? shuffled(DOMAINS, rng) : DOMAINS).forEach((d) =>
      flow.push({ t: "C", d: d.id, i }),
    );
  }
  return flow;
}
