export const MESSAGE = {
  ANALYSIS: {
    USAGE_LIMIT: '오늘의 분석 요청 가능 횟수를 모두 사용하셨어요. 내일 다시 이용해주세요!',
    PROCESSING: 'AI가 요약을 분석하고 있어요. 잠시만 기다려주세요!',
  },

  EXTRACT: {
    SUCCESS: '원문을 불러왔어요!',
    TRUNCATED: '원문을 불러왔어요! 원문이 길어 앞 5000자만 분석에 사용돼요.',
    UNSUITABLE: '요약하기 적합하지 않은 글이에요. 요약 결과가 다소 부정확할 수 있어요.',

    UNDER_LIMIT: '원문이 너무 짧아 분석이 어려워요. (1000자 이상의 글을 입력해주세요.)',
    FAILED: '페이지를 불러올 수 없어요. 링크를 다시 확인해주세요.',
  },
};
