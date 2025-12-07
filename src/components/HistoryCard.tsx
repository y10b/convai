"use client";

import { useEffect, useState } from "react";
import { getHistory, getTemperatureChange, AnalysisHistory } from "@/lib/history";

interface HistoryCardProps {
  currentTemperature?: number;
}

export default function HistoryCard({ currentTemperature }: HistoryCardProps) {
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [change, setChange] = useState<number | null>(null);

  useEffect(() => {
    setHistory(getHistory());
    setChange(getTemperatureChange());
  }, []);

  if (history.length < 2) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="p-4 rounded-lg bg-[var(--color-surface)]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] text-[var(--color-text-tertiary)]">
          온도 변화
        </p>
        {change !== null && (
          <span
            className={`text-[13px] font-medium ${
              change > 0
                ? "text-[#34c759]"
                : change < 0
                ? "text-[#ff3b30]"
                : "text-[var(--color-text-tertiary)]"
            }`}
          >
            {change > 0 ? "+" : ""}
            {change}°
          </span>
        )}
      </div>

      {/* 미니 히스토리 */}
      <div className="flex items-end gap-1 h-12">
        {history.slice(0, 5).reverse().map((item, i) => (
          <div key={item.id} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-[var(--color-text-primary)] rounded-sm transition-all"
              style={{ height: `${(item.temperature / 100) * 40}px` }}
            />
            <span className="text-[10px] text-[var(--color-text-tertiary)]">
              {formatDate(item.date)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
