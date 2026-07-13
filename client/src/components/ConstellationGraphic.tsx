/**
 * ConstellationGraphic — the book's Braid Constellations figure, static
 * (no personal scores). Nine domains on a wheel under three realm arcs;
 * all thirty-six braid chords drawn faint, the Canonical Ten drawn bold
 * in gold. Same geometry/order as the assessment's personalized wheel,
 * so the two stay visually consistent across both sites.
 */

const DOMAINS = [
  { id: "KIN", code: "KI", name: "Kinetic", realm: "soma" },
  { id: "SEN", code: "SE", name: "Sensory", realm: "soma" },
  { id: "ADP", code: "AD", name: "Adaptive", realm: "soma" },
  { id: "ANL", code: "AN", name: "Analytic", realm: "mind" },
  { id: "MEM", code: "ME", name: "Mnemonic", realm: "mind" },
  { id: "GEN", code: "GE", name: "Generative", realm: "mind" },
  { id: "REL", code: "RE", name: "Relational", realm: "field" },
  { id: "EXP", code: "EX", name: "Expressive", realm: "field" },
  { id: "PER", code: "PE", name: "Perceptive", realm: "field" },
] as const;

const REALM_HEX: Record<string, string> = { soma: "#8C3B2E", mind: "#54687C", field: "#4E6156" };
const GOLD = "#CC9E3F";

// The Canonical Ten (drawn in gold), from the book's Field Guide.
const CANONICAL_TEN: Array<[string, string, string]> = [
  ["KIN", "SEN", "The Craftsman"],
  ["KIN", "EXP", "The Performer"],
  ["SEN", "ANL", "The Connoisseur"],
  ["ANL", "EXP", "The Translator"],
  ["ANL", "PER", "The Diagnostician"],
  ["MEM", "REL", "The Connector"],
  ["GEN", "EXP", "The Storyteller"],
  ["REL", "EXP", "The Leader"],
  ["ADP", "EXP", "The Instrument"],
  ["PER", "EXP", "The Documentarian"],
];
const CANON_KEYS = new Set(CANONICAL_TEN.map(([a, b]) => [a, b].sort().join("|")));

// All 36 pairings (9 choose 2) -- the faint web behind the gold ten.
const ALL_PAIRS: Array<[string, string]> = [];
for (let i = 0; i < DOMAINS.length; i++) {
  for (let j = i + 1; j < DOMAINS.length; j++) {
    ALL_PAIRS.push([DOMAINS[i].id, DOMAINS[j].id]);
  }
}

const cx = 260, cy = 288, Rr = 158;
const ORDER = ["EXP", "PER", "KIN", "SEN", "ADP", "ANL", "MEM", "GEN", "REL"];
const angleOf: Record<string, number> = {};
ORDER.forEach((id, i) => { angleOf[id] = -90 + i * 40; });

function polar(r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
function arcPath(r: number, a0: number, a1: number): string {
  const [x0, y0] = polar(r, a0);
  const [x1, y1] = polar(r, a1);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

const pos: Record<string, [number, number]> = {};
ORDER.forEach(id => { pos[id] = polar(Rr, angleOf[id]); });

export default function ConstellationGraphic() {
  return (
    <div style={{ width: "100%", maxWidth: "520px", margin: "0 auto" }}>
      <svg viewBox="0 0 520 560" role="img" aria-label="The Braid Constellation: nine domains and the Canonical Ten braids">
        {/* Realm arcs */}
        <path d={arcPath(Rr + 36, -30, 90)} fill="none" stroke={REALM_HEX.soma} strokeWidth="6" strokeOpacity="0.7" strokeLinecap="round" />
        <path d={arcPath(Rr + 36, 90, 210)} fill="none" stroke={REALM_HEX.mind} strokeWidth="6" strokeOpacity="0.7" strokeLinecap="round" />
        <path d={arcPath(Rr + 36, 210, 330)} fill="none" stroke={REALM_HEX.field} strokeWidth="6" strokeOpacity="0.7" strokeLinecap="round" />
        {(() => {
          const [sx, sy] = polar(Rr + 56, 30);
          const [mx, my] = polar(Rr + 56, 150);
          const [fx, fy] = polar(Rr + 56, 270);
          return (
            <>
              <text x={sx} y={sy + 5} textAnchor="middle" fontFamily="Lato, sans-serif" fontSize="13" fontWeight={700} letterSpacing="2.5" fill={REALM_HEX.soma}>SOMA</text>
              <text x={mx} y={my + 5} textAnchor="middle" fontFamily="Lato, sans-serif" fontSize="13" fontWeight={700} letterSpacing="2.5" fill={REALM_HEX.mind}>MIND</text>
              <text x={fx} y={fy + 5} textAnchor="middle" fontFamily="Lato, sans-serif" fontSize="13" fontWeight={700} letterSpacing="2.5" fill={REALM_HEX.field}>FIELD</text>
            </>
          );
        })()}

        {/* Faint web: all 36 pairings */}
        {ALL_PAIRS.filter(([a, b]) => !CANON_KEYS.has([a, b].sort().join("|"))).map(([a, b]) => {
          const [x0, y0] = pos[a], [x1, y1] = pos[b];
          return <line key={`${a}-${b}`} x1={x0} y1={y0} x2={x1} y2={y1} stroke="#8C7E69" strokeWidth={1} strokeOpacity={0.22} strokeLinecap="round" />;
        })}

        {/* The Canonical Ten, bold gold */}
        {CANONICAL_TEN.map(([a, b, name]) => {
          const [x0, y0] = pos[a], [x1, y1] = pos[b];
          return <line key={`${a}-${b}-canon`} x1={x0} y1={y0} x2={x1} y2={y1} stroke={GOLD} strokeWidth={2.5} strokeOpacity={0.85} strokeLinecap="round" aria-label={name} />;
        })}

        {/* Domain nodes */}
        {ORDER.map(id => {
          const d = DOMAINS.find(dm => dm.id === id)!;
          const [x, y] = pos[id];
          const col = REALM_HEX[d.realm];
          return (
            <g key={id}>
              <circle cx={x} cy={y} r={24} fill={col} fillOpacity={0.22} stroke={col} strokeWidth={1.5} />
              <text x={x} y={y + 1} textAnchor="middle" fontFamily="Playfair Display, serif" fontWeight={700} fontSize="13" fill={col}>{d.code}</text>
              <text x={x} y={y + 14} textAnchor="middle" fontFamily="Lato, sans-serif" fontSize="8" fontWeight={700} letterSpacing="0.5" fill="oklch(0.60 0.01 285)">{d.name.toUpperCase()}</text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "'Lato', sans-serif", fontSize: "0.7rem", letterSpacing: "0.04em", color: "oklch(0.60 0.01 285)" }}>
          <i style={{ width: 14, height: 3, background: GOLD, borderRadius: 2, display: "inline-block" }} />
          The Canonical Ten
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "'Lato', sans-serif", fontSize: "0.7rem", letterSpacing: "0.04em", color: "oklch(0.50 0.01 285)" }}>
          <i style={{ width: 14, height: 1, background: "#8C7E69", opacity: 0.5, display: "inline-block" }} />
          The other twenty-six
        </span>
      </div>
    </div>
  );
}
