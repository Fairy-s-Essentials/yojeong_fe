# 프론트엔드 SSE 적용 변경 사항

> 📅 작성일: 2025-12-07  
> 🎯 목적: `saveSummary` API를 SSE 방식으로 변경하여 사용자 경험 개선

## 개요

기존에는 요약 분석 요청 시 **완료될 때까지 대기** 후 결과 페이지로 이동했습니다.  
이제는 요청 즉시 **메인 페이지로 이동**하고, **실시간 진행 상황**을 모달로 표시합니다.

### 변경 전 vs 변경 후

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| 요청 후 동작 | 로딩 모달 표시, 완료까지 대기 | 즉시 메인으로 이동 |
| 진행 상황 | 표시 안 함 | 실시간 프로그레스 바 |
| 완료 시 | 자동으로 결과 페이지 이동 | "결과 확인하기" 버튼 제안 |
| 페이지 이동 | 진행 상황 유실 | 모든 페이지에서 유지 |

---

## 변경된 파일 목록

### 1. 타입 정의

**📁 `src/types/summary.type.ts`**

```typescript
// 새로 추가된 타입들
export type SSEStep = 'validation' | 'ai_summary' | 'ai_evaluation' | 'saving' | 'completed' | 'failed';
export type SSEStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface SSEProgressEvent {
  jobId: string;
  status: SSEStatus;
  step: SSEStep;
  progress: number;
  message: string;
}

export interface SSECompletedEvent extends SSEProgressEvent {
  status: 'completed';
  step: 'completed';
  progress: 100;
  result: {
    resultId: number;
    usage: number;
    limit: number;
  };
}

export interface SSEErrorEvent extends SSEProgressEvent {
  status: 'failed';
  step: 'failed';
  progress: 0;
  error: {
    code: string;
    message: string;
  };
}

export interface SaveSummaryResponse {
  jobId: string;
}
```

---

### 2. API 함수

**📁 `src/services/api/summary.api.ts`**

```typescript
// 변경됨: jobId를 반환
export const saveSummary = async (inputData: SaveSummaryProps): Promise<SaveSummaryResponse> => {
  const { data } = await api.post('/summary', inputData);
  return data.data; // { jobId: string }
};
```

---

### 3. React Query Hook

**📁 `src/services/hooks/summary.ts`**

```typescript
// 변경됨: signal 제거, 쿼리 무효화는 SSE 완료 시 Context에서 처리
export const useSaveSummary = () => {
  return useMutation({
    mutationFn: (data: SaveSummaryProps) => saveSummary(data),
  });
};
```

---

### 4. SSE Context (신규)

**📁 `src/contexts/SummarySSEContext.tsx`**

SSE 연결 및 상태 관리를 담당하는 Context입니다.

#### 제공하는 값

```typescript
interface SummarySSEContextValue {
  state: SSEState;           // 현재 SSE 상태
  startSSE: (jobId: string) => void;  // SSE 구독 시작
  stopSSE: () => void;       // SSE 연결 종료
  clearState: () => void;    // 상태 초기화
  toggleMinimize: () => void; // 모달 최소화 토글
  hasActiveState: boolean;   // 표시할 상태가 있는지
}

interface SSEState {
  isProcessing: boolean;     // 진행 중 여부
  jobId: string | null;      // 현재 작업 ID
  status: SSEStatus | null;  // 상태 (pending/processing/completed/failed)
  step: SSEStep | null;      // 현재 단계
  progress: number;          // 진행률 (0-100)
  message: string;           // 표시 메시지
  error: { code: string; message: string } | null;  // 에러 정보
  resultId: number | null;   // 완료 시 결과 ID
  isMinimized: boolean;      // 모달 최소화 상태
}
```

#### 사용 예시

```tsx
import { useSummarySSE } from '@/contexts';

const MyComponent = () => {
  const { state, startSSE, clearState } = useSummarySSE();
  
  // 진행 상황 확인
  console.log(state.progress, state.message);
  
  // SSE 시작
  startSSE('job-id-here');
  
  // 상태 초기화
  clearState();
};
```

---

### 5. SSE Progress Modal (신규)

**📁 `src/components/SSEProgressModal.tsx`**

모든 페이지에서 SSE 진행 상황을 표시하는 플로팅 모달입니다.

#### 상태별 UI

| 상태 | 위치 | 디자인 | 기능 |
|------|------|--------|------|
| **진행 중** | 우측 하단 | 흰색 모달 + 파란 프로그레스 바 | 최소화 버튼 |
| **최소화** | 우측 하단 | 작은 플로팅 버튼 | 클릭 시 확장 |
| **완료** | 우측 하단 | 초록색 모달 | "결과 확인하기" / "닫기" 버튼 |
| **에러** | 우측 하단 | 빨간색 모달 | 에러 메시지 + "닫기" 버튼 |

---

### 6. Layout 수정

**📁 `src/components/Layout.tsx`**

```tsx
import { SSEProgressModal } from './SSEProgressModal';
import { SummarySSEProvider } from '@/contexts';

const Layout = () => {
  return (
    <SummarySSEProvider>
      <div className="min-h-screen">
        <Header />
        <main>
          <Outlet />
        </main>
        {/* SSE 진행 상황 모달 - 모든 페이지에서 표시 */}
        <SSEProgressModal />
      </div>
    </SummarySSEProvider>
  );
};
```

---

### 7. SummaryInputPage 수정

**📁 `src/pages/SummaryInputPage.tsx`**

```tsx
// 변경된 handleSubmit 함수
const handleSubmit = async () => {
  if (isSubmitting) return;
  setIsSubmitting(true);

  try {
    // 1. Summary 생성 요청 → jobId 반환
    const { jobId } = await saveSummaryMutation({
      originalText: originalContent,
      originalUrl: originalLink,
      userSummary: summary,
      criticalWeakness: weakness,
      criticalOpposite: opposite,
    });

    // 2. 원문 데이터 삭제
    clearOriginalData();

    // 3. 메인 페이지로 이동 후 SSE 구독 시작
    navigate('/', { replace: true });
    startSSE(jobId);
  } catch (error) {
    console.error(error);
    alert('요약 요청에 실패하였습니다.');
    setIsSubmitting(false);
  }
};
```

---

## 동작 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│  1. 사용자가 요약 제출                                            │
│     └─> POST /summary 요청                                       │
│                                                                  │
│  2. 서버에서 jobId 반환 (HTTP 202 Accepted)                       │
│     └─> { success: true, data: { jobId: "..." } }               │
│                                                                  │
│  3. 즉시 메인 페이지로 이동                                        │
│     └─> navigate('/', { replace: true })                        │
│                                                                  │
│  4. SSE 구독 시작                                                 │
│     └─> startSSE(jobId)                                         │
│     └─> EventSource 연결: GET /summary/sse/:jobId               │
│                                                                  │
│  5. 실시간 진행 상황 수신 (모달로 표시)                             │
│     ├─> progress 이벤트: 프로그레스 바 업데이트                    │
│     ├─> completed 이벤트: "결과 확인하기" 버튼 표시                │
│     └─> error 이벤트: 에러 메시지 표시                            │
│                                                                  │
│  6. 사용자가 "결과 확인하기" 클릭                                   │
│     └─> /analysis/:resultId 페이지로 이동                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 진행 단계 (Step)

| Step | Progress | 메시지 예시 |
|------|----------|------------|
| `validation` | 0% | 검증 완료 |
| `ai_summary` | 20% | AI가 원문을 분석하고 있습니다... |
| `ai_evaluation` | 50% | AI가 요약을 평가하고 있습니다... |
| `saving` | 80% | 결과를 저장하고 있습니다... |
| `completed` | 100% | 분석이 완료되었습니다! |
| `failed` | 0% | 오류가 발생했습니다. |

---

## Context Export

**📁 `src/contexts/index.ts`**

```typescript
export { LoadingProvider, useLoading } from './LoadingContext';
export { AuthProvider } from './auth/AuthProvider';
export { SummarySSEProvider, useSummarySSE } from './SummarySSEContext';  // 추가됨
```

---

## 주의사항

### 1. SSE 연결 유지
- `SummarySSEProvider`는 `Layout` 컴포넌트 내부에 있으므로, Layout을 벗어나는 페이지(예: `/auth/callback`)에서는 SSE 상태가 유지되지 않습니다.

### 2. 쿼리 무효화
- SSE 완료 시 `SummarySSEContext`에서 자동으로 관련 쿼리들을 무효화합니다:
  - `mainAnalysis`, `mainRecentSummary`, `historyAnalysis`, `accuracyTrend`, `calendarYears`, `calendarData`, `summaries`

### 3. 에러 처리
- SSE 연결 에러 시 자동으로 에러 상태로 전환됩니다.
- 사용자가 "닫기" 버튼을 클릭하면 상태가 초기화됩니다.

---

## 테스트 체크리스트

- [ ] 요약 제출 후 즉시 메인 페이지로 이동하는가?
- [ ] 프로그레스 바가 실시간으로 업데이트되는가?
- [ ] 다른 페이지로 이동해도 모달이 유지되는가?
- [ ] 최소화 버튼이 정상 동작하는가?
- [ ] 완료 시 "결과 확인하기" 버튼이 표시되는가?
- [ ] 에러 발생 시 에러 메시지가 표시되는가?
- [ ] "닫기" 버튼 클릭 시 상태가 초기화되는가?

---

## 관련 문서

- [SSE_GUIDE.md](./SSE_GUIDE.md) - 백엔드 SSE API 가이드
