import { useState } from 'react';
import { Button, Header, SearchBar, SelectBox, StatisticCard, SummaryItem } from '@/components';
import Toggle from '@/components/Toggle';
import Pagination from '@/components/Pagination';
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

  const mockHistorySummary: HistorySummary[] = [
    { id: 1, similarityScore: 85, userSummary: '오늘은 좋은 하루였다', createdAt: '2025-10-22' },
    { id: 2, similarityScore: 75, userSummary: '오늘은 나쁜 하루였다', createdAt: '2025-10-23' },
    { id: 3, similarityScore: 65, userSummary: '오늘은 보통 하루였다', createdAt: '2025-10-24' },
  ];

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
            <Pagination
              currentPage={currentPage}
              totalPages={10}
              onPageChange={(page: number) => handlePageChange(page)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
