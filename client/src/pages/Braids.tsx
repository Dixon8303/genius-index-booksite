/* Braid explorer: all thirty-six pairings, grouped by tier, each with its
   commissioned art, currency of proof, and strands. */

import { useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import GiShell, { LegalFootnote } from "@/components/genius/GiShell";
import DomainGlyph from "@/components/DomainGlyph";
import { CURRENCY, teamFitFor } from "@/lib/genius/content/library";
import {
  BRAIDS,
  BRAID_BY_SLUG,
  braidSlug,
  TIER_META,
  type Braid,
  type BraidTier,
} from "@/lib/genius/data/braids";
import { DOMAIN_BY_ID } from "@/lib/genius/data/domains";
import { braidImage } from "@/lib/genius/data/images";
import { realmHex } from "@/lib/genius/viz/builders";

function BraidCard({ braid }: { braid: Braid }) {
  const [a, b] = braid.pair.map((id) => DOMAIN_BY_ID[id]);
  return (
    <Link href={`/braids/${braidSlug(braid.name)}`} style={{ textDecoration: "none" }}>
      <div
        className="card"
        style={{ cursor: "pointer", display: "flex", gap: 14, alignItems: "center" }}
      >
        <img
          src={braidImage(braid.name)}
          alt=""
          loading="lazy"
          style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 6, border: "1px solid var(--brass-deep)", flexShrink: 0 }}
        />
        <div>
          <div style={{ fontFamily: "'Instrument Serif',serif", fontWeight: 700, fontSize: 18, color: "var(--paper)" }}>
            {braid.name}
          </div>
          <div className="small" style={{ margin: "2px 0" }}>
            <span style={{ color: realmHex(a.meta) }}>{a.name}</span>
            <span className="dim"> × </span>
            <span style={{ color: realmHex(b.meta) }}>{b.name}</span>
            {braid.rare ? <span style={{ color: "var(--brass)" }}> · rarest</span> : null}
          </div>
          <div className="small dim">{braid.desc}</div>
        </div>
      </div>
    </Link>
  );
}

export default function Braids() {
  const params = useParams<{ slug?: string }>();
  const braid = params.slug ? BRAID_BY_SLUG[params.slug] : null;
  /* Archive facets: tier and contains-domain (Category E collection browsing). */
  const [tierFilter, setTierFilter] = useState<BraidTier | null>(null);
  const [domainFilter, setDomainFilter] = useState<string | null>(null);

  const tiers = useMemo(
    () =>
      (["C", "S", "R", "Q"] as BraidTier[])
        .filter((t) => !tierFilter || t === tierFilter)
        .map((t) => ({
          tier: t,
          meta: TIER_META[t],
          braids: BRAIDS.filter(
            (b) =>
              b.tier === t &&
              (!domainFilter || (b.pair as string[]).includes(domainFilter)),
          ),
        }))
        .filter((g) => g.braids.length > 0),
    [tierFilter, domainFilter],
  );
  const shown = tiers.reduce((n, g) => n + g.braids.length, 0);

  if (params.slug && !braid) {
    return (
      <GiShell nav wide>
        <h2>No braid by that name</h2>
        <Link href="/braids" style={{ color: "var(--brass)" }}>
          ← All thirty-six braids
        </Link>
      </GiShell>
    );
  }

  if (braid) {
    const [a, b] = braid.pair.map((id) => DOMAIN_BY_ID[id]);
    const tm = TIER_META[braid.tier];
    return (
      <GiShell nav wide>
        <p className="small" style={{ marginBottom: 12 }}>
          <Link href="/braids" style={{ color: "var(--paper-dim)" }}>
            ← All thirty-six braids
          </Link>
        </p>
        <div className="eyebrow">{tm.label}{braid.rare ? " · Rarest" : ""}</div>
        <h1>{braid.name}</h1>
        <p className="dim" style={{ margin: "10px 0 16px" }}>{braid.desc}</p>
        <img
          src={braidImage(braid.name)}
          alt={braid.name}
          style={{ width: "100%", maxWidth: 460, borderRadius: 8, border: "1px solid var(--brass-deep)" }}
        />
        <div className="card" style={{ marginTop: 18 }}>
          <h3>The two strands</h3>
          {[a, b].map((d) => (
            <Link key={d.id} href={`/domains/${d.id}`} style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--line)", cursor: "pointer" }}>
                <span style={{ color: realmHex(d.meta) }}>
                  <DomainGlyph domain={d.id} size={30} />
                </span>
                <div>
                  <div style={{ color: "var(--paper)", fontWeight: 700 }}>
                    {d.name}{" "}
                    <span className="small dim">· {d.tagline} · {d.meta.toUpperCase()}</span>
                  </div>
                  <div className="small dim">{d.sign}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="card">
          <h3>Currency of proof</h3>
          <p className="small dim">
            What this braid trades on:{" "}
            <span style={{ color: "var(--paper)" }}>
              {CURRENCY[braid.name] || "a finished, demonstrated piece of work"}
            </span>
            .
          </p>
        </div>
        <div className="card">
          <h3>Who to pair with</h3>
          <p className="small dim">{teamFitFor(braid)}</p>
        </div>
        <div className="card small">
          <span className="dim">{tm.sub}</span>{" "}
          <Link href="/assessment" style={{ color: "var(--brass)" }}>
            Is this yours? Take the assessment →
          </Link>
        </div>
        <LegalFootnote />
      </GiShell>
    );
  }

  return (
    <GiShell nav wide>
      <h1>The Thirty-Six Braids</h1>
      <p className="dim" style={{ margin: "12px 0 8px" }}>
        A genius rarely runs alone. Two domains braided together make the
        recognizable figure — the Craftsman, the Storyteller, the
        Diagnostician. Every pairing of the nine domains has a name; ten are
        distinct enough to be canonical.
      </p>
      {/* Facets */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "10px 0 4px" }}>
        <button
          className={`demo-chip${tierFilter === null ? " sel" : ""}`}
          onClick={() => setTierFilter(null)}
        >
          All tiers
        </button>
        {(["C", "S", "R", "Q"] as BraidTier[]).map((t) => (
          <button
            key={t}
            className={`demo-chip${tierFilter === t ? " sel" : ""}`}
            onClick={() => setTierFilter(tierFilter === t ? null : t)}
          >
            {TIER_META[t].label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "4px 0 6px" }}>
        <button
          className={`demo-chip${domainFilter === null ? " sel" : ""}`}
          onClick={() => setDomainFilter(null)}
        >
          Any domain
        </button>
        {Object.values(DOMAIN_BY_ID).map((d) => (
          <button
            key={d.id}
            className={`demo-chip${domainFilter === d.id ? " sel" : ""}`}
            style={domainFilter === d.id ? { borderColor: realmHex(d.meta), color: realmHex(d.meta) } : undefined}
            onClick={() => setDomainFilter(domainFilter === d.id ? null : d.id)}
          >
            {d.name}
          </button>
        ))}
      </div>
      <p
        className="small dim"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: ".04em", textTransform: "uppercase", fontSize: 11 }}
      >
        {shown} of 36 braids shown
      </p>
      {tiers.map(({ tier, meta, braids }) => (
        <section key={tier} style={{ marginTop: 26 }}>
          <div className="eyebrow">{meta.label}</div>
          <p className="small dim" style={{ margin: "4px 0 10px" }}>{meta.sub}</p>
          {braids.map((b) => (
            <BraidCard key={b.name} braid={b} />
          ))}
        </section>
      ))}
      <LegalFootnote />
    </GiShell>
  );
}
