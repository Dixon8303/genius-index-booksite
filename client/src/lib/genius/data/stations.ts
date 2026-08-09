/* Micro-performance station fixtures, ported verbatim.
   Deterministic on purpose ("for pilot comparability") — every taker gets the
   same sequence, tones, and word lists so scores are comparable. */

import type { DomainId } from "./domains";

/* Screen order. MEM is split: study before ANL (which doubles as the
   distractor task), recall after. */
export type StationStep =
  | { kind: "station"; dom: DomainId }
  | { kind: "memStudy" }
  | { kind: "memRecall" };

export const STATION_SEQ: StationStep[] = [
  { kind: "station", dom: "KIN" },
  { kind: "station", dom: "SEN" },
  { kind: "memStudy" },
  { kind: "station", dom: "ANL" },
  { kind: "memRecall" },
  { kind: "station", dom: "GEN" },
  { kind: "station", dom: "REL" },
  { kind: "station", dom: "EXP" },
  { kind: "station", dom: "ADP" },
  { kind: "station", dom: "PER" },
];

/* KIN: Simon-style pad. Pad indices: 0 up, 1 right, 2 down, 3 left. */
export const KIN_SEQ = [2, 0, 3, 1, 2, 1];

/* SEN: two-tone pitch discrimination. cents === 0 means "same". */
export const PITCH_TRIALS = [
  { base: 440, cents: 50 },
  { base: 392, cents: -30 },
  { base: 330, cents: 20 },
  { base: 494, cents: -10 },
  { base: 262, cents: 0 },
];

/* MEM: 12 study targets; recognition list is 12 targets + 12 lures. */
export const MEM_TARGETS = [
  "river",
  "candle",
  "hammer",
  "orange",
  "window",
  "thunder",
  "basket",
  "mirror",
  "garden",
  "pillow",
  "rocket",
  "bridge",
];
export const MEM_RECOG = [
  "lantern",
  "river",
  "shovel",
  "candle",
  "lemon",
  "hammer",
  "window",
  "curtain",
  "thunder",
  "lightning",
  "basket",
  "bucket",
  "mirror",
  "shadow",
  "orange",
  "garden",
  "meadow",
  "pillow",
  "blanket",
  "rocket",
  "engine",
  "bridge",
  "tunnel",
  "forest",
];

export interface ChoiceItem {
  q: string;
  opts: string[];
  k: number;
}

/* ANL: 4 series items, 90s global timer. */
export const ANL_ITEMS: ChoiceItem[] = [
  { q: "2, 6, 12, 20, 30, ?", opts: ["36", "40", "42", "44"], k: 2 },
  { q: "3, 5, 9, 17, 33, ?", opts: ["63", "65", "66", "67"], k: 1 },
  { q: "A, C, F, J, O, ?", opts: ["S", "T", "U", "V"], k: 2 },
  { q: "81, 27, 9, 3, ?", opts: ["0", "1", "2", "1.5"], k: 1 },
];

/* REL: 5 social-cue vignettes scored against consensus reads. */
export const REL_ITEMS: ChoiceItem[] = [
  {
    q: "A teammate who usually jokes around goes short-answer all day, keeps their camera off, and says “it's fine” after being passed over for a lead role. Most likely, they are:",
    opts: [
      "Just busy today",
      "Hurt and pulling back",
      "Angry specifically at you",
      "Relaxed and content",
    ],
    k: 1,
  },
  {
    q: "At a dinner, one guest keeps glancing at the door and answers questions a beat late. Most likely, they are:",
    opts: [
      "Bored by the company",
      "Expecting someone or preoccupied with something outside the room",
      "Offended by the host",
      "Feeling ill",
    ],
    k: 1,
  },
  {
    q: "In a meeting, two colleagues trade a quick glance every time a third person pitches an idea. Most likely, the two:",
    opts: [
      "Share a prior opinion about those ideas",
      "Are checking the time",
      "Haven't met each other",
      "Agree enthusiastically with the pitch",
    ],
    k: 0,
  },
  {
    q: "A friend says “I'm over it” — while retelling the story, in detail, for the third time. Most likely, they are:",
    opts: [
      "Truly over it",
      "Not over it",
      "Testing your memory",
      "Talking about something else",
    ],
    k: 1,
  },
  {
    q: "A new coworker laughs at every joke, agrees with everything, and asks no questions. Most likely, they are:",
    opts: [
      "Fully confident",
      "Seeking acceptance and reading the room nervously",
      "Uninterested in the job",
      "Naturally silent",
    ],
    k: 1,
  },
];
