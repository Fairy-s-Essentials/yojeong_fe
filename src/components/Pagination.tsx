import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '.';

/**
 * @param currentPage 현재 페이지 번호
 * @param totalPages 총 페이지 수
 * @param onPageChange 페이지 변경 핸들러
 */

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  // 현재 페이지가 속한 그룹의 시작 페이지 계산
  const PAGE_GROUP_SIZE = 5;
  const groupStart = Math.floor((currentPage - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1;
  const groupEnd = Math.min(groupStart + PAGE_GROUP_SIZE - 1, totalPages);

  // 표시할 페이지 번호 배열 생성
  const pageNumbers = Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => groupStart + i);

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(Math.max(1, currentPage - 5))}
        disabled={currentPage === 1}
        className="w-8 h-8"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`w-8 h-8 rounded-lg text-sm transition-colors ${
            page === currentPage
              ? 'bg-app-blue text-white'
              : 'bg-white border border-app-gray-200 text-app-gray-500 hover:bg-app-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 5))}
        disabled={currentPage === totalPages}
        className="w-8 h-8"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Pagination;
