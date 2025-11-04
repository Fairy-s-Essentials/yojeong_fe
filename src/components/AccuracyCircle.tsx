import { ACCURACY_SCORE } from '@/constants';

const AccuracyCircle = ({ score }: { score: number }) => {
  const getAccuracyColor = (accuracy?: number) => {
    if (!accuracy) return 'bg-app-gray-200';
    if (accuracy >= ACCURACY_SCORE.HIGH) return 'bg-gradient-to-br from-green-400 to-green-600';
    if (accuracy >= ACCURACY_SCORE.LOW) return 'bg-gradient-to-br from-blue-400 to-blue-600';

    return 'bg-gradient-to-br from-orange-400 to-orange-600';
  };

  return (
    <div className={`w-14 h-14 rounded-full ${getAccuracyColor(score)} flex items-center justify-center shadow-sm`}>
      <span className="text-white">{score}%</span>
    </div>
  );
};

export default AccuracyCircle;
