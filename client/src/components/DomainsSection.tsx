/**
 * DomainsSection — The Nine Domains of Genius
 * ENHANCED: Interactive grid with hover illumination, domain details, and cinematic effects
 * Dark Alchemy design: 3x3 interactive grid, each cell becomes a discovery moment
 */

import { useEffect, useRef, useState } from "react";

const DOMAINS = [
  {
    id: 1,
    name: "Kinetic",
    family: "SOMA",
    familyLabel: "The Body",
    tagline: "Movement",
    description: "Learns, keeps, and reproduces movement faster and cleaner than baseline. The body that owns a motion after one glance.",
    sign: "Picks up any physical skill faster than the room",
    color: "var(--accent)",
  },
  {
    id: 2,
    name: "Sensory",
    family: "SOMA",
    familyLabel: "The Body",
    tagline: "Signal",
    description: "Perceptual acuity — the ear, eye, palate, nose that resolves what others cannot. Detects and discriminates signal at high resolution.",
    sign: "Catches the flat note, the missing ingredient, the wrong shade",
    color: "var(--accent)",
  },
  {
    id: 3,
    name: "Adaptive",
    family: "SOMA",
    familyLabel: "The Body",
    tagline: "Capacity",
    description: "Outlier physiological capacity — range, endurance, recovery, tolerance in the body's hardware itself.",
    sign: "Outlasts, outranges, or outrecovers the room",
    color: "var(--accent)",
  },
  {
    id: 4,
    name: "Analytic",
    family: "MIND",
    familyLabel: "Thought",
    tagline: "Pattern",
    description: "Pattern extraction and system decomposition — the mind that finds structure in complexity. A head for numbers, systems, and logic.",
    sign: "Sees the structure others miss; solves by decomposing",
    color: "var(--accent)",
  },
  {
    id: 5,
    name: "Mnemonic",
    family: "MIND",
    familyLabel: "Thought",
    tagline: "Retention",
    description: "Retention and retrieval — the memory that holds and returns what others lose. The mind that never forgets a face, a fact, a feeling.",
    sign: "Recalls details others lost before they left the room",
    color: "var(--accent)",
  },
  {
    id: 6,
    name: "Generative",
    family: "MIND",
    familyLabel: "Thought",
    tagline: "Combination",
    description: "Novel combination — the mind that produces ideas in quantity and range. A fountain of ideas, connections, and creative leaps.",
    sign: "Produces more ideas in ten minutes than the group does in an hour",
    color: "var(--accent)",
  },
  {
    id: 7,
    name: "Relational",
    family: "FIELD",
    familyLabel: "The Between",
    tagline: "People",
    description: "Reading and moving people — the accurate, rapid read of another's state and want. Good with people is an understatement.",
    sign: "Reads the room before a word is spoken",
    color: "var(--accent)",
  },
  {
    id: 8,
    name: "Expressive",
    family: "FIELD",
    familyLabel: "The Between",
    tagline: "Voice",
    description: "Expression and transmission — the voice, the pen, the body that carries an idea and makes it land. The speaker, the writer, the performer.",
    sign: "Makes the complex simple; makes the simple matter",
    color: "var(--accent)",
  },
  {
    id: 9,
    name: "Perceptive",
    family: "FIELD",
    familyLabel: "The Between",
    tagline: "Meaning",
    description: "Meaning-making and interpretation — the mind that finds significance in pattern and symbol. Sees what things mean before others see what they are.",
    sign: "Understands the subtext before the text is done",
    color: "var(--accent)",
  },
];

export default function DomainsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="domains"
      ref={sectionRef}
      style={{
        background: "var(--bg-raised)",
        padding: "6rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background glow */}
      <div
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "600px",
          background: "radial-gradient(ellipse at center, rgb(194 122 12 / 5%) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container relative z-10">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="reveal flex items-center gap-3 mb-6">
            <div className="gold-rule w-12" />
            <span className="section-label">The Nine Domains</span>
          </div>
          <h2
            className="reveal"
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.1,
              color: "var(--fg)",
              marginBottom: "1.25rem",
              transitionDelay: "100ms",
            }}
          >
            Every Talent Maps Here
          </h2>
          <p
            className="reveal"
            style={{
              fontFamily: "'Newsreader', sans-serif",
              fontSize: "1.125rem",
              lineHeight: 1.8,
              color: "var(--fg-muted)",
              maxWidth: "560px",
              transitionDelay: "200ms",
            }}
          >
            Nine distinct forms of genius, organized into three families. Hover over any domain to explore it.
          </p>
        </div>

        {/* Grid left-aligned, detail panel to its right, vertically centered
            against the (taller) grid -- stacks on mobile. */}
        <div className="reveal grid lg:grid-cols-2 gap-12 items-center mb-12" style={{ transitionDelay: "300ms" }}>

        {/* 3x3 Interactive Grid -- always exactly three columns (SOMA / MIND / FIELD
            rows), matching the book's grid. "auto-fit, minmax(200px,1fr)" used to let
            wide viewports wrap to 4 columns, leaving a lopsided 4+4+1 last row. */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            maxWidth: "480px",
          }}
        >
          {DOMAINS.map((domain, idx) => (
            <div
              key={domain.id}
              role="button"
              tabIndex={0}
              aria-expanded={hoveredId === domain.id}
              aria-label={`${domain.name} — ${domain.familyLabel}`}
              style={{
                aspectRatio: "1",
                background: hoveredId === domain.id ? "var(--accent)" : "var(--print-200)",
                border: hoveredId === domain.id
                  ? "2px solid var(--accent)"
                  : "1px solid rgb(10 9 7 / 10%)",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 300ms cubic-bezier(0.23, 1, 0.32, 1)",
                boxShadow: hoveredId === domain.id
                  ? `0 0 40px rgb(194 122 12 / 40%), inset 0 0 30px rgb(194 122 12 / 15%)`
                  : "none",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={() => setHoveredId(domain.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(domain.id)}
              onBlur={() => setHoveredId(null)}
              onClick={() => setHoveredId(domain.id)}
            >
              {/* Background glow on hover */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: hoveredId === domain.id
                    ? "radial-gradient(ellipse at center, rgb(194 122 12 / 20%) 0%, transparent 70%)"
                    : "transparent",
                  transition: "all 300ms ease",
                  pointerEvents: "none",
                }}
              />

              {/* Content */}
              <div
                style={{
                  textAlign: "center",
                  position: "relative",
                  zIndex: 10,
                  opacity: hoveredId === domain.id ? 1 : 0.7,
                  transition: "opacity 300ms ease",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontWeight: 700,
                    fontSize: "1.3rem",
                    color: hoveredId === domain.id ? "var(--bg)" : "var(--fg)",
                    marginBottom: "0.25rem",
                    transition: "color 300ms ease",
                  }}
                >
                  {domain.name}
                </div>
                <div
                  style={{
                    fontFamily: "'Newsreader', sans-serif",
                    fontSize: "0.95rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: hoveredId === domain.id ? "oklch(0.15 0.008 285 / 70%)" : "var(--print-500)",
                    transition: "color 300ms ease",
                  }}
                >
                  {domain.tagline}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel -- to the grid's right on desktop, below it on mobile
            (grid lg:grid-cols-2 above stacks single-column below "lg"). */}
        {hoveredId ? (
          <div
            style={{
              background: "var(--print-200)",
              border: "1px solid rgb(194 122 12 / 30%)",
              borderRadius: "3px",
              padding: "2.5rem",
              animation: "slideIn 300ms cubic-bezier(0.23, 1, 0.32, 1)",
            }}
          >
            {(() => {
              const domain = DOMAINS.find(d => d.id === hoveredId);
              if (!domain) return null;

              return (
                <>
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          background: "var(--accent)",
                          borderRadius: "3px",
                        }}
                      />
                      <div>
                        <h3
                          style={{
                            fontFamily: "'Instrument Serif', serif",
                            fontWeight: 700,
                            fontSize: "1.4rem",
                            color: "var(--fg)",
                            lineHeight: 1,
                          }}
                        >
                          {domain.name}
                        </h3>
                        <p
                          style={{
                            fontFamily: "'Newsreader', sans-serif",
                            fontSize: "1rem",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: "var(--accent)",
                          }}
                        >
                          {domain.familyLabel}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="gold-rule mb-4" />

                  <p
                    style={{
                      fontFamily: "'Newsreader', sans-serif",
                      fontSize: "1.0625rem",
                      lineHeight: 1.8,
                      color: "var(--fg-muted)",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {domain.description}
                  </p>

                  <div
                    style={{
                      background: "var(--bg)",
                      borderLeft: "3px solid var(--accent)",
                      padding: "1rem 1.25rem",
                      borderRadius: "2px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Instrument Serif', serif",
                        fontStyle: "italic",
                        fontSize: "1.0625rem",
                        lineHeight: 1.6,
                        color: "var(--accent)",
                      }}
                    >
                      "{domain.sign}"
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        ) : (
          <div
            style={{
              background: "var(--bg)",
              border: "1px dashed rgb(10 9 7 / 12%)",
              borderRadius: "3px",
              padding: "2.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "220px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: "1.25rem",
                color: "var(--print-500)",
              }}
            >
              Hover — or tab to — a domain to explore it.
            </p>
          </div>
        )}

        </div>

        {/* Bottom note */}
        <div
          className="reveal mt-12 text-center"
          style={{ transitionDelay: "500ms" }}
        >
          <p
            style={{
              fontFamily: "'Newsreader', sans-serif",
              fontSize: "1rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--print-500)",
            }}
          >
            Explore each domain — your genius is here
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
