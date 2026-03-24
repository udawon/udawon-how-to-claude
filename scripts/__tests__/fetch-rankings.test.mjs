import { describe, it, expect, vi, beforeEach } from "vitest";

// fetch-rankings.mjs의 핵심 로직을 직접 테스트
// (파일 I/O와 분리하여 순수 함수만 테스트)

// ── dedup 로직 ────────────────────────────────────────────────────
function dedup(items) {
  const seen = new Map();
  for (const item of items) {
    const key = item.full_name;
    if (!seen.has(key) || item.stargazers_count > seen.get(key).stargazers_count) {
      seen.set(key, item);
    }
  }
  return Array.from(seen.values()).sort((a, b) => b.stargazers_count - a.stargazers_count);
}

// ── toRankingItem 로직 ────────────────────────────────────────────
function toRankingItem(item, rank) {
  return {
    rank,
    name: item.name,
    repo: item.full_name,
    stars: item.stargazers_count,
    description: item.description || "",
    koreanDesc: "",
    url: item.html_url,
    isOfficial: item.owner?.login === "anthropics",
    updatedAt: item.updated_at ? item.updated_at.split("T")[0] : "",
  };
}

// ── 테스트 ────────────────────────────────────────────────────────
describe("dedup", () => {
  it("중복 full_name 중 stars 높은 것만 유지", () => {
    const items = [
      { full_name: "a/b", stargazers_count: 100 },
      { full_name: "a/b", stargazers_count: 200 },
      { full_name: "c/d", stargazers_count: 50 },
    ];
    const result = dedup(items);
    expect(result).toHaveLength(2);
    expect(result[0].full_name).toBe("a/b");
    expect(result[0].stargazers_count).toBe(200);
  });

  it("stars 내림차순으로 정렬", () => {
    const items = [
      { full_name: "a/a", stargazers_count: 10 },
      { full_name: "b/b", stargazers_count: 500 },
      { full_name: "c/c", stargazers_count: 200 },
    ];
    const result = dedup(items);
    expect(result[0].stargazers_count).toBe(500);
    expect(result[1].stargazers_count).toBe(200);
    expect(result[2].stargazers_count).toBe(10);
  });

  it("빈 배열 입력 시 빈 배열 반환", () => {
    expect(dedup([])).toEqual([]);
  });
});

describe("toRankingItem", () => {
  it("기본 필드 매핑", () => {
    const item = {
      name: "my-skill",
      full_name: "owner/my-skill",
      stargazers_count: 42,
      description: "A great skill",
      html_url: "https://github.com/owner/my-skill",
      owner: { login: "owner" },
      updated_at: "2026-03-24T12:00:00Z",
    };
    const result = toRankingItem(item, 1);

    expect(result.rank).toBe(1);
    expect(result.name).toBe("my-skill");
    expect(result.repo).toBe("owner/my-skill");
    expect(result.stars).toBe(42);
    expect(result.description).toBe("A great skill");
    expect(result.koreanDesc).toBe("");
    expect(result.isOfficial).toBe(false);
    expect(result.updatedAt).toBe("2026-03-24");
  });

  it("Anthropic 공식 레포는 isOfficial=true", () => {
    const item = {
      name: "claude-code",
      full_name: "anthropics/claude-code",
      stargazers_count: 9999,
      description: "Official",
      html_url: "https://github.com/anthropics/claude-code",
      owner: { login: "anthropics" },
      updated_at: "2026-03-24T00:00:00Z",
    };
    const result = toRankingItem(item, 1);
    expect(result.isOfficial).toBe(true);
  });

  it("description이 null이면 빈 문자열", () => {
    const item = {
      name: "tool",
      full_name: "a/tool",
      stargazers_count: 1,
      description: null,
      html_url: "https://github.com/a/tool",
      owner: { login: "a" },
      updated_at: null,
    };
    const result = toRankingItem(item, 5);
    expect(result.description).toBe("");
    expect(result.updatedAt).toBe("");
  });
});
