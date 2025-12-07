"use client";

import {
  DetailedAnalysis,
  SITUATION_OPTIONS,
} from "@/types";

interface AnalysisResultProps {
  analysis: DetailedAnalysis;
}

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
  const situationOption = SITUATION_OPTIONS.find(
    (o) => o.type === analysis.situationType
  );

  return (
    <div className="space-y-6">
      {/* Temperature */}
      <div className="text-center py-8">
        <p className="text-[13px] text-[var(--color-text-tertiary)] mb-2">
          관계 온도
        </p>
        <p className="text-[64px] font-bold tracking-tight text-[var(--color-text-primary)] leading-none">
          {analysis.temperature}°
        </p>
        <p className="text-[15px] text-[var(--color-text-secondary)] mt-3">
          {analysis.temperatureLabel}
        </p>
      </div>

      {/* 상황 유형 표시 */}
      {situationOption && (
        <div className="flex items-center justify-center gap-2 py-2">
          <span className="text-lg">{situationOption.emoji}</span>
          <span className="text-[14px] text-[var(--color-text-secondary)]">
            {situationOption.label} 분석
          </span>
        </div>
      )}

      {/* 기본 통계 */}
      <div className="space-y-1">
        <StatRow
          label="답장 속도"
          myValue={`${analysis.responseSpeed.me || "-"}분`}
          otherValue={`${analysis.responseSpeed.other || "-"}분`}
        />
        <StatRow
          label="메시지 수"
          myValue={`${analysis.messageCount.me}개`}
          otherValue={`${analysis.messageCount.other}개`}
        />
        <StatRow
          label="대화 주도"
          myValue={`${analysis.initiativeRatio.me}%`}
          otherValue={`${analysis.initiativeRatio.other}%`}
        />
      </div>

      {/* 상황별 상세 분석 */}
      <div className="space-y-4 pt-4 border-t border-[var(--color-border-light)]">
        {analysis.romanceAnalysis && (
          <RomanceResult analysis={analysis.romanceAnalysis} />
        )}
        {analysis.conflictAnalysis && (
          <ConflictResult analysis={analysis.conflictAnalysis} />
        )}
        {analysis.counselingAnalysis && (
          <CounselingResult analysis={analysis.counselingAnalysis} />
        )}
        {analysis.generalAnalysis && (
          <GeneralResult analysis={analysis.generalAnalysis} />
        )}
      </div>
    </div>
  );
}

// 썸/연애 분석 결과
function RomanceResult({
  analysis,
}: {
  analysis: NonNullable<DetailedAnalysis["romanceAnalysis"]>;
}) {
  return (
    <div className="space-y-4">
      {/* 관심도 게이지 */}
      <div className="p-4 rounded-xl bg-[var(--color-surface)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[14px] text-[var(--color-text-secondary)]">
            상대방 관심도
          </span>
          <span className="text-[24px] font-bold text-[var(--color-text-primary)]">
            {analysis.interestLevel}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-[var(--color-border-light)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${analysis.interestLevel}%`,
              backgroundColor:
                analysis.interestLevel >= 70
                  ? "#34c759"
                  : analysis.interestLevel >= 40
                  ? "#ff9500"
                  : "#ff3b30",
            }}
          />
        </div>
      </div>

      {/* 호감 신호 */}
      <div>
        <p className="text-[13px] text-[var(--color-text-tertiary)] mb-3">
          발견된 호감 신호
        </p>
        <ul className="space-y-2">
          {analysis.attractionSignals.map((signal, i) => (
            <li
              key={i}
              className="text-[14px] text-[var(--color-text-primary)] leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#34c759]"
            >
              {signal}
            </li>
          ))}
        </ul>
      </div>

      {/* 주의 신호 */}
      {analysis.redFlags.length > 0 && (
        <div>
          <p className="text-[13px] text-[var(--color-text-tertiary)] mb-3">
            주의 신호
          </p>
          <ul className="space-y-2">
            {analysis.redFlags.map((flag, i) => (
              <li
                key={i}
                className="text-[14px] text-[var(--color-text-primary)] leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#ff3b30]"
              >
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 조언 */}
      <div className="p-4 rounded-xl bg-[var(--color-surface)]">
        <p className="text-[13px] text-[var(--color-text-tertiary)] mb-2">
          다음 단계 조언
        </p>
        <p className="text-[14px] text-[var(--color-text-primary)] leading-relaxed">
          {analysis.nextStepAdvice}
        </p>
      </div>

      {/* 요약 */}
      <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
        {analysis.summary}
      </p>
    </div>
  );
}

// 갈등/다툼 분석 결과
function ConflictResult({
  analysis,
}: {
  analysis: NonNullable<DetailedAnalysis["conflictAnalysis"]>;
}) {
  return (
    <div className="space-y-4">
      {/* 과실 분석 */}
      <div className="p-4 rounded-xl bg-[var(--color-surface)]">
        <p className="text-[13px] text-[var(--color-text-tertiary)] mb-3">
          책임 비율 분석
        </p>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1">
            <div className="flex justify-between text-[12px] text-[var(--color-text-tertiary)] mb-1">
              <span>나</span>
              <span>{analysis.faultAnalysis.myResponsibility}%</span>
            </div>
            <div className="h-3 rounded-full bg-[var(--color-border-light)] overflow-hidden">
              <div
                className="h-full bg-[var(--color-text-primary)] rounded-full"
                style={{ width: `${analysis.faultAnalysis.myResponsibility}%` }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-[12px] text-[var(--color-text-tertiary)] mb-1">
              <span>상대</span>
              <span>{analysis.faultAnalysis.otherResponsibility}%</span>
            </div>
            <div className="h-3 rounded-full bg-[var(--color-border-light)] overflow-hidden">
              <div
                className="h-full bg-[var(--color-text-secondary)] rounded-full"
                style={{
                  width: `${analysis.faultAnalysis.otherResponsibility}%`,
                }}
              />
            </div>
          </div>
        </div>
        <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
          {analysis.faultAnalysis.reasoning}
        </p>
      </div>

      {/* 상대 마음 분석 */}
      <div className="p-4 rounded-xl bg-[var(--color-surface)]">
        <p className="text-[13px] text-[var(--color-text-tertiary)] mb-3">
          상대방의 마음
        </p>
        <div className="space-y-3">
          <div>
            <span className="text-[12px] text-[var(--color-text-tertiary)]">
              감정 상태
            </span>
            <p className="text-[14px] text-[var(--color-text-primary)] mt-1">
              {analysis.otherMindAnalysis.emotionalState}
            </p>
          </div>
          <div>
            <span className="text-[12px] text-[var(--color-text-tertiary)]">
              진짜 하고 싶은 말
            </span>
            <p className="text-[14px] text-[var(--color-text-primary)] mt-1">
              {analysis.otherMindAnalysis.realIntention}
            </p>
          </div>
          <div>
            <span className="text-[12px] text-[var(--color-text-tertiary)]">
              숨은 욕구
            </span>
            <ul className="mt-1 space-y-1">
              {analysis.otherMindAnalysis.hiddenNeeds.map((need, i) => (
                <li
                  key={i}
                  className="text-[14px] text-[var(--color-text-primary)]"
                >
                  • {need}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 추천 답변 */}
      <div>
        <p className="text-[13px] text-[var(--color-text-tertiary)] mb-3">
          이렇게 말해보세요
        </p>
        <div className="space-y-2">
          {analysis.responseGuide.recommendedResponses.map((response, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
            >
              <p className="text-[14px] text-[var(--color-text-primary)]">
                "{response}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 피해야 할 말 */}
      {analysis.responseGuide.avoidPhrases.length > 0 && (
        <div>
          <p className="text-[13px] text-[var(--color-text-tertiary)] mb-3">
            피해야 할 말
          </p>
          <ul className="space-y-2">
            {analysis.responseGuide.avoidPhrases.map((phrase, i) => (
              <li
                key={i}
                className="text-[14px] text-[#ff3b30] leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#ff3b30]"
              >
                {phrase}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 화해 첫 마디 */}
      {analysis.responseGuide.reconciliationStarter && (
        <div className="p-4 rounded-xl bg-[#34c75915] border border-[#34c75930]">
          <p className="text-[13px] text-[var(--color-text-tertiary)] mb-2">
            화해를 시작하는 첫 마디
          </p>
          <p className="text-[15px] text-[var(--color-text-primary)] font-medium">
            "{analysis.responseGuide.reconciliationStarter}"
          </p>
        </div>
      )}

      {/* 요약 */}
      <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
        {analysis.summary}
      </p>
    </div>
  );
}

// 고민 상담 분석 결과
function CounselingResult({
  analysis,
}: {
  analysis: NonNullable<DetailedAnalysis["counselingAnalysis"]>;
}) {
  return (
    <div className="space-y-4">
      {/* 상대가 원하는 것 */}
      <div className="p-4 rounded-xl bg-[var(--color-surface)]">
        <p className="text-[13px] text-[var(--color-text-tertiary)] mb-2">
          상대방이 원하는 것
        </p>
        <p className="text-[15px] text-[var(--color-text-primary)] font-medium">
          {analysis.whatTheyWant}
        </p>
      </div>

      {/* 공감 포인트 */}
      <div>
        <p className="text-[13px] text-[var(--color-text-tertiary)] mb-3">
          공감해줘야 할 부분
        </p>
        <ul className="space-y-2">
          {analysis.empathyPoints.map((point, i) => (
            <li
              key={i}
              className="text-[14px] text-[var(--color-text-primary)] leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#007aff]"
            >
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* 추천 답변 */}
      <div>
        <p className="text-[13px] text-[var(--color-text-tertiary)] mb-3">
          이렇게 말해보세요
        </p>
        <div className="space-y-2">
          {analysis.recommendedResponses.map((response, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
            >
              <p className="text-[14px] text-[var(--color-text-primary)]">
                "{response}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 피해야 할 실수 */}
      {analysis.mistakesToAvoid.length > 0 && (
        <div>
          <p className="text-[13px] text-[var(--color-text-tertiary)] mb-3">
            피해야 할 실수
          </p>
          <ul className="space-y-2">
            {analysis.mistakesToAvoid.map((mistake, i) => (
              <li
                key={i}
                className="text-[14px] text-[#ff3b30] leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#ff3b30]"
              >
                {mistake}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 요약 */}
      <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
        {analysis.summary}
      </p>
    </div>
  );
}

// 일반 대화 분석 결과
function GeneralResult({
  analysis,
}: {
  analysis: NonNullable<DetailedAnalysis["generalAnalysis"]>;
}) {
  return (
    <div className="space-y-4">
      {/* 관계 건강도 */}
      <div className="p-4 rounded-xl bg-[var(--color-surface)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[14px] text-[var(--color-text-secondary)]">
            관계 건강도
          </span>
          <span className="text-[24px] font-bold text-[var(--color-text-primary)]">
            {analysis.relationshipHealth}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-[var(--color-border-light)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${analysis.relationshipHealth}%`,
              backgroundColor:
                analysis.relationshipHealth >= 70
                  ? "#34c759"
                  : analysis.relationshipHealth >= 40
                  ? "#ff9500"
                  : "#ff3b30",
            }}
          />
        </div>
      </div>

      {/* 소통 패턴 */}
      <div className="p-4 rounded-xl bg-[var(--color-surface)]">
        <p className="text-[13px] text-[var(--color-text-tertiary)] mb-2">
          소통 패턴
        </p>
        <p className="text-[14px] text-[var(--color-text-primary)] leading-relaxed">
          {analysis.communicationPattern}
        </p>
      </div>

      {/* 강점 */}
      <div>
        <p className="text-[13px] text-[var(--color-text-tertiary)] mb-3">
          관계의 강점
        </p>
        <ul className="space-y-2">
          {analysis.strengths.map((strength, i) => (
            <li
              key={i}
              className="text-[14px] text-[var(--color-text-primary)] leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#34c759]"
            >
              {strength}
            </li>
          ))}
        </ul>
      </div>

      {/* 개선점 */}
      {analysis.improvements.length > 0 && (
        <div>
          <p className="text-[13px] text-[var(--color-text-tertiary)] mb-3">
            개선하면 좋을 점
          </p>
          <ul className="space-y-2">
            {analysis.improvements.map((improvement, i) => (
              <li
                key={i}
                className="text-[14px] text-[var(--color-text-primary)] leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#ff9500]"
              >
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 요약 */}
      <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
        {analysis.summary}
      </p>
    </div>
  );
}

function StatRow({
  label,
  myValue,
  otherValue,
}: {
  label: string;
  myValue: string;
  otherValue: string;
}) {
  return (
    <div className="flex items-center py-3 px-4 rounded-lg bg-[var(--color-surface)]">
      <span className="text-[14px] text-[var(--color-text-secondary)] w-20 flex-shrink-0">
        {label}
      </span>
      <div className="flex-1 flex items-center justify-end gap-6 text-[14px]">
        <div className="text-right">
          <span className="text-[var(--color-text-tertiary)] text-[12px] mr-1.5">
            나
          </span>
          <span className="font-medium text-[var(--color-text-primary)]">
            {myValue}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[var(--color-text-tertiary)] text-[12px] mr-1.5">
            상대
          </span>
          <span className="font-medium text-[var(--color-text-primary)]">
            {otherValue}
          </span>
        </div>
      </div>
    </div>
  );
}
