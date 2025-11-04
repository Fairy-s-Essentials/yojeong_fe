interface FeedBackBoxProps {
  type: 'wellUnderstood' | 'missedPoint' | 'improvement';
  value: string[];
}

const FeedBackBox = ({ type, value }: FeedBackBoxProps) => {
  const boxConfig = {
    wellUnderstood: {
      label: '✅ 잘 파악한 것',
      boxColor: 'bg-app-green-light border-app-green',
      textColor: 'text-green-900',
      valueColor: 'text-green-800',
    },
    missedPoint: {
      label: '⚠️ 놓친 포인트',
      boxColor: 'bg-app-orange-light border-app-orange',
      textColor: 'text-yellow-900',
      valueColor: 'text-yellow-800',
    },
    improvement: {
      label: '💡 개선 제안',
      boxColor: 'bg-app-blue-light border-app-blue',
      textColor: 'text-blue-900',
      valueColor: 'text-blue-800',
    },
  };

  const { label, boxColor, textColor, valueColor } = boxConfig[type];

  return (
    <div className={`${boxColor} border-l-4 rounded-lg p-6`}>
      <h3 className={`${textColor} text-lg mb-3`}>{label}</h3>
      <ul className="space-y-2">
        {value.map((el, idx) => (
          <li key={idx} className={`${valueColor} flex items-center gap-2`}>
            <span>•</span>
            <span>{el}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedBackBox;
