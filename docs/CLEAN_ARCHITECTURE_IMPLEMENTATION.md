# 클린 아키텍처 기반 구현 가이드

## 📋 목차

1. [클린 아키텍처 개요](#클린-아키텍처-개요)
2. [레이어 구조](#레이어-구조)
3. [의존성 규칙](#의존성-규칙)
4. [구현 예제](#구현-예제)
5. [코드 구조 상세](#코드-구조-상세)

---

## 클린 아키텍처 개요

### 핵심 원칙

1. **의존성 역전 원칙 (Dependency Inversion)**
   - 외부 → 내부로만 의존
   - 비즈니스 로직은 UI나 프레임워크에 독립적

2. **관심사의 분리 (Separation of Concerns)**
   - 각 레이어는 명확한 책임
   - 레이어 간 명확한 경계

3. **테스트 용이성**
   - 각 레이어를 독립적으로 테스트
   - Mock과 Stub 활용

### 프로젝트 적용

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                   │
│  (Components, Pages, Boundaries)                        │
│  - UI 로직                                              │
│  - 사용자 상호작용                                       │
│  - Suspense & Error Boundary                           │
└─────────────────────────────────────────────────────────┘
                          ↓ only
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                     │
│  (Custom Hooks, View Models)                           │
│  - 비즈니스 로직                                         │
│  - 데이터 변환                                           │
│  - 상태 조합                                             │
└─────────────────────────────────────────────────────────┘
                          ↓ only
┌─────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                   │
│  (API, React Query, Storage)                           │
│  - 데이터 페칭                                           │
│  - 캐시 관리                                             │
│  - 외부 서비스 통신                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 레이어 구조

### 1. Presentation Layer (UI)

**역할**:
- 사용자에게 정보 표시
- 사용자 입력 처리
- 라우팅
- 로딩/에러 상태 표시

**포함 요소**:
- Components (Button, Card, Modal 등)
- Pages
- Boundaries (ErrorBoundary, SuspenseBoundary)
- Layouts

**규칙**:
- ✅ Application Layer의 hooks 사용 가능
- ✅ 다른 UI 컴포넌트 조합 가능
- ❌ API 직접 호출 금지
- ❌ 비즈니스 로직 포함 금지

**예시**:
```typescript
// ✅ Good
export const HistoryPage = () => {
  const { stats, chartData } = useHistoryData(period);
  
  return (
    <div>
      <StatisticCard value={stats.count} />
      <LineChart data={chartData} />
    </div>
  );
};

// ❌ Bad - API 직접 호출
export const HistoryPage = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/history').then(res => setData(res));
  }, []);
  
  // ...
};
```

---

### 2. Application Layer (Business Logic)

**역할**:
- 비즈니스 로직 구현
- 데이터 변환 및 가공
- 여러 데이터 소스 조합
- UI에 최적화된 형태로 데이터 제공

**포함 요소**:
- Custom Hooks (useHistoryData, useAnalysisData)
- View Models
- Business Logic Utils

**규칙**:
- ✅ Infrastructure Layer의 hooks 사용 가능
- ✅ 데이터 변환 및 조합
- ✅ 비즈니스 규칙 구현
- ❌ UI 컴포넌트 임포트 금지
- ❌ React Query 직접 사용 금지 (Infrastructure에서 제공하는 hooks만)

**예시**:
```typescript
// ✅ Good - Application Layer Hook
export const useHistoryData = (period: HistoryPeriod) => {
  // Infrastructure Layer hooks 사용
  const { data: analysis } = useHistoryAnalysisQuery(period);
  const { data: trend } = useAccuracyTrendQuery(period);
  
  // 비즈니스 로직: 데이터 변환
  const stats = useMemo(() => ({
    count: analysis.summaryCount,
    accuracy: analysis.averageScore,
    streak: analysis.consecutiveDays,
    // 추가 계산
    trend: calculateTrend(analysis),
    grade: calculateGrade(analysis.averageScore),
  }), [analysis]);
  
  // 차트 데이터 변환
  const chartData = useMemo(() => 
    trend.dataPoints.map(point => ({
      date: formatChartDate(point.date, period),
      accuracy: point.averageScore,
      label: getDateLabel(point.date),
    }))
  , [trend, period]);
  
  return {
    stats,
    chartData,
    isImproving: stats.trend > 0,
  };
};

// ❌ Bad - UI 로직 포함
export const useHistoryData = () => {
  // ...
  return {
    data,
    renderChart: () => <LineChart />, // ❌ UI 반환
  };
};
```

---

### 3. Infrastructure Layer (Data Access)

**역할**:
- 외부 서비스 통신
- 데이터 페칭 및 캐싱
- 로컬 스토리지 관리
- React Query 설정

**포함 요소**:
- API 클라이언트 (axios)
- React Query Hooks
- Storage 유틸리티
- Query Client 설정

**규칙**:
- ✅ React Query 사용
- ✅ API 타입 정의
- ✅ 에러 처리 및 재시도 로직
- ❌ 비즈니스 로직 금지
- ❌ UI 로직 금지

**예시**:
```typescript
// ✅ Good - Infrastructure Layer
// api/history.api.ts
export const getHistoryAnalysis = async (
  period: HistoryPeriod
): Promise<HistoryAnalysisResponse> => {
  const { data } = await apiClient.get('/history/analysis', {
    params: { period },
  });
  return data;
};

// hooks/history.ts
export const useHistoryAnalysisQuery = (period: HistoryPeriod) => {
  return useSuspenseQuery({
    queryKey: ['historyAnalysis', period],
    queryFn: () => getHistoryAnalysis(period),
    staleTime: 1000 * 60 * 5,
  });
};

// ❌ Bad - 비즈니스 로직 포함
export const useHistoryAnalysisQuery = (period: HistoryPeriod) => {
  const query = useSuspenseQuery({
    queryKey: ['historyAnalysis', period],
    queryFn: () => getHistoryAnalysis(period),
  });
  
  // ❌ 여기서 데이터 변환하면 안 됨
  const transformedData = {
    ...query.data,
    grade: calculateGrade(query.data.averageScore),
  };
  
  return { ...query, data: transformedData };
};
```

---

## 의존성 규칙

### 레이어 간 의존성

```typescript
// Presentation Layer
import { useHistoryData } from '@/hooks/history'; // ✅ Application
import { Button } from '@/components/Button';     // ✅ Presentation

// Application Layer
import { useHistoryAnalysisQuery } from '@/services/hooks/history'; // ✅ Infrastructure
import { formatDate } from '@/utils/date';                          // ✅ Utils

// Infrastructure Layer
import axios from 'axios';                        // ✅ External
import { HistoryAnalysisResponse } from '@/types'; // ✅ Types
```

### 금지된 의존성

```typescript
// ❌ Infrastructure → Application
// services/hooks/history.ts
import { useHistoryData } from '@/hooks/history'; // ❌

// ❌ Infrastructure → Presentation
// services/api/history.api.ts
import { Button } from '@/components/Button'; // ❌

// ❌ Application → Presentation
// hooks/useHistoryData.ts
import { LineChart } from '@/components/LineChart'; // ❌
```

---

## 구현 예제

### 예제 1: HistoryPage 전체 구조

#### 1.1 Infrastructure Layer

```typescript
// src/services/api/history.api.ts
import { apiClient } from './client';
import type { 
  HistoryAnalysisResponse,
  AccuracyTrendResponse,
  HistoryPeriod 
} from '@/types/history.type';

export const getHistoryAnalysis = async (
  period: HistoryPeriod
): Promise<HistoryAnalysisResponse> => {
  const { data } = await apiClient.get('/history/analysis', {
    params: { period },
  });
  return data;
};

export const getAccuracyTrend = async (
  period: HistoryPeriod
): Promise<AccuracyTrendResponse> => {
  const { data } = await apiClient.get('/history/accuracy-trend', {
    params: { period },
  });
  return data;
};
```

```typescript
// src/services/hooks/history.ts
import { useSuspenseQuery, useSuspenseQueries } from '@tanstack/react-query';
import { 
  getHistoryAnalysis,
  getAccuracyTrend,
  getCalendarData,
  getSummaries 
} from '../api/history.api';
import type { HistoryPeriod, SummariesQueryParams } from '@/types/history.type';

export const useHistoryAnalysisQuery = (period: HistoryPeriod) => {
  return useSuspenseQuery({
    queryKey: ['historyAnalysis', period],
    queryFn: () => getHistoryAnalysis(period),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useAccuracyTrendQuery = (period: HistoryPeriod) => {
  return useSuspenseQuery({
    queryKey: ['accuracyTrend', period],
    queryFn: () => getAccuracyTrend(period),
    staleTime: 1000 * 60 * 5,
  });
};

// 여러 쿼리를 한 번에 실행
export const useHistoryStatsQueries = (period: HistoryPeriod) => {
  return useSuspenseQueries({
    queries: [
      {
        queryKey: ['historyAnalysis', period],
        queryFn: () => getHistoryAnalysis(period),
      },
      {
        queryKey: ['accuracyTrend', period],
        queryFn: () => getAccuracyTrend(period),
      },
    ],
  });
};
```

#### 1.2 Application Layer

```typescript
// src/hooks/history/useHistoryData.ts
import { useMemo } from 'react';
import { 
  useHistoryAnalysisQuery,
  useAccuracyTrendQuery 
} from '@/services/hooks/history';
import { formatChartDate } from '@/utils/formatChartDate';
import type { HistoryPeriod } from '@/types/history.type';

/**
 * History 페이지의 통계 데이터를 제공하는 훅
 * - 비즈니스 로직: 데이터 변환, 추세 계산
 * - Infrastructure Layer의 쿼리 훅들을 조합
 */
export const useHistoryStatsData = (period: HistoryPeriod) => {
  const { data: analysis } = useHistoryAnalysisQuery(period);
  const { data: trend } = useAccuracyTrendQuery(period);
  
  // 통계 데이터 가공
  const stats = useMemo(() => {
    const currentScore = analysis.averageScore;
    const previousScore = analysis.previousPeriodScore || currentScore;
    const scoreDiff = currentScore - previousScore;
    
    return {
      summaryCount: analysis.summaryCount,
      averageScore: currentScore,
      consecutiveDays: analysis.consecutiveDays,
      // 추가 비즈니스 로직
      scoreDiff,
      isImproving: scoreDiff > 0,
      grade: calculateGrade(currentScore),
      message: getMotivationMessage(currentScore, scoreDiff),
    };
  }, [analysis]);
  
  // 차트 데이터 변환
  const chartData = useMemo(() => 
    trend.dataPoints.map((point, index) => ({
      date: formatChartDate(point.date, period),
      accuracy: point.averageScore,
      count: point.count,
      // 툴팁용 추가 정보
      fullDate: point.date,
      isWeekend: isWeekend(point.date),
      rank: index + 1,
    }))
  , [trend, period]);
  
  // 추세 분석
  const trendAnalysis = useMemo(() => {
    const scores = trend.dataPoints.map(p => p.averageScore);
    return {
      average: calculateAverage(scores),
      highest: Math.max(...scores),
      lowest: Math.min(...scores),
      volatility: calculateVolatility(scores),
      direction: analyzeTrend(scores), // 'up' | 'down' | 'stable'
    };
  }, [trend]);
  
  return {
    stats,
    chartData,
    trendAnalysis,
  };
};

// 비즈니스 로직 함수들
function calculateGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  return 'D';
}

function getMotivationMessage(score: number, diff: number): string {
  if (diff > 10) return '🎉 대단해요! 크게 발전했어요!';
  if (diff > 0) return '👍 계속 발전하고 있어요!';
  if (diff === 0) return '💪 꾸준히 유지하고 있어요!';
  return '📚 조금만 더 힘내봐요!';
}

function calculateAverage(scores: number[]): number {
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function calculateVolatility(scores: number[]): number {
  const avg = calculateAverage(scores);
  const variance = scores.reduce((sum, score) => 
    sum + Math.pow(score - avg, 2), 0
  ) / scores.length;
  return Math.sqrt(variance);
}

function analyzeTrend(scores: number[]): 'up' | 'down' | 'stable' {
  if (scores.length < 2) return 'stable';
  
  const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
  const secondHalf = scores.slice(Math.floor(scores.length / 2));
  
  const firstAvg = calculateAverage(firstHalf);
  const secondAvg = calculateAverage(secondHalf);
  
  if (secondAvg > firstAvg + 5) return 'up';
  if (secondAvg < firstAvg - 5) return 'down';
  return 'stable';
}

function isWeekend(date: string): boolean {
  const day = new Date(date).getDay();
  return day === 0 || day === 6;
}
```

```typescript
// src/hooks/history/useCalendarData.ts
import { useMemo } from 'react';
import {
  useCalendarYearsQuery,
  useCalendarDataQuery,
} from '@/services/hooks/history';

/**
 * 캘린더(히트맵) 데이터를 제공하는 훅
 */
export const useCalendarData = (selectedYear: number) => {
  const { data: yearsData } = useCalendarYearsQuery();
  const { data: calendarData } = useCalendarDataQuery(selectedYear);
  
  // 히트맵 데이터 가공
  const heatmapData = useMemo(() => {
    const dataMap = new Map(
      calendarData.learningDays.map(day => [day.date, day.count])
    );
    
    // 해당 연도의 모든 날짜 생성
    const allDates = generateYearDates(selectedYear);
    
    return allDates.map(date => ({
      date,
      count: dataMap.get(date) || 0,
      level: getHeatmapLevel(dataMap.get(date) || 0),
      tooltip: formatTooltip(date, dataMap.get(date) || 0),
    }));
  }, [calendarData, selectedYear]);
  
  // 통계 계산
  const stats = useMemo(() => {
    const counts = calendarData.learningDays.map(d => d.count);
    const totalDays = calendarData.learningDays.length;
    const totalCount = counts.reduce((a, b) => a + b, 0);
    
    return {
      totalDays,
      totalCount,
      averagePerDay: totalDays > 0 ? totalCount / totalDays : 0,
      maxStreak: calculateMaxStreak(calendarData.learningDays),
      currentStreak: calculateCurrentStreak(calendarData.learningDays),
    };
  }, [calendarData]);
  
  return {
    years: yearsData.years,
    heatmapData,
    stats,
  };
};

function getHeatmapLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

function formatTooltip(date: string, count: number): string {
  const formatted = new Date(date).toLocaleDateString('ko-KR');
  return count > 0 
    ? `${formatted}: ${count}개 학습`
    : `${formatted}: 학습 없음`;
}

function generateYearDates(year: number): string[] {
  const dates: string[] = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }
  
  return dates;
}

function calculateMaxStreak(days: Array<{ date: string }>): number {
  if (days.length === 0) return 0;
  
  const sortedDays = [...days].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  let maxStreak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < sortedDays.length; i++) {
    const prevDate = new Date(sortedDays[i - 1].date);
    const currDate = new Date(sortedDays[i].date);
    const diffDays = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return maxStreak;
}

function calculateCurrentStreak(days: Array<{ date: string }>): number {
  if (days.length === 0) return 0;
  
  const sortedDays = [...days].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let checkDate = new Date(today);
  
  for (const day of sortedDays) {
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    
    if (dayDate.getTime() === checkDate.getTime()) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (dayDate.getTime() < checkDate.getTime()) {
      break;
    }
  }
  
  return streak;
}
```

```typescript
// src/hooks/history/useSummaryListData.ts
import { useMemo } from 'react';
import { useSummariesQuery } from '@/services/hooks/history';
import type { SummariesQueryParams } from '@/types/history.type';

/**
 * 요약 목록 데이터를 제공하는 훅
 */
export const useSummaryListData = (params: SummariesQueryParams) => {
  const { data: summariesData } = useSummariesQuery(params);
  
  // 요약 아이템 가공
  const items = useMemo(() => 
    summariesData.items.map(item => ({
      ...item,
      // 날짜 포맷팅
      formattedDate: formatRelativeDate(item.createdAt),
      // 점수 등급
      scoreGrade: getScoreGrade(item.score),
      // 하이라이트 (검색어 강조용)
      highlight: params.search,
      // 요약 미리보기 (길이 제한)
      preview: truncateText(item.summary, 100),
    }))
  , [summariesData, params.search]);
  
  // 페이지네이션 정보
  const pagination = useMemo(() => ({
    ...summariesData.pagination,
    hasMore: summariesData.pagination.currentPage < summariesData.pagination.totalPages,
    hasPrevious: summariesData.pagination.currentPage > 1,
  }), [summariesData.pagination]);
  
  // 통계
  const stats = useMemo(() => {
    const scores = items.map(item => item.score);
    return {
      count: items.length,
      averageScore: scores.length > 0 
        ? scores.reduce((a, b) => a + b, 0) / scores.length 
        : 0,
      highestScore: scores.length > 0 ? Math.max(...scores) : 0,
      lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
    };
  }, [items]);
  
  return {
    items,
    pagination,
    stats,
    isEmpty: items.length === 0,
  };
};

function formatRelativeDate(date: string): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffMs = now.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  
  return targetDate.toLocaleDateString('ko-KR');
}

function getScoreGrade(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
```

#### 1.3 Presentation Layer

```typescript
// src/pages/HistoryPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Header,
  SelectBox,
  StatisticCard,
  LineChart,
  Heatmap,
  SearchBar,
  Toggle,
  SummaryItem,
  Pagination,
  Button,
} from '@/components';
import { AsyncBoundary } from '@/components/boundaries';
import {
  SkeletonHistoryStats,
  SkeletonLineChart,
  SkeletonHeatmap,
  SkeletonSummaryList,
} from '@/components/skeletons';
import { ErrorFallback } from '@/components/errors';
import { BookOpen } from 'lucide-react';
import { useDebounce } from '@/hooks';
import type { HistoryPeriod } from '@/types/history.type';

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<HistoryPeriod>(7);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLatest, setIsLatest] = useState(true);
  
  const debouncedSearch = useDebounce(searchValue, 300);
  
  const dateOptions: { value: HistoryPeriod; label: string }[] = [
    { value: 7, label: '최근 7일' },
    { value: 30, label: '최근 30일' },
    { value: 'all', label: '전체 기간' },
  ];
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="flex flex-col items-center max-w-6xl mx-auto px-6 py-10">
        {/* 기간 선택 */}
        <div className="w-full flex justify-end mb-6">
          <SelectBox
            value={period}
            onChange={setPeriod}
            options={dateOptions}
          />
        </div>
        
        {/* 통계 섹션 */}
        <AsyncBoundary
          loadingFallback={<SkeletonHistoryStats />}
          errorFallback={ErrorFallback}
        >
          <HistoryStatsSection period={period} />
        </AsyncBoundary>
        
        {/* 차트 섹션 */}
        <AsyncBoundary
          loadingFallback={<SkeletonLineChart />}
          errorFallback={ErrorFallback}
        >
          <AccuracyChartSection period={period} />
        </AsyncBoundary>
        
        {/* 캘린더 섹션 */}
        <AsyncBoundary
          loadingFallback={<SkeletonHeatmap />}
          errorFallback={ErrorFallback}
        >
          <CalendarSection
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </AsyncBoundary>
        
        {/* 학습 기록 섹션 */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-app-gray-800">학습 기록</h2>
            <Toggle
              leftLabel="최신순"
              rightLabel="오래된순"
              onLeftClick={() => {
                setIsLatest(true);
                setCurrentPage(1);
              }}
              onRightClick={() => {
                setIsLatest(false);
                setCurrentPage(1);
              }}
            />
          </div>
          
          <SearchBar
            placeholder="원문 혹은 작성한 요약으로 검색"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setCurrentPage(1);
            }}
          />
          
          <AsyncBoundary
            loadingFallback={<SkeletonSummaryList />}
            errorFallback={ErrorFallback}
          >
            <SummaryListSection
              page={currentPage}
              isLatest={isLatest}
              search={debouncedSearch}
              onPageChange={setCurrentPage}
              onItemClick={(id) => navigate(`/analysis/${id}`)}
              onEmpty={() => navigate('/input')}
            />
          </AsyncBoundary>
        </div>
      </main>
    </div>
  );
};

// 각 섹션을 별도 컴포넌트로 분리
// 이렇게 하면 각 섹션이 독립적으로 로딩/에러 처리됨

const HistoryStatsSection = ({ period }: { period: HistoryPeriod }) => {
  const { stats } = useHistoryStatsData(period);
  
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      <StatisticCard
        type="weekCount"
        size="lg"
        value={`${stats.summaryCount}개`}
      />
      <StatisticCard
        type="accuracy"
        size="lg"
        value={`${stats.averageScore}%`}
        subtitle={stats.message}
      />
      <StatisticCard
        type="streak"
        size="lg"
        value={`${stats.consecutiveDays}일`}
      />
    </div>
  );
};

const AccuracyChartSection = ({ period }: { period: HistoryPeriod }) => {
  const { chartData, trendAnalysis } = useHistoryStatsData(period);
  
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-app-gray-200 mb-12 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-app-gray-800">정확도 추이</h2>
        <span className="text-sm text-app-gray-600">
          평균: {trendAnalysis.average.toFixed(1)}%
        </span>
      </div>
      <div className="h-80">
        <LineChart chartData={chartData} />
      </div>
    </div>
  );
};

const CalendarSection = ({
  selectedYear,
  onYearChange,
}: {
  selectedYear: number;
  onYearChange: (year: number) => void;
}) => {
  const { years, heatmapData, stats } = useCalendarData(selectedYear);
  
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-app-gray-200 mb-12 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-app-gray-800">학습 일정</h2>
        <div className="text-sm text-app-gray-600">
          {stats.totalDays}일 학습 · 현재 {stats.currentStreak}일 연속
        </div>
      </div>
      <Heatmap
        years={years}
        data={heatmapData}
        selectedYear={selectedYear}
        onYearChange={onYearChange}
      />
    </div>
  );
};

const SummaryListSection = ({
  page,
  isLatest,
  search,
  onPageChange,
  onItemClick,
  onEmpty,
}: {
  page: number;
  isLatest: boolean;
  search?: string;
  onPageChange: (page: number) => void;
  onItemClick: (id: number) => void;
  onEmpty: () => void;
}) => {
  const { items, pagination, isEmpty } = useSummaryListData({
    page,
    limit: 5,
    isLatest,
    search: search || undefined,
  });
  
  if (isEmpty) {
    return (
      <div className="text-center py-16 bg-app-gray-50 rounded-xl border border-dashed border-app-gray-200">
        <BookOpen className="w-12 h-12 text-app-gray-400 mx-auto mb-4" />
        <p className="text-app-gray-500 mb-4">
          {search 
            ? '검색 결과가 없습니다'
            : '아직 읽은 글이 없습니다'
          }
        </p>
        {!search && (
          <Button
            onClick={onEmpty}
            variant="outline"
            className="border-app-blue text-app-blue hover:bg-app-blue-light"
          >
            첫 글 시작하기
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <>
      <div className="space-y-4 mb-8">
        {items.map((summary) => (
          <SummaryItem
            key={summary.id}
            summary={summary}
            onClick={() => onItemClick(summary.id)}
          />
        ))}
      </div>
      
      <Pagination
        currentPage={page}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};
```

---

## 코드 구조 상세

### 디렉토리별 책임

```
src/
├── components/              # Presentation Layer
│   ├── boundaries/          # Error/Suspense 경계
│   │   ├── ErrorBoundary.tsx
│   │   ├── SuspenseBoundary.tsx
│   │   └── AsyncBoundary.tsx
│   ├── skeletons/           # 로딩 UI
│   ├── errors/              # 에러 UI
│   └── [ui-components]/     # 재사용 UI
│
├── pages/                   # Presentation Layer
│   └── HistoryPage.tsx      # 페이지 조합 및 라우팅
│
├── hooks/                   # Application Layer
│   ├── history/
│   │   ├── useHistoryStatsData.ts    # 비즈니스 로직
│   │   ├── useCalendarData.ts
│   │   └── useSummaryListData.ts
│   ├── main/
│   └── summary/
│
├── services/                # Infrastructure Layer
│   ├── api/                 # HTTP 통신
│   │   ├── client.ts        # Axios 설정
│   │   ├── history.api.ts
│   │   └── main.api.ts
│   └── hooks/               # React Query
│       ├── history.ts       # Query hooks
│       └── main.ts
│
├── types/                   # 공통 타입
│   ├── history.type.ts
│   └── main.type.ts
│
└── utils/                   # 공통 유틸
    ├── errorHandling.ts
    ├── formatChartDate.ts
    └── cn.ts
```

### 파일 명명 규칙

#### API 파일
```
{domain}.api.ts
예: history.api.ts, user.api.ts
```

#### Query Hooks 파일
```
{domain}.ts (services/hooks/)
예: services/hooks/history.ts
```

#### Application Hooks 파일
```
use{Domain}{Purpose}Data.ts
예: useHistoryStatsData.ts, useUserProfileData.ts
```

#### 컴포넌트 파일
```
{ComponentName}.tsx
예: HistoryPage.tsx, StatisticCard.tsx
```

---

## 테스트 전략

### Infrastructure Layer 테스트

```typescript
// services/api/history.api.test.ts
describe('History API', () => {
  test('getHistoryAnalysis fetches data correctly', async () => {
    // API 호출 테스트
    const data = await getHistoryAnalysis(7);
    expect(data).toHaveProperty('summaryCount');
    expect(data).toHaveProperty('averageScore');
  });
  
  test('handles API errors properly', async () => {
    // 에러 처리 테스트
    server.use(
      rest.get('/history/analysis', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    await expect(getHistoryAnalysis(7)).rejects.toThrow();
  });
});
```

### Application Layer 테스트

```typescript
// hooks/history/useHistoryStatsData.test.ts
import { renderHook } from '@testing-library/react';
import { useHistoryStatsData } from './useHistoryStatsData';

describe('useHistoryStatsData', () => {
  test('transforms data correctly', () => {
    const { result } = renderHook(() => useHistoryStatsData(7), {
      wrapper: QueryClientProvider,
    });
    
    // 비즈니스 로직 검증
    expect(result.current.stats).toHaveProperty('grade');
    expect(result.current.stats).toHaveProperty('message');
    expect(result.current.chartData).toBeInstanceOf(Array);
  });
  
  test('calculates trend correctly', () => {
    // 추세 계산 로직 검증
  });
});
```

### Presentation Layer 테스트

```typescript
// pages/HistoryPage.test.tsx
describe('HistoryPage', () => {
  test('renders all sections', async () => {
    render(<HistoryPage />);
    
    // UI 렌더링 검증
    expect(screen.getByText('학습 통계')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/개$/)).toBeInTheDocument();
    });
  });
  
  test('handles errors gracefully', async () => {
    // 에러 상황 테스트
    server.use(
      rest.get('/history/analysis', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    render(<HistoryPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/문제가 생겼어요/)).toBeInTheDocument();
    });
  });
});
```

---

## 변경 이력

- 2024-11-14: 초안 작성

