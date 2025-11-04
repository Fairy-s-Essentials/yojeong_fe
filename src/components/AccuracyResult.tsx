import { TrendingUp, TrendingDown } from 'lucide-react';

const AccuracyResult = ({ score, average }: { score: number; average: number }) => {
  const diff = Math.abs(score - average);
  const state = score === average ? 'equal' : score > average ? 'higher' : 'lower';

  const config = {
    higher: {
      icon: <TrendingUp />,
      color: 'from-app-blue to-app-purple',
      message: `평균보다 ${diff}점 높습니다! 🎉`,
    },
    equal: {
      icon: null,
      color: 'from-app-blue to-app-purple',
      message: '평균과 동일한 점수예요! 🙂',
    },
    lower: {
      icon: <TrendingDown />,
      color: 'from-app-orange to-app-green',
      message: `평균보다 ${diff}점 낮습니다! 😅`,
    },
  };

  const { icon, color, message } = config[state];

  return (
    <div className={`bg-linear-to-r ${color} rounded-2xl p-8 mb-12 text-white relative overflow-hidden`}>
      <div className="relative z-10">
        <p className="text-sm opacity-80 mb-2">정확도 점수</p>
        <div className="flex items-baseline gap-2">
          <span className="text-7xl">{score}</span>
          <span className="text-3xl opacity-80">/100</span>
        </div>
        <div className="flex items-center gap-2 mt-4 opacity-90">
          {icon}
          <p>{message}</p>
        </div>
      </div>
      <div className="absolute top-6 right-6 text-5xl">🎯</div>
    </div>
  );
};

export default AccuracyResult;
