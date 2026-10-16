import React from "react";

/** The business's logo, or its first letter on the brand colour when it hasn't uploaded one. */
export default function StoreLogo({ name, logo, size = 36 }: { name: string; logo?: string; size?: number }) {
  if (logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logo} alt="" width={size} height={size} className="shrink-0 rounded-lg object-contain" style={{ width: size, height: size }} />
    );
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-display text-base font-bold"
      style={{ width: size, height: size, background: "var(--brand)", color: "var(--brand-fg)" }}
      aria-hidden
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
