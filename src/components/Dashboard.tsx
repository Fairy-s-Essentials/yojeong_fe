import { useState } from "react";
import {
  BookOpen,
  Target,
  Flame,
  TrendingUp,
  Bell,
  User,
  Plus,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import type { Article } from "../types/article";

type DashboardProps = {
  articles: Article[];
  onStartReading: (url: string) => void;
  onViewHistory: () => void;
};

export default function Dashboard({
  articles,
  onStartReading,
  onViewHistory,
}: DashboardProps) {
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [url, setUrl] = useState("");

  const completedArticles = articles.filter((a) => a.completedAt);
  const thisWeekArticles = completedArticles.filter((a) => {
    const articleDate = new Date(a.completedAt!);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return articleDate >= weekAgo;
  });

  const avgAccuracy =
    completedArticles.length > 0
      ? Math.round(
          completedArticles.reduce((sum, a) => sum + (a.accuracy || 0), 0) /
            completedArticles.length
        )
      : 0;

  const streak = 5; // Mock streak data

  const handleSubmitUrl = () => {
    if (url.trim()) {
      onStartReading(url);
      setUrl("");
      setShowUrlModal(false);
    }
  };

  const getAccuracyColor = (accuracy?: number) => {
    if (!accuracy) return "bg-app-gray-200";
    if (accuracy >= 80) return "bg-linear-to-br from-green-400 to-green-600";
    if (accuracy >= 60) return "bg-linear-to-br from-blue-400 to-blue-600";
    return "bg-linear-to-br from-orange-400 to-orange-600";
  };

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <nav className="h-16 border-b border-app-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-app-blue" />
            <span className="text-app-gray-800">ReadFirst</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-app-gray-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-app-gray-500" />
            </button>
            <button className="p-1 hover:bg-app-gray-50 rounded-full transition-colors">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-app-blue to-app-purple flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-app-gray-800 mb-3">오늘의 글 읽기</h1>
          <p className="text-app-gray-500 mb-8">
            AI보다 먼저 읽고, 더 깊게 이해하세요
          </p>
          <Button
            onClick={() => setShowUrlModal(true)}
            className="h-12 px-8 bg-app-blue hover:bg-app-blue-dark text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <BookOpen className="w-5 h-5 mr-2" />새 글 읽기
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-app-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-app-blue-light rounded-lg">
                <TrendingUp className="w-6 h-6 text-app-blue" />
              </div>
            </div>
            <div className="text-app-blue">{thisWeekArticles.length}개</div>
            <p className="text-app-gray-500 text-sm">이번 주 읽은 글</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-app-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-app-green-light rounded-lg">
                <Target className="w-6 h-6 text-app-green" />
              </div>
            </div>
            <div className="text-app-green">{avgAccuracy}%</div>
            <p className="text-app-gray-500 text-sm">평균 정확도</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-app-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-app-orange-light rounded-lg">
                <Flame className="w-6 h-6 text-app-orange" />
              </div>
            </div>
            <div className="text-app-orange">{streak}일</div>
            <p className="text-app-gray-500 text-sm">연속 학습 Streak</p>
          </div>
        </div>

        {/* Recent History */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-app-gray-800">최근 기록</h2>
            <Button
              variant="ghost"
              onClick={onViewHistory}
              className="text-app-blue hover:text-app-blue-dark"
            >
              전체 보기 →
            </Button>
          </div>

          {completedArticles.length === 0 ? (
            <div className="text-center py-16 bg-app-gray-50 rounded-xl border border-dashed border-app-gray-200">
              <BookOpen className="w-12 h-12 text-app-gray-400 mx-auto mb-4" />
              <p className="text-app-gray-500 mb-4">아직 읽은 글이 없습니다</p>
              <Button
                onClick={() => setShowUrlModal(true)}
                variant="outline"
                className="border-app-blue text-app-blue hover:bg-app-blue-light"
              >
                첫 글 시작하기
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {completedArticles.slice(0, 5).map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-xl p-5 border border-app-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-app-gray-800 mb-1">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-app-gray-500">
                        <span>
                          {new Date(article.completedAt!).toLocaleDateString(
                            "ko-KR"
                          )}
                        </span>
                        <span>•</span>
                        <span>{Math.floor(article.readingTime / 60)}분</span>
                      </div>
                    </div>
                    <div
                      className={`w-14 h-14 rounded-full ${getAccuracyColor(
                        article.accuracy
                      )} flex items-center justify-center shadow-sm`}
                    >
                      <span className="text-white">{article.accuracy}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowUrlModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-app-blue hover:bg-app-blue-dark text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* URL Input Modal */}
      <Dialog open={showUrlModal} onOpenChange={setShowUrlModal}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>글 링크 입력</DialogTitle>
            <DialogDescription>
              읽고 싶은 글의 URL을 입력하세요
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label
                htmlFor="url"
                className="text-app-gray-500 text-sm mb-2 block"
              >
                링크
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitUrl()}
                className="h-12 border-app-gray-200 rounded-lg focus:ring-2 focus:ring-app-blue focus:border-app-blue"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowUrlModal(false)}
                className="flex-1 h-11 border-app-gray-200 text-app-gray-500 hover:bg-app-gray-50"
              >
                취소
              </Button>
              <Button
                onClick={handleSubmitUrl}
                disabled={!url.trim()}
                className="flex-1 h-11 bg-app-blue hover:bg-app-blue-dark text-white"
              >
                글 읽기 →
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
