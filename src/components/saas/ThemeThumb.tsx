/** Mini wireframe of a storefront theme, drawn from its swatches. */
export default function ThemeThumb({ swatches, layout }: { swatches: [string, string, string]; layout: "classic" | "showcase" | "atelier" }) {
  const [bg, surface, accent] = swatches;
  return (
    <div className="h-28 overflow-hidden rounded-lg border border-gray-200 p-2 dark:border-gray-700" style={{ background: bg }} aria-hidden>
      <div className="mb-1.5 flex items-center gap-1.5 rounded px-1.5 py-1" style={{ background: surface }}>
        <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
        <span className="h-1.5 w-8 rounded" style={{ background: accent, opacity: 0.35 }} />
        <span className="ml-auto h-1.5 w-6 rounded" style={{ background: accent }} />
      </div>
      {layout === "atelier" ? (
        <div className="grid grid-cols-[1.2fr_1fr] gap-2 px-1 pt-1">
          <div>
            <div className="mb-1 h-1.5 w-1/3 rounded" style={{ background: accent, opacity: 0.6 }} />
            <div className="mb-1 h-3 w-5/6 rounded" style={{ background: accent }} />
            <div className="mb-2 h-1.5 w-2/3 rounded" style={{ background: accent, opacity: 0.3 }} />
            <div className="h-3 w-1/3 rounded-sm" style={{ background: accent }} />
          </div>
          <div className="h-[58px] rounded-sm" style={{ background: surface }} />
        </div>
      ) : layout === "showcase" ? (
        <div className="flex gap-1.5">
          <div className="h-14 flex-1 rounded" style={{ background: surface }} />
          <div className="flex w-1/3 flex-col gap-1.5">
            <div className="h-[26px] rounded" style={{ background: surface }} />
            <div className="h-[26px] rounded" style={{ background: surface }} />
          </div>
        </div>
      ) : (
        <div className="px-1 pt-1">
          <div className="mb-1.5 h-3 w-2/3 rounded" style={{ background: accent, opacity: 0.85 }} />
          <div className="mb-2 h-1.5 w-1/2 rounded" style={{ background: accent, opacity: 0.3 }} />
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => <div key={i} className="h-8 flex-1 rounded-xl" style={{ background: surface }} />)}
          </div>
        </div>
      )}
    </div>
  );
}

