import { useEffect, useState } from 'react';
import {
  Button,
  SearchBar,
  SelectBox,
  StatisticCard,
  SummaryItem,
  Toggle,
  Pagination,
  LineChart,
  Heatmap,
} from '@/components';
import { AsyncBoundary } from '@/components/boundaries';
import { SkeletonHistoryPage } from '@/components/skeletons';
import { ErrorFallback } from '@/components/errors';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useDebounce } from '@/hooks';
import { useHistoryStatsData, useCalendarData, useSummaryListData } from '@/hooks/history';
import type { HistoryPeriod } from '@/types/history.type';

export const HistoryPage = () => {
  const [period, setPeriod] = useState<HistoryPeriod>(7);
  const [inputValue, setInputValue] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLatest, setIsLatest] = useState<boolean>(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const debouncedSearch = useDebounce(inputValue, 300);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const dateOptions: { value: HistoryPeriod; label: string }[] = [
    { value: 7, label: '최근 7일' },
    { value: 30, label: '최근 30일' },
    { value: 'all', label: '전체 기간' },
  ];

  return (
    <div className="flex flex-col items-center max-w-6xl mx-auto px-6 py-10">
      {/* 드롭다운 영역 */}
      <div className="w-full flex justify-end mb-6">
        <SelectBox value={period} onChange={setPeriod} options={dateOptions} />
      </div>

      {/* 전체 컨텐츠를 하나의 AsyncBoundary로 감싸서 워터폴 방지 */}
      <AsyncBoundary
        loadingFallback={<SkeletonHistoryPage />}
        errorFallback={ErrorFallback}
        resetKeys={[period, selectedYear, currentPage, isLatest, debouncedSearch]}
      >
        <HistoryContent
          period={period}
          selectedYear={selectedYear}
          currentPage={currentPage}
          isLatest={isLatest}
          debouncedSearch={debouncedSearch}
          onYearChange={setSelectedYear}
          onPageChange={setCurrentPage}
          onSortChange={setIsLatest}
          onInputChange={setInputValue}
          inputValue={inputValue}
        />
      </AsyncBoundary>
    </div>
  );
};

/**
 * 데이터를 사용하는 컨텐츠 영역
 * - 모든 쿼리가 병렬로 실행됨 (워터폴 방지)
 * - Suspense에 의해 data는 항상 정의됨
 */
interface HistoryContentProps {
  period: HistoryPeriod;
  selectedYear: number;
  currentPage: number;
  isLatest: boolean;
  debouncedSearch: string;
  onYearChange: (year: number) => void;
  onPageChange: (page: number) => void;
  onSortChange: (isLatest: boolean) => void;
  onInputChange: (value: string) => void;
  inputValue: string;
}

const HistoryContent = ({
  period,
  selectedYear,
  currentPage,
  isLatest,
  debouncedSearch,
  onYearChange,
  onPageChange,
  onSortChange,
  onInputChange,
  inputValue,
}: HistoryContentProps) => {
  const navigate = useNavigate();

  // Application Layer Hooks - 모든 쿼리가 병렬로 실행됨
  const { stats, chartData, trendAnalysis } = useHistoryStatsData(period);
  const { years, learningDays } = useCalendarData(selectedYear);
  const { items, pagination, isEmpty } = useSummaryListData({
    page: currentPage,
    limit: 5,
    isLatest,
    search: debouncedSearch || undefined,
  });

  const handleSortOrder = (order: 'latest' | 'oldest') => {
    onSortChange(order === 'latest');
    onPageChange(1);
  };

  return (
    <>
      {/* 학습 통계 영역 */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <StatisticCard type="weekCount" size="lg" value={`${stats.summaryCount}개`} />
        <StatisticCard type="accuracy" size="lg" value={`${stats.averageScore}%`} />
        <StatisticCard type="streak" size="lg" value={`${stats.consecutiveDays}일`} />
      </div>

      {/* 정확도 추이 */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-app-gray-200 mb-12 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-app-gray-800">정확도 추이</h2>
          <span className="text-sm text-app-gray-600">평균: {trendAnalysis.average.toFixed(1)}%</span>
        </div>
        <div className="h-80">
          <LineChart chartData={chartData} />
        </div>
      </div>

      {/* 학습 일정 */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-app-gray-200 mb-12 w-full overflow-hidden">
        <h2 className="text-app-gray-800 mb-6">학습 일정</h2>
        <Heatmap
          years={years}
          yearlyLearningData={{ year: selectedYear, learningDays }}
          selectedYear={selectedYear}
          onYearChange={onYearChange}
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
            onChange={(e) => onInputChange(e.target.value)}
          />
        </div>

        <div className="space-y-4 mb-8">
          {isEmpty ? (
            <div className="text-center py-16 bg-app-gray-50 rounded-xl border border-dashed border-app-gray-200">
              <BookOpen className="w-12 h-12 text-app-gray-400 mx-auto mb-4" />
              <p className="text-app-gray-500 mb-4">
                {debouncedSearch ? '검색 결과가 없습니다' : '아직 읽은 글이 없습니다'}
              </p>
              {!debouncedSearch && (
                <Button
                  onClick={() => navigate('/input')}
                  variant="outline"
                  className="border-app-blue text-app-blue hover:bg-app-blue-light cursor-pointer"
                >
                  첫 글 시작하기
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((summary) => (
                <SummaryItem key={summary.id} summary={summary} onClick={() => navigate(`/analysis/${summary.id}`)} />
              ))}
            </div>
          )}

          <Pagination currentPage={currentPage} totalPages={pagination.totalPages} onPageChange={onPageChange} />
        </div>
      </div>
    </>
  );
};
