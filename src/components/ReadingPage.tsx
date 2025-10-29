import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Star,
  Check,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/buttons/button";
import { Textarea } from "./ui/forms/textarea";
import { Label } from "./ui/forms/label";
import { Progress } from "./ui/feedback/progress";
import type { Article } from "../types/article";
import { toast } from "sonner";

type ReadingPageProps = {
  article: Article;
  onAnalysisComplete: (article: Article) => void;
  onBack: () => void;
};

export default function ReadingPage({
  article,
  onAnalysisComplete,
  onBack,
}: ReadingPageProps) {
  const [readingTime, setReadingTime] = useState(0);
  const [difficulty, setDifficulty] = useState(article.difficulty || 0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Summary fields
  const [weakness, setWeakness] = useState("");
  const [counterArgument, setCounterArgument] = useState("");
  const [application, setApplication] = useState("");
  const [summary, setSummary] = useState("");

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setReadingTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate required summary length based on article content length
  const getRequiredSummaryLength = (contentLength: number): number => {
    if (contentLength <= 2000) return 300;
    if (contentLength <= 3500) return 450;
    return 600;
  };

  const requiredSummaryLength = getRequiredSummaryLength(
    article.content.length
  );
  const summaryLength = summary.trim().length;
  const canSubmit = summaryLength >= requiredSummaryLength;

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error(`최소 ${requiredSummaryLength}자 이상 요약을 작성해주세요`);
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate AI analysis with loading
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const updatedArticle: Article = {
        ...article,
        difficulty,
        readingTime,
        completedAt: new Date().toISOString(),
        accuracy: Math.floor(Math.random() * 20) + 75, // 75-95
        userSummary: [summary],
        aiSummary: [
          "AI 기술의 발전은 노동 시장에 근본적인 변화를 가져오고 있으며, 단순 반복 작업뿐만 아니라 지식 기반 직업까지 자동화되고 있다. 이러한 변화 속에서 인간은 AI와 경쟁하는 것이 아니라 AI를 효과적으로 활용하는 능력을 키워야 한다. 창의성, 공감 능력, 비판적 사고와 같은 인간 고유의 역량을 개발하고 평생 학습을 통해 지속적으로 적응하는 것이 미래 사회에서 성공하는 핵심 전략이 될 것이다.",
        ],
        feedback: {
          strengths: [
            "핵심 논지를 정확히 이해했습니다",
            "주요 예시를 모두 포함했습니다",
            "논리적 흐름이 명확합니다",
          ],
          missed: [
            "저자의 반론 부분이 누락되었습니다",
            "구체적인 수치나 통계 언급이 없습니다",
          ],
          suggestions: [
            "반대 의견도 포함하면 더 균형잡힌 요약이 됩니다",
            "결론 부분을 더 명확히 표현하세요",
            "핵심 키워드를 활용하면 더 좋습니다",
          ],
        },
      };

      // Navigate to result page
      onAnalysisComplete(updatedArticle);
    } catch {
      toast.error("AI 분석 중 오류가 발생했습니다");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-sm border-b border-app-gray-200 z-50">
        <div className="max-w-4xl mx-auto px-6 h-full flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 hover:bg-app-gray-50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-app-gray-500" />
          </button>
          <div className="flex items-center gap-2 text-app-gray-500">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{formatTime(readingTime)}</span>
          </div>
        </div>
        <Progress value={scrollProgress} className="h-0.5" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        {/* Article Meta Section */}
        <div className="bg-app-gray-50 rounded-xl p-6 border-l-4 border-app-blue mb-12">
          <div className="space-y-4">
            {/* Link */}
            <div>
              <label className="text-xs text-app-gray-500 mb-1 block">
                링크:
              </label>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-app-blue hover:underline flex items-center gap-1"
              >
                {article.url}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Difficulty Rating */}
            <div>
              <label className="text-xs text-app-gray-500 mb-2 block">
                난이도 (선택):
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setDifficulty(star)}
                    className="transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= difficulty
                          ? "fill-app-orange text-app-orange"
                          : "text-app-gray-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reading Tip */}
        <div className="bg-app-orange-light border border-yellow-300 rounded-xl p-4 mb-12 flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-app-orange flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-900">
              <strong>Tip:</strong> 핵심 주장과 근거에 집중하세요. '하지만',
              '그러나', '반면' 같은 연결어에 주목하면 저자의 논리 구조를 더 잘
              파악할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Summary Section */}
        <div className="border-t-2 border-app-gray-200 pt-12">
          <div className="mb-8">
            <h2 className="text-app-gray-800 mb-2">✍️ 나의 요약</h2>
            <p className="text-sm text-app-gray-500">
              글을 읽고 아래 질문에 답해주세요
            </p>
          </div>

          {/* Summary (Required) */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-app-gray-800">📝 요약</h3>
                <span className="text-xs bg-app-red text-white px-2 py-0.5 rounded">
                  필수
                </span>
              </div>
              <div className="text-sm text-app-gray-500">
                최소 {requiredSummaryLength}자 필요
              </div>
            </div>
            <p className="text-sm text-app-gray-500 mb-4">
              글의 핵심 내용을 {requiredSummaryLength}자 이상으로 요약해주세요
            </p>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="글의 전체 흐름과 핵심 주장, 근거를 포함하여 요약해주세요..."
              className={`min-h-[200px] resize-y rounded-lg focus:ring-2 p-4 ${
                summaryLength < requiredSummaryLength && summaryLength > 0
                  ? "border-app-orange focus:ring-app-orange"
                  : summaryLength >= requiredSummaryLength
                  ? "border-app-green focus:ring-app-green"
                  : "border-app-gray-200 focus:ring-app-blue"
              }`}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm">
                {summaryLength < requiredSummaryLength && summaryLength > 0 && (
                  <span className="text-app-orange">
                    {requiredSummaryLength - summaryLength}자 더 필요합니다
                  </span>
                )}
                {summaryLength >= requiredSummaryLength && (
                  <span className="text-app-green">✓ 요약 완료</span>
                )}
              </div>
              <div
                className={`text-sm ${
                  summaryLength < requiredSummaryLength
                    ? "text-app-orange"
                    : "text-app-green"
                }`}
              >
                {summaryLength} / {requiredSummaryLength}자
              </div>
            </div>
          </div>

          {/* Critical Reading */}
          <div className="mb-10">
            <h3 className="text-app-gray-800 mb-4">🤔 비판적 읽기</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-app-gray-500 mb-2 block">
                  이 글의 약점은?
                </Label>
                <Textarea
                  value={weakness}
                  onChange={(e) => setWeakness(e.target.value)}
                  placeholder="자유롭게 작성해주세요..."
                  className="h-20 resize-none border-app-gray-200 rounded-lg focus:ring-2 focus:ring-app-blue"
                />
              </div>
              <div>
                <Label className="text-sm text-app-gray-500 mb-2 block">
                  반대 의견은?
                </Label>
                <Textarea
                  value={counterArgument}
                  onChange={(e) => setCounterArgument(e.target.value)}
                  placeholder="자유롭게 작성해주세요..."
                  className="h-20 resize-none border-app-gray-200 rounded-lg focus:ring-2 focus:ring-app-blue"
                />
              </div>
              <div>
                <Label className="text-sm text-app-gray-500 mb-2 block">
                  실제로 적용하면?
                </Label>
                <Textarea
                  value={application}
                  onChange={(e) => setApplication(e.target.value)}
                  placeholder="자유롭게 작성해주세요..."
                  className="h-20 resize-none border-app-gray-200 rounded-lg focus:ring-2 focus:ring-app-blue"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isAnalyzing}
              className="w-80 h-13 bg-app-blue hover:bg-app-blue-dark text-white rounded-xl shadow-lg disabled:bg-app-gray-200 disabled:text-app-gray-400 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  AI가 분석 중입니다...
                </>
              ) : canSubmit ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  AI 분석 시작
                </>
              ) : (
                `요약 작성 필요 (최소 ${requiredSummaryLength}자)`
              )}
            </Button>
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-app-red">
              <span>⚠️</span>
              <span className="italic">제출 후 수정이 불가능합니다</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <Loader2 className="w-16 h-16 text-app-blue mx-auto mb-4 animate-spin" />
            <h3 className="text-app-gray-800 mb-2">
              AI가 요약을 분석하고 있습니다
            </h3>
            <p className="text-sm text-app-gray-500">잠시만 기다려주세요...</p>
          </div>
        </div>
      )}
    </div>
  );
}
