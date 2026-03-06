import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BackgroundCharacters } from "@/components/BackgroundCharacters";
import { ScrollToTop } from "@/components/ScrollToTop";
import "./globals.css";

export const metadata: Metadata = {
  title: "How to Claude - 활용 매뉴얼",
  description: "Claude Code 기능과 활용법을 정리한 레퍼런스 매뉴얼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        <ThemeProvider>
          <BackgroundCharacters />
          {children}
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
