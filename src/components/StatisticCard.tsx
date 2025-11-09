import { TrendingUp, Target, Flame } from 'lucide-react';

interface StatisticCardProps {
  type: 'weekCount' | 'accuracy' | 'streak';
  size: 'lg' | 'sm';
  value: string;
}

const StatisticCard = ({ type, size, value }: StatisticCardProps) => {
  const cardConfig = {
    weekCount: {
      Icon: TrendingUp,
      iconBgColor: 'bg-app-blue-light',
      iconColor: 'text-app-blue',
      valueColor: 'text-app-blue',
      label: '이번 주 읽은 글',
    },
    accuracy: {
      Icon: Target,
      iconBgColor: 'bg-app-green-light',
      iconColor: 'text-app-green',
      valueColor: 'text-app-green',
      label: '평균 정확도',
    },
    streak: {
      Icon: Flame,
      iconBgColor: 'bg-app-orange-light',
      iconColor: 'text-app-orange',
      valueColor: 'text-app-orange',
      label: '연속 학습 Streak',
    },
  };

  const sizeConfig = {
    lg: {
      iconSize: 'w-8 h-8',
      textSize: 'text-4xl mb-1',
    },
    sm: {
      iconSize: 'w-6 h-6',
      textSize: 'text-lg',
    },
  };

  const { Icon, iconBgColor, iconColor, valueColor, label } = cardConfig[type];
  const { iconSize, textSize } = sizeConfig[size];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-app-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${iconBgColor}`}>{Icon && <Icon className={`${iconSize} ${iconColor}`} />}</div>
      </div>
      <div className={`${valueColor} ${textSize}`}>{value}</div>
      <p className="text-app-gray-500 text-sm">{label}</p>
    </div>
  );
};

export default StatisticCard;
