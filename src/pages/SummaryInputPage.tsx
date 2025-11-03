import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Check } from 'lucide-react';
import { SUMMARY_TIPS, CRITICAL_LENGTH_LIMITS } from '@/constants';
import { Header, Button, TipBox, TextArea } from '@/components';
import { useSummaryValidation } from '@/hooks';
import { getOriginalData, clearOriginalData } from '@/services/storage';

export const SummaryInputPage = () => {
  const navigate = useNavigate();
  const randomTip = SUMMARY_TIPS[Math.floor(Math.random() * SUMMARY_TIPS.length)];

  const [originalLink, setOriginalLink] = useState<string>('');
  const [originalContent, setOriginalContent] = useState<string>('');
  const [originalLength, setOriginalLength] = useState<number>(0);

  // 링크 및 원문 확인 - 추후 삭제
  console.log(originalLink);
  console.log(originalContent);
  console.log(originalLength);

  const [summary, setSummary] = useState<string>(''); // 나의 요약
  const [weakness, setWeakness] = useState<string>(''); // 이 글의 약점
  const [opposite, setOpposite] = useState<string>(''); // 반대 의견

  // 로컬스토리지에서 원문 데이터 불러오기
  useEffect(() => {
    const originalData = getOriginalData();

    if (originalData) {
      setOriginalLink(originalData.link);
      setOriginalContent(originalData.content);
      setOriginalLength(originalData.content.trim().length);
    } else {
      // 원문 데이터가 없으면 이전 페이지로 이동
      navigate('/input');
    }
  }, [navigate]);

  const { maxSummaryLength, summaryLength, isSummaryOverLimit, isWeaknessOverLimit, isOppositeOverLimit, canSubmit } =
    useSummaryValidation({
      originalLength,
      summary,
      weakness,
      opposite,
    });

  // TODO: 분석 시작 함수 구현 필요 (추후 API 호출 추가)
  const handleSubmit = () => {
    // 로컬스토리지에서 원문 데이터 삭제
    clearOriginalData();

    // 임시 페이지 이동
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="flex flex-col items-center max-w-4xl mx-auto px-6 py-12">
        {/* 요약 팁 영역 */}
        <TipBox tip={randomTip} />

        {/* 요약 + 비판적 읽기 작성 영역 */}
        <div className="w-full space-y-8">
          <div className="pt-12">
            <div className="mb-8">
              <h2 className="text-app-gray-800 mb-2">✍️ 나의 요약</h2>
              <p className="text-sm text-app-gray-500">글의 핵심 내용을 요약해주세요</p>
            </div>

            {/* 나의 요약 - 필수 */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-app-gray-800">요약글 입력</h3>
                <span className="text-xs bg-app-red text-white px-2 py-0.5 rounded">필수</span>
              </div>
              <TextArea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="글의 전체 흐름과 핵심 주장, 근거를 포함하여 요약해주세요..."
                className={`min-h-[200px] resize-y rounded-lg focus:ring-2 p-4 ${
                  isSummaryOverLimit
                    ? 'border-app-red focus:ring-app-red'
                    : summaryLength > 0
                    ? 'border-app-green focus:ring-app-green'
                    : 'border-app-gray-200 focus:ring-app-gray-300'
                }`}
              />
              <div className="flex justify-end items-center mt-2">
                <div
                  className={`text-sm ${
                    isSummaryOverLimit ? 'text-app-red' : summaryLength > 0 ? 'text-app-green' : 'text-app-gray-400'
                  }`}
                >
                  {summaryLength} / {maxSummaryLength}자
                </div>
              </div>
            </div>

            {/* 비판적 읽기 영역 */}
            <div className="mb-10">
              <div className="mb-4">
                <h3 className="text-app-gray-800 mb-2">🤔 비판적 읽기</h3>
                <p className="text-sm text-app-gray-400">(선택사항)</p>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-app-gray-700 mb-2 block">이 글의 약점은?</p>
                  <TextArea
                    value={weakness}
                    onChange={(e) => setWeakness(e.target.value)}
                    placeholder="자유롭게 작성해주세요..."
                    className={`h-24 resize-none rounded-lg focus:ring-2 p-4 ${
                      isWeaknessOverLimit
                        ? 'border-app-red focus:ring-app-red'
                        : 'border-app-gray-200 focus:ring-app-gray-300'
                    }`}
                  />
                  <div className="flex justify-end items-center mt-2">
                    <div className={`text-sm ${isWeaknessOverLimit ? 'text-app-red' : 'text-app-gray-400'}`}>
                      {weakness.length} / {CRITICAL_LENGTH_LIMITS}자
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-app-gray-700 mb-2 block">반대 의견은?</p>
                  <TextArea
                    value={opposite}
                    onChange={(e) => setOpposite(e.target.value)}
                    placeholder="자유롭게 작성해주세요..."
                    className={`h-24 resize-none rounded-lg focus:ring-2 p-4 ${
                      isOppositeOverLimit
                        ? 'border-app-red focus:ring-app-red'
                        : 'border-app-gray-200 focus:ring-app-gray-300'
                    }`}
                  />
                  <div className="flex justify-end items-center mt-2">
                    <div className={`text-sm ${isOppositeOverLimit ? 'text-app-red' : 'text-app-gray-400'}`}>
                      {opposite.length} / {CRITICAL_LENGTH_LIMITS}자
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="text-center">
              <Button
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="w-80 h-13 bg-app-blue hover:bg-app-blue-dark text-white rounded-xl shadow-lg disabled:bg-app-gray-200 disabled:text-app-gray-400 disabled:cursor-not-allowed"
              >
                {canSubmit ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    AI 분석 시작
                  </>
                ) : isSummaryOverLimit ? (
                  `요약 글자수 초과 (최대 ${maxSummaryLength}자)`
                ) : isWeaknessOverLimit || isOppositeOverLimit ? (
                  `비판적 읽기 글자수 초과 (최대 ${CRITICAL_LENGTH_LIMITS}자)`
                ) : (
                  '요약 작성 필요'
                )}
              </Button>
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-app-red cursor-pointer">
                <span>⚠️ 제출 후 수정이 불가능합니다</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
