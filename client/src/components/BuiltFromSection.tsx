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
        background: "var(--print-200)",
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
              fontFamily: "'Instrument Serif', serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.1,
              color: "var(--fg)",
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
                fontFamily: "'Newsreader', sans-serif",
                fontSize: "1.125rem",
                lineHeight: 1.8,
                color: "var(--fg-muted)",
                marginBottom: "2rem",
                transitionDelay: "200ms",
              }}
            >
              The Genius Index is not a psychology test. It draws from six distinct fields, each contributing essential perspective to understanding human ability.
            </p>

            <div
              className="reveal"
              style={{
                background: "var(--bg)",
                border: "1px solid rgb(194 122 12 / 20%)",
                borderRadius: "3px",
                padding: "2rem",
                transitionDelay: "300ms",
              }}
            >
              <p
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontSize: "1.1875rem",
                  lineHeight: 1.7,
                  color: "var(--accent)",
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
                  background: "var(--bg)",
                  border: "1px solid rgb(10 9 7 / 8%)",
                  borderTop: "2px solid var(--accent)",
                  borderRadius: "2px",
                  padding: "1.5rem",
                  position: "relative",
                }}
              >
                {/* Index number */}
                <div
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontWeight: 900,
                    fontSize: "1.8rem",
                    color: "var(--accent-fill)",
                    lineHeight: 1,
                    marginBottom: "0.75rem",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                <h3
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontWeight: 600,
                    fontSize: "1.0625rem",
                    color: "var(--fg)",
                    marginBottom: "0.5rem",
                    lineHeight: 1.2,
                  }}
                >
                  {discipline.name}
                </h3>

                <p
                  style={{
                    fontFamily: "'Newsreader', sans-serif",
                    fontSize: "0.85rem",
                    lineHeight: 1.5,
                    color: "var(--fg-muted)",
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
