"use client";

interface TemperatureGaugeProps {
  temperature: number;
  label: string;
}

export default function TemperatureGauge({
  temperature,
  label,
}: TemperatureGaugeProps) {
  const getGradient = () => {
    if (temperature >= 70) return "from-orange-400 to-red-500";
    if (temperature >= 50) return "from-yellow-400 to-orange-400";
    if (temperature >= 30) return "from-blue-300 to-yellow-400";
    return "from-blue-500 to-blue-300";
  };

  const getEmoji = () => {
    if (temperature >= 90) return "🔥";
    if (temperature >= 70) return "💕";
    if (temperature >= 50) return "🤔";
    if (temperature >= 30) return "🧊";
    return "❄️";
  };

  return (
    <div
      className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)]"
      role="figure"
      aria-label={`관계 온도: ${temperature}도, ${label}`}
    >
      <div className="relative">
        <svg
          width="200"
          height="120"
          viewBox="0 0 200 120"
          className="overflow-visible"
          aria-hidden="true"
        >
          {/* 배경 반원 */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* 게이지 반원 */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gauge-gradient)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={`${(temperature / 100) * 251.2} 251.2`}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex items-center justify-center pt-4">
          <div className="text-center">
            <span className="text-4xl" role="img" aria-hidden="true">
              {getEmoji()}
            </span>
            <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">
              {temperature}°C
            </p>
          </div>
        </div>
      </div>

      <div
        className={`
          px-4 py-2 rounded-full text-sm font-medium
          bg-gradient-to-r ${getGradient()} text-white
        `}
      >
        {label}
      </div>
    </div>
  );
}
