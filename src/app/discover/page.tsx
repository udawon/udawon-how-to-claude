import Link from "next/link";
import { getRankings } from "@/lib/rankings";
import { RankingTabs } from "@/components/RankingTabs";
import { ClaudeCharacter } from "@/components/ClaudeCharacter";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude Code 도구 탐색기 | How to Claude",
  description: "GitHub 기반으로 매일 자동 업데이트되는 Claude Code 스킬, MCP, 플러그인, 마켓플레이스 랭킹",
};

export const revalidate = 3600; // ISR: 1시간마다 재생성

export default function DiscoverPage() {
  const data = getRankings();

  const tabs = [
    { key: "skills", label: "스킬", items: data.skills },
    { key: "mcp", label: "MCP", items: data.mcp },
    { key: "plugins", label: "플러그인", items: data.plugins },
    { key: "marketplaces", label: "마켓플레이스", items: data.marketplaces },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <header className="site-header">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <ClaudeCharacter pose="wave" size={24} />
            <span className="font-semibold text-[15px] text-[var(--text-primary)]">
              How to Claude
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* 메인 */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-5 sm:px-8 py-10">
        {/* 타이틀 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Claude Code 도구 탐색기
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            GitHub 토픽 기반으로 매일 자동 수집되는 인기 도구 랭킹
          </p>
        </div>

        {/* 탭 + 목록 */}
        <RankingTabs tabs={tabs} updatedAt={data.updatedAt} />
      </main>
    </div>
  );
}
