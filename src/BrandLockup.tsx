import { slicLogo } from "./brandAssets";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

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
        <img src={`${BASE}${slicLogo.src}`} alt={slicLogo.alt} width={slicLogo.width} height={slicLogo.height} />
      </span>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <p className="micro-copy">{microCopy}</p>
      </div>
    </div>
  );
}
