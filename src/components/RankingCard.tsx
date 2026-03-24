import type { RankingItem } from "@/types/rankings";

interface RankingCardProps {
  item: RankingItem;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toString();
}

export function RankingCard({ item }: RankingCardProps) {
  const hasQualityScore = typeof item.qualityScore === "number" && item.qualityScore > 0;
  const hasUseCount = item.stars > 0;

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div
        className="flex items-start gap-4 px-4 py-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] hover:border-[var(--accent)] transition-all duration-150"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        {/* 순위 */}
        <span className="flex-none w-7 text-right text-sm font-mono text-[var(--text-muted)] pt-0.5">
          #{item.rank}
        </span>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          {/* 이름 + 배지 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[var(--text-primary)] text-sm truncate group-hover:text-[var(--accent)] transition-colors">
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

          {/* 한국어 설명 (있으면 우선 표시) */}
          {item.koreanDesc ? (
            <p className="mt-1 text-sm text-[var(--text-primary)] leading-snug">
              {item.koreanDesc}
            </p>
          ) : item.description ? (
            <p className="mt-1 text-xs text-[var(--text-secondary)] line-clamp-2">
              {item.description}
            </p>
          ) : null}

          {/* 레포 경로 */}
          <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
            {item.repo}
          </p>

          {/* 설치 명령어 */}
          {item.installCommand && (
            <code
              className="inline-block mt-1.5 text-[11px] px-2 py-0.5 rounded bg-[var(--bg-code)] text-[var(--code-text)] font-mono"
              onClick={(e) => e.preventDefault()}
            >
              {item.installCommand}
            </code>
          )}
        </div>

        {/* 점수 / 사용량 */}
        <div className="flex-none flex items-center gap-1 text-xs text-[var(--text-muted)] pt-0.5">
          {hasQualityScore ? (
            /* Skills: qualityScore 표시 */
            <div className="flex items-center gap-1">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-emerald-400"
                aria-hidden="true"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="font-mono">{(item.qualityScore! * 100).toFixed(0)}</span>
            </div>
          ) : hasUseCount ? (
            /* MCP: useCount 표시 */
            <div className="flex items-center gap-1">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-blue-400"
                aria-hidden="true"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="font-mono">{formatCount(item.stars)}</span>
            </div>
          ) : null}
        </div>
      </div>
    </a>
  );
}
