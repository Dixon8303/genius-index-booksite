/* Chapter spine for the longform results page (Category C pacing — the
   navigation-as-narrative-spine move). Scans the rendered .book sections,
   builds a fixed rail of chapter links (≥1024px only), tracks the active
   chapter, and wires the section-reveal choreography: each .book section
   gets .vdc-reveal and settles in as it enters the viewport. Reduced motion
   and no-JS paths keep everything visible (§5.4). */

import { useEffect, useState } from "react";

interface Chapter {
  id: string;
  label: string;
}

export default function ResultsSpine({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const books = Array.from(root.querySelectorAll<HTMLElement>(".book"));
    const found: Chapter[] = [];
    books.forEach((el, i) => {
      const heading = el.querySelector(".bt, .bname");
      const id = el.id || `chapter-${i}`;
      el.id = id;
      const label = heading?.textContent?.trim();
      if (label && label.length <= 40) found.push({ id, label });
    });
    setChapters(found);

    // Reveal choreography — only when JS is live, per §5.4.
    const giRoot = root.closest(".gi-book");
    giRoot?.classList.add("js-reveal");
    books.forEach((el) => el.classList.add("vdc-reveal"));
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            reveal.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -10% 0px" },
    );
    books.forEach((el) => reveal.observe(el));

    const spy = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-30% 0px -60% 0px" },
    );
    books.forEach((el) => spy.observe(el));

    return () => {
      reveal.disconnect();
      spy.disconnect();
      giRoot?.classList.remove("js-reveal");
      books.forEach((el) => el.classList.remove("vdc-reveal", "is-in"));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (chapters.length < 3) return null;
  return (
    <nav
      aria-label="Result chapters"
      className="results-spine"
      style={{
        position: "fixed",
        left: "max(8px, calc(50vw - 470px))",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 30,
        fontFamily: "var(--font-mono)",
        fontSize: 10.5,
        letterSpacing: ".04em",
        textTransform: "uppercase",
        lineHeight: 2,
      }}
    >
      {chapters.map((c) => (
        <a
          key={c.id}
          href={`#${c.id}`}
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById(c.id)
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          style={{
            display: "block",
            textDecoration: "none",
            color: active === c.id ? "var(--accent)" : "var(--fg-muted)",
            fontWeight: active === c.id ? 600 : 400,
            borderLeft:
              active === c.id
                ? "2px solid var(--accent)"
                : "2px solid var(--rule)",
            paddingLeft: 8,
            maxWidth: 150,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {c.label}
        </a>
      ))}
    </nav>
  );
}
