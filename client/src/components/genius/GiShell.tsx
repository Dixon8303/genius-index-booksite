/* Shared shell for all product pages: the original assessment's obsidian
   chrome (scoped as .gi-book), the 3×3 progress glyph, and the progress bar.
   Wraps children in the original .wrap column. */

import { Link, useLocation } from "wouter";
import "./BookTheme.css";

export function ProgressGlyph({ lit }: { lit: number }) {
  return (
    <div className="glyph" aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className={i < lit ? "lit" : ""} />
      ))}
    </div>
  );
}

interface GiShellProps {
  children: React.ReactNode;
  /* 0..1 fill of the progress bar; omit to hide the bar */
  progress?: number;
  /* how many of the 9 glyph cells are lit */
  litCells?: number;
  /* show the product nav row (hidden mid-assessment to keep focus) */
  nav?: boolean;
  /* widen the column for dashboard/explorer pages */
  wide?: boolean;
}

const NAV_LINKS = [
  { href: "/assessment", label: "Assessment" },
  { href: "/profile", label: "My Profile" },
  { href: "/protocol", label: "Protocol" },
  { href: "/braids", label: "Braids" },
  { href: "/domains", label: "Domains" },
];

export default function GiShell({
  children,
  progress,
  litCells = 0,
  nav = true,
  wide = false,
}: GiShellProps) {
  const [location] = useLocation();
  return (
    <div className="gi-book">
      <div className="wrap" style={wide ? { maxWidth: 920 } : undefined}>
        <header>
          <div>
            <Link href="/" className="eyebrow" style={{ textDecoration: "none" }}>
              The Genius Index
            </Link>
            <div className="sub">Find what you already carry</div>
          </div>
          <ProgressGlyph lit={litCells} />
        </header>
        {typeof progress === "number" && (
          <div className="prog">
            <i style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
        )}
        {nav && (
          <nav
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "14px",
              margin: "0 0 22px",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {NAV_LINKS.map((l) => {
              const active =
                location === l.href || location.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{
                    color: active ? "var(--brass)" : "var(--paper-dim)",
                    textDecoration: "none",
                    fontWeight: active ? 700 : 400,
                    borderBottom: active
                      ? "1px solid var(--brass)"
                      : "1px solid transparent",
                    paddingBottom: 2,
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        )}
        {children}
      </div>
    </div>
  );
}

/* The standing legal line from the book site's footer, carried onto every
   product page. */
export function LegalFootnote() {
  return (
    <p
      className="small dim"
      style={{ marginTop: 40, opacity: 0.7, lineHeight: 1.6 }}
    >
      The Genius Index™ assessment and the Genius Grid framework are works of
      E.A.T. Media. The self-assessment is a reflective and developmental tool,
      not a psychological test, clinical instrument, or diagnostic device.
    </p>
  );
}
