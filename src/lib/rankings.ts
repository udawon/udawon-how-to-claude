import fs from "fs";
import path from "path";
import type { RankingsData } from "@/types/rankings";

const EMPTY_DATA: RankingsData = {
  updatedAt: "",
  skills: [],
  mcp: [],
};

export function getRankings(): RankingsData {
  const filePath = path.join(process.cwd(), "data", "rankings.json");

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw) as RankingsData;
    return data;
  } catch {
    // 파일 없거나 파싱 실패 시 빈 데이터 반환 (첫 배포 시 크래시 방지)
    return EMPTY_DATA;
  }
}
