/**
 * ProblemSection — Establish the problem with asymmetric editorial layout
 * Dark Alchemy design: cinematic, emotional weight, narrative tension
 * Uses the 3x3 grid as visual grammar
 */

import { useEffect, useRef } from "react";
import DomainGlyph, { type DomainGlyphId } from "./DomainGlyph";

// The nine domains' book glyphs, in the book's row order (SOMA / MIND / FIELD)
// -- same 3x3 grid grammar as the logo and DomainsSection.
const DOMAIN_GLYPHS: DomainGlyphId[] = ["KIN", "SEN", "ADP", "ANL", "MEM", "GEN", "REL", "EXP", "PER"];

export default function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "oklch(0.10 0.008 285)",
        padding: "8rem 2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background glow */}
      <div
        className="absolute"
        style={{
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          background: "radial-gradient(ellipse at center, oklch(0.72 0.14 75 / 4%) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 10 }}>

        {/* Asymmetric layout: left content, right grid visualization */}
        <div className="problem-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>

          {/* LEFT: Content */}
          <div>
            <div
              className="reveal"
              style={{
                transitionDelay: "100ms",
                marginBottom: "2rem",
              }}
            >
              <p
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "oklch(0.72 0.14 75)",
                  marginBottom: "1.5rem",
                }}
              >
                The Problem
              </p>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  lineHeight: 1.1,
                  color: "oklch(0.92 0.02 80)",
                  marginBottom: "1.5rem",
                }}
              >
                Somewhere in History
              </h2>
            </div>

            {/* Problem statement */}
            <div
              className="reveal"
              style={{
                transitionDelay: "200ms",
                background: "oklch(0.13 0.008 285)",
                border: "1px solid oklch(1 0 0 / 8%)",
                borderLeft: "3px solid oklch(0.72 0.14 75)",
                borderRadius: "2px",
                padding: "2rem",
                marginBottom: "2rem",
              }}
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: "1.3rem",
                  lineHeight: 1.7,
                  color: "oklch(0.72 0.14 75)",
                  margin: 0,
                }}
              >
                Someone as brilliant as Einstein died unnoticed.
              </p>
            </div>

            {/* Three problems as numbered list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                { num: "01", title: "Schools Measure the Wrong Intelligence", desc: "IQ tests rank you against everyone else on one axis. They miss 80% of how human ability actually works." },
                { num: "02", title: "Employers Hire for the Wrong Things", desc: "They look for credentials and experience. They miss the specific capacity that would make you rare." },
                { num: "03", title: "Culture Celebrates the Wrong People", desc: "We mythologize the 1% while billions operate below their actual capacity." },
              ].map((item, i) => (
                <div
                  key={item.num}
                  className="reveal"
                  style={{
                    transitionDelay: `${300 + i * 100}ms`,
                    display: "flex",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 900,
                      fontSize: "1.8rem",
                      color: "oklch(0.72 0.14 75 / 20%)",
                      lineHeight: 1,
                      minWidth: "50px",
                    }}
                  >
                    {item.num}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "oklch(0.88 0.02 80)",
                        marginBottom: "0.5rem",
                        lineHeight: 1.2,
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Lato', sans-serif",
                        fontSize: "0.85rem",
                        lineHeight: 1.6,
                        color: "oklch(0.55 0.01 285)",
                        margin: 0,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Visual grid representation */}
          <div
            className="reveal"
            style={{
              transitionDelay: "250ms",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              paddingTop: "2rem",
            }}
          >
            {/* 3x3 Grid visualization */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "8px",
                marginBottom: "2rem",
              }}
            >
              {DOMAIN_GLYPHS.map((domain, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: "1",
                    background: "oklch(0.15 0.008 285)",
                    border: "1px solid oklch(1 0 0 / 10%)",
                    borderRadius: "3px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "oklch(0.72 0.14 75)",
                  }}
                >
                  <DomainGlyph domain={domain} size={28} />
                </div>
              ))}
            </div>

            {/* Insight box */}
            <div
              style={{
                background: "oklch(0.15 0.008 285)",
                border: "1px solid oklch(0.72 0.14 75 / 20%)",
                borderRadius: "3px",
                padding: "2rem",
              }}
            >
              <p
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "oklch(0.72 0.14 75)",
                  marginBottom: "1rem",
                }}
              >
                The Result
              </p>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                  color: "oklch(0.92 0.02 80)",
                  margin: 0,
                }}
              >
                Billions of people operating below their actual capacity, never knowing what they were built to do.
              </p>
            </div>

            {/* Solution hint */}
            <div
              style={{
                background: "oklch(0.72 0.14 75 / 8%)",
                border: "1px solid oklch(0.72 0.14 75 / 20%)",
                borderRadius: "3px",
                padding: "1.5rem",
              }}
            >
              <p
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "0.85rem",
                  lineHeight: 1.7,
                  color: "oklch(0.72 0.14 75)",
                  margin: 0,
                }}
              >
                This book introduces a rigorous system for finding the specific genius you already carry — and then amplifying it.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive: stack on mobile.
          NOTE: this used to target div[style*="gridTemplateColumns: 1fr 1fr"], but
          React serializes inline styles as kebab-case ("grid-template-columns"),
          so that attribute selector never matched anything and this layout never
          actually collapsed on phones. Fixed by targeting a real class name. */}
      <style>{`
        @media (max-width: 768px) {
          .problem-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
