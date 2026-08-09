/* 30-day Amplification Protocol tracker state. One active run at a time.
   Day number is calendar-derived from startedAt (capped at 30); missed days
   are shown honestly rather than punished — a longest-streak stat instead of
   streak resets. */

import { nanoid } from "nanoid";
import type { DomainId } from "../data/domains";
import { PROTOCOL_KEY, readJson, writeJson } from "./keys";

export interface ProtocolDay {
  doneAt: string; // ISO timestamp of the check-in
  note?: string;
}

export interface ProtocolRun {
  id: string;
  domainId: DomainId;
  startedAt: string; // YYYY-MM-DD (local)
  days: Record<number, ProtocolDay>;
  status: "active" | "completed" | "abandoned";
}

interface ProtocolFile {
  v: 1;
  runs: ProtocolRun[];
}

export interface Stage {
  name: string;
  from: number;
  to: number;
  blurb: string;
}

/* The book's five stages across the 30 days. */
export const STAGES: Stage[] = [
  { name: "Awareness", from: 1, to: 3, blurb: "Name it. Notice where it already shows up, unprompted." },
  { name: "Assessment", from: 4, to: 7, blurb: "Baseline it. Measure the skill cold so the delta is real." },
  { name: "Practice", from: 8, to: 21, blurb: "Train it. Daily reps against the domain's protocol." },
  { name: "Integration", from: 22, to: 27, blurb: "Use it. Put the skill into live situations that count." },
  { name: "Mastery", from: 28, to: 30, blurb: "Prove it. Retest, compare, and log the evidence." },
];

export function stageForDay(day: number): Stage {
  return (
    STAGES.find((s) => day >= s.from && day <= s.to) ?? STAGES[STAGES.length - 1]
  );
}

/* Week index 0-3 into PROTOCOL_DOMAIN's four phase summaries. */
export function weekForDay(day: number): number {
  return Math.min(3, Math.floor((day - 1) / 7));
}

export function todayISO(now = new Date()): string {
  const y = now.getFullYear(),
    m = String(now.getMonth() + 1).padStart(2, "0"),
    d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function currentDay(run: ProtocolRun, now = new Date()): number {
  const start = new Date(`${run.startedAt}T00:00:00`);
  const diff = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return Math.max(1, Math.min(30, diff + 1));
}

function loadFile(): ProtocolFile {
  const file = readJson<ProtocolFile>(PROTOCOL_KEY);
  if (file && file.v === 1) return file;
  return { v: 1, runs: [] };
}

function persist(file: ProtocolFile): void {
  writeJson(PROTOCOL_KEY, file);
}

export function loadRuns(): ProtocolRun[] {
  return loadFile().runs;
}

export function activeRun(): ProtocolRun | null {
  return loadFile().runs.find((r) => r.status === "active") ?? null;
}

export function startRun(domainId: DomainId): ProtocolRun {
  const file = loadFile();
  // One active run at a time: starting a new one closes out the old.
  file.runs.forEach((r) => {
    if (r.status === "active") r.status = "abandoned";
  });
  const run: ProtocolRun = {
    id: nanoid(10),
    domainId,
    startedAt: todayISO(),
    days: {},
    status: "active",
  };
  file.runs.push(run);
  persist(file);
  return run;
}

export function checkIn(runId: string, day: number, note?: string): void {
  const file = loadFile();
  const run = file.runs.find((r) => r.id === runId);
  if (!run) return;
  run.days[day] = { doneAt: new Date().toISOString(), ...(note ? { note } : {}) };
  if (Object.keys(run.days).length >= 30 || (day >= 30 && run.days[30])) {
    run.status = "completed";
  }
  persist(file);
}

export function completeRun(runId: string): void {
  const file = loadFile();
  const run = file.runs.find((r) => r.id === runId);
  if (!run) return;
  run.status = "completed";
  persist(file);
}

export function abandonRun(runId: string): void {
  const file = loadFile();
  const run = file.runs.find((r) => r.id === runId);
  if (!run) return;
  run.status = "abandoned";
  persist(file);
}

export function doneCount(run: ProtocolRun): number {
  return Object.keys(run.days).length;
}

/* Longest run of consecutive checked days. */
export function longestStreak(run: ProtocolRun): number {
  let best = 0,
    cur = 0;
  for (let d = 1; d <= 30; d++) {
    if (run.days[d]) {
      cur++;
      best = Math.max(best, cur);
    } else {
      cur = 0;
    }
  }
  return best;
}

/* Current streak counting back from the given day. */
export function currentStreak(run: ProtocolRun, upToDay: number): number {
  let n = 0;
  for (let d = upToDay; d >= 1; d--) {
    if (run.days[d]) n++;
    else break;
  }
  return n;
}
