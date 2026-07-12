/**
 * BookSection — "What is The Genius Index?"
 * Dark Alchemy design: alternating layout, pull quote, four movements
 */

import { useEffect, useRef } from "react";

const FOUR_MOVEMENTS = [
  {
    step: "01",
    label: "Define",
    title: "Name What You Carry",
    body: "What cannot be defined cannot be measured. Part I makes the case for what genius actually is and lays out the nine domains across which human ability lives.",
  },
  {
    step: "02",
    label: "Measure",
    title: "Take the Index",
    body: "An instrument — right in these pages — that maps your profile across nine domains and defeats the flattery that keeps people lost. Your Genius Signature, named.",
  },
  {
    step: "03",
    label: "Manage",
    title: "Go Deep in Your Domain",
    body: "Nine chapters, one per domain. Each defines the gift precisely, separates folklore from truth, and gives you a thirty-day protocol to develop it.",
  },
  {
    step: "04",
    label: "Improve",
    title: "Braid and Amplify",
    body: "The activation work that turns a named gift into a lived one — and turns one gift into something far rarer by braiding it with another. Identify to amplify.",
  },
];

export default function BookSection() {
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
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="book"
      ref={sectionRef}
      style={{ background: "oklch(0.12 0.008 285)", padding: "6rem 0" }}
    >
      <div className="container">

        {/* Section header */}
        <div className="max-w-3xl mb-20">
          <div className="reveal flex items-center gap-3 mb-6">
            <div className="gold-rule w-12" />
            <span className="section-label">About the Book</span>
          </div>

          <h2
            className="reveal"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.1,
              color: "oklch(0.92 0.02 80)",
              marginBottom: "1.5rem",
              transitionDelay: "100ms",
            }}
          >
            A Mirror Clear Enough to Show You What You're Carrying
          </h2>

          <p
            className="reveal"
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: "1.05rem",
              lineHeight: 1.85,
              color: "oklch(0.65 0.01 285)",
              maxWidth: "600px",
              transitionDelay: "200ms",
            }}
          >
            The Genius Index is not a feel-good reframing. It is close to the opposite. The argument is demanding: you have a real, specific, uneven profile of ability. Some domains are genuinely yours and others genuinely are not. Pretending otherwise is exactly what keeps people from their gifts.
          </p>
        </div>

        {/* Pull quote */}
        <div
          className="reveal mb-20"
          style={{
            transitionDelay: "300ms",
            maxWidth: "680px",
          }}
        >
          <blockquote className="pull-quote">
            "A genius that is never named is never developed. It doesn't get mismeasured — it gets no measurement, no cultivation, no amplification. It simply idles, its owner assuming it's nothing."
          </blockquote>
          <p
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "oklch(0.50 0.01 285)",
              marginTop: "1rem",
              paddingLeft: "1.5rem",
            }}
          >
            — D. Antione Dixon, Introduction
          </p>
        </div>

        {/* Gold rule */}
        <div className="reveal gold-rule mb-20" style={{ transitionDelay: "350ms" }} />

        {/* Four Movements */}
        <div className="reveal mb-6" style={{ transitionDelay: "400ms" }}>
          <span className="section-label">The Four Movements</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0">
          {FOUR_MOVEMENTS.map((movement, i) => (
            <div
              key={movement.step}
              className="reveal"
              style={{
                transitionDelay: `${450 + i * 80}ms`,
                borderLeft: "1px solid oklch(1 0 0 / 8%)",
                padding: "2rem 1.75rem",
                position: "relative",
              }}
            >
              {/* Step number */}
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  fontSize: "3.5rem",
                  lineHeight: 1,
                  color: "oklch(0.72 0.14 75 / 15%)",
                  marginBottom: "1rem",
                  letterSpacing: "-0.04em",
                }}
              >
                {movement.step}
              </div>

              {/* Label */}
              <div
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "oklch(0.72 0.14 75)",
                  marginBottom: "0.75rem",
                }}
              >
                {movement.label}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  color: "oklch(0.88 0.02 80)",
                  marginBottom: "0.875rem",
                  lineHeight: 1.3,
                }}
              >
                {movement.title}
              </h3>

              {/* Body */}
              <p
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "0.9rem",
                  lineHeight: 1.75,
                  color: "oklch(0.58 0.01 285)",
                }}
              >
                {movement.body}
              </p>

              {/* Connector arrow (not on last) */}
              {i < 3 && (
                <div
                  className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10"
                  style={{
                    width: "8px",
                    height: "8px",
                    borderTop: "1px solid oklch(0.72 0.14 75 / 40%)",
                    borderRight: "1px solid oklch(0.72 0.14 75 / 40%)",
                    transform: "translateY(-50%) rotate(45deg)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Tagline */}
        <div
          className="reveal mt-12 flex items-center gap-4"
          style={{ transitionDelay: "800ms" }}
        >
          <div className="gold-rule w-12" />
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: "1.1rem",
              color: "oklch(0.72 0.14 75)",
              letterSpacing: "0.02em",
            }}
          >
            Define → Measure → Manage → Improve. Identify to Amplify.
          </span>
        </div>
      </div>
    </section>
  );
}
