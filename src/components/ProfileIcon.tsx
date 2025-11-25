import { User } from 'lucide-react';
import type { User as UserType } from '@/types/auth.type';

interface ProfileIconProps {
  user?: UserType | null;
}

const ProfileIcon = ({ user }: ProfileIconProps) => {
  return user?.profile_image ? (
    <img src={user.profile_image} alt={user.nickname} className="w-6 h-6 rounded-full object-cover" />
  ) : (
    <User className="w-6 h-6 text-app-gray-500" />
  );
};

export default ProfileIcon;
