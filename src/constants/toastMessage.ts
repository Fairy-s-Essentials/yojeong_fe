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
  WITH_DRAW_SUCCESS: {
    type: 'success' as const,
    title: '회원 탈퇴가 완료되었습니다.',
    description: '이용해주셔서 감사합니다.',
  },
  WITH_DRAW_ERROR: {
    type: 'error' as const,
    title: '회원 탈퇴 실패',
    description: '잠시 후 다시 시도해주세요.',
  },
  LOGOUT_SUCCESS: {
    type: 'success' as const,
    title: '로그아웃 완료',
    description: '정상적으로 로그아웃되었습니다.',
  },
  LOGOUT_ERROR: {
    type: 'error' as const,
    title: '로그아웃 실패',
    description: '잠시 후 다시 시도해주세요.',
  },
  LOGIN_ERROR: {
    type: 'error' as const,
    title: '로그인 실패',
    description: '잠시 후 다시 시도해주세요.',
  },
  LOGIN_RESTRICTED: {
    type: 'error' as const,
    title: '로그인 실패',
    description: '탈퇴 후 24시간 동안은 재가입할 수 없습니다.',
  },
} as const;

export type ToastMessageKey = keyof typeof TOAST_MESSAGE;
