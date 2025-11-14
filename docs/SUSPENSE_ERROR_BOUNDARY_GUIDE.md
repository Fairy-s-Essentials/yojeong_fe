# Suspense & Error Boundary 도입 가이드

## 📋 목차

1. [개요](#개요)
2. [아키텍처 설계](#아키텍처-설계)
3. [구현 단계](#구현-단계)
4. [스켈레톤 UI 디자인](#스켈레톤-ui-디자인)
5. [Error UI 디자인](#error-ui-디자인)
6. [마이그레이션 가이드](#마이그레이션-가이드)
7. [테스트 전략](#테스트-전략)

---

## 개요

### 목표

- React Suspense를 활용한 선언적인 로딩 상태 관리
- Error Boundary를 통한 체계적인 에러 처리
- 일관된 사용자 경험을 제공하는 스켈레톤 UI
- 명확한 피드백을 제공하는 Error UI

### 현재 상태

- ✅ TanStack Query v5 설치 완료
- ✅ 기본 Query Hooks 구현 완료 (`services/hooks/`)
- ❌ Suspense 미적용
- ❌ Error Boundary 미적용
- ❌ 통일된 스켈레톤 UI 부재
- ❌ 통일된 Error UI 부재

### 기대 효과

1. **개발자 경험 개선**
   - 로딩/에러 상태 관리 코드 감소
   - 선언적이고 직관적인 코드
   - 관심사의 분리 (비즈니스 로직 vs UI 상태)

2. **사용자 경험 개선**
   - 일관된 로딩 인디케이터
   - 명확한 에러 피드백
   - 부드러운 화면 전환

3. **유지보수성 향상**
   - 중앙 집중식 에러 처리
   - 재사용 가능한 컴포넌트
   - 테스트 용이성 증가

---

## 아키텍처 설계

### 클린 아키텍처 레이어

```
┌─────────────────────────────────────────────────┐
│          Presentation Layer (UI)                │
│  ┌───────────────────────────────────────────┐  │
│  │ Pages (HistoryPage, MainPage, etc.)      │  │
│  │                                           │  │
│  │ ┌───────────────────────────────────┐    │  │
│  │ │ Boundary Components               │    │  │
│  │ │  - ErrorBoundary                  │    │  │
│  │ │  - SuspenseBoundary               │    │  │
│  │ └───────────────────────────────────┘    │  │
│  │                                           │  │
│  │ ┌───────────────────────────────────┐    │  │
│  │ │ UI Components                     │    │  │
│  │ │  - SkeletonCard, SkeletonChart    │    │  │
│  │ │  - ErrorFallback, ErrorRetry      │    │  │
│  │ └───────────────────────────────────┘    │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                       ↕
┌─────────────────────────────────────────────────┐
│          Application Layer                      │
│  ┌───────────────────────────────────────────┐  │
│  │ Hooks (useHistoryData, useMainData)      │  │
│  │  - 비즈니스 로직                          │  │
│  │  - 데이터 변환 및 가공                    │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                       ↕
┌─────────────────────────────────────────────────┐
│          Infrastructure Layer                   │
│  ┌───────────────────────────────────────────┐  │
│  │ React Query Hooks (services/hooks/)      │  │
│  │  - Query Configuration                    │  │
│  │  - Cache Management                       │  │
│  │                                           │  │
│  │ API Layer (services/api/)                │  │
│  │  - HTTP 통신                              │  │
│  │  - 데이터 직렬화/역직렬화                 │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### 디렉토리 구조

```
src/
├── components/
│   ├── boundaries/                  # 새로 추가
│   │   ├── ErrorBoundary.tsx       # 에러 처리
│   │   ├── SuspenseBoundary.tsx    # Suspense 래퍼
│   │   └── AsyncBoundary.tsx       # 통합 바운더리
│   ├── skeletons/                   # 새로 추가
│   │   ├── SkeletonCard.tsx
│   │   ├── SkeletonChart.tsx
│   │   ├── SkeletonTable.tsx
│   │   ├── SkeletonHeatmap.tsx
│   │   └── SkeletonBase.tsx        # 기본 스켈레톤 유틸
│   ├── errors/                      # 새로 추가
│   │   ├── ErrorFallback.tsx       # 일반 에러 UI
│   │   ├── NetworkError.tsx        # 네트워크 에러
│   │   ├── NotFoundError.tsx       # 404 에러
│   │   └── UnauthorizedError.tsx   # 인증 에러
│   └── [기존 컴포넌트들]
├── services/
│   └── hooks/
│       ├── history.ts              # 수정: suspense 옵션 추가
│       ├── main.ts                 # 수정: suspense 옵션 추가
│       └── summary.ts              # 수정: suspense 옵션 추가
├── pages/
│   ├── HistoryPage.tsx             # 수정: Boundary 적용
│   ├── MainPage.tsx                # 수정: Boundary 적용
│   └── [기타 페이지들]
└── utils/
    └── errorHandling.ts            # 새로 추가: 에러 분류 유틸
```

### 에러 분류 전략

```typescript
// utils/errorHandling.ts
export enum ErrorType {
  NETWORK = 'NETWORK',           // 네트워크 연결 문제
  UNAUTHORIZED = 'UNAUTHORIZED', // 인증 필요
  FORBIDDEN = 'FORBIDDEN',       // 권한 없음
  NOT_FOUND = 'NOT_FOUND',       // 리소스 없음
  SERVER = 'SERVER',             // 서버 에러 (5xx)
  VALIDATION = 'VALIDATION',     // 입력값 검증 실패
  UNKNOWN = 'UNKNOWN',           // 알 수 없는 에러
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: Error;
  statusCode?: number;
  retryable: boolean; // 재시도 가능 여부
}
```

---

## 구현 단계

### Phase 1: 기반 구조 구축 (Day 1-2)

#### 1.1 Error Boundary 구현

**목표**: 컴포넌트 트리의 에러를 포착하고 대체 UI 제공

**파일**: `src/components/boundaries/ErrorBoundary.tsx`

**주요 기능**:
- 에러 로깅
- 에러 타입별 분기 처리
- 리셋 기능 제공
- 에러 전파 방지

**구현 포인트**:
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
}

// 에러 타입에 따른 fallback 선택
// 리셋 시 쿼리 캐시 무효화
// 로깅 및 모니터링 연동 준비
```

#### 1.2 Suspense Boundary 구현

**목표**: 비동기 로딩 상태를 선언적으로 처리

**파일**: `src/components/boundaries/SuspenseBoundary.tsx`

**주요 기능**:
- 로딩 fallback 제공
- 최소 표시 시간 설정 (깜빡임 방지)
- 타임아웃 처리

#### 1.3 AsyncBoundary (통합 바운더리)

**목표**: ErrorBoundary + Suspense를 하나로 통합

**파일**: `src/components/boundaries/AsyncBoundary.tsx`

```typescript
interface AsyncBoundaryProps {
  children: React.ReactNode;
  loadingFallback: React.ReactNode;
  errorFallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error) => void;
  onReset?: () => void;
}

// 사용 예시
<AsyncBoundary
  loadingFallback={<SkeletonCard />}
  errorFallback={ErrorFallback}
>
  <DataComponent />
</AsyncBoundary>
```

#### 1.4 에러 유틸리티 구현

**파일**: `src/utils/errorHandling.ts`

```typescript
// Axios 에러를 AppError로 변환
export function classifyError(error: unknown): AppError;

// 재시도 가능 여부 판단
export function isRetryableError(error: AppError): boolean;

// 에러 메시지 한글화
export function getErrorMessage(error: AppError): string;
```

---

### Phase 2: React Query 설정 (Day 2-3)

#### 2.1 QueryClient 설정 업데이트

**파일**: `src/main.tsx` (또는 별도 설정 파일)

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Suspense 활성화
      suspense: true, // 또는 개별 쿼리에서 설정
      
      // 에러 처리
      useErrorBoundary: true, // 또는 throwOnError: true (v5)
      
      // 재시도 전략
      retry: (failureCount, error) => {
        const appError = classifyError(error);
        if (!appError.retryable) return false;
        return failureCount < 3;
      },
      
      // 캐시 시간
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 30,   // 30분 (구 cacheTime)
      
      // 리페칭 전략
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      useErrorBoundary: false, // Mutation은 일반적으로 직접 처리
      retry: 1,
    },
  },
});
```

#### 2.2 Query Hooks 업데이트

**파일**: `src/services/hooks/history.ts`

```typescript
// Before
export const useHistoryAnalysisQuery = (period: HistoryPeriod = 7) => {
  return useQuery({
    queryKey: ['historyAnalysis', period],
    queryFn: () => getHistoryAnalysis(period),
  });
};

// After - Suspense 적용
export const useHistoryAnalysisQuery = (period: HistoryPeriod = 7) => {
  return useSuspenseQuery({
    queryKey: ['historyAnalysis', period],
    queryFn: () => getHistoryAnalysis(period),
    // 에러를 Error Boundary로 전파
    throwOnError: true,
  });
};

// 또는 조건부 Suspense
export const useHistoryAnalysisQuery = (
  period: HistoryPeriod = 7,
  options?: { suspense?: boolean }
) => {
  const useFn = options?.suspense ? useSuspenseQuery : useQuery;
  
  return useFn({
    queryKey: ['historyAnalysis', period],
    queryFn: () => getHistoryAnalysis(period),
  });
};
```

**변경 대상 파일들**:
- `src/services/hooks/history.ts`
- `src/services/hooks/main.ts`
- `src/services/hooks/summary.ts`

---

### Phase 3: 스켈레톤 UI 구현 (Day 3-4)

#### 3.1 기본 스켈레톤 컴포넌트

**파일**: `src/components/skeletons/SkeletonBase.tsx`

```typescript
// 재사용 가능한 기본 스켈레톤
export const Skeleton = ({
  width,
  height,
  className,
  variant = 'rounded',
}: SkeletonProps) => {
  // 펄스 애니메이션
  // 다양한 variant (rounded, circular, rectangular)
};
```

#### 3.2 페이지별 스켈레톤

**HistoryPage용 스켈레톤**:

```typescript
// src/components/skeletons/SkeletonHistoryStats.tsx
export const SkeletonHistoryStats = () => (
  <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </div>
);

// src/components/skeletons/SkeletonLineChart.tsx
export const SkeletonLineChart = () => (
  <div className="bg-white rounded-xl p-8 shadow-sm border">
    <Skeleton width="120px" height="24px" className="mb-6" />
    <div className="h-80 flex items-end gap-2">
      {/* 차트 형태의 스켈레톤 */}
    </div>
  </div>
);

// src/components/skeletons/SkeletonSummaryList.tsx
export const SkeletonSummaryList = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonSummaryItem key={i} />
    ))}
  </div>
);
```

#### 3.3 스켈레톤 디자인 원칙

1. **실제 컴포넌트와 유사한 레이아웃**
   - 실제 데이터 로드 후 레이아웃 시프트 최소화

2. **적절한 애니메이션**
   - 펄스 또는 웨이브 애니메이션
   - 과하지 않은 속도 (1.5-2초 주기)

3. **의미 있는 형태**
   - 텍스트 → 직사각형
   - 이미지 → 정사각형/원형
   - 차트 → 대략적인 형태 표현

---

### Phase 4: Error UI 구현 (Day 4-5)

#### 4.1 기본 Error Fallback

**파일**: `src/components/errors/ErrorFallback.tsx`

```typescript
export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) => {
  const appError = classifyError(error);
  
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* 에러 아이콘 */}
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      
      {/* 에러 메시지 */}
      <h3 className="text-xl font-semibold mb-2">
        {getErrorTitle(appError.type)}
      </h3>
      <p className="text-gray-600 mb-6">
        {getErrorMessage(appError)}
      </p>
      
      {/* 액션 버튼 */}
      {appError.retryable && (
        <Button onClick={resetErrorBoundary}>
          다시 시도
        </Button>
      )}
    </div>
  );
};
```

#### 4.2 특화된 Error 컴포넌트

```typescript
// src/components/errors/NetworkError.tsx
// 네트워크 연결 문제 전용 UI

// src/components/errors/UnauthorizedError.tsx
// 로그인 필요 시 UI + 로그인 버튼

// src/components/errors/NotFoundError.tsx
// 404 상황 전용 UI
```

#### 4.3 Error UI 디자인 원칙

1. **명확한 피드백**
   - 무엇이 문제인지 명확히 표시
   - 기술적 용어 지양

2. **액션 가능성**
   - 다시 시도 버튼
   - 홈으로 가기
   - 문의하기

3. **친근한 톤앤매너**
   - "오류가 발생했습니다" → "잠시 문제가 생겼어요"
   - 사과와 안내

---

### Phase 5: 페이지 마이그레이션 (Day 5-7)

#### 5.1 HistoryPage 마이그레이션

**Before**:
```typescript
export const HistoryPage = () => {
  const { data: historyAnalysis } = useHistoryAnalysisQuery(period);
  const { data: accuracyTrend } = useAccuracyTrendQuery(period);
  // ... 여러 쿼리들
  
  // 로딩/에러 체크 로직이 없음
  // data가 undefined일 수 있음
};
```

**After**:
```typescript
// 데이터 로직 분리
const HistoryDataSection = ({ period }: { period: HistoryPeriod }) => {
  const { data: historyAnalysis } = useHistoryAnalysisQuery(period);
  const { data: accuracyTrend } = useAccuracyTrendQuery(period);
  
  // Suspense에 의해 data는 항상 정의됨
  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        <StatisticCard value={`${historyAnalysis.summaryCount}개`} />
        <StatisticCard value={`${historyAnalysis.averageScore}%`} />
        <StatisticCard value={`${historyAnalysis.consecutiveDays}일`} />
      </div>
      
      <LineChart data={accuracyTrend.dataPoints} />
    </>
  );
};

// 페이지 컴포넌트
export const HistoryPage = () => {
  const [period, setPeriod] = useState<HistoryPeriod>(7);
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-10">
        <SelectBox value={period} onChange={setPeriod} />
        
        {/* 통계 섹션 */}
        <AsyncBoundary
          loadingFallback={<SkeletonHistoryStats />}
          errorFallback={ErrorFallback}
        >
          <HistoryDataSection period={period} />
        </AsyncBoundary>
        
        {/* 캘린더 섹션 */}
        <AsyncBoundary
          loadingFallback={<SkeletonHeatmap />}
          errorFallback={ErrorFallback}
        >
          <CalendarSection />
        </AsyncBoundary>
        
        {/* 학습 기록 섹션 */}
        <AsyncBoundary
          loadingFallback={<SkeletonSummaryList />}
          errorFallback={ErrorFallback}
        >
          <SummaryListSection />
        </AsyncBoundary>
      </main>
    </div>
  );
};
```

#### 5.2 마이그레이션 체크리스트

각 페이지별로:

- [ ] 데이터 로직을 별도 컴포넌트로 분리
- [ ] AsyncBoundary로 감싸기
- [ ] 적절한 스켈레톤 UI 선택/구현
- [ ] 에러 타입별 적절한 Fallback 선택
- [ ] undefined 체크 코드 제거
- [ ] 로딩 상태 관리 코드 제거

**마이그레이션 대상**:
1. HistoryPage
2. MainPage
3. AnalysisPage
4. OriginalInputPage (부분적)
5. SummaryInputPage (부분적)

---

### Phase 6: 고급 패턴 적용 (Day 7-8)

#### 6.1 병렬 쿼리 최적화

```typescript
// 여러 쿼리를 동시에 실행하되, 하나의 Suspense로 처리
const HistoryDataSection = ({ period }: { period: HistoryPeriod }) => {
  const queries = useSuspenseQueries({
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
  
  const [historyAnalysis, accuracyTrend] = queries.map(q => q.data);
  
  // 모든 데이터가 로드되면 한 번에 렌더링
};
```

#### 6.2 Waterfall 방지

```typescript
// Bad: 순차적 로딩 (Waterfall)
<AsyncBoundary>
  <ComponentA /> {/* 먼저 로드 */}
  <AsyncBoundary>
    <ComponentB /> {/* A 로드 후 시작 */}
  </AsyncBoundary>
</AsyncBoundary>

// Good: 병렬 로딩
<AsyncBoundary>
  <ComponentA /> {/* 동시 시작 */}
  <ComponentB /> {/* 동시 시작 */}
</AsyncBoundary>
```

#### 6.3 부분적 Suspense

```typescript
// 중요한 데이터는 먼저 보여주고, 부가 데이터는 나중에
<div>
  {/* 즉시 표시 */}
  <Header />
  
  {/* 중요 데이터 - 높은 우선순위 */}
  <AsyncBoundary loadingFallback={<SkeletonStats />}>
    <MainStats />
  </AsyncBoundary>
  
  {/* 부가 데이터 - 낮은 우선순위 */}
  <AsyncBoundary loadingFallback={<SkeletonChart />}>
    <DetailedChart />
  </AsyncBoundary>
</div>
```

#### 6.4 Prefetching 전략

```typescript
const HistoryPage = () => {
  const queryClient = useQueryClient();
  
  // 다음 페이지 미리 로드
  const prefetchNextPage = (nextPage: number) => {
    queryClient.prefetchQuery({
      queryKey: ['summaries', { page: nextPage }],
      queryFn: () => getSummaries({ page: nextPage }),
    });
  };
  
  // 사용자가 페이지네이션에 호버하면 prefetch
};
```

---

## 스켈레톤 UI 디자인

### 디자인 시스템

#### 색상
```css
--skeleton-base: #f3f4f6;  /* gray-100 */
--skeleton-shine: #e5e7eb; /* gray-200 */
```

#### 애니메이션
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}
```

### 컴포넌트별 스켈레톤

#### 1. StatisticCard
```
┌─────────────────────┐
│ ▄▄▄▄▄▄▄ (아이콘)    │
│                     │
│ ▄▄▄▄▄▄▄▄▄ (값)     │
│ ▄▄▄▄▄▄ (라벨)      │
└─────────────────────┘
```

#### 2. LineChart
```
┌─────────────────────┐
│ ▄▄▄▄▄ (제목)       │
│                     │
│     ╱╲  ╱╲         │
│   ╱    ╲           │
│ ╱        ╲         │
└─────────────────────┘
```

#### 3. SummaryItem
```
┌─────────────────────────────┐
│ ▄▄▄▄▄▄▄▄▄▄▄▄▄ (제목)        │
│ ▄▄▄▄▄▄▄▄▄ (날짜)           │
│ ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ (내용)      │
│ ▄▄▄▄▄▄▄▄ (점수)            │
└─────────────────────────────┘
```

---

## Error UI 디자인

### 에러 타입별 UI

#### 1. NetworkError
```
      [Wi-Fi 아이콘]
   
   네트워크 연결을 확인해주세요
   인터넷 연결이 불안정합니다.
   
   [다시 시도] [오프라인 모드]
```

#### 2. UnauthorizedError
```
      [자물쇠 아이콘]
   
   로그인이 필요합니다
   이 기능을 사용하려면 로그인해주세요.
   
   [로그인하기] [돌아가기]
```

#### 3. NotFoundError
```
      [404 아이콘]
   
   페이지를 찾을 수 없습니다
   요청하신 페이지가 존재하지 않습니다.
   
   [홈으로 가기] [이전 페이지]
```

#### 4. ServerError
```
      [서버 아이콘]
   
   서버에 문제가 생겼어요
   잠시 후 다시 시도해주세요.
   
   [다시 시도] [문의하기]
```

### 에러 메시지 가이드

#### Good ✅
- "네트워크 연결을 확인해주세요"
- "잠시 후 다시 시도해주세요"
- "데이터를 불러올 수 없습니다"

#### Bad ❌
- "500 Internal Server Error"
- "Network request failed"
- "Unexpected error occurred"

---

## 마이그레이션 가이드

### 단계별 마이그레이션

#### Step 1: 준비
1. 모든 Boundary 컴포넌트 구현
2. 모든 Skeleton 컴포넌트 구현
3. 모든 Error 컴포넌트 구현
4. 유틸리티 함수 구현

#### Step 2: 테스트 환경 구축
1. 개발 환경에서 에러 시뮬레이션 도구
2. 네트워크 throttling 테스트
3. 다양한 에러 케이스 재현

#### Step 3: 점진적 마이그레이션
1. **Week 1**: MainPage
   - 가장 간단한 페이지로 시작
   - 패턴 확립
   
2. **Week 2**: HistoryPage
   - 복잡한 페이지 마이그레이션
   - 여러 섹션별 Boundary 적용
   
3. **Week 3**: 나머지 페이지
   - AnalysisPage
   - Input 페이지들

#### Step 4: 검증 및 최적화
1. 성능 측정
2. 사용자 피드백 수집
3. 필요시 조정

### 마이그레이션 체크리스트

페이지별로 다음 항목들을 확인:

- [ ] **데이터 컴포넌트 분리**
  - 데이터를 사용하는 부분을 별도 컴포넌트로
  - Props를 통한 명확한 의존성
  
- [ ] **AsyncBoundary 적용**
  - 적절한 단위로 Boundary 설정
  - 로딩/에러 Fallback 지정
  
- [ ] **스켈레톤 UI 구현**
  - 실제 레이아웃과 유사하게
  - 애니메이션 적용
  
- [ ] **에러 핸들링**
  - 각 에러 타입별 적절한 UI
  - 재시도 로직 구현
  
- [ ] **불필요한 코드 제거**
  - `if (!data) return ...` 제거
  - 로딩 state 관리 코드 제거
  - undefined 체크 코드 제거
  
- [ ] **타입 안정성**
  - data가 항상 정의됨을 타입으로 보장
  - Optional chaining 제거

---

## 테스트 전략

### 1. 스켈레톤 테스트

```typescript
// 로딩 상태 테스트
test('shows skeleton while loading', async () => {
  render(
    <AsyncBoundary loadingFallback={<SkeletonCard />}>
      <DataComponent />
    </AsyncBoundary>
  );
  
  expect(screen.getByTestId('skeleton-card')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.queryByTestId('skeleton-card')).not.toBeInTheDocument();
  });
});
```

### 2. 에러 바운더리 테스트

```typescript
// 에러 핸들링 테스트
test('shows error fallback on error', async () => {
  server.use(
    rest.get('/api/history/analysis', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  
  render(
    <AsyncBoundary errorFallback={ErrorFallback}>
      <DataComponent />
    </AsyncBoundary>
  );
  
  await waitFor(() => {
    expect(screen.getByText(/문제가 생겼어요/)).toBeInTheDocument();
  });
});

// 재시도 테스트
test('retries on button click', async () => {
  // ... error 발생
  
  const retryButton = screen.getByText('다시 시도');
  await userEvent.click(retryButton);
  
  // 재시도 후 성공
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

### 3. E2E 테스트

```typescript
// Playwright 또는 Cypress
test('loading and error states work correctly', async () => {
  // 네트워크를 느리게 설정
  await page.route('**/api/**', route => {
    setTimeout(() => route.continue(), 2000);
  });
  
  await page.goto('/history');
  
  // 스켈레톤 확인
  await expect(page.locator('[data-testid="skeleton"]')).toBeVisible();
  
  // 데이터 로드 후 스켈레톤 사라짐
  await expect(page.locator('[data-testid="skeleton"]')).not.toBeVisible();
  await expect(page.locator('[data-testid="stats"]')).toBeVisible();
});
```

### 4. 성능 테스트

```typescript
// Lighthouse CI 또는 수동 측정
- LCP (Largest Contentful Paint): < 2.5s
- CLS (Cumulative Layout Shift): < 0.1
- FID (First Input Delay): < 100ms

// 스켈레톤 UI가 CLS를 개선하는지 확인
```

---

## 모범 사례 및 주의사항

### ✅ Do's

1. **작은 단위로 Boundary 설정**
   ```typescript
   // Good: 섹션별로 독립적인 에러 처리
   <AsyncBoundary><StatsSection /></AsyncBoundary>
   <AsyncBoundary><ChartSection /></AsyncBoundary>
   ```

2. **의미 있는 스켈레톤**
   - 실제 컨텐츠와 비슷한 모양
   - 적절한 개수의 요소 표시

3. **명확한 에러 메시지**
   - 사용자 친화적인 언어
   - 해결 방법 제시

4. **재시도 로직**
   - 일시적 오류는 자동 재시도
   - 재시도 가능 여부 명시

### ❌ Don'ts

1. **전체 페이지를 하나의 Boundary로**
   ```typescript
   // Bad: 한 부분의 에러가 전체 페이지를 막음
   <AsyncBoundary>
     <EntirePage />
   </AsyncBoundary>
   ```

2. **과도한 스켈레톤**
   - 너무 많은 세부 요소
   - 너무 빠른 애니메이션

3. **기술적 에러 노출**
   - Stack trace 표시
   - HTTP 상태 코드만 표시

4. **무한 재시도**
   - 재시도 횟수 제한 없음
   - Exponential backoff 미적용

---

## 성능 최적화

### 1. Bundle 크기 최적화

```typescript
// 동적 import로 Error 컴포넌트 지연 로딩
const ErrorFallback = lazy(() => import('./errors/ErrorFallback'));
```

### 2. 메모이제이션

```typescript
// 스켈레톤은 props가 없으면 메모이제이션
export const SkeletonCard = memo(() => {
  // ...
});
```

### 3. CSS 최적화

```css
/* GPU 가속 활용 */
.skeleton {
  transform: translateZ(0);
  will-change: opacity;
}
```

---

## 롤백 플랜

만약 문제가 발생하면:

1. **즉시 롤백**
   - Feature flag로 이전 버전으로 전환
   - `useSuspenseQuery` → `useQuery`로 되돌리기

2. **부분 롤백**
   - 문제가 있는 페이지만 롤백
   - 다른 페이지는 유지

3. **대체 방안**
   ```typescript
   // Suspense 없이 수동 처리
   const { data, isLoading, error } = useQuery(...);
   
   if (isLoading) return <Skeleton />;
   if (error) return <ErrorFallback />;
   return <Content data={data} />;
   ```

---

## 다음 단계

Phase 1-6 완료 후:

1. **모니터링 도입**
   - 에러 추적 (Sentry 등)
   - 성능 모니터링

2. **사용자 피드백**
   - 로딩 시간 만족도
   - 에러 메시지 명확성

3. **지속적 개선**
   - 스켈레톤 디자인 개선
   - 에러 메시지 업데이트
   - 성능 최적화

---

## 참고 자료

- [TanStack Query v5 - Suspense](https://tanstack.com/query/latest/docs/react/guides/suspense)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Skeleton Screen Best Practices](https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a)
- [Error Message Guidelines](https://material.io/design/communication/confirmation-acknowledgement.html)

---

## 변경 이력

- 2024-11-14: 초안 작성

