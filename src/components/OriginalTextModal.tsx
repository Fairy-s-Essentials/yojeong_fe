import { Dialog, DialogContent } from './Dialog';

interface OriginalTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  originalUrl?: string;
}

export const OriginalTextModal = ({ isOpen, onClose, originalText, originalUrl }: OriginalTextModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] w-[calc(100%-2rem)] max-h-[80vh] rounded-2xl p-0 overflow-hidden flex flex-col">
        {/* 고정 헤더 영역 */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-app-gray-700"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <h2 className="text-lg font-bold text-app-gray-800">원문</h2>
          </div>
          {originalUrl && (
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-app-blue hover:text-app-blue-dark hover:underline break-all"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>{originalUrl}</span>
            </a>
          )}
        </div>

        {/* 스크롤 가능한 본문 영역 - 스크롤바 숨김 */}
        <div className="flex-1 overflow-y-auto p-6 pt-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="text-app-gray-700 leading-relaxed whitespace-pre-wrap">
            {originalText || '원문이 없습니다.'}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
