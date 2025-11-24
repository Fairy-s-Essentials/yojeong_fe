import { useState } from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/auth/useAuth';
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
} from '@/components';

export const MyPage = () => {
  const { user, isLoading } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // TODO: API 연동 필요
  const usedCount = 3; // 사용한 횟수
  const maxCount = 10; // 최대 횟수
  const remainingCount = maxCount - usedCount; // 남은 횟수
  const progressPercentage = (usedCount / maxCount) * 100;

  const handleDeleteAccount = () => {
    // TODO: 회원탈퇴 API 연동
    console.log('회원탈퇴 API 호출');
    setIsDeleteDialogOpen(false);
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
            <div className="flex items-center mb-6 gap-4 border-b-gray-200 border-b-1 pb-4">
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
              onClick={() => setIsDeleteDialogOpen(true)}
              className="w-full h-10 bg-app-red hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              회원탈퇴
            </Button>
          </div>
        </div>
      </div>

      {/* 회원탈퇴 확인 다이얼로그 */}
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
