import { Message, ParsedConversation } from "@/types";

// 카카오톡 날짜 형식: "2024. 4. 12. 오후 3:10" 또는 "2024년 4월 12일 오후 3:10"
const KAKAO_DATE_PATTERNS = [
  /^(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\.\s*(오전|오후)\s*(\d{1,2}):(\d{2})/,
  /^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일\s*(오전|오후)\s*(\d{1,2}):(\d{2})/,
];

// 카카오톡 메시지 형식: "날짜 - 발신자: 메시지"
const KAKAO_MESSAGE_PATTERN =
  /^(.+?)\s*[-,]\s*(.+?):\s*(.+)$/;

function parseKakaoDate(dateStr: string): Date | null {
  for (const pattern of KAKAO_DATE_PATTERNS) {
    const match = dateStr.match(pattern);
    if (match) {
      const [, year, month, day, ampm, hour, minute] = match;
      let hourNum = parseInt(hour);
      if (ampm === "오후" && hourNum !== 12) hourNum += 12;
      if (ampm === "오전" && hourNum === 12) hourNum = 0;
      return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        hourNum,
        parseInt(minute)
      );
    }
  }
  return null;
}

export function parseKakaoTalk(
  content: string,
  myName?: string
): ParsedConversation {
  const lines = content.split("\n");
  const messages: Message[] = [];
  const participantSet = new Set<string>();

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(KAKAO_MESSAGE_PATTERN);
    if (match) {
      const [, dateStr, sender, messageContent] = match;
      const timestamp = parseKakaoDate(dateStr);

      if (timestamp && sender && messageContent) {
        const senderName = sender.trim();
        participantSet.add(senderName);

        // 시스템 메시지 필터링
        if (
          messageContent.includes("님이 들어왔습니다") ||
          messageContent.includes("님이 나갔습니다") ||
          messageContent.includes("채팅방을 나갔습니다")
        ) {
          continue;
        }

        messages.push({
          timestamp,
          sender: senderName,
          content: messageContent.trim(),
          isMe: myName ? senderName === myName : false,
        });
      }
    }
  }

  const participants = Array.from(participantSet);

  // 7일 필터링
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const filteredMessages = messages.filter((m) => m.timestamp >= sevenDaysAgo);

  const sortedMessages = filteredMessages.sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  return {
    messages: sortedMessages,
    participants,
    platform: "kakao",
    dateRange: {
      start: sortedMessages[0]?.timestamp || now,
      end: sortedMessages[sortedMessages.length - 1]?.timestamp || now,
    },
  };
}

interface InstagramMessage {
  sender_name: string;
  timestamp_ms: number;
  content?: string;
  photos?: unknown[];
  videos?: unknown[];
}

interface InstagramExport {
  participants: { name: string }[];
  messages: InstagramMessage[];
}

export function parseInstagram(
  jsonContent: string,
  myName?: string
): ParsedConversation {
  const data: InstagramExport = JSON.parse(jsonContent);
  const messages: Message[] = [];

  const participants = data.participants.map((p) => decodeInstagramString(p.name));

  for (const msg of data.messages) {
    if (!msg.content) continue;

    const senderName = decodeInstagramString(msg.sender_name);
    const timestamp = new Date(msg.timestamp_ms);

    messages.push({
      timestamp,
      sender: senderName,
      content: decodeInstagramString(msg.content),
      isMe: myName ? senderName === myName : false,
    });
  }

  // 7일 필터링
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const filteredMessages = messages.filter((m) => m.timestamp >= sevenDaysAgo);

  const sortedMessages = filteredMessages.sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  return {
    messages: sortedMessages,
    participants,
    platform: "instagram",
    dateRange: {
      start: sortedMessages[0]?.timestamp || now,
      end: sortedMessages[sortedMessages.length - 1]?.timestamp || now,
    },
  };
}

// 인스타그램 유니코드 디코딩
function decodeInstagramString(str: string): string {
  try {
    return decodeURIComponent(
      str.replace(/\\u([\dA-Fa-f]{4})/g, (_, code) =>
        String.fromCharCode(parseInt(code, 16))
      )
    );
  } catch {
    return str;
  }
}

export function detectPlatform(content: string): "kakao" | "instagram" | null {
  // JSON 형식이면 인스타그램
  try {
    const parsed = JSON.parse(content);
    if (parsed.messages && parsed.participants) {
      return "instagram";
    }
  } catch {
    // JSON이 아니면 카카오톡
  }

  // 카카오톡 패턴 검사
  for (const pattern of KAKAO_DATE_PATTERNS) {
    if (pattern.test(content)) {
      return "kakao";
    }
  }

  // 일반적인 카카오톡 내보내기 헤더 검사
  if (
    content.includes("님과 카카오톡 대화") ||
    content.includes("저장한 날짜")
  ) {
    return "kakao";
  }

  return null;
}

export function parseConversation(
  content: string,
  myName?: string
): ParsedConversation | null {
  const platform = detectPlatform(content);

  if (platform === "kakao") {
    return parseKakaoTalk(content, myName);
  } else if (platform === "instagram") {
    return parseInstagram(content, myName);
  }

  return null;
}
