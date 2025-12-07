import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  BasicAnalysis,
  DetailedAnalysis,
  SituationType,
  RomanceAnalysis,
  ConflictAnalysis,
  CounselingAnalysis,
  GeneralAnalysis,
} from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AnalyzeRequest {
  messages: {
    timestamp: string;
    sender: string;
    content: string;
    isMe: boolean;
  }[];
  basicAnalysis: BasicAnalysis;
  myName: string;
  situationType: SituationType;
}

// 상황별 프롬프트 생성
function getPromptForSituation(
  situationType: SituationType,
  conversationText: string,
  basicAnalysis: BasicAnalysis
): string {
  const baseInfo = `대화 내용:
${conversationText}

기본 분석 결과:
- 관계 온도: ${basicAnalysis.temperature}°C
- 내 메시지 수: ${basicAnalysis.messageCount.me}개
- 상대 메시지 수: ${basicAnalysis.messageCount.other}개
- 내 평균 응답 속도: ${basicAnalysis.responseSpeed.me}분
- 상대 평균 응답 속도: ${basicAnalysis.responseSpeed.other}분`;

  switch (situationType) {
    case "romance":
      return `당신은 연애 심리 전문가입니다. 아래 대화를 분석하여 상대방의 관심도와 호감 신호를 파악해주세요.

${baseInfo}

다음 JSON 형식으로만 응답해주세요:
{
  "interestLevel": 0-100 사이 숫자 (상대방의 관심도),
  "attractionSignals": [
    "발견된 호감 신호 1",
    "발견된 호감 신호 2",
    "발견된 호감 신호 3"
  ],
  "nextStepAdvice": "다음 단계를 위한 구체적인 조언",
  "redFlags": [
    "주의해야 할 신호가 있다면 작성 (없으면 빈 배열)"
  ],
  "summary": "전체 상황 2-3문장 요약"
}

주의사항:
- 호감 신호는 구체적인 대화 내용을 근거로 작성
- 조언은 실천 가능하고 구체적으로 작성
- JSON 외의 다른 텍스트는 포함하지 마세요`;

    case "conflict":
      return `당신은 갈등 해결 전문 상담사입니다. 아래 대화에서 발생한 갈등을 분석하고 해결 방안을 제시해주세요.

${baseInfo}

다음 JSON 형식으로만 응답해주세요:
{
  "faultAnalysis": {
    "myResponsibility": 0-100 사이 숫자 (내 책임 비율),
    "otherResponsibility": 0-100 사이 숫자 (상대 책임 비율, 합이 100),
    "reasoning": "책임 비율 판단의 구체적인 근거"
  },
  "otherMindAnalysis": {
    "emotionalState": "상대방의 현재 감정 상태 (예: 서운함, 화남, 실망 등)",
    "hiddenNeeds": [
      "상대방이 진짜 원하는 것 1",
      "상대방이 진짜 원하는 것 2"
    ],
    "realIntention": "상대방이 정말 하고 싶은 말"
  },
  "responseGuide": {
    "recommendedResponses": [
      "추천 답변 예시 1",
      "추천 답변 예시 2",
      "추천 답변 예시 3"
    ],
    "avoidPhrases": [
      "피해야 할 말 1",
      "피해야 할 말 2"
    ],
    "reconciliationStarter": "화해를 시작하기 위한 첫 마디"
  },
  "summary": "갈등 상황 2-3문장 요약"
}

주의사항:
- 객관적이고 공정하게 양측의 입장을 분석
- 추천 답변은 실제로 사용할 수 있는 자연스러운 문장으로
- JSON 외의 다른 텍스트는 포함하지 마세요`;

    case "counseling":
      return `당신은 공감 대화 전문가입니다. 상대방이 고민을 털어놓는 상황을 분석하고 적절한 대응 방법을 알려주세요.

${baseInfo}

다음 JSON 형식으로만 응답해주세요:
{
  "whatTheyWant": "상대방이 이 대화에서 정말 원하는 것 (조언? 위로? 공감? 해결책?)",
  "empathyPoints": [
    "공감해줘야 할 포인트 1",
    "공감해줘야 할 포인트 2",
    "공감해줘야 할 포인트 3"
  ],
  "recommendedResponses": [
    "추천 답변 예시 1",
    "추천 답변 예시 2",
    "추천 답변 예시 3"
  ],
  "mistakesToAvoid": [
    "피해야 할 실수 1 (예: 섣부른 조언, 비교하기 등)",
    "피해야 할 실수 2"
  ],
  "summary": "상담 상황 2-3문장 요약"
}

주의사항:
- 상대방의 감정과 상황에 집중
- 추천 답변은 공감을 담은 자연스러운 문장으로
- JSON 외의 다른 텍스트는 포함하지 마세요`;

    case "general":
    default:
      return `당신은 대인관계 전문가입니다. 아래 대화를 분석하여 관계의 건강도와 소통 패턴을 파악해주세요.

${baseInfo}

다음 JSON 형식으로만 응답해주세요:
{
  "relationshipHealth": 0-100 사이 숫자 (관계 건강도),
  "communicationPattern": "두 사람의 소통 패턴 분석 (1-2문장)",
  "strengths": [
    "이 관계의 강점 1",
    "이 관계의 강점 2"
  ],
  "improvements": [
    "개선하면 좋을 점 1",
    "개선하면 좋을 점 2"
  ],
  "summary": "관계 전반 2-3문장 요약"
}

주의사항:
- 구체적인 대화 내용을 근거로 분석
- 개선점은 실천 가능한 내용으로 작성
- JSON 외의 다른 텍스트는 포함하지 마세요`;
  }
}

// 상황별 기본값
function getDefaultAnalysis(situationType: SituationType) {
  switch (situationType) {
    case "romance":
      return {
        interestLevel: 50,
        attractionSignals: ["분석 중 오류가 발생했습니다."],
        nextStepAdvice: "다시 시도해 주세요.",
        redFlags: [],
        summary: "분석을 완료하지 못했습니다.",
      };
    case "conflict":
      return {
        faultAnalysis: {
          myResponsibility: 50,
          otherResponsibility: 50,
          reasoning: "분석 중 오류가 발생했습니다.",
        },
        otherMindAnalysis: {
          emotionalState: "알 수 없음",
          hiddenNeeds: ["분석 실패"],
          realIntention: "다시 시도해 주세요.",
        },
        responseGuide: {
          recommendedResponses: ["다시 시도해 주세요."],
          avoidPhrases: [],
          reconciliationStarter: "",
        },
        summary: "분석을 완료하지 못했습니다.",
      };
    case "counseling":
      return {
        whatTheyWant: "분석 중 오류가 발생했습니다.",
        empathyPoints: ["다시 시도해 주세요."],
        recommendedResponses: ["다시 시도해 주세요."],
        mistakesToAvoid: [],
        summary: "분석을 완료하지 못했습니다.",
      };
    case "general":
    default:
      return {
        relationshipHealth: 50,
        communicationPattern: "분석 중 오류가 발생했습니다.",
        strengths: ["다시 시도해 주세요."],
        improvements: [],
        summary: "분석을 완료하지 못했습니다.",
      };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();
    const { messages, basicAnalysis, myName, situationType } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "분석할 메시지가 없습니다." },
        { status: 400 }
      );
    }

    // 최근 50개 메시지만 사용 (비용 절감)
    const recentMessages = messages.slice(-50);

    const conversationText = recentMessages
      .map((m) => `[${m.isMe ? "나" : "상대"}]: ${m.content}`)
      .join("\n");

    const prompt = getPromptForSituation(
      situationType,
      conversationText,
      basicAnalysis
    );

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a conversation analyst. Always respond in valid JSON format only. Use Korean language for all text values.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseText = completion.choices[0]?.message?.content || "";

    // JSON 파싱
    let analysisResult;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      analysisResult = getDefaultAnalysis(situationType);
    }

    // 상황별로 결과 구성
    const detailedAnalysis: DetailedAnalysis = {
      ...basicAnalysis,
      situationType,
      ...(situationType === "romance" && {
        romanceAnalysis: analysisResult as RomanceAnalysis,
      }),
      ...(situationType === "conflict" && {
        conflictAnalysis: analysisResult as ConflictAnalysis,
      }),
      ...(situationType === "counseling" && {
        counselingAnalysis: analysisResult as CounselingAnalysis,
      }),
      ...(situationType === "general" && {
        generalAnalysis: analysisResult as GeneralAnalysis,
      }),
    };

    return NextResponse.json(detailedAnalysis);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
