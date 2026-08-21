/* Score trend across retakes — token-compliant inline SVG replacing the
   recharts dependency (VDC §8 JS budget; §2.6 closed palette — series use
   the amendment A1 realm tokens). */

import { DOMAINS, type DomainId } from "@/lib/genius/data/domains";
import { realmHex } from "@/lib/genius/viz/builders";

export interface TrendPoint {
  date: string;
  scores: Partial<Record<DomainId, number>>;
}

const W = 640;
const H = 280;
const PAD = { l: 34, r: 14, t: 12, b: 34 };

export default function TrendChart({
  data,
  selected,
}: {
  data: TrendPoint[];
  selected: Set<DomainId>;
}) {
  const iw = W - PAD.l - PAD.r;
  const ih = H - PAD.t - PAD.b;
  const x = (i: number) =>
    PAD.l + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw);
  const y = (v: number) => PAD.t + (1 - v / 100) * ih;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Domain scores across your runs"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {[0, 25, 50, 75, 100].map((v) => (
        <g key={v}>
          <line x1={PAD.l} y1={y(v)} x2={W - PAD.r} y2={y(v)} stroke="#D2D5CB" strokeWidth={v % 50 === 0 ? 1 : 0.5} />
          <text x={PAD.l - 6} y={y(v) + 3.5} textAnchor="end" fontFamily="IBM Plex Mono,monospace" fontSize="10" fill="#4F5349">
            {v}
          </text>
        </g>
      ))}
      {data.map((p, i) => (
        <text
          key={i}
          x={x(i)}
          y={H - 12}
          textAnchor="middle"
          fontFamily="IBM Plex Mono,monospace"
          fontSize="9.5"
          fill="#4F5349"
        >
          {p.date}
        </text>
      ))}
      {DOMAINS.filter((d) => selected.has(d.id)).map((d) => {
        const pts = data
          .map((p, i) => ({ i, v: p.scores[d.id] }))
          .filter((p): p is { i: number; v: number } => typeof p.v === "number");
        if (!pts.length) return null;
        const col = realmHex(d.meta);
        const path = pts
          .map((p, k) => `${k === 0 ? "M" : "L"}${x(p.i).toFixed(1)} ${y(p.v).toFixed(1)}`)
          .join(" ");
        return (
          <g key={d.id}>
            <path d={path} fill="none" stroke={col} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
            {pts.map((p) => (
              <circle key={p.i} cx={x(p.i)} cy={y(p.v)} r={3.6} fill={col} />
            ))}
            <text
              x={x(pts[pts.length - 1].i) + 6}
              y={y(pts[pts.length - 1].v) + 3.5}
              fontFamily="Newsreader,serif"
              fontSize="11.5"
              fontWeight={600}
              fill={col}
            >
              {d.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
