# Suspense & Error Boundary 구현 완료 요약

> 📅 구현 기간: 2025-01-14  
> 🎯 목표: Tanstack Query와 React를 이용한 Suspense 및 Error Boundary 도입  
> 🏗️ 아키텍처: Clean Architecture 기반 설계

---

## 📌 목차

1. [구현 개요](#구현-개요)
2. [Phase별 구현 내용](#phase별-구현-내용)
3. [적용된 페이지](#적용된-페이지)
4. [주요 개선 사항](#주요-개선-사항)
5. [최종 결과](#최종-결과)

---

## 구현 개요

### 핵심 목표
- ✅ 일관된 로딩 UI (스켈레톤)
- ✅ 통합된 에러 처리 (Error Boundary)
- ✅ 선언적 데이터 페칭 (useSuspenseQuery)
- ✅ Clean Architecture 적용

### 기술 스택
- **Tanstack Query v5** - useSuspenseQuery
- **React 18** - Suspense, Error Boundary
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구

---

## Phase별 구현 내용

### Phase 1: 기반 구조 구축 ✅

**에러 처리 유틸리티**
- `ErrorType` 정의 (NETWORK, UNAUTHORIZED, FORBIDDEN 등)
- `classifyError` - Axios 에러를 AppError로 변환
- `isRetryableError` - 재시도 가능 여부 판단
- `getErrorMessage/Title` - 사용자 친화적 메시지

<details>
<summary>코드 예시: errorHandling.ts</summary>

```typescript
export const ErrorType = {
  NETWORK: 'NETWORK',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER',
  VALIDATION: 'VALIDATION',
  UNKNOWN: 'UNKNOWN',
} as const;

export interface AppError {
  type: ErrorType;
  message: string;
  statusCode?: number;
  retryable: boolean;
  originalError?: unknown;
}

export function classifyError(error: unknown): AppError {
  // Axios 에러 분류 로직
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return {
        type: ErrorType.NETWORK,
        message: '네트워크 연결을 확인해주세요.',
        retryable: true,
        originalError: error,
      };
    }
    // HTTP 상태 코드별 분류...
  }
  // ...
}
```

</details>

**Boundary 컴포넌트**
- `ErrorBoundary` - 에러 캐치 및 폴백 UI
- `SuspenseBoundary` - Suspense 래퍼
- `AsyncBoundary` - ErrorBoundary + Suspense + QueryErrorResetBoundary 통합
- `DefaultErrorFallback` - 기본 에러 UI

<details>
<summary>코드 예시: AsyncBoundary.tsx</summary>

```typescript
export const AsyncBoundary = ({
  children,
  loadingFallback,
  errorFallback: ErrorFallback,
  resetKeys = [],
}: AsyncBoundaryProps) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallback={ErrorFallback}
          onReset={reset}
          resetKeys={resetKeys}
        >
          <Suspense fallback={loadingFallback}>
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
```

</details>

---

### Phase 2: React Query 설정 ✅

**QueryClient 설정**
- `throwOnError: (error) => ...` - 401은 로컬 처리, 나머지는 Error Boundary
- `retry` - 네트워크/서버 에러만 최대 3회 재시도 (지수 백오프)
- `staleTime: 5분` / `gcTime: 30분`
- Mutation은 `throwOnError: false` (로컬 처리)

<details>
<summary>코드 예시: main.tsx</summary>

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: (error) => {
        const appError = classifyError(error);
        if (appError.type === ErrorType.UNAUTHORIZED) {
          return false; // 401은 로그인 모달로 처리
        }
        return true; // 나머지는 Error Boundary
      },
      retry: (failureCount, error) => {
        const appError = classifyError(error);
        if (!isRetryableError(appError)) return false;
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => 
        Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    },
    mutations: {
      throwOnError: false,
    },
  },
});
```

</details>

---

### Phase 3: 스켈레톤 UI 구현 ✅

**설계 원칙**
- ✅ **고정 UI는 실제로 표시** (제목, 레이블, 버튼)
- ✅ **동적 데이터만 스켈레톤** (텍스트 내용, 숫자)
- ✅ **실제 컴포넌트와 동일한 레이아웃**

**구현된 스켈레톤**
- `SkeletonBase` - 기본 스켈레톤 (rounded, circular, rectangular)
- `SkeletonHistoryStats` - 통계 카드 (반응형 그리드)
- `SkeletonLineChart` - 라인 차트 (제목 고정 + 차트 스켈레톤)
- `SkeletonHeatmap` - 히트맵 (제목 고정 + 잔디 스켈레톤)
- `SkeletonSummaryList` - 요약 리스트 (유연한 count)
- `SkeletonAnalysisPage` - 분석 페이지 전체
- `SkeletonMainPage` - 메인 페이지 전체

<details>
<summary>예시: AnalysisPage 스켈레톤 - 정확도 영역</summary>

```typescript
// 정확도 점수는 0점 + "로딩중입니다..!" 표시
<div className="bg-linear-to-r from-app-blue to-app-purple rounded-2xl p-8 mb-12 text-white">
  <div className="relative z-10">
    <p className="text-sm opacity-80 mb-2">정확도 점수</p>
    <div className="flex items-baseline gap-2">
      <span className="text-7xl">0</span>
      <span className="text-3xl opacity-80">/100</span>
    </div>
    <div className="flex items-center gap-2 mt-4 opacity-90">
      <p>로딩중입니다..!</p>
    </div>
  </div>
  <div className="absolute top-6 right-6 text-5xl">🎯</div>
</div>
```

</details>

---

### Phase 4: Error UI 구현 ✅

**DefaultErrorFallback 컴포넌트**
- 에러 타입별 아이콘 및 메시지
- "다시 시도" 버튼 (재시도 가능한 에러만)
- "홈으로 가기" 버튼
- 개발 모드: 스택 트레이스 표시

**에러 타입별 UI**
- 🌐 **NETWORK** - WifiOff 아이콘
- 🔒 **UNAUTHORIZED/FORBIDDEN** - Lock 아이콘
- ⚠️ **기타** - AlertCircle 아이콘

<details>
<summary>코드 예시: DefaultErrorFallback.tsx</summary>

```typescript
export const DefaultErrorFallback = ({ 
  error, 
  appError, 
  resetErrorBoundary 
}: ErrorFallbackProps) => {
  const navigate = useNavigate();
  const icon = appError.type === ErrorType.NETWORK 
    ? WifiOff 
    : appError.type === ErrorType.UNAUTHORIZED 
    ? Lock 
    : AlertCircle;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <Icon className="w-16 h-16 text-app-red mb-4" />
      <h2 className="text-2xl font-bold mb-2">{getErrorTitle(appError)}</h2>
      <p className="text-app-gray-600 mb-6">{getErrorMessage(appError)}</p>
      
      <Button onClick={() => navigate('/')}>
        <Home className="w-4 h-4 mr-2" /> 홈으로 가기
      </Button>
      
      {isRetryableError(appError) && (
        <Button onClick={resetErrorBoundary} className="mt-2">
          <RefreshCw className="w-4 h-4 mr-2" /> 다시 시도
        </Button>
      )}
    </div>
  );
};
```

</details>

---

### Phase 5: Application Layer Hooks 구현 ✅

**Clean Architecture 적용**
```
Presentation Layer (UI Components)
    ↓
Application Layer (Custom Hooks) ← 여기!
    ↓
Infrastructure Layer (API/Query Hooks)
```

**구현된 Application Hooks**

**History 관련**
- `useHistoryStatsData` - 통계 + 차트 데이터 조합
- `useCalendarData` - 히트맵 데이터 + 연도 목록
- `useSummaryListData` - 요약 리스트 + 페이지네이션

<details>
<summary>예시: useHistoryStatsData.ts</summary>

```typescript
export const useHistoryStatsData = (period: HistoryPeriod) => {
  const { data: analysis } = useHistoryAnalysisQuery(period);
  const { data: trend } = useAccuracyTrendQuery(period);

  const stats = useMemo(() => ({
    summaryCount: analysis.weeklyCount,
    averageScore: analysis.averageScore,
    consecutiveDays: analysis.consecutiveDays,
    grade: calculateGrade(analysis.averageScore),
    motivationalMessage: getMotivationalMessage(analysis.averageScore),
  }), [analysis]);

  const chartData = useMemo(() => 
    trend.map(item => ({
      date: formatDate(item.date),
      score: item.averageScore,
    }))
  , [trend]);

  return { stats, chartData };
};
```

</details>

---

### Phase 6: 페이지 마이그레이션 ✅

#### 6.1 HistoryPage

**구조 변경**
```tsx
// Before
export const HistoryPage = () => {
  const { data, isLoading } = useQuery(...);
  if (isLoading) return <Loading />;
  return <div>...</div>;
};

// After
export const HistoryPage = () => (
  <div className="min-h-screen">
    <Header />
    <main>
      <AsyncBoundary 
        loadingFallback={<SkeletonHistoryPage />}
        errorFallback={ErrorFallback}
      >
        <HistoryContent />
      </AsyncBoundary>
    </main>
  </div>
);

const HistoryContent = () => {
  // Application Hooks 사용
  const { stats, chartData } = useHistoryStatsData(period);
  const { years, learningDays } = useCalendarData(selectedYear);
  const { items, pagination } = useSummaryListData({...});
  
  // data는 항상 정의됨 (useSuspenseQuery)
  return <div>...</div>;
};
```

**개선 효과**
- ✅ 워터폴 로딩 제거 (모든 쿼리 병렬 실행)
- ✅ Optional chaining 제거
- ✅ 비즈니스 로직 분리

---

#### 6.2 AnalysisPage

**주요 변경**
- `useQuery` → `useSuspenseQuery`
- 수동 로딩/에러 처리 제거
- `useLoading` context 제거
- 스켈레톤: 정확도는 "0점 + 로딩중", 나머지는 데이터 스켈레톤

<details>
<summary>구조 비교</summary>

```tsx
// Before
export const AnalysisPage = () => {
  const { data, isLoading, isError } = useGetDetailSummary(id);
  const { hideLoading } = useLoading();
  
  useEffect(() => {
    if (isError) {
      hideLoading();
      alert('에러 발생');
      navigate('/');
    }
  }, [isError]);
  
  if (isLoading || !data) return null;
  return <div>...</div>;
};

// After
export const AnalysisPage = () => (
  <div className="min-h-screen">
    <Header />
    <main>
      <AsyncBoundary 
        loadingFallback={<SkeletonAnalysisPage />}
        errorFallback={ErrorFallback}
      >
        <AnalysisContent summaryId={id} />
      </AsyncBoundary>
    </main>
  </div>
);

const AnalysisContent = ({ summaryId }: Props) => {
  const { data } = useGetDetailSummary(summaryId);
  // data 항상 정의됨, 에러는 ErrorBoundary가 처리
  return <div>...</div>;
};
```

</details>

---

#### 6.3 MainPage

**특별 처리: 인증 분기**
- 비로그인 사용자: 쿼리 실행 안 함, 빈 상태 표시
- 로그인 사용자: AsyncBoundary + 데이터 로딩

**인증 플래시 제거**
- `isLoading` 상태 활용
- 인증 확인 완료 전까지 main 렌더링 안 함

<details>
<summary>구조</summary>

```tsx
export const MainPage = () => {
  const { isLoggedIn, isLoading } = useAuth();

  return (
    <div className="min-h-screen">
      <Header isMainPage />
      {/* 인증 확인 완료 전까지 렌더링 안 함 */}
      {!isLoading && (
        <main>
          {isLoggedIn ? (
            <AsyncBoundary 
              loadingFallback={<SkeletonMainPage />}
              errorFallback={ErrorFallback}
            >
              <MainContent />
            </AsyncBoundary>
          ) : (
            <MainEmpty />
          )}
        </main>
      )}
    </div>
  );
};

const MainContent = () => {
  const { data: mainAnalysis } = useMainAnalysisQuery();
  const { data: mainRecentSummary } = useMainRecentSummaryQuery();
  // 로그인 사용자만 쿼리 실행
  return <div>...</div>;
};
```

</details>

**스켈레톤 최적화**
- 통계 카드: 0값으로 실제 UI 표시 (아이콘 + 레이블 + 0)
- 최근 기록: 스켈레톤 1개만 표시

---

## 주요 개선 사항

### 1. 히트맵 요일 정렬 수정

**문제점**
- 1월 1일이 수요일이어도 항상 일요일부터 시작
- 요일 정렬 부정확

**해결**
```typescript
// 1월 1일의 요일 계산
const firstDayOfYear = new Date(selectedYear, 0, 1).getDay();

// 앞 빈칸 렌더링
if (dataIndex < 0) {
  return <div className="w-3 h-3 bg-transparent" />;
}
```

---

### 2. 히트맵 가로 스크롤 처리

**문제점**
- 작은 화면에서 히트맵이 페이지 전체를 넘쳐 가로 스크롤 유발

**해결**
```tsx
// Heatmap.tsx
<div className="flex-1 overflow-x-auto">
  <div className="inline-flex gap-1 min-w-min">
    {/* 히트맵 그리드 */}
  </div>
</div>

// HistoryPage.tsx
<div className="... overflow-hidden">
  <Heatmap ... />
</div>
```

---

### 3. 스켈레톤 UI 철학 확립

**원칙**
- ✅ **고정 UI**: 실제로 표시 (제목, 레이블, 아이콘, 버튼)
- ✅ **데이터**: 스켈레톤 표시 (텍스트, 숫자, 리스트)
- ✅ **레이아웃 일치**: 실제 컴포넌트와 정확히 동일

**Before (나쁜 예)**
```tsx
// 제목까지 스켈레톤
<Skeleton height={28} width={120} />
```

**After (좋은 예)**
```tsx
// 제목은 실제로, 내용만 스켈레톤
<h2 className="text-app-gray-800">최근 기록</h2>
<SkeletonSummaryList count={1} />
```

---

### 4. 인증 플래시 완전 제거

**문제점**
- 새로고침 시 "로그인 버튼 → 프로필 아이콘" 깜빡임
- 메인 페이지 "빈 화면 → 비로그인 UI → 로그인 UI" 3단계 전환

**해결**

**Header 스켈레톤**
```tsx
// Header.tsx
{isLoading ? (
  <div className="w-10 h-10 rounded-full bg-app-gray-200 animate-pulse" />
) : isLoggedIn ? (
  <ProfileIcon user={user} />
) : (
  <LoginButton />
)}
```

**MainPage 인증 대기**
```tsx
{!isLoading && (
  <main>
    {/* 인증 확인 완료 후에만 렌더링 */}
  </main>
)}
```

---

### 5. 통계 카드 스켈레톤 개선

**문제점**
- 아이콘 + 레이블까지 스켈레톤으로 표시
- 레이아웃 shift 발생

**해결**
```tsx
// 스켈레톤에서도 실제 UI로 표시 (0값)
<StatisticCard type="weekCount" size="sm" value="0개" />
<StatisticCard type="accuracy" size="sm" value="0%" />
<StatisticCard type="streak" size="sm" value="0일" />

// 데이터 로드 후 숫자만 변경
// 0개 → 5개 (부드러운 전환)
```

---

## 최종 결과

### 📊 적용된 페이지

| 페이지 | AsyncBoundary | Suspense | 스켈레톤 | 에러 처리 | Application Hook |
|--------|---------------|----------|---------|-----------|------------------|
| ✅ HistoryPage | ✅ | ✅ | ✅ | ✅ | ✅ |
| ✅ AnalysisPage | ✅ | ✅ | ✅ | ✅ | ❌ (단일 쿼리) |
| ✅ MainPage | ✅ | ✅ | ✅ | ✅ | ❌ (조건부) |

---

### ✨ UX 개선 효과

**1. 로딩 경험**
- ✅ 일관된 스켈레톤 UI (모든 페이지 동일한 패턴)
- ✅ 고정 UI 먼저 표시 (사용자가 무엇을 보는지 명확)
- ✅ 깜빡임 제거 (인증 플래시, 레이아웃 shift)

**2. 에러 처리**
- ✅ 사용자 친화적 에러 메시지
- ✅ 재시도 가능한 에러: "다시 시도" 버튼
- ✅ 항상 "홈으로 가기" 옵션 제공

**3. 성능**
- ✅ 워터폴 로딩 제거 (병렬 쿼리)
- ✅ 자동 재시도 (네트워크/서버 에러)
- ✅ 캐싱 및 stale-while-revalidate

---

### 🎯 코드 품질 개선

**타입 안전성**
```typescript
// Before
const data = useQuery(...).data;  // data: Type | undefined
if (!data) return null;

// After
const { data } = useSuspenseQuery(...);  // data: Type (항상 정의됨)
// Optional chaining 불필요
```

**코드 간결화**
- 50줄 이상 감소 (로딩/에러 처리 제거)
- Optional chaining 제거
- if 조건문 제거

**관심사 분리**
- Presentation: UI만 담당
- Application: 비즈니스 로직
- Infrastructure: API 호출

---

### 🏗️ 아키텍처 개선

```
┌─────────────────────────────────────┐
│   Presentation Layer                │
│   - Page Components (UI)            │
│   - AsyncBoundary                   │
│   - Skeleton Components             │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│   Application Layer                 │
│   - useHistoryStatsData             │
│   - useCalendarData                 │
│   - useSummaryListData              │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│   Infrastructure Layer              │
│   - useHistoryAnalysisQuery         │
│   - useAccuracyTrendQuery           │
│   - API Calls (axios)               │
└─────────────────────────────────────┘
```

---

## 📝 관련 문서

- [전체 가이드](./SUSPENSE_ERROR_BOUNDARY_GUIDE.md) - 설계 원칙 및 패턴
- [체크리스트](./IMPLEMENTATION_CHECKLIST.md) - 상세 구현 체크리스트
- [코드 예제](./CODE_EXAMPLES.md) - 완전한 코드 예제

---

## 🎉 결론

**모든 주요 페이지에 Suspense & Error Boundary가 성공적으로 적용되었습니다!**

✅ 일관된 UX  
✅ 타입 안전성  
✅ 간결한 코드  
✅ Clean Architecture  
✅ 프로페셔널한 로딩/에러 경험  

**린트 에러: 0개**  
**테스트: 통과**  
**사용자 경험: 크게 개선됨! 🚀**

