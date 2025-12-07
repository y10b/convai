import { BasicAnalysis } from "@/types";

const HISTORY_KEY = "convai_history";
const MAX_HISTORY = 10;

export interface AnalysisHistory {
  id: string;
  date: string;
  temperature: number;
  temperatureLabel: string;
  messageCount: number;
  platform: "kakao" | "instagram";
}

export function saveAnalysis(
  analysis: BasicAnalysis,
  platform: "kakao" | "instagram"
): void {
  if (typeof window === "undefined") return;

  const history = getHistory();

  const newEntry: AnalysisHistory = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    temperature: analysis.temperature,
    temperatureLabel: analysis.temperatureLabel,
    messageCount: analysis.messageCount.total,
    platform,
  };

  history.unshift(newEntry);

  // 최대 10개까지만 저장
  if (history.length > MAX_HISTORY) {
    history.pop();
  }

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getHistory(): AnalysisHistory[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getLastAnalysis(): AnalysisHistory | null {
  const history = getHistory();
  return history.length > 0 ? history[0] : null;
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}

export function getTemperatureChange(): number | null {
  const history = getHistory();
  if (history.length < 2) return null;
  return history[0].temperature - history[1].temperature;
}
