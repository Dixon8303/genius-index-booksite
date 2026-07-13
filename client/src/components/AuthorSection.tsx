/**
 * AuthorSection — About D. Antione Dixon
 * Dark Alchemy design: asymmetric layout, portrait, bio
 */

import { useEffect, useRef } from "react";

const AUTHOR_PORTRAIT_URL = `${import.meta.env.BASE_URL}images/author-portrait.jpg`;

export default function AuthorSection() {
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
      id="author"
      ref={sectionRef}
      style={{ background: "oklch(0.12 0.008 285)", padding: "6rem 0" }}
    >
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Portrait */}
          <div className="reveal order-2 lg:order-1" style={{ transitionDelay: "100ms" }}>
            <div className="relative">
              {/* Gold frame accent */}
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "-12px",
                  right: "24px",
                  bottom: "24px",
                  border: "1px solid oklch(0.72 0.14 75 / 25%)",
                  borderRadius: "3px",
                  zIndex: 0,
                }}
              />
              <img
                src={AUTHOR_PORTRAIT_URL}
                alt="D. Antione Dixon, author of The Genius Index"
                style={{
                  width: "100%",
                  maxWidth: "440px",
                  height: "auto",
                  borderRadius: "3px",
                  display: "block",
                  position: "relative",
                  zIndex: 1,
                  objectFit: "cover",
                  filter: "contrast(1.05) saturate(1.05)",
                }}
              />
              {/* Gold overlay accent */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "30%",
                  background: "linear-gradient(to top, oklch(0.12 0.008 285), transparent)",
                  zIndex: 2,
                  borderRadius: "0 0 3px 3px",
                }}
              />
            </div>
          </div>

          {/* Bio */}
          <div className="order-1 lg:order-2">
            <div className="reveal flex items-center gap-3 mb-6">
              <div className="gold-rule w-12" />
              <span className="section-label">The Author</span>
            </div>

            <h2
              className="reveal"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: 1.1,
                color: "oklch(0.92 0.02 80)",
                marginBottom: "0.5rem",
                transitionDelay: "100ms",
              }}
            >
              D. Antione Dixon
            </h2>

            <p
              className="reveal"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "1.1rem",
                color: "oklch(0.72 0.14 75)",
                marginBottom: "2rem",
                transitionDelay: "150ms",
              }}
            >
              Filmmaker · Producer · Educator · Builder
            </p>

            <div className="gold-rule reveal mb-8" style={{ transitionDelay: "200ms" }} />

            <p
              className="reveal"
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.85,
                color: "oklch(0.65 0.01 285)",
                marginBottom: "1.5rem",
                transitionDelay: "250ms",
              }}
            >
              D. Antione Dixon is a filmmaker, producer, educator, and builder of things. For a long time he mistook the ease with which certain things came to him for evidence that they didn't count.
            </p>

            <p
              className="reveal"
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.85,
                color: "oklch(0.65 0.01 285)",
                marginBottom: "1.5rem",
                transitionDelay: "300ms",
              }}
            >
              The capacity to hold an audience, to make a hard idea land, to braid a story out of scattered parts — because it never felt like effort, he assumed it wasn't a gift. It took him far too long to understand that the ease was the signal.
            </p>

            <p
              className="reveal"
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.85,
                color: "oklch(0.65 0.01 285)",
                marginBottom: "2.5rem",
                transitionDelay: "350ms",
              }}
            >
              The Genius Index is, in part, the map he wishes someone had handed him — a systematic way to find the thing you're built to do, before another decade passes. Published under his media company, E.A.T. Media.
            </p>

            {/* Pull quote */}
            <div
              className="reveal"
              style={{
                transitionDelay: "400ms",
                borderLeft: "2px solid oklch(0.72 0.14 75)",
                paddingLeft: "1.5rem",
                marginBottom: "2.5rem",
              }}
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: "1.15rem",
                  lineHeight: 1.65,
                  color: "oklch(0.80 0.02 80)",
                }}
              >
                "What comes easy to you, you tend not to see. You have spent years looking straight past your gift on your way to some goal you were told mattered more."
              </p>
            </div>

            {/* Publisher badge */}
            <div
              className="reveal flex items-center gap-3"
              style={{ transitionDelay: "450ms" }}
            >
              <div
                style={{
                  background: "oklch(0.10 0.008 285)",
                  border: "1px solid oklch(1 0 0 / 10%)",
                  borderRadius: "3px",
                  padding: "0.75rem 1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Lato', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "oklch(0.50 0.01 285)",
                  }}
                >
                  Published by
                </span>
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: "oklch(0.72 0.14 75)",
                    letterSpacing: "0.05em",
                  }}
                >
                  E.A.T. Media
                </span>
              </div>
              <div
                style={{
                  background: "oklch(0.10 0.008 285)",
                  border: "1px solid oklch(1 0 0 / 10%)",
                  borderRadius: "3px",
                  padding: "0.75rem 1.25rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Lato', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "oklch(0.50 0.01 285)",
                    display: "block",
                    marginBottom: "2px",
                  }}
                >
                  First Edition
                </span>
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: "oklch(0.72 0.14 75)",
                  }}
                >
                  2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
