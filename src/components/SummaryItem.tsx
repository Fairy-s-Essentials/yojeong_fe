import AccuracyCircle from './AccuracyCircle';
import type { MainRecentSummary } from '@/types/main.type';

interface SummaryItemProps {
  summary: MainRecentSummary;
  onClick?: () => void;
}

const SummaryItem = ({ summary, onClick }: SummaryItemProps) => {
  return (
    <div
      key={summary.id}
      onClick={onClick}
      className="bg-white rounded-xl p-5 border border-app-gray-200 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center justify-between gap-5">
        <div className="flex-1 min-w-0">
          <p className="text-app-gray-800 mb-1 truncate">{summary.userSummary}</p>
          <div className="flex items-center gap-3 text-sm text-app-gray-500">
            <span>{new Date(summary.createdAt).toLocaleDateString('ko-KR')}</span>
          </div>
        </div>

        <div className="shrink-0">
          <AccuracyCircle score={summary.similarityScore} />
        </div>
      </div>
    </div>
  );
};

export default SummaryItem;
