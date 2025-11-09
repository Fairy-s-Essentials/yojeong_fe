import { useState } from 'react';
import {
  Button,
  Header,
  SearchBar,
  SelectBox,
  StatisticCard,
  SummaryItem,
  Toggle,
  Pagination,
  LineChart,
  Heatmap,
} from '@/components';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { HistorySummary } from '@/types/main.type';

export const HistoryPage = () => {
  const navigate = useNavigate();

  const handleWriteButton = () => {
    navigate('/input');
  };

  const handleAnalysisButton = (id: number) => {
    navigate(`/analysis/${id}`);
  };

  const [dateRange, setDateRange] = useState<string | number>(7);
  const [inputValue, setInputValue] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [, setSortOrder] = useState<string>('latest');
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  const mockChartData = [
    { date: '10/22', accuracy: 65 },
    { date: '10/23', accuracy: 72 },
    { date: '10/24', accuracy: 68 },
    { date: '10/25', accuracy: 78 },
    { date: '10/26', accuracy: 82 },
    { date: '10/27', accuracy: 75 },
    { date: '10/28', accuracy: 85 },
    { date: '10/29', accuracy: 79 },
    { date: '10/30', accuracy: 88 },
    { date: '10/31', accuracy: 83 },
    { date: '11/01', accuracy: 90 },
    { date: '11/02', accuracy: 86 },
    { date: '11/03', accuracy: 92 },
    { date: '11/04', accuracy: 89 },
  ];

  const mockHistorySummary: HistorySummary[] = [
    { id: 1, similarityScore: 85, userSummary: '오늘은 좋은 하루였다', createdAt: '2025-10-22' },
    { id: 2, similarityScore: 75, userSummary: '오늘은 나쁜 하루였다', createdAt: '2025-10-23' },
    { id: 3, similarityScore: 65, userSummary: '오늘은 보통 하루였다', createdAt: '2025-10-24' },
  ];

  const staticMockHeatmapData = {
    years: [2023, 2024, 2025],
    yearlyLearningData: {
      year: 2024,
      learningDays: [
        { date: '2024-01-05', count: 2, averageScore: 85 },
        { date: '2024-01-08', count: 1, averageScore: 92 },
        { date: '2024-01-12', count: 3, averageScore: 78 },
        { date: '2024-01-15', count: 4, averageScore: 95 },
        { date: '2024-01-19', count: 2, averageScore: 88 },
        { date: '2024-01-22', count: 1, averageScore: 91 },
        { date: '2024-01-26', count: 5, averageScore: 87 },
        { date: '2024-01-29', count: 3, averageScore: 94 },
        { date: '2024-02-02', count: 2, averageScore: 82 },
        { date: '2024-02-05', count: 4, averageScore: 89 },
        { date: '2024-02-09', count: 1, averageScore: 96 },
        { date: '2024-02-12', count: 3, averageScore: 84 },
        { date: '2024-02-16', count: 2, averageScore: 90 },
        { date: '2024-02-19', count: 5, averageScore: 93 },
        { date: '2024-02-23', count: 1, averageScore: 86 },
        { date: '2024-02-26', count: 4, averageScore: 91 },
        { date: '2024-03-01', count: 2, averageScore: 88 },
        { date: '2024-03-04', count: 3, averageScore: 95 },
        { date: '2024-03-08', count: 1, averageScore: 87 },
        { date: '2024-03-11', count: 2, averageScore: 92 },
        { date: '2024-03-15', count: 4, averageScore: 89 },
        { date: '2024-03-18', count: 3, averageScore: 94 },
        { date: '2024-03-22', count: 1, averageScore: 85 },
        { date: '2024-03-25', count: 5, averageScore: 90 },
        { date: '2024-03-29', count: 2, averageScore: 93 },
        { date: '2024-04-01', count: 3, averageScore: 88 },
        { date: '2024-04-05', count: 4, averageScore: 91 },
        { date: '2024-04-08', count: 1, averageScore: 86 },
        { date: '2024-04-12', count: 2, averageScore: 95 },
        { date: '2024-04-15', count: 5, averageScore: 87 },
        { date: '2024-04-19', count: 3, averageScore: 92 },
        { date: '2024-04-22', count: 2, averageScore: 89 },
        { date: '2024-04-26', count: 4, averageScore: 94 },
        { date: '2024-04-29', count: 1, averageScore: 90 },
        { date: '2024-05-03', count: 3, averageScore: 85 },
        { date: '2024-05-06', count: 2, averageScore: 93 },
        { date: '2024-05-10', count: 5, averageScore: 88 },
        { date: '2024-05-13', count: 4, averageScore: 91 },
        { date: '2024-05-17', count: 1, averageScore: 86 },
        { date: '2024-05-20', count: 3, averageScore: 95 },
        { date: '2024-05-24', count: 2, averageScore: 87 },
        { date: '2024-05-27', count: 4, averageScore: 92 },
        { date: '2024-05-31', count: 1, averageScore: 89 },
      ],
    },
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handleSortOrder = (order: string) => {
    setSortOrder(order);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const dateOptions = [
    { value: 7, label: '최근 7일' },
    { value: 30, label: '최근 30일' },
    { value: 'all', label: '전체 기간' },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      <main className="flex flex-col items-center max-w-6xl mx-auto px-6 py-10">
        {/* 드롭 다운 영역 */}
        <div className="w-full flex justify-end mb-6">
          <SelectBox value={dateRange} onChange={setDateRange} options={dateOptions} />
        </div>

        {/* 학습 통계 영역 */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <StatisticCard type="weekCount" size="lg" value="0개" />
          <StatisticCard type="accuracy" size="lg" value="0%" />
          <StatisticCard type="streak" size="lg" value="12일" />
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-app-gray-200 mb-12 w-full">
          <h2 className="text-app-gray-800 mb-6">정확도 추이</h2>
          <div className="h-80">
            <LineChart data={mockChartData} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-app-gray-200 mb-12 w-full">
          <h2 className="text-app-gray-800 mb-6">학습 일정</h2>
          <Heatmap
            years={staticMockHeatmapData.years}
            yearlyLearningData={staticMockHeatmapData.yearlyLearningData}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />
        </div>
        {/* 학습 기록 영역 */}
        <div className="mb-6 w-full flex flex-col gap-6">
          <div className="w-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-app-gray-800">학습 기록</h2>

              <Toggle
                leftLabel="최신순"
                rightLabel="오래된순"
                onLeftClick={() => handleSortOrder('latest')}
                onRightClick={() => handleSortOrder('oldest')}
              />
            </div>

            <SearchBar
              placeholder="제목이나 배운점으로 검색..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <div className="space-y-4 mb-8">
            {mockHistorySummary && mockHistorySummary.length > 0 ? (
              <div className="space-y-4">
                {mockHistorySummary.map((summary) => (
                  <SummaryItem key={summary.id} summary={summary} onClick={() => handleAnalysisButton(summary.id)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-app-gray-50 rounded-xl border border-dashed border-app-gray-200">
                <BookOpen className="w-12 h-12 text-app-gray-400 mx-auto mb-4" />
                <p className="text-app-gray-500 mb-4">아직 읽은 글이 없습니다</p>
                <Button
                  onClick={handleWriteButton}
                  variant="outline"
                  className="border-app-blue text-app-blue hover:bg-app-blue-light cursor-pointer"
                >
                  첫 글 시작하기
                </Button>
              </div>
            )}
            <Pagination currentPage={currentPage} totalPages={10} onPageChange={handlePageChange} />
          </div>
        </div>
      </main>
    </div>
  );
};
