/**
 * Footer — Dark Alchemy design
 * Minimal, elegant, with the Genius Grid logo
 */

import type { MouseEvent } from "react";
import { WHAT_HISTORY_BURIED_URL, BLACK_GENIUS_FILES_URL, EAT_MEDIA_URL } from "@/lib/config";

function GeniusGridLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      {[0,1,2].map(row =>
        [0,1,2].map(col => {
          const isGold = row === 0 && col === 2;
          const x = col * 10 + col * 1;
          const y = row * 10 + row * 1;
          return (
            <rect
              key={`${row}-${col}`}
              x={x}
              y={y}
              width={10}
              height={10}
              fill={isGold ? "var(--accent)" : "var(--rule)"}
              rx={1}
            />
          );
        })
      )}
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Real anchors (not buttons) so every nav item has a working href -- a
  // shareable URL, a working browser back button, and a functioning fallback
  // if JS hasn't hydrated yet -- with the smooth-scroll as an enhancement on
  // top, not the only way the link works.
  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer
      style={{
        background: "var(--print-100)",
        borderTop: "1px solid rgb(10 9 7 / 6%)",
        padding: "4rem 0 2rem",
      }}
    >
      <div className="container">
        {/* Top row */}
        <div className="flex flex-col md:flex-row gap-8 justify-between mb-12">

          {/* Brand */}
          <div style={{ maxWidth: "320px" }}>
            <div className="flex items-center gap-3 mb-4">
              <GeniusGridLogo size={24} />
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontWeight: 700,
                  fontSize: "1.0625rem",
                  letterSpacing: "0.08em",
                  color: "var(--fg)",
                  textTransform: "uppercase",
                }}
              >
                The Genius Index
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: "1.0625rem",
                lineHeight: 1.7,
                color: "var(--print-500)",
              }}
            >
              A System for Finding the Genius You Already Carry
            </p>
            <p
              style={{
                fontFamily: "'Newsreader', sans-serif",
                fontSize: "1rem",
                color: "var(--print-400)",
                marginTop: "0.75rem",
              }}
            >
              By D. Antione Dixon · E.A.T. Media
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap gap-12">
            <div>
              <p
                style={{
                  fontFamily: "'Newsreader', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: "1rem",
                }}
              >
                Explore
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "The Book", href: "#book" },
                  { label: "The Framework", href: "#framework" },
                  { label: "Nine Domains", href: "#domains" },
                  { label: "The Author", href: "#author" },
                  { label: "FAQ", href: "#faq" },
                ].map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={e => handleNavClick(e, link.href)}
                    style={{
                      fontFamily: "'Newsreader', sans-serif",
                      fontSize: "1.0625rem",
                      color: "var(--fg-muted)",
                      textAlign: "left",
                      textDecoration: "none",
                      transition: "color 200ms ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--fg-muted)")}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p
                style={{
                  fontFamily: "'Newsreader', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: "1rem",
                }}
              >
                Get the Book
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Take the Assessment", href: "#get-book" },
                  { label: "Free Braid Companion", href: "#get-book" },
                  { label: "Paperback (Coming Soon)", href: "#get-book" },
                ].map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={e => handleNavClick(e, link.href)}
                    style={{
                      fontFamily: "'Newsreader', sans-serif",
                      fontSize: "1.0625rem",
                      color: "var(--fg-muted)",
                      textAlign: "left",
                      textDecoration: "none",
                      transition: "color 200ms ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--fg-muted)")}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p
                style={{
                  fontFamily: "'Newsreader', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: "1rem",
                }}
              >
                More From The Author
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "What History Buried", href: WHAT_HISTORY_BURIED_URL },
                  { label: "The Black Genius Files", href: BLACK_GENIUS_FILES_URL },
                  { label: "E.A.T. Media", href: EAT_MEDIA_URL },
                ].map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener"
                    style={{
                      fontFamily: "'Newsreader', sans-serif",
                      fontSize: "1.0625rem",
                      color: "var(--fg-muted)",
                      textAlign: "left",
                      textDecoration: "none",
                      transition: "color 200ms ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--fg-muted)")}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gold rule */}
        <div className="gold-rule mb-6" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <p
            style={{
              fontFamily: "'Newsreader', sans-serif",
              fontSize: "1rem",
              color: "var(--fg-muted)",
            }}
          >
            © {currentYear} D. Antione Dixon / E.A.T. Media. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: "'Newsreader', sans-serif",
              fontSize: "0.95rem",
              color: "var(--fg-muted)",
              maxWidth: "420px",
              lineHeight: 1.6,
            }}
          >
            The Genius Index™ assessment and the Genius Grid framework are works of E.A.T. Media. The self-assessment is a reflective and developmental tool, not a psychological test, clinical instrument, diagnosis, or measure of intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
}
