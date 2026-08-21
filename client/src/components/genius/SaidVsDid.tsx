/* "You said / you did" — a dumbbell chart of Stream A (self-report) against
   Stream B (measured performance) per domain. This is the instrument's most
   interesting finding made visible: the unclaimed gap. Token-compliant per
   VDC §2.6 — performance (the rediscovered record) is the amber primary
   series; self-report is print grey; skipped stations are marked, not drawn.
   Pure inline SVG, no library. */

import { DOMAINS } from "@/lib/genius/data/domains";
import type { Interpretation } from "@/lib/genius/engine/interpret";

const W = 640;
const ROW_H = 34;
const PAD_L = 96;
const PAD_R = 60;
const PLOT_W = W - PAD_L - PAD_R;

const AMBER = "#995D08";
const GREY = "#8C9184";
const CONNECT = "#B4B8AC";
const INK = "#0A0907";
const MUTED = "#4F5349";

export default function SaidVsDid({ m }: { m: Interpretation }) {
  const rows = m.sorted.filter((d) => !m.R[d.id].skipped);
  const skipped = m.sorted.filter((d) => m.R[d.id].skipped);
  const H = rows.length * ROW_H + 46;
  const x = (v: number) => PAD_L + (Math.max(0, Math.min(100, v)) / 100) * PLOT_W;

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Self-report versus measured performance, per domain"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        {/* scale gridlines */}
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line
              x1={x(v)}
              y1={8}
              x2={x(v)}
              y2={H - 38}
              stroke="#D2D5CB"
              strokeWidth={v === 0 || v === 100 ? 1.2 : 0.6}
            />
            <text
              x={x(v)}
              y={H - 24}
              textAnchor="middle"
              fontFamily="IBM Plex Mono,monospace"
              fontSize="10"
              fill={MUTED}
            >
              {v}
            </text>
          </g>
        ))}
        {rows.map((d, i) => {
          const y = 20 + i * ROW_H;
          const a = m.R[d.id].A;
          const b = m.R[d.id].B;
          const gap = Math.round(b - a);
          const unclaimed = gap >= 30;
          const aspirational = gap <= -30;
          return (
            <g key={d.id}>
              <text
                x={PAD_L - 10}
                y={y + 4}
                textAnchor="end"
                fontFamily="Newsreader,serif"
                fontSize="13"
                fontWeight={unclaimed ? 700 : 400}
                fill={INK}
              >
                {d.name}
              </text>
              <line
                x1={x(Math.min(a, b))}
                y1={y}
                x2={x(Math.max(a, b))}
                y2={y}
                stroke={unclaimed || aspirational ? AMBER : CONNECT}
                strokeWidth={unclaimed || aspirational ? 2.4 : 1.6}
                strokeOpacity={unclaimed || aspirational ? 0.85 : 1}
              />
              {/* A · said */}
              <circle
                cx={x(a)}
                cy={y}
                r={6}
                fill="#EFF0EB"
                stroke={GREY}
                strokeWidth={2}
              />
              {/* B · did */}
              <circle cx={x(b)} cy={y} r={6.5} fill={AMBER} />
              {(unclaimed || aspirational) && (
                <text
                  x={x(Math.max(a, b)) + 12}
                  y={y + 4}
                  fontFamily="IBM Plex Mono,monospace"
                  fontSize="10.5"
                  fontWeight={600}
                  fill={AMBER}
                >
                  {gap > 0 ? `+${gap}` : gap}
                </text>
              )}
            </g>
          );
        })}
        {/* legend */}
        <g transform={`translate(${PAD_L}, ${H - 8})`}>
          <circle cx={4} cy={-3} r={5} fill="#EFF0EB" stroke={GREY} strokeWidth={2} />
          <text x={14} y={0} fontFamily="IBM Plex Mono,monospace" fontSize="10" fill={MUTED}>
            YOU SAID (REPORT)
          </text>
          <circle cx={160} cy={-3} r={5.5} fill={AMBER} />
          <text x={170} y={0} fontFamily="IBM Plex Mono,monospace" fontSize="10" fill={MUTED}>
            YOU DID (PERFORMANCE)
          </text>
        </g>
      </svg>
      {skipped.length > 0 && (
        <p className="small" style={{ color: "var(--book-dim)", marginTop: 6 }}>
          Not drawn (station skipped): {skipped.map((d) => d.name).join(", ")}.
        </p>
      )}
    </div>
  );
}
