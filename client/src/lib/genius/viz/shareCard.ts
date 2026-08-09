/* Share card: self-contained 1080×1150 SVG -> canvas -> PNG. No external
   libs. Collage images are fetched and inlined as data URIs (not referenced
   by URL) so the exported PNG has no external resource references — an SVG
   <image> pointing at a same-origin file still risks tainting the canvas in
   some browsers, so embedding the bytes sidesteps that entirely.
   Ported verbatim; only the call-to-action URL now points at this app. */

import { braidImage, domainImage, familyImage } from "../data/images";
import { DOMAIN_BY_ID, type Domain } from "../data/domains";
import type { Interpretation } from "../engine/interpret";
import { esc, realmHex } from "./builders";

const SHARE_URL_LABEL = "dixon8303.github.io/genius-index-booksite";
const SHARE_URL = "https://dixon8303.github.io/genius-index-booksite/";

async function imgToDataURI(path: string): Promise<string | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export const SHARE_CARD_W = 1080;
export const SHARE_CARD_H = 1150;

function dScore(m: Interpretation, d: Domain): number {
  return m.R[d.id].score;
}

function retestDate(): Date {
  return new Date(Date.now() + 90 * 24 * 3600 * 1000);
}

export async function buildShareCardSVG(m: Interpretation): Promise<string> {
  const W = SHARE_CARD_W,
    H = SHARE_CARD_H,
    primary = DOMAIN_BY_ID[m.braidDoms[0].id],
    other = DOMAIN_BY_ID[m.braidDoms[1].id];
  const braidName = m.primary ? m.primary.name : "Your Braid";
  const fs = braidName.length > 16 ? 66 : braidName.length > 11 ? 78 : 92;
  const top3 = m.sorted.slice(0, 3);
  const barY0 = 660,
    barH = 30,
    barGap = 62;
  const bars = top3
    .map((d, i) => {
      const y = barY0 + i * barGap,
        w = (520 * dScore(m, d)) / 100,
        col = realmHex(d.meta);
      return `<rect x="330" y="${y}" width="520" height="${barH}" rx="9" fill="#00000010"/>
           <rect x="330" y="${y}" width="${w.toFixed(1)}" height="${barH}" rx="9" fill="${col}"/>
           <rect x="330" y="${y}" width="${w.toFixed(1)}" height="${(barH / 2).toFixed(1)}" rx="9" fill="#FFFFFF" fill-opacity="0.14"/>
           <text x="310" y="${y + barH - 8}" text-anchor="end" font-family="Lato,sans-serif" font-size="22" font-weight="700" fill="#2A2118">${d.name}</text>
           <text x="${330 + 520 + 16}" y="${y + barH - 8}" text-anchor="start" font-family="Lato,sans-serif" font-size="22" font-weight="700" fill="${col}">${Math.round(dScore(m, d))}</text>`;
    })
    .join("");
  const chip = (d: Domain, x: number) => `<g transform="translate(${x} 470)">
   <rect x="-116" y="-28" width="232" height="58" rx="29" fill="#FBF6EA" stroke="${realmHex(d.meta)}" stroke-width="2"/>
   <circle cx="-94" cy="0" r="8" fill="${realmHex(d.meta)}"/>
   <text x="-74" y="8" font-family="Playfair Display,serif" font-weight="600" font-size="26" fill="${realmHex(d.meta)}">${d.name}</text></g>`;

  const collageSrcs = [
    m.primary ? braidImage(m.primary.name) : null,
    domainImage(m.braidDoms[0].id),
    domainImage(m.braidDoms[1].id),
    familyImage(m.leadingFamily),
  ].filter(Boolean) as string[];
  const dataUris = await Promise.all(collageSrcs.map(imgToDataURI));
  const collageUris = dataUris.filter(Boolean) as string[];
  const cw = 156,
    ch = 104,
    gap = 22,
    pad = 9;
  const totalW =
    collageUris.length * cw + Math.max(0, collageUris.length - 1) * gap;
  const startX = (W - totalW) / 2,
    cy = 852;
  const collage = collageUris
    .map((uri, i) => {
      const x = startX + i * (cw + gap),
        midX = x + cw / 2,
        midY = cy + ch / 2;
      const angle = i % 2 === 0 ? -2.4 : 2.4;
      return `<g transform="rotate(${angle} ${midX.toFixed(1)} ${midY.toFixed(1)})">
     <rect x="${x - pad}" y="${(cy - pad + 5).toFixed(1)}" width="${cw + pad * 2}" height="${ch + pad * 2}" rx="9" fill="#00000022"/>
     <rect x="${x - pad}" y="${(cy - pad).toFixed(1)}" width="${cw + pad * 2}" height="${ch + pad * 2}" rx="9" fill="#FFFDF8" stroke="rgba(122,91,49,.3)" stroke-width="1.5"/>
     <clipPath id="cclip${i}"><rect x="${x}" y="${cy}" width="${cw}" height="${ch}" rx="3"/></clipPath>
     <image href="${uri}" x="${x}" y="${cy}" width="${cw}" height="${ch}" preserveAspectRatio="xMidYMid slice" clip-path="url(#cclip${i})"/>
     <rect x="${x}" y="${cy}" width="${cw}" height="${ch}" rx="3" fill="none" stroke="#C39A5B" stroke-width="1.5"/>
     <rect x="${(midX - 24).toFixed(1)}" y="${(cy - pad - 8).toFixed(1)}" width="48" height="16" fill="rgba(195,154,91,.6)"/>
    </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
   <radialGradient id="cardGlow" cx="50%" cy="8%" r="65%">
    <stop offset="0%" stop-color="#C39A5B" stop-opacity="0.22"/><stop offset="100%" stop-color="#C39A5B" stop-opacity="0"/>
   </radialGradient>
   <linearGradient id="edgeBar" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#9A7440"/><stop offset="50%" stop-color="#E3BE7C"/><stop offset="100%" stop-color="#9A7440"/>
   </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#EDE4D4"/>
  <rect width="${W}" height="${H}" fill="url(#cardGlow)"/>
  <rect width="${W}" height="10" fill="url(#edgeBar)"/>
  <rect x="34" y="34" width="${W - 68}" height="${H - 68}" rx="14" fill="none" stroke="rgba(122,91,49,.35)" stroke-width="2"/>
  <text x="${W / 2}" y="150" text-anchor="middle" font-family="Lato,sans-serif" font-size="26" font-weight="700" letter-spacing="7" fill="#7A5B31">THE GENIUS INDEX</text>
  <text x="${W / 2}" y="215" text-anchor="middle" font-family="Lato,sans-serif" font-size="20" letter-spacing="3" fill="#7A5B31">YOUR BRAID</text>
  <rect x="${W / 2 - 30}" y="232" width="60" height="2" fill="#C39A5B"/>
  <text x="${W / 2}" y="${215 + fs}" text-anchor="middle" font-family="Playfair Display,serif" font-weight="700" font-size="${fs}" fill="#2A2118">${esc(braidName)}</text>
  ${chip(primary, W / 2 - 135)}${chip(other, W / 2 + 135)}
  <text x="${W / 2}" y="590" text-anchor="middle" font-family="Lato,sans-serif" font-size="22" font-weight="700" letter-spacing="2" fill="#6B6258">SHAPE · ${m.shape.toUpperCase()}</text>
  ${bars}
  ${collage}
  <text x="${W / 2}" y="998" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-style="italic" font-size="24" fill="#6B6258">Everybody carries a genius. Find yours — free.</text>
  <text x="${W / 2}" y="1034" text-anchor="middle" font-family="Lato,sans-serif" font-weight="700" font-size="25" letter-spacing="0.4" fill="#7A5B31">Take the assessment → ${SHARE_URL_LABEL}</text>
  <rect x="${W / 2 - 190}" y="1054" width="380" height="1" fill="rgba(122,91,49,.3)"/>
  <text x="${W / 2}" y="1086" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-style="italic" font-size="22" fill="#6B6258">↺ Retake it ${esc(retestDate().toLocaleDateString(undefined, { month: "long", day: "numeric" }))} — see what's changed</text>
  <rect y="${H - 10}" width="${W}" height="10" fill="url(#edgeBar)"/>
 </svg>`;
}

export async function getShareCardBlob(m: Interpretation): Promise<Blob> {
  const svgStr = await buildShareCardSVG(m);
  const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = SHARE_CARD_W;
      canvas.height = SHARE_CARD_H;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, SHARE_CARD_W, SHARE_CARD_H);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("toBlob failed"));
          return;
        }
        resolve(blob);
      }, "image/png");
    };
    img.onerror = () => reject(new Error("SVG render failed"));
    img.src = url;
  });
}

function shareCardFilename(m: Interpretation): string {
  return `genius-index-${(m.primary ? m.primary.name : "result").replace(/\s+/g, "-").toLowerCase()}.png`;
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const dl = document.createElement("a");
  dl.href = URL.createObjectURL(blob);
  dl.download = filename;
  document.body.appendChild(dl);
  dl.click();
  dl.remove();
}

export async function downloadShareCard(m: Interpretation): Promise<void> {
  const blob = await getShareCardBlob(m);
  triggerBlobDownload(blob, shareCardFilename(m));
}

export async function shareBraidCard(
  m: Interpretation,
): Promise<"shared" | "cancelled" | "downloaded"> {
  const blob = await getShareCardBlob(m);
  const filename = shareCardFilename(m);
  const braidName = m.primary ? m.primary.name : "my braid";
  const shareText = `I'm ${braidName} on The Genius Index. Find your braid: ${SHARE_URL} #GeniusIndex`;
  try {
    const file = new File([blob], filename, { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "My Genius Index Braid",
        text: shareText,
      });
      return "shared";
    }
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") return "cancelled";
  }
  triggerBlobDownload(blob, filename);
  return "downloaded";
}
