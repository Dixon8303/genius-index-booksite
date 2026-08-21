/* Results: the full reading of a completed run. Stored per-domain scores are
   always re-interpreted through the CURRENT engine (same philosophy as the
   original's archived replay), so old results re-render under the live model.
   Also accepts the legacy share format — #view=<url-encoded GI-1.0 JSON> —
   as a transient "shared" result with a save-to-history option. */

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import GiShell, {
  EcosystemFooter,
  LegalFootnote,
} from "@/components/genius/GiShell";
import RawHtml from "@/components/genius/RawHtml";
import { TIER_META } from "@/lib/genius/data/braids";
import { DOMAINS, DOMAIN_BY_ID, type DomainId } from "@/lib/genius/data/domains";
import {
  braidImage,
  domainImage,
  familyImage,
} from "@/lib/genius/data/images";
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
  downloadRetestReminder,
  retestDate,
} from "@/lib/genius/viz/retest";
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
  const [shareStatus, setShareStatus] = useState("");
  const [reminderAdded, setReminderAdded] = useState(false);
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";
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

  // Pick the collage art once per result — the pools hold several
  // interchangeable pieces and shouldn't reshuffle on unrelated re-renders.
  const art = useMemo(() => {
    if (!m) return null;
    return {
      hero: m.primary ? braidImage(m.primary.name) : "",
      d0: domainImage(m.braidDoms[0].id),
      d1: domainImage(m.braidDoms[1].id),
      family: familyImage(m.leadingFamily),
    };
  }, [m]);

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
  const heroArt = art!.hero;
  const collageArt = art!;

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

      {/* Hero: the braid — same structure as the original braidcard */}
      <div className="stagecount" style={{ marginTop: 8 }}>
        Your result · complete
      </div>
      <div className="book book--hero">
        <div className="braidcard">
          <div className="yb">Your braid</div>
          {primary && (
            <div className="resultart heroart">
              <img src={heroArt} alt={primary.name} loading="lazy" />
            </div>
          )}
          <RawHtml html={buildHeroGlyph(m.braidDoms)} />
          <div className="bname">
            {primary ? primary.name : exportObj.signature || "An unnamed pairing"}
          </div>
          <div className="bpair">
            <span className={`domchip ${d0.meta}`}>
              <span className="dot"></span>
              {d0.name}
            </span>
            <span className="amp">×</span>
            <span className={`domchip ${d1.meta}`}>
              <span className="dot"></span>
              {d1.name}
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
          {primary && <div className="braiddesc">{primary.desc}</div>}
          <p className="small" style={{ color: "var(--book-dim)" }}>
            Signature code · <strong>{exportObj.signature || "—"}</strong>
          </p>
        </div>
        <div className="bfoot">
          Rarity comes from combination. Genius is rarely a single gift — it is
          almost always two of the nine domains braided together, and the
          pairing, not either strand alone, is what makes a person rare.
        </div>
      </div>

      <RawHtml html={gindexStripHTML(m)} />

      {/* The art collage — braid, both strands, leading family */}
      <div className="book" style={{ textAlign: "center" }}>
        <div className="artcollage">
          {primary && (
            <div className="resultart" tabIndex={0}>
              <img src={heroArt} alt={primary.name} loading="lazy" />
              <div className="resultart-cap">
                {primary.name.replace(/^The /, "")}
              </div>
            </div>
          )}
          <div className="resultart" tabIndex={0}>
            <img src={collageArt.d0} alt={d0.name} loading="lazy" />
            <div className="resultart-cap">{d0.name}</div>
          </div>
          <div className="resultart" tabIndex={0}>
            <img src={collageArt.d1} alt={d1.name} loading="lazy" />
            <div className="resultart-cap">{d1.name}</div>
          </div>
          <div className="resultart" tabIndex={0}>
            <img
              src={collageArt.family}
              alt={m.leadingFamily.toUpperCase()}
              loading="lazy"
            />
            <div className="resultart-cap">{m.leadingFamily.toUpperCase()}</div>
          </div>
        </div>
      </div>

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
        <Link
          href="/braids"
          className="btn book-primary"
          style={{ maxWidth: 340, margin: "12px auto 0", textDecoration: "none", display: "block", textAlign: "center" }}
        >
          Explore all 36 braids →
        </Link>
      </div>

      {/* The free companion */}
      <div className="book" style={{ textAlign: "center" }}>
        <div className="eyebrow-b">A gift, to keep</div>
        <h2 className="bt">The Free Braid Companion</h2>
        <p className="btsub">
          "The Thirty-Six Braids" — an eleven-page field guide to every
          pairing, yours to download and keep. No purchase required.
        </p>
        <a
          className="btn book-primary"
          style={{ maxWidth: 340, margin: "6px auto 0", textDecoration: "none", display: "inline-block", textAlign: "center" }}
          href={`${import.meta.env.BASE_URL}downloads/the-thirty-six-braids-companion.pdf`}
          download
        >
          Download the Companion (PDF) →
        </a>
      </div>

      {/* Actions */}
      <div className="book" style={{ textAlign: "center" }}>
        <div className="eyebrow-b">Keep it · share it · test it again</div>
        <hr className="brule" />
        {shareStatus && <p className="submitstatus ok">{shareStatus}</p>}
        <div className="btnrow" style={{ flexWrap: "wrap" }}>
          <button
            className="btn book-primary"
            onClick={async () => {
              setShareStatus("Generating your share card…");
              try {
                await downloadShareCard(m);
                setShareStatus("✓ Downloaded. Share it anywhere.");
              } catch {
                setShareStatus(
                  "Couldn't generate the image in this browser — try Save/Print instead.",
                );
              }
            }}
          >
            Share your braid card! #GeniusIndex
          </button>
          {canNativeShare && (
            <button
              className="btn book-primary"
              onClick={async () => {
                setShareStatus("Preparing your card…");
                try {
                  const result = await shareBraidCard(m);
                  setShareStatus(
                    result === "shared"
                      ? "✓ Shared!"
                      : result === "cancelled"
                        ? ""
                        : "✓ Downloaded. Share it anywhere.",
                  );
                } catch {
                  setShareStatus(
                    "Couldn't generate the image in this browser — try Save/Print instead.",
                  );
                }
              }}
            >
              Share to Instagram →
            </button>
          )}
        </div>
        <div className="btnrow" style={{ flexWrap: "wrap" }}>
          <button className="btn book-ghost" onClick={copyShareLink}>
            Copy share link
          </button>
          <button className="btn book-ghost" onClick={() => window.print()}>
            Save / print my chart
          </button>
          <Link
            href="/assessment"
            className="btn book-ghost"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            Take it again →
          </Link>
        </div>
        <div className="btnrow" style={{ marginTop: 8 }}>
          <button
            className="btn book-ghost"
            style={{ maxWidth: 340, margin: "0 auto" }}
            disabled={reminderAdded}
            onClick={() => {
              downloadRetestReminder(m);
              setReminderAdded(true);
            }}
          >
            {reminderAdded
              ? "✓ Added to calendar"
              : `↺ Remind me to retake this on ${retestDate().toLocaleDateString(undefined, { month: "long", day: "numeric" })}`}
          </button>
        </div>
        {shareMsg && (
          <p className="small" style={{ color: "var(--book-dim)", wordBreak: "break-all" }}>
            {shareMsg}
          </p>
        )}
        <details className="pilot">
          <summary>Raw result data</summary>
          <p className="small" style={{ color: "var(--book-dim)", margin: "8px 0" }}>
            The exact GI-1.0 record behind this page — copy it, or download it
            as a file.
          </p>
          <textarea
            className="export"
            readOnly
            value={JSON.stringify(exportObj)}
            rows={5}
            style={{ width: "100%" }}
          />
          <div className="btnrow" style={{ marginTop: 8 }}>
            <button
              className="btn book-ghost"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(JSON.stringify(exportObj));
                  setShareStatus("✓ Results block copied.");
                } catch {
                  setShareStatus("Couldn't copy — select the block and copy manually.");
                }
              }}
            >
              Copy results block
            </button>
            <button className="btn book-ghost" onClick={exportJson}>
              Download (JSON)
            </button>
          </div>
        </details>
        <p className="small" style={{ color: "var(--book-dim)", marginTop: 14 }}>
          <Link href="/protocol" style={{ color: "var(--gold-ink)" }}>
            Start the 30-day protocol on your Signature →
          </Link>
        </p>
        <div className="bfoot" style={{ textAlign: "center" }}>
          The Genius Index is a reflective and developmental tool. It is not a
          test, a diagnosis, or a measure of intelligence.{" "}
          <em>Identify to amplify.</em>
        </div>
        <EcosystemFooter />
      </div>
      <LegalFootnote />
    </GiShell>
  );
}
