/**
 * GetBookSection — Purchase / CTA section
 * Dark Alchemy design: bold CTA, book formats, assessment link
 */

import { useEffect, useRef } from "react";
import { ASSESSMENT_URL } from "@/lib/config";

const BOOK_COVER_URL = `${import.meta.env.BASE_URL}images/book-cover.svg`;

const BOOK_FORMATS = [
  {
    format: "Paperback",
    description: "The Book Edition includes the full printable self-assessment. Set aside 25 minutes and a pen.",
    icon: "📖",
    cta: "Order Paperback",
    href: "#",
    primary: true,
  },
  {
    format: "eBook",
    description: "Digital edition with the full text, framework, and all nine domain chapters.",
    icon: "📱",
    cta: "Get eBook",
    href: "#",
    primary: false,
  },
  {
    format: "Online Assessment",
    description: "The fuller online Index adds automatic scoring, sound-based stations, and a saved profile you can retake to track change.",
    icon: "🔬",
    cta: "Take the Online Index",
    href: ASSESSMENT_URL,
    external: true,
    primary: false,
    highlight: true,
  },
];

export default function GetBookSection() {
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
      id="get-book"
      ref={sectionRef}
      style={{
        background: "oklch(0.10 0.008 285)",
        padding: "6rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "400px",
          background: "radial-gradient(ellipse at center, oklch(0.72 0.14 75 / 6%) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container relative z-10">

        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="reveal flex items-center justify-center gap-3 mb-6">
            <div className="gold-rule w-12" />
            <span className="section-label">Get the Book</span>
            <div className="gold-rule w-12" />
          </div>

          <h2
            className="reveal"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              lineHeight: 1.05,
              color: "oklch(0.92 0.02 80)",
              marginBottom: "1.25rem",
              transitionDelay: "100ms",
            }}
          >
            Your Eyes Are{" "}
            <em style={{ color: "oklch(0.72 0.14 75)", fontStyle: "italic" }}>
              Unclouded
            </em>{" "}
            Now.
          </h2>

          <p
            className="reveal"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: "1.2rem",
              lineHeight: 1.7,
              color: "oklch(0.65 0.01 285)",
              transitionDelay: "200ms",
            }}
          >
            The genius is already in you, doing its quiet work in a domain you've probably discounted. All that's left is to see it — and to call it by its name.
          </p>
        </div>

        {/* Book + formats */}
        <div className="grid lg:grid-cols-5 gap-12 items-center mb-16">

          {/* Book cover */}
          <div
            className="reveal lg:col-span-2 flex justify-center"
            style={{ transitionDelay: "300ms" }}
          >
            <div className="relative">
              <div
                className="animate-gold-pulse absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse at center, oklch(0.72 0.14 75 / 15%) 0%, transparent 70%)",
                  transform: "scale(1.4)",
                  filter: "blur(20px)",
                }}
              />
              <img
                src={BOOK_COVER_URL}
                alt="The Genius Index book cover"
                style={{
                  width: "clamp(180px, 25vw, 280px)",
                  height: "auto",
                  borderRadius: "2px",
                  boxShadow: "0 30px 60px oklch(0 0 0 / 60%)",
                  position: "relative",
                  zIndex: 1,
                  transform: "rotate(-2deg)",
                }}
              />
            </div>
          </div>

          {/* Format cards */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {BOOK_FORMATS.map((format, i) => (
              <div
                key={format.format}
                className="reveal"
                style={{
                  transitionDelay: `${400 + i * 80}ms`,
                  background: format.highlight
                    ? "oklch(0.72 0.14 75 / 8%)"
                    : "oklch(0.15 0.008 285)",
                  border: `1px solid ${format.highlight ? "oklch(0.72 0.14 75 / 35%)" : "oklch(1 0 0 / 8%)"}`,
                  borderRadius: "3px",
                  padding: "1.75rem",
                  display: "flex",
                  gap: "1.25rem",
                  alignItems: "center",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.72 0.14 75 / 40%)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = format.highlight
                    ? "oklch(0.72 0.14 75 / 35%)"
                    : "oklch(1 0 0 / 8%)";
                }}
              >
                <div style={{ fontSize: "1.75rem", flexShrink: 0 }}>{format.icon}</div>
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 600,
                        fontSize: "1.05rem",
                        color: "oklch(0.88 0.02 80)",
                      }}
                    >
                      {format.format}
                    </h4>
                    {format.highlight && (
                      <span
                        style={{
                          fontFamily: "'Lato', sans-serif",
                          fontWeight: 700,
                          fontSize: "0.55rem",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: "oklch(0.10 0.008 285)",
                          background: "oklch(0.72 0.14 75)",
                          padding: "2px 8px",
                          borderRadius: "2px",
                        }}
                      >
                        Recommended
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      fontSize: "0.85rem",
                      lineHeight: 1.65,
                      color: "oklch(0.55 0.01 285)",
                    }}
                  >
                    {format.description}
                  </p>
                </div>
                <a
                  href={format.href}
                  target={format.external ? "_blank" : undefined}
                  rel={format.external ? "noopener" : undefined}
                  onClick={e => {
                    // Paperback/eBook have no purchase page yet -- swallow the
                    // click rather than navigate to "#". The Online Assessment
                    // entry has a real href and is left to navigate normally.
                    if (!format.external) e.preventDefault();
                  }}
                  className={format.primary ? "btn-gold" : "btn-outline-gold"}
                  style={{
                    flexShrink: 0,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    fontSize: "0.65rem",
                    padding: "0.625rem 1.25rem",
                  }}
                >
                  {format.cta}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment link callout */}
        <div
          className="reveal"
          style={{
            transitionDelay: "700ms",
            background: "oklch(0.15 0.008 285)",
            border: "1px solid oklch(0.72 0.14 75 / 20%)",
            borderRadius: "3px",
            padding: "2.5rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ maxWidth: "560px" }}>
            <span className="section-label block mb-2">Already Have the Book?</span>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "1.5rem",
                color: "oklch(0.92 0.02 80)",
                marginBottom: "0.75rem",
              }}
            >
              Take the Online Genius Index
            </h3>
            <p
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: "0.9rem",
                lineHeight: 1.75,
                color: "oklch(0.60 0.01 285)",
              }}
            >
              The online version adds the two stations that need sound, automatic scoring across all three streams, and a saved profile you can retake to track change. Both versions give you a real Genius Signature.
            </p>
          </div>
          <button
            className="btn-gold"
            onClick={() => {
              window.open(ASSESSMENT_URL, "_blank", "noopener");
            }}
          >
            Take the Assessment
          </button>
        </div>
      </div>
    </section>
  );
}
