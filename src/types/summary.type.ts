export interface SaveSummaryProps {
  originalText: string; // 원문 텍스트
  originalUrl?: string; // 원문 링크
  difficultyLevel?: number; // 사용자 체감 난이도
  userSummary: string; // 사용자 요약
  criticalWeakness?: string; // 비판적 읽기 : 약점
  criticalOpposite?: string; // 비판적 읽기 : 반대 의견
}
