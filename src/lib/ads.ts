// 광고 연동 유틸리티
// 실제 광고 SDK (예: Google AdMob, AdSense) 연동 시 이 파일을 수정

type AdCallback = () => void;

interface AdConfig {
  onAdComplete?: AdCallback;
  onAdError?: (error: Error) => void;
  onAdSkipped?: AdCallback;
}

// 개발 환경에서는 모의 광고 사용
const isDevelopment = process.env.NODE_ENV === "development";

// 모의 광고 표시 (개발용)
function showMockAd(config: AdConfig): void {
  // 개발 환경에서는 2초 후 광고 완료 처리
  console.log("[Dev] Mock ad started");

  setTimeout(() => {
    console.log("[Dev] Mock ad completed");
    config.onAdComplete?.();
  }, 2000);
}

// 실제 Google AdMob 보상형 광고 연동
// 프로덕션에서 사용할 실제 구현
async function showRewardedAd(config: AdConfig): Promise<void> {
  if (isDevelopment) {
    showMockAd(config);
    return;
  }

  // Google AdSense / AdMob 연동
  // 실제 구현 시 아래 코드를 활성화
  try {
    // window.adsbygoogle 또는 다른 광고 SDK 사용
    // 예시: Google Interactive Media Ads (IMA) SDK

    // 광고가 없거나 로드 실패 시 바로 완료 처리 (사용자 경험 우선)
    config.onAdComplete?.();
  } catch (error) {
    console.error("Ad error:", error);
    config.onAdError?.(error as Error);
  }
}

// 광고 시청 프로미스 래퍼
export function watchAd(): Promise<boolean> {
  return new Promise((resolve) => {
    showRewardedAd({
      onAdComplete: () => resolve(true),
      onAdError: () => resolve(false),
      onAdSkipped: () => resolve(false),
    });
  });
}

// 광고 사용 가능 여부 확인
export function isAdAvailable(): boolean {
  // 실제 구현 시 광고 SDK의 광고 가용성 확인
  return true;
}
