import { slicLogo } from "./brandAssets";

export default function BrandLockup({
  eyebrow,
  microCopy,
}: {
  eyebrow: string;
  microCopy: string;
}) {
  return (
    <div className="brand-lockup">
      <span className="brand-mark brand-mark-image" aria-hidden="true">
        <img src={slicLogo.src} alt={slicLogo.alt} />
      </span>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <p className="micro-copy">{microCopy}</p>
      </div>
    </div>
  );
}
