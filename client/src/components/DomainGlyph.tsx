/**
 * DomainGlyph — the book's nine domain glyphs: abstract, non-pictorial
 * hairline marks, one per domain, built on a shared 48x48 optical square
 * (the arc, the ring, the point, and a faint secondary echo). Sourced
 * verbatim from the book's official glyph system file. currentColor-based
 * so the wrapping element's `color` sets the stroke.
 */

const GLYPHS: Record<string, string> = {
  KIN: `<path vector-effect="non-scaling-stroke" d="M10 33C18 22 30 16 38 14"></path><path vector-effect="non-scaling-stroke" stroke-opacity=".36" d="M9 37C17 26 29 20 36 18"></path><path vector-effect="non-scaling-stroke" stroke-opacity=".17" d="M9 40.5C16.5 30.5 28 24.5 34.5 22.5"></path><path vector-effect="non-scaling-stroke" stroke-width="2.4" d="M38 14h0.02"></path>`,
  SEN: `<path vector-effect="non-scaling-stroke" d="M30.86 17.87A8 8 0 0 0 30.86 30.13"></path><path vector-effect="non-scaling-stroke" stroke-opacity=".68" d="M27 13.28A14 14 0 0 0 27 34.72"></path><path vector-effect="non-scaling-stroke" stroke-opacity=".42" d="M23.14 8.68A20 20 0 0 0 23.14 39.32"></path><path vector-effect="non-scaling-stroke" stroke-width="2.4" d="M36 24h0.02"></path>`,
  ADP: `<circle vector-effect="non-scaling-stroke" stroke-opacity=".32" cx="24" cy="24" r="14"></circle><ellipse vector-effect="non-scaling-stroke" cx="24" cy="24" rx="12.3" ry="16.6"></ellipse>`,
  ANL: `<path vector-effect="non-scaling-stroke" stroke-opacity=".32" d="M12 13L36 13"></path><path vector-effect="non-scaling-stroke" stroke-opacity=".32" d="M12 13L24 25"></path><path vector-effect="non-scaling-stroke" stroke-opacity=".32" d="M36 13L24 25"></path><path vector-effect="non-scaling-stroke" stroke-opacity=".5" d="M24 13L24 25"></path><path vector-effect="non-scaling-stroke" d="M24 25L24 38"></path><path vector-effect="non-scaling-stroke" stroke-width="2.2" d="M12 13h0.02"></path><path vector-effect="non-scaling-stroke" stroke-width="2.2" d="M24 13h0.02"></path><path vector-effect="non-scaling-stroke" stroke-width="2.2" d="M36 13h0.02"></path><path vector-effect="non-scaling-stroke" stroke-width="2.4" d="M24 25h0.02"></path><path vector-effect="non-scaling-stroke" stroke-width="2.9" d="M24 38h0.02"></path>`,
  MEM: `<circle vector-effect="non-scaling-stroke" cx="18.5" cy="24" r="10"></circle><circle vector-effect="non-scaling-stroke" cx="29.5" cy="24" r="10"></circle>`,
  GEN: `<path vector-effect="non-scaling-stroke" d="M24 24L24 8"></path><path vector-effect="non-scaling-stroke" d="M24 24L34 14.5"></path><path vector-effect="non-scaling-stroke" d="M24 24L42 26"></path><path vector-effect="non-scaling-stroke" d="M24 24L32 32"></path><path vector-effect="non-scaling-stroke" d="M24 24L23 39"></path><path vector-effect="non-scaling-stroke" d="M24 24L13.5 31"></path><path vector-effect="non-scaling-stroke" d="M24 24L12 20"></path><path vector-effect="non-scaling-stroke" stroke-width="2.7" d="M24 24h0.02"></path>`,
  REL: `<path vector-effect="non-scaling-stroke" d="M22 11A13.45 13.45 0 0 0 22 37"></path><path vector-effect="non-scaling-stroke" d="M27 15A9 9 0 0 1 27 33"></path>`,
  EXP: `<path vector-effect="non-scaling-stroke" d="M30.93 20A8 8 0 1 1 17.07 20"></path><path vector-effect="non-scaling-stroke" d="M30 34.39A12 12 0 1 1 30 13.61"></path><path vector-effect="non-scaling-stroke" d="M10.14 32A16 16 0 1 1 37.86 32"></path><path vector-effect="non-scaling-stroke" d="M14 6.68A20 20 0 1 1 14 41.32"></path><path vector-effect="non-scaling-stroke" stroke-width="2.8" d="M24 24h0.02"></path>`,
  PER: `<rect vector-effect="non-scaling-stroke" x="7" y="7" width="34" height="34" rx="6"></rect><path vector-effect="non-scaling-stroke" stroke-opacity=".28" d="M11 31L31 31"></path><path vector-effect="non-scaling-stroke" stroke-width="2.4" d="M13 31h0.02"></path><path vector-effect="non-scaling-stroke" stroke-width="2.4" d="M21 31h0.02"></path><path vector-effect="non-scaling-stroke" stroke-width="2.4" d="M29 31h0.02"></path><path vector-effect="non-scaling-stroke" stroke-width="2.4" d="M33 15h0.02"></path>`,
};

export type DomainGlyphId = keyof typeof GLYPHS;

export default function DomainGlyph({
  domain,
  size = 32,
  className,
  style,
}: {
  domain: DomainGlyphId;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.15}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "block", ...style }}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: GLYPHS[domain] }}
    />
  );
}
