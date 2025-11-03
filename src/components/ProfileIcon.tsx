import { User } from 'lucide-react';

// TODO: 프로필 이미지 url이 존재할 경우 추가 구현 / 클릭 시 로그인 모달 표시 추가 구현
const ProfileIcon = () => {
  return (
    <button className="p-2 hover:bg-app-gray-50 rounded-full transition-colors cursor-pointer">
      <User className="w-6 h-6 text-app-gray-500" />
    </button>
  );
};

export default ProfileIcon;
