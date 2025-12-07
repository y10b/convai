"use client";

interface PlatformSelectProps {
  onSelect: (platform: "kakao" | "instagram") => void;
}

export default function PlatformSelect({ onSelect }: PlatformSelectProps) {
  return (
    <div className="space-y-3" role="group" aria-label="플랫폼 선택">
      <button
        onClick={() => onSelect("kakao")}
        className="w-full flex items-center gap-4 p-4 bg-[var(--color-surface)] hover:bg-[var(--color-border-light)] rounded-lg transition-colors text-left group"
        aria-label="카카오톡 선택"
      >
        <div className="w-11 h-11 rounded-lg bg-[#FEE500] flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#391B1B" aria-hidden="true">
            <path d="M12 3C6.48 3 2 6.58 2 11c0 2.8 1.86 5.26 4.64 6.67-.15.52-.62 2.04-.7 2.36-.1.4.14.4.3.29.12-.08 1.94-1.32 2.73-1.86.65.1 1.33.15 2.03.15 5.52 0 10-3.58 10-8S17.52 3 12 3z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-medium text-[var(--color-text-primary)]">
            카카오톡
          </p>
          <p className="text-[13px] text-[var(--color-text-secondary)] mt-0.5">
            채팅방에서 대화 내보내기
          </p>
        </div>
        <svg
          className="w-5 h-5 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)] transition-colors flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      <button
        onClick={() => onSelect("instagram")}
        className="w-full flex items-center gap-4 p-4 bg-[var(--color-surface)] hover:bg-[var(--color-border-light)] rounded-lg transition-colors text-left group"
        aria-label="인스타그램 선택"
      >
        <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-medium text-[var(--color-text-primary)]">
            인스타그램
          </p>
          <p className="text-[13px] text-[var(--color-text-secondary)] mt-0.5">
            DM 데이터 다운로드
          </p>
        </div>
        <svg
          className="w-5 h-5 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)] transition-colors flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}
