import { useState } from 'react';
import { LogOut, Loader2, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/auth/useAuth';
import { showToast } from '@/utils/toast';
import { Button } from '@/components';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  TextArea,
} from '@/components';
import { useUsageLimit } from '@/services/hooks/usage';
import { useWithdraw } from '@/services/hooks/auth';
import { useSubmitVocMutation } from '@/services/hooks/voc';

export const MyPage = () => {
  const { user, isLoading } = useAuth();
  const { mutate: withdraw } = useWithdraw();

  const [isDeleteClicked, setIsDeleteClicked] = useState(false);
  const [isVocModalOpen, setIsVocModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [vocContent, setVocContent] = useState('');

  const { usage: usedCount, limit: maxCount } = useUsageLimit();
  const { mutate: submitVoc, isPending: isSubmitting } = useSubmitVocMutation();

  const remainingCount = maxCount - usedCount; // 남은 횟수
  const progressPercentage = (usedCount / maxCount) * 100;

  const handleVocClick = () => {
    setIsDeleteClicked(false);
    setIsVocModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteClicked(false);
    setIsDeleteDialogOpen(true);
  };

  const handleVocSubmit = () => {
    if (!vocContent.trim()) return;

    submitVoc(
      { message: vocContent.trim() },
      {
        onSuccess: () => {
          showToast('VOC_SUBMIT_SUCCESS');
          setVocContent('');
          setIsVocModalOpen(false);
        },
        onError: () => {
          showToast('VOC_SUBMIT_ERROR');
        },
      },
    );
  };

  const handleDeleteAccount = () => {
    withdraw(undefined, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center max-w-4xl mx-auto px-6 py-12">
        <div className="w-full space-y-8">
          <div className="h-40 bg-app-gray-100 rounded-xl animate-pulse" />
          <div className="h-32 bg-app-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center max-w-4xl mx-auto px-6 py-12">
        {/* 페이지 제목 */}
        <div className="w-full mb-12">
          <h1 className="text-2xl font-medium text-app-gray-800 mb-2">마이페이지</h1>
          <p className="text-app-gray-500">계정 정보 및 사용 현황을 확인하세요</p>
        </div>

        {/* 오늘 남은 횟수 섹션 */}
        <div className="w-full mb-8">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-app-gray-200">
            <h2 className="text-lg font-medium text-app-gray-800 mb-2">오늘 남은 횟수</h2>
            <p className="text-sm text-app-gray-500 mb-6">매일 {maxCount}회까지 글을 분석할 수 있습니다</p>

            {/* 남은 횟수 표시 */}
            <div className="flex items-end justify-between mb-4">
              <div>
                <div>
                  <span className="text-md  text-app-blue">{remainingCount}회</span>
                  <span className="text-app-gray-600 ml-2">남음</span>
                </div>
                <div className="text-sm text-app-gray-500">
                  {usedCount}회 사용 / {maxCount}회
                </div>
              </div>
              <p className="text-xs text-app-gray-400 text-right">자정에 초기화됩니다</p>
            </div>

            {/* 프로그레스 바 */}
            <div className="relative w-full h-2 bg-app-gray-200 rounded-full overflow-hidden mb-2">
              <div
                className="absolute top-0 left-0 h-full bg-app-gray-800 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* 계정 관리 섹션 */}
        <div className="w-full">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-app-gray-200">
            <h2 className="text-lg font-medium text-app-gray-800 mb-2">계정 관리</h2>
            <p className="text-sm text-app-gray-500 mb-6">계정 설정 및 회원 정보를 관리합니다</p>

            {/* 카카오 계정 정보 */}
            <div className="flex items-center mb-6 gap-4 border-b-gray-200 border-b pb-4">
              <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-app-gray-800">카카오 계정</p>
                <p className="text-sm text-app-gray-600">{user?.email || 'user@kakao.com'}</p>
              </div>
            </div>

            {/* 회원탈퇴 버튼 */}
            <Button
              onClick={() => setIsDeleteClicked(true)}
              className="w-full h-10 bg-app-red hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              회원탈퇴
            </Button>
          </div>
        </div>
      </div>

      {/* 회원 탈퇴 확인 다이얼로그 */}
      <Dialog open={isDeleteClicked} onOpenChange={setIsDeleteClicked}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-app-gray-800">정말 떠나시려는 이유가 있을까요?</DialogTitle>
            <DialogDescription className="text-app-gray-600">
              여러분의 한 마디가 큰 도움이 됩니다.
              <br />
              알려주시면 더 나은 서비스로 개선하겠습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button onClick={handleVocClick} className="cursor-pointer">
              문의·불편 접수
            </Button>
            <Button onClick={handleDeleteClick} className="cursor-pointer bg-app-red hover:bg-red-500">
              탈퇴하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* VOC 모달 */}
      <Dialog open={isVocModalOpen} onOpenChange={setIsVocModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>문의·불편 접수</DialogTitle>
            <DialogDescription>불편사항이나 개선 아이디어를 자유롭게 남겨주세요</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <TextArea
              placeholder="내용을 입력해주세요..."
              value={vocContent}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setVocContent(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsVocModalOpen(false);
                setVocContent('');
              }}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button onClick={handleVocSubmit} disabled={!vocContent.trim() || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  제출 중...
                </>
              ) : (
                '제출'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 회원 탈퇴 경고 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-app-gray-800">정말 탈퇴하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription className="text-app-gray-600">
              탈퇴하시면 모든 학습 기록과 데이터가 삭제됩니다.
              <br />이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="cursor-pointer bg-app-red hover:bg-red-700">
              탈퇴하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
