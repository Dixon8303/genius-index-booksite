/* The intro's worked-example carousel, ported from the original: three sample
   results spanning different tiers (Canonical / Rarest / Strong Pair) so a
   first-time visitor sees the range of possible outputs before answering
   anything. Auto-advances every 4.5s, pauses on hover, and respects
   prefers-reduced-motion (dots still work, no autoplay). */

import { useEffect, useRef, useState } from "react";
import { BRAIDS, TIER_META } from "@/lib/genius/data/braids";
import { DOMAIN_BY_ID } from "@/lib/genius/data/domains";
import { braidImage } from "@/lib/genius/data/images";

const SAMPLE_BRAID_NAMES = ["The Storyteller", "The Diplomat", "The Optimizer"];

export default function SampleBraidCarousel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  /* Pick each slide's art once per mount so the carousel doesn't reshuffle
     images on every advance. */
  const artRef = useRef<Record<string, string>>({});
  if (Object.keys(artRef.current).length === 0) {
    SAMPLE_BRAID_NAMES.forEach((n) => (artRef.current[n] = braidImage(n)));
  }

  useEffect(() => {
    if (paused) return;
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const iv = setInterval(
      () => setIdx((i) => (i + 1) % SAMPLE_BRAID_NAMES.length),
      4500,
    );
    return () => clearInterval(iv);
  }, [paused]);

  return (
    <div style={{ margin: "14px 0 2px" }}>
      <div
        className="samplecarousel"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        {SAMPLE_BRAID_NAMES.map((name, i) => {
          const br = BRAIDS.find((b) => b.name === name)!;
          const d0 = DOMAIN_BY_ID[br.pair[0]],
            d1 = DOMAIN_BY_ID[br.pair[1]];
          const tm = TIER_META[br.tier];
          return (
            <div key={name} className={`braidcard sampleslide${i === idx ? " on" : ""}`}>
              <div className="yb">Example result</div>
              <div className="resultart heroart">
                <img src={artRef.current[name]} alt={name} loading="lazy" />
              </div>
              <div className="bname">{br.name}</div>
              <div className="bpair">
                <span className={`domchip ${d0.meta}`}>
                  <span className="dot"></span>
                  {d0.name}
                </span>
                <span className="amp">×</span>
                <span className={`domchip ${d1.meta}`}>
                  <span className="dot"></span>
                  {d1.name}
                </span>
              </div>
              <div className={`tierbadge tier-${br.tier}`}>
                {tm.label}
                {br.rare ? " · Rarest" : ""}
              </div>
              <div className="tiersub">{tm.sub}</div>
              <div className="braiddesc">{br.desc}</div>
            </div>
          );
        })}
      </div>
      <div className="sampledots">
        {SAMPLE_BRAID_NAMES.map((_, i) => (
          <button
            key={i}
            className={`sampledot${i === idx ? " on" : ""}`}
            aria-label={`Show example ${i + 1} of ${SAMPLE_BRAID_NAMES.length}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
      <p className="small dim" style={{ textAlign: "center", margin: "6px 0 2px" }}>
        Illustrative only — your own result depends entirely on your own
        answers.
      </p>
    </div>
  );
}
