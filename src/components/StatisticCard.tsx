import { type ElementType, type SVGProps } from 'react';
import { TrendingUp, Target, Flame } from 'lucide-react';

interface StatisticCardProps {
  type: 'weekCount' | 'accuracy' | 'streak';
  value: string;
}

const StatisticCard = ({ type, value }: StatisticCardProps) => {
  // 카드 타입별 설정
  let Icon: ElementType<SVGProps<SVGSVGElement>> | null;
  let iconBgColor: string;
  let iconColor: string;
  let valueColor: string;
  let label: string;

  switch (type) {
    case 'weekCount':
      Icon = TrendingUp;
      iconBgColor = 'bg-app-blue-light';
      iconColor = 'text-app-blue';
      valueColor = 'text-app-blue';
      label = '이번 주 읽은 글';
      break;
    case 'accuracy':
      Icon = Target;
      iconBgColor = 'bg-app-green-light';
      iconColor = 'text-app-green';
      valueColor = 'text-app-green';
      label = '평균 정확도';
      break;
    case 'streak':
      Icon = Flame;
      iconBgColor = 'bg-app-orange-light';
      iconColor = 'text-app-orange';
      valueColor = 'text-app-orange';
      label = '연속 학습 Streak';
      break;
    default:
      Icon = null;
      iconBgColor = '';
      iconColor = '';
      valueColor = '';
      label = '';
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-app-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${iconBgColor}`}>{Icon && <Icon className={`w-6 h-6 ${iconColor}`} />}</div>
      </div>
      <div className={`${valueColor} text-lg font-semibold`}>{value}</div>
      <p className="text-app-gray-500 text-sm">{label}</p>
    </div>
  );
};

export default StatisticCard;
