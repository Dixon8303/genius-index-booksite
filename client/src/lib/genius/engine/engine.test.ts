import { describe, expect, it } from "vitest";
import {
  BRAIDS,
  BRAID_BY_KEY,
  braidFor,
  braidKey,
  CANONICAL_TEN,
} from "../data/braids";
import { DOMAINS, DOMAIN_IDS, type DomainId } from "../data/domains";
import { A_ITEMS, C_ITEMS, SDR_ITEMS } from "../data/items";
import {
  buildExportObj,
  parseViewPayload,
  PayloadParseError,
  replayExport,
  signatureCode,
  viewHashFor,
} from "./export";
import { buildFlow, FLOW_LENGTH, SDR_EFFECTIVE_POSITIONS } from "./flow";
import { computeM, computeShape } from "./interpret";
import {
  adpScore,
  anlScore,
  expScore,
  genScore,
  kinScore,
  memScore,
  perScore,
  relScore,
  scoreDomains,
  sdrFlag,
  senScore,
  uniqueUses,
  type ResultMap,
} from "./scoring";

/* Deterministic rng for shuffle tests. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const fill = <T>(v: T): Record<DomainId, T> =>
  Object.fromEntries(DOMAIN_IDS.map((id) => [id, v])) as Record<DomainId, T>;

function makeR(scores: Partial<Record<DomainId, number>>): ResultMap {
  const R = {} as ResultMap;
  DOMAINS.forEach((d) => {
    const s = scores[d.id] ?? 0;
    R[d.id] = { A: s, B: s, C: s, score: s, skipped: false };
  });
  return R;
}

describe("item banks", () => {
  it("has 45 A items (5 per domain), exactly one reverse-keyed per domain", () => {
    DOMAIN_IDS.forEach((id) => {
      expect(A_ITEMS[id]).toHaveLength(5);
      expect(A_ITEMS[id].filter((i) => i.reverse)).toHaveLength(1);
      // The original hardcoded reversal at index 3; the flag must sit there
      // so scoring matches the legacy instrument exactly.
      expect(A_ITEMS[id][3].reverse).toBe(true);
    });
  });
  it("has 27 C items and 2 SDR items (74 total)", () => {
    DOMAIN_IDS.forEach((id) => expect(C_ITEMS[id]).toHaveLength(3));
    expect(SDR_ITEMS).toHaveLength(2);
  });
});

describe("scoreDomains", () => {
  it("normalizes A to /20 and C to /12, weights 0.5/0.3/0.2", () => {
    const respA = fill([4, 4, 4, 0, 4]); // reverse item scores 4-0=4 -> sum 20
    const respC = fill([4, 4, 4]); // sum 12
    const B = fill(1);
    const R = scoreDomains(respA, respC, B);
    DOMAIN_IDS.forEach((id) => {
      expect(R[id].A).toBe(100);
      expect(R[id].C).toBe(100);
      expect(R[id].B).toBe(100);
      expect(R[id].score).toBe(100);
      expect(R[id].skipped).toBe(false);
    });
  });

  it("reverse-keys via the item flag identically to the old index-3 rule", () => {
    const respA = fill([2, 2, 2, 1, 2]);
    const respC = fill([0, 0, 0]);
    const R = scoreDomains(respA, respC, fill(0));
    // old rule: sum = 2+2+2+(4-1)+2 = 11
    DOMAIN_IDS.forEach((id) => expect(R[id].A).toBeCloseTo((11 / 20) * 100));
  });

  it("redistributes weight proportionally for a skipped station", () => {
    const respA = fill([4, 4, 4, 4, 4]); // reverse item 4 -> 0; sum 16 -> A=80
    const respC = fill([3, 2, 2]); // 7/12 -> 58.333
    const R = scoreDomains(respA, respC, {});
    DOMAIN_IDS.forEach((id) => {
      expect(R[id].skipped).toBe(true);
      expect(R[id].score).toBe(
        Math.round((0.5 * 80 + 0.2 * (700 / 12)) / 0.7),
      );
    });
  });

  it("flags high raters only when both SDR answers are Agree+", () => {
    expect(sdrFlag([3, 3])).toBe(true);
    expect(sdrFlag([4, 3])).toBe(true);
    expect(sdrFlag([2, 4])).toBe(false);
    expect(sdrFlag([0, 0])).toBe(false);
  });
});

describe("station scorers", () => {
  it("scores each station on its original scale", () => {
    expect(kinScore(6)).toBe(1);
    expect(kinScore(3)).toBeCloseTo(0.5);
    expect(senScore(4)).toBeCloseTo(0.8);
    expect(memScore(9, 1)).toBeCloseTo(8 / 12);
    expect(memScore(2, 7)).toBe(0); // floor at 0, never negative
    expect(anlScore(3)).toBeCloseTo(0.75);
    expect(genScore(20)).toBe(1); // capped at 12
    expect(genScore(9)).toBeCloseTo(0.75);
    expect(relScore(5)).toBe(1);
    expect(expScore(2, 1)).toBeCloseTo(0.75);
    expect(adpScore(9, 90)).toBe(1);
    expect(adpScore(0, 45)).toBeCloseTo(0.4 * 0.5);
    expect(perScore(1, 1, 1)).toBe(1); // <=2s err -> 2 pts
    expect(perScore(4, 0, 1)).toBeCloseTo(0.5); // <=5s -> 1 pt
    expect(perScore(10, 0, 0)).toBe(0);
  });

  it("dedupes generative uses case-insensitively", () => {
    expect(
      uniqueUses("Doorstop\n doorstop \nPaperweight\n\nDOORSTOP\nweapon"),
    ).toEqual(["Doorstop", "Paperweight", "weapon"]);
  });
});

describe("braids", () => {
  it("resolves all 36 pairs from either ordering", () => {
    expect(BRAIDS).toHaveLength(36);
    for (let i = 0; i < DOMAINS.length; i++)
      for (let j = i + 1; j < DOMAINS.length; j++) {
        const a = DOMAINS[i].id;
        const b = DOMAINS[j].id;
        expect(braidFor(a, b)).toBeTruthy();
        expect(braidFor(b, a)).toBe(braidFor(a, b));
      }
    expect(Object.keys(BRAID_BY_KEY)).toHaveLength(36);
  });
  it("has the Canonical Ten and full tier counts", () => {
    expect(CANONICAL_TEN).toHaveLength(10);
    expect(BRAIDS.filter((b) => b.tier === "S")).toHaveLength(12);
    expect(BRAIDS.filter((b) => b.tier === "R")).toHaveLength(10);
    expect(BRAIDS.filter((b) => b.tier === "Q")).toHaveLength(4);
  });
});

describe("buildFlow", () => {
  it("materializes 74 steps with SDR at the original's effective positions (22 and 46)", () => {
    const flow = buildFlow(false);
    expect(flow).toHaveLength(FLOW_LENGTH);
    expect(flow[SDR_EFFECTIVE_POSITIONS[0]]).toEqual({ t: "S", i: 0 });
    expect(flow[SDR_EFFECTIVE_POSITIONS[1]]).toEqual({ t: "S", i: 1 });
    expect(flow.filter((s) => s.t === "A")).toHaveLength(45);
    expect(flow.filter((s) => s.t === "C")).toHaveLength(27);
  });

  it("keeps canonical order for first-time takers", () => {
    const flow = buildFlow(false);
    const firstRound = flow.slice(0, 9).map((s) => (s.t === "A" ? s.d : ""));
    expect(firstRound).toEqual(DOMAINS.map((d) => d.id));
  });

  it("covers every (domain, item) pair exactly once even when shuffled", () => {
    const flow = buildFlow(true, mulberry32(42));
    expect(flow).toHaveLength(FLOW_LENGTH);
    expect(flow[22]).toEqual({ t: "S", i: 0 });
    expect(flow[46]).toEqual({ t: "S", i: 1 });
    const seen = new Set(
      flow
        .filter((s) => s.t !== "S")
        .map((s) => `${s.t}:${(s as { d: string }).d}:${s.i}`),
    );
    expect(seen.size).toBe(45 + 27);
  });
});

describe("computeShape", () => {
  const sortedOf = (R: ResultMap) =>
    [...DOMAINS].sort((x, y) => R[y.id].score - R[x.id].score);

  it("classifies a Tower (one true signature, gap >= 15)", () => {
    const R = makeR({ KIN: 90, SEN: 55, ADP: 54, ANL: 53, MEM: 52, GEN: 51, REL: 50, EXP: 49, PER: 48 });
    expect(computeShape(R, sortedOf(R))).toBe("Tower");
  });
  it("classifies a Ridge (two+ true signatures)", () => {
    const R = makeR({ KIN: 88, EXP: 85, SEN: 50, ADP: 49, ANL: 48, MEM: 47, GEN: 46, REL: 45, PER: 44 });
    expect(computeShape(R, sortedOf(R))).toBe("Ridge");
  });
  it("classifies Anchored (one signature, small gap, 2+ supporting)", () => {
    const R = makeR({ KIN: 80, SEN: 68, ADP: 66, ANL: 60, MEM: 50, GEN: 45, REL: 40, EXP: 40, PER: 40 });
    expect(computeShape(R, sortedOf(R))).toBe("Anchored");
  });
  it("classifies a flat profile as Plateau even though computeM force-names a Signature", () => {
    const R = makeR({ KIN: 55, SEN: 55, ADP: 55, ANL: 55, MEM: 55, GEN: 55, REL: 55, EXP: 55, PER: 55 });
    const m = computeM(R);
    expect(m.shape).toBe("Plateau");
    expect(m.sig).toHaveLength(1); // forced display signature...
    expect(m.band(m.sig[0])).toBe("Signature"); // ...still bands as Signature
  });
});

/* Golden master: a full synthetic run, every number hand-computed from the
   original source's math. This is the port's correctness anchor. */
describe("golden master", () => {
  const respA: Record<DomainId, number[]> = {
    KIN: [4, 4, 4, 0, 4], // 20 -> 100
    SEN: [3, 3, 3, 1, 3], // 15 -> 75
    ADP: [2, 2, 2, 2, 2], // 10 -> 50
    ANL: [4, 3, 4, 1, 4], // 18 -> 90
    MEM: [1, 1, 1, 3, 1], // 5  -> 25
    GEN: [3, 3, 3, 1, 3], // 15 -> 75
    REL: [2, 3, 2, 2, 3], // 12 -> 60
    EXP: [4, 4, 3, 0, 4], // 19 -> 95
    PER: [2, 2, 3, 2, 2], // 11 -> 55
  };
  const respC: Record<DomainId, number[]> = {
    KIN: [4, 4, 4], // 100
    SEN: [3, 3, 3], // 75
    ADP: [2, 2, 2], // 50
    ANL: [4, 4, 3], // 91.67
    MEM: [1, 1, 1], // 25
    GEN: [3, 3, 2], // 66.67
    REL: [3, 3, 3], // 75
    EXP: [4, 4, 4], // 100
    PER: [2, 2, 2], // 50
  };
  const B: Partial<Record<DomainId, number>> = {
    KIN: 5 / 6,
    SEN: 0.8,
    // ADP deliberately skipped
    ANL: 0.75,
    MEM: 8 / 12,
    GEN: 0.75,
    REL: 0.8,
    EXP: 0.75,
    PER: 0.5,
  };

  const R = scoreDomains(respA, respC, B);
  const m = computeM(R);

  it("produces the hand-computed composite scores", () => {
    expect(R.KIN.score).toBe(95);
    expect(R.SEN.score).toBe(77); // 76.5 rounds up
    expect(R.ADP.score).toBe(50); // skip reweight (25+10)/0.7
    expect(R.ADP.skipped).toBe(true);
    expect(R.ANL.score).toBe(86);
    expect(R.MEM.score).toBe(38); // 37.5 rounds up
    expect(R.GEN.score).toBe(73);
    expect(R.REL.score).toBe(69);
    expect(R.EXP.score).toBe(90);
    expect(R.PER.score).toBe(53); // 52.5 rounds up
  });

  it("derives signatures, braid, bands, and shape", () => {
    // median 73; signature needs >=70 and >=83: KIN 95, EXP 90, ANL 86 -> cap 2
    expect(m.sig.map((d) => d.id)).toEqual(["KIN", "EXP"]);
    expect(m.primary?.name).toBe("The Performer");
    expect(m.primary?.tier).toBe("C");
    expect(m.shape).toBe("Ridge"); // 3 true signatures
    expect(m.band(m.sorted.find((d) => d.id === "ANL")!)).toBe("Supporting");
    expect(m.band(m.sorted.find((d) => d.id === "PER")!)).toBe("Developing");
    expect(m.band(m.sorted.find((d) => d.id === "MEM")!)).toBe("Dormant");
    expect(m.leadingFamily).toBe("soma"); // soma 74 > field 70.67 > mind 65.67
  });

  it("finds the unclaimed gap and adjacent/reachable braids", () => {
    expect(m.topUnclaimed?.id).toBe("MEM"); // B 66.67 - A 25 = +42
    expect(m.unclaimed.map((d) => d.id)).toEqual(["MEM"]);
    expect(m.aspir).toEqual([]);
    expect(m.gapOf(m.sorted.find((d) => d.id === "ADP")!)).toBeNull();
    expect([...m.adjKeys].sort()).toEqual(["ANL|EXP", "ANL|KIN"]);
    // Translator 176 beats Craftsman 172; Storyteller and Leader trail
    expect(m.reachable.map((b) => b.name)).toEqual([
      "The Translator",
      "The Craftsman",
    ]);
  });

  it("builds a GI-1.0 export that round-trips through the share-URL path", () => {
    const exportObj = buildExportObj({
      R,
      m,
      respA,
      respC,
      respSDR: [3, 2],
      Braw: { KIN: "5/6", ADP: "skipped" },
      Bnorm: B,
      ranksTop: ["KIN", "EXP", "GEN"],
      ranksBot: ["MEM", "ADP", "PER"],
      demographics: { age: "25-34", gender: null, education: null, region: null },
      code: "TEST01",
      consent: true,
      startedAt: 1_700_000_000_000,
      now: 1_700_000_000_000 + 17 * 60_000,
    });
    expect(exportObj.v).toBe("GI-1.0");
    expect(exportObj.minutes).toBe(17);
    expect(exportObj.signature).toBe("KI·EX (+me)");
    expect(signatureCode(m)).toBe("KI·EX (+me)");
    expect(exportObj.braid).toBe("The Performer");
    expect(exportObj.braidTier).toBe("C"); // the field the sheet always expected
    expect(exportObj.braidPair).toEqual(["KIN", "EXP"]);
    expect(exportObj.flags.sdr).toBe(false);
    expect(exportObj.flags.topUnclaimed).toBe("MEM");
    expect(exportObj.flags.rankOverlap).toBe(2); // KIN, EXP in computed top3; GEN not

    const hash = viewHashFor(exportObj);
    const payload = parseViewPayload(hash);
    const replayed = replayExport(payload);
    expect(replayed.exportObj.braid).toBe("The Performer");
    expect(replayed.exportObj.shape).toBe("Ridge");
    expect(replayed.m.R.KIN.score).toBe(95);
    expect(replayed.m.R.ADP.skipped).toBe(true);
    expect(replayed.exportObj.signature).toBe(exportObj.signature);
  });
});

describe("legacy payload parsing", () => {
  it("accepts an old-site payload (no braidTier, extra fields) and replays it", () => {
    // Shape traced from the original exportObj literal (docs/index.html:1941)
    const legacy = {
      v: "GI-1.0",
      event: "complete",
      code: "PILOT7",
      consent: true,
      ts: "2026-01-15T12:00:00.000Z",
      minutes: 24,
      B: { KIN: "4/6", SEN: "skipped" },
      ranksTop: ["GEN", "EXP", "REL"],
      demographics: { age: "35-44", gender: "female", education: null, region: "US" },
      domains: {
        KIN: { A: 40, B: 66.7, C: 50, score: 50, skipped: false },
        SEN: { A: 55, B: 0, C: 50, score: 54, skipped: true },
        ADP: { A: 35, B: 40, C: 42, score: 38, skipped: false },
        ANL: { A: 60, B: 75, C: 66.7, score: 66, skipped: false },
        MEM: { A: 45, B: 58.3, C: 50, score: 50, skipped: false },
        GEN: { A: 85, B: 83.3, C: 91.7, score: 86, skipped: false },
        REL: { A: 70, B: 80, C: 75, score: 74, skipped: false },
        EXP: { A: 90, B: 75, C: 100, score: 88, skipped: false },
        PER: { A: 50, B: 50, C: 58.3, score: 52, skipped: false },
      },
      signature: "GE·EX",
      braid: "The Storyteller",
      braidPair: ["GEN", "EXP"],
      adjacent: ["EXP|REL", "GEN|REL"],
      shape: "Ridge",
      reachable: ["The Leader"],
      flags: { sdr: false, unclaimed: [], aspirational: [], topUnclaimed: null, rankOverlap: 3 },
    };
    const hash = "#view=" + encodeURIComponent(JSON.stringify(legacy));
    const payload = parseViewPayload(hash);
    const { m, exportObj } = replayExport(payload);
    // Recomputed through the current engine from stored per-domain scores:
    expect(m.R.GEN.score).toBe(86);
    expect(exportObj.braid).toBe("The Storyteller");
    expect(exportObj.braidTier).toBe("C"); // now derivable even for legacy rows
    expect(exportObj.code).toBe("PILOT7");
    expect(m.R.SEN.skipped).toBe(true);
  });

  it("throws a typed error on garbage", () => {
    expect(() => parseViewPayload("#view=%7Bnope")).toThrow(PayloadParseError);
    expect(() => parseViewPayload('{"domains": "nope"}')).toThrow(
      PayloadParseError,
    );
  });
});
