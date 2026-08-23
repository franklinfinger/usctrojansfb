type StatItem = {
  label: string;
  value: string;
  hint?: string;
};

export default function StatGrid({ items }: { items: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-ink/8 bg-cream-card shadow-lift md:grid-cols-[repeat(auto-fit,minmax(140px,1fr))]">
      {items.map((item, i) => (
        <div
          key={`${item.label}-${i}`}
          className="border-b border-ink/8 p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
        >
          <p className="label-cap">{item.label}</p>
          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="stat-figure">{item.value}</p>
            {item.hint ? (
              <p className="pb-1 text-right text-[11px] uppercase tracking-wider text-ink-faint">
                {item.hint}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
