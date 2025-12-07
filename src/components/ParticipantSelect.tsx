"use client";

interface ParticipantSelectProps {
  participants: string[];
  selectedName: string | null;
  onSelect: (name: string) => void;
}

export default function ParticipantSelect({
  participants,
  selectedName,
  onSelect,
}: ParticipantSelectProps) {
  return (
    <div className="space-y-2" role="radiogroup" aria-label="참여자 선택">
      {participants.map((name) => (
        <button
          key={name}
          onClick={() => onSelect(name)}
          className={`
            w-full flex items-center gap-3 p-4 rounded-lg transition-colors text-left
            ${selectedName === name
              ? "bg-[var(--color-text-primary)] text-[var(--color-background)]"
              : "bg-[var(--color-surface)] hover:bg-[var(--color-border-light)] text-[var(--color-text-primary)]"
            }
          `}
          role="radio"
          aria-checked={selectedName === name}
        >
          <div
            className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
              ${selectedName === name
                ? "border-[var(--color-background)]"
                : "border-[var(--color-border)]"
              }
            `}
          >
            {selectedName === name && (
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-background)]" />
            )}
          </div>
          <span className="text-[15px] font-medium">{name}</span>
        </button>
      ))}
    </div>
  );
}
