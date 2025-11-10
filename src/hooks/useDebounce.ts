import { useEffect, useState } from 'react';

/**
 * 값의 변경을 지연시키는 훅
 * @param value - debounce할 값
 * @param delay - 지연 시간 (ms)
 * @returns debounced된 값
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 시간 후에 값을 업데이트
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 값이 변경되면 이전 타이머를 취소
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
