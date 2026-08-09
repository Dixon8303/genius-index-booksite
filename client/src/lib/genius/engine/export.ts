/* GI-1.0 export object — the storage and wire contract, compatible with the
   original assessment's exportObj (Firestore results, Apps Script rows, and
   legacy #view= share URLs all use this shape). Also writes braidTier, a field
   the telemetry sheet always expected but the original never sent. */

import { z } from "zod";
import { braidKey } from "../data/braids";
import { DOMAINS, type DomainId } from "../data/domains";
import { computeM, type Interpretation } from "./interpret";
import { sdrFlag as computeSdrFlag, type ResultMap } from "./scoring";

export interface Demographics {
  age: string | null;
  gender: string | null;
  education: string | null;
  region: string | null;
}

export interface GI10Export {
  v: string;
  event: "complete";
  code: string | null;
  consent: boolean;
  ts: string;
  minutes: number;
  A?: Record<DomainId, number[]>;
  C?: Record<DomainId, number[]>;
  SDR?: number[];
  B?: Partial<Record<DomainId, unknown>>;
  Bnorm?: Partial<Record<DomainId, number>>;
  ranksTop?: DomainId[];
  ranksBot?: DomainId[];
  demographics: Demographics | Record<string, unknown>;
  domains: Record<
    DomainId,
    { A: number; B: number; C: number; score: number; skipped: boolean }
  >;
  signature: string;
  braid: string | null;
  braidTier: string | null;
  braidPair: DomainId[];
  adjacent: string[];
  shape: string;
  reachable: string[];
  flags: {
    sdr: boolean;
    unclaimed: DomainId[];
    aspirational: DomainId[];
    topUnclaimed: DomainId | null;
    rankOverlap: number;
  };
}

export interface BuildExportInput {
  R: ResultMap;
  m: Interpretation;
  respA: Record<DomainId, number[]>;
  respC: Record<DomainId, number[]>;
  respSDR: [number, number];
  Braw: Partial<Record<DomainId, unknown>>;
  Bnorm: Partial<Record<DomainId, number>>;
  ranksTop: DomainId[];
  ranksBot: DomainId[];
  demographics: Demographics;
  code: string;
  consent: boolean;
  startedAt: number;
  now?: number;
}

/* Signature code line, e.g. "EX·GE (+pe)". */
export function signatureCode(m: Interpretation): string {
  return (
    m.sig.map((d) => d.code).join("·") +
    (m.unclaimed.length
      ? ` (+${m.unclaimed.map((d) => d.code.toLowerCase()).join(",")})`
      : "")
  );
}

export function rankOverlap(m: Interpretation, ranksTop: DomainId[]): number {
  const compTop3 = m.sorted.slice(0, 3).map((d) => d.id);
  return ranksTop.filter((x) => compTop3.includes(x)).length;
}

export function buildExportObj(input: BuildExportInput): GI10Export {
  const { R, m } = input;
  const now = input.now ?? Date.now();
  const overlap = rankOverlap(m, input.ranksTop);
  return {
    v: "GI-1.0",
    event: "complete",
    code: input.code || null,
    consent: input.consent,
    ts: new Date(now).toISOString(),
    minutes: Math.round((now - input.startedAt) / 60000),
    A: input.respA,
    C: input.respC,
    SDR: input.respSDR,
    B: input.Braw,
    Bnorm: input.Bnorm,
    ranksTop: input.ranksTop,
    ranksBot: input.ranksBot,
    demographics: { ...input.demographics },
    domains: Object.fromEntries(
      DOMAINS.map((d) => [d.id, R[d.id]]),
    ) as GI10Export["domains"],
    signature: signatureCode(m),
    braid: m.primary ? m.primary.name : null,
    braidTier: m.primary ? m.primary.tier : null,
    braidPair: m.braidDoms.map((d) => d.id),
    adjacent: Array.from(m.adjKeys),
    shape: m.shape,
    reachable: m.reachable.map((b) => b.name),
    flags: {
      sdr: computeSdrFlag(input.respSDR),
      unclaimed: m.unclaimed.map((d) => d.id),
      aspirational: m.aspir.map((d) => d.id),
      topUnclaimed: m.topUnclaimed ? m.topUnclaimed.id : null,
      rankOverlap: overlap,
    },
  };
}

/* ---- Replay path: rebuild domain scores from a stored payload and re-derive
   everything through the current engine (never a frozen snapshot). ---- */

const domainScoreSchema = z.object({
  A: z.coerce.number().catch(0),
  B: z.coerce.number().catch(0),
  C: z.coerce.number().catch(0),
  score: z.coerce.number().catch(0),
  skipped: z.coerce.boolean().catch(false),
});

/* Lenient by design: legacy payloads vary, unknown fields pass through, and
   only `domains` is truly load-bearing for a replay. */
export const gi10Schema = z
  .object({
    v: z.string().optional(),
    code: z.string().nullable().optional(),
    consent: z.boolean().optional(),
    ts: z.string().optional(),
    minutes: z.number().optional(),
    ranksTop: z.array(z.string()).optional(),
    demographics: z.record(z.string(), z.unknown()).optional(),
    domains: z.record(z.string(), domainScoreSchema),
    flags: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();

export type GI10Payload = z.infer<typeof gi10Schema>;

export function domainsFromPayload(payload: GI10Payload): ResultMap {
  const R = {} as ResultMap;
  DOMAINS.forEach((d) => {
    const dd = payload.domains && payload.domains[d.id];
    R[d.id] = dd
      ? {
          A: +dd.A || 0,
          B: +dd.B || 0,
          C: +dd.C || 0,
          score: Math.round(dd.score || 0),
          skipped: !!dd.skipped,
        }
      : { A: 0, B: 0, C: 0, score: 0, skipped: true };
  });
  return R;
}

export class PayloadParseError extends Error {}

/* Parse a legacy #view=<encodeURIComponent(json)> hash (or a bare JSON
   string) into a validated payload. Throws PayloadParseError on anything
   unusable. */
export function parseViewPayload(hashOrJson: string): GI10Payload {
  let raw = hashOrJson;
  if (raw.startsWith("#")) raw = raw.slice(1);
  if (raw.startsWith("view=")) raw = raw.slice("view=".length);
  let json: unknown;
  try {
    json = JSON.parse(decodeURIComponent(raw));
  } catch {
    try {
      json = JSON.parse(raw);
    } catch {
      throw new PayloadParseError("Not decodable as a result payload");
    }
  }
  const parsed = gi10Schema.safeParse(json);
  if (!parsed.success)
    throw new PayloadParseError("Payload failed schema validation");
  return parsed.data;
}

/* Re-derive a full export object from a stored payload through the current
   engine — mirrors the original renderArchived(). */
export function replayExport(payload: GI10Payload): {
  m: Interpretation;
  exportObj: GI10Export;
} {
  const R = domainsFromPayload(payload);
  const m = computeM(R);
  const flagSdr = !!(payload.flags && (payload.flags as { sdr?: unknown }).sdr);
  const ranksTop = (payload.ranksTop || []) as DomainId[];
  const overlap = rankOverlap(m, ranksTop);
  const exportObj: GI10Export = {
    v: payload.v || "",
    event: "complete",
    code: payload.code || null,
    consent: payload.consent !== false,
    ts: payload.ts || "",
    minutes: payload.minutes || 0,
    demographics: payload.demographics || {},
    domains: Object.fromEntries(
      DOMAINS.map((d) => [d.id, R[d.id]]),
    ) as GI10Export["domains"],
    signature: signatureCode(m),
    braid: m.primary ? m.primary.name : null,
    braidTier: m.primary ? m.primary.tier : null,
    braidPair: m.braidDoms.map((d) => d.id),
    adjacent: Array.from(m.adjKeys),
    shape: m.shape,
    reachable: m.reachable.map((b) => b.name),
    flags: {
      sdr: flagSdr,
      unclaimed: m.unclaimed.map((d) => d.id),
      aspirational: m.aspir.map((d) => d.id),
      topUnclaimed: m.topUnclaimed ? m.topUnclaimed.id : null,
      rankOverlap: overlap,
    },
  };
  return { m, exportObj };
}

/* Canonical share-URL hash for a result (same format the original emitted). */
export function viewHashFor(exportObj: GI10Export): string {
  return "#view=" + encodeURIComponent(JSON.stringify(exportObj));
}

export { braidKey };
