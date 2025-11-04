import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { LoadingModal } from "@/components";

interface LoadingState {
  isLoading: boolean;
  message: string;
  subMessage: string;
  showCancelButton: boolean;
  onCancel?: () => void;
}

interface LoadingContextValue {
  showLoading: (options?: Partial<Omit<LoadingState, "isLoading">>) => void;
  hideLoading: () => void;
  updateLoading: (options: Partial<Omit<LoadingState, "isLoading">>) => void;
}

const LoadingContext = createContext<LoadingContextValue | undefined>(
  undefined
);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: "처리 중입니다...",
    subMessage: "잠시만 기다려주세요...",
    showCancelButton: false,
    onCancel: undefined,
  });

  const showLoading = useCallback(
    (options?: Partial<Omit<LoadingState, "isLoading">>) => {
      setLoadingState((prev) => ({
        ...prev,
        isLoading: true,
        message: options?.message ?? "처리 중입니다...",
        subMessage: options?.subMessage ?? "잠시만 기다려주세요...",
        showCancelButton: options?.showCancelButton ?? false,
        onCancel: options?.onCancel,
      }));
    },
    []
  );

  const hideLoading = useCallback(() => {
    setLoadingState((prev) => ({
      ...prev,
      isLoading: false,
      onCancel: undefined,
    }));
  }, []);

  const updateLoading = useCallback(
    (options: Partial<Omit<LoadingState, "isLoading">>) => {
      setLoadingState((prev) => ({
        ...prev,
        ...options,
      }));
    },
    []
  );

  return (
    <LoadingContext.Provider
      value={{ showLoading, hideLoading, updateLoading }}
    >
      {children}

      {/* 전역 로딩 모달 */}
      <LoadingModal
        isOpen={loadingState.isLoading}
        onCancel={loadingState.onCancel}
        message={loadingState.message}
        subMessage={loadingState.subMessage}
        showCancelButton={loadingState.showCancelButton}
      />
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};

