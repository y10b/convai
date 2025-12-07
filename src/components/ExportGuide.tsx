"use client";

import { useState } from "react";

interface ExportGuideProps {
  platform: "kakao" | "instagram";
  onComplete: () => void;
  onBack: () => void;
}

const KAKAO_STEPS = [
  { title: "채팅방 열기", description: "분석할 1:1 채팅방을 열어주세요" },
  { title: "메뉴 열기", description: "우측 상단 ≡ 버튼을 눌러주세요" },
  { title: "대화 내보내기", description: "'대화 내용 내보내기'를 선택해주세요" },
  { title: "저장", description: "'텍스트로 저장'을 선택하고 저장해주세요" },
];

const INSTAGRAM_STEPS = [
  { title: "설정 열기", description: "프로필 → 설정 → 계정 센터" },
  { title: "정보 및 권한", description: "'내 정보 및 권한'을 선택해주세요" },
  { title: "정보 다운로드", description: "'내 정보 다운로드' → '정보 일부 다운로드'" },
  { title: "메시지 선택", description: "'메시지'만 선택, JSON 형식으로 요청" },
];

export default function ExportGuide({ platform, onComplete, onBack }: ExportGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = platform === "kakao" ? KAKAO_STEPS : INSTAGRAM_STEPS;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <button
          onClick={onBack}
          className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          ← 다른 앱 선택
        </button>
        <h1 className="text-[28px] font-bold tracking-tight text-[var(--color-text-primary)]">
          대화 내보내기
        </h1>
      </div>

      {/* Progress */}
      <div className="flex gap-1">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= currentStep ? "bg-[var(--color-text-primary)]" : "bg-[var(--color-border)]"
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="py-8">
        <div className="space-y-2">
          <p className="text-[13px] font-medium text-[var(--color-text-tertiary)]">
            {currentStep + 1}/{steps.length}
          </p>
          <h2 className="text-[22px] font-semibold text-[var(--color-text-primary)]">
            {steps[currentStep].title}
          </h2>
          <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed">
            {steps[currentStep].description}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="flex-1 h-12 text-[15px] font-medium text-[var(--color-text-primary)] bg-[var(--color-surface)] hover:bg-[var(--color-border-light)] rounded-lg transition-colors"
            >
              이전
            </button>
          )}
          <button
            onClick={() => (isLastStep ? onComplete() : setCurrentStep((s) => s + 1))}
            className="flex-1 h-12 text-[15px] font-medium text-[var(--color-background)] bg-[var(--color-text-primary)] hover:opacity-90 rounded-lg transition-opacity"
          >
            {isLastStep ? "파일 업로드하기" : "다음"}
          </button>
        </div>

        {/* App link */}
        {platform === "kakao" ? (
          <a
            href="kakaotalk://launch"
            className="block w-full h-12 leading-[48px] text-center text-[15px] font-medium text-[#391B1B] bg-[#FEE500] hover:bg-[#FDD800] rounded-lg transition-colors"
          >
            카카오톡 열기
          </a>
        ) : (
          <a
            href="instagram://app"
            className="block w-full h-12 leading-[48px] text-center text-[15px] font-medium text-white bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] hover:opacity-90 rounded-lg transition-opacity"
          >
            인스타그램 열기
          </a>
        )}
      </div>
    </div>
  );
}
