import { useEffect, useState } from 'react';
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
import {
  useAccuracyTrendQuery,
  useCalendarDataQuery,
  useCalendarYearsQuery,
  useHistoryAnalysisQuery,
  useSummariesQuery,
} from '@/services/hooks/history';
import type { HistoryPeriod } from '@/types/history.type';
import { useDebounce } from '@/hooks';

export const HistoryPage = () => {
  const navigate = useNavigate();

  const handleWriteButton = () => {
    navigate('/input');
  };

  const handleAnalysisButton = (id: number) => {
    navigate(`/analysis/${id}`);
  };

  const [period, setPeriod] = useState<HistoryPeriod>(7);
  const [inputValue, setInputValue] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLatest, setIsLatest] = useState<boolean>(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const debouncedSearch = useDebounce(inputValue, 500);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const { data: historyAnalysis } = useHistoryAnalysisQuery(period);
  const { data: accuracyTrend } = useAccuracyTrendQuery(period);
  const { data: calendarYears } = useCalendarYearsQuery();
  const { data: calendarData } = useCalendarDataQuery(selectedYear);
  const { data: summariesData } = useSummariesQuery({
    page: currentPage,
    limit: 5,
    isLatest,
    search: debouncedSearch || undefined,
  });

  const handlePeriodChange = (value: HistoryPeriod) => {
    setPeriod(value);
  };

  const chartData = accuracyTrend?.dataPoints.map((data) => ({ date: data.date, accuracy: data.averageScore })) || [];

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handleSortOrder = (order: 'latest' | 'oldest') => {
    setIsLatest(order === 'latest');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const dateOptions: { value: HistoryPeriod; label: string }[] = [
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
          <SelectBox value={period} onChange={handlePeriodChange} options={dateOptions} />
        </div>

        {/* 학습 통계 영역 */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <StatisticCard type="weekCount" size="lg" value={`${historyAnalysis?.summaryCount ?? 0}개`} />
          <StatisticCard type="accuracy" size="lg" value={`${historyAnalysis?.averageScore ?? 0}%`} />
          <StatisticCard type="streak" size="lg" value={`${historyAnalysis?.consecutiveDays ?? 0}일`} />
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-app-gray-200 mb-12 w-full">
          <h2 className="text-app-gray-800 mb-6">정확도 추이</h2>
          <div className="h-80">
            <LineChart data={chartData} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-app-gray-200 mb-12 w-full">
          <h2 className="text-app-gray-800 mb-6">학습 일정</h2>
          <Heatmap
            years={calendarYears?.years || []}
            yearlyLearningData={calendarData || { year: selectedYear, learningDays: [] }}
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
              placeholder="원문 혹은 작성한 요약으로 검색"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <div className="space-y-4 mb-8">
            {summariesData && summariesData.items.length > 0 ? (
              <div className="space-y-4">
                {summariesData.items.map((summary) => (
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
            <Pagination
              currentPage={currentPage}
              totalPages={summariesData?.pagination.totalPages || 1}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
