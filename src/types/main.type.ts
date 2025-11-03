export interface MainAnalysis {
  averageScore: number;
  consecutiveDays: number;
  weeklyCount: number;
}

export interface MainRecentSummary {
  id: number;
  similarity_score: number;
  user_summary: string;
  created_at: string;
}
