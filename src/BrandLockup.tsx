/**
 * Footer brand lockup.
 *
 * This used to be a black square with "SL" set in it — a placeholder for a
 * mark the site did not have. It is now the real SLIC Index wordmark, taken
 * from the 400×400 master with the paper keyed out, so it sits on the cream
 * ground instead of inside a white plate.
 *
 * It is an image and not live type. The wordmark is the artwork; setting
 * "SLIC" in a system font would be a different mark wearing the same name.
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
      <img
        className="brand-mark"
        src="/Logos/slic-index-mark.png"
        alt="SLIC Index"
        width={389}
        height={247}
        loading="lazy"
        decoding="async"
      />
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <p className="micro-copy">{microCopy}</p>
      </div>
    </div>
  );
}
