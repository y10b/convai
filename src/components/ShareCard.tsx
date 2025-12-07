"use client";

import { useRef, useCallback } from "react";
import { BasicAnalysis } from "@/types";

interface ShareCardProps {
  analysis: BasicAnalysis;
}

export default function ShareCard({ analysis }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;

    const html2canvas = (await import("html2canvas")).default;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        if (navigator.share && navigator.canShare) {
          const file = new File([blob], "convai-result.png", { type: "image/png" });

          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: "관계 온도",
              text: `관계 온도 ${analysis.temperature}°`,
            });
            return;
          }
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "convai-result.png";
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (error) {
      console.error("Share failed:", error);
    }
  }, [analysis.temperature]);

  return (
    <div className="space-y-4">
      {/* Share card preview */}
      <div
        ref={cardRef}
        className="w-full aspect-square rounded-lg bg-[var(--color-text-primary)] p-6 flex flex-col justify-between"
      >
        <p className="text-[12px] text-[var(--color-text-tertiary)]">
          convai
        </p>

        <div className="text-center">
          <p className="text-[72px] font-bold tracking-tight text-[var(--color-background)] leading-none">
            {analysis.temperature}°
          </p>
          <p className="text-[14px] text-[var(--color-border)] mt-2">
            {analysis.temperatureLabel}
          </p>
        </div>

        <div className="flex justify-between text-[12px] text-[var(--color-border)]">
          <span>나 {analysis.initiativeRatio.me}%</span>
          <span>상대 {analysis.initiativeRatio.other}%</span>
        </div>
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="w-full h-12 flex items-center justify-center gap-2 text-[15px] font-medium text-[var(--color-text-primary)] bg-[var(--color-surface)] hover:bg-[var(--color-border-light)] rounded-lg transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        이미지 저장
      </button>
    </div>
  );
}
