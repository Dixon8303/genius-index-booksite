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
      style={{ display: "block", color: "var(--accent)" }}
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
    external: false,
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
        background: "var(--bg)",
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
          background: "radial-gradient(ellipse at center, rgb(194 122 12 / 6%) 0%, transparent 70%)",
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
              fontFamily: "'Instrument Serif', serif",
              fontWeight: 900,
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              lineHeight: 1.05,
              color: "var(--fg)",
              marginBottom: "1.25rem",
              transitionDelay: "100ms",
            }}
          >
            Your Eyes Are{" "}
            <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
              Unclouded
            </em>{" "}
            Now.
          </h2>

          <p
            className="reveal"
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: "1.3rem",
              lineHeight: 1.7,
              color: "var(--fg-muted)",
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
            <div className="relative amber-pass">
              <div
                className="animate-gold-pulse absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse at center, rgb(194 122 12 / 15%) 0%, transparent 70%)",
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
                    ? "rgb(194 122 12 / 8%)"
                    : "var(--bg-raised)",
                  border: `1px solid ${format.highlight ? "rgb(194 122 12 / 35%)" : "rgb(10 9 7 / 8%)"}`,
                  borderRadius: "3px",
                  padding: "1.75rem",
                  display: "flex",
                  gap: "1.25rem",
                  alignItems: "center",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgb(194 122 12 / 40%)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = format.highlight
                    ? "rgb(194 122 12 / 35%)"
                    : "rgb(10 9 7 / 8%)";
                }}
              >
                <div style={{ flexShrink: 0 }}><FormatIcon id={format.icon} /></div>
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      style={{
                        fontFamily: "'Instrument Serif', serif",
                        fontWeight: 600,
                        fontSize: "1.1875rem",
                        color: "var(--fg)",
                      }}
                    >
                      {format.format}
                    </h4>
                    {format.badge && (
                      <span
                        style={{
                          fontFamily: "'Newsreader', sans-serif",
                          fontWeight: 700,
                          fontSize: "0.65rem",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: format.comingSoon ? "var(--fg-muted)" : "var(--bg)",
                          background: format.comingSoon ? "rgb(10 9 7 / 8%)" : "var(--accent)",
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
                      fontFamily: "'Newsreader', sans-serif",
                      fontSize: "0.95rem",
                      lineHeight: 1.65,
                      color: "var(--fg-muted)",
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
                      fontSize: "0.75rem",
                      padding: "0.625rem 1.25rem",
                      fontFamily: "'Newsreader', sans-serif",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--print-400)",
                      background: "transparent",
                      border: "1px solid rgb(10 9 7 / 12%)",
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
                      fontSize: "0.75rem",
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
            background: "var(--bg-raised)",
            border: "1px solid rgb(194 122 12 / 20%)",
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
                fontFamily: "'Instrument Serif', serif",
                fontWeight: 700,
                fontSize: "1.5rem",
                color: "var(--fg)",
                marginBottom: "0.75rem",
              }}
            >
              Take the Online Genius Index
            </h3>
            <p
              style={{
                fontFamily: "'Newsreader', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "var(--fg-muted)",
              }}
            >
              The online version adds the two stations that need sound, automatic scoring across all three streams, and a saved profile you can retake to track change. Both versions give you a real Genius Signature.
            </p>
          </div>
          <a
            href={ASSESSMENT_URL}
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
