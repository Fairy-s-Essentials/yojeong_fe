import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { Header, Button, Input, TextArea } from '@/components';

export const OriginalInputPage = () => {
  const navigate = useNavigate();

  const [url, setUrl] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const MIN_CHARS = 1000;
  const MAX_CHARS = 5000;

  const contentLength = content.trim().length;
  const isValid = contentLength >= MIN_CHARS && contentLength <= MAX_CHARS;
  const isTooShort = contentLength > 0 && contentLength < MIN_CHARS;
  const isTooLong = contentLength > MAX_CHARS;

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleNextPage = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="flex flex-col items-center max-w-4xl mx-auto px-6 py-12">
        <div className="w-full mb-12">
          <h1 className="text-2xl font-medium mb-3">읽은 글 입력하기</h1>
          <p className="text-app-gray-500">읽은 글의 원문을 입력해주세요 (1,000자 ~ 5,000자)</p>
        </div>

        {/* 링크 + 원문 입력 영역 */}
        <div className="w-full space-y-8">
          {/* 링크 */}
          <div>
            <p className="text-app-gray-700 mb-2 block">
              글 링크 <span className="text-app-gray-400">(선택사항)</span>
            </p>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 border-app-gray-200 rounded-lg focus:ring-2 focus:ring-app-blue focus:border-app-blue bg-white"
            />
          </div>

          {/* 원문 */}
          <div>
            <p className="text-app-gray-700 mb-2 block">
              읽은 글 원문 <span className="text-app-red">*</span>
            </p>
            <TextArea
              id="content"
              placeholder="읽은 글의 전체 내용을 입력해주세요... (최소 1,000자)"
              value={content}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  setContent(e.target.value);
                }
              }}
              className={`min-h-[400px] border-app-gray-200 rounded-lg focus:ring-2 focus:border-app-blue bg-white resize-y p-4 ${
                isTooShort
                  ? 'focus:ring-app-orange border-app-orange'
                  : isTooLong
                  ? 'focus:ring-app-red border-app-red'
                  : 'focus:ring-app-blue'
              }`}
            />
            <div className="flex justify-between items-center mt-2">
              <div>
                {isTooShort && (
                  <p className="text-sm text-app-orange">
                    최소 {MIN_CHARS}자 이상 입력해주세요 (현재 {contentLength - MIN_CHARS}자 부족)
                  </p>
                )}
                {isTooLong && <p className="text-sm text-app-red">최대 {MAX_CHARS}자까지 입력 가능합니다</p>}
                {isValid && <p className="text-sm text-app-green">입력 가능한 범위입니다</p>}
              </div>
              <p
                className={`text-sm ${
                  isTooShort
                    ? 'text-app-orange'
                    : isTooLong
                    ? 'text-app-red'
                    : isValid
                    ? 'text-app-green'
                    : 'text-app-gray-400'
                }`}
              >
                {contentLength} / {MAX_CHARS} 글자
              </p>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handleGoBack}
              className="flex-1 h-12 border-app-gray-200 text-app-gray-600 hover:bg-app-gray-50 cursor-pointer"
            >
              취소
            </Button>
            <Button
              disabled={!isValid}
              onClick={handleNextPage}
              className="flex-1 h-12 bg-app-blue hover:bg-app-blue-dark text-white disabled:bg-app-gray-200 disabled:text-app-gray-400 disabled:cursor-not-allowed cursor-pointer"
            >
              다음 단계로
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
