import { toast } from 'sonner';
import { TOAST_MESSAGE, type ToastMessageKey } from '@/constants/toastMessage';

export const showToast = (key: ToastMessageKey) => {
  const { type, title, description } = TOAST_MESSAGE[key];
  toast[type](title, { description });
};
