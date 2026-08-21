/**
 * QuoteSection — Interstitial full-bleed quote section
 * Dark Alchemy design: cinematic, gold text, grid texture
 */

import { useEffect, useRef } from "react";

export default function QuoteSection() {
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
      { threshold: 0.3 }
    );
    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        padding: "8rem 0",
        overflow: "hidden",
        background: "var(--print-100)",
      }}
    >
      {/* Background texture: the Genius Grid rendered as a repeating CSS pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgb(194 122 12 / 20%) 1px, transparent 1px),
            linear-gradient(90deg, rgb(194 122 12 / 20%) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.15,
        }}
      />
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgb(239 240 235 / 80%)",
        }}
      />

      <div className="container relative z-10 text-center">
        {/* Decorative grid */}
        <div
          className="reveal flex justify-center mb-10"
          style={{ transitionDelay: "100ms" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "4px",
              width: "40px",
              opacity: 0.6,
            }}
          >
            {[0,1,2,3,4,5,6,7,8].map(i => (
              <div
                key={i}
                style={{
                  aspectRatio: "1",
                  background: i === 2 ? "var(--accent)" : "var(--rule)",
                  borderRadius: "1px",
                }}
              />
            ))}
          </div>
        </div>

        <blockquote
          className="reveal"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(1.4rem, 3.5vw, 2.8rem)",
            lineHeight: 1.4,
            color: "var(--fg)",
            maxWidth: "800px",
            margin: "0 auto 2rem",
            transitionDelay: "200ms",
          }}
        >
          "The secret waits for eyes unclouded by longing;{" "}
          <em style={{ color: "var(--accent)" }}>
            those bound by desire see only what the hands can hold.
          </em>"
        </blockquote>

        <p
          className="reveal"
          style={{
            fontFamily: "'Newsreader', sans-serif",
            fontWeight: 700,
            fontSize: "0.95rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--print-500)",
            transitionDelay: "350ms",
          }}
        >
          — After Lao Tzu, Tao Te Ching, Chapter 1
        </p>

        <div
          className="reveal flex justify-center mt-10"
          style={{ transitionDelay: "450ms" }}
        >
          <div className="gold-rule w-24" />
        </div>
      </div>
    </section>
  );
}
