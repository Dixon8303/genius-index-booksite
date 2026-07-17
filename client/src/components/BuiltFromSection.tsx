/**
 * BuiltFromSection — Intellectual Authority
 * Asymmetric editorial layout with grid-based visual identity
 */

import { useEffect, useRef } from "react";

const DISCIPLINES = [
  { name: "Systems Thinking", desc: "How complex systems organize and evolve" },
  { name: "Behavioral Science", desc: "How humans actually make decisions and learn" },
  { name: "Neuroscience", desc: "The biological basis of different types of ability" },
  { name: "History", desc: "How genius has been recognized (and misrecognized) across eras" },
  { name: "Information Architecture", desc: "How to structure knowledge so it's discoverable" },
  { name: "Film & Narrative", desc: "How to communicate complex ideas clearly" },
];

export default function BuiltFromSection() {
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
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "oklch(0.13 0.008 285)",
        padding: "6rem 2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 10 }}>

        {/* Header with grid accent */}
        <div className="reveal" style={{ transitionDelay: "100ms", marginBottom: "4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div className="gold-rule w-12" />
            <span className="section-label">Built From</span>
          </div>
          <h2
            aria-label="Six Disciplines, One Framework"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.1,
              color: "oklch(0.92 0.02 80)",
              marginBottom: "1.25rem",
            }}
          >
            <span aria-hidden="true">
              Six Disciplines,<br />
              One Framework
            </span>
          </h2>
        </div>

        {/* Asymmetric layout: left text, right grid */}
        <div className="builtfrom-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>

          {/* LEFT: Intro text + quote */}
          <div>
            <p
              className="reveal"
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "oklch(0.60 0.01 285)",
                marginBottom: "2rem",
                transitionDelay: "200ms",
              }}
            >
              The Genius Index is not a psychology test. It draws from six distinct fields, each contributing essential perspective to understanding human ability.
            </p>

            <div
              className="reveal"
              style={{
                background: "oklch(0.10 0.008 285)",
                border: "1px solid oklch(0.72 0.14 75 / 20%)",
                borderRadius: "3px",
                padding: "2rem",
                transitionDelay: "300ms",
              }}
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  color: "oklch(0.72 0.14 75)",
                  margin: 0,
                }}
              >
                "The framework is only as rigorous as its foundations. Each discipline brings a different lens to the same question: How does human ability actually work?"
              </p>
            </div>
          </div>

          {/* RIGHT: Disciplines in grid format */}
          <div
            className="reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1.5rem",
              transitionDelay: "250ms",
            }}
          >
            {DISCIPLINES.map((discipline, i) => (
              <div
                key={discipline.name}
                style={{
                  background: "oklch(0.10 0.008 285)",
                  border: "1px solid oklch(1 0 0 / 8%)",
                  borderTop: "2px solid oklch(0.72 0.14 75)",
                  borderRadius: "2px",
                  padding: "1.5rem",
                  position: "relative",
                }}
              >
                {/* Index number */}
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 900,
                    fontSize: "1.8rem",
                    color: "oklch(0.72 0.14 75 / 12%)",
                    lineHeight: 1,
                    marginBottom: "0.75rem",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: "oklch(0.88 0.02 80)",
                    marginBottom: "0.5rem",
                    lineHeight: 1.2,
                  }}
                >
                  {discipline.name}
                </h3>

                <p
                  style={{
                    fontFamily: "'Lato', sans-serif",
                    fontSize: "0.75rem",
                    lineHeight: 1.5,
                    color: "oklch(0.55 0.01 285)",
                    margin: 0,
                  }}
                >
                  {discipline.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive (see ProblemSection for why this targets a class, not an
          inline-style attribute selector). */}
      <style>{`
        @media (max-width: 768px) {
          .builtfrom-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
