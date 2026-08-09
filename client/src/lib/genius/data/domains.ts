/* The nine domains of the Genius Index. Ported from the original assessment
   (ImaginariumOzone docs/index.html) — ids, two-letter codes, families, and
   3x3 cover-grid cell positions are the canonical shared vocabulary between
   the book, the marketing site, and this app. */

export type DomainId =
  | "KIN"
  | "SEN"
  | "ADP"
  | "ANL"
  | "MEM"
  | "GEN"
  | "REL"
  | "EXP"
  | "PER";

export type Family = "soma" | "mind" | "field";

export interface Domain {
  id: DomainId;
  code: string;
  name: string;
  meta: Family;
  cell: number;
  tagline: string;
  sign: string;
  description: string;
}

export const FAMILY_META: Record<Family, { label: string; realm: string }> = {
  soma: { label: "SOMA", realm: "The Body" },
  mind: { label: "MIND", realm: "The Mind" },
  field: { label: "FIELD", realm: "The Between" },
};

export const DOMAINS: Domain[] = [
  {
    id: "KIN",
    code: "KI",
    name: "Kinetic",
    meta: "soma",
    cell: 0,
    tagline: "Movement",
    sign: "Picks up any physical skill faster than the room",
    description:
      "Learns, keeps, and reproduces movement faster and cleaner than baseline. The body that owns a motion after one glance.",
  },
  {
    id: "SEN",
    code: "SE",
    name: "Sensory",
    meta: "soma",
    cell: 1,
    tagline: "Signal",
    sign: "Catches the flat note, the missing ingredient, the wrong shade",
    description:
      "Registers fine differences in sound, color, taste, and texture that pass everyone else by. Signal where others hear noise.",
  },
  {
    id: "ADP",
    code: "AD",
    name: "Adaptive",
    meta: "soma",
    cell: 2,
    tagline: "Capacity",
    sign: "Outlasts, outranges, or outrecovers the room",
    description:
      "The body's range, endurance, and recovery. Capacity that holds when the conditions turn against everyone else.",
  },
  {
    id: "ANL",
    code: "AN",
    name: "Analytic",
    meta: "mind",
    cell: 3,
    tagline: "Pattern",
    sign: "Sees the structure others miss; solves by decomposing",
    description:
      "Finds the structure inside the mess — the error, the system, the several moves ahead. Solves by taking things apart.",
  },
  {
    id: "MEM",
    code: "ME",
    name: "Mnemonic",
    meta: "mind",
    cell: 4,
    tagline: "Retention",
    sign: "Holds names, dates, pages, and sequences after one exposure",
    description:
      "Retention beyond baseline — conversations near word-for-word, a name locked to a face, sequences held with little effort.",
  },
  {
    id: "GEN",
    code: "GE",
    name: "Generative",
    meta: "mind",
    cell: 5,
    tagline: "Combination",
    sign: "Produces more ideas than can be used, without trying",
    description:
      "Produces and combines — more ideas than can be used, connections across unrelated fields, the remix that feels original.",
  },
  {
    id: "REL",
    code: "RE",
    name: "Relational",
    meta: "field",
    cell: 6,
    tagline: "People",
    sign: "Strangers confide within minutes; reads the room on entry",
    description:
      "Reads people at high resolution — the mood of a room, the want beneath the words — and moves the temperature between them.",
  },
  {
    id: "EXP",
    code: "EX",
    name: "Expressive",
    meta: "field",
    cell: 7,
    tagline: "Voice",
    sign: "Makes a room lock in and follow",
    description:
      "Transmission — the delivery that makes complicated things clear and makes an audience feel the exact emotion intended.",
  },
  {
    id: "PER",
    code: "PE",
    name: "Perceptive",
    meta: "field",
    cell: 8,
    tagline: "Meaning",
    sign: "Understands the subtext before the text is done",
    description:
      "Situational awareness — orientation without a map, the small change in a space, the sense that something is off before others feel it.",
  },
];

export const DOMAIN_BY_ID: Record<DomainId, Domain> = Object.fromEntries(
  DOMAINS.map((d) => [d.id, d]),
) as Record<DomainId, Domain>;

export const DOMAIN_IDS = DOMAINS.map((d) => d.id) as DomainId[];

/* 5-point response scales (stored 0-4). */
export const FREQ = ["Never", "Rarely", "Sometimes", "Often", "Almost always"];
export const AGREE = [
  "Strongly disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly agree",
];
