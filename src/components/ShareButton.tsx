"use client";

import { useCallback } from "react";

export default function ShareButton() {
  const handleShare = useCallback(async () => {
    const shareData = {
      title: "Convai - 대화 감정 분석",
      text: "카톡/인스타 대화 속 상대방의 관심도를 AI가 분석해줘요",
      url: "https://convai.app",
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // 폴백: 클립보드 복사
        await navigator.clipboard.writeText("https://convai.app");
        alert("링크가 복사되었습니다");
      }
    } catch (error) {
      // 사용자가 공유 취소한 경우 무시
      if ((error as Error).name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
  }, []);

  return (
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
          d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
        />
      </svg>
      친구에게 추천하기
    </button>
  );
}
