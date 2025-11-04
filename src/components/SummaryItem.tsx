import AccuracyCircle from './AccuracyCircle';

// TODO: 추후 types 폴더의 타입으로 연결
export interface MainRecentSummary {
  id: number;
  similarity_score: number;
  user_summary: string;
  created_at: string;
}

interface SummaryItemProps {
  summary: MainRecentSummary;
}

const SummaryItem = ({ summary }: SummaryItemProps) => {
  return (
    <div
      key={summary.id}
      className="bg-white rounded-xl p-5 border border-app-gray-200 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center justify-between gap-5">
        <div className="flex-1 min-w-0">
          <p className="text-app-gray-800 mb-1 truncate">{summary.user_summary}</p>
          <div className="flex items-center gap-3 text-sm text-app-gray-500">
            <span>{new Date(summary.created_at).toLocaleDateString('ko-KR')}</span>
          </div>
        </div>

        <div className="shrink-0">
          <AccuracyCircle score={summary.similarity_score} />
        </div>
      </div>
    </div>
  );
};

export default SummaryItem;
