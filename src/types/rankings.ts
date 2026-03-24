export interface RankingItem {
  rank: number;
  name: string;
  repo: string;
  stars: number;       // MCP: useCount(실사용량) / Skills: 0
  description: string;
  koreanDesc: string;
  url: string;
  isOfficial: boolean;
  updatedAt: string;
  installCommand?: string;
  category?: string;
  qualityScore?: number; // Skills 전용: Smithery qualityScore (0~1)
}

export interface RankingsData {
  updatedAt: string;
  skills: RankingItem[];
  mcp: RankingItem[];
}
