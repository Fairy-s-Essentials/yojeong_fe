export const TOAST_MESSAGE = {
  VOC_SUBMIT_SUCCESS: {
    type: 'success' as const,
    title: '소중한 의견 감사합니다!',
    description: '전달된 내용을 검토하여 서비스 개선에 반영하겠습니다.',
  },
  VOC_SUBMIT_ERROR: {
    type: 'error' as const,
    title: '제출 실패',
    description: '잠시 후 다시 시도해주세요.',
  },
  USAGE_LIMIT_EXCEEDED: {
    type: 'warning' as const,
    title: '사용 제한',
    description: '오늘의 분석 요청 가능 횟수를 모두 사용하셨어요. 내일 다시 이용해주세요!',
  },
} as const;

export type ToastMessageKey = keyof typeof TOAST_MESSAGE;
