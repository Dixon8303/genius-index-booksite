/* Profile dashboard: latest result, the nine bands, change over attempts,
   protocol status, history list, and the optional cloud sync. Local-first —
   everything works signed out; sign-in adds backup and roaming. */

import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import TrendChart, {
  type TrendPoint,
} from "@/components/genius/TrendChart";
import GiShell, { LegalFootnote } from "@/components/genius/GiShell";
import RawHtml from "@/components/genius/RawHtml";
import DomainGlyph from "@/components/DomainGlyph";
import { DOMAINS, type DomainId } from "@/lib/genius/data/domains";
import {
  domainsFromPayload,
  gi10Schema,
} from "@/lib/genius/engine/export";
import { computeM } from "@/lib/genius/engine/interpret";
import {
  loadHistory,
  mergeCloudResults,
  updateResult,
  type StoredResult,
} from "@/lib/genius/storage/history";
import { activeRun, currentDay, doneCount } from "@/lib/genius/storage/protocol";
import { buildHeroGlyph, realmHex } from "@/lib/genius/viz/builders";
import { triggerBlobDownload } from "@/lib/genius/viz/shareCard";
import type { CloudUser } from "@/lib/genius/storage/cloud";

function scoresOf(r: StoredResult): Record<DomainId, number> | null {
  try {
    const R = domainsFromPayload(gi10Schema.parse(r.export as unknown));
    return Object.fromEntries(
      DOMAINS.map((d) => [d.id, R[d.id].score]),
    ) as Record<DomainId, number>;
  } catch {
    return null;
  }
}

export default function Profile() {
  const [history, setHistory] = useState<StoredResult[]>(() => loadHistory());
  const [user, setUser] = useState<CloudUser | null>(null);
  const [cloudMsg, setCloudMsg] = useState("");
  const [cloudBusy, setCloudBusy] = useState(false);
  const [selected, setSelected] = useState<Set<DomainId>>(new Set());

  const latest = history.length ? history[history.length - 1] : null;
  const latestM = useMemo(() => {
    if (!latest) return null;
    try {
      return computeM(domainsFromPayload(gi10Schema.parse(latest.export as unknown)));
    } catch {
      return null;
    }
  }, [latest]);

  // Default the trend series to the latest result's signature domains.
  useEffect(() => {
    if (latestM && selected.size === 0) {
      setSelected(new Set(latestM.sig.map((d) => d.id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestM]);

  const trendData = useMemo<TrendPoint[]>(() => {
    return history
      .map((r) => {
        const scores = scoresOf(r);
        if (!scores) return null;
        return {
          date: new Date(r.savedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "2-digit",
          }),
          scores,
        };
      })
      .filter(Boolean) as TrendPoint[];
  }, [history]);

  const protocol = activeRun();

  const signIn = async () => {
    setCloudBusy(true);
    setCloudMsg("");
    try {
      const cloud = await import("@/lib/genius/storage/cloud");
      const u = await cloud.signIn();
      setUser(u);
      const remote = await cloud.listResults();
      const added = mergeCloudResults(remote);
      // Push any local results the cloud doesn't have yet.
      let pushed = 0;
      for (const r of loadHistory()) {
        if (!r.cloudId && !r.partial && r.source !== "shared") {
          const cloudId = await cloud.pushResult(r.export);
          updateResult(r.id, { cloudId });
          pushed++;
        }
      }
      setHistory(loadHistory());
      setCloudMsg(
        `Synced — ${added} pulled from your account, ${pushed} backed up.`,
      );
    } catch (e) {
      setCloudMsg(
        e instanceof Error && e.message ? `Sign-in didn't complete: ${e.message}` : "Sign-in didn't complete.",
      );
    } finally {
      setCloudBusy(false);
    }
  };

  const signOut = async () => {
    const cloud = await import("@/lib/genius/storage/cloud");
    await cloud.signOut();
    setUser(null);
    setCloudMsg("Signed out. Your results stay on this device.");
  };

  const exportAll = () => {
    const blob = new Blob(
      [JSON.stringify(history.map((r) => r.export), null, 2)],
      { type: "application/json" },
    );
    triggerBlobDownload(blob, "genius-index-history.json");
  };

  if (!latest || !latestM) {
    return (
      <GiShell nav wide>
        <h1>Your profile starts with one run</h1>
        <p className="dim" style={{ margin: "14px 0" }}>
          Take the assessment once and this page becomes your dashboard — your
          braid, all nine bands, change over time, and the 30-day protocol
          tracker.
        </p>
        <Link
          href="/assessment"
          className="btn primary"
          style={{ display: "block", textAlign: "center", textDecoration: "none", maxWidth: 420 }}
        >
          Take the assessment
        </Link>
        <LegalFootnote />
      </GiShell>
    );
  }

  const takenAt = new Date(latest.savedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <GiShell nav wide>
      <h1 style={{ marginBottom: 4 }}>My Genius Profile</h1>
      <p className="dim small" style={{ marginBottom: 20 }}>
        {history.length} run{history.length === 1 ? "" : "s"} on record · latest{" "}
        {takenAt}
      </p>

      {/* Latest result card */}
      <div className="book" style={{ textAlign: "center" }}>
        <div className="yb" style={{ fontFamily: "'Newsreader',sans-serif", fontSize: 13, letterSpacing: ".3em", textTransform: "uppercase", color: "var(--gold-ink)" }}>
          Latest result
        </div>
        <RawHtml html={buildHeroGlyph(latestM.braidDoms)} />
        <h2 className="bt" style={{ marginTop: 4 }}>
          {latestM.primary ? latestM.primary.name : "An unnamed pairing"}
        </h2>
        <p className="btsub">
          {latestM.braidDoms[0].name} × {latestM.braidDoms[1].name} · shape{" "}
          {latestM.shape}
        </p>
        <div className="btnrow" style={{ justifyContent: "center" }}>
          <Link
            href={`/results/${latest.id}`}
            className="btn book-primary"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            Open the full reading
          </Link>
        </div>
      </div>

      {/* Nine bands */}
      <div className="book">
        <div className="eyebrow-b">Where everything stands</div>
        <h2 className="bt">The nine domains</h2>
        <hr className="brule" />
        <div className="bars">
          {latestM.sorted.map((d) => (
            <div key={d.id} className="barrow">
              <span style={{ width: 22, color: realmHex(d.meta) }}>
                <DomainGlyph domain={d.id} size={18} />
              </span>
              <span className="lbl">{d.name}</span>
              <span className="trk">
                <i
                  style={{
                    width: `${latestM.R[d.id].score}%`,
                    background: realmHex(d.meta),
                  }}
                />
              </span>
              <span className="val">{latestM.R[d.id].score}</span>
              <span
                className="small"
                style={{ width: 86, textAlign: "right", color: "var(--book-dim)" }}
              >
                {latestM.band(d)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trend */}
      {trendData.length >= 2 && (
        <div className="book">
          <div className="eyebrow-b">Change over time</div>
          <h2 className="bt">Your trend</h2>
          <p className="btsub">
            Pick domains to plot. Defaults to your Signature strands.
          </p>
          <hr className="brule" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {DOMAINS.map((d) => {
              const on = selected.has(d.id);
              return (
                <button
                  key={d.id}
                  className={`demo-chip${on ? " sel" : ""}`}
                  style={on ? { borderColor: realmHex(d.meta), color: realmHex(d.meta) } : undefined}
                  onClick={() =>
                    setSelected((s) => {
                      const n = new Set(s);
                      if (n.has(d.id)) n.delete(d.id);
                      else n.add(d.id);
                      return n;
                    })
                  }
                >
                  {d.name}
                </button>
              );
            })}
          </div>
          <TrendChart data={trendData} selected={selected} />
        </div>
      )}

      {/* Protocol status */}
      <div className="book">
        <div className="eyebrow-b">The action layer</div>
        <h2 className="bt">30-day protocol</h2>
        <hr className="brule" />
        {protocol ? (
          <p style={{ color: "var(--book-ink)" }}>
            <strong>{DOMAINS.find((d) => d.id === protocol.domainId)?.name}</strong>{" "}
            · day {currentDay(protocol)} of 30 · {doneCount(protocol)} check-ins
            logged.{" "}
            <Link href="/protocol" style={{ color: "var(--gold-ink)" }}>
              Open the tracker →
            </Link>
          </p>
        ) : (
          <p style={{ color: "var(--book-ink)" }}>
            Results without practice stay trivia. Pick a Signature domain and
            run the book's 30-day amplification protocol, one check-in a day.{" "}
            <Link href="/protocol" style={{ color: "var(--gold-ink)" }}>
              Start it →
            </Link>
          </p>
        )}
      </div>

      {/* History + sync */}
      <div className="book">
        <div className="eyebrow-b">Every run</div>
        <h2 className="bt">History</h2>
        <hr className="brule" />
        {history
          .slice()
          .reverse()
          .map((r) => (
            <Link key={r.id} href={`/results/${r.id}`} style={{ textDecoration: "none" }}>
              <div className="gaItem" style={{ padding: "12px 14px", cursor: "pointer" }}>
                <span style={{ fontFamily: "'Instrument Serif',serif", fontWeight: 600, color: "var(--book-ink)" }}>
                  {r.export.braid || "Unnamed pairing"}
                </span>
                <span className="small" style={{ color: "var(--book-dim)", marginLeft: 10 }}>
                  {new Date(r.savedAt).toLocaleDateString()} · {r.export.shape || "—"}
                  {r.partial ? " · migrated baseline" : ""}
                  {r.source === "cloud" ? " · from account" : ""}
                  {r.cloudId ? " · backed up" : ""}
                </span>
              </div>
            </Link>
          ))}
        <div className="btnrow" style={{ marginTop: 14, flexWrap: "wrap" }}>
          {user ? (
            <button className="btn book-ghost" disabled={cloudBusy} onClick={() => void signOut()}>
              Sign out ({user.displayName || user.email})
            </button>
          ) : (
            <button className="btn book-ghost" disabled={cloudBusy} onClick={() => void signIn()}>
              {cloudBusy ? "Connecting…" : "Sign in with Google to back up & sync"}
            </button>
          )}
          <button className="btn book-ghost" onClick={exportAll}>
            Export all (JSON)
          </button>
        </div>
        {cloudMsg && (
          <p className="small" style={{ color: "var(--book-dim)", marginTop: 8 }}>
            {cloudMsg}
          </p>
        )}
        <p className="small" style={{ color: "var(--book-dim)", marginTop: 8 }}>
          Local-first: everything on this page lives in your browser. Signing
          in only adds a backup tied to your Google account.
        </p>
      </div>
      <LegalFootnote />
    </GiShell>
  );
}
