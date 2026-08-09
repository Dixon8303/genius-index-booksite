/* Domain library: the nine domains, each with its full chapter-style page
   built from the same content records the results page reads. */

import { Link, useParams } from "wouter";
import GiShell, { LegalFootnote } from "@/components/genius/GiShell";
import DomainGlyph from "@/components/DomainGlyph";
import {
  CAREERS,
  CHALLENGES,
  EVIDENCE,
  HOBBIES,
  PROTOCOL_DOMAIN,
} from "@/lib/genius/content/library";
import { PROFILE_LIB, SHELF_BOOKS } from "@/lib/genius/content/profiles";
import { BRAIDS, braidSlug } from "@/lib/genius/data/braids";
import {
  DOMAINS,
  DOMAIN_BY_ID,
  FAMILY_META,
  type DomainId,
} from "@/lib/genius/data/domains";
import { domainImage } from "@/lib/genius/data/images";
import { chapterOf } from "@/lib/genius/engine/interpret";
import { realmHex } from "@/lib/genius/viz/builders";

export default function Domains() {
  const params = useParams<{ id?: string }>();
  const domain =
    params.id && params.id.toUpperCase() in DOMAIN_BY_ID
      ? DOMAIN_BY_ID[params.id.toUpperCase() as DomainId]
      : null;

  if (params.id && !domain) {
    return (
      <GiShell nav wide>
        <h2>No domain by that code</h2>
        <Link href="/domains" style={{ color: "var(--brass)" }}>
          ← The nine domains
        </Link>
      </GiShell>
    );
  }

  if (domain) {
    const col = realmHex(domain.meta);
    const fam = FAMILY_META[domain.meta];
    const braids = BRAIDS.filter((b) => b.pair.includes(domain.id));
    const lib = PROFILE_LIB[domain.id];
    return (
      <GiShell nav wide>
        <p className="small" style={{ marginBottom: 12 }}>
          <Link href="/domains" style={{ color: "var(--paper-dim)" }}>
            ← The nine domains
          </Link>
        </p>
        <div className="eyebrow" style={{ color: col }}>
          Chapter {chapterOf(domain.id)} · {fam.label} — {fam.realm}
        </div>
        <h1 style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ color: col }}>
            <DomainGlyph domain={domain.id} size={44} />
          </span>
          {domain.name}
        </h1>
        <p className="dim" style={{ margin: "10px 0 4px" }}>{domain.description}</p>
        <p className="small" style={{ color: col, marginBottom: 14 }}>
          The tell: {domain.sign.toLowerCase()}.
        </p>
        <img
          src={domainImage(domain.id)}
          alt={domain.name}
          style={{ width: "100%", maxWidth: 460, borderRadius: 8, border: `1px solid ${col}` }}
        />
        <div className="card">
          <h3>How it runs</h3>
          <p className="small dim">
            <strong style={{ color: "var(--paper)" }}>{lib.cog.t}.</strong>{" "}
            {lib.cog.p}
          </p>
          <p className="small dim" style={{ marginTop: 8 }}>
            <strong style={{ color: "var(--paper)" }}>{lib.stress.t}.</strong>{" "}
            {lib.stress.p}
          </p>
        </div>
        <div className="card">
          <h3>Where it pays</h3>
          <p className="small dim">{CAREERS[domain.id]}</p>
        </div>
        <div className="card">
          <h3>Where it plays</h3>
          <p className="small dim">
            Solo: {HOBBIES[domain.id][0]}. Together: {HOBBIES[domain.id][1]}.
            Out in the world: {HOBBIES[domain.id][2]}.
          </p>
        </div>
        <div className="card">
          <h3>The shadow, and the edge</h3>
          <p className="small dim">
            <strong style={{ color: "var(--paper)" }}>The shadow:</strong>{" "}
            {CHALLENGES[domain.id][0]}.
          </p>
          <p className="small dim" style={{ marginTop: 6 }}>
            <strong style={{ color: "var(--paper)" }}>The edge you'd enjoy:</strong>{" "}
            {CHALLENGES[domain.id][1]}.
          </p>
        </div>
        <div className="card">
          <h3>The evidence ledger</h3>
          <p className="small dim">{EVIDENCE[domain.id]}</p>
        </div>
        <div className="card">
          <h3>The 30-day protocol, compressed</h3>
          {PROTOCOL_DOMAIN[domain.id].map((w, i) => (
            <p key={i} className="small dim" style={{ margin: "4px 0" }}>
              <strong style={{ color: "var(--brass)" }}>Week {i + 1}.</strong> {w}
            </p>
          ))}
          <p className="small" style={{ marginTop: 8 }}>
            <Link href="/protocol" style={{ color: "var(--brass)" }}>
              Track it day-by-day →
            </Link>
          </p>
        </div>
        <div className="card">
          <h3>The shelf</h3>
          {SHELF_BOOKS[domain.id].map(([t, a, why]) => (
            <p key={t} className="small dim" style={{ margin: "5px 0" }}>
              <strong style={{ color: "var(--paper)" }}>{t}</strong> — {a}.{" "}
              <em>{why}.</em>
            </p>
          ))}
        </div>
        <div className="card">
          <h3>Its eight braids</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {braids.map((b) => {
              const other = DOMAIN_BY_ID[b.pair.find((p) => p !== domain.id)!];
              return (
                <Link
                  key={b.name}
                  href={`/braids/${braidSlug(b.name)}`}
                  className="demo-chip"
                  style={{ textDecoration: "none" }}
                >
                  {b.name}
                  <span className="dim"> · with {other.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
        <LegalFootnote />
      </GiShell>
    );
  }

  return (
    <GiShell nav wide>
      <h1>The Nine Domains</h1>
      <p className="dim" style={{ margin: "12px 0 18px" }}>
        Three realms, three domains each. SOMA — the body. MIND — the mind.
        FIELD — the between. Everybody peaks somewhere on this grid.
      </p>
      {(["soma", "mind", "field"] as const).map((fam) => (
        <section key={fam} style={{ marginBottom: 22 }}>
          <div className="eyebrow" style={{ color: realmHex(fam) }}>
            {FAMILY_META[fam].label} — {FAMILY_META[fam].realm}
          </div>
          {DOMAINS.filter((d) => d.meta === fam).map((d) => (
            <Link key={d.id} href={`/domains/${d.id}`} style={{ textDecoration: "none" }}>
              <div className="card" style={{ cursor: "pointer", display: "flex", gap: 14, alignItems: "center" }}>
                <span style={{ color: realmHex(d.meta), flexShrink: 0 }}>
                  <DomainGlyph domain={d.id} size={36} />
                </span>
                <div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 18, color: "var(--paper)" }}>
                    {d.name}{" "}
                    <span className="small dim" style={{ fontFamily: "'Lato',sans-serif", fontWeight: 400 }}>
                      · {d.tagline}
                    </span>
                  </div>
                  <div className="small dim">{d.sign}</div>
                </div>
              </div>
            </Link>
          ))}
        </section>
      ))}
      <LegalFootnote />
    </GiShell>
  );
}
