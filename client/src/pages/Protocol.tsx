/* The 30-day Amplification Protocol tracker: pick a Signature domain, then
   one check-in a day across the book's five stages — Awareness 1–3,
   Assessment 4–7, Practice 8–21, Integration 22–27, Mastery 28–30.
   Missed days show honestly; a longest-streak stat replaces punitive resets. */

import { useMemo, useState } from "react";
import { Link } from "wouter";
import GiShell, { LegalFootnote } from "@/components/genius/GiShell";
import DomainGlyph from "@/components/DomainGlyph";
import { PROTOCOL_DOMAIN } from "@/lib/genius/content/library";
import {
  protocolSummary,
  taskForDay,
} from "@/lib/genius/content/protocolDetail";
import { DOMAINS, DOMAIN_BY_ID, type DomainId } from "@/lib/genius/data/domains";
import {
  domainsFromPayload,
  gi10Schema,
} from "@/lib/genius/engine/export";
import { computeM } from "@/lib/genius/engine/interpret";
import { latestFullResult } from "@/lib/genius/storage/history";
import {
  abandonRun,
  activeRun,
  checkIn,
  currentDay,
  currentStreak,
  doneCount,
  longestStreak,
  stageForDay,
  startRun,
  STAGES,
  weekForDay,
} from "@/lib/genius/storage/protocol";
import { realmHex } from "@/lib/genius/viz/builders";

export default function Protocol() {
  const [, forceRender] = useState(0);
  const rerender = () => forceRender((n) => n + 1);
  const run = activeRun();
  const [note, setNote] = useState("");
  const [confirmAbandon, setConfirmAbandon] = useState(false);

  const sigDomains = useMemo(() => {
    const latest = latestFullResult();
    if (!latest) return [];
    try {
      const m = computeM(
        domainsFromPayload(gi10Schema.parse(latest.export as unknown)),
      );
      return m.sig.map((d) => d.id);
    } catch {
      return [];
    }
  }, []);

  /* ---------- No active run: domain picker ---------- */
  if (!run) {
    const ordered = [
      ...sigDomains.map((id) => DOMAIN_BY_ID[id]),
      ...DOMAINS.filter((d) => !sigDomains.includes(d.id)),
    ];
    return (
      <GiShell nav wide>
        <h1>The 30-Day Amplification Protocol</h1>
        <p className="dim" style={{ margin: "14px 0" }}>
          Identify to amplify — a named genius grows only under deliberate
          reps. Thirty days, one domain, about 15–20 minutes a day. Every day
          you'll get one plain-language assignment and a one-tap check-in.
        </p>
        <div className="card">
          <h3>How the month works</h3>
          {STAGES.map((s) => (
            <p key={s.name} className="small dim" style={{ margin: "5px 0" }}>
              <strong style={{ color: "var(--brass)" }}>
                Days {s.from}–{s.to} · {s.name}.
              </strong>{" "}
              {s.blurb}
            </p>
          ))}
          <p className="small dim" style={{ marginTop: 8 }}>
            You'll measure yourself once at the start and once at the end —
            the same test both times. The gap between those two numbers is
            what the month is for.
          </p>
        </div>
        {sigDomains.length === 0 && (
          <div className="card small">
            No result on record yet — the protocol works best pointed at a{" "}
            <strong>Signature</strong> domain.{" "}
            <Link href="/assessment" style={{ color: "var(--brass)" }}>
              Take the assessment first →
            </Link>{" "}
            (or pick any domain below and start anyway).
          </div>
        )}
        <h3 style={{ marginTop: 18 }}>Pick your domain</h3>
        {ordered.map((d) => {
          const isSig = sigDomains.includes(d.id);
          return (
            <button
              key={d.id}
              className="btn"
              style={isSig ? { borderColor: "var(--brass)" } : undefined}
              onClick={() => {
                startRun(d.id);
                rerender();
              }}
            >
              <span style={{ color: realmHex(d.meta), marginRight: 10, verticalAlign: "middle" }}>
                <DomainGlyph domain={d.id} size={20} />
              </span>
              <strong>{d.name}</strong>
              {isSig ? " · your Signature" : ""}
              <span className="small dim" style={{ display: "block", marginTop: 3 }}>
                {protocolSummary(d.id)}
              </span>
            </button>
          );
        })}
        <LegalFootnote />
      </GiShell>
    );
  }

  /* ---------- Active run ---------- */
  const domain = DOMAIN_BY_ID[run.domainId];
  const day = currentDay(run);
  const stage = stageForDay(day);
  const week = weekForDay(day);
  const weekPlan = PROTOCOL_DOMAIN[run.domainId];
  const task = taskForDay(run.domainId, day);
  const done = doneCount(run);
  const todayDone = !!run.days[day];
  const streak = currentStreak(run, day);
  const best = longestStreak(run);
  const completed = run.status === "completed" || (day >= 30 && todayDone);

  return (
    <GiShell nav wide>
      <div className="stagecount">
        The Amplification Protocol · {domain.name}
      </div>
      <h1 style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: realmHex(domain.meta) }}>
          <DomainGlyph domain={domain.id} size={38} />
        </span>
        Day {day} of 30
      </h1>
      <p className="dim small" style={{ margin: "8px 0 18px" }}>
        Stage · <strong style={{ color: "var(--brass)" }}>{stage.name}</strong>{" "}
        (days {stage.from}–{stage.to}) — {stage.blurb}
      </p>

      {/* 30-cell progress grid, echoing the 9-cell glyph aesthetic */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 1fr)",
          gap: 6,
          margin: "6px 0 20px",
          maxWidth: 460,
        }}
      >
        {Array.from({ length: 30 }, (_, i) => {
          const dnum = i + 1;
          const checked = !!run.days[dnum];
          const isToday = dnum === day;
          const missed = dnum < day && !checked;
          return (
            <div
              key={dnum}
              title={`Day ${dnum} · ${stageForDay(dnum).name}${checked ? " · done" : missed ? " · missed" : ""}`}
              style={{
                aspectRatio: "1",
                borderRadius: 3,
                border: `1px solid ${isToday ? "var(--brass)" : "var(--line)"}`,
                background: checked
                  ? "var(--brass)"
                  : missed
                    ? "oklch(0.2 0.02 285)"
                    : "transparent",
                boxShadow: checked ? "0 0 6px oklch(0.72 0.14 75 / 50%)" : undefined,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                color: checked ? "#241C12" : "var(--paper-dim)",
                fontWeight: isToday ? 700 : 400,
              }}
            >
              {dnum}
            </div>
          );
        })}
      </div>

      <div className="card" style={{ borderColor: "var(--brass-deep)" }}>
        <h3>
          Today's assignment · Day {day} — {task.title}
        </h3>
        <p className="small" style={{ color: "var(--paper)", lineHeight: 1.65 }}>
          {task.body}
        </p>
        {task.safety && (
          <p
            className="small"
            style={{
              marginTop: 10,
              padding: "8px 10px",
              border: "1px solid var(--oxblood)",
              borderRadius: 5,
              color: "var(--paper-dim)",
            }}
          >
            ⚠ {task.safety}
          </p>
        )}
        <p className="small dim" style={{ marginTop: 10 }}>
          Week {week + 1} in one line: {weekPlan[week]}
        </p>
      </div>

      {completed ? (
        <div className="card" style={{ borderColor: "var(--brass)", textAlign: "center" }}>
          <h3>Thirty days, done.</h3>
          <p className="small dim" style={{ margin: "8px 0 12px" }}>
            {done} check-ins · longest streak {best}. The honest next move:
            retake the Index and look at the delta in your {domain.name} score.
          </p>
          <Link
            href="/assessment"
            className="btn primary"
            style={{ display: "block", textDecoration: "none", textAlign: "center" }}
          >
            Retake the assessment
          </Link>
          <button
            className="btn ghost"
            onClick={() => {
              abandonRun(run.id);
              rerender();
            }}
          >
            Start a new protocol
          </button>
        </div>
      ) : (
        <div className="card">
          <h3>Today's check-in</h3>
          {todayDone ? (
            <p className="small" style={{ color: "var(--brass)" }}>
              ✓ Day {day} logged
              {run.days[day]?.note ? ` — “${run.days[day].note}”` : ""}. Current
              streak {streak} · longest {best} · {done}/30 total.
            </p>
          ) : (
            <>
              <p className="small dim" style={{ marginBottom: 8 }}>
                Done with today's assignment? One line on how it went
                (optional — it becomes your training log):
              </p>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. filmed the baseline, scored 4/10 cold"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "var(--ink2)",
                  border: "1px solid var(--line)",
                  borderRadius: 5,
                  color: "var(--paper)",
                  fontFamily: "'Lato',sans-serif",
                  fontSize: 14,
                  marginBottom: 10,
                }}
              />
              <button
                className="btn primary"
                onClick={() => {
                  checkIn(run.id, day, note.trim() || undefined);
                  setNote("");
                  rerender();
                }}
              >
                Mark day {day} done
              </button>
            </>
          )}
          <p className="small dim" style={{ marginTop: 10 }}>
            Missed days stay visible — the record is the point, not the guilt.
            Longest streak so far: {best}.
          </p>
        </div>
      )}

      {!completed && (
        <div style={{ marginTop: 18 }}>
          {confirmAbandon ? (
            <div className="card small">
              Abandon this run? The log stays in your data, but the tracker
              resets.
              <div className="btnrow" style={{ marginTop: 8 }}>
                <button
                  className="btn"
                  onClick={() => {
                    abandonRun(run.id);
                    setConfirmAbandon(false);
                    rerender();
                  }}
                >
                  Yes, abandon it
                </button>
                <button className="btn ghost" onClick={() => setConfirmAbandon(false)}>
                  Keep going
                </button>
              </div>
            </div>
          ) : (
            <button className="btn ghost" onClick={() => setConfirmAbandon(true)}>
              Abandon this protocol run
            </button>
          )}
        </div>
      )}
      <LegalFootnote />
    </GiShell>
  );
}
