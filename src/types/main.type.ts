export interface MainAnalysis {
  averageScore: number;
  consecutiveDays: number;
  weeklyCount: number;
}

export interface MainRecentSummary {
  id: number;
  similarityScore: number;
  userSummary: string;
  createdAt: string;
}
