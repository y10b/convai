"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  className?: string;
}

export default function AdBanner({ className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;
    isLoaded.current = true;

    // 스크립트가 이미 있는지 확인
    if (!document.getElementById("kakao-adfit-script")) {
      const script = document.createElement("script");
      script.id = "kakao-adfit-script";
      script.type = "text/javascript";
      script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className={`w-full ${className}`} ref={adRef}>
      <ins
        className="kakao_ad_area"
        style={{ display: "none" }}
        data-ad-unit="DAN-15cwefZ3EXH6d7aW"
        data-ad-width="320"
        data-ad-height="100"
      />
    </div>
  );
}
