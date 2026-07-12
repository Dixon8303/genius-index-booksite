/**
 * FAQSection — Frequently Asked Questions
 * Dark Alchemy design: accordion-style, honest tone
 */

import { useEffect, useRef, useState } from "react";

const FAQS = [
  {
    question: "Is this an IQ test?",
    answer: "No — and the distinction is the whole point. IQ produces a single number meant to rank you against everyone else on one axis. The Index does the opposite: it maps a profile across nine independent domains, read against your own line, to find where your ability comes easiest. There is no pass, no fail, and no ranking against other people.",
  },
  {
    question: "Is genius really in everyone? That sounds like flattery.",
    answer: "It would be, if 'genius' meant 'great at everything.' It doesn't. The claim is precise: nearly everyone has a profile with real peaks — one or two domains where they operate past the ordinary — and those peaks usually go unnamed because what comes easy is easy to discount. The book insists just as hard on your valleys: some domains are genuinely not yours. A profile with no lows isn't a profile; it's a horoscope.",
  },
  {
    question: "Isn't this just another personality quiz that tells everyone what they want to hear?",
    answer: "The Index is built specifically to defeat that. It uses behavioral items anchored in real events (not 'I am a creative person' but 'after seeing a movement once, I reproduce it in two tries'), a reverse-keyed item in every domain to catch autopilot answering, and a standing instruction to keep the top of the scale scarce — with a high-rater flag that sends you back to re-answer if everything came up a five.",
  },
  {
    question: "What's the difference between the book version and the online version?",
    answer: "Both give you a real Genius Signature. The printable Book Edition is scored from your behavioral self-report — the strongest single signal — and gives you a valid result with nothing but a pen. The online Index adds what paper can't carry: the two stations that need sound (pitch and social-cue reading), automatic scoring across all three streams, and a saved profile you can retake to track change.",
  },
  {
    question: "Can I develop a domain that isn't my Signature?",
    answer: "Yes — every domain is trainable, and the protocols work on any of them. But your leverage is almost never in your lowest domains. It is in amplifying what's already high and braiding it with what supports it. Develop a weak domain when it's the second strand of a braid you want — not out of a vague urge to fix your weaknesses.",
  },
  {
    question: "How solid is the science?",
    answer: "Uneven, and the book tells you exactly where. Each domain chapter includes an Evidence Ledger that separates what's established from what's folklore — and it does not spare beloved ideas. Photographic memory essentially doesn't exist; 'left-brained creativity' isn't a thing; human lie-detection runs barely above chance. Trust the book more when it tells you a comforting idea is myth.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
      id="faq"
      ref={sectionRef}
      style={{ background: "oklch(0.13 0.008 285)", padding: "6rem 0" }}
    >
      <div className="container">
        <div className="grid lg:grid-cols-3 gap-16">

          {/* Left: header */}
          <div className="lg:col-span-1">
            <div className="reveal flex items-center gap-3 mb-6">
              <div className="gold-rule w-12" />
              <span className="section-label">FAQ</span>
            </div>
            <h2
              className="reveal"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                lineHeight: 1.1,
                color: "oklch(0.92 0.02 80)",
                marginBottom: "1.25rem",
                transitionDelay: "100ms",
              }}
            >
              Questions Worth Asking
            </h2>
            <p
              className="reveal"
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: "0.9rem",
                lineHeight: 1.8,
                color: "oklch(0.55 0.01 285)",
                transitionDelay: "200ms",
              }}
            >
              The book refuses to flatter you, and that includes refusing to sell you comforting answers that aren't true.
            </p>
          </div>

          {/* Right: accordion */}
          <div className="lg:col-span-2 flex flex-col gap-0">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="reveal"
                style={{
                  transitionDelay: `${300 + i * 60}ms`,
                  borderBottom: "1px solid oklch(1 0 0 / 8%)",
                }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    padding: "1.5rem 0",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: openIndex === i ? "oklch(0.72 0.14 75)" : "oklch(0.85 0.02 80)",
                      lineHeight: 1.4,
                      transition: "color 200ms ease",
                    }}
                  >
                    {faq.question}
                  </span>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid oklch(0.72 0.14 75 / 40%)",
                      borderRadius: "50%",
                      transition: "all 200ms ease",
                      transform: openIndex === i ? "rotate(45deg)" : "none",
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <line x1="5" y1="1" x2="5" y2="9" stroke="oklch(0.72 0.14 75)" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="1" y1="5" x2="9" y2="5" stroke="oklch(0.72 0.14 75)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </button>

                <div
                  style={{
                    maxHeight: openIndex === i ? "400px" : "0",
                    overflow: "hidden",
                    transition: "max-height 350ms cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      fontSize: "0.9rem",
                      lineHeight: 1.8,
                      color: "oklch(0.60 0.01 285)",
                      paddingBottom: "1.5rem",
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
