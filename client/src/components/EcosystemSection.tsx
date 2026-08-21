/**
 * EcosystemSection — The Larger Platform Vision
 * Shows that the book is the entry point to a broader intellectual ecosystem
 */

import { useEffect, useRef } from "react";
import { ASSESSMENT_URL, DOMAINS_URL, PROTOCOL_URL } from "@/lib/config";

const ECOSYSTEM_ITEMS = [
  { step: 1, title: "Take the Assessment", desc: "Discover your Genius Signature in 25 minutes", href: ASSESSMENT_URL },
  { step: 2, title: "Read the Book", desc: "Understand the framework and your domains" },
  { step: 3, title: "Explore Your Domains", desc: "Deep dive into your specific genius", href: DOMAINS_URL },
  { step: 4, title: "Join the Community", desc: "Connect with others who share your signature" },
  { step: 5, title: "Master the Framework", desc: "Run the 30-day amplification protocol on your Signature", href: PROTOCOL_URL },
  { step: 6, title: "Access Courses", desc: "Structured learning for each domain" },
  { step: 7, title: "Research & Insights", desc: "Ongoing studies and discoveries" },
  { step: 8, title: "Get Certified", desc: "Become a Genius Index practitioner" },
];

export default function EcosystemSection() {
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
      style={{
        background: "var(--bg)",
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
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse at center, rgb(194 122 12 / 4%) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container relative z-10">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="reveal flex items-center gap-3 mb-6">
            <div className="gold-rule w-12" />
            <span className="section-label">The Ecosystem</span>
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
            The Book Is the Beginning
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
            The Genius Index is building an intellectual platform. The book introduces the framework. What comes next is a journey of discovery, development, and community.
          </p>
        </div>

        {/* Ecosystem journey */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ECOSYSTEM_ITEMS.map((item, i) => {
            const Tag = item.href ? "a" : "div";
            return (
            <Tag
              key={item.step}
              className="reveal"
              {...(item.href ? { href: item.href } : { "aria-disabled": "true" })}
              style={{
                transitionDelay: `${300 + i * 80}ms`,
                background: "var(--print-200)",
                border: "1px solid rgb(10 9 7 / 8%)",
                borderRadius: "3px",
                padding: "2rem",
                position: "relative",
                display: "block",
                textDecoration: "none",
                cursor: item.href ? "pointer" : "default",
                // Only one of these eight cards is actually live today -- the
                // rest are roadmap, not product. Same border/shape (still one
                // ecosystem), reduced opacity + an explicit label so they
                // don't read as seven more dead links (see: paperback CTA).
                opacity: item.href ? 1 : 0.6,
                transition: "border-color 200ms ease, opacity 200ms ease",
              }}
              {...(item.href
                ? {
                    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgb(194 122 12 / 40%)";
                    },
                    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgb(10 9 7 / 8%)";
                    },
                  }
                : {})}
            >
              {/* Step number */}
              <div
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontWeight: 900,
                  fontSize: "2.5rem",
                  color: "var(--accent-fill)",
                  lineHeight: 1,
                  marginBottom: "1rem",
                  letterSpacing: "-0.04em",
                }}
              >
                {String(item.step).padStart(2, "0")}
              </div>

              {/* Top gold accent */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: "var(--accent)",
                  opacity: 0.4,
                }}
              />

              <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: "0.75rem" }}>
                <h3
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontWeight: 600,
                    fontSize: "1.1875rem",
                    color: "var(--fg)",
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </h3>
                {!item.href && (
                  <span
                    style={{
                      fontFamily: "'Newsreader', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--fg-muted)",
                      border: "1px solid rgb(10 9 7 / 15%)",
                      padding: "2px 6px",
                      borderRadius: "2px",
                    }}
                  >
                    Coming Soon
                  </span>
                )}
              </div>

              <p
                style={{
                  fontFamily: "'Newsreader', sans-serif",
                  fontSize: "1.0625rem",
                  lineHeight: 1.6,
                  color: "var(--fg-muted)",
                }}
              >
                {item.desc}
              </p>

              {/* Connector line (hidden on last item, and on mobile via Tailwind
                  rather than a one-time window.innerWidth read that never
                  updated on resize) */}
              {i < ECOSYSTEM_ITEMS.length - 1 && (
                <div
                  className="hidden md:block"
                  style={{
                    position: "absolute",
                    bottom: "-24px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "2px",
                    height: "24px",
                    background: "linear-gradient(to bottom, rgb(194 122 12 / 30%), transparent)",
                  }}
                />
              )}
            </Tag>
          );})}
        </div>
      </div>
    </section>
  );
}
