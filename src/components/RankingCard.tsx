import type { RankingItem } from "@/types/rankings";

interface RankingCardProps {
  item: RankingItem;
}

function formatStars(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toString();
}

export function RankingCard({ item }: RankingCardProps) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div
        className="flex items-start gap-4 px-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] hover:border-[var(--accent)] transition-all duration-150"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        {/* 순위 */}
        <span className="flex-none w-7 text-right text-sm font-mono text-[var(--text-muted)] pt-0.5">
          #{item.rank}
        </span>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-[var(--text-primary)] text-sm truncate group-hover:text-[var(--accent)] transition-colors">
              {item.name}
            </span>
            {item.isOfficial && (
              <span className="flex-none text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[var(--accent-soft)] text-[var(--accent-text)] border border-[var(--accent)] border-opacity-20">
                Official
              </span>
            )}
          </div>

          <p className="mt-0.5 text-xs text-[var(--text-secondary)] line-clamp-2">
            {item.description || (
              <span className="text-[var(--text-muted)] italic">설명 없음</span>
            )}
          </p>

          <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
            {item.repo}
          </p>
        </div>

        {/* 별 수 */}
        <div className="flex-none flex items-center gap-1 text-xs text-[var(--text-muted)] pt-0.5">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-amber-400"
            aria-hidden="true"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="font-mono">{formatStars(item.stars)}</span>
        </div>
      </div>
    </a>
  );
}
