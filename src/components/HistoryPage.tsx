import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Target,
  Clock,
  Flame,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { Button } from "./ui/buttons/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/forms/select";
import { Input } from "./ui/forms/input";
import type { Article } from "../types/article";

type HistoryPageProps = {
  articles: Article[];
  onBack: () => void;
  onViewResult: (article: Article) => void;
};

export default function HistoryPage({
  articles,
  onBack,
  onViewResult,
}: HistoryPageProps) {
  const [dateRange, setDateRange] = useState("7days");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const completedArticles = articles.filter((a) => a.completedAt);

  // Filter articles by date range
  const dateFilteredArticles = completedArticles.filter((article) => {
    if (dateRange === "7days") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(article.completedAt!) >= weekAgo;
    }
    if (dateRange === "30days") {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      return new Date(article.completedAt!) >= monthAgo;
    }
    return true; // 'all'
  });

  const stats = {
    total: dateFilteredArticles.length,
    avgAccuracy:
      dateFilteredArticles.length > 0
        ? Math.round(
            dateFilteredArticles.reduce(
              (sum, a) => sum + (a.accuracy || 0),
              0
            ) / dateFilteredArticles.length
          )
        : 0,
    totalTime: dateFilteredArticles.reduce((sum, a) => sum + a.readingTime, 0),
    streak: 12,
  };

  // Filter and sort articles for learning records
  let filteredArticles = completedArticles.filter((article) => {
    if (!searchQuery) return true;
    return (
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.learnings?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Sort articles
  filteredArticles = [...filteredArticles].sort((a, b) => {
    const dateA = new Date(a.completedAt!).getTime();
    const dateB = new Date(b.completedAt!).getTime();
    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
  });

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredArticles.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getAccuracyColor = (accuracy?: number) => {
    if (!accuracy) return "from-gray-400 to-gray-600";
    if (accuracy >= 80) return "from-green-400 to-green-600";
    if (accuracy >= 60) return "from-blue-400 to-blue-600";
    return "from-orange-400 to-orange-600";
  };

  // Mock chart data
  const chartData = [65, 72, 68, 78, 82, 75, 78];
  const maxValue = Math.max(...chartData);

  // Get available years from articles
  const availableYears = Array.from(
    new Set(
      completedArticles
        .filter((a) => a.completedAt)
        .map((a) => new Date(a.completedAt!).getFullYear())
    )
  ).sort((a, b) => b - a);

  // Add current year if not in the list
  if (!availableYears.includes(new Date().getFullYear())) {
    availableYears.unshift(new Date().getFullYear());
  }

  // Generate heatmap data for selected year (365 days)
  const heatmapData = Array.from({ length: 365 }, (_, dayIndex) => {
    const date = new Date(selectedYear, 0, 1);
    date.setDate(date.getDate() + dayIndex);

    // Count articles for this day
    const count = completedArticles.filter((article) => {
      const articleDate = new Date(article.completedAt!);
      return articleDate.toDateString() === date.toDateString();
    }).length;

    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    return 4;
  });

  const getHeatmapColor = (level: number) => {
    if (level === 0) return "bg-app-gray-200";
    if (level === 1) return "bg-green-200";
    if (level === 2) return "bg-green-400";
    if (level === 3) return "bg-green-600";
    return "bg-green-800";
  };

  return (
    <div className="min-h-screen bg-white">
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
            <h1 className="text-app-gray-800">📊 학습 히스토리</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Date Range Filter */}
        <div className="flex justify-end mb-6">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-app-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-app-blue-light rounded-lg">
                <BookOpen className="w-8 h-8 text-app-blue" />
              </div>
              <div className="text-xs text-app-green flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+5%</span>
              </div>
            </div>
            <div className="text-app-blue text-4xl mb-1">{stats.total}개</div>
            <p className="text-sm text-app-gray-500">읽은 글</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-app-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-app-green-light rounded-lg">
                <Target className="w-8 h-8 text-app-green" />
              </div>
              <div className="text-xs text-app-green flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+5%</span>
              </div>
            </div>
            <div className="text-app-green text-4xl mb-1">
              {stats.avgAccuracy}%
            </div>
            <p className="text-sm text-app-gray-500">평균 정확도</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-app-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-app-orange-light rounded-lg">
                <Clock className="w-8 h-8 text-app-orange" />
              </div>
            </div>
            <div className="text-app-orange text-4xl mb-1">
              {Math.floor(stats.totalTime / 3600)}시간
            </div>
            <p className="text-sm text-app-gray-500">총 읽기 시간</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-app-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-app-red-light rounded-lg">
                <Flame className="w-8 h-8 text-app-red" />
              </div>
            </div>
            <div className="text-app-red text-4xl mb-1">{stats.streak}일</div>
            <p className="text-sm text-app-gray-500">연속 학습</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-app-gray-200 mb-12">
          <h2 className="text-app-gray-800 mb-8">정확도 추이</h2>

          {/* Simple Line Chart */}
          <div className="h-64 flex items-end justify-between gap-4">
            {chartData.map((value, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full bg-gradient-to-t from-app-blue to-blue-400 rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative group"
                  style={{
                    height: `${(value / maxValue) * 100}%`,
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-app-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {value}%
                  </div>
                </div>
                <span className="text-xs text-app-gray-500">10/{6 + idx}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Streak Heatmap */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-app-gray-200 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-app-gray-800">🔥 학습 일정</h2>
            <div className="flex gap-2">
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                    year === selectedYear
                      ? "bg-app-blue text-white"
                      : "bg-app-gray-50 text-app-gray-500 hover:bg-app-gray-200"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="inline-flex gap-1">
              {Array.from({ length: 53 }, (_, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }, (_, dayIdx) => {
                    const idx = weekIdx * 7 + dayIdx;
                    if (idx >= 365) return null;
                    const level = heatmapData[idx] || 0;
                    const date = new Date(selectedYear, 0, 1);
                    date.setDate(date.getDate() + idx);
                    return (
                      <div
                        key={dayIdx}
                        className={`w-3 h-3 rounded-sm ${getHeatmapColor(
                          level
                        )} cursor-pointer hover:ring-2 hover:ring-app-blue transition-all`}
                        title={`${date.toLocaleDateString(
                          "ko-KR"
                        )}: ${level} articles`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-app-gray-500">{selectedYear}년</span>
            <div className="flex items-center gap-2 text-xs text-app-gray-500">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getHeatmapColor(level)}`}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Recent History List */}
        <div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-app-gray-800">학습 기록</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortOrder("latest")}
                  className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                    sortOrder === "latest"
                      ? "bg-app-blue text-white"
                      : "bg-app-gray-50 text-app-gray-500 hover:bg-app-gray-200"
                  }`}
                >
                  최신순
                </button>
                <button
                  onClick={() => setSortOrder("oldest")}
                  className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                    sortOrder === "oldest"
                      ? "bg-app-blue text-white"
                      : "bg-app-gray-50 text-app-gray-500 hover:bg-app-gray-200"
                  }`}
                >
                  오래된순
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-app-gray-400" />
              <Input
                type="text"
                placeholder="제목이나 배운점으로 검색..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {paginatedArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white border border-app-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-6">
                    <h3 className="text-app-gray-800 mb-2">{article.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-app-gray-500 mb-3">
                      <span>
                        {new Date(article.completedAt!).toLocaleDateString(
                          "ko-KR"
                        )}
                      </span>
                      {article.learnings && (
                        <>
                          <span>•</span>
                          <span className="overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                            💡 {article.learnings}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-app-blue-light text-app-blue text-xs rounded">
                        tech
                      </span>
                      <span className="px-2 py-1 bg-green-50 text-app-green text-xs rounded">
                        productivity
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${getAccuracyColor(
                        article.accuracy
                      )} flex items-center justify-center shadow-md`}
                    >
                      <span className="text-white">{article.accuracy}%</span>
                    </div>
                    <button
                      onClick={() => onViewResult(article)}
                      className="text-sm text-app-blue hover:underline"
                    >
                      보기 →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                  page === currentPage
                    ? "bg-app-blue text-white"
                    : "bg-white border border-app-gray-200 text-app-gray-500 hover:bg-app-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
