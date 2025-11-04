interface SummaryBoxProps {
  type: 'user' | 'ai';
  summary: string;
}

const SummaryBox = ({ type, summary }: SummaryBoxProps) => {
  const getBorderColor = (type: string) => {
    return type === 'user' ? 'border-app-blue' : 'border-app-green';
  };

  return (
    <div className={`bg-app-gray-50 border-2 ${getBorderColor(type)} rounded-xl p-5 min-h-[200px]`}>
      <p className="text-app-gray-800 leading-relaxed whitespace-pre-wrap">{summary}</p>
      <div className="text-xs text-app-gray-500 mt-3 text-right">{summary.length}자</div>
    </div>
  );
};

export default SummaryBox;
