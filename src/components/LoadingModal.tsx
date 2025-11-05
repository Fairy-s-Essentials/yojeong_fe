import { Loader2 } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

interface LoadingModalProps {
  isOpen: boolean;
  onCancel?: () => void;
  message?: string;
  subMessage?: string;
  showCancelButton?: boolean;
}

const LoadingModal = ({
  isOpen,
  onCancel,
  message = 'AI가 요약을 분석하고 있어요',
  subMessage = '잠시만 기다려주세요...',
  showCancelButton = true,
}: LoadingModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={undefined} className="max-w-md">
      <div className="p-8 flex flex-col items-center">
        {/* 로딩 아이콘 */}
        <div className="mb-6">
          <div className="relative">
            {/* 배경 원 */}
            <div className="w-20 h-20 rounded-full bg-app-blue/10 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-app-blue animate-spin" />
            </div>
            {/* 펄스 효과 */}
            <div className="absolute inset-0 rounded-full bg-app-blue/20 animate-ping" />
          </div>
        </div>

        {/* 메시지 */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-app-gray-800 mb-2">
            {message}
          </h3>
          <p className="text-sm text-app-gray-500">{subMessage}</p>
        </div>

        {/* 취소 버튼 */}
        {showCancelButton && onCancel && (
          <Button
            onClick={onCancel}
            className="w-full h-12 bg-white border-2 border-app-gray-300 text-app-gray-700 hover:bg-app-gray-50 rounded-xl transition-colors"
          >
            취소
          </Button>
        )}

        {/* 진행 중 표시 바 */}
        <div className="w-full mt-6">
          <div className="h-1 bg-app-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-app-blue rounded-full animate-loading-bar" />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoadingModal;

