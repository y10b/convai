export interface Message {
  timestamp: Date;
  sender: string;
  content: string;
  isMe: boolean;
}

export interface ParsedConversation {
  messages: Message[];
  participants: string[];
  platform: "kakao" | "instagram";
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface BasicAnalysis {
  temperature: number;
  temperatureLabel: string;
  responseSpeed: {
    me: number;
    other: number;
    unit: string;
  };
  messageCount: {
    me: number;
    other: number;
    total: number;
  };
  initiativeRatio: {
    me: number;
    other: number;
  };
  averageLength: {
    me: number;
    other: number;
  };
  emojiCount: {
    me: number;
    other: number;
  };
  // 심리학 연구 기반 지표
  linguisticMirroring: number; // 언어적 수용도 (0-100)
  questionRatio: {
    me: number;
    other: number;
  };
  selfDisclosure: {
    me: number;
    other: number;
  };
  sentimentScore: {
    me: number;
    other: number;
  };
  conversationInitiation: {
    me: number;
    other: number;
  };
}

// 상황 유형 정의
export type SituationType = "romance" | "conflict" | "counseling" | "general";

export interface SituationOption {
  type: SituationType;
  label: string;
  emoji: string;
  description: string;
}

export const SITUATION_OPTIONS: SituationOption[] = [
  {
    type: "romance",
    label: "썸/연애",
    emoji: "💕",
    description: "관심도와 호감 신호를 분석해요",
  },
  {
    type: "conflict",
    label: "갈등/다툼",
    emoji: "😤",
    description: "과실 분석과 화해 방법을 알려드려요",
  },
  {
    type: "counseling",
    label: "고민 상담",
    emoji: "🤔",
    description: "상대가 원하는 반응을 분석해요",
  },
  {
    type: "general",
    label: "일반 대화",
    emoji: "💬",
    description: "전반적인 관계와 대화 패턴을 분석해요",
  },
];

// 상황별 상세 분석 타입
export interface RomanceAnalysis {
  interestLevel: number; // 관심도 (0-100)
  attractionSignals: string[]; // 호감 신호들
  nextStepAdvice: string; // 다음 단계 조언
  redFlags: string[]; // 주의 신호
  summary: string;
}

export interface ConflictAnalysis {
  faultAnalysis: {
    myResponsibility: number; // 내 책임 비율 (0-100)
    otherResponsibility: number;
    reasoning: string; // 판단 근거
  };
  otherMindAnalysis: {
    emotionalState: string; // 상대 감정 상태
    hiddenNeeds: string[]; // 숨은 욕구
    realIntention: string; // 진짜 말하고 싶은 것
  };
  responseGuide: {
    recommendedResponses: string[]; // 추천 답변 2-3개
    avoidPhrases: string[]; // 피해야 할 말
    reconciliationStarter: string; // 화해 첫 마디
  };
  summary: string;
}

export interface CounselingAnalysis {
  whatTheyWant: string; // 상대가 원하는 것
  empathyPoints: string[]; // 공감 포인트
  recommendedResponses: string[]; // 추천 답변
  mistakesToAvoid: string[]; // 피해야 할 실수
  summary: string;
}

export interface GeneralAnalysis {
  relationshipHealth: number; // 관계 건강도 (0-100)
  communicationPattern: string; // 소통 패턴 분석
  strengths: string[]; // 관계의 강점
  improvements: string[]; // 개선점
  summary: string;
}

export interface DetailedAnalysis extends BasicAnalysis {
  situationType: SituationType;
  romanceAnalysis?: RomanceAnalysis;
  conflictAnalysis?: ConflictAnalysis;
  counselingAnalysis?: CounselingAnalysis;
  generalAnalysis?: GeneralAnalysis;
}

export type AnalysisResult = BasicAnalysis | DetailedAnalysis;

export function isDetailedAnalysis(
  analysis: AnalysisResult
): analysis is DetailedAnalysis {
  return "sentiment" in analysis;
}
