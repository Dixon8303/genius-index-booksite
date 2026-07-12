/**
 * Navigation — Dark Alchemy design
 * Transparent over hero, transitions to dark glass on scroll
 * Brand: Genius Grid logo (3x3 with gold top-right cell)
 */

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "The Book", href: "#book" },
  { label: "The Framework", href: "#framework" },
  { label: "Nine Domains", href: "#domains" },
  { label: "The Author", href: "#author" },
];

function GeniusGridLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 3x3 grid — top-right cell glows gold */}
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
              fill={isGold ? "oklch(0.72 0.14 75)" : "oklch(0.25 0.008 285)"}
              rx={1}
            />
          );
        })
      )}
    </svg>
  );
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? "oklch(0.10 0.008 285 / 92%)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid oklch(1 0 0 / 8%)" : "1px solid transparent",
      }}
    >
      <div className="container">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 group"
            aria-label="The Genius Index — home"
          >
            <GeniusGridLogo size={28} />
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "0.95rem",
                letterSpacing: "0.08em",
                color: "oklch(0.92 0.02 80)",
                textTransform: "uppercase",
              }}
            >
              The Genius Index
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "oklch(0.70 0.01 285)",
                  transition: "color 200ms ease",
                  background: "none",
                  border: "none",
                  padding: "0.25rem 0",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "oklch(0.72 0.14 75)")}
                onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.70 0.01 285)")}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick("#get-book")}
              className="btn-gold"
              style={{ padding: "0.5rem 1.5rem", fontSize: "0.7rem" }}
            >
              Get the Book
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="block w-6 h-0.5 transition-all duration-300"
              style={{
                background: "oklch(0.92 0.02 80)",
                transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none",
              }}
            />
            <span
              className="block w-6 h-0.5 transition-all duration-300"
              style={{
                background: "oklch(0.92 0.02 80)",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-6 h-0.5 transition-all duration-300"
              style={{
                background: "oklch(0.92 0.02 80)",
                transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none",
              }}
            />
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? "400px" : "0",
          background: "oklch(0.10 0.008 285 / 96%)",
          backdropFilter: "blur(16px)",
          borderBottom: menuOpen ? "1px solid oklch(1 0 0 / 8%)" : "none",
        }}
      >
        <div className="container py-6 flex flex-col gap-4">
          {NAV_LINKS.map(link => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              style={{
                fontFamily: "'Lato', sans-serif",
                fontWeight: 400,
                fontSize: "0.85rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "oklch(0.70 0.01 285)",
                textAlign: "left",
                background: "none",
                border: "none",
                padding: "0.5rem 0",
              }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick("#get-book")}
            className="btn-gold"
            style={{ alignSelf: "flex-start" }}
          >
            Get the Book
          </button>
        </div>
      </div>
    </header>
  );
}
