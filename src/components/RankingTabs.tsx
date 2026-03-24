"use client";

import { useState } from "react";
import { RankingCard } from "./RankingCard";
import type { RankingItem } from "@/types/rankings";

type SortKey = "popular" | "recent";

interface Tab {
  key: string;
  label: string;
  items: RankingItem[];
}

interface RankingTabsProps {
  tabs: Tab[];
  updatedAt: string;
}

function sortItems(items: RankingItem[], sort: SortKey): RankingItem[] {
  if (sort === "popular") return items; // 이미 stars 내림차순
  return [...items].sort((a, b) => {
    if (!a.updatedAt) return 1;
    if (!b.updatedAt) return -1;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

function formatUpdatedAt(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function RankingTabs({ tabs, updatedAt }: RankingTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key ?? "");
  const [sort, setSort] = useState<SortKey>("popular");

  const current = tabs.find((t) => t.key === activeTab);
  const items = current ? sortItems(current.items, sort) : [];
  const isEmpty = items.length === 0;

  return (
    <div>
      {/* 탭 바 */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
        <div className="flex gap-1 p-1 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                activeTab === tab.key
                  ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {tab.label}
              {tab.items.length > 0 && (
                <span className="ml-1.5 text-[10px] font-mono text-[var(--text-muted)]">
                  {tab.items.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 정렬 */}
        <div className="flex gap-1 p-1 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]">
          {(["popular", "recent"] as SortKey[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                sort === s
                  ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {s === "popular" ? "인기순" : "최신순"}
            </button>
          ))}
        </div>
      </div>

      {/* 목록 */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-[var(--text-muted)] mb-3"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <p className="text-sm text-[var(--text-muted)]">
            현재 데이터를 수집 중입니다
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            매일 자동으로 업데이트됩니다
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <RankingCard key={item.repo} item={item} />
          ))}
        </div>
      )}

      {/* 업데이트 시각 */}
      {updatedAt && (
        <p className="mt-5 text-center text-xs text-[var(--text-muted)]">
          마지막 업데이트: {formatUpdatedAt(updatedAt)}
        </p>
      )}
    </div>
  );
}
