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
        background: "oklch(0.08 0.008 285)",
      }}
    >
      {/* Background texture: the Genius Grid rendered as a repeating CSS pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.72 0.14 75 / 20%) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.72 0.14 75 / 20%) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.15,
        }}
      />
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "oklch(0.08 0.008 285 / 80%)",
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
                  background: i === 2 ? "oklch(0.72 0.14 75)" : "oklch(0.25 0.008 285)",
                  borderRadius: "1px",
                }}
              />
            ))}
          </div>
        </div>

        <blockquote
          className="reveal"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(1.4rem, 3.5vw, 2.8rem)",
            lineHeight: 1.4,
            color: "oklch(0.92 0.02 80)",
            maxWidth: "800px",
            margin: "0 auto 2rem",
            transitionDelay: "200ms",
          }}
        >
          "The secret waits for eyes unclouded by longing;{" "}
          <em style={{ color: "oklch(0.72 0.14 75)" }}>
            those bound by desire see only what the hands can hold.
          </em>"
        </blockquote>

        <p
          className="reveal"
          style={{
            fontFamily: "'Lato', sans-serif",
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "oklch(0.50 0.01 285)",
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
