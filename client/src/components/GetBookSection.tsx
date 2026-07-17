/**
 * GetBookSection — Purchase / CTA section
 * Dark Alchemy design: bold CTA, book formats, assessment link
 */

import { useEffect, useRef } from "react";
import { ASSESSMENT_URL } from "@/lib/config";

const BOOK_COVER_URL = `${import.meta.env.BASE_URL}images/book-cover.svg`;
const COMPANION_URL = `${import.meta.env.BASE_URL}downloads/the-thirty-six-braids-companion.pdf`;

// Hairline SVG marks in the same visual language as the domain glyphs and the
// constellation graphic (thin currentColor strokes, layered opacity for
// depth) -- used instead of emoji, which read out of place against the rest
// of the book's typographic system.
const FORMAT_ICONS: Record<string, string> = {
  paperback: `<path d="M4 5.4C4 4.63 4.63 4 5.4 4H11.4a.6.6 0 0 1 .6.6V19a.6.6 0 0 0-.6-.6H5.4A1.4 1.4 0 0 1 4 17V5.4Z"></path><path d="M20 5.4c0-.77-.63-1.4-1.4-1.4H12.6a.6.6 0 0 0-.6.6V19a.6.6 0 0 1 .6-.6h6A1.4 1.4 0 0 0 20 17V5.4Z"></path><path d="M12 4.6V19" stroke-opacity=".4"></path>`,
  assessment: `<circle cx="12" cy="12" r="8"></circle><path d="M12 3v2.6M12 18.4V21M3 12h2.6M18.4 12H21" stroke-opacity=".55"></path><path d="M6.3 6.3l1.5 1.5M16.2 16.2l1.5 1.5M17.7 6.3l-1.5 1.5M7.8 16.2l-1.5 1.5" stroke-opacity=".3"></path><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"></circle>`,
  companion: `<path d="M6.5 3.5c2.6 1.1 2.6 3.9 0 5s-2.6 3.9 0 5 2.6 3.9 0 5"></path><path d="M12 3.5c2.6 1.1 2.6 3.9 0 5s-2.6 3.9 0 5 2.6 3.9 0 5" stroke-opacity=".55"></path><path d="M17.5 3.5c2.6 1.1 2.6 3.9 0 5s-2.6 3.9 0 5 2.6 3.9 0 5" stroke-opacity=".3"></path>`,
};

function FormatIcon({ id }: { id: keyof typeof FORMAT_ICONS }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block", color: "oklch(0.72 0.14 75)" }}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: FORMAT_ICONS[id] }}
    />
  );
}

const BOOK_FORMATS = [
  {
    format: "Paperback",
    description: "The Book Edition includes the full printable self-assessment. Set aside 25 minutes and a pen.",
    icon: "paperback",
    cta: "Coming Soon",
    href: undefined,
    badge: "Coming Soon",
    comingSoon: true,
  },
  {
    format: "Online Assessment",
    description: "The fuller online Index adds automatic scoring, sound-based stations, and a saved profile you can retake to track change.",
    icon: "assessment",
    cta: "Take the Online Index",
    href: ASSESSMENT_URL,
    external: true,
    primary: true,
    badge: "Recommended",
  },
  {
    format: "Free Braid Companion",
    description: "“The Thirty-Six Braids” — a free eleven-page field guide to every pairing. No purchase required.",
    icon: "companion",
    cta: "Download Now",
    href: COMPANION_URL,
    download: true,
    primary: false,
    highlight: true,
    badge: "Free",
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
                <div style={{ flexShrink: 0 }}><FormatIcon id={format.icon} /></div>
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
                    {format.badge && (
                      <span
                        style={{
                          fontFamily: "'Lato', sans-serif",
                          fontWeight: 700,
                          fontSize: "0.55rem",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: format.comingSoon ? "oklch(0.60 0.01 285)" : "oklch(0.10 0.008 285)",
                          background: format.comingSoon ? "oklch(1 0 0 / 8%)" : "oklch(0.72 0.14 75)",
                          padding: "2px 8px",
                          borderRadius: "2px",
                        }}
                      >
                        {format.badge}
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
                {format.comingSoon ? (
                  // Paperback has no purchase link yet. A styled link that goes
                  // nowhere reads as broken, not as "not yet available" -- so
                  // this renders as a genuinely non-interactive, visibly muted
                  // element instead of a clickable dead end.
                  <span
                    role="button"
                    aria-disabled="true"
                    title="Paperback pre-orders aren't open yet"
                    style={{
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                      fontSize: "0.65rem",
                      padding: "0.625rem 1.25rem",
                      fontFamily: "'Lato', sans-serif",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "oklch(0.45 0.01 285)",
                      background: "transparent",
                      border: "1px solid oklch(1 0 0 / 12%)",
                      borderRadius: "2px",
                      cursor: "not-allowed",
                    }}
                  >
                    {format.cta}
                  </span>
                ) : (
                  <a
                    href={format.href}
                    target={format.external ? "_blank" : undefined}
                    rel={format.external ? "noopener" : undefined}
                    download={format.download ? "" : undefined}
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
                )}
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
          <a
            href={ASSESSMENT_URL}
            target="_blank"
            rel="noopener"
            className="btn-gold"
            style={{ textDecoration: "none" }}
          >
            Take the Assessment
          </a>
        </div>
      </div>
    </section>
  );
}
