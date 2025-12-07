"use client";

import { SituationType, SITUATION_OPTIONS } from "@/types";

interface SituationSelectProps {
  onSelect: (situation: SituationType) => void;
}

export default function SituationSelect({ onSelect }: SituationSelectProps) {
  return (
    <div className="space-y-3">
      {SITUATION_OPTIONS.map((option) => (
        <button
          key={option.type}
          onClick={() => onSelect(option.type)}
          className="w-full p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-text-secondary)] transition-all text-left group"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{option.emoji}</span>
            <div className="flex-1">
              <p className="text-[15px] font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]">
                {option.label}
              </p>
              <p className="text-[13px] text-[var(--color-text-tertiary)] mt-0.5">
                {option.description}
              </p>
            </div>
            <svg
              className="w-5 h-5 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)] mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>
      ))}
    </div>
  );
}
