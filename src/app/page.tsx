"use client";

import { useState, useCallback, useEffect } from "react";
import PlatformSelect from "@/components/PlatformSelect";
import ExportGuide from "@/components/ExportGuide";
import FileUpload from "@/components/FileUpload";
import ParticipantSelect from "@/components/ParticipantSelect";
import SituationSelect from "@/components/SituationSelect";
import AnalysisResult from "@/components/AnalysisResult";
import ShareCard from "@/components/ShareCard";
import AdBanner from "@/components/AdBanner";
import HistoryCard from "@/components/HistoryCard";
import ShareButton from "@/components/ShareButton";
import { parseConversation } from "@/lib/parser";
import { analyzeBasic } from "@/lib/analyzer";
import { saveAnalysis, getLastAnalysis, AnalysisHistory } from "@/lib/history";
import { ParsedConversation, BasicAnalysis, DetailedAnalysis, SituationType, SITUATION_OPTIONS } from "@/types";

type Step = "platform" | "guide" | "upload" | "select" | "situation" | "analyzing" | "result";

export default function Home() {
  const [step, setStep] = useState<Step>("platform");
  const [platform, setPlatform] = useState<"kakao" | "instagram" | null>(null);
  const [conversation, setConversation] = useState<ParsedConversation | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [basicAnalysis, setBasicAnalysis] = useState<BasicAnalysis | null>(null);
  const [detailedAnalysis, setDetailedAnalysis] = useState<DetailedAnalysis | null>(null);
  const [situationType, setSituationType] = useState<SituationType | null>(null);
  const [isLoadingDetailed, setIsLoadingDetailed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adCountdown, setAdCountdown] = useState(0);
  const [lastAnalysis, setLastAnalysis] = useState<AnalysisHistory | null>(null);

  useEffect(() => {
    setLastAnalysis(getLastAnalysis());
  }, []);

  const handlePlatformSelect = useCallback((selectedPlatform: "kakao" | "instagram") => {
    setPlatform(selectedPlatform);
    setStep("guide");
  }, []);

  const handleGuideComplete = useCallback(() => {
    setStep("upload");
  }, []);

  const handleGuideBack = useCallback(() => {
    setStep("platform");
    setPlatform(null);
  }, []);

  const handleFileSelect = useCallback((content: string) => {
    setError(null);
    const parsed = parseConversation(content);

    if (!parsed) {
      setError("지원하지 않는 파일 형식입니다.");
      return;
    }

    if (parsed.messages.length === 0) {
      setError("최근 7일간의 대화가 없습니다.");
      return;
    }

    if (parsed.participants.length < 2) {
      setError("대화 참여자가 2명 이상이어야 합니다.");
      return;
    }

    setConversation(parsed);
    setStep("select");
  }, []);

  const handleNameSelect = useCallback(
    (name: string) => {
      if (!conversation || !platform) return;

      setSelectedName(name);
      const result = analyzeBasic(conversation, name);
      setBasicAnalysis(result);
      saveAnalysis(result, platform);
      setStep("situation");
    },
    [conversation, platform]
  );

  const handleSituationSelect = useCallback(
    async (situation: SituationType) => {
      if (!conversation || !selectedName || !basicAnalysis) return;

      setSituationType(situation);
      setStep("analyzing");
      setIsLoadingDetailed(true);
      setAdCountdown(15);

      // 광고 카운트다운 시작
      const countdownInterval = setInterval(() => {
        setAdCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: conversation.messages.map((m) => ({
              timestamp: m.timestamp.toISOString(),
              sender: m.sender,
              content: m.content,
              isMe: m.sender === selectedName,
            })),
            basicAnalysis,
            myName: selectedName,
            situationType: situation,
          }),
        });

        if (!response.ok) throw new Error("분석 실패");

        const result: DetailedAnalysis = await response.json();

        // 최소 광고 시간 보장 (카운트다운이 0이 될 때까지 대기)
        const waitForAd = () => {
          return new Promise<void>((resolve) => {
            const checkCountdown = setInterval(() => {
              setAdCountdown((current) => {
                if (current <= 0) {
                  clearInterval(checkCountdown);
                  resolve();
                }
                return current;
              });
            }, 100);
          });
        };

        await waitForAd();

        setDetailedAnalysis(result);
        setStep("result");
      } catch {
        clearInterval(countdownInterval);
        setError("분석 중 오류가 발생했습니다.");
        setStep("situation");
      } finally {
        setIsLoadingDetailed(false);
        setAdCountdown(0);
      }
    },
    [conversation, selectedName, basicAnalysis]
  );

  const handleReset = useCallback(() => {
    setStep("platform");
    setPlatform(null);
    setConversation(null);
    setSelectedName(null);
    setBasicAnalysis(null);
    setDetailedAnalysis(null);
    setSituationType(null);
    setError(null);
    setAdCountdown(0);
  }, []);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[var(--color-background)] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--color-background)] border-b border-[var(--color-border-light)]">
        <nav className="max-w-[560px] mx-auto px-5 h-12 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="text-[15px] font-semibold tracking-tight text-[var(--color-text-primary)]"
          >
            convai
          </button>
          {step !== "platform" && (
            <button
              onClick={handleReset}
              className="text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              다시하기
            </button>
          )}
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-[560px] w-full mx-auto px-5 py-8">

        {/* Step: Platform */}
        {step === "platform" && (
          <div className="space-y-10">
            <div className="space-y-4">
              <h1 className="text-[32px] font-bold tracking-tight leading-[1.15] text-[var(--color-text-primary)]">
                대화 속 감정을
                <br />
                분석해 드릴게요
              </h1>
              <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed">
                카카오톡이나 인스타그램 대화를 업로드하면
                <br />
                상대방의 관심도를 AI가 분석합니다.
              </p>
            </div>

            <PlatformSelect onSelect={handlePlatformSelect} />

            {/* 이전 분석 기록 */}
            {lastAnalysis && (
              <div className="p-4 rounded-lg bg-[var(--color-surface)]">
                <p className="text-[13px] text-[var(--color-text-tertiary)] mb-2">
                  지난 분석
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[24px] font-bold text-[var(--color-text-primary)]">
                    {lastAnalysis.temperature}°
                  </span>
                  <span className="text-[13px] text-[var(--color-text-secondary)]">
                    {new Date(lastAnalysis.date).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              </div>
            )}

            {/* 배너 광고 */}
            <AdBanner />

            <div className="pt-6 border-t border-[var(--color-border-light)] space-y-4">
              <p className="text-[13px] text-[var(--color-text-tertiary)] leading-relaxed">
                대화 내용은 분석 후 즉시 삭제되며, 서버에 저장되지 않습니다.
              </p>
              <ShareButton />
            </div>
          </div>
        )}

        {/* Step: Guide */}
        {step === "guide" && platform && (
          <ExportGuide
            platform={platform}
            onComplete={handleGuideComplete}
            onBack={handleGuideBack}
          />
        )}

        {/* Step: Upload */}
        {step === "upload" && (
          <div className="space-y-8">
            <div className="space-y-3">
              <h1 className="text-[28px] font-bold tracking-tight text-[var(--color-text-primary)]">
                파일 업로드
              </h1>
              <p className="text-[15px] text-[var(--color-text-secondary)]">
                내보낸 대화 파일을 선택해 주세요.
              </p>
            </div>

            <FileUpload onFileSelect={handleFileSelect} />

            {error && (
              <p className="text-[14px] text-[var(--color-error)]" role="alert">
                {error}
              </p>
            )}

            <button
              onClick={() => setStep("guide")}
              className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              ← 내보내기 방법 보기
            </button>
          </div>
        )}

        {/* Step: Select */}
        {step === "select" && conversation && (
          <div className="space-y-8">
            <div className="space-y-3">
              <h1 className="text-[28px] font-bold tracking-tight text-[var(--color-text-primary)]">
                누구의 시점인가요?
              </h1>
              <p className="text-[15px] text-[var(--color-text-secondary)]">
                대화에서 본인을 선택해 주세요.
              </p>
            </div>

            <ParticipantSelect
              participants={conversation.participants}
              selectedName={selectedName}
              onSelect={handleNameSelect}
            />

            <p className="text-[13px] text-[var(--color-text-tertiary)]">
              최근 7일간 {conversation.messages.length}개 메시지 분석
            </p>
          </div>
        )}

        {/* Step: Situation */}
        {step === "situation" && basicAnalysis && (
          <div className="space-y-8">
            <div className="space-y-3">
              <h1 className="text-[28px] font-bold tracking-tight text-[var(--color-text-primary)]">
                어떤 상황인가요?
              </h1>
              <p className="text-[15px] text-[var(--color-text-secondary)]">
                상황에 맞는 분석을 제공해 드릴게요.
              </p>
            </div>

            {/* 기본 분석 미리보기 */}
            <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[var(--color-text-tertiary)]">
                  기본 관계 온도
                </span>
                <span className="text-[24px] font-bold text-[var(--color-text-primary)]">
                  {basicAnalysis.temperature}°
                </span>
              </div>
            </div>

            <SituationSelect onSelect={handleSituationSelect} />

            {error && (
              <p className="text-[14px] text-[var(--color-error)]" role="alert">
                {error}
              </p>
            )}
          </div>
        )}

        {/* Step: Analyzing */}
        {step === "analyzing" && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
            {/* 광고 영역 */}
            <div className="w-full max-w-[320px] aspect-[4/3] rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center">
              <AdBanner />
            </div>

            {/* 분석 상태 */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-[var(--color-border)] border-t-[var(--color-text-primary)] rounded-full animate-spin" />
                <p className="text-[15px] text-[var(--color-text-secondary)]">
                  {situationType && SITUATION_OPTIONS.find(o => o.type === situationType)?.label} 분석 중...
                </p>
              </div>
              {adCountdown > 0 && (
                <p className="text-[13px] text-[var(--color-text-tertiary)]">
                  {adCountdown}초 후 결과를 확인할 수 있어요
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step: Result */}
        {step === "result" && detailedAnalysis && (
          <div className="space-y-6">
            <AnalysisResult
              analysis={detailedAnalysis}
            />

            {error && (
              <p className="text-[14px] text-[var(--color-error)]" role="alert">
                {error}
              </p>
            )}

            {/* 히스토리 비교 */}
            <HistoryCard currentTemperature={detailedAnalysis.temperature} />

            <ShareCard analysis={detailedAnalysis} />

            {/* 배너 광고 */}
            <AdBanner className="mt-4" />

            {/* 공유 버튼 */}
            <div className="pt-4 border-t border-[var(--color-border-light)]">
              <ShareButton />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-light)]">
        <div className="max-w-[560px] mx-auto px-5 py-5">
          <p className="text-[12px] text-[var(--color-text-tertiary)]">
            © 2024 convai
          </p>
        </div>
      </footer>
    </div>
  );
}
