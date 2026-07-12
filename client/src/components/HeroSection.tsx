/**
 * HeroSection — Dark Alchemy design
 * Full-bleed dark hero with book cover, headline, and CTA
 * Book cover displayed as a 3D tilted artifact with float animation
 */

import { useEffect, useRef } from "react";

const BOOK_COVER_URL = `${import.meta.env.BASE_URL}images/book-cover.svg`;

export default function HeroSection() {
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = headlineRef.current?.querySelectorAll(".reveal");
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleCTAClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "oklch(0.10 0.008 285)",
      }}
    >
      {/* Background: layered radial glows standing in for a photographic hero image */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 900px 600px at 15% 15%, oklch(0.72 0.14 75 / 10%) 0%, transparent 60%),
            radial-gradient(ellipse 700px 900px at 90% 60%, oklch(0.72 0.14 75 / 7%) 0%, transparent 65%),
            linear-gradient(135deg, oklch(0.08 0.008 285) 0%, oklch(0.11 0.008 285) 50%, oklch(0.08 0.008 285) 100%)
          `,
        }}
      />

      {/* Subtle grid texture overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.72 0.14 75 / 15%) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.72 0.14 75 / 15%) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content */}
      <div className="container relative z-10 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Text content */}
          <div ref={headlineRef} className="order-2 lg:order-1">
            {/* Section label */}
            <div
              className="reveal flex items-center gap-3 mb-8"
              style={{ transitionDelay: "100ms" }}
            >
              <div className="gold-rule w-12" />
              <span className="section-label">D. Antione Dixon</span>
            </div>

            {/* Main headline */}
            <h1
              className="reveal"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "oklch(0.92 0.02 80)",
                marginBottom: "1.5rem",
                transitionDelay: "200ms",
              }}
            >
              Everything You Believe
              <br />
              About{" "}
              <em
                style={{
                  fontStyle: "italic",
                  color: "oklch(0.72 0.14 75)",
                }}
              >
                Genius
              </em>
              <br />
              Is Wrong.
            </h1>

            {/* Subtitle */}
            <p
              className="reveal"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                lineHeight: 1.7,
                color: "oklch(0.75 0.015 285)",
                marginBottom: "2.5rem",
                maxWidth: "480px",
                transitionDelay: "300ms",
              }}
            >
              And this book explains why.
            </p>

            {/* Body copy */}
            <p
              className="reveal"
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "oklch(0.65 0.01 285)",
                marginBottom: "3rem",
                maxWidth: "440px",
                transitionDelay: "400ms",
              }}
            >
              Schools measure the wrong intelligence. Employers hire for the wrong things. Culture celebrates the wrong people. The result: billions of people operating below their actual capacity, never knowing what they were built to do.
            </p>

            {/* CTAs */}
            <div
              className="reveal flex flex-wrap gap-4"
              style={{ transitionDelay: "500ms" }}
            >
              <button
                className="btn-gold"
                onClick={() => handleCTAClick("#get-book")}
              >
                Find What You Already Carry
              </button>
              <button
                className="btn-outline-gold"
                onClick={() => handleCTAClick("#book")}
              >
                Learn More
              </button>
            </div>

            {/* Social proof line */}
            <div
              className="reveal flex items-center gap-4 mt-10"
              style={{ transitionDelay: "600ms" }}
            >
              <div className="gold-rule w-8" />
              <p
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  color: "oklch(0.50 0.01 285)",
                  textTransform: "uppercase",
                }}
              >
                First Edition · 2026 · E.A.T. Media
              </p>
            </div>
          </div>

          {/* Right: Book cover */}
          <div
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div
              className="relative"
              style={{
                perspective: "1200px",
              }}
            >
              {/* Glow behind book */}
              <div
                className="absolute inset-0 animate-gold-pulse"
                style={{
                  background: "radial-gradient(ellipse at center, oklch(0.72 0.14 75 / 20%) 0%, transparent 70%)",
                  transform: "scale(1.3)",
                  filter: "blur(30px)",
                }}
              />

              {/* Book cover with 3D tilt */}
              <div
                className="animate-float relative"
                style={{
                  transform: "rotateY(-8deg) rotateX(3deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                <img
                  src={BOOK_COVER_URL}
                  alt="The Genius Index — A System for Finding the Genius You Already Carry by D. Antione Dixon"
                  style={{
                    width: "clamp(220px, 30vw, 340px)",
                    height: "auto",
                    borderRadius: "2px",
                    boxShadow: "0 40px 80px oklch(0 0 0 / 70%), 0 0 0 1px oklch(1 0 0 / 5%)",
                    display: "block",
                  }}
                />
                {/* Book spine shadow */}
                <div
                  style={{
                    position: "absolute",
                    right: "-20px",
                    top: "4px",
                    bottom: "4px",
                    width: "20px",
                    background: "linear-gradient(90deg, oklch(0 0 0 / 40%), transparent)",
                    filter: "blur(6px)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
        style={{ animation: "float 2s ease-in-out infinite" }}
      >
        <span
          style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "oklch(0.72 0.14 75)",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: "1px",
            height: "40px",
            background: "linear-gradient(to bottom, oklch(0.72 0.14 75), transparent)",
          }}
        />
      </div>
    </section>
  );
}
