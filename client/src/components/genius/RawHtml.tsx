/* Thin wrapper for the lifted string builders (wheel, grid, prose modules).
   The strings are generated locally from typed data — never from user input —
   so dangerouslySetInnerHTML is the deliberate rendering path here. */

interface RawHtmlProps {
  html: string;
  className?: string;
}

export default function RawHtml({ html, className }: RawHtmlProps) {
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
