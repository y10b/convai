"use client";

interface StatCardProps {
  title: string;
  myValue: number | string;
  otherValue: number | string;
  unit?: string;
  myLabel?: string;
  otherLabel?: string;
  showBar?: boolean;
}

export default function StatCard({
  title,
  myValue,
  otherValue,
  unit = "",
  myLabel = "나",
  otherLabel = "상대",
  showBar = false,
}: StatCardProps) {
  const myNum = typeof myValue === "number" ? myValue : parseFloat(myValue) || 0;
  const otherNum = typeof otherValue === "number" ? otherValue : parseFloat(otherValue) || 0;
  const total = myNum + otherNum;
  const myPercent = total > 0 ? (myNum / total) * 100 : 50;

  return (
    <article
      className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]"
      aria-labelledby={`stat-${title.replace(/\s/g, "-")}`}
    >
      <h3
        id={`stat-${title.replace(/\s/g, "-")}`}
        className="text-sm font-medium text-[var(--color-text-secondary)] mb-4"
      >
        {title}
      </h3>

      <div className="flex justify-between items-end gap-4">
        <div className="text-center flex-1">
          <p className="text-xs text-[var(--color-text-tertiary)] mb-1">
            {myLabel}
          </p>
          <p className="text-2xl font-semibold text-[var(--color-primary)]">
            {myValue}
            <span className="text-sm font-normal text-[var(--color-text-tertiary)] ml-0.5">
              {unit}
            </span>
          </p>
        </div>

        <div className="text-[var(--color-text-tertiary)] text-sm">vs</div>

        <div className="text-center flex-1">
          <p className="text-xs text-[var(--color-text-tertiary)] mb-1">
            {otherLabel}
          </p>
          <p className="text-2xl font-semibold text-[var(--color-secondary)]">
            {otherValue}
            <span className="text-sm font-normal text-[var(--color-text-tertiary)] ml-0.5">
              {unit}
            </span>
          </p>
        </div>
      </div>

      {showBar && (
        <div
          className="mt-4 h-2 rounded-full bg-[var(--color-border)] overflow-hidden"
          role="progressbar"
          aria-valuenow={myPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${myLabel} ${Math.round(myPercent)}%`}
        >
          <div
            className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-full transition-all duration-500"
            style={{ width: `${myPercent}%` }}
          />
        </div>
      )}
    </article>
  );
}
