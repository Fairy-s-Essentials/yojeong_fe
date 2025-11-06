import { useState } from 'react';
import { Header, SearchBar, SelectBox, StatisticCard } from '@/components';

export const HistoryPage = () => {
  const [dateRange, setDateRange] = useState<string | number>(7);
  const [inputValue, setInputValue] = useState<string>('');

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
        <div className="w-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-app-gray-800">학습 기록</h2>

            {/* 토글 컴포넌트 추가 */}
          </div>

          <SearchBar
            placeholder="제목이나 배운점으로 검색..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
      </main>
    </div>
  );
};
