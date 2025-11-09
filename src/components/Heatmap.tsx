interface HeatmapProps {
  years: number[];
  yearlyLearningData: {
    year: number;
    learningDays: { date: string; count: number; averageScore: number }[];
  };
  selectedYear: number;
  onYearChange: (year: number) => void;
}

const Heatmap = ({ years, yearlyLearningData, selectedYear, onYearChange }: HeatmapProps) => {
  // selectedYear가 yearlyLearningData의 year와 일치하는지 확인
  const isDataAvailable = yearlyLearningData.year === selectedYear;
  const learningDays = isDataAvailable ? yearlyLearningData.learningDays : [];

  // 선택된 연도의 365일 데이터 생성
  const heatmapData = Array.from({ length: 365 }, (_, dayIndex) => {
    const date = new Date(selectedYear, 0, 1); // selectedYear 사용
    date.setDate(date.getDate() + dayIndex);
    const dateString = date.toISOString().split('T')[0];

    const dayData = learningDays.find((day) => day.date === dateString);
    if (!dayData) return { level: 0, count: 0, averageScore: 0 };

    // count를 level로 변환 (0-4)
    let level = 0;
    if (dayData.count === 1) level = 1;
    else if (dayData.count === 2) level = 2;
    else if (dayData.count === 3) level = 3;
    else if (dayData.count >= 4) level = 4;

    return { level, count: dayData.count, averageScore: dayData.averageScore };
  });

  const getHeatmapColor = (level: number) => {
    if (level === 0) return 'bg-app-gray-200';
    if (level === 1) return 'bg-green-200';
    if (level === 2) return 'bg-green-400';
    if (level === 3) return 'bg-green-600';
    return 'bg-green-800';
  };

  const handleYearChange = (year: number) => {
    onYearChange(year);
  };

  return (
    <div className="flex gap-6">
      {/* Left side: Heatmap */}
      <div className="flex-1">
        <div className="overflow-x-auto">
          <div className="inline-flex gap-1">
            {Array.from({ length: 53 }, (_, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {Array.from({ length: 7 }, (_, dayIdx) => {
                  const idx = weekIdx * 7 + dayIdx;
                  if (idx >= 365) return null;
                  const dayData = heatmapData[idx];
                  const date = new Date(selectedYear, 0, 1);
                  date.setDate(date.getDate() + idx);

                  const tooltipText =
                    dayData.count && dayData.count > 0
                      ? `${date.toLocaleDateString('ko-KR')}\n학습 횟수: ${dayData.count}개\n평균 점수: ${dayData.averageScore}%`
                      : `${date.toLocaleDateString('ko-KR')}\n학습 기록 없음`;

                  return (
                    <div
                      key={dayIdx}
                      className={`w-3 h-3 rounded-sm ${getHeatmapColor(dayData.level)} cursor-pointer hover:ring-2 hover:ring-app-blue transition-all`}
                      title={tooltipText}
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
              <div key={level} className={`w-3 h-3 rounded-sm ${getHeatmapColor(level)}`} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Right side: Year buttons */}
      <div className="flex flex-col gap-2">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => handleYearChange(year)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors whitespace-nowrap ${
              year === selectedYear
                ? 'bg-app-blue text-white'
                : 'bg-app-gray-50 text-app-gray-500 hover:bg-app-gray-200'
            }`}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Heatmap;
