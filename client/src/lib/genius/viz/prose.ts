/* Results-page prose modules, lifted from the original as string builders.
   This is ~finished editorial copy composed around the interpretation context
   `m`; React owns the page shell and actions, these strings own the essay
   body. The only adaptation: chapter chips render as real links via an
   injected hrefFor() instead of the old global onclick handlers. */

import { DOMAIN_BY_ID, DOMAINS, type DomainId } from "../data/domains";
import { braidImage, domainImage, familyImage } from "../data/images";
import {
  CAREERS,
  CHALLENGES,
  CURRENCY,
  EVIDENCE,
  HOBBIES,
  PROTOCOL_DOMAIN,
  teamFitFor,
} from "../content/library";
import {
  BLIND_FAMILY,
  BLIND_LOW,
  PROFILE_LIB,
  SHELF_BOOKS,
  type LensKey,
} from "../content/profiles";
import { SHAPE_META, type Interpretation } from "../engine/interpret";
import { buildShapeDiagram, esc } from "./builders";

export type HrefFor = (id: DomainId | "_stack") => string;

export function portraitHTML(m: Interpretation): string {
  const s0 = m.sorted[0].name;
  const supp = DOMAINS.filter((d) => m.band(d) === "Supporting")
    .slice(0, 2)
    .map((d) => d.name);
  let opener;
  if (m.shape === "Tower")
    opener = `You are a <strong>${s0}</strong> genius in the fullest sense — a single, clear peak that runs well ahead of everything else in your profile. The task ahead is not to broaden immediately, but to give this peak a partner.`;
  else if (m.shape === "Ridge")
    opener = `You are a <strong>${m.braidDoms[0].name}</strong> genius and a <strong>${m.braidDoms[1].name}</strong> genius at once — two gifts standing at nearly the same height. Most people have to build a braid; yours is already standing. The only real decision is which strand leads.`;
  else if (m.shape === "Anchored")
    opener = `You are a <strong>${s0}</strong> genius anchored by real support — one clear peak, buttressed by strength in ${supp.join(" and ") || "your supporting domains"}. The task ahead is not to build more support; it's to choose one strand and braid it on purpose.`;
  else
    opener = `Your profile reads even rather than peaked — no domain yet stands clearly above the rest. That isn't an absence of genius; it usually means your Signature lives somewhere this instrument under-measures, or it's real but still latent. The task ahead is developmental before it's strategic.`;
  const headline = m.topUnclaimed
    ? ` And your record already outruns your self-image in <strong>${m.topUnclaimed.name}</strong> — you undersell it by ${m.gapOf(m.topUnclaimed)} points, the clearest unclaimed gift on this page.`
    : "";
  const synth = m.topUnclaimed
    ? ` If there is one true thing here, it is that you are more than you give yourself credit for.`
    : m.shape === "Ridge"
      ? ` Lead with whichever strand the moment rewards, and let the other carry it.`
      : ` Name it, and it starts to grow.`;
  return `<p class="portrait">${opener}${headline}${synth}</p>`;
}

export function spotlightHTML(m: Interpretation): string {
  if (m.topUnclaimed) {
    const d = m.topUnclaimed;
    return `<div class="callout callout--moss"><span class="ct">The one to act on first</span><strong>${d.name}.</strong> You rate yourself at ${Math.round(m.R[d.id].A)}, but you performed at ${Math.round(m.R[d.id].B)} — a ${m.gapOf(d)}-point gap in your favour. Of everything on this page, start here: it's a real capability you're not yet claiming.</div>`;
  }
  return `<div class="callout callout--slate"><span class="ct">A rare agreement</span>Your self-view and your record line up closely across the board — rarer than it sounds. What would you attempt if you trusted that agreement completely?</div>`;
}

export function microHTML(m: Interpretation): string {
  const d = m.sig[0],
    w1 = PROTOCOL_DOMAIN[d.id][0];
  return `<div class="callout callout--brass"><span class="ct">This week's micro-challenge</span>No month-long commitment — just the first move. In the next 24 hours: <strong>${w1}</strong> <span style="color:var(--book-dim)">(${d.name})</span>. That's day one of the protocol below.</div>`;
}

export function reflectionHTML(m: Interpretation): string {
  if (m.topUnclaimed) {
    const d = m.topUnclaimed;
    return `<div class="callout callout--slate"><span class="ct">A question to sit with</span>You rated ${d.name} at ${Math.round(m.R[d.id].A)} but performed at ${Math.round(m.R[d.id].B)}. Think of one moment in the last month where this showed up and you didn't give yourself credit for it. What would change if you did?</div>`;
  }
  return `<div class="callout callout--slate"><span class="ct">A question to sit with</span>Your self-image and your record agree closely across the board — what would you attempt if you trusted that agreement completely?</div>`;
}

export function cautionsHTML(m: Interpretation): string {
  const d = DOMAINS.find(
    (x) =>
      m.band(x) === "Dormant" &&
      !m.R[x.id].skipped &&
      m.R[x.id].B - m.R[x.id].A <= -30,
  );
  if (!d) return "";
  const extra =
    d.id === "ADP"
      ? " With Adaptive especially: defer to a professional before testing physical limits — do not self-test."
      : "";
  return `<div class="callout callout--oxblood"><span class="ct">A caution</span><strong>${d.name}.</strong> Your self-image sits well ahead of the record here, and the domain reads dormant. Not a verdict — a training map.${extra}</div>`;
}

/* The interpretation-first block that meets the reader before the taxonomy. */
export function interpTop(m: Interpretation): string {
  return `
  <div class="book">
   <div class="eyebrow-b">Before the taxonomy — you</div>
   <h2 class="bt">Your Shape</h2>
   <p class="btsub">Your profile is a <strong>${m.shape}</strong> — ${SHAPE_META[m.shape].line}.</p>
   <hr class="brule">
   ${buildShapeDiagram(m.shape)}
   <div class="callout callout--brass"><span class="ct">${m.shape}</span>The strategic move for your shape: ${SHAPE_META[m.shape].move}.</div>
   ${portraitHTML(m)}
   ${spotlightHTML(m)}
  </div>`;
}

/* The "at a glance" strip. Deliberately NOT a single composite number: the
   instrument's stated premise is that intelligence isn't one number, so the
   headline is the pairing, not a rank. */
export function gindexStripHTML(m: Interpretation): string {
  const p = m.braidDoms[0],
    s = m.braidDoms[1];
  const famGloss = { soma: "the body", mind: "the mind", field: "the field" }[
    m.leadingFamily
  ];
  return `<div class="book gindex">
  <div class="eyebrow-b">Your Genius Index · at a glance</div>
  <div class="gindexstrip">
   <div class="gtile"><span class="gk">Primary Genius Type</span><span class="gv ${p.meta}">${p.name}</span><span class="gs">score ${Math.round(m.R[p.id].score)}</span></div>
   <div class="gtile"><span class="gk">Secondary Genius Type</span><span class="gv ${s.meta}">${s.name}</span><span class="gs">score ${Math.round(m.R[s.id].score)}</span></div>
   <div class="gtile"><span class="gk">Genius Braid</span><span class="gv">${m.primary ? m.primary.name : "Unnamed pairing"}</span><span class="gs">shape · ${m.shape}</span></div>
   <div class="gtile"><span class="gk">Leading Family</span><span class="gv fam-${m.leadingFamily}">${m.leadingFamily.toUpperCase()}</span><span class="gs">${famGloss}</span></div>
  </div>
  <p class="gindexnote">Nine scores, no single number — a profile, not a rank. That's the point.</p>
 </div>`;
}

/* Book-sourced result modules. */
export function bookModules(m: Interpretation, hrefFor: HrefFor): string {
  const chDom = (id: DomainId) => 7 + DOMAINS.findIndex((d) => d.id === id);
  const domChip = (d: (typeof DOMAINS)[number]) =>
    `<span class="domchip ${d.meta}" style="font-size:13px;padding:5px 11px 5px 9px"><span class="dot"></span>${d.name}</span>`;
  const sigChapters = m.sig.map((d) => chDom(d.id));
  const chList = (ids: number[]) =>
    (ids.length > 1 ? "Chapters " : "Chapter ") + ids.join(" & ");

  const evidence = `<details class="ev"><summary><span class="ct" style="color:var(--gold-ink)">The evidence ledger</span></summary>
   ${m.sig.map((d) => `<div class="evrow"><div class="evh"><span class="dot ${d.meta}"></span>${d.name}</div><p>${EVIDENCE[d.id]}</p></div>`).join("")}
   <p class="evfoot">The Index measures what folklore only asserts. ${chList(sigChapters)} carries each full ledger.</p></details>`;

  const careers = `<div class="callout callout--brass"><span class="ct">Where this pays</span>
   ${m.sig.map((d) => `<p style="margin:2px 0 8px"><strong>${d.name}.</strong> ${CAREERS[d.id]}</p>`).join("")}
   <p class="modfoot">None of these hire the marker — they hire it demonstrated. ${chList(sigChapters)} names the specific proof each field reads.</p></div>`;

  const hob = `<div class="callout callout--moss"><span class="ct">Where your genius comes alive</span>
   <table class="hobt"><tr><th></th><th>Hobbies</th><th>A date or outing</th><th>An event to seek</th></tr>
   ${m.topDoms.map((d) => `<tr><td class="hobd">${d.name}</td><td>${HOBBIES[d.id][0]}</td><td>${HOBBIES[d.id][1]}</td><td>${HOBBIES[d.id][2]}</td></tr>`).join("")}</table>
   <p class="modfoot">${chList(m.topDoms.map((d) => chDom(d.id)))} has more on why these domains crave this kind of exercise, not just work.</p></div>`;

  const chal = `<div class="callout callout--oxblood"><span class="ct">Friction points & growth edges</span>
   <table class="chalt"><tr><th>Domain</th><th>The shadow</th><th>The edge you'd enjoy</th></tr>
   ${m.sig.map((d) => `<tr><td class="hobd">${d.name}</td><td>${CHALLENGES[d.id][0]}</td><td>${CHALLENGES[d.id][1]}</td></tr>`).join("")}</table></div>`;

  const proto = m.sig
    .map(
      (d) => `<div class="protowrap"><div class="protohd">${d.name} · 30 days</div>
   <div class="weekstrip">${PROTOCOL_DOMAIN[d.id].map((w, i) => `<div class="wk"><span class="wkn">Week ${i + 1}</span>${w}</div>`).join("")}</div></div>`,
    )
    .join("");
  const protocol = `<div class="callout callout--brass"><span class="ct">Your 30-day development protocol</span>
   ${proto}
   <p class="modfoot">This is the compressed version — track it day by day in <a href="${hrefFor("_stack")}">the Protocol tracker</a>. ${chList(sigChapters)} runs the full day-by-day in the book.</p></div>`;

  const reach = m.reachable.length
    ? `<div class="callout callout--brass">
   <span class="ct">Braids you could build next</span>
   ${m.reachable
     .map((br) => {
       const d0 = DOMAIN_BY_ID[br.pair[0]],
         d1 = DOMAIN_BY_ID[br.pair[1]];
       return `<div class="reachcard">
       <div class="reachhead"><div class="reachname">${br.name}</div>
        <div class="reachart"><img src="${braidImage(br.name)}" alt="${esc(br.name)}" loading="lazy"></div></div>
       <div class="reachpair">${domChip(d0)} <span style="color:var(--book-dim)">${Math.round(m.R[br.pair[0]].score)}</span> × ${domChip(d1)} <span style="color:var(--book-dim)">${Math.round(m.R[br.pair[1]].score)}</span></div>
       <p class="reachdesc">${br.desc}</p>
       <p class="reachproof"><span>Currency of proof:</span> ${CURRENCY[br.name] || "a finished, demonstrated piece of work"}.</p></div>`;
     })
     .join("")}
   <p class="modfoot">You already carry one strand of each. The other is within reach — that's what makes these the next braids to build.</p></div>`
    : "";

  const team = `<div class="callout callout--slate"><span class="ct">Who to pair with</span>
   <p style="margin:2px 0">Not who to become — who complements you. For ${m.primary ? `<strong>${m.primary.name}</strong>` : "your braid"}: ${teamFitFor(m.primary)}.</p></div>`;

  const readnext = `<div class="callout callout--brass"><span class="ct">Read next</span>
   <div class="rnrow">${m.readNext.map((e) => `<a class="rn-chip" href="${hrefFor(e.id)}"><span class="rn-ch">Ch ${e.ch}</span>${e.name}${e.note ? `<span class="rn-note"> · ${e.note}</span>` : ""}</a>`).join("")}</div></div>`;

  return `
  <div class="book" style="text-align:center">
   <div class="resultart"><img src="${domainImage(m.braidDoms[0].id)}" alt="${m.braidDoms[0].name}" loading="lazy"><div class="resultart-cap">${m.braidDoms[0].name}</div></div>
  </div>
  <div class="book">
   <div class="eyebrow-b">What your genius is for</div>
   <h2 class="bt">Where it lives in a life</h2>
   <p class="btsub">Your Signature ${m.sig.length > 1 ? "domains" : "domain"} — ${m.sig.map((d) => d.name).join(" & ")} — read into work, play, and the edges between.</p>
   <hr class="brule">
   ${evidence}${careers}${hob}${chal}
  </div>
  <div class="book" style="text-align:center">
   <div class="resultart"><img src="${familyImage(m.leadingFamily)}" alt="${m.leadingFamily.toUpperCase()}" loading="lazy"><div class="resultart-cap">${m.leadingFamily.toUpperCase()}</div></div>
  </div>
  <div class="book">
   <div class="eyebrow-b">What to do with it</div>
   <h2 class="bt">Grow it on purpose</h2>
   <hr class="brule">
   ${microHTML(m)}${protocol}${reach}${team}${readnext}${reflectionHTML(m)}${cautionsHTML(m)}
  </div>`;
}

/* The psychometric-style profile read: seven lenses composed from the two
   braid strands, plus blind spots (the missing realm + the lowest strand)
   and a real-book shelf. Interpretive, same status as the other book modules. */
export function profileSectionHTML(m: Interpretation): string {
  const p = m.braidDoms[0],
    s = m.braidDoms[1];
  const P = PROFILE_LIB[p.id],
    S = PROFILE_LIB[s.id];
  const card = (key: LensKey, label: string) => {
    const a = P[key],
      b = S[key];
    const sec =
      key !== "stress" && b && b.s
        ? `<p class="prosec">Your ${s.name} strand ${b.s}.</p>`
        : "";
    return `<div class="procard"><div class="prokey">${label}</div>
    <div class="protitle">${a.t}</div>
    <p class="probody">${a.p}</p>${sec}</div>`;
  };
  const fams = new Set([p.meta, s.meta]);
  const missing = (["soma", "mind", "field"] as const).filter(
    (f) => !fams.has(f),
  );
  const low = m.sorted[m.sorted.length - 1];
  const blind = `<div class="callout callout--oxblood blindspots"><span class="ct">Blind spots</span>
   ${missing.map((f) => `<p style="margin:2px 0 8px">${BLIND_FAMILY[f]}</p>`).join("")}
   <p style="margin:2px 0"><strong>Lowest strand — ${low.name} (${Math.round(m.R[low.id].score)}):</strong> ${BLIND_LOW[low.id]}</p></div>`;
  const shelfRows = [p, s]
    .map(
      (d) => `<div class="shelfgroup"><div class="shelfdom ${d.meta}">${d.name} strand</div>
   ${SHELF_BOOKS[d.id].map((b) => `<div class="shelfrow"><span class="shelftitle">${b[0]}</span><span class="shelfauthor">${b[1]}</span><span class="shelfwhy">${b[2]}</span></div>`).join("")}</div>`,
    )
    .join("");
  const chOf = (id: DomainId) => 7 + DOMAINS.findIndex((d) => d.id === id);
  return `<div class="book">
  <div class="eyebrow-b">The reading</div>
  <h2 class="bt">Your Genius Profile</h2>
  <p class="btsub">How ${m.primary ? esc(m.primary.name) : "your pairing"} runs in daily life — thinking, leading, learning, and the rest. A reading of your two strands, not a verdict.</p>
  <hr class="brule">
  <div class="profilegrid">
   ${card("cog", "Cognitive Profile")}
   ${card("lead", "Leadership Profile")}
   ${card("learn", "Learning Profile")}
   ${card("comm", "Communication Profile")}
   ${card("team", "Team Role")}
   ${card("innov", "Innovation Style")}
  </div>
  <div class="profilegrid" style="grid-template-columns:1fr">
   ${card("stress", "Stress Profile")}
  </div>
  ${blind}
  <div class="eyebrow-b" style="margin-top:26px">The shelf</div>
  <h3 class="prosectionhead">Books for this profile</h3>
  <div class="shelf">${shelfRows}</div>
  <p class="modfoot">Start inside <em>The Genius Index</em> itself: your chapters are Chapter ${chOf(p.id)} (${p.name}) and Chapter ${chOf(s.id)} (${s.name}) — the Read Next chips further down take you straight to them.</p>
 </div>`;
}
