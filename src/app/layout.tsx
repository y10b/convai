import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "Convai - 대화 감정 분석 서비스",
  description:
    "카카오톡, 인스타그램 DM 대화를 AI로 분석하여 상대방의 감정과 관심도를 파악하세요. 로그인 없이 즉시 분석, 대화 저장 없음.",
  keywords: [
    "카톡 분석",
    "대화 분석",
    "감정 분석",
    "썸 분석",
    "관계 분석",
    "AI 대화 분석",
    "카카오톡 심리 분석",
  ],
  authors: [{ name: "Convai" }],
  openGraph: {
    title: "Convai - 대화 감정 분석 서비스",
    description:
      "카카오톡, 인스타그램 DM 대화를 AI로 분석하여 상대방의 감정과 관심도를 파악하세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "Convai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Convai - 대화 감정 분석 서비스",
    description:
      "카카오톡, 인스타그램 DM 대화를 AI로 분석하여 상대방의 감정과 관심도를 파악하세요.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-adsense-account" content="ca-pub-1379539108387521" />
        <link rel="canonical" href="https://convai.app" />
      </head>
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
