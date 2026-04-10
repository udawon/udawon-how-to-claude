"use client";



import type { RankingItem } from "@/types/rankings";

interface RankingCardProps {
  item: RankingItem;
  isOpen: boolean;
  onToggle: () => void;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toString();
}


export function RankingCard({ item, isOpen, onToggle }: RankingCardProps) {
  const isSkill = typeof item.qualityScore === "number" && item.qualityScore > 0;
  const hasStars = item.stars > 0;
  const linkUrl = item.githubUrl || item.url;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden transition-all duration-150 hover:border-[var(--accent)]"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      {/* 카드 헤더 (클릭 → 아코디언 토글) */}
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-4 px-4 py-4 text-left hover:bg-[var(--bg-hover)] transition-colors duration-150"
      >
        {/* 순위 */}
        <span className="flex-none w-7 text-right text-sm font-mono text-[var(--text-muted)] pt-0.5">
          #{item.rank}
        </span>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          {/* 이름 + 배지 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[var(--text-primary)] text-sm truncate">
              {item.name}
            </span>
            {item.isOfficial && (
              <span className="flex-none text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[var(--accent-soft)] text-[var(--accent-text)]">
                Official
              </span>
            )}
            {item.category && (
              <span className="flex-none text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                {item.category}
              </span>
            )}
          </div>

          {/* 한국어 설명 */}
          {item.koreanDesc ? (
            <p className="mt-1 text-sm text-[var(--text-secondary)] leading-snug line-clamp-1">
              {item.koreanDesc}
            </p>
          ) : item.description ? (
            <p className="mt-1 text-xs text-[var(--text-muted)] line-clamp-1">
              {item.description}
            </p>
          ) : null}
        </div>

        {/* 우측: 스타/사용량 + 화살표 */}
        <div className="flex-none flex items-center gap-2 pt-0.5">
          {isSkill && hasStars ? (
            <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-400" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="font-mono">{formatCount(item.stars)}</span>
            </div>
          ) : !isSkill && hasStars ? (
            <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="font-mono">{formatCount(item.stars)}</span>
            </div>
          ) : null}

          {/* 화살표 */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      {/* 아코디언 패널 */}
      {isOpen && (
        <div className="px-4 pb-4 border-t border-[var(--border)] pt-4 space-y-4">

          {/* 한 줄 설명 */}
          {item.koreanDesc && (
            <div>
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">
                이 도구는
              </p>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                {item.koreanDesc}
              </p>
            </div>
          )}


          {/* 설치 명령어 (MCP) */}
          {item.installCommand && (
            <div>
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">
                설치 명령어
              </p>
              <code className="block text-[12px] px-3 py-2 rounded-lg bg-[var(--bg-code)] text-[var(--code-text)] font-mono break-all">
                {item.installCommand}
              </code>
            </div>
          )}

          {/* 링크 버튼 */}
          <div className="flex gap-2 pt-1">
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border border-[var(--border)] transition-all duration-150"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              {isSkill ? "GitHub에서 보기" : "Smithery에서 보기"}
            </a>
            {isSkill && item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border border-[var(--border)] transition-all duration-150"
              >
                Smithery에서 보기
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
