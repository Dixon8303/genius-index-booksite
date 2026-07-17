/**
 * WhatYouGetSection — What's inside the book
 * Dark Alchemy design: asymmetric cards, gold accents
 */

import { useEffect, useRef } from "react";

const FEATURES = [
  {
    number: "01",
    title: "The Genius Grid Framework",
    description: "The full nine-domain map from earlier in this page, as a chapter you keep — the reference you'll return to as you work through the rest of the book. Not a vague model. A precise, locatable structure.",
  },
  {
    number: "02",
    title: "The Printable Self-Assessment",
    description: "The Book Edition of the Index: a full self-assessment you can take with nothing but a pen, in about 25 minutes. Behavioral items, reverse-keyed checks, and honest scoring.",
  },
  {
    number: "03",
    title: "Your Genius Signature",
    description: "The result: the one or two domains where your ability runs highest, named. The first honest answer many people ever receive to the question — what is my genius?",
  },
  {
    number: "04",
    title: "Nine Domain Chapters",
    description: "One chapter per domain. Each defines the gift precisely, separates folklore from truth in an Evidence Ledger, and gives you a thirty-day protocol to develop it.",
  },
  {
    number: "05",
    title: "The Amplification Protocols",
    description: "Thirty-day development protocols for your Signature domain — and the activation work that turns a named gift into a lived one.",
  },
  {
    number: "06",
    title: "The Braid Strategy",
    description: "How to combine your Signature with a second domain to become nearly one of one. Rarity comes from combination, not from being best at one thing.",
  },
];

export default function WhatYouGetSection() {
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
      style={{ background: "oklch(0.11 0.008 285)", padding: "6rem 0" }}
    >
      <div className="container">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="reveal flex items-center gap-3 mb-6">
            <div className="gold-rule w-12" />
            <span className="section-label">What's Inside</span>
          </div>
          <h2
            className="reveal"
            aria-label="A Book You Do, Not Only a Book You Read"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.1,
              color: "oklch(0.92 0.02 80)",
              transitionDelay: "100ms",
            }}
          >
            <span aria-hidden="true">
              A Book You Do,<br />
              Not Only a Book You Read
            </span>
          </h2>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: "oklch(1 0 0 / 5%)" }}
        >
          {FEATURES.map((feature, i) => (
            <div
              key={feature.number}
              className="reveal"
              style={{
                transitionDelay: `${200 + i * 80}ms`,
                background: "oklch(0.11 0.008 285)",
                padding: "2.5rem 2rem",
                position: "relative",
                transition: "background 200ms ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "oklch(0.14 0.008 285)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "oklch(0.11 0.008 285)";
              }}
            >
              {/* Number */}
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  fontSize: "3rem",
                  color: "oklch(0.72 0.14 75 / 12%)",
                  lineHeight: 1,
                  marginBottom: "1.25rem",
                  letterSpacing: "-0.04em",
                }}
              >
                {feature.number}
              </div>

              {/* Gold accent line */}
              <div
                style={{
                  width: "24px",
                  height: "2px",
                  background: "oklch(0.72 0.14 75)",
                  marginBottom: "1rem",
                }}
              />

              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  color: "oklch(0.88 0.02 80)",
                  marginBottom: "0.875rem",
                  lineHeight: 1.3,
                }}
              >
                {feature.title}
              </h3>

              <p
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "0.875rem",
                  lineHeight: 1.75,
                  color: "oklch(0.55 0.01 285)",
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
