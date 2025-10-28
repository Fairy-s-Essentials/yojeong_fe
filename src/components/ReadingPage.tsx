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
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import type { Article } from "../types/article";
import { toast } from "sonner";

type ReadingPageProps = {
  article: Article;
  onComplete: (article: Article) => void;
  onBack: () => void;
};

export default function ReadingPage({
  article,
  onComplete,
  onBack,
}: ReadingPageProps) {
  const [readingTime, setReadingTime] = useState(0);
  const [difficulty, setDifficulty] = useState(article.difficulty || 0);
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Summary fields
  const [weakness, setWeakness] = useState("");
  const [counterArgument, setCounterArgument] = useState("");
  const [application, setApplication] = useState("");
  const [connection, setConnection] = useState("");
  const [projectApplication, setProjectApplication] = useState("");
  const [summary1, setSummary1] = useState("");
  const [summary2, setSummary2] = useState("");
  const [summary3, setSummary3] = useState("");
  const [learningNote, setLearningNote] = useState("");

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

  const canSubmit = summary1.trim() && summary2.trim() && summary3.trim();

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error("3줄 요약을 모두 작성해주세요");
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const updatedArticle: Article = {
      ...article,
      difficulty,
      readingTime,
      completedAt: new Date().toISOString(),
      accuracy: Math.floor(Math.random() * 20) + 75, // 75-95
      userSummary: [summary1, summary2, summary3],
      aiSummary: [
        "AI는 많은 직업을 대체하지만 동시에 새로운 기회를 창출한다",
        "AI와 경쟁하는 것이 아니라 AI를 도구로 활용하는 능력이 중요하다",
        "평생 학습과 창의성, 공감 능력 같은 인간 고유의 능력 개발이 필요하다",
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

    setIsAnalyzing(false);
    setShowResults(true);

    // Scroll to results
    setTimeout(() => {
      document
        .getElementById("results")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    setTimeout(() => {
      onComplete(updatedArticle);
    }, 5000);
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
          <Lightbulb className="w-6 h-6 text-app-orange shrink-0 mt-0.5" />
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

          {/* Connections */}
          <div className="mb-10">
            <h3 className="text-app-gray-800 mb-4">🔗 연결 짓기</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-app-gray-500 mb-2 block">
                  어제 읽은 글과 연결점은?
                </Label>
                <Textarea
                  value={connection}
                  onChange={(e) => setConnection(e.target.value)}
                  placeholder="자유롭게 작성해주세요..."
                  className="h-20 resize-none border-app-gray-200 rounded-lg focus:ring-2 focus:ring-app-blue"
                />
              </div>
              <div>
                <Label className="text-sm text-app-gray-500 mb-2 block">
                  내 프로젝트에 적용하면?
                </Label>
                <Textarea
                  value={projectApplication}
                  onChange={(e) => setProjectApplication(e.target.value)}
                  placeholder="자유롭게 작성해주세요..."
                  className="h-20 resize-none border-app-gray-200 rounded-lg focus:ring-2 focus:ring-app-blue"
                />
              </div>
            </div>
          </div>

          {/* 3-Line Summary (Required) */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-app-gray-800">📝 3줄 요약</h3>
              <span className="text-xs bg-app-red text-white px-2 py-0.5 rounded">
                필수
              </span>
            </div>
            <p className="text-sm text-app-red mb-4">
              최소 3줄 이상 작성해주세요
            </p>
            <div className="space-y-4">
              {[
                { value: summary1, setter: setSummary1, label: "1." },
                { value: summary2, setter: setSummary2, label: "2." },
                { value: summary3, setter: setSummary3, label: "3." },
              ].map((item, idx) => (
                <div key={idx}>
                  <Label className="text-app-gray-800 mb-2 block">
                    {item.label}
                  </Label>
                  <Textarea
                    value={item.value}
                    onChange={(e) => item.setter(e.target.value)}
                    placeholder="요약 내용을 작성하세요..."
                    className={`h-16 resize-none rounded-lg focus:ring-2 focus:ring-app-blue ${
                      !item.value.trim()
                        ? "border-app-red"
                        : "border-app-gray-200"
                    }`}
                  />
                  <div className="text-xs text-app-gray-500 text-right mt-1">
                    {item.value.length} 자
                  </div>
                </div>
              ))}
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
                "3줄 요약 작성 필요"
              )}
            </Button>
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-app-red">
              <span>⚠️</span>
              <span className="italic">제출 후 수정이 불가능합니다</span>
            </div>
          </div>
        </div>

        {/* AI Comparison Results */}
        {showResults && (
          <div
            id="results"
            className="mt-16 pt-12 border-t-4 border-linear-to-r from-app-blue to-app-green"
          >
            {/* Accuracy Score */}
            <div className="bg-linear-to-r from-app-blue to-app-purple rounded-2xl p-8 mb-12 text-white relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-sm opacity-80 mb-2">정확도 점수</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl">78</span>
                  <span className="text-3xl opacity-80">/100</span>
                </div>
                <p className="mt-4 opacity-90">평균보다 8점 높습니다! 🎉</p>
              </div>
              <div className="absolute top-6 right-6 text-5xl">🎯</div>
            </div>

            {/* Comparison */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div>
                <h3 className="text-app-gray-800 mb-3">✍️ 당신의 요약</h3>
                <div className="bg-app-gray-50 border-2 border-app-blue rounded-xl p-5">
                  <ol className="space-y-3 list-decimal list-inside text-app-gray-800">
                    <li>{summary1}</li>
                    <li>{summary2}</li>
                    <li>{summary3}</li>
                  </ol>
                </div>
              </div>
              <div>
                <h3 className="text-app-gray-800 mb-3">🤖 AI 요약</h3>
                <div className="bg-app-gray-50 border-2 border-app-green rounded-xl p-5">
                  <ol className="space-y-3 list-decimal list-inside text-app-gray-800">
                    <li>
                      AI는 많은 직업을 대체하지만 동시에 새로운 기회를 창출한다
                    </li>
                    <li>
                      AI와 경쟁하는 것이 아니라 AI를 도구로 활용하는 능력이
                      중요하다
                    </li>
                    <li>
                      평생 학습과 창의성, 공감 능력 같은 인간 고유의 능력 개발이
                      필요하다
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Feedback Cards */}
            <div className="space-y-6 mb-12">
              {/* Strengths */}
              <div className="bg-app-green-light border-l-4 border-app-green rounded-lg p-6">
                <h3 className="text-green-900 mb-3">✅ 잘 파악한 것</h3>
                <ul className="space-y-2">
                  <li className="text-green-800 flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>핵심 논지를 정확히 이해했습니다</span>
                  </li>
                  <li className="text-green-800 flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>주요 예시를 모두 포함했습니다</span>
                  </li>
                  <li className="text-green-800 flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>논리적 흐름이 명확합니다</span>
                  </li>
                </ul>
              </div>

              {/* Missed Points */}
              <div className="bg-app-orange-light border-l-4 border-app-orange rounded-lg p-6">
                <h3 className="text-yellow-900 mb-3">⚠️ 놓친 포인트</h3>
                <ul className="space-y-2">
                  <li className="text-yellow-800 flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>저자의 반론 부분이 누락되었습니다</span>
                  </li>
                  <li className="text-yellow-800 flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>구체적인 수치나 통계 언급이 없습니다</span>
                  </li>
                </ul>
              </div>

              {/* Suggestions */}
              <div className="bg-app-blue-light border-l-4 border-app-blue rounded-lg p-6">
                <h3 className="text-blue-900 mb-3">💡 개선 제안</h3>
                <ul className="space-y-2">
                  <li className="text-blue-800 flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>반대 의견도 포함하면 더 균형잡힌 요약이 됩니다</span>
                  </li>
                  <li className="text-blue-800 flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>결론 부분을 더 명확히 표현하세요</span>
                  </li>
                  <li className="text-blue-800 flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>핵심 키워드를 활용하면 더 좋습니다</span>
                  </li>
                </ul>
              </div>
            </div>

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
                onClick={onBack}
                className="flex-1 h-12 bg-app-blue hover:bg-app-blue-dark text-white rounded-lg"
              >
                다음 글 읽기 →
              </Button>
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1 h-12 border-app-gray-200 text-app-gray-500 hover:bg-app-gray-50 rounded-lg"
              >
                📊 히스토리 보기
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
