import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fs from "fs";

// fs 모듈 모킹
vi.mock("fs");

const mockReadFileSync = vi.mocked(fs.readFileSync);

// 모듈은 각 테스트 전에 재로드되어야 하므로 동적 import 사용
async function loadRankings() {
  vi.resetModules();
  const { getRankings } = await import("../rankings");
  return getRankings;
}

const VALID_DATA = {
  updatedAt: "2026-03-25T00:00:00Z",
  skills: [
    {
      rank: 1,
      name: "pdf",
      repo: "anthropics/pdf",
      stars: 0,
      description: "PDF manipulation",
      koreanDesc: "",
      url: "https://smithery.ai/skills/anthropics/pdf",
      isOfficial: true,
      updatedAt: "2026-03-24",
      qualityScore: 0.978,
    },
  ],
  mcp: [],
};

describe("getRankings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("rankings.json이 없으면 빈 데이터 반환 (크래시 없음)", async () => {
    mockReadFileSync.mockImplementation(() => {
      throw new Error("ENOENT: no such file");
    });

    const getRankings = await loadRankings();
    const result = getRankings();

    expect(result.skills).toEqual([]);
    expect(result.mcp).toEqual([]);
    expect(result.updatedAt).toBe("");
  });

  it("유효한 rankings.json이 있으면 파싱해서 반환", async () => {
    mockReadFileSync.mockReturnValue(JSON.stringify(VALID_DATA));

    const getRankings = await loadRankings();
    const result = getRankings();

    expect(result.updatedAt).toBe("2026-03-25T00:00:00Z");
    expect(result.skills).toHaveLength(1);
    expect(result.skills[0].name).toBe("pdf");
    expect(result.skills[0].qualityScore).toBeCloseTo(0.978);
    expect(result.skills[0].isOfficial).toBe(true);
  });

  it("JSON 파싱 실패 시 빈 데이터 반환 (크래시 없음)", async () => {
    mockReadFileSync.mockReturnValue("not-valid-json{{{");

    const getRankings = await loadRankings();
    const result = getRankings();

    expect(result.skills).toEqual([]);
    expect(result.updatedAt).toBe("");
  });

  it("mcp가 비어도 정상 반환", async () => {
    const data = { ...VALID_DATA, mcp: [] };
    mockReadFileSync.mockReturnValue(JSON.stringify(data));

    const getRankings = await loadRankings();
    const result = getRankings();

    expect(result.mcp).toEqual([]);
    expect(result.skills).toHaveLength(1);
  });

  it("반환값에 skills, mcp, updatedAt 키가 존재", async () => {
    mockReadFileSync.mockImplementation(() => {
      throw new Error("ENOENT");
    });

    const getRankings = await loadRankings();
    const result = getRankings();

    expect(result).toHaveProperty("skills");
    expect(result).toHaveProperty("mcp");
    expect(result).toHaveProperty("updatedAt");
  });
});
