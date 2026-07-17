/**
 * DiagramsSection — Original diagrams worthy of printing
 * Dark Alchemy design: premium presentation of intellectual assets
 */

import { useEffect, useRef } from "react";

const IMG_BASE = import.meta.env.BASE_URL;
const DIAGRAM_URLS = [
  { name: "The Nine Domains: Three Families", url: `${IMG_BASE}images/diagram-nine-domains.svg`, desc: "The same nine domains from the chart above, laid out as a single printable reference page for your wall or your notes." },
  { name: "From Signature to Braid", url: `${IMG_BASE}images/diagram-signature-braid.svg`, desc: "How your Genius Signature combines with a second domain to create rarity through combination, not competition" },
  { name: "The Amplification Protocol", url: `${IMG_BASE}images/diagram-amplification-protocol.svg`, desc: "The 30-day development process: Awareness → Assessment → Practice → Integration → Mastery" },
];

export default function DiagramsSection() {
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
      { threshold: 0.05, rootMargin: "0px 0px -60px 0px" }
    );
    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ background: "oklch(0.12 0.008 285)", padding: "6rem 0" }}
    >
      <div className="container">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="reveal flex items-center gap-3 mb-6">
            <div className="gold-rule w-12" />
            <span className="section-label">Visual Framework</span>
          </div>
          <h2
            className="reveal"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.1,
              color: "oklch(0.92 0.02 80)",
              marginBottom: "1.25rem",
              transitionDelay: "100ms",
            }}
          >
            Diagrams Worth Printing
          </h2>
          <p
            className="reveal"
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: "1rem",
              lineHeight: 1.8,
              color: "oklch(0.60 0.01 285)",
              maxWidth: "560px",
              transitionDelay: "200ms",
            }}
          >
            The Genius Index is built on visual thinking. Each diagram below represents a core concept — designed to be understood at a glance and remembered for years.
          </p>
        </div>

        {/* Diagrams grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {DIAGRAM_URLS.map((diagram, i) => (
            <div
              key={diagram.name}
              className="reveal"
              style={{
                transitionDelay: `${300 + i * 100}ms`,
                background: "oklch(0.10 0.008 285)",
                border: "1px solid oklch(1 0 0 / 8%)",
                borderRadius: "3px",
                overflow: "hidden",
                transition: "all 300ms ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.72 0.14 75 / 30%)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px oklch(0 0 0 / 40%)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "oklch(1 0 0 / 8%)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Diagram image */}
              <div
                style={{
                  background: "oklch(0.08 0.008 285)",
                  padding: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "240px",
                }}
              >
                <img
                  src={diagram.url}
                  alt={diagram.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "240px",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* Caption */}
              <div style={{ padding: "1.5rem" }}>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    color: "oklch(0.88 0.02 80)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {diagram.name}
                </h3>
                <p
                  style={{
                    fontFamily: "'Lato', sans-serif",
                    fontSize: "0.85rem",
                    lineHeight: 1.6,
                    color: "oklch(0.55 0.01 285)",
                  }}
                >
                  {diagram.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div
          className="reveal mt-12 text-center"
          style={{ transitionDelay: "800ms" }}
        >
          <p
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "oklch(0.50 0.01 285)",
            }}
          >
            Each diagram is included in the book and available as high-resolution prints
          </p>
        </div>
      </div>
    </section>
  );
}
