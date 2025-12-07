"use client";

import { useEffect, useState, useCallback } from "react";

interface AdModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onClose: () => void;
}

export default function AdModal({ isOpen, onComplete, onClose }: AdModalProps) {
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setCanClose(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-black/50" onClick={canClose ? onClose : undefined} />

      <div className="relative w-full max-w-sm bg-[var(--color-background)] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-12 border-b border-[var(--color-border-light)]">
          <span className="text-[13px] text-[var(--color-text-tertiary)]">
            광고
          </span>
          {canClose ? (
            <button
              onClick={handleComplete}
              className="text-[13px] text-[var(--color-text-primary)] font-medium"
            >
              닫기
            </button>
          ) : (
            <span className="text-[13px] text-[var(--color-text-tertiary)]">
              {countdown}초
            </span>
          )}
        </div>

        {/* Ad content */}
        <div className="aspect-video bg-[var(--color-surface)] flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-lg bg-[var(--color-border-light)] flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[var(--color-text-tertiary)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                />
              </svg>
            </div>
            <p className="text-[13px] text-[var(--color-text-tertiary)]">
              광고 영역
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-[var(--color-surface)]">
          <p className="text-[12px] text-[var(--color-text-tertiary)] text-center">
            광고 시청 후 상세 분석이 제공됩니다
          </p>
        </div>
      </div>
    </div>
  );
}
