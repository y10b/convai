"use client";

interface AdBannerProps {
  className?: string;
}

export default function AdBanner({ className = "" }: AdBannerProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* 카카오 애드핏 배너 영역 */}
      {/* 실제 배포 시 카카오 애드핏 스크립트로 교체 */}
      <div
        className="w-full h-[50px] bg-[var(--color-surface)] rounded-lg flex items-center justify-center"
        role="complementary"
        aria-label="광고"
      >
        <p className="text-[12px] text-[var(--color-text-tertiary)]">
          광고 영역
        </p>
      </div>

      {/*
        실제 카카오 애드핏 코드:
        <ins
          class="kakao_ad_area"
          style="display:none;"
          data-ad-unit="YOUR_AD_UNIT_ID"
          data-ad-width="320"
          data-ad-height="50"
        ></ins>
        <script
          type="text/javascript"
          src="//t1.daumcdn.net/kas/static/ba.min.js"
          async
        ></script>
      */}
    </div>
  );
}
