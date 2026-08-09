/* The thirty-six braids — every pairing of two domains, ported verbatim.
   tier: C = Canonical Ten (gold) · S = Strong Pair · R = Rarest · Q = Quiet Few */

import type { DomainId } from "./domains";

export type BraidTier = "C" | "S" | "R" | "Q";

export interface Braid {
  name: string;
  pair: [DomainId, DomainId];
  tier: BraidTier;
  rare?: boolean;
  desc: string;
}

export const TIER_META: Record<BraidTier, { label: string; sub: string }> = {
  C: {
    label: "Canonical Ten",
    sub: "One of the ten combinations distinct enough to carry a name of its own.",
  },
  S: {
    label: "Strong Pair",
    sub: "One of twelve dependable braids — common enough to build on purpose.",
  },
  R: {
    label: "Rarest",
    sub: "One of the eleven you will meet least often — rarity is what makes it valuable.",
  },
  Q: {
    label: "Quiet Few",
    sub: "One of four subtle braids that live on the body and often pass without notice.",
  },
};

export const BRAIDS: Braid[] = [
  { name: "The Craftsman", pair: ["KIN", "SEN"], tier: "C", desc: "Skilled motion that makes a thing." },
  { name: "The Performer", pair: ["KIN", "EXP"], tier: "C", desc: "The body that communicates." },
  { name: "The Connoisseur", pair: ["SEN", "ANL"], tier: "C", rare: true, desc: "Detects the faint signal, then decodes it." },
  { name: "The Translator", pair: ["ANL", "EXP"], tier: "C", desc: "Turns the structure so other people see it." },
  { name: "The Diagnostician", pair: ["ANL", "PER"], tier: "C", desc: "The anomaly, and the system it lives in." },
  { name: "The Connector", pair: ["MEM", "REL"], tier: "C", desc: "Never forgets a person; reads them too." },
  { name: "The Storyteller", pair: ["GEN", "EXP"], tier: "C", desc: "Makes the new thing and transmits it." },
  { name: "The Leader", pair: ["REL", "EXP"], tier: "C", desc: "Reads people and moves them." },
  { name: "The Instrument", pair: ["ADP", "EXP"], tier: "C", desc: "Bodily capacity serving the voice." },
  { name: "The Documentarian", pair: ["PER", "EXP"], tier: "C", desc: "Sees what others miss; makes you see it." },
  { name: "The Natural", pair: ["KIN", "ADP"], tier: "S", desc: "Outlasts the room; fast skill uptake." },
  { name: "The Tactician", pair: ["KIN", "ANL"], tier: "S", desc: "Moves while reading the play." },
  { name: "The Virtuoso", pair: ["KIN", "MEM"], tier: "S", desc: "Skilled motion, memorized repertoire." },
  { name: "The Healer", pair: ["KIN", "REL"], tier: "S", desc: "Skilled hands reading the body." },
  { name: "The Composer", pair: ["SEN", "GEN"], tier: "S", desc: "Invents new sensory forms." },
  { name: "The Empath", pair: ["SEN", "REL"], tier: "S", desc: "Reads human signal at high resolution." },
  { name: "The Stylist", pair: ["SEN", "EXP"], tier: "S", desc: "Transmits through refined sensory craft." },
  { name: "The Tracker", pair: ["SEN", "PER"], tier: "S", desc: "The faint sign within the whole scene." },
  { name: "The Optimizer", pair: ["ADP", "ANL"], tier: "S", desc: "Systematically engineers the body." },
  { name: "The Caregiver", pair: ["ADP", "REL"], tier: "S", desc: "Endurance in service of reading people." },
  { name: "The Explorer", pair: ["ADP", "PER"], tier: "S", desc: "Endures and reads harsh terrain." },
  { name: "The Witness", pair: ["MEM", "PER"], tier: "S", desc: "Sees the scene, records it exactly." },
  { name: "The Maker", pair: ["KIN", "GEN"], tier: "R", desc: "Invents in physical media." },
  { name: "The Athlete", pair: ["KIN", "PER"], tier: "R", desc: "Reads the field, answers with the body." },
  { name: "The Scholar", pair: ["ANL", "MEM"], tier: "R", desc: "Structured mastery of a knowledge domain." },
  { name: "The Inventor", pair: ["ANL", "GEN"], tier: "R", desc: "Novel ideas disciplined by analysis." },
  { name: "The Negotiator", pair: ["ANL", "REL"], tier: "R", desc: "Reads the situation and the people." },
  { name: "The Synthesizer", pair: ["MEM", "GEN"], tier: "R", desc: "Remembers a vast store, mixes the new." },
  { name: "The Bard", pair: ["MEM", "EXP"], tier: "R", desc: "Holds and transmits a deep well." },
  { name: "The Entertainer", pair: ["GEN", "REL"], tier: "R", desc: "Invents in real time, to the crowd." },
  { name: "The Visionary", pair: ["GEN", "PER"], tier: "R", desc: "Reads the emerging field, invents in it." },
  { name: "The Diplomat", pair: ["REL", "PER"], tier: "R", desc: "Reads the person and the whole social field." },
  { name: "The Adept", pair: ["SEN", "ADP"], tier: "Q", desc: "Reflex-fast tuning, held with control." },
  { name: "The Aesthete", pair: ["SEN", "MEM"], tier: "Q", desc: "Deep memory for sensory signatures." },
  { name: "The Veteran", pair: ["ADP", "MEM"], tier: "Q", desc: "Durability plus accumulated memory." },
  { name: "The Daredevil", pair: ["ADP", "GEN"], tier: "Q", desc: "Invents at the body's edge." },
];

export const braidKey = (a: string, b: string): string =>
  [a, b].sort().join("|");

export const BRAID_BY_KEY: Record<string, Braid> = {};
BRAIDS.forEach((br) => {
  BRAID_BY_KEY[braidKey(br.pair[0], br.pair[1])] = br;
});

export function braidFor(a: DomainId, b: DomainId): Braid | null {
  return BRAID_BY_KEY[braidKey(a, b)] || null;
}

export const BRAID_BY_NAME: Record<string, Braid> = Object.fromEntries(
  BRAIDS.map((b) => [b.name, b]),
);

export const CANONICAL_TEN = BRAIDS.filter((b) => b.tier === "C");

/* URL slug for braid detail pages: "The Craftsman" -> "craftsman". */
export const braidSlug = (name: string): string =>
  name.replace(/^The /, "").toLowerCase().replace(/\s+/g, "-");

export const BRAID_BY_SLUG: Record<string, Braid> = Object.fromEntries(
  BRAIDS.map((b) => [braidSlug(b.name), b]),
);
