import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Link as LinkIcon, FileText, RefreshCw } from 'lucide-react';
import { ORIGINAL_LENGTH_LIMITS } from '@/constants';
import { Button, Input, TextArea } from '@/components';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/AlertDialog';
import { isValidUrl } from '@/utils/validation';
import { useOriginalValidation, useExtractStatus } from '@/hooks';
import { saveOriginalData, getOriginalData, clearOriginalData } from '@/services/storage';
import { useExtractContentMutation } from '@/services/hooks/extract';
import type { ExtractStatus } from '@/types/extract.type';

export const OriginalInputPage = () => {
  const navigate = useNavigate();

  const [inputMode, setInputMode] = useState<'link' | 'text'>('link');
  const [pendingMode, setPendingMode] = useState<'link' | 'text' | null>(null);

  const [url, setUrl] = useState('');
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  const [userContent, setUserContent] = useState('');
  const [extractStatus, setExtractStatus] = useState<ExtractStatus | null>(null);

  const { contentLength, isValid, isTooShort, isTooLong } = useOriginalValidation({ content: userContent });
  const { mutate: extractContent, isPending: isExtracting } = useExtractContentMutation();
  const extractResult = useExtractStatus(extractStatus);

  useEffect(() => {
    const originalData = getOriginalData();

    if (originalData) {
      setUserContent(originalData.content);
      setInputMode(originalData.inputMode);
      if (originalData.url) {
        setUrl(originalData.url);
        setIsContentLoaded(true);
      }
      if (originalData.extractStatus) {
        setExtractStatus(originalData.extractStatus as ExtractStatus);
      }
    }
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleNextPage = () => {
    saveOriginalData({
      content: userContent,
      inputMode,
      url: inputMode === 'link' ? url : undefined,
      extractStatus: inputMode === 'link' && extractStatus ? extractStatus : undefined,
    });
    navigate('/summary');
  };

  const handleExtract = () => {
    extractContent(
      { url },
      {
        onSuccess: (res) => {
          if (res.data) {
            setExtractStatus(res.data.status);
            if (res.data.content) {
              setUserContent(res.data.content);
            }
            setIsContentLoaded(true);
          }
        },
      },
    );
  };

  const resetInputText = () => {
    setUrl('');
    setUserContent('');
    setIsContentLoaded(false);
    setExtractStatus(null);
    clearOriginalData();
  };

  const hasInput = inputMode === 'link' ? !!(url || userContent) : !!userContent;

  const handleSwitchMode = (mode: 'link' | 'text') => {
    if (mode === inputMode) return;
    if (hasInput) {
      setPendingMode(mode);
    } else {
      setInputMode(mode);
    }
  };

  const handleConfirmSwitch = () => {
    if (!pendingMode) return;
    setInputMode(pendingMode);
    resetInputText();
    setPendingMode(null);
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto px-6 py-12">
      <div className="w-full mb-12">
        <h1 className="text-2xl font-medium mb-3">읽은 글 입력하기</h1>
        <p className="text-app-gray-500">
          읽은 글의 원문을 입력해주세요 ({ORIGINAL_LENGTH_LIMITS.MIN.toLocaleString()}자 ~{' '}
          {ORIGINAL_LENGTH_LIMITS.MAX.toLocaleString()}자)
        </p>
      </div>

      <div className="flex flex-col w-full space-y-8">
        {/* 입력 방식 선택 영역 */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => handleSwitchMode('link')}
            className={`flex-1 h-14 rounded-lg border-2 cursor-pointer ${
              inputMode === 'link'
                ? 'border-app-blue bg-app-blue/5 text-app-blue'
                : 'border-app-gray-200 text-app-gray-500 hover:border-app-gray-300'
            }`}
          >
            <LinkIcon className="w-5 h-5" />
            <span className="font-medium">링크 입력</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSwitchMode('text')}
            className={`flex-1 h-14 rounded-lg border-2 cursor-pointer ${
              inputMode === 'text'
                ? 'border-app-blue bg-app-blue/5 text-app-blue'
                : 'border-app-gray-200 text-app-gray-500 hover:border-app-gray-300'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">원문 작성</span>
          </Button>
        </div>

        {/* 링크 / 원문 영역 */}
        {inputMode === 'link' ? (
          <div>
            <p className="text-app-gray-700 mb-2 block">
              글 링크 <span className="text-app-red">*</span>
            </p>
            <div className="flex gap-2">
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                readOnly={isContentLoaded}
                className={`h-12 border-app-gray-200 rounded-lg focus:ring-2 focus:ring-app-blue focus:border-app-blue bg-white ${
                  isContentLoaded ? 'bg-app-gray-50 cursor-not-allowed' : ''
                }`}
              />

              {isContentLoaded ? (
                <Button
                  variant="outline"
                  onClick={resetInputText}
                  className="h-12 px-6 border-app-gray-300 text-app-gray-600 hover:bg-app-gray-50 cursor-pointer whitespace-nowrap"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  수정
                </Button>
              ) : (
                <Button
                  onClick={handleExtract}
                  disabled={!isValidUrl(url) || isExtracting}
                  className="h-12 px-6 bg-app-blue hover:bg-app-blue-dark text-white disabled:bg-app-gray-200 disabled:text-app-gray-400 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                >
                  {isExtracting ? '불러오는 중...' : '원문 불러오기'}
                </Button>
              )}
            </div>
            <p className={`text-sm min-h-10 mt-1 ${extractResult?.isUsable ? 'text-app-green' : 'text-app-red'}`}>
              {extractResult?.message}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-app-gray-700 mb-2 block">
              읽은 글 원문 <span className="text-app-red">*</span>
            </p>
            <TextArea
              id="content"
              placeholder={`읽은 글의 전체 내용을 입력해주세요... (최소 ${ORIGINAL_LENGTH_LIMITS.MIN.toLocaleString()}자)`}
              value={userContent}
              onChange={(e) => {
                setUserContent(e.target.value);
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
                    최소 {ORIGINAL_LENGTH_LIMITS.MIN.toLocaleString()}자 이상 입력해주세요 (현재{' '}
                    {ORIGINAL_LENGTH_LIMITS.MIN - contentLength}자 부족)
                  </p>
                )}
                {isTooLong && (
                  <p className="text-sm text-app-red">
                    최대 {ORIGINAL_LENGTH_LIMITS.MAX.toLocaleString()}자까지 입력 가능합니다
                  </p>
                )}
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
                {contentLength.toLocaleString()} / {ORIGINAL_LENGTH_LIMITS.MAX.toLocaleString()} 글자
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 버튼 영역 */}
      <div className="w-full flex gap-4 pt-4">
        <Button
          variant="outline"
          onClick={handleGoBack}
          className="flex-1 h-12 border-app-gray-200 text-app-gray-600 hover:bg-app-gray-50 cursor-pointer"
        >
          취소
        </Button>
        <Button
          disabled={inputMode === 'link' ? !extractResult?.isUsable : !isValid}
          onClick={handleNextPage}
          className="flex-1 h-12 bg-app-blue hover:bg-app-blue-dark text-white disabled:bg-app-gray-200 disabled:text-app-gray-400 disabled:cursor-not-allowed cursor-pointer"
        >
          다음 단계로
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <AlertDialog open={!!pendingMode} onOpenChange={(open) => !open && setPendingMode(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>입력 방식 변경</AlertDialogTitle>
            <AlertDialogDescription>전환하면 입력한 내용이 사라져요. 계속할까요?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-between">
            <AlertDialogCancel className="w-full">취소</AlertDialogCancel>
            <AlertDialogAction className="w-full" onClick={handleConfirmSwitch}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
