"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  category: string;
  slug: string;
}

export function DeleteDocButton({ category, slug }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleClose() {
    setOpen(false);
    setPassword("");
    setError("");
  }

  async function handleSubmit() {
    if (!password) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/delete-doc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, slug, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "오류가 발생했습니다");
      return;
    }

    router.push(`/docs/${category}`);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-[var(--text-muted)] hover:text-red-500 transition-colors"
      >
        이 문서 숨기기
      </button>

      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div
            className="rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">
              문서 숨기기
            </h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              관리자 비밀번호를 입력하면 목록에서 즉시 사라집니다.
            </p>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
              className="w-full px-3 py-2 rounded-lg text-sm mb-3 outline-none"
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
            {error && (
              <p className="text-xs text-red-500 mb-3">{error}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 rounded-lg text-sm"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !password}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 transition-colors"
              >
                {loading ? "처리 중..." : "숨기기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
