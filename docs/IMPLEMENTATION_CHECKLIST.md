# Suspense & Error Boundary 구현 체크리스트

## 📋 전체 진행 상황

- [ ] Phase 1: 기반 구조 구축 (예상 소요: 2일)
- [ ] Phase 2: React Query 설정 (예상 소요: 1일)
- [ ] Phase 3: 스켈레톤 UI 구현 (예상 소요: 2일)
- [ ] Phase 4: Error UI 구현 (예상 소요: 1일)
- [ ] Phase 5: Application Hooks 구현 (예상 소요: 2일)
- [ ] Phase 6: 페이지 마이그레이션 (예상 소요: 2일)
- [ ] Phase 7: 테스트 & 최적화 (예상 소요: 2일)

---

## Phase 1: 기반 구조 구축

### 1.1 유틸리티 구현

#### `src/utils/errorHandling.ts`

```typescript
- [ ] ErrorType enum 정의
- [ ] AppError interface 정의
- [ ] classifyError 함수 구현
  - [ ] AxiosError 처리
  - [ ] Network 에러 감지
  - [ ] HTTP 상태 코드별 분류 (401, 403, 404, 5xx)
- [ ] isRetryableError 함수 구현
  - [ ] 네트워크 에러: 재시도 가능
  - [ ] 5xx 에러: 재시도 가능
  - [ ] 4xx 에러: 재시도 불가
- [ ] getErrorMessage 함수 구현
  - [ ] 에러 타입별 한글 메시지
- [ ] getErrorTitle 함수 구현
```

**구현 우선순위**: ⭐⭐⭐ (최우선)  
**의존성**: 없음

---

### 1.2 Error Boundary 구현

#### `src/components/boundaries/ErrorBoundary.tsx`

```typescript
- [ ] ErrorBoundary 클래스 컴포넌트 구현
  - [ ] state 정의 (hasError, error)
  - [ ] static getDerivedStateFromError 구현
  - [ ] componentDidCatch 구현
    - [ ] 에러 로깅
    - [ ] onError 콜백 호출
  - [ ] reset 메서드 구현
- [ ] ErrorBoundaryProps interface 정의
- [ ] 기본 fallback UI 렌더링
- [ ] resetErrorBoundary를 fallback에 전달
```

**구현 우선순위**: ⭐⭐⭐ (최우선)  
**의존성**: `errorHandling.ts`

---

### 1.3 Suspense Boundary 구현

#### `src/components/boundaries/SuspenseBoundary.tsx`

```typescript
- [ ] SuspenseBoundary 컴포넌트 구현
  - [ ] React.Suspense 래핑
  - [ ] fallback props 전달
- [ ] SuspenseBoundaryProps interface 정의
- [ ] 최소 표시 시간 옵션 추가 (선택사항)
```

**구현 우선순위**: ⭐⭐⭐ (최우선)  
**의존성**: 없음

---

### 1.4 AsyncBoundary 구현

#### `src/components/boundaries/AsyncBoundary.tsx`

```typescript
- [ ] AsyncBoundary 컴포넌트 구현
  - [ ] ErrorBoundary와 Suspense 조합
  - [ ] QueryErrorResetBoundary 통합 (React Query)
- [ ] AsyncBoundaryProps interface 정의
- [ ] resetKeys 지원 (의존성 변경 시 자동 리셋)
```

**구현 우선순위**: ⭐⭐⭐ (최우선)  
**의존성**: `ErrorBoundary.tsx`, `SuspenseBoundary.tsx`

---

### 1.5 Index 파일 생성

#### `src/components/boundaries/index.ts`

```typescript
- [ ] 모든 boundary 컴포넌트 export
```

---

## Phase 2: React Query 설정

### 2.1 QueryClient 설정

#### `src/main.tsx` 수정

```typescript
- [ ] QueryClient 설정 업데이트
  - [ ] defaultOptions.queries 설정
    - [ ] throwOnError: true (에러를 Error Boundary로 전파)
    - [ ] retry 로직 설정
    - [ ] staleTime 설정
    - [ ] gcTime 설정
  - [ ] defaultOptions.mutations 설정
- [ ] QueryErrorResetBoundary Provider 추가 (선택사항)
```

**구현 우선순위**: ⭐⭐⭐ (최우선)  
**의존성**: `errorHandling.ts`

---

### 2.2 Query Hooks 업데이트

#### `src/services/hooks/history.ts`

```typescript
- [ ] useHistoryAnalysisQuery
  - [ ] useQuery → useSuspenseQuery 변경
  - [ ] throwOnError 옵션 추가
- [ ] useAccuracyTrendQuery
  - [ ] useQuery → useSuspenseQuery 변경
- [ ] useCalendarYearsQuery
  - [ ] useQuery → useSuspenseQuery 변경
- [ ] useCalendarDataQuery
  - [ ] useQuery → useSuspenseQuery 변경
- [ ] useSummariesQuery
  - [ ] useQuery → useSuspenseQuery 변경
```

**구현 우선순위**: ⭐⭐⭐ (최우선)  
**의존성**: Phase 2.1

---

#### `src/services/hooks/main.ts`

```typescript
- [ ] useMainAnalysisQuery
  - [ ] useQuery → useSuspenseQuery 변경
- [ ] useMainRecentSummaryQuery
  - [ ] useQuery → useSuspenseQuery 변경
```

**구현 우선순위**: ⭐⭐⭐ (최우선)

---

#### `src/services/hooks/summary.ts`

```typescript
- [ ] 해당 파일 확인 및 업데이트
- [ ] 필요시 useSuspenseQuery 적용
```

**구현 우선순위**: ⭐⭐

---

## Phase 3: 스켈레톤 UI 구현

### 3.1 기본 스켈레톤 컴포넌트

#### `src/components/skeletons/SkeletonBase.tsx`

```typescript
- [ ] Skeleton 컴포넌트 구현
  - [ ] width, height props 지원
  - [ ] variant 옵션 (rounded, circular, rectangular)
  - [ ] 펄스 애니메이션 적용
- [ ] SkeletonProps interface 정의
```

**구현 우선순위**: ⭐⭐⭐  
**의존성**: 없음

---

### 3.2 History 페이지 스켈레톤

#### `src/components/skeletons/SkeletonHistoryStats.tsx`

```typescript
- [ ] 3개 카드 레이아웃 구현
- [ ] 각 카드 내부 요소 스켈레톤
  - [ ] 아이콘 영역
  - [ ] 값 영역
  - [ ] 라벨 영역
```

**구현 우선순위**: ⭐⭐⭐

---

#### `src/components/skeletons/SkeletonLineChart.tsx`

```typescript
- [ ] 차트 컨테이너 구현
- [ ] 제목 스켈레톤
- [ ] 차트 형태 스켈레톤
  - [ ] Y축 라인들
  - [ ] 대략적인 그래프 형태
```

**구현 우선순위**: ⭐⭐⭐

---

#### `src/components/skeletons/SkeletonHeatmap.tsx`

```typescript
- [ ] 히트맵 컨테이너 구현
- [ ] 년도 선택 영역 스켈레톤
- [ ] 히트맵 그리드 스켈레톤
  - [ ] 주별 행
  - [ ] 일별 셀
```

**구현 우선순위**: ⭐⭐⭐

---

#### `src/components/skeletons/SkeletonSummaryList.tsx`

```typescript
- [ ] SkeletonSummaryItem 컴포넌트 구현
  - [ ] 제목 라인
  - [ ] 날짜 라인
  - [ ] 내용 라인들
  - [ ] 점수 영역
- [ ] SkeletonSummaryList 컴포넌트 구현
  - [ ] count prop으로 개수 조절
  - [ ] 여러 개 렌더링
```

**구현 우선순위**: ⭐⭐⭐

---

### 3.3 Main 페이지 스켈레톤

#### `src/components/skeletons/SkeletonMainStats.tsx`

```typescript
- [ ] 메인 통계 카드 스켈레톤
- [ ] 최근 요약 섹션 스켈레톤
```

**구현 우선순위**: ⭐⭐

---

### 3.4 Analysis 페이지 스켈레톤

#### `src/components/skeletons/SkeletonAnalysis.tsx`

```typescript
- [ ] 분석 결과 레이아웃 스켈레톤
- [ ] 원문/요약문 영역 스켈레톤
- [ ] 피드백 영역 스켈레톤
```

**구현 우선순위**: ⭐⭐

---

### 3.5 Index 파일

#### `src/components/skeletons/index.ts`

```typescript
- [ ] 모든 스켈레톤 컴포넌트 export
```

---

## Phase 4: Error UI 구현

### 4.1 기본 Error Fallback

#### `src/components/errors/ErrorFallback.tsx`

```typescript
- [ ] ErrorFallback 컴포넌트 구현
  - [ ] error, resetErrorBoundary props
  - [ ] AppError로 분류
  - [ ] 에러 타입별 UI 분기
- [ ] 에러 아이콘 표시
- [ ] 에러 제목 및 메시지
- [ ] 액션 버튼들
  - [ ] 다시 시도 (retryable인 경우)
  - [ ] 홈으로 가기
```

**구현 우선순위**: ⭐⭐⭐  
**의존성**: `errorHandling.ts`

---

### 4.2 특화 Error 컴포넌트

#### `src/components/errors/NetworkError.tsx`

```typescript
- [ ] NetworkError 컴포넌트 구현
- [ ] Wi-Fi 아이콘
- [ ] 네트워크 관련 메시지
- [ ] 다시 시도 버튼
```

**구현 우선순위**: ⭐⭐

---

#### `src/components/errors/UnauthorizedError.tsx`

```typescript
- [ ] UnauthorizedError 컴포넌트 구현
- [ ] 자물쇠 아이콘
- [ ] 로그인 필요 메시지
- [ ] 로그인 버튼
```

**구현 우선순위**: ⭐⭐

---

#### `src/components/errors/NotFoundError.tsx`

```typescript
- [ ] NotFoundError 컴포넌트 구현
- [ ] 404 아이콘/일러스트
- [ ] 페이지 없음 메시지
- [ ] 홈으로 가기 버튼
```

**구현 우선순위**: ⭐

---

#### `src/components/errors/ServerError.tsx`

```typescript
- [ ] ServerError 컴포넌트 구현
- [ ] 서버 아이콘
- [ ] 서버 문제 메시지
- [ ] 다시 시도 버튼
```

**구현 우선순위**: ⭐⭐

---

### 4.3 Index 파일

#### `src/components/errors/index.ts`

```typescript
- [ ] 모든 에러 컴포넌트 export
```

---

## Phase 5: Application Hooks 구현

### 5.1 History 도메인 Hooks

#### `src/hooks/history/useHistoryStatsData.ts`

```typescript
- [ ] useHistoryStatsData 훅 구현
  - [ ] useHistoryAnalysisQuery 사용
  - [ ] useAccuracyTrendQuery 사용
  - [ ] stats 객체 생성
    - [ ] 기본 통계
    - [ ] scoreDiff 계산
    - [ ] isImproving 계산
    - [ ] grade 계산
    - [ ] message 생성
  - [ ] chartData 변환
    - [ ] 날짜 포맷팅
    - [ ] 추가 정보 포함
  - [ ] trendAnalysis 계산
    - [ ] average, highest, lowest
    - [ ] volatility
    - [ ] direction
- [ ] 비즈니스 로직 함수들
  - [ ] calculateGrade
  - [ ] getMotivationMessage
  - [ ] calculateAverage
  - [ ] calculateVolatility
  - [ ] analyzeTrend
```

**구현 우선순위**: ⭐⭐⭐  
**의존성**: Phase 2.2

---

#### `src/hooks/history/useCalendarData.ts`

```typescript
- [ ] useCalendarData 훅 구현
  - [ ] useCalendarYearsQuery 사용
  - [ ] useCalendarDataQuery 사용
  - [ ] heatmapData 가공
    - [ ] 전체 날짜 생성
    - [ ] level 계산
    - [ ] tooltip 생성
  - [ ] stats 계산
    - [ ] totalDays, totalCount
    - [ ] averagePerDay
    - [ ] maxStreak, currentStreak
- [ ] 유틸 함수들
  - [ ] getHeatmapLevel
  - [ ] formatTooltip
  - [ ] generateYearDates
  - [ ] calculateMaxStreak
  - [ ] calculateCurrentStreak
```

**구현 우선순위**: ⭐⭐⭐

---

#### `src/hooks/history/useSummaryListData.ts`

```typescript
- [ ] useSummaryListData 훅 구현
  - [ ] useSummariesQuery 사용
  - [ ] items 가공
    - [ ] 날짜 포맷팅
    - [ ] 점수 등급
    - [ ] 요약 미리보기
  - [ ] pagination 정보 가공
  - [ ] stats 계산
- [ ] 유틸 함수들
  - [ ] formatRelativeDate
  - [ ] getScoreGrade
  - [ ] truncateText
```

**구현 우선순위**: ⭐⭐⭐

---

#### `src/hooks/history/index.ts`

```typescript
- [ ] 모든 history hooks export
```

---

### 5.2 Main 도메인 Hooks

#### `src/hooks/main/useMainData.ts`

```typescript
- [ ] useMainData 훅 구현
  - [ ] useMainAnalysisQuery 사용
  - [ ] useMainRecentSummaryQuery 사용
  - [ ] 데이터 변환 및 가공
```

**구현 우선순위**: ⭐⭐

---

#### `src/hooks/main/index.ts`

```typescript
- [ ] main hooks export
```

---

### 5.3 Summary 도메인 Hooks

#### `src/hooks/summary/useAnalysisData.ts` (필요시)

```typescript
- [ ] useAnalysisData 훅 구현
- [ ] 분석 결과 데이터 가공
```

**구현 우선순위**: ⭐

---

## Phase 6: 페이지 마이그레이션

### 6.1 HistoryPage 마이그레이션

#### `src/pages/HistoryPage.tsx`

```typescript
- [ ] 데이터 로직 분리
  - [ ] HistoryStatsSection 컴포넌트 생성
  - [ ] AccuracyChartSection 컴포넌트 생성
  - [ ] CalendarSection 컴포넌트 생성
  - [ ] SummaryListSection 컴포넌트 생성
- [ ] 각 섹션에 AsyncBoundary 적용
  - [ ] 적절한 스켈레톤 지정
  - [ ] ErrorFallback 지정
- [ ] Application Hooks 사용
  - [ ] useHistoryStatsData
  - [ ] useCalendarData
  - [ ] useSummaryListData
- [ ] 불필요한 코드 제거
  - [ ] undefined 체크 제거
  - [ ] Optional chaining 제거 (필요시)
```

**구현 우선순위**: ⭐⭐⭐  
**의존성**: Phase 1-5 완료

---

### 6.2 MainPage 마이그레이션

#### `src/pages/MainPage.tsx`

```typescript
- [ ] 현재 구조 파악
- [ ] 데이터 로직 분리
- [ ] AsyncBoundary 적용
- [ ] Application Hooks 사용
- [ ] 스켈레톤 UI 적용
```

**구현 우선순위**: ⭐⭐

---

### 6.3 AnalysisPage 마이그레이션

#### `src/pages/AnalysisPage.tsx`

```typescript
- [ ] 현재 구조 파악
- [ ] 데이터 로직 분리
- [ ] AsyncBoundary 적용
- [ ] 스켈레톤 UI 적용
```

**구현 우선순위**: ⭐⭐

---

### 6.4 Input 페이지들 (부분적 적용)

#### `src/pages/OriginalInputPage.tsx`

```typescript
- [ ] 필요시 AsyncBoundary 적용
```

**구현 우선순위**: ⭐

---

#### `src/pages/SummaryInputPage.tsx`

```typescript
- [ ] 필요시 AsyncBoundary 적용
```

**구현 우선순위**: ⭐

---

## Phase 7: 테스트 & 최적화

### 7.1 단위 테스트

```typescript
- [ ] errorHandling.ts 테스트
  - [ ] classifyError 테스트
  - [ ] isRetryableError 테스트
- [ ] Application Hooks 테스트
  - [ ] useHistoryStatsData 테스트
  - [ ] useCalendarData 테스트
  - [ ] useSummaryListData 테스트
- [ ] Boundary 컴포넌트 테스트
  - [ ] ErrorBoundary 테스트
  - [ ] AsyncBoundary 테스트
```

**구현 우선순위**: ⭐⭐

---

### 7.2 통합 테스트

```typescript
- [ ] 페이지 렌더링 테스트
- [ ] 로딩 상태 테스트
- [ ] 에러 상태 테스트
- [ ] 재시도 기능 테스트
```

**구현 우선순위**: ⭐⭐

---

### 7.3 E2E 테스트

```typescript
- [ ] 전체 플로우 테스트
- [ ] 네트워크 에러 시나리오
- [ ] 느린 네트워크 시나리오
```

**구현 우선순위**: ⭐

---

### 7.4 성능 최적화

```typescript
- [ ] Bundle 크기 확인
- [ ] 동적 import 적용 (필요시)
- [ ] 메모이제이션 적용
- [ ] Lighthouse 점수 측정
  - [ ] LCP 개선 확인
  - [ ] CLS 개선 확인
```

**구현 우선순위**: ⭐⭐

---

### 7.5 접근성 개선

```typescript
- [ ] 스켈레톤에 aria-label 추가
- [ ] 에러 메시지에 role 추가
- [ ] 키보드 네비게이션 확인
```

**구현 우선순위**: ⭐

---

## 추가 작업

### 개발 도구

```typescript
- [ ] 에러 시뮬레이션 도구 개발
  - [ ] 개발 모드에서 에러 강제 발생
  - [ ] 네트워크 지연 시뮬레이션
- [ ] Storybook에 스켈레톤 추가 (선택사항)
- [ ] Storybook에 에러 컴포넌트 추가 (선택사항)
```

**구현 우선순위**: ⭐ (선택사항)

---

### 문서화

```typescript
- [ ] 컴포넌트별 JSDoc 작성
- [ ] README 업데이트
- [ ] 구현 완료 보고서 작성
```

**구현 우선순위**: ⭐⭐

---

### 모니터링 준비

```typescript
- [ ] 에러 로깅 시스템 연동 준비
  - [ ] Sentry 등 에러 추적 도구
- [ ] 성능 모니터링 준비
  - [ ] Web Vitals 측정
```

**구현 우선순위**: ⭐ (향후 작업)

---

## 우선순위 범례

- ⭐⭐⭐ : 최우선 (반드시 구현)
- ⭐⭐ : 높음 (가능한 구현)
- ⭐ : 중간 (시간 여유시 구현)

---

## 구현 순서 요약

1. **Day 1-2**: Phase 1 + Phase 2
   - Boundary 컴포넌트
   - 에러 유틸리티
   - React Query 설정

2. **Day 3-4**: Phase 3
   - 스켈레톤 UI 전체

3. **Day 5**: Phase 4
   - Error UI 전체

4. **Day 6-7**: Phase 5
   - Application Hooks

5. **Day 8-9**: Phase 6
   - 페이지 마이그레이션

6. **Day 10-12**: Phase 7
   - 테스트 & 최적화

---

## 완료 기준

### Phase별 완료 기준

**Phase 1 완료**:
- [ ] 모든 Boundary 컴포넌트가 정상 작동
- [ ] 에러 분류가 올바르게 동작
- [ ] 간단한 테스트 페이지에서 검증 완료

**Phase 2 완료**:
- [ ] 모든 Query Hook이 Suspense 지원
- [ ] 에러가 Error Boundary로 전파됨
- [ ] QueryClient 설정이 올바름

**Phase 3 완료**:
- [ ] 모든 주요 페이지의 스켈레톤 구현
- [ ] 스켈레톤이 실제 레이아웃과 유사함
- [ ] 애니메이션이 자연스러움

**Phase 4 완료**:
- [ ] 모든 에러 타입별 UI 구현
- [ ] 에러 메시지가 사용자 친화적
- [ ] 재시도 기능이 정상 작동

**Phase 5 완료**:
- [ ] 모든 Application Hooks 구현
- [ ] 비즈니스 로직이 올바름
- [ ] 타입 안정성 보장

**Phase 6 완료**:
- [ ] 모든 주요 페이지 마이그레이션
- [ ] 로딩/에러 상태가 올바르게 표시
- [ ] 사용자 경험이 개선됨

**Phase 7 완료**:
- [ ] 주요 테스트 작성 완료
- [ ] 성능 지표가 목표치 달성
- [ ] 접근성 문제 없음

---

## 롤백 시나리오

각 Phase별로 문제 발생 시:

1. **Phase 1-2 실패**:
   - Boundary 제거
   - 기존 로딩/에러 처리 유지

2. **Phase 3-4 실패**:
   - 스켈레톤/에러 UI 제거
   - 기본 로딩 인디케이터 사용

3. **Phase 5-6 실패**:
   - Application Hooks 제거
   - 페이지에서 직접 Query Hook 사용

---

## 참고사항

### 주의사항

1. **점진적 적용**
   - 한 번에 모든 페이지를 바꾸지 말 것
   - 하나씩 검증하며 진행

2. **타입 안정성**
   - Suspense 적용 시 data는 항상 정의됨
   - 타입 정의를 정확히 할 것

3. **에러 처리**
   - 모든 에러를 Error Boundary로 보내지 말 것
   - Mutation 에러는 로컬에서 처리

4. **성능**
   - 과도한 Boundary는 피할 것
   - 적절한 단위로 묶을 것

### 유용한 명령어

```bash
# 개발 서버 실행
pnpm dev

# 타입 체크
pnpm tsc --noEmit

# 린트
pnpm lint

# 빌드
pnpm build

# 빌드 결과 확인
pnpm preview
```

---

## 변경 이력

- 2024-11-14: 초안 작성

