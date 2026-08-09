/* Result visualizations, lifted from the original as string builders.
   They take plain data and return SVG/HTML strings — framework-free, rendered
   through the RawHtml wrapper. Rewriting the wheel geometry as JSX would be
   pure risk for no user-visible gain, so it stays string-based on purpose. */

import { BRAIDS, braidFor, braidKey, type Braid } from "../data/braids";
import {
  DOMAINS,
  DOMAIN_BY_ID,
  type Domain,
  type DomainId,
  type Family,
} from "../data/domains";
import { SHAPE_META, type Shape } from "../engine/interpret";
import type { ResultMap } from "../engine/scoring";

export const realmHex = (meta: Family): string =>
  meta === "soma" ? "#8C3B2E" : meta === "mind" ? "#54687C" : "#4E6156";
export const realmColor = (meta: Family): string =>
  meta === "soma" ? "var(--soma)" : meta === "mind" ? "var(--mind)" : "var(--field)";

export const DOMAIN_DEF: Record<DomainId, string> = {
  KIN: "Learns and reproduces physical movement fast.",
  SEN: "Notices fine sensory detail others miss.",
  ADP: "Body tolerates and recovers from extremes.",
  ANL: "Finds the pattern, the error, the system.",
  MEM: "Recalls detail, sequence, and faces with ease.",
  GEN: "Produces new ideas readily and often.",
  REL: "Reads people and rooms accurately.",
  EXP: "Transmits — an audience follows and feels it.",
  PER: "Notices change and orientation in a space.",
};

export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

/* Personal constellation wheel (SVG). */
export function buildWheel(
  R: ResultMap,
  primaryKey: string,
  adjKeys: Set<string>,
  primaryBraid: Braid | null,
): string {
  const cx = 312,
    cy = 340,
    Rr = 185;
  const order: DomainId[] = ["EXP", "PER", "KIN", "SEN", "ADP", "ANL", "MEM", "GEN", "REL"];
  const ang: Record<string, number> = {};
  order.forEach((id, i) => (ang[id] = -90 + i * 40));
  const pos: Record<string, [number, number]> = {};
  order.forEach((id) => {
    const a = (ang[id] * Math.PI) / 180;
    pos[id] = [cx + Rr * Math.cos(a), cy + Rr * Math.sin(a)];
  });
  const polar = (r: number, deg: number): [number, number] => {
    const a = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const arc = (r: number, a0: number, a1: number) => {
    const [x0, y0] = polar(r, a0),
      [x1, y1] = polar(r, a1);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };
  let svg = `<svg viewBox="0 0 624 640" role="img" aria-label="Your genius constellation">`;
  svg += `<path d="${arc(Rr + 40, -30, 90)}" fill="none" stroke="#8C3B2E" stroke-width="7" stroke-opacity=".75" stroke-linecap="round"/>`;
  svg += `<path d="${arc(Rr + 40, 90, 210)}" fill="none" stroke="#54687C" stroke-width="7" stroke-opacity=".75" stroke-linecap="round"/>`;
  svg += `<path d="${arc(Rr + 40, 210, 330)}" fill="none" stroke="#4E6156" stroke-width="7" stroke-opacity=".75" stroke-linecap="round"/>`;
  const lbl = (txt: string, deg: number, col: string) => {
    const [x, y] = polar(Rr + 62, deg);
    return `<text x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="middle" font-family="Lato,sans-serif" font-size="15" font-weight="700" letter-spacing="3" fill="${col}">${txt}</text>`;
  };
  svg += lbl("SOMA", 30, "#8C3B2E") + lbl("MIND", 150, "#54687C") + lbl("FIELD", 270, "#4E6156");
  const chord = (k: string, br: Braid) => {
    const [a, b] = k.split("|");
    const [x0, y0] = pos[a],
      [x1, y1] = pos[b];
    let stroke = "#8C7E69",
      w = 1,
      op = 0.22;
    if (br.tier === "C") {
      stroke = "#6E6150";
      w = 1.5;
      op = 0.42;
    }
    if (adjKeys.has(k)) {
      stroke = "#9A7440";
      w = 2.4;
      op = 0.72;
    }
    const isPrimary = k === primaryKey;
    if (isPrimary) {
      stroke = "#B4832E";
      w = 4.5;
      op = 0.98;
    }
    // The one orchestrated moment: the primary braid thread draws itself in on load.
    const extra = isPrimary ? ` class="braid-draw" pathLength="1"` : "";
    return {
      svg: `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${stroke}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round"${extra}/>`,
      top: k === primaryKey || adjKeys.has(k),
    };
  };
  const cs = BRAIDS.map((br) => chord(braidKey(br.pair[0], br.pair[1]), br));
  svg +=
    cs.filter((c) => !c.top).map((c) => c.svg).join("") +
    cs.filter((c) => c.top).map((c) => c.svg).join("");
  if (primaryBraid) {
    const [a, b] = primaryKey.split("|");
    const mx = (pos[a][0] + pos[b][0]) / 2,
      my = (pos[a][1] + pos[b][1]) / 2;
    const w = primaryBraid.name.length * 7.2 + 16;
    svg += `<g transform="translate(${mx.toFixed(1)} ${my.toFixed(1)})"><rect x="${(-w / 2).toFixed(1)}" y="-11" width="${w.toFixed(1)}" height="22" rx="5" fill="#EFE7D6" stroke="#B4832E" stroke-width="1.3"/><text x="0" y="4.5" text-anchor="middle" font-family="Playfair Display,serif" font-weight="700" font-size="12.5" fill="#7A5B31">${primaryBraid.name}</text></g>`;
  }
  order.forEach((id) => {
    const d = DOMAIN_BY_ID[id],
      [x, y] = pos[id],
      sc = R[id].score;
    const col = realmHex(d.meta),
      r = 22 + (sc / 100) * 7,
      op = (0.12 + (0.5 * sc) / 100).toFixed(2);
    const isTop = id === primaryKey.split("|")[0] || id === primaryKey.split("|")[1];
    const tipName = esc(d.name),
      tipBody = esc(`${sc} · ${DOMAIN_DEF[id]}`);
    svg += `<g class="wnode" tabindex="0" role="button" aria-label="${tipName} — ${tipBody}" data-name="${tipName}" data-body="${tipBody}">`;
    svg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r + 8).toFixed(1)}" fill="transparent"/>`;
    svg += `<circle class="wdot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${col}" fill-opacity="${op}" stroke="${col}" stroke-width="${isTop ? 3 : 1.5}"/>`;
    svg += `<text x="${x.toFixed(1)}" y="${(y + 1).toFixed(1)}" text-anchor="middle" font-family="Playfair Display,serif" font-weight="700" font-size="13" fill="${col}" style="pointer-events:none">${d.code}</text>`;
    svg += `<text x="${x.toFixed(1)}" y="${(y + 14).toFixed(1)}" text-anchor="middle" font-family="Lato,sans-serif" font-size="9" font-weight="700" fill="${col}" style="pointer-events:none">${sc}</text>`;
    svg += `</g>`;
  });
  svg += `</svg>`;
  return svg;
}

/* Triangular Complete Index Grid (desktop) + accordion fallback (mobile). */
export function buildGrid(
  R: ResultMap,
  primaryKey: string,
  adjKeys: Set<string>,
): string {
  let rows = "";
  for (let r = 0; r < 9; r++) {
    let cells = "";
    for (let c = 0; c <= r; c++) {
      if (c === r) {
        const d = DOMAINS[r];
        cells += `<td><div class="gcell" style="background:${realmColor(d.meta)};color:#EDE4D4"><span class="gn" style="opacity:.85">${d.code}</span><span class="gs">${R[d.id].score}</span></div></td>`;
      } else {
        const br = braidFor(DOMAINS[r].id, DOMAINS[c].id)!,
          k = braidKey(DOMAINS[r].id, DOMAINS[c].id);
        const canon = br.tier === "C";
        const mine = k === primaryKey,
          adj = adjKeys.has(k);
        const bg = mine
          ? "rgba(195,154,91,.35)"
          : canon
            ? "rgba(195,154,91,.16)"
            : "rgba(0,0,0,.03)";
        const dotc =
          br.tier === "C" ? "#B4832E" : br.tier === "S" ? "#4E6156" : br.tier === "R" ? "#8C3B2E" : "#54687C";
        cells += `<td><div class="gcell ${mine ? "mine" : adj ? "adj" : ""}" style="background:${bg}"><span class="gn" style="color:var(--book-ink)">${br.name.replace(/^The /, "")}</span><span class="gt" style="color:${dotc}">●</span></div></td>`;
      }
    }
    rows += `<tr>${cells}</tr>`;
  }
  const desktop = `<div class="gridscroll grid-desktop"><table class="igrid">${rows}</table></div>`;
  return desktop + buildGridAccordion(R, primaryKey, adjKeys);
}

export function buildGridAccordion(
  R: ResultMap,
  primaryKey: string,
  adjKeys: Set<string>,
): string {
  const rows = DOMAINS.map((d) => {
    const others = DOMAINS.filter((o) => o.id !== d.id)
      .map((o) => {
        const br = braidFor(d.id, o.id)!,
          k = braidKey(d.id, o.id);
        const mine = k === primaryKey,
          adj = adjKeys.has(k);
        const dotc =
          br.tier === "C" ? "#B4832E" : br.tier === "S" ? "#4E6156" : br.tier === "R" ? "#8C3B2E" : "#54687C";
        return `<div class="gaRow ${mine ? "mine" : adj ? "adj" : ""}"><span class="gaDot" style="background:${dotc}"></span><span class="gaOther">${o.name}</span><span class="gaBraid">${br.name}</span></div>`;
      })
      .join("");
    return `<details class="gaItem"><summary><span class="gaSum" style="background:${realmColor(d.meta)}">${d.code}</span>${d.name}<span class="gaScore">${R[d.id].score}</span></summary><div class="gaBody">${others}</div></details>`;
  }).join("");
  return `<div class="grid-mobile">${rows}</div>`;
}

/* Field guide: all 36, grouped by tier, personalized by score brightness. */
export function buildFieldGuide(
  R: ResultMap,
  primaryKey: string,
  adjKeys: Set<string>,
): string {
  const groups: [string, string][] = [
    ["C", "The Canonical Ten"],
    ["S", "The Strong Pairs"],
    ["R", "The Rarest"],
    ["Q", "The Quiet Few"],
  ];
  let out = "";
  groups.forEach(([t, title]) => {
    const items = BRAIDS.filter((b) => b.tier === t);
    out += `<div class="eyebrow-b fg-sectionhead">${title}</div><div class="fgcols">`;
    items.forEach((br) => {
      const k = braidKey(br.pair[0], br.pair[1]);
      const mine = k === primaryKey,
        adj = adjKeys.has(k);
      const ps = (R[br.pair[0]].score + R[br.pair[1]].score) / 2;
      const op = mine ? "1" : (0.5 + (0.5 * ps) / 100).toFixed(2);
      const codes = br.pair.map((id) => DOMAIN_BY_ID[id].code).join("·");
      out += `<div class="fgrow ${t === "C" ? "canon" : ""} ${mine ? "mine" : adj ? "adj" : ""}" style="opacity:${op}">
     <span class="fgdot"></span><div class="fgtxt"><span class="fgn">${br.name}</span> <span class="fgp">${codes}</span><span class="fgd">${br.desc}${br.rare ? " · also among the rarest" : ""}</span></div></div>`;
    });
    out += `</div>`;
  });
  return out;
}

/* Hero motif: the book's 3×3 cover grid, the reader's two braid domains lit in
   gold with a gold thread linking them. */
export function buildHeroGlyph(braidDoms: Domain[]): string {
  const lit = braidDoms.map((d) => d.id);
  const cells = [...DOMAINS].sort((a, b) => a.cell - b.cell);
  const defs = `<defs><linearGradient id="litCell" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#E3BE7C"/><stop offset="100%" stop-color="#B4832E"/>
   </linearGradient></defs>`;
  const cellSvg = cells
    .map((d, i) => {
      const col = realmHex(d.meta),
        x = i % 3,
        y = Math.floor(i / 3);
      const cx = 30 + x * 62,
        cy = 30 + y * 62,
        on = lit.includes(d.id);
      const box = on
        ? `<rect x="${cx - 26}" y="${cy - 26}" width="52" height="52" rx="9" fill="url(#litCell)" stroke="#8A652E" stroke-width="1.5"/>`
        : `<rect x="${cx - 26}" y="${cy - 26}" width="52" height="52" rx="9" fill="${col}" fill-opacity="0.05" stroke="${col}" stroke-opacity="0.28" stroke-width="1.3"/>`;
      const txt = `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-family="Playfair Display,serif" font-weight="700" font-size="15" fill="${on ? "#2A2118" : col}" fill-opacity="${on ? 1 : 0.72}">${d.code}</text>`;
      return box + txt;
    })
    .join("");
  const p = braidDoms.map((d) => {
    const i = cells.findIndex((c) => c.id === d.id);
    return [30 + (i % 3) * 62, 30 + Math.floor(i / 3) * 62];
  });
  const thread =
    p.length === 2
      ? `<line x1="${p[0][0]}" y1="${p[0][1]}" x2="${p[1][0]}" y2="${p[1][1]}" stroke="#B4832E" stroke-width="3" stroke-linecap="round" stroke-opacity="0.9" class="braid-draw" pathLength="1"/>`
      : "";
  return `<div class="heroglyph"><svg viewBox="0 0 184 184" aria-hidden="true">${defs}${thread}${cellSvg}</svg></div>`;
}

/* The vertical nine-bar shape diagram strip. */
export function buildShapeDiagram(current: Shape): string {
  return (
    `<div class="shapediag">` +
    (["Tower", "Ridge", "Anchored", "Plateau"] as Shape[])
      .map((name) => {
        const on = name === current;
        const bars = SHAPE_META[name].bars
          .map((v) => `<span class="sbar" style="height:${v * 10}%"></span>`)
          .join("");
        return `<figure class="shapemini ${on ? "on" : ""}"><div class="sbars">${bars}</div><figcaption class="sname">${name}${on ? " · you" : ""}</figcaption></figure>`;
      })
      .join("") +
    `</div>`
  );
}
