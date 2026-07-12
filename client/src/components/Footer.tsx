/**
 * Footer — Dark Alchemy design
 * Minimal, elegant, with the Genius Grid logo
 */

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
              fill={isGold ? "oklch(0.72 0.14 75)" : "oklch(0.25 0.008 285)"}
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

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer
      style={{
        background: "oklch(0.08 0.008 285)",
        borderTop: "1px solid oklch(1 0 0 / 6%)",
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
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  letterSpacing: "0.08em",
                  color: "oklch(0.88 0.02 80)",
                  textTransform: "uppercase",
                }}
              >
                The Genius Index
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                color: "oklch(0.50 0.01 285)",
              }}
            >
              A System for Finding the Genius You Already Carry
            </p>
            <p
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: "0.75rem",
                color: "oklch(0.40 0.01 285)",
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
                  fontFamily: "'Lato', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "oklch(0.72 0.14 75)",
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
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      fontSize: "0.85rem",
                      color: "oklch(0.50 0.01 285)",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      padding: 0,
                      transition: "color 200ms ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "oklch(0.72 0.14 75)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.50 0.01 285)")}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "oklch(0.72 0.14 75)",
                  marginBottom: "1rem",
                }}
              >
                Get the Book
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Order Paperback", href: "#get-book" },
                  { label: "Get eBook", href: "#get-book" },
                  { label: "Online Assessment", href: "#get-book" },
                ].map(link => (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      fontSize: "0.85rem",
                      color: "oklch(0.50 0.01 285)",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      padding: 0,
                      transition: "color 200ms ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "oklch(0.72 0.14 75)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.50 0.01 285)")}
                  >
                    {link.label}
                  </button>
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
              fontFamily: "'Lato', sans-serif",
              fontSize: "0.75rem",
              color: "oklch(0.38 0.01 285)",
            }}
          >
            © {currentYear} D. Antione Dixon / E.A.T. Media. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: "0.72rem",
              color: "oklch(0.35 0.01 285)",
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
