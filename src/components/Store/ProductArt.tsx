import React, { useId } from "react";
import { hash, mix } from "@/lib/storeTheme";

/**
 * Placeholder artwork for products without a photo: a woven-textile pattern
 * (diamonds, adire dots, mudcloth zig-zags, scales, kente bands, crosses)
 * picked from the product name, with an arch "window" holding the initial.
 * Deterministic, so a product always keeps the same picture.
 */
const MOTIFS = ["diamonds", "dots", "zigzag", "scales", "bands", "crosses"] as const;

function Motif({ kind, stroke }: { kind: (typeof MOTIFS)[number]; stroke: string }) {
  const common = { fill: "none", stroke, strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (kind) {
    case "diamonds":
      return (
        <>
          <path d="M10 1 19 10 10 19 1 10Z" {...common} />
          <path d="M10 6 14 10 10 14 6 10Z" {...common} />
        </>
      );
    case "dots":
      return (
        <>
          <circle cx="5" cy="5" r="2" fill={stroke} />
          <circle cx="15" cy="15" r="2" fill={stroke} />
          <circle cx="15" cy="5" r="0.9" fill={stroke} />
          <circle cx="5" cy="15" r="0.9" fill={stroke} />
        </>
      );
    case "zigzag":
      return (
        <>
          <path d="M0 6 5 2 10 6 15 2 20 6" {...common} />
          <path d="M0 16 5 12 10 16 15 12 20 16" {...common} />
        </>
      );
    case "scales":
      return (
        <>
          <path d="M0 20A10 10 0 0 1 20 20" {...common} />
          <path d="M-10 10A10 10 0 0 1 10 10" {...common} />
          <path d="M10 10A10 10 0 0 1 30 10" {...common} />
        </>
      );
    case "bands":
      return (
        <>
          <path d="M0 4H20M0 10H20M0 16H20" {...common} />
          <path d="M4 0V20M14 0V20" {...common} strokeDasharray="2 3" />
        </>
      );
    default:
      return (
        <>
          <path d="M10 5V15M5 10H15" {...common} />
          <path d="M0 0 2 2M20 0 18 2M0 20 2 18M20 20 18 18" {...common} />
        </>
      );
  }
}

export default function ProductArt({
  seed,
  label,
  color = "#E5E7EB",
  className = "",
  showInitial = true,
}: {
  seed: string;
  label?: string;
  color?: string;
  className?: string;
  showInitial?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const h = hash(seed);
  const kind = MOTIFS[h % MOTIFS.length];
  const size = 14 + (h % 3) * 3; // pattern scale varies a little per product
  const ink = mix(color, "#000000", 0.55);
  const stroke = mix(color, "#000000", 0.14);
  const window = mix(color, "#ffffff", 0.72);
  const initial = (label ?? seed).trim().charAt(0).toUpperCase();

  return (
    <svg
      role="img"
      aria-label={label ?? seed}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={`block w-full h-full ${className}`}
    >
      <defs>
        <pattern id={`p${uid}`} width="20" height="20" patternUnits="userSpaceOnUse" patternTransform={`scale(${size / 20}) rotate(${(h >> 3) % 2 ? 0 : 45} 10 10)`}>
          <Motif kind={kind} stroke={stroke} />
        </pattern>
      </defs>
      <rect width="100" height="100" fill={color} />
      <rect width="100" height="100" fill={`url(#p${uid})`} />
      {showInitial && (
        <>
          <path d="M30 78V48a20 20 0 0 1 40 0v30Z" fill={window} />
          <path d="M30 78V48a20 20 0 0 1 40 0v30Z" fill="none" stroke={ink} strokeOpacity="0.22" strokeWidth="0.8" />
          <text
            x="50"
            y="64"
            textAnchor="middle"
            fontSize="22"
            fontWeight="700"
            fill={ink}
            style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
          >
            {initial}
          </text>
        </>
      )}
    </svg>
  );
}
