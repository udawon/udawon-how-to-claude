import { describe, it, expect } from "vitest";

// ── mapSkills 로직 ────────────────────────────────────────────────
function mapSkills(items, cache, limit = 100) {
  return items.slice(0, limit).map((it, i) => {
    const repo = `${it.namespace}/${it.slug}`;
    return {
      rank: i + 1,
      name: it.displayName || it.slug,
      repo,
      stars: 0,
      description: it.description || "",
      koreanDesc: cache.get(repo) || "",
      url: `https://smithery.ai/skills/${it.namespace}/${it.slug}`,
      isOfficial: it.namespace === "anthropics" || it.verified === true,
      updatedAt: it.createdAt?.split("T")[0] || "",
      installCommand: "",
      category: (it.categories || []).join(", "),
      qualityScore: it.qualityScore || 0,
    };
  });
}

// ── mapMcp 로직 ───────────────────────────────────────────────────
function mapMcp(items, cache, limit = 100) {
  return items
    .sort((a, b) => (b.useCount || 0) - (a.useCount || 0))
    .slice(0, limit)
    .map((it, i) => ({
      rank: i + 1,
      name: it.displayName,
      repo: it.qualifiedName,
      stars: it.useCount || 0,
      description: it.description || "",
      koreanDesc: cache.get(it.qualifiedName) || "",
      url: `https://smithery.ai/servers/${it.qualifiedName}`,
      isOfficial: it.verified === true,
      updatedAt: it.createdAt?.split("T")[0] || "",
      installCommand: `npx @smithery/cli install ${it.qualifiedName}`,
      category: it.remote ? "remote" : "local",
      qualityScore: 0,
    }));
}

// ── 테스트 ────────────────────────────────────────────────────────
describe("mapSkills", () => {
  it("qualityScore와 repo를 올바르게 매핑", () => {
    const items = [
      {
        namespace: "anthropics",
        slug: "pdf",
        displayName: "PDF",
        description: "PDF manipulation",
        qualityScore: 0.978,
        categories: ["Productivity"],
        createdAt: "2026-01-01T00:00:00Z",
        verified: true,
      },
    ];
    const result = mapSkills(items, new Map());
    expect(result[0].rank).toBe(1);
    expect(result[0].repo).toBe("anthropics/pdf");
    expect(result[0].qualityScore).toBeCloseTo(0.978);
    expect(result[0].isOfficial).toBe(true);
    expect(result[0].stars).toBe(0);
    expect(result[0].url).toBe("https://smithery.ai/skills/anthropics/pdf");
    expect(result[0].category).toBe("Productivity");
    expect(result[0].updatedAt).toBe("2026-01-01");
  });

  it("번역 캐시 재사용", () => {
    const items = [{ namespace: "foo", slug: "bar", displayName: "Bar", qualityScore: 0.5, categories: [] }];
    const cache = new Map([["foo/bar", "바 도구 설명"]]);
    const result = mapSkills(items, cache);
    expect(result[0].koreanDesc).toBe("바 도구 설명");
  });

  it("anthropics namespace → isOfficial=true", () => {
    const items = [{ namespace: "anthropics", slug: "skill-creator", displayName: "Skill Creator", qualityScore: 0.99, categories: [], verified: false }];
    const result = mapSkills(items, new Map());
    expect(result[0].isOfficial).toBe(true);
  });

  it("빈 배열 → 빈 배열 반환", () => {
    expect(mapSkills([], new Map())).toEqual([]);
  });
});

describe("mapMcp", () => {
  it("useCount 내림차순 정렬 후 rank 부여", () => {
    const items = [
      { qualifiedName: "low", displayName: "Low", useCount: 100, verified: false, remote: true },
      { qualifiedName: "high", displayName: "High", useCount: 50000, verified: true, remote: false },
      { qualifiedName: "mid", displayName: "Mid", useCount: 5000, verified: false, remote: true },
    ];
    const result = mapMcp(items, new Map());
    expect(result[0].repo).toBe("high");
    expect(result[0].rank).toBe(1);
    expect(result[0].stars).toBe(50000);
    expect(result[1].repo).toBe("mid");
    expect(result[2].repo).toBe("low");
  });

  it("verified=true → isOfficial=true", () => {
    const items = [{ qualifiedName: "official-mcp", displayName: "Official", useCount: 1000, verified: true, remote: true }];
    const result = mapMcp(items, new Map());
    expect(result[0].isOfficial).toBe(true);
  });

  it("installCommand 형식 확인", () => {
    const items = [{ qualifiedName: "exa", displayName: "Exa", useCount: 100, verified: false, remote: true }];
    const result = mapMcp(items, new Map());
    expect(result[0].installCommand).toBe("npx @smithery/cli install exa");
  });

  it("빈 배열 → 빈 배열 반환", () => {
    expect(mapMcp([], new Map())).toEqual([]);
  });
});
