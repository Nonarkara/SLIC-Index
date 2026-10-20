/**
 * Footer brand lockup.
 *
 * This used to render public/Logos/slic-index-full.png — a 400×400 square raster
 * with blue and teal, neither of which is in the palette. Inside a 3.25rem box it
 * read as coloured mush and fought the cream ground. Live type is sharper at every
 * DPR, colourable from tokens, and costs no request.
 */
export default function BrandLockup({
  eyebrow,
  microCopy,
}: {
  eyebrow: string;
  microCopy: string;
}) {
  return (
    <div className="brand-lockup">
      <span className="brand-mark brand-mark--type" aria-hidden="true">
        SL
      </span>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <p className="micro-copy">{microCopy}</p>
      </div>
    </div>
  );
}