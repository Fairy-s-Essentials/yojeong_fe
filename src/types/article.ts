export type Article = {
  id: string;
  url: string;
  title: string;
  content: string;
  difficulty?: number;
  readingTime: number;
  completedAt?: string;
  accuracy?: number;
  userSummary?: string[];
  aiSummary?: string[];
  learnings?: string;
  feedback?: {
    strengths: string[];
    missed: string[];
    suggestions: string[];
  };
};
