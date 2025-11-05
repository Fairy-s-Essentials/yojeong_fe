import { User } from 'lucide-react';
import type { User as UserType } from '@/types/auth';

interface ProfileIconProps {
  user?: UserType | null;
  onClick?: () => void;
}

const ProfileIcon = ({ user, onClick }: ProfileIconProps) => {
  return (
    <button 
      onClick={onClick}
      className="p-2 hover:bg-app-gray-50 rounded-full transition-colors cursor-pointer"
    >
      {user?.profile_image ? (
        <img 
          src={user.profile_image} 
          alt={user.nickname}
          className="w-6 h-6 rounded-full object-cover"
        />
      ) : (
        <User className="w-6 h-6 text-app-gray-500" />
      )}
    </button>
  );
};

export default ProfileIcon;
