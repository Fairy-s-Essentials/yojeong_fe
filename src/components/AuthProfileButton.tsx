import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './AlertDialog';
import ProfileIcon from './ProfileIcon';
import { useProfileAuth } from '@/hooks/auth/useProfileAuth';

const AuthProfileButton = () => {
  const { user, isLogoutAlertOpen, setIsLogoutAlertOpen, handleProfileClick, handleLogout } = useProfileAuth();

  return (
    <>
      <ProfileIcon user={user} onClick={handleProfileClick} />
      {/* 로그아웃 확인 알럿 */}
      <AlertDialog open={isLogoutAlertOpen} onOpenChange={setIsLogoutAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>로그아웃</AlertDialogTitle>
            <AlertDialogDescription>정말 로그아웃 하시겠습니까?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>로그아웃</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AuthProfileButton;
