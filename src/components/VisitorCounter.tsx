"use client";

import { useEffect, useState } from "react";

export function VisitorCounter() {
  const [stats, setStats] = useState<{ today: number; total: number } | null>(
    null
  );

  useEffect(() => {
    // 방문 기록 후 카운트 조회
    const track = async () => {
      try {
        // 세션당 1회만 기록
        if (!sessionStorage.getItem("visited")) {
          await fetch("/api/views", { method: "POST" });
          sessionStorage.setItem("visited", "1");
        }
        const res = await fetch("/api/views");
        const data = await res.json();
        setStats(data);
      } catch {
        // 실패해도 사이트 동작에 영향 없음
      }
    };
    track();
  }, []);

  if (!stats) return null;

  return (
    <span className="text-xs text-[var(--text-muted)] tabular-nums">
      오늘 {stats.today.toLocaleString()} · 전체{" "}
      {stats.total.toLocaleString()}
    </span>
  );
}
