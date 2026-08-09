/* Results history — an append-only array of completed runs (the original kept
   only a single baseline snapshot). On first read, a legacy gi_baseline_v1
   from the old assessment (same origin) migrates in as a partial entry so
   returning users don't start from an empty history. */

import { nanoid } from "nanoid";
import type { DomainId } from "../data/domains";
import type { GI10Export } from "../engine/export";
import {
  HISTORY_KEY,
  LEGACY_BASELINE_KEY,
  LEGACY_COMPLETED_KEY,
  readJson,
  writeJson,
} from "./keys";

export type ResultSource = "local" | "cloud" | "shared" | "legacy";

export interface StoredResult {
  id: string;
  savedAt: number;
  source: ResultSource;
  cloudId?: string;
  /* legacy baseline entries carry per-domain scores only */
  partial?: boolean;
  export: GI10Export;
}

interface HistoryFile {
  v: 1;
  results: StoredResult[];
}

interface LegacyBaseline {
  ts: number;
  braid: string | null;
  shape: string;
  domains: Record<
    DomainId,
    { A: number; B: number; C: number; score: number; skipped: boolean }
  >;
}

function migrateLegacyBaseline(): StoredResult | null {
  const legacy = readJson<LegacyBaseline>(LEGACY_BASELINE_KEY);
  if (!legacy || !legacy.domains) return null;
  const exportObj = {
    v: "GI-legacy-baseline",
    event: "complete",
    code: null,
    consent: true,
    ts: new Date(legacy.ts || Date.now()).toISOString(),
    minutes: 0,
    demographics: {},
    domains: legacy.domains,
    signature: "",
    braid: legacy.braid ?? null,
    braidTier: null,
    braidPair: [],
    adjacent: [],
    shape: legacy.shape || "",
    reachable: [],
    flags: {
      sdr: false,
      unclaimed: [],
      aspirational: [],
      topUnclaimed: null,
      rankOverlap: 0,
    },
  } as GI10Export;
  return {
    id: nanoid(10),
    savedAt: legacy.ts || Date.now(),
    source: "legacy",
    partial: true,
    export: exportObj,
  };
}

export function loadHistory(): StoredResult[] {
  const file = readJson<HistoryFile>(HISTORY_KEY);
  if (file && file.v === 1) return file.results;
  // First read on this device: pull in the old site's baseline if present.
  const migrated = migrateLegacyBaseline();
  const results = migrated ? [migrated] : [];
  writeJson(HISTORY_KEY, { v: 1, results } satisfies HistoryFile);
  return results;
}

function persist(results: StoredResult[]): void {
  writeJson(HISTORY_KEY, { v: 1, results } satisfies HistoryFile);
}

export function appendResult(
  exportObj: GI10Export,
  source: ResultSource = "local",
): StoredResult {
  const results = loadHistory();
  const entry: StoredResult = {
    id: nanoid(10),
    savedAt: Date.now(),
    source,
    export: exportObj,
  };
  results.push(entry);
  persist(results);
  // Keep the legacy retake-order flag in sync — the old site still reads it.
  try {
    localStorage.setItem(LEGACY_COMPLETED_KEY, "1");
  } catch {
    /* ignore */
  }
  return entry;
}

export function updateResult(
  id: string,
  patch: Partial<Pick<StoredResult, "cloudId" | "source">>,
): void {
  const results = loadHistory();
  const idx = results.findIndex((r) => r.id === id);
  if (idx === -1) return;
  results[idx] = { ...results[idx], ...patch };
  persist(results);
}

export function mergeCloudResults(
  cloud: { cloudId: string; export: GI10Export }[],
): number {
  const results = loadHistory();
  const seenCloudIds = new Set(results.map((r) => r.cloudId).filter(Boolean));
  const seenTs = new Set(results.map((r) => r.export.ts).filter(Boolean));
  let added = 0;
  cloud.forEach((c) => {
    if (seenCloudIds.has(c.cloudId)) return;
    if (c.export.ts && seenTs.has(c.export.ts)) return;
    results.push({
      id: nanoid(10),
      savedAt: c.export.ts ? Date.parse(c.export.ts) || Date.now() : Date.now(),
      source: "cloud",
      cloudId: c.cloudId,
      export: c.export,
    });
    added++;
  });
  if (added) {
    results.sort((a, b) => a.savedAt - b.savedAt);
    persist(results);
  }
  return added;
}

export function getResult(id: string): StoredResult | null {
  return loadHistory().find((r) => r.id === id) ?? null;
}

export function latestResult(): StoredResult | null {
  const results = loadHistory();
  return results.length ? results[results.length - 1] : null;
}

export function latestFullResult(): StoredResult | null {
  const results = loadHistory().filter((r) => !r.partial);
  return results.length ? results[results.length - 1] : null;
}

export function isRetake(): boolean {
  try {
    if (localStorage.getItem(LEGACY_COMPLETED_KEY)) return true;
  } catch {
    /* ignore */
  }
  return loadHistory().some((r) => !r.partial);
}
