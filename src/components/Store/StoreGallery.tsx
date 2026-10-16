"use client";
import React, { useState } from "react";
import ProductArt from "./ProductArt";

const ring = { ["--tw-ring-color" as string]: "var(--line)" } as React.CSSProperties;

/** Product photo viewer: big picture, thumbnails and previous/next arrows. */
export default function StoreGallery({ title, images, color }: { title: string; images: string[]; color?: string }) {
  const [active, setActive] = useState(0);
  const count = images.length;
  const index = Math.min(active, Math.max(count - 1, 0));

  if (count === 0) {
    return (
      <div className="mx-auto aspect-[4/5] w-full max-w-[560px] overflow-hidden rounded-3xl">
        <ProductArt seed={title} label={title} color={color} />
      </div>
    );
  }

  const go = (d: number) => setActive((index + d + count) % count);
  const arrow =
    "absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-dark shadow-md ring-1 ring-inset ring-[color:var(--line)] duration-200 hover:bg-white";

  return (
    <div
      className="mx-auto w-full max-w-[560px]"
      role="group"
      aria-roledescription="carousel"
      aria-label={`${title} photos`}
      onKeyDown={(e) => {
        if (count < 2) return;
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-[color:var(--tint)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={index} src={images[index]} alt={count > 1 ? `${title}, photo ${index + 1} of ${count}` : title} className="h-full w-full object-cover" />
        {count > 1 && (
          <>
            <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className={`${arrow} left-3`}>‹</button>
            <button type="button" aria-label="Next photo" onClick={() => go(1)} className={`${arrow} right-3`}>›</button>
            <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-custom-xs font-medium text-dark" aria-hidden>
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>
      {count > 1 && (
        <ul className="mt-4 grid grid-cols-5 gap-3 sm:grid-cols-6">
          {images.map((src, i) => (
            <li key={i}>
              <button
                type="button"
                aria-label={`Show photo ${i + 1}`}
                aria-pressed={i === index}
                onClick={() => setActive(i)}
                className={`block aspect-square w-full overflow-hidden rounded-xl ring-2 ring-inset duration-200 ${i === index ? "" : "opacity-70 hover:opacity-100"}`}
                style={i === index ? { ["--tw-ring-color" as string]: "var(--brand)" } : ring}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
