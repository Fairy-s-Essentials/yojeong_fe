import { useState } from "react";
import { BookOpen, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./ui/buttons/button";
import { Label } from "./ui/forms/label";
import { Textarea } from "./ui/forms/textarea";
import { Input } from "./ui/forms/input";

type ArticleInputPageProps = {
  onSubmit: (url: string, content: string, summary: string) => void;
  onBack: () => void;
};

const MIN_CHARS = 1000;
const MAX_CHARS = 5000;

export default function ArticleInputPage({
  onSubmit,
  onBack,
}: ArticleInputPageProps) {
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (
      content.trim().length >= MIN_CHARS &&
      content.trim().length <= MAX_CHARS
    ) {
      onSubmit(url || "https://example.com/article", content, "");
    }
  };

  const contentLength = content.trim().length;
  const isValid = contentLength >= MIN_CHARS && contentLength <= MAX_CHARS;
  const isTooShort = contentLength > 0 && contentLength < MIN_CHARS;
  const isTooLong = contentLength > MAX_CHARS;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="h-16 border-b border-app-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-full flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-app-gray-600 hover:text-app-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>돌아가기</span>
          </button>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-app-blue" />
            <span className="text-app-gray-800">ReadFirst</span>
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-app-gray-800 mb-3">읽은 글 입력하기</h1>
          <p className="text-app-gray-500">
            읽은 글의 원문을 입력해주세요 (1,000자 ~ 5,000자)
          </p>
        </div>

        <div className="space-y-8">
          {/* URL Input (Optional) */}
          <div>
            <Label htmlFor="url" className="text-app-gray-700 mb-2 block">
              글 링크 <span className="text-app-gray-400">(선택사항)</span>
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 border-app-gray-200 rounded-lg focus:ring-2 focus:ring-app-blue focus:border-app-blue bg-white"
            />
          </div>

          {/* Article Content Input */}
          <div>
            <Label htmlFor="content" className="text-app-gray-700 mb-2 block">
              읽은 글 원문 <span className="text-app-red">*</span>
            </Label>
            <Textarea
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
                  ? "focus:ring-app-orange border-app-orange"
                  : isTooLong
                  ? "focus:ring-app-red border-app-red"
                  : "focus:ring-app-blue"
              }`}
            />
            <div className="flex justify-between items-center mt-2">
              <div>
                {isTooShort && (
                  <p className="text-sm text-app-orange">
                    최소 {MIN_CHARS}자 이상 입력해주세요 (현재{" "}
                    {contentLength - MIN_CHARS}자 부족)
                  </p>
                )}
                {isTooLong && (
                  <p className="text-sm text-app-red">
                    최대 {MAX_CHARS}자까지 입력 가능합니다
                  </p>
                )}
                {isValid && (
                  <p className="text-sm text-app-green">
                    입력 가능한 범위입니다
                  </p>
                )}
              </div>
              <p
                className={`text-sm ${
                  isTooShort
                    ? "text-app-orange"
                    : isTooLong
                    ? "text-app-red"
                    : isValid
                    ? "text-app-green"
                    : "text-app-gray-400"
                }`}
              >
                {contentLength} / {MAX_CHARS} 글자
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 h-12 border-app-gray-200 text-app-gray-600 hover:bg-app-gray-50"
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className="flex-1 h-12 bg-app-blue hover:bg-app-blue-dark text-white disabled:bg-app-gray-200 disabled:text-app-gray-400 disabled:cursor-not-allowed"
            >
              다음 단계로
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
