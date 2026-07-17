/**
 * MomentSection — The Unforgettable Moment
 * Nine dark squares, one illuminates, then all light up
 * Dark Alchemy design: cinematic, memorable, emotional
 */

import { useEffect, useRef, useState } from "react";

export default function MomentSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [allLit, setAllLit] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Trigger the full animation after a delay -- kept short (was
            // 2000ms, plus another 1200ms before the headline even started
            // fading in) because a normally-scrolling visitor on this
            // 15,000px+ page was demonstrably passing through this section
            // before the payoff ever appeared, landing on a mostly-blank
            // frame instead. Still staged, just fast enough to land.
            setTimeout(() => setAllLit(true), 600);
          } else {
            setIsVisible(false);
            setAllLit(false);
          }
        });
      },
      { threshold: 0.35 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "oklch(0.08 0.008 285)",
        padding: "8rem 0",
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Subtle background glow that intensifies */}
      <div
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          height: "500px",
          background: allLit
            ? "radial-gradient(ellipse at center, oklch(0.72 0.14 75 / 12%) 0%, transparent 70%)"
            : "radial-gradient(ellipse at center, oklch(0.72 0.14 75 / 4%) 0%, transparent 70%)",
          transition: "all 2s cubic-bezier(0.23, 1, 0.32, 1)",
          pointerEvents: "none",
        }}
      />

      <div className="container relative z-10 text-center">
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>

          {/* The Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
              width: "240px",
              margin: "0 auto 4rem",
              marginBottom: "4rem",
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => {
              const isFirstCell = i === 2; // Top-right cell
              const shouldLight = isVisible && (isFirstCell || allLit);

              return (
                <div
                  key={i}
                  style={{
                    aspectRatio: "1",
                    background: shouldLight ? "oklch(0.72 0.14 75)" : "oklch(0.15 0.008 285)",
                    border: shouldLight
                      ? "1px solid oklch(0.72 0.14 75)"
                      : "1px solid oklch(1 0 0 / 10%)",
                    borderRadius: "4px",
                    transition: allLit
                      ? `all 300ms cubic-bezier(0.23, 1, 0.32, 1) ${i * 100}ms`
                      : "all 600ms cubic-bezier(0.23, 1, 0.32, 1)",
                    boxShadow: shouldLight
                      ? `0 0 30px oklch(0.72 0.14 75 / 50%), inset 0 0 20px oklch(0.72 0.14 75 / 20%)`
                      : "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => {
                    if (!shouldLight) {
                      (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.72 0.14 75 / 30%)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!shouldLight) {
                      (e.currentTarget as HTMLElement).style.borderColor = "oklch(1 0 0 / 10%)";
                    }
                  }}
                />
              );
            })}
          </div>

          {/* Headline that appears after grid lights */}
          <div
            style={{
              opacity: allLit ? 1 : 0,
              transform: allLit ? "translateY(0)" : "translateY(20px)",
              transition: "all 800ms cubic-bezier(0.23, 1, 0.32, 1) 0.3s",
            }}
          >
            <h2
              aria-label="Genius Was Never Rare. Recognition Was."
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
                lineHeight: 1.05,
                color: "oklch(0.92 0.02 80)",
                marginBottom: "1.5rem",
                letterSpacing: "-0.03em",
              }}
            >
              <span aria-hidden="true">
                Genius Was Never Rare.
                <br />
                <em style={{ color: "oklch(0.72 0.14 75)", fontStyle: "italic" }}>
                  Recognition
                </em>{" "}
                Was.
              </span>
            </h2>

            <div className="gold-rule mx-auto mb-6" style={{ width: "60px" }} />

            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "1.2rem",
                lineHeight: 1.7,
                color: "oklch(0.75 0.015 285)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              The nine domains illuminate one by one. Each one is a form of genius. The question is not whether you have it. The question is which ones are yours.
            </p>
          </div>

          {/* Instruction text */}
          <div
            style={{
              marginTop: "3rem",
              opacity: isVisible && !allLit ? 1 : 0,
              transition: "opacity 600ms ease",
            }}
          >
            <p
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: "0.8rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "oklch(0.50 0.01 285)",
              }}
            >
              Watch the grid illuminate
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
