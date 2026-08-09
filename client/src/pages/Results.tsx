/* Results: the full reading of a completed run. Stored per-domain scores are
   always re-interpreted through the CURRENT engine (same philosophy as the
   original's archived replay), so old results re-render under the live model.
   Also accepts the legacy share format — #view=<url-encoded GI-1.0 JSON> —
   as a transient "shared" result with a save-to-history option. */

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import GiShell, { LegalFootnote } from "@/components/genius/GiShell";
import RawHtml from "@/components/genius/RawHtml";
import { TIER_META } from "@/lib/genius/data/braids";
import { DOMAINS, DOMAIN_BY_ID, type DomainId } from "@/lib/genius/data/domains";
import { braidImage } from "@/lib/genius/data/images";
import {
  domainsFromPayload,
  gi10Schema,
  parseViewPayload,
  viewHashFor,
  type GI10Export,
} from "@/lib/genius/engine/export";
import { computeM, type Interpretation } from "@/lib/genius/engine/interpret";
import {
  appendResult,
  getResult,
  latestResult,
  loadHistory,
  type StoredResult,
} from "@/lib/genius/storage/history";
import {
  buildFieldGuide,
  buildGrid,
  buildHeroGlyph,
  buildWheel,
  realmHex,
} from "@/lib/genius/viz/builders";
import {
  bookModules,
  gindexStripHTML,
  interpTop,
  profileSectionHTML,
} from "@/lib/genius/viz/prose";
import {
  downloadShareCard,
  shareBraidCard,
  triggerBlobDownload,
} from "@/lib/genius/viz/shareCard";

function hrefFor(id: DomainId | "_stack"): string {
  const base = import.meta.env.BASE_URL;
  return id === "_stack" ? `${base}protocol` : `${base}domains/${id}`;
}

/* Hover/focus tooltip for the constellation wheel nodes (ported behavior). */
function useWheelTooltip(containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const tip = document.createElement("div");
    tip.style.cssText =
      "position:fixed;z-index:60;max-width:240px;background:#FFFDF8;border:1px solid #B4832E;border-radius:7px;padding:9px 11px;font-family:'Lato',sans-serif;font-size:12.5px;color:#2A2118;box-shadow:0 6px 18px rgba(42,33,24,.25);pointer-events:none;display:none";
    document.body.appendChild(tip);
    const show = (el: Element, x: number, y: number) => {
      const name = el.getAttribute("data-name") || "";
      const body = el.getAttribute("data-body") || "";
      tip.innerHTML = `<strong style="font-family:'Playfair Display',serif">${name}</strong><br>${body}`;
      tip.style.display = "block";
      tip.style.left = `${Math.min(x + 14, window.innerWidth - 260)}px`;
      tip.style.top = `${y + 14}px`;
    };
    const over = (e: MouseEvent) => {
      const node = (e.target as Element).closest?.(".wnode");
      if (node) show(node, e.clientX, e.clientY);
      else tip.style.display = "none";
    };
    const out = () => (tip.style.display = "none");
    root.addEventListener("mousemove", over);
    root.addEventListener("mouseleave", out);
    return () => {
      root.removeEventListener("mousemove", over);
      root.removeEventListener("mouseleave", out);
      tip.remove();
    };
  }, [containerRef]);
}

function DeltaTable({
  current,
  previous,
}: {
  current: Interpretation;
  previous: StoredResult;
}) {
  const prevR = domainsFromPayload(
    gi10Schema.parse(previous.export as unknown),
  );
  const when = new Date(previous.savedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <div className="book">
      <div className="eyebrow-b">Change over time</div>
      <h2 className="bt">Since your last take</h2>
      <p className="btsub">
        Against your {previous.source === "legacy" ? "saved baseline" : "run"}{" "}
        from {when}. Movement of ±5 or more is worth noticing; smaller shifts
        are noise.
      </p>
      <hr className="brule" />
      <table className="hobt" style={{ width: "100%" }}>
        <tbody>
          <tr>
            <th style={{ textAlign: "left" }}>Domain</th>
            <th>Then</th>
            <th>Now</th>
            <th>Δ</th>
          </tr>
          {DOMAINS.map((d) => {
            const then = Math.round(prevR[d.id].score);
            const now = current.R[d.id].score;
            const delta = now - then;
            const col =
              delta >= 5 ? "#4E6156" : delta <= -5 ? "#8C3B2E" : "var(--book-dim)";
            return (
              <tr key={d.id}>
                <td className="hobd">{d.name}</td>
                <td style={{ textAlign: "center" }}>{then}</td>
                <td style={{ textAlign: "center" }}>{now}</td>
                <td style={{ textAlign: "center", color: col, fontWeight: 700 }}>
                  {delta > 0 ? `+${delta}` : delta}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function Results() {
  const params = useParams<{ id?: string }>();
  const [, navigate] = useLocation();
  const [sharedPayload, setSharedPayload] = useState<GI10Export | null>(null);
  const [sharedSaved, setSharedSaved] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const wheelRef = useRef<HTMLDivElement | null>(null);
  useWheelTooltip(wheelRef);

  // Legacy #view= hash support (old share links / sheet rows).
  useEffect(() => {
    if (window.location.hash.startsWith("#view=")) {
      try {
        const payload = parseViewPayload(window.location.hash);
        setSharedPayload(payload as unknown as GI10Export);
      } catch {
        /* not a readable payload — ignore */
      }
    }
  }, []);

  const stored = useMemo(() => {
    if (sharedPayload) return null;
    if (params.id) return getResult(params.id);
    return latestResult();
  }, [params.id, sharedPayload]);

  const exportObj = sharedPayload ?? stored?.export ?? null;

  const m = useMemo(() => {
    if (!exportObj) return null;
    try {
      const payload = gi10Schema.parse(exportObj as unknown);
      return computeM(domainsFromPayload(payload));
    } catch {
      return null;
    }
  }, [exportObj]);

  const previous = useMemo(() => {
    if (!stored) return null;
    const all = loadHistory();
    const idx = all.findIndex((r) => r.id === stored.id);
    return idx > 0 ? all[idx - 1] : null;
  }, [stored]);

  if (!exportObj || !m) {
    return (
      <GiShell nav>
        <h2>No result yet</h2>
        <p className="dim">
          Take the assessment and your full reading — braid, shape, wheel, and
          the 30-day protocol — appears here.
        </p>
        <Link href="/assessment" className="btn primary" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
          Take the assessment
        </Link>
        <LegalFootnote />
      </GiShell>
    );
  }

  const flagSdr = !!(exportObj.flags && exportObj.flags.sdr);
  const primary = m.primary;
  const tierMeta = primary ? TIER_META[primary.tier] : null;
  const d0 = DOMAIN_BY_ID[m.braidDoms[0].id];
  const d1 = DOMAIN_BY_ID[m.braidDoms[1].id];

  const copyShareLink = async () => {
    const url =
      window.location.origin +
      import.meta.env.BASE_URL +
      "results" +
      viewHashFor(exportObj);
    try {
      await navigator.clipboard.writeText(url);
      setShareMsg("Link copied — anyone who opens it sees this exact result.");
    } catch {
      setShareMsg(url);
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], {
      type: "application/json",
    });
    triggerBlobDownload(blob, "genius-index-result.json");
  };

  return (
    <GiShell nav progress={1} litCells={9}>
      {(sharedPayload || stored?.source === "shared") && (
        <div className="archivedbanner">
          Shared result{exportObj.ts ? ` · submitted ${new Date(exportObj.ts).toLocaleString()}` : ""}{" "}
          — recomputed from the stored answers using the <strong>current</strong>{" "}
          scoring model.
          {sharedPayload && !sharedSaved && (
            <button
              className="authlink"
              onClick={() => {
                const entry = appendResult(exportObj, "shared");
                setSharedSaved(true);
                navigate(`/results/${entry.id}`);
              }}
            >
              Save to my history
            </button>
          )}
        </div>
      )}

      {/* Hero: the braid */}
      <div className="book" style={{ textAlign: "center" }}>
        <div className="braidcard">
          <div className="yb">Your braid</div>
          <RawHtml html={buildHeroGlyph(m.braidDoms)} />
          <h1 style={{ color: "var(--book-ink)" }}>
            {primary ? primary.name : "An unnamed pairing"}
          </h1>
          <div
            className="bpair"
            style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", margin: "10px 0" }}
          >
            <span className="domchip" style={{ color: realmHex(d0.meta), fontWeight: 700 }}>
              ● {d0.name} {m.R[d0.id].score}
            </span>
            <span style={{ color: "var(--book-dim)" }}>×</span>
            <span className="domchip" style={{ color: realmHex(d1.meta), fontWeight: 700 }}>
              ● {d1.name} {m.R[d1.id].score}
            </span>
          </div>
          {tierMeta && (
            <>
              <div className={`tierbadge tier-${primary!.tier}`}>
                {tierMeta.label}
                {primary!.rare ? " · Rarest" : ""}
              </div>
              <div className="tiersub">{tierMeta.sub}</div>
            </>
          )}
          {primary && (
            <div className="resultart heroart" style={{ margin: "14px auto" }}>
              <img src={braidImage(primary.name)} alt={primary.name} loading="lazy" />
            </div>
          )}
          {primary && <p className="braiddesc">{primary.desc}</p>}
          <p className="small" style={{ color: "var(--book-dim)" }}>
            Signature code · <strong>{exportObj.signature || "—"}</strong>
          </p>
        </div>
      </div>

      <RawHtml html={gindexStripHTML(m)} />
      <RawHtml html={interpTop(m)} />

      {/* The wheel */}
      <div className="book" style={{ textAlign: "center" }}>
        <div className="eyebrow-b">The Braid Constellation</div>
        <h2 className="bt">Your wheel</h2>
        <p className="btsub">
          Nine domains, thirty-six possible braids. Yours is drawn in gold.
        </p>
        <hr className="brule" />
        <div ref={wheelRef}>
          <RawHtml html={buildWheel(m.R, m.primaryKey, m.adjKeys, m.primary)} />
        </div>
      </div>

      {/* Nine bars + stream table + honesty flag */}
      <div className="book">
        <div className="eyebrow-b">The numbers underneath</div>
        <h2 className="bt">All nine domains</h2>
        <p className="btsub">
          Bands are relative to your own median — ipsative by design. The
          scores compare you to you, not to the room.
        </p>
        <hr className="brule" />
        <div className="bars">
          {m.sorted.map((d) => (
            <div key={d.id} className={`barrow ${d.meta}`}>
              <span className="lbl">{d.name}</span>
              <span className="trk">
                <i
                  style={{
                    width: `${m.R[d.id].score}%`,
                    background: realmHex(d.meta),
                  }}
                />
              </span>
              <span className="val">{m.R[d.id].score}</span>
              <span
                className="small"
                style={{ width: 86, textAlign: "right", color: "var(--book-dim)" }}
              >
                {m.band(d)}
              </span>
            </div>
          ))}
        </div>
        <details className="abc">
          <summary>The three streams behind each score</summary>
          <table className="hobt" style={{ width: "100%", marginTop: 8 }}>
            <tbody>
              <tr>
                <th style={{ textAlign: "left" }}>Domain</th>
                <th>A · Report (50%)</th>
                <th>B · Performance (30%)</th>
                <th>C · Disposition (20%)</th>
              </tr>
              {DOMAINS.map((d) => (
                <tr key={d.id}>
                  <td className="hobd">{d.name}</td>
                  <td style={{ textAlign: "center" }}>{Math.round(m.R[d.id].A)}</td>
                  <td style={{ textAlign: "center" }}>
                    {m.R[d.id].skipped ? "skipped" : Math.round(m.R[d.id].B)}
                  </td>
                  <td style={{ textAlign: "center" }}>{Math.round(m.R[d.id].C)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="small" style={{ color: "var(--book-dim)", marginTop: 6 }}>
            A skipped station never zeroes a domain — its weight redistributes
            to the other streams.
          </p>
        </details>
        {flagSdr && (
          <div className="callout callout--oxblood">
            <span className="ct">Honesty check</span>
            Both catch items came back at the top of the scale — a pattern that
            usually means the whole profile is inflated. The bands still hold
            <em> relative to each other</em>, but treat the absolute numbers
            with suspicion, and consider a retake on a harsher setting.
          </div>
        )}
      </div>

      {stored && previous && <DeltaTable current={m} previous={previous} />}

      <RawHtml html={profileSectionHTML(m)} />
      <RawHtml html={bookModules(m, hrefFor)} />

      {/* Complete grid + field guide */}
      <div className="book">
        <div className="eyebrow-b">The complete index</div>
        <h2 className="bt">All thirty-six braids</h2>
        <p className="btsub">
          Every pairing of two domains. Yours is outlined in gold; the brighter
          a row reads, the closer it sits to your own profile.
        </p>
        <hr className="brule" />
        <RawHtml html={buildGrid(m.R, m.primaryKey, m.adjKeys)} />
        <RawHtml html={buildFieldGuide(m.R, m.primaryKey, m.adjKeys)} />
        <p className="small" style={{ textAlign: "center", marginTop: 10 }}>
          <Link href="/braids" style={{ color: "var(--gold-ink)" }}>
            Browse all 36 braids in the explorer →
          </Link>
        </p>
      </div>

      {/* Actions */}
      <div className="book" style={{ textAlign: "center" }}>
        <div className="eyebrow-b">Keep it · share it · test it again</div>
        <hr className="brule" />
        <div className="btnrow" style={{ flexWrap: "wrap" }}>
          <button className="btn book-primary" onClick={() => void shareBraidCard(m)}>
            Share my braid card
          </button>
          <button className="btn book-ghost" onClick={() => void downloadShareCard(m)}>
            Download card (PNG)
          </button>
        </div>
        <div className="btnrow" style={{ flexWrap: "wrap" }}>
          <button className="btn book-ghost" onClick={copyShareLink}>
            Copy share link
          </button>
          <button className="btn book-ghost" onClick={exportJson}>
            Export data (JSON)
          </button>
          <button className="btn book-ghost" onClick={() => window.print()}>
            Print
          </button>
        </div>
        {shareMsg && (
          <p className="small" style={{ color: "var(--book-dim)", wordBreak: "break-all" }}>
            {shareMsg}
          </p>
        )}
        <p className="small" style={{ color: "var(--book-dim)", marginTop: 14 }}>
          Genius grows — retake in about 90 days and the app shows you the
          delta.{" "}
          <Link href="/assessment" style={{ color: "var(--gold-ink)" }}>
            Retake now →
          </Link>{" "}
          ·{" "}
          <Link href="/protocol" style={{ color: "var(--gold-ink)" }}>
            Start the 30-day protocol →
          </Link>
        </p>
      </div>
      <LegalFootnote />
    </GiShell>
  );
}
