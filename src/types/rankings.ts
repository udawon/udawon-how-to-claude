export interface RankingItem {
  rank: number;
  name: string;
  repo: string;
  stars: number;
  description: string;
  koreanDesc: string;
  url: string;
  isOfficial: boolean;
  updatedAt: string;
}

export interface RankingsData {
  updatedAt: string;
  skills: RankingItem[];
  mcp: RankingItem[];
  plugins: RankingItem[];
  marketplaces: RankingItem[];
}
