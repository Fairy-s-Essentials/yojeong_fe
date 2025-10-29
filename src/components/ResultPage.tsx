import { useState } from "react";
import { ArrowLeft, ExternalLink, Star, TrendingUp } from "lucide-react";
import { Button } from "./ui/buttons/button";
import { Textarea } from "./ui/forms/textarea";
import type { Article } from "../types/article";

type ResultPageProps = {
  article: Article;
  onComplete: (article: Article) => void;
  onBack: () => void;
};

export default function ResultPage({
  article,
  onComplete,
  onBack,
}: ResultPageProps) {
  const [learningNote, setLearningNote] = useState(article.learnings || "");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  const handleComplete = () => {
    const updatedArticle = {
      ...article,
      learnings: learningNote.trim() || article.learnings,
    };
    onComplete(updatedArticle);
  };

  const userSummary = article.userSummary?.[0] || "";
  const aiSummary = article.aiSummary?.[0] || "";

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="border-b border-app-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-app-gray-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-app-gray-500" />
            </button>
            <h1 className="text-app-gray-800">📊 AI 분석 결과</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Article Info */}
        <div className="bg-app-gray-50 rounded-xl p-6 mb-12">
          <h2 className="text-app-gray-800 mb-4">{article.title}</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-app-gray-500">
              <ExternalLink className="w-4 h-4" />
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-app-blue hover:underline"
              >
                {article.url}
              </a>
            </div>
            <div className="flex items-center gap-4 text-sm text-app-gray-500">
              {article.difficulty && (
                <div className="flex items-center gap-1">
                  <span>난이도:</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= article.difficulty!
                            ? "fill-app-orange text-app-orange"
                            : "text-app-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
              <span>•</span>
              <span>읽기 시간: {formatTime(article.readingTime)}</span>
              {article.completedAt && (
                <>
                  <span>•</span>
                  <span>
                    {new Date(article.completedAt).toLocaleDateString("ko-KR")}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Accuracy Score */}
        <div className="bg-gradient-to-r from-app-blue to-app-purple rounded-2xl p-8 mb-12 text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm opacity-80 mb-2">정확도 점수</p>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl">{article.accuracy}</span>
              <span className="text-3xl opacity-80">/100</span>
            </div>
            <div className="flex items-center gap-2 mt-4 opacity-90">
              <TrendingUp className="w-5 h-5" />
              <p>
                평균보다 {Math.max(0, (article.accuracy || 0) - 70)}점 높습니다!
                🎉
              </p>
            </div>
          </div>
          <div className="absolute top-6 right-6 text-5xl">🎯</div>
        </div>

        {/* Comparison */}
        <div className="mb-12">
          <h2 className="text-app-gray-800 mb-6">📝 요약 비교</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-app-gray-800 mb-3">✍️ 당신의 요약</h3>
              <div className="bg-app-gray-50 border-2 border-app-blue rounded-xl p-5 min-h-[200px]">
                <p className="text-app-gray-800 leading-relaxed whitespace-pre-wrap">
                  {userSummary}
                </p>
                <div className="text-xs text-app-gray-500 mt-3 text-right">
                  {userSummary.length}자
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-app-gray-800 mb-3">🤖 AI 요약</h3>
              <div className="bg-app-gray-50 border-2 border-app-green rounded-xl p-5 min-h-[200px]">
                <p className="text-app-gray-800 leading-relaxed whitespace-pre-wrap">
                  {aiSummary}
                </p>
                <div className="text-xs text-app-gray-500 mt-3 text-right">
                  {aiSummary.length}자
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Cards */}
        {article.feedback && (
          <div className="space-y-6 mb-12">
            <h2 className="text-app-gray-800">💬 피드백</h2>

            {/* Strengths */}
            {article.feedback.strengths &&
              article.feedback.strengths.length > 0 && (
                <div className="bg-app-green-light border-l-4 border-app-green rounded-lg p-6">
                  <h3 className="text-green-900 mb-3">✅ 잘 파악한 것</h3>
                  <ul className="space-y-2">
                    {article.feedback.strengths.map((strength, idx) => (
                      <li
                        key={idx}
                        className="text-green-800 flex items-start gap-2"
                      >
                        <span className="mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Missed Points */}
            {article.feedback.missed && article.feedback.missed.length > 0 && (
              <div className="bg-app-orange-light border-l-4 border-app-orange rounded-lg p-6">
                <h3 className="text-yellow-900 mb-3">⚠️ 놓친 포인트</h3>
                <ul className="space-y-2">
                  {article.feedback.missed.map((missed, idx) => (
                    <li
                      key={idx}
                      className="text-yellow-800 flex items-start gap-2"
                    >
                      <span className="mt-1">•</span>
                      <span>{missed}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {article.feedback.suggestions &&
              article.feedback.suggestions.length > 0 && (
                <div className="bg-app-blue-light border-l-4 border-app-blue rounded-lg p-6">
                  <h3 className="text-blue-900 mb-3">💡 개선 제안</h3>
                  <ul className="space-y-2">
                    {article.feedback.suggestions.map((suggestion, idx) => (
                      <li
                        key={idx}
                        className="text-blue-800 flex items-start gap-2"
                      >
                        <span className="mt-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}

        {/* Learning Notes */}
        <div className="mb-12">
          <h3 className="text-app-gray-800 mb-2">💡 배운 점</h3>
          <p className="text-sm text-app-gray-500 mb-4">
            이번 글에서 배운 점을 자유롭게 작성하세요 (선택)
          </p>
          <Textarea
            value={learningNote}
            onChange={(e) => setLearningNote(e.target.value)}
            placeholder="예: 이번에는 반대 의견을 놓쳤다. 다음에는 '하지만', '반면' 같은 키워드에 주목하자"
            className="h-32 resize-none border-dashed border-2 border-app-gray-200 rounded-lg"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleComplete}
            className="flex-1 h-12 bg-app-blue hover:bg-app-blue-dark text-white rounded-lg"
          >
            완료하고 대시보드로 →
          </Button>
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 h-12 border-app-gray-200 text-app-gray-500 hover:bg-app-gray-50 rounded-lg"
          >
            뒤로가기
          </Button>
        </div>
      </div>
    </div>
  );
}
