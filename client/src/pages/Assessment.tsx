/* The assessment flow controller: intro → 74-item inventory (with the two
   honesty items spliced in) → nine stations → forced ranking → optional
   demographics → scoring → /results. The reducer state IS the autosave
   payload — every dispatch persists to localStorage, so a refresh resumes
   instead of losing the run (the original's biggest gap). */

import { useEffect, useMemo, useReducer, useState } from "react";
import { useLocation } from "wouter";
import GiShell, { LegalFootnote } from "@/components/genius/GiShell";
import {
  StationAdp,
  StationAnl,
  StationExp,
  StationGen,
  StationKin,
  StationMemRecall,
  StationMemStudy,
  StationPer,
  StationRel,
  StationSen,
} from "@/components/genius/stations";
import {
  AGREE,
  DOMAINS,
  DOMAIN_BY_ID,
  FREQ,
  type DomainId,
} from "@/lib/genius/data/domains";
import { A_ITEMS, C_ITEMS, SDR_ITEMS } from "@/lib/genius/data/items";
import { STATION_SEQ } from "@/lib/genius/data/stations";
import { buildExportObj } from "@/lib/genius/engine/export";
import { buildFlow, FLOW_LENGTH } from "@/lib/genius/engine/flow";
import { computeM } from "@/lib/genius/engine/interpret";
import { scoreDomains } from "@/lib/genius/engine/scoring";
import { realmHex } from "@/lib/genius/viz/builders";
import {
  appendResult,
  isRetake,
} from "@/lib/genius/storage/history";
import {
  clearRun,
  loadRun,
  saveRun,
  type RunState,
} from "@/lib/genius/storage/run";
import { submitTelemetry, telemetryStart } from "@/lib/genius/telemetry";

type Action =
  | { type: "START"; state: RunState }
  | { type: "ANSWER"; value: number }
  | { type: "BACK" }
  | { type: "BEGIN_STATIONS" }
  | { type: "STATION_DONE"; dom: DomainId; norm: number; raw: string }
  | { type: "STATION_SKIP"; dom: DomainId }
  | { type: "MEM_STUDY_DONE" }
  | { type: "RANK_PICK"; id: DomainId }
  | { type: "DEMO_SET"; field: keyof RunState["demo"]; value: string | null }
  | { type: "TO_DEMOGRAPHICS" };

function freshRun(): RunState {
  const respA = {} as RunState["respA"];
  const respC = {} as RunState["respC"];
  DOMAINS.forEach((d) => {
    respA[d.id] = [null, null, null, null, null];
    respC[d.id] = [null, null, null];
  });
  return {
    v: 1,
    startedAt: Date.now(),
    updatedAt: Date.now(),
    phase: "inventory",
    flow: buildFlow(isRetake()),
    flowIdx: 0,
    respA,
    respC,
    respSDR: [null, null],
    stIdx: 0,
    B: {},
    Braw: {},
    memStudyShown: false,
    ranksTop: [],
    ranksBot: [],
    demo: { age: null, gender: null, education: null, region: null },
    consent: true,
    code: "",
  };
}

function reducer(state: RunState | null, action: Action): RunState | null {
  if (action.type === "START") return action.state;
  if (!state) return state;
  switch (action.type) {
    case "ANSWER": {
      const step = state.flow[state.flowIdx];
      const next = structuredClone(state);
      if (step.t === "A") next.respA[step.d][step.i] = action.value;
      else if (step.t === "C") next.respC[step.d][step.i] = action.value;
      else next.respSDR[step.i] = action.value;
      if (next.flowIdx + 1 >= next.flow.length) next.phase = "stationsIntro";
      else next.flowIdx++;
      return next;
    }
    case "BACK": {
      if (state.phase !== "inventory" || state.flowIdx === 0) return state;
      return { ...state, flowIdx: state.flowIdx - 1 };
    }
    case "BEGIN_STATIONS":
      return { ...state, phase: "station", stIdx: 0 };
    case "STATION_DONE": {
      const next = structuredClone(state);
      next.B[action.dom] = Math.max(0, Math.min(1, action.norm));
      next.Braw[action.dom] = action.raw;
      next.stIdx++;
      if (next.stIdx >= STATION_SEQ.length) next.phase = "ranking";
      return next;
    }
    case "STATION_SKIP": {
      const next = structuredClone(state);
      delete next.B[action.dom];
      next.Braw[action.dom] = "skipped";
      next.stIdx++;
      if (next.stIdx >= STATION_SEQ.length) next.phase = "ranking";
      return next;
    }
    case "MEM_STUDY_DONE": {
      const next = structuredClone(state);
      next.memStudyShown = true;
      next.stIdx++;
      return next;
    }
    case "RANK_PICK": {
      const next = structuredClone(state);
      if (next.ranksTop.length < 3) next.ranksTop.push(action.id);
      else if (next.ranksBot.length < 3) next.ranksBot.push(action.id);
      if (next.ranksBot.length === 3) next.phase = "demographics";
      return next;
    }
    case "TO_DEMOGRAPHICS":
      return { ...state, phase: "demographics" };
    case "DEMO_SET": {
      const next = structuredClone(state);
      next.demo[action.field] =
        next.demo[action.field] === action.value ? null : action.value;
      return next;
    }
    default:
      return state;
  }
}

const RANK_DESC: Record<DomainId, string> = {
  KIN: "Body & movement",
  SEN: "Senses & perception",
  ADP: "Physical adaptation",
  ANL: "Analysis & systems",
  MEM: "Memory",
  GEN: "Idea generation",
  REL: "Reading people",
  EXP: "Expression & performance",
  PER: "Environmental awareness",
};

const DEMO_FIELDS: {
  key: keyof RunState["demo"];
  label: string;
  opts: string[];
}[] = [
  { key: "age", label: "Age range", opts: ["Under 18", "18–24", "25–34", "35–44", "45–54", "55–64", "65+"] },
  { key: "gender", label: "Gender", opts: ["Woman", "Man", "Non-binary / other"] },
  { key: "education", label: "Education", opts: ["No degree", "High school", "Some college", "Bachelor's", "Graduate / professional"] },
  { key: "region", label: "Region", opts: ["North America", "South America", "Europe", "Africa", "Middle East", "Asia", "Oceania"] },
];

export default function Assessment() {
  const [, navigate] = useLocation();
  const [run, dispatch] = useReducer(reducer, null);
  const [savedRun] = useState(() => loadRun());
  const [showIntro, setShowIntro] = useState(true);
  const [code, setCode] = useState("");
  const [finalizing, setFinalizing] = useState(false);

  // Autosave on every state change while a run is active.
  useEffect(() => {
    if (run && !finalizing) saveRun(run);
  }, [run, finalizing]);

  const progress = useMemo(() => {
    if (!run) return 0;
    switch (run.phase) {
      case "inventory":
        return 0.04 + 0.5 * (run.flowIdx / FLOW_LENGTH);
      case "stationsIntro":
        return 0.56;
      case "station":
        return 0.56 + 0.34 * (run.stIdx / STATION_SEQ.length);
      case "ranking":
        return 0.93;
      case "demographics":
        return 0.97;
      default:
        return 0;
    }
  }, [run]);

  const litCells = useMemo(() => {
    if (!run) return 0;
    if (run.phase === "inventory")
      return Math.floor((run.flowIdx / FLOW_LENGTH) * 4);
    if (run.phase === "stationsIntro") return 4;
    if (run.phase === "station")
      return 4 + Math.floor((run.stIdx / STATION_SEQ.length) * 5);
    return 9;
  }, [run]);

  const start = (resume: RunState | null) => {
    const state = resume ?? freshRun();
    if (!resume) telemetryStart(code, true);
    dispatch({
      type: "START",
      state: resume ? state : { ...state, consent: true, code },
    });
    setShowIntro(false);
  };

  const finalize = (finished: RunState) => {
    setFinalizing(true);
    const respA = {} as Record<DomainId, number[]>;
    const respC = {} as Record<DomainId, number[]>;
    DOMAINS.forEach((d) => {
      respA[d.id] = finished.respA[d.id].map((v) => v ?? 0);
      respC[d.id] = finished.respC[d.id].map((v) => v ?? 0);
    });
    const R = scoreDomains(respA, respC, finished.B);
    const m = computeM(R);
    const exportObj = buildExportObj({
      R,
      m,
      respA,
      respC,
      respSDR: [finished.respSDR[0] ?? 0, finished.respSDR[1] ?? 0],
      Braw: finished.Braw,
      Bnorm: finished.B,
      ranksTop: finished.ranksTop,
      ranksBot: finished.ranksBot,
      demographics: finished.demo,
      code: finished.code,
      consent: finished.consent,
      startedAt: finished.startedAt,
    });
    const entry = appendResult(exportObj, "local");
    void submitTelemetry(
      exportObj as unknown as Record<string, unknown>,
      finished.consent,
    );
    clearRun();
    navigate(`/results/${entry.id}`);
  };

  /* ---------- Intro / resume ---------- */
  if (showIntro || !run) {
    return (
      <GiShell nav progress={undefined} litCells={0}>
        {savedRun && (
          <div className="card" style={{ borderColor: "var(--brass)" }}>
            <h3>A run in progress</h3>
            <p className="small dim">
              You left off {savedRun.phase === "inventory"
                ? `at item ${savedRun.flowIdx + 1} of ${FLOW_LENGTH}`
                : savedRun.phase === "station"
                  ? `at station ${Math.min(savedRun.stIdx + 1, 10)} of 10 — an interrupted station restarts from its beginning`
                  : `at the ${savedRun.phase} step`}.
            </p>
            <div className="btnrow">
              <button
                className="btn primary"
                onClick={() => {
                  // A station interrupted mid-trial restarts; a run that died
                  // between memory-study and recall re-studies (skipping
                  // recall silently would corrupt the B stream).
                  const resumed = structuredClone(savedRun);
                  if (
                    resumed.phase === "station" &&
                    resumed.stIdx > 2 &&
                    resumed.stIdx < 5 &&
                    !resumed.memStudyShown
                  ) {
                    resumed.stIdx = 2;
                  }
                  start(resumed);
                }}
              >
                Resume where I left off
              </button>
              <button
                className="btn ghost"
                onClick={() => {
                  clearRun();
                  window.location.reload();
                }}
              >
                Start over
              </button>
            </div>
          </div>
        )}
        <h1>
          Everybody carries a genius.
          <br />
          This locates yours.
        </h1>
        <p className="dim" style={{ margin: "14px 0 4px" }}>
          74 items and nine short stations. About 25–35 minutes. Nothing here
          measures intelligence — the Index locates where ability comes easiest
          to you, so it can be named and grown. <em>Identify to amplify.</em>
        </p>
        <div className="card">
          <h3>What this measures, and why</h3>
          <p className="small dim">
            This is the companion assessment to <strong>The Genius Index</strong>,
            the book this instrument is built from. The book's premise:
            intelligence isn't one number — everybody is genuinely gifted
            somewhere, and the task is finding where, naming it, and growing it
            on purpose.
          </p>
          <p className="small dim" style={{ marginTop: 8 }}>
            It maps ability into <strong>nine domains</strong> across three
            realms — <strong>SOMA</strong> (the body), <strong>MIND</strong>{" "}
            (the mind), and <strong>FIELD</strong> (people and the world around
            you).
          </p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <h3>The nine domains</h3>
          <div className="glyph big" style={{ margin: "16px auto", justifyContent: "center" }}>
            {[...DOMAINS]
              .sort((a, b) => a.cell - b.cell)
              .map((d) => {
                const col = realmHex(d.meta);
                return (
                  <div
                    key={d.id}
                    style={{ background: `${col}1f`, borderColor: `${col}77` }}
                  >
                    <span className="code" style={{ color: col }}>
                      {d.code.toUpperCase()}
                    </span>
                    <span className="pct" style={{ color: "var(--paper-dim)" }}>
                      {d.name}
                    </span>
                  </div>
                );
              })}
          </div>
          <p className="small dim" style={{ textAlign: "center", lineHeight: 1.7 }}>
            <span style={{ color: realmHex("soma") }}>■</span> SOMA — the body
            &nbsp;&nbsp;
            <span style={{ color: realmHex("mind") }}>■</span> MIND — the mind
            &nbsp;&nbsp;
            <span style={{ color: realmHex("field") }}>■</span> FIELD — the field
          </p>
        </div>
        <div className="card">
          <h3>Three parts</h3>
          <p className="small dim">
            <strong>Part 1 · The inventory.</strong> 74 concrete items about
            what actually happens — anchored to events, not self-flattery. One
            reverse-keyed item per domain catches autopilot answering.
          </p>
          <p className="small dim" style={{ marginTop: 8 }}>
            <strong>Part 2 · The nine stations.</strong> Short live probes —
            reproduce a sequence, discriminate tones, generate uses — that check
            your report against your record.
          </p>
          <p className="small dim" style={{ marginTop: 8 }}>
            <strong>Part 3 · The ranking.</strong> A forced top-and-bottom
            three. You can't rate everything high — that's the point.
          </p>
        </div>
        <div className="card">
          <p className="small dim">
            Taking the assessment contributes your anonymized answers to the
            ongoing validation study — no name, account, or identifying data
            is ever attached, and the data is used only in aggregate.
          </p>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Study code (optional)"
            style={{
              width: "100%",
              marginTop: 10,
              padding: "10px 12px",
              background: "var(--ink2)",
              border: "1px solid var(--line)",
              borderRadius: 5,
              color: "var(--paper)",
              fontFamily: "'Lato',sans-serif",
              fontSize: 14,
            }}
          />
        </div>
        <button className="btn primary" onClick={() => start(null)}>
          {savedRun ? "Start a fresh run" : "Begin · Part 1"}
        </button>
        <LegalFootnote />
      </GiShell>
    );
  }

  /* ---------- Inventory ---------- */
  if (run.phase === "inventory") {
    const step = run.flow[run.flowIdx];
    const isA = step.t === "A";
    const isSdr = step.t === "S";
    const text = isSdr
      ? SDR_ITEMS[step.i]
      : isA
        ? A_ITEMS[step.d][step.i].text
        : C_ITEMS[step.d][step.i];
    const scale = isA ? FREQ : AGREE;
    const current = isSdr
      ? run.respSDR[step.i]
      : isA
        ? run.respA[step.d][step.i]
        : run.respC[step.d][step.i];
    return (
      <GiShell nav={false} progress={progress} litCells={litCells}>
        <div className="stagecount">
          Part 1 · Item {run.flowIdx + 1} of {FLOW_LENGTH}
        </div>
        <h2 style={{ minHeight: 84 }}>{text}</h2>
        {scale.map((label, v) => (
          <button
            key={`${run.flowIdx}-${v}`}
            className={`btn${current === v ? " sel" : ""}`}
            onClick={() => dispatch({ type: "ANSWER", value: v })}
          >
            {label}
          </button>
        ))}
        <div className="btnrow">
          <button
            className="btn ghost"
            disabled={run.flowIdx === 0}
            onClick={() => dispatch({ type: "BACK" })}
          >
            ← Back
          </button>
        </div>
        <p className="small dim" style={{ marginTop: 10, opacity: 0.7 }}>
          Keep the top of the scale scarce — "Almost always" should be true of
          almost nothing. Progress saves automatically.
        </p>
      </GiShell>
    );
  }

  /* ---------- Stations intro ---------- */
  if (run.phase === "stationsIntro") {
    return (
      <GiShell nav={false} progress={progress} litCells={litCells}>
        <h2>Part 2 · The Nine Stations</h2>
        <p className="dim">
          Short performance probes — one per domain. These verify Part 1
          against what your body, memory, and senses actually do. Find a quiet
          spot. No preparation, no retries.
        </p>
        <div className="card small">
          <strong>Note:</strong> two stations involve light physical checks.
          Stop at any discomfort. Never attempt the breath-hold in water or
          while standing.
        </div>
        <button
          className="btn primary"
          onClick={() => dispatch({ type: "BEGIN_STATIONS" })}
        >
          Start stations
        </button>
      </GiShell>
    );
  }

  /* ---------- Stations ---------- */
  if (run.phase === "station") {
    const stepDef = STATION_SEQ[run.stIdx];
    const onComplete = (dom: DomainId, norm: number, raw: string) =>
      dispatch({ type: "STATION_DONE", dom, norm, raw });
    const onSkip = (dom: DomainId) => dispatch({ type: "STATION_SKIP", dom });
    let station: React.ReactNode = null;
    if (stepDef.kind === "memStudy")
      station = (
        <StationMemStudy onAdvance={() => dispatch({ type: "MEM_STUDY_DONE" })} />
      );
    else if (stepDef.kind === "memRecall")
      station = <StationMemRecall onComplete={onComplete} onSkip={onSkip} />;
    else {
      const map: Record<string, React.ComponentType<{ onComplete: typeof onComplete; onSkip: typeof onSkip }>> = {
        KIN: StationKin,
        SEN: StationSen,
        ANL: StationAnl,
        GEN: StationGen,
        REL: StationRel,
        EXP: StationExp,
        ADP: StationAdp,
        PER: StationPer,
      };
      const C = map[stepDef.dom];
      station = <C onComplete={onComplete} onSkip={onSkip} />;
    }
    return (
      <GiShell nav={false} progress={progress} litCells={litCells}>
        {/* key forces a clean remount per station — timers can't leak across */}
        <div key={run.stIdx}>{station}</div>
      </GiShell>
    );
  }

  /* ---------- Ranking ---------- */
  if (run.phase === "ranking") {
    const pickingTop = run.ranksTop.length < 3;
    const pool = DOMAINS.filter(
      (d) => !run.ranksTop.includes(d.id) && !run.ranksBot.includes(d.id),
    );
    return (
      <GiShell nav={false} progress={progress} litCells={litCells}>
        <div className="stagecount">Part 3 · Forced ranking</div>
        <h2>{pickingTop ? "Pick your TOP 3" : "Now your BOTTOM 3"}</h2>
        <p className="dim small">
          {pickingTop
            ? "The three that describe you most."
            : "The three that describe you least."}{" "}
          You can't rate everything high — that's the point.
        </p>
        {pool.map((d) => (
          <button
            key={d.id}
            className="btn"
            onClick={() => dispatch({ type: "RANK_PICK", id: d.id })}
          >
            {d.name} — {RANK_DESC[d.id]}
          </button>
        ))}
        <p className="small dim">
          {pickingTop ? run.ranksTop.length : run.ranksBot.length} of 3 selected
        </p>
      </GiShell>
    );
  }

  /* ---------- Demographics ---------- */
  return (
    <GiShell nav={false} progress={progress} litCells={litCells}>
      <div className="stagecount">Almost done · Optional</div>
      <h2>Help make this measurement mean something</h2>
      <p className="dim small">
        The book is honest that this instrument hasn't completed a formal
        validation study yet. These four questions help build toward one —
        checking whether the Index holds up consistently across different kinds
        of people. Entirely optional and anonymous: no name, account, or
        identifying data is ever attached. Leave anything blank to skip it.
      </p>
      <div className="demoblock">
        {DEMO_FIELDS.map((f) => (
          <div key={f.key} className="demofield">
            <div className="demolabel">{f.label}</div>
            <div className="demo-opts">
              {f.opts.map((o) => (
                <button
                  key={o}
                  type="button"
                  className={`demo-chip${run.demo[f.key] === o ? " sel" : ""}`}
                  onClick={() =>
                    dispatch({ type: "DEMO_SET", field: f.key, value: o })
                  }
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="btnrow" style={{ marginTop: 18 }}>
        <button
          className="btn primary"
          disabled={finalizing}
          onClick={() => finalize(run)}
        >
          {finalizing ? "Scoring…" : "Continue to my results →"}
        </button>
      </div>
    </GiShell>
  );
}
