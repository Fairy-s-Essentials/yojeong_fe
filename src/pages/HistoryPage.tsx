import { useState } from 'react';
import { Header, SelectBox, StatisticCard } from '@/components';

export const HistoryPage = () => {
  const [dateRange, setDateRange] = useState<string | number>(7);

  const dateOptions = [
    { value: 7, label: '최근 7일' },
    { value: 30, label: '최근 30일' },
    { value: 'all', label: '전체 기간' },
  ];

  return (
    <div>
      <Header />

      <main className="flex flex-col items-center max-w-6xl mx-auto px-6 py-10">
        <div className="w-full flex justify-end mb-6">
          <SelectBox value={dateRange} onChange={setDateRange} options={dateOptions} />
        </div>
        {/* 학습 통계 영역 */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <StatisticCard type="weekCount" size="lg" value="0개" />
          <StatisticCard type="accuracy" size="lg" value="0%" />
          <StatisticCard type="streak" size="lg" value="12일" />
        </div>
      </main>
    </div>
  );
};
