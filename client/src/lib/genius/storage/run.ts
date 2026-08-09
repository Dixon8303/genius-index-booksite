/* Mid-run autosave — the single biggest gap in the original instrument
   (a refresh lost everything). The reducer state is the autosave payload;
   it includes the MATERIALIZED flow order so a retake's shuffled item order
   survives resume without answers misaligning. */

import type { DomainId } from "../data/domains";
import type { FlowStep } from "../engine/flow";
import { readJson, removeKey, RUN_KEY, writeJson } from "./keys";

export type Phase =
  | "intro"
  | "inventory"
  | "stationsIntro"
  | "station"
  | "ranking"
  | "demographics";

export interface RunState {
  v: 1;
  startedAt: number;
  updatedAt: number;
  phase: Phase;
  flow: FlowStep[];
  flowIdx: number;
  respA: Record<DomainId, (number | null)[]>;
  respC: Record<DomainId, (number | null)[]>;
  respSDR: [number | null, number | null];
  stIdx: number;
  B: Partial<Record<DomainId, number>>;
  Braw: Partial<Record<DomainId, unknown>>;
  memStudyShown: boolean;
  ranksTop: DomainId[];
  ranksBot: DomainId[];
  demo: {
    age: string | null;
    gender: string | null;
    education: string | null;
    region: string | null;
  };
  consent: boolean;
  code: string;
}

const RESUME_WINDOW_MS = 7 * 24 * 3600 * 1000;

export function saveRun(state: RunState): void {
  writeJson(RUN_KEY, { ...state, updatedAt: Date.now() });
}

export function loadRun(): RunState | null {
  const run = readJson<RunState>(RUN_KEY);
  if (!run || run.v !== 1) return null;
  if (Date.now() - run.updatedAt > RESUME_WINDOW_MS) {
    removeKey(RUN_KEY);
    return null;
  }
  return run;
}

export function clearRun(): void {
  removeKey(RUN_KEY);
}
