import { ParsedConversation, BasicAnalysis, Message } from "@/types";

const EMOJI_REGEX =
  /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu;

// 한국어 긍정/부정 감정 사전
const POSITIVE_WORDS = [
  "좋아", "좋아요", "좋다", "최고", "대박", "굿", "ㅋㅋ", "ㅎㅎ", "ㅋㅋㅋ", "ㅎㅎㅎ",
  "재밌", "재미있", "웃겨", "행복", "기뻐", "설레", "감사", "고마워", "사랑",
  "예뻐", "멋져", "귀여", "짱", "완전", "진짜", "너무", "정말", "완벽",
  "맛있", "신나", "기대", "보고싶", "想", "❤", "♥", "😊", "😍", "🥰",
  "ㅋ", "ㅎ", "히히", "크크", "캬", "오오", "우와", "와", "헐"
];

const NEGATIVE_WORDS = [
  "싫어", "싫다", "별로", "귀찮", "짜증", "화나", "슬퍼", "우울", "힘들",
  "피곤", "지쳐", "심심", "재미없", "노잼", "아쉽", "미안", "죄송", "sorry",
  "못", "안돼", "싫", "ㅠ", "ㅜ", "ㅠㅠ", "ㅜㅜ", "에휴", "흠", "음",
  "글쎄", "모르", "바빠", "나중에", "담에", "다음에"
];

// 자기 노출 관련 키워드 (개인적인 이야기)
const SELF_DISCLOSURE_WORDS = [
  "나는", "내가", "저는", "제가", "나도", "저도",
  "우리 가족", "우리 엄마", "우리 아빠", "우리 집",
  "내 친구", "내 생각", "솔직히", "사실",
  "어렸을 때", "예전에", "옛날에", "전에",
  "요즘 나", "나 요즘", "내 꿈", "내 취미",
  "좋아하는", "싫어하는", "무서워", "걱정",
  "비밀인데", "아무한테도", "너만", "너한테만"
];

// 질문 패턴
const QUESTION_PATTERNS = [
  /\?/,
  /뭐야/,
  /뭐해/,
  /어때/,
  /어디/,
  /언제/,
  /왜/,
  /어떻게/,
  /누구/,
  /몇/,
  /할래/,
  /갈래/,
  /먹을래/,
  /볼래/,
  /줄래/,
  /있어\?/,
  /없어\?/,
  /했어\?/,
  /하는거야/,
  /인거야/,
  /맞아\?/,
  /아니야\?/,
  /진짜\?/,
  /정말\?/
];

function countEmojis(text: string): number {
  const matches = text.match(EMOJI_REGEX);
  return matches ? matches.length : 0;
}

function calculateResponseTime(
  messages: Message[],
  isMe: boolean
): number {
  const responseTimes: number[] = [];

  for (let i = 1; i < messages.length; i++) {
    const prev = messages[i - 1];
    const curr = messages[i];

    if (prev.isMe !== isMe && curr.isMe === isMe) {
      const diff =
        (curr.timestamp.getTime() - prev.timestamp.getTime()) / 1000 / 60;
      if (diff > 0 && diff < 24 * 60) {
        responseTimes.push(diff);
      }
    }
  }

  if (responseTimes.length === 0) return 0;
  return responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
}

// 질문 비율 계산
function calculateQuestionRatio(messages: Message[]): number {
  if (messages.length === 0) return 0;

  const questionCount = messages.filter((m) =>
    QUESTION_PATTERNS.some((pattern) => pattern.test(m.content))
  ).length;

  return Math.round((questionCount / messages.length) * 100);
}

// 자기 노출 점수 계산
function calculateSelfDisclosure(messages: Message[]): number {
  if (messages.length === 0) return 0;

  const disclosureCount = messages.filter((m) =>
    SELF_DISCLOSURE_WORDS.some((word) => m.content.includes(word))
  ).length;

  return Math.round((disclosureCount / messages.length) * 100);
}

// 감정 점수 계산 (-100 ~ 100)
function calculateSentimentScore(messages: Message[]): number {
  if (messages.length === 0) return 0;

  let positiveCount = 0;
  let negativeCount = 0;

  messages.forEach((m) => {
    const content = m.content.toLowerCase();
    POSITIVE_WORDS.forEach((word) => {
      if (content.includes(word)) positiveCount++;
    });
    NEGATIVE_WORDS.forEach((word) => {
      if (content.includes(word)) negativeCount++;
    });
  });

  const total = positiveCount + negativeCount;
  if (total === 0) return 0;

  return Math.round(((positiveCount - negativeCount) / total) * 100);
}

// 언어적 미러링 (상대방 표현 따라하기) 계산
function calculateLinguisticMirroring(
  myMessages: Message[],
  otherMessages: Message[]
): number {
  if (myMessages.length === 0 || otherMessages.length === 0) return 0;

  // 상대방이 자주 쓰는 표현 추출
  const otherExpressions = new Set<string>();
  otherMessages.forEach((m) => {
    // ㅋ, ㅎ 패턴
    const laughPatterns = m.content.match(/[ㅋㅎ]+/g);
    if (laughPatterns) laughPatterns.forEach((p) => otherExpressions.add(p));

    // 이모티콘
    const emojis = m.content.match(EMOJI_REGEX);
    if (emojis) emojis.forEach((e) => otherExpressions.add(e));

    // 자주 쓰는 어미 (2글자 이상)
    const endings = m.content.match(/[가-힣]{2,3}$/);
    if (endings) otherExpressions.add(endings[0]);
  });

  if (otherExpressions.size === 0) return 50;

  // 내가 상대방 표현을 얼마나 따라하는지
  let mirrorCount = 0;
  myMessages.forEach((m) => {
    otherExpressions.forEach((expr) => {
      if (m.content.includes(expr)) mirrorCount++;
    });
  });

  const mirrorRate = mirrorCount / (myMessages.length * otherExpressions.size);
  return Math.min(100, Math.round(mirrorRate * 500)); // 정규화
}

// 대화 시작 횟수 계산 (30분 이상 공백 후 첫 메시지)
function calculateConversationInitiation(
  messages: Message[],
  isMe: boolean
): number {
  let initiationCount = 0;
  const GAP_THRESHOLD = 30 * 60 * 1000; // 30분

  for (let i = 0; i < messages.length; i++) {
    const curr = messages[i];
    if (curr.isMe !== isMe) continue;

    if (i === 0) {
      initiationCount++;
      continue;
    }

    const prev = messages[i - 1];
    const gap = curr.timestamp.getTime() - prev.timestamp.getTime();

    if (gap >= GAP_THRESHOLD) {
      initiationCount++;
    }
  }

  return initiationCount;
}

function getTemperatureLabel(temp: number): string {
  if (temp >= 90) return "지금 고백해도 됩니다";
  if (temp >= 70) return "썸 타는 중, 조금만 더!";
  if (temp >= 50) return "아직 판단하기 이른 온도";
  if (temp >= 30) return "살짝 쿨한 관계";
  return "해동이 필요합니다";
}

export function analyzeBasic(
  conversation: ParsedConversation,
  myName: string
): BasicAnalysis {
  const messages = conversation.messages.map((m) => ({
    ...m,
    isMe: m.sender === myName,
  }));

  const myMessages = messages.filter((m) => m.isMe);
  const otherMessages = messages.filter((m) => !m.isMe);

  // 기본 지표
  const messageCount = {
    me: myMessages.length,
    other: otherMessages.length,
    total: messages.length,
  };

  const totalMessages = messageCount.me + messageCount.other;
  const initiativeRatio = {
    me: totalMessages > 0 ? Math.round((messageCount.me / totalMessages) * 100) : 50,
    other: totalMessages > 0 ? Math.round((messageCount.other / totalMessages) * 100) : 50,
  };

  const averageLength = {
    me:
      myMessages.length > 0
        ? Math.round(
            myMessages.reduce((acc, m) => acc + m.content.length, 0) /
              myMessages.length
          )
        : 0,
    other:
      otherMessages.length > 0
        ? Math.round(
            otherMessages.reduce((acc, m) => acc + m.content.length, 0) /
              otherMessages.length
          )
        : 0,
  };

  const emojiCount = {
    me: myMessages.reduce((acc, m) => acc + countEmojis(m.content), 0),
    other: otherMessages.reduce((acc, m) => acc + countEmojis(m.content), 0),
  };

  const responseSpeed = {
    me: Math.round(calculateResponseTime(messages, true)),
    other: Math.round(calculateResponseTime(messages, false)),
    unit: "분",
  };

  // 심리학 기반 지표
  const questionRatio = {
    me: calculateQuestionRatio(myMessages),
    other: calculateQuestionRatio(otherMessages),
  };

  const selfDisclosure = {
    me: calculateSelfDisclosure(myMessages),
    other: calculateSelfDisclosure(otherMessages),
  };

  const sentimentScore = {
    me: calculateSentimentScore(myMessages),
    other: calculateSentimentScore(otherMessages),
  };

  const linguisticMirroring = calculateLinguisticMirroring(myMessages, otherMessages);

  const conversationInitiation = {
    me: calculateConversationInitiation(messages, true),
    other: calculateConversationInitiation(messages, false),
  };

  // 관계 온도 계산 (심리학 지표 반영)
  let temperature = 50;

  // 1. 상대방 메시지 비율 (기존)
  if (messageCount.other > messageCount.me) {
    temperature += Math.min(10, (messageCount.other - messageCount.me) / 3);
  } else {
    temperature -= Math.min(8, (messageCount.me - messageCount.other) / 4);
  }

  // 2. 응답 속도 (기존)
  if (responseSpeed.other > 0 && responseSpeed.other < responseSpeed.me) {
    temperature += Math.min(10, (responseSpeed.me - responseSpeed.other) / 3);
  } else if (responseSpeed.me > 0 && responseSpeed.other > responseSpeed.me) {
    temperature -= Math.min(8, (responseSpeed.other - responseSpeed.me) / 4);
  }

  // 3. 상대방 질문 비율 (높으면 관심 있음)
  if (questionRatio.other > questionRatio.me) {
    temperature += Math.min(10, (questionRatio.other - questionRatio.me) / 5);
  } else if (questionRatio.me > questionRatio.other + 20) {
    temperature -= 5; // 나만 질문하고 있으면 감점
  }

  // 4. 상대방 자기 노출 (높으면 친밀감)
  if (selfDisclosure.other > 20) {
    temperature += Math.min(10, selfDisclosure.other / 5);
  }
  if (selfDisclosure.other > selfDisclosure.me) {
    temperature += 5;
  }

  // 5. 상대방 감정 점수 (긍정적이면 호감)
  if (sentimentScore.other > 30) {
    temperature += Math.min(10, sentimentScore.other / 10);
  } else if (sentimentScore.other < -30) {
    temperature -= Math.min(10, Math.abs(sentimentScore.other) / 10);
  }

  // 6. 언어적 미러링 (상호적이면 좋음)
  if (linguisticMirroring > 50) {
    temperature += Math.min(5, (linguisticMirroring - 50) / 10);
  }

  // 7. 대화 시작 주도권 (상대방이 먼저 말 걸면 +)
  const totalInitiation = conversationInitiation.me + conversationInitiation.other;
  if (totalInitiation > 0) {
    const otherInitRatio = conversationInitiation.other / totalInitiation;
    if (otherInitRatio > 0.5) {
      temperature += Math.min(8, (otherInitRatio - 0.5) * 20);
    } else if (otherInitRatio < 0.3) {
      temperature -= 5;
    }
  }

  // 8. 이모티콘 사용 (기존, 가중치 낮춤)
  const otherEmojiRate =
    otherMessages.length > 0 ? emojiCount.other / otherMessages.length : 0;
  if (otherEmojiRate > 0.3) {
    temperature += 5;
  } else if (otherEmojiRate > 0.1) {
    temperature += 2;
  }

  // 범위 제한
  temperature = Math.max(0, Math.min(100, Math.round(temperature)));

  return {
    temperature,
    temperatureLabel: getTemperatureLabel(temperature),
    responseSpeed,
    messageCount,
    initiativeRatio,
    averageLength,
    emojiCount,
    linguisticMirroring,
    questionRatio,
    selfDisclosure,
    sentimentScore,
    conversationInitiation,
  };
}
