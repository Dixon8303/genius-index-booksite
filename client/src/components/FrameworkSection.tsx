/**
 * FrameworkSection — The Genius Index Framework
 * Explains the Amplification Chain, Genius Signature, and Braids
 */

import { useEffect, useRef } from "react";
import DomainGlyph, { type DomainGlyphId } from "./DomainGlyph";

const BRAIDS: Array<{ name: string; domains: string; glyphs: [DomainGlyphId, DomainGlyphId]; what: string }> = [
  { name: "Translator", domains: "Analytic + Expressive", glyphs: ["ANL", "EXP"], what: "Sees structure and makes others see it" },
  { name: "Leader", domains: "Relational + Expressive", glyphs: ["REL", "EXP"], what: "Reads people and moves them" },
  { name: "Storyteller", domains: "Generative + Expressive", glyphs: ["GEN", "EXP"], what: "Makes the new thing and transmits it" },
  { name: "Craftsman", domains: "Kinetic + Sensory", glyphs: ["KIN", "SEN"], what: "The body owns the motion, the sense guides it" },
  { name: "Diagnostician", domains: "Perceptive + Analytic", glyphs: ["PER", "ANL"], what: "Catches the anomaly and explains the system" },
  { name: "Connector", domains: "Mnemonic + Relational", glyphs: ["MEM", "REL"], what: "Never forgets a person and reads them" },
];

const BANDS = [
  { name: "Signature", description: "A domain that rises well above your personal median. This is a genius of yours, named.", indicator: 4 },
  { name: "Supporting", description: "Strong, reliable, a genuine asset that braids well with your Signatures.", indicator: 3 },
  { name: "Developing", description: "Present but unremarkable; trainable if you choose to invest.", indicator: 2 },
  { name: "Dormant", description: "Genuinely not your territory right now — the honest floor that makes the peaks mean something.", indicator: 1 },
];

export default function FrameworkSection() {
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
      id="framework"
      ref={sectionRef}
      style={{ background: "var(--print-200)", padding: "6rem 0" }}
    >
      <div className="container">

        {/* Section header */}
        <div className="max-w-3xl mb-16">
          <div className="reveal flex items-center gap-3 mb-6">
            <div className="gold-rule w-12" />
            <span className="section-label">The Framework</span>
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
            How the Index Works
          </h2>
          <p
            className="reveal"
            style={{
              fontFamily: "'Newsreader', sans-serif",
              fontSize: "1rem",
              lineHeight: 1.8,
              color: "var(--fg-muted)",
              maxWidth: "560px",
              transitionDelay: "200ms",
            }}
          >
            The Index measures each of the nine domains three ways, because no single method is trustworthy alone. The result is a Genius Signature — your specific profile, read against your own line, not against other people.
          </p>
        </div>

        {/* Three Streams */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            {
              label: "Stream A",
              title: "Behavioral Self-Report",
              desc: "For each domain, concrete behavioral items ask how often specific things actually happen. Self-report is powerful — you have access to a lifetime of your own behavior.",
              weight: "50%",
              delay: "300ms",
            },
            {
              label: "Stream B",
              title: "Micro-Performance",
              desc: "Short live tasks — a sequence to reproduce, tones to discriminate, objects to find alternate uses for. They check your story against your behavior in the moment.",
              weight: "30%",
              delay: "380ms",
            },
            {
              label: "Stream C",
              title: "Trait Disposition",
              desc: "A short set of items locates you on the dispositions that shape how you will train each domain. Traits are training styles, not gates.",
              weight: "20%",
              delay: "460ms",
            },
          ].map(stream => (
            <div
              key={stream.label}
              className="reveal"
              style={{
                transitionDelay: stream.delay,
                background: "var(--bg)",
                border: "1px solid rgb(10 9 7 / 8%)",
                borderRadius: "3px",
                padding: "2rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: "var(--accent)",
                  opacity: 0.6,
                }}
              />
              <div className="flex items-center justify-between mb-3">
                <span className="section-label">{stream.label}</span>
                <span
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontWeight: 700,
                    fontSize: "1.4rem",
                    color: "rgb(194 122 12 / 40%)",
                  }}
                >
                  {stream.weight}
                </span>
              </div>
              <h4
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontWeight: 600,
                  fontSize: "1.15rem",
                  color: "var(--fg)",
                  marginBottom: "0.875rem",
                }}
              >
                {stream.title}
              </h4>
              <p
                style={{
                  fontFamily: "'Newsreader', sans-serif",
                  fontSize: "0.88rem",
                  lineHeight: 1.75,
                  color: "var(--fg-muted)",
                }}
              >
                {stream.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Gold rule */}
        <div className="reveal gold-rule mb-20" style={{ transitionDelay: "500ms" }} />

        {/* Genius Signature bands */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <div>
            <div className="reveal mb-6" style={{ transitionDelay: "550ms" }}>
              <span className="section-label">Your Result</span>
            </div>
            <h3
              className="reveal"
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                color: "var(--fg)",
                marginBottom: "1rem",
                transitionDelay: "600ms",
              }}
            >
              Your Genius Signature
            </h3>
            <p
              className="reveal"
              style={{
                fontFamily: "'Newsreader', sans-serif",
                fontSize: "0.95rem",
                lineHeight: 1.8,
                color: "var(--fg-muted)",
                marginBottom: "2rem",
                transitionDelay: "650ms",
              }}
            >
              Domain scores sort into four bands, read relative to your own profile — not against other people. The result is a shape: a few bright cells against an honest floor.
            </p>

            <div className="flex flex-col gap-3">
              {BANDS.map((band, i) => (
                <div
                  key={band.name}
                  className="reveal"
                  style={{
                    transitionDelay: `${700 + i * 60}ms`,
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Indicator bars */}
                  <div className="flex gap-0.5 pt-1 flex-shrink-0">
                    {[1,2,3,4].map(bar => (
                      <div
                        key={bar}
                        style={{
                          width: "4px",
                          height: "20px",
                          borderRadius: "2px",
                          background: bar <= band.indicator
                            ? "var(--accent)"
                            : "var(--rule)",
                        }}
                      />
                    ))}
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: "'Newsreader', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: band.indicator === 4 ? "var(--accent)" : "var(--fg-muted)",
                        display: "block",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {band.name}
                    </span>
                    <p
                      style={{
                        fontFamily: "'Newsreader', sans-serif",
                        fontSize: "0.83rem",
                        lineHeight: 1.6,
                        color: "var(--fg-muted)",
                      }}
                    >
                      {band.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Braids */}
          <div>
            <div className="reveal mb-6" style={{ transitionDelay: "550ms" }}>
              <span className="section-label">Stacking Your Genius</span>
            </div>
            <h3
              className="reveal"
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                color: "var(--fg)",
                marginBottom: "1rem",
                transitionDelay: "600ms",
              }}
            >
              Braids in Practice
            </h3>
            <p
              className="reveal"
              style={{
                fontFamily: "'Newsreader', sans-serif",
                fontSize: "0.95rem",
                lineHeight: 1.8,
                color: "var(--fg-muted)",
                marginBottom: "2rem",
                transitionDelay: "650ms",
              }}
            >
              A Signature alone is a specialty. Braided with the domain that most amplifies it, it becomes rare. Rarity comes from combination, not from being best at one thing.
            </p>

            <div className="flex flex-col gap-2">
              {BRAIDS.map((braid, i) => (
                <div
                  key={braid.name}
                  className="reveal"
                  style={{
                    transitionDelay: `${700 + i * 60}ms`,
                    background: "var(--bg)",
                    border: "1px solid rgb(10 9 7 / 8%)",
                    borderRadius: "3px",
                    padding: "0.875rem 1.25rem",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    transition: "all 200ms ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgb(194 122 12 / 30%)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgb(10 9 7 / 8%)";
                  }}
                >
                  <div style={{ flexShrink: 0 }}>
                    <span
                      style={{
                        fontFamily: "'Instrument Serif', serif",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: "var(--fg)",
                        display: "block",
                      }}
                    >
                      {braid.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Newsreader', sans-serif",
                        fontSize: "0.65rem",
                        color: "var(--accent)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {braid.domains}
                    </span>
                  </div>
                  <div
                    style={{
                      width: "1px",
                      height: "30px",
                      background: "rgb(10 9 7 / 8%)",
                      flexShrink: 0,
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "'Newsreader', sans-serif",
                      fontSize: "0.82rem",
                      lineHeight: 1.5,
                      color: "var(--fg-muted)",
                    }}
                  >
                    {braid.what}
                  </p>

                  {/* Glyph equation: the braid's two domain glyphs, pinned to the
                      row's trailing negative space. */}
                  <div
                    style={{
                      marginLeft: "auto",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      color: "var(--accent)",
                      opacity: 0.75,
                    }}
                    aria-hidden="true"
                  >
                    <DomainGlyph domain={braid.glyphs[0]} size={20} />
                    <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: "0.85rem", color: "var(--fg-muted)" }}>+</span>
                    <DomainGlyph domain={braid.glyphs[1]} size={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Honest note */}
        <div
          className="reveal"
          style={{
            transitionDelay: "1000ms",
            background: "var(--bg)",
            border: "1px solid rgb(194 122 12 / 20%)",
            borderRadius: "3px",
            padding: "2.5rem",
            maxWidth: "800px",
          }}
        >
          <span className="section-label block mb-3">Not a Horoscope</span>
          <p
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: "1.2rem",
              lineHeight: 1.7,
              color: "var(--print-700)",
            }}
          >
            "A profile in which everything is a strength isn't a profile. It's a horoscope. The Index is built specifically to defeat that — with behavioral items anchored in real events, reverse-keyed items to catch autopilot answering, and a standing instruction to keep the top of the scale scarce."
          </p>
          <p
            style={{
              fontFamily: "'Newsreader', sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--print-500)",
              marginTop: "1rem",
            }}
          >
            — D. Antione Dixon, The Genius Index
          </p>
        </div>
      </div>
    </section>
  );
}
