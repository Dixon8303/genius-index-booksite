/* The nine micro-performance stations (ten screens — Mnemonic splits into
   study/recall around the Analytic distractor), rebuilt as React components.
   Task mechanics, fixtures, copy, and scoring all match the original
   assessment; only the rendering moved from innerHTML to components. Each
   station ends in onComplete(dom, norm 0..1, raw) — or onSkip for the
   audio station, which keeps its prominent no-sound escape hatch. */

import { useEffect, useRef, useState } from "react";
import type { DomainId } from "@/lib/genius/data/domains";
import {
  ANL_ITEMS,
  KIN_SEQ,
  MEM_RECOG,
  MEM_TARGETS,
  PITCH_TRIALS,
  REL_ITEMS,
} from "@/lib/genius/data/stations";
import {
  adpScore,
  anlScore,
  expScore,
  genScore,
  kinScore,
  memScore,
  perScore,
  relScore,
  senScore,
  uniqueUses,
} from "@/lib/genius/engine/scoring";

export interface StationProps {
  onComplete: (dom: DomainId, norm: number, raw: string) => void;
  onSkip: (dom: DomainId) => void;
}

function StageCount({ children }: { children: React.ReactNode }) {
  return <div className="stagecount">{children}</div>;
}

/* Ticking countdown that survives re-renders; onDone fires once at zero. */
function useCountdown(seconds: number, running: boolean, onDone: () => void) {
  const [left, setLeft] = useState(seconds);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          clearInterval(iv);
          if (!doneRef.current) {
            doneRef.current = true;
            onDoneRef.current();
          }
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [running]);
  return left;
}

/* --- KIN: sequence reproduction --- */
export function StationKin({ onComplete }: StationProps) {
  const arrows = ["↑", "→", "↓", "←"];
  const [phase, setPhase] = useState<"idle" | "playing" | "input" | "done">("idle");
  const [flashing, setFlashing] = useState<number | null>(null);
  const [input, setInput] = useState<number[]>([]);
  const [msg, setMsg] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const play = () => {
    setPhase("playing");
    setMsg("Watch…");
    const seq = [...KIN_SEQ, ...KIN_SEQ];
    let delay = 0;
    seq.forEach((padIdx, t) => {
      timers.current.push(
        setTimeout(() => setFlashing(padIdx), delay),
        setTimeout(() => setFlashing(null), delay + 550),
      );
      delay += 550 + (t + 1 === KIN_SEQ.length ? 700 : 200);
    });
    timers.current.push(
      setTimeout(() => {
        setPhase("input");
        setMsg("Your turn — tap the 6 steps in order.");
      }, delay),
    );
  };

  const tap = (i: number) => {
    if (phase !== "input") return;
    setFlashing(i);
    timers.current.push(setTimeout(() => setFlashing(null), 150));
    const next = [...input, i];
    setInput(next);
    if (next.length === 6) {
      let c = 0;
      for (let k = 0; k < 6; k++) if (next[k] === KIN_SEQ[k]) c++;
      setPhase("done");
      setMsg(`Recorded: ${c}/6 in position.`);
      timers.current.push(
        setTimeout(() => onComplete("KIN", kinScore(c), `${c}/6`), 900),
      );
    }
  };

  return (
    <>
      <StageCount>Station 1 of 9 · Kinetic</StageCount>
      <h2>Sequence reproduction</h2>
      <p className="dim small">
        A 6-step pattern will flash on the pad — twice. Then repeat it from
        memory by tapping.
      </p>
      <div className="padgrid">
        {arrows.map((a, i) => (
          <button
            key={i}
            className={`pad${flashing === i ? " flash" : ""}`}
            disabled={phase !== "input"}
            onClick={() => tap(i)}
          >
            {a}
          </button>
        ))}
      </div>
      {phase === "idle" && (
        <button className="btn primary" onClick={play}>
          Show the pattern
        </button>
      )}
      <p className="small dim">{msg}</p>
    </>
  );
}

/* --- SEN: pitch match (Web Audio) --- */
export function StationSen({ onComplete, onSkip }: StationProps) {
  const [trial, setTrial] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answersOn, setAnswersOn] = useState(false);
  const [msg, setMsg] = useState("");
  const ctxRef = useRef<AudioContext | null>(null);

  const tone = (ctx: AudioContext, f: number, when: number, dur: number) => {
    const o = ctx.createOscillator(),
      g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = f;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(0.25, when + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    o.start(when);
    o.stop(when + dur + 0.05);
  };

  const playTones = () => {
    try {
      // AudioContext must be created inside the user gesture (iOS Safari).
      if (!ctxRef.current)
        ctxRef.current = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)();
      const ctx = ctxRef.current;
      void ctx.resume?.();
      const t = PITCH_TRIALS[trial],
        f2 = t.base * Math.pow(2, t.cents / 1200),
        now = ctx.currentTime + 0.05;
      tone(ctx, t.base, now, 0.7);
      tone(ctx, f2, now + 1.0, 0.7);
      setAnswersOn(true);
    } catch {
      setMsg("Audio isn't available in this browser — use “skip station” below.");
    }
  };

  const answer = (id: "hi" | "same" | "lo") => {
    const c = PITCH_TRIALS[trial].cents;
    const key = c > 0 ? "hi" : c < 0 ? "lo" : "same";
    const nCorrect = correct + (id === key ? 1 : 0);
    if (trial + 1 >= PITCH_TRIALS.length) {
      onComplete("SEN", senScore(nCorrect), `${nCorrect}/5`);
      return;
    }
    setCorrect(nCorrect);
    setTrial(trial + 1);
    setAnswersOn(false);
  };

  return (
    <>
      <StageCount>Station 2 of 9 · Sensory</StageCount>
      <h2>Pitch match · trial {trial + 1} of 5</h2>
      <p className="dim small">
        Two tones will play. Use earphones or a quiet room. Was the second tone
        higher, lower, or the same?
      </p>
      <button className="btn primary" onClick={playTones}>
        Play tones
      </button>
      <div className="btnrow">
        <button className="btn" disabled={!answersOn} onClick={() => answer("hi")}>
          Higher
        </button>
        <button className="btn" disabled={!answersOn} onClick={() => answer("same")}>
          Same
        </button>
        <button className="btn" disabled={!answersOn} onClick={() => answer("lo")}>
          Lower
        </button>
      </div>
      <p className="small dim">{msg}</p>
      <button className="btn ghost" onClick={() => onSkip("SEN")}>
        No sound on this device — skip station
      </button>
    </>
  );
}

/* --- MEM study (unscored; recall happens after the ANL distractor) --- */
export function StationMemStudy({ onAdvance }: { onAdvance: () => void }) {
  const left = useCountdown(45, true, onAdvance);
  return (
    <>
      <StageCount>Station 3 of 9 · Mnemonic — part one</StageCount>
      <h2>Study these twelve words</h2>
      <p className="dim small">
        You'll be asked about them after the next station. 45 seconds.
      </p>
      <div className="memgrid">
        {MEM_TARGETS.map((w) => (
          <div key={w} className="btn" style={{ cursor: "default" }}>
            {w}
          </div>
        ))}
      </div>
      <div className="timer">{left}</div>
      <button className="btn ghost" onClick={onAdvance}>
        I'm ready early
      </button>
    </>
  );
}

/* --- ANL: pattern set (doubles as the MEM distractor), 90s global timer --- */
export function StationAnl({ onComplete }: StationProps) {
  const [i, setI] = useState(0);
  const correctRef = useRef(0);
  const finished = useRef(false);
  const finish = (timedOut: boolean) => {
    if (finished.current) return;
    finished.current = true;
    const c = correctRef.current;
    onComplete("ANL", anlScore(c), `${c}/4${timedOut ? " (time)" : ""}`);
  };
  const left = useCountdown(90, true, () => finish(true));
  const answer = (v: number) => {
    if (v === ANL_ITEMS[i].k) correctRef.current++;
    if (i + 1 >= ANL_ITEMS.length) finish(false);
    else setI(i + 1);
  };
  const it = ANL_ITEMS[i];
  return (
    <>
      <StageCount>Station 4 of 9 · Analytic</StageCount>
      <h2>What comes next?</h2>
      <div className="timer">{left}</div>
      <div className="qtext" style={{ textAlign: "center", letterSpacing: ".06em" }}>
        {it.q}
      </div>
      {it.opts.map((o, v) => (
        <button key={`${i}-${v}`} className="btn" onClick={() => answer(v)}>
          {o}
        </button>
      ))}
    </>
  );
}

/* --- MEM recall: recognition with false-alarm penalty --- */
export function StationMemRecall({ onComplete }: StationProps) {
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const toggle = (w: string) => {
    setPicked((p) => {
      const n = new Set(p);
      if (n.has(w)) n.delete(w);
      else n.add(w);
      return n;
    });
  };
  const lock = () => {
    let hits = 0,
      fa = 0;
    picked.forEach((w) => (MEM_TARGETS.includes(w) ? hits++ : fa++));
    onComplete("MEM", memScore(hits, fa), `hits ${hits} · false ${fa}`);
  };
  return (
    <>
      <StageCount>Station 5 of 9 · Mnemonic — part two</StageCount>
      <h2>Which words did you study?</h2>
      <p className="dim small">
        Tap every word you saw earlier. Twelve were shown; twelve are new.
        Guessing costs you.
      </p>
      <div className="memgrid">
        {MEM_RECOG.map((w) => (
          <button
            key={w}
            className={`btn${picked.has(w) ? " sel" : ""}`}
            onClick={() => toggle(w)}
          >
            {w}
          </button>
        ))}
      </div>
      <button className="btn primary" onClick={lock}>
        Lock answers
      </button>
    </>
  );
}

/* --- GEN: alternative uses, 90s --- */
export function StationGen({ onComplete }: StationProps) {
  const [text, setText] = useState("");
  const textRef = useRef("");
  textRef.current = text;
  const finished = useRef(false);
  const boxRef = useRef<HTMLTextAreaElement>(null);
  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    const lines = uniqueUses(textRef.current.toLowerCase());
    onComplete("GEN", genScore(lines.length), `${lines.length} uses`);
  };
  const left = useCountdown(90, true, finish);
  useEffect(() => boxRef.current?.focus(), []);
  return (
    <>
      <StageCount>Station 6 of 9 · Generative</StageCount>
      <h2>Uses for a brick</h2>
      <p className="dim small">
        90 seconds. List as many <em>different</em> uses for a brick as you can
        — one per line. Distinct ideas count; repeats don't.
      </p>
      <div className="timer">{left}</div>
      <textarea
        ref={boxRef}
        rows={8}
        placeholder={"doorstop\npaperweight\n…"}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="btn ghost" onClick={finish}>
        Stop early
      </button>
    </>
  );
}

/* --- REL: cue-reading vignettes --- */
export function StationRel({ onComplete }: StationProps) {
  const [i, setI] = useState(0);
  const correctRef = useRef(0);
  const answer = (v: number) => {
    if (v === REL_ITEMS[i].k) correctRef.current++;
    if (i + 1 >= REL_ITEMS.length) {
      onComplete("REL", relScore(correctRef.current), `${correctRef.current}/5`);
    } else setI(i + 1);
  };
  const it = REL_ITEMS[i];
  return (
    <>
      <StageCount>Station 7 of 9 · Relational</StageCount>
      <h2>Read the moment · {i + 1} of 5</h2>
      <div className="qtext" style={{ fontSize: 18 }}>
        {it.q}
      </div>
      {it.opts.map((o, v) => (
        <button key={`${i}-${v}`} className="btn" onClick={() => answer(v)}>
          {o}
        </button>
      ))}
      <p className="small dim">
        Scored against consensus reads. Text-based v1 — media version follows
        the pilot.
      </p>
    </>
  );
}

/* --- EXP: 60-second impromptu, honestly self-rated --- */
export function StationExp({ onComplete }: StationProps) {
  const [phase, setPhase] = useState<"idle" | "running" | "rate">("idle");
  const [clarity, setClarity] = useState<number | null>(null);
  const left = useCountdown(60, phase === "running", () => setPhase("rate"));

  if (phase === "rate") {
    return (
      <>
        <StageCount>Station 8 of 9 · Expressive</StageCount>
        <h2>Rate your run — honestly</h2>
        <p className="dim small">
          The Index only works unclouded. Score what happened, not what you
          hoped.
        </p>
        <h3>Clarity</h3>
        {[
          "0 · I wandered or didn't finish the idea",
          "1 · Mostly clear, some stumbles",
          "2 · Clear from first line to last",
        ].map((label, v) => (
          <button
            key={v}
            className={`btn${clarity === v ? " sel" : ""}`}
            onClick={() => setClarity(v)}
          >
            {label}
          </button>
        ))}
        {clarity !== null && (
          <>
            <h3 style={{ marginTop: 14 }}>Hold</h3>
            {[
              "0 · Flat — a listener would drift",
              "1 · Some pull",
              "2 · A listener would stay with me",
            ].map((label, hv) => (
              <button
                key={hv}
                className="btn"
                onClick={() =>
                  onComplete(
                    "EXP",
                    expScore(clarity, hv),
                    `clarity ${clarity} · hold ${hv} (self)`,
                  )
                }
              >
                {label}
              </button>
            ))}
          </>
        )}
      </>
    );
  }
  return (
    <>
      <StageCount>Station 8 of 9 · Expressive</StageCount>
      <h2>Sixty seconds, out loud</h2>
      <p className="dim small">
        Prompt: <strong>Explain to a ten-year-old why the sky is blue.</strong>{" "}
        Speak aloud — to the room, a mirror, or a voice memo. Start the clock
        when you start talking.
      </p>
      <div className="timer">{phase === "running" ? left : 60}</div>
      <button
        className="btn primary"
        disabled={phase === "running"}
        onClick={() => setPhase("running")}
      >
        Start the clock
      </button>
    </>
  );
}

/* --- ADP: hypermobility screen + breath-hold --- */
const ADP_CHECKS = [
  "Left little finger bends back past 90°",
  "Right little finger bends back past 90°",
  "Left thumb touches forearm",
  "Right thumb touches forearm",
  "Left elbow extends beyond straight",
  "Right elbow extends beyond straight",
  "Left knee extends beyond straight",
  "Right knee extends beyond straight",
  "Palms flat on floor, knees straight",
];

export function StationAdp({ onComplete }: StationProps) {
  const [checked, setChecked] = useState<boolean[]>(Array(9).fill(false));
  const [hold, setHold] = useState(0);
  const [holdState, setHoldState] = useState<"idle" | "holding" | "done">("idle");
  const iv = useRef<ReturnType<typeof setInterval> | null>(null);
  const t0 = useRef(0);
  useEffect(
    () => () => {
      if (iv.current) clearInterval(iv.current);
    },
    [],
  );
  const toggleHold = () => {
    if (holdState === "idle") {
      setHoldState("holding");
      t0.current = Date.now();
      iv.current = setInterval(
        () => setHold((Date.now() - t0.current) / 1000),
        100,
      );
    } else if (holdState === "holding") {
      if (iv.current) clearInterval(iv.current);
      setHoldState("done");
    }
  };
  const finish = () => {
    if (iv.current) clearInterval(iv.current);
    const b = checked.filter(Boolean).length;
    onComplete(
      "ADP",
      adpScore(b, hold),
      `Beighton ${b}/9 · hold ${hold.toFixed(0)}s`,
    );
  };
  return (
    <>
      <StageCount>Station 9a · Adaptive</StageCount>
      <h2>Body screen</h2>
      <p className="dim small">
        Check what's true for you (gently — never force a joint):
      </p>
      <div>
        {ADP_CHECKS.map((c, i) => (
          <label key={i} className="checkline">
            <input
              type="checkbox"
              checked={checked[i]}
              onChange={() =>
                setChecked((arr) => arr.map((v, k) => (k === i ? !v : v)))
              }
            />{" "}
            {c}
          </label>
        ))}
      </div>
      <h3 style={{ marginTop: 16 }}>Breath-hold</h3>
      <p className="small dim">
        Seated. Normal breath in, hold, stop at the first strong urge. ⚠ Never
        in water, never standing, never past discomfort.
      </p>
      <div className="timer">{hold.toFixed(1)}</div>
      <button
        className="btn"
        disabled={holdState === "done"}
        onClick={toggleHold}
      >
        {holdState === "holding" ? "Stop — I breathed" : "Start hold"}
      </button>
      <button className="btn primary" onClick={finish}>
        Finish station
      </button>
    </>
  );
}

/* --- PER: orientation + time sense --- */
export function StationPer({ onComplete }: StationProps) {
  const [north, setNorth] = useState<0 | 1 | null>(null);
  const [exit, setExit] = useState<0 | 1 | null>(null);
  const [est, setEst] = useState<number | null>(null);
  const [timing, setTiming] = useState(false);
  const t0 = useRef(0);

  useEffect(() => {
    if (north !== null && exit !== null && est !== null) {
      const err = Math.abs(est - 30);
      onComplete(
        "PER",
        perScore(err, north, exit),
        `north ${north} · exit ${exit} · est ${est.toFixed(1)}s`,
      );
    }
  }, [north, exit, est, onComplete]);

  const timeBtn = () => {
    if (est !== null) return;
    if (!timing) {
      t0.current = Date.now();
      setTiming(true);
    } else {
      setEst((Date.now() - t0.current) / 1000);
    }
  };

  const pair = (
    value: 0 | 1 | null,
    set: (v: 0 | 1) => void,
    yes: string,
    no: string,
  ) => (
    <div className="btnrow">
      <button
        className={`btn${value === 1 ? " sel" : ""}`}
        onClick={() => set(1)}
      >
        {yes}
      </button>
      <button
        className={`btn${value === 0 ? " sel" : ""}`}
        onClick={() => set(0)}
      >
        {no}
      </button>
    </div>
  );

  return (
    <>
      <StageCount>Station 9b · Perceptive</StageCount>
      <h2>Orientation &amp; time</h2>
      <h3>1 · Point north</h3>
      <p className="small dim">
        Physically point where you believe north is. Then check a compass app.
      </p>
      {pair(north, (v) => setNorth(v), "I was right (±45°)", "Off / unsure")}
      <h3 style={{ marginTop: 14 }}>2 · The last building</h3>
      <p className="small dim">
        Picture the last building you were in, other than home. From where you
        sat or stood — where was the nearest exit? Verify from memory or a map.
      </p>
      {pair(exit, (v) => setExit(v), "Placed it correctly", "Couldn't place it")}
      <h3 style={{ marginTop: 14 }}>3 · Thirty seconds, no counting</h3>
      <p className="small dim">
        Press start, look away from the screen, press stop when you feel 30
        seconds have passed. Don't count.
      </p>
      <button className="btn" disabled={est !== null} onClick={timeBtn}>
        {est !== null ? `You stopped at ${est.toFixed(1)}s` : timing ? "Stop at 30" : "Start"}
      </button>
    </>
  );
}
