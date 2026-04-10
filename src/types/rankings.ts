export interface RankingItem {
  rank: number;
  name: string;
  repo: string;
  stars: number;       // Skills: GitHub externalStars / MCP: useCount(실사용량)
  description: string;
  koreanDesc: string;
  url: string;         // Smithery URL
  githubUrl?: string | null; // Skills 전용: GitHub 레포 URL
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
