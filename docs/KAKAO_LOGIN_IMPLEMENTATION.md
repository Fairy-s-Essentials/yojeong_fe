# 카카오 로그인 기능 구현 문서

**작성일**: 2025-11-04  
**프로젝트**: 요약의 정석 (Yojeong FE)  
**인증 방식**: 세션 기반 (Session-based Authentication)

---

## 📋 목차

1. [구현 개요](#구현-개요)
2. [아키텍처](#아키텍처)
3. [구현된 기능](#구현된-기능)
4. [파일 구조](#파일-구조)
5. [트러블슈팅](#트러블슈팅)
6. [사용 방법](#사용-방법)

---

## 구현 개요

### 기술 스택
- **프론트엔드**: React 19.1.1, TypeScript, Vite
- **상태 관리**: Context API
- **HTTP 클라이언트**: Axios
- **인증 방식**: 세션 쿠키 (Session Cookie)
- **라우팅**: React Router v7

### 주요 특징
- ✅ 카카오 소셜 로그인
- ✅ 세션 기반 인증 (쿠키)
- ✅ 전역 상태 관리 (Context API)
- ✅ 컴포넌트 재사용성 (SRP 준수)
- ✅ 조건부 UI 렌더링

---

## 아키텍처

### 인증 플로우

```
┌─────────────┐
│   사용자    │
└──────┬──────┘
       │ 1. "카카오로 시작하기" 클릭
       ↓
┌─────────────────────────────────┐
│   LoginButton / ProfileIcon     │
│   (로그인 Dialog 표시)          │
└──────┬──────────────────────────┘
       │ 2. window.location.href = '/auth/kakao'
       ↓
┌─────────────────────────────────┐
│   백엔드 (localhost:3000)       │
│   - 카카오 로그인 페이지 리다이렉트 │
│   - 카카오에서 인가 코드 수신     │
│   - 토큰 교환 및 사용자 정보 획득  │
│   - DB 저장 & 세션 생성          │
└──────┬──────────────────────────┘
       │ 3. redirect to /auth/callback?success=true
       ↓
┌─────────────────────────────────┐
│   AuthCallbackPage              │
│   - Alert 표시                  │
│   - navigate to '/'             │
└──────┬──────────────────────────┘
       │ 4. 메인 페이지 로드
       ↓
┌─────────────────────────────────┐
│   AuthContext (useAuth)         │
│   - /auth/me API 호출           │
│   - 세션 쿠키로 사용자 인증       │
│   - 전역 상태 업데이트           │
└──────┬──────────────────────────┘
       │ 5. 로그인 상태에 따라 UI 변경
       ↓
┌─────────────────────────────────┐
│   Header                        │
│   - 로그인 안 됨: LoginButton   │
│   - 로그인 됨: AuthProfileButton│
└─────────────────────────────────┘
```

### 컴포넌트 구조

```
AuthProvider (Context - 전역 상태)
│
├─── Header
│    ├─── isLoggedIn ? AuthProfileButton : LoginButton
│    │    │
│    │    ├─── AuthProfileButton
│    │    │    ├─── ProfileIcon (프레젠테이션)
│    │    │    ├─── Dialog (로그인 모달)
│    │    │    └─── AlertDialog (로그아웃 확인)
│    │    │
│    │    └─── LoginButton
│    │         └─── Dialog (로그인 모달)
│    │
│    └─── useAuth() → AuthContext 구독
│
└─── Router
     └─── AuthCallbackPage
          └─── useAuthCallback()
```

---

## 구현된 기능

### 1. 타입 정의 (`src/types/auth.ts`)

```typescript
export interface User {
  id: number;
  kakao_id: number;
  nickname: string;
  email: string;
  profile_image?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
  };
}
```

### 2. API 설정 (`src/services/api/index.ts`)

**핵심: `withCredentials: true`**

```typescript
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  withCredentials: true,  // 세션 쿠키 전송 필수!
  headers: {
    "Content-Type": "application/json",
  },
});
```

### 3. 인증 API (`src/services/api/auth.api.ts`)

```typescript
// 현재 로그인 사용자 정보 조회
export const checkAuth = async (): Promise<AuthResponse> => {
  const { data } = await api.get<AuthResponse>('/auth/me');
  return data;
};

// 로그아웃
export const logout = async (): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/logout');
  return data;
};

// 카카오 로그인 시작
export const startKakaoLogin = (): void => {
  window.location.href = `${api.defaults.baseURL}/auth/kakao`;
};
```

### 4. 전역 상태 관리 (`src/contexts/AuthContext.tsx`)

**Context API로 전역 인증 상태 관리**

```typescript
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    try {
      const response = await checkAuth();      
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error: unknown) {
      setUser(null);  // 401은 로그인 안 된 정상 상태
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isLoggedIn: !!user, refetch: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 5. 컴포넌트 구조

#### ProfileIcon (프레젠테이션 컴포넌트)
```typescript
// 순수 UI 컴포넌트 - 아이콘만 표시
const ProfileIcon = ({ user, onClick }: ProfileIconProps) => {
  return (
    <button onClick={onClick}>
      {user?.profile_image ? (
        <img src={user.profile_image} alt={user.nickname} />
      ) : (
        <User className="w-6 h-6" />
      )}
    </button>
  );
};
```

#### AuthProfileButton (컨테이너 컴포넌트)
```typescript
// 로그인된 사용자용 - 로그아웃 기능 포함
const AuthProfileButton = () => {
  const { user, handleProfileClick, ... } = useProfileAuth();
  
  return (
    <>
      <ProfileIcon user={user} onClick={handleProfileClick} />
      <Dialog>로그인 모달</Dialog>
      <AlertDialog>로그아웃 확인</AlertDialog>
    </>
  );
};
```

#### LoginButton (로그인 버튼)
```typescript
// 로그인 안 된 사용자용
const LoginButton = () => {
  return (
    <>
      <Button onClick={handleLoginClick}>로그인</Button>
      <Dialog>카카오 로그인 모달</Dialog>
    </>
  );
};
```

#### Header (조건부 렌더링)
```typescript
const Header = () => {
  const { isLoggedIn } = useAuth();
  
  return (
    <header>
      {isLoggedIn ? <AuthProfileButton /> : <LoginButton />}
    </header>
  );
};
```

---

## 파일 구조

```
src/
├── types/
│   └── auth.ts                     # 인증 관련 타입 정의
│
├── contexts/
│   └── AuthContext.tsx             # 전역 인증 상태 관리 (Context API)
│
├── services/
│   └── api/
│       ├── index.ts                # Axios 인스턴스 (withCredentials: true)
│       └── auth.api.ts             # 인증 API 함수들
│
├── hooks/
│   └── auth/
│       ├── useAuthCallback.ts      # 로그인 콜백 처리
│       └── useProfileAuth.ts       # ProfileIcon 로직
│
├── components/
│   ├── ProfileIcon.tsx             # 순수 프레젠테이션 컴포넌트
│   ├── AuthProfileButton.tsx       # 로그인된 사용자용 컴포넌트
│   ├── LoginButton.tsx             # 로그인 버튼 컴포넌트
│   ├── Header.tsx                  # 조건부 렌더링
│   ├── Dialog.tsx                  # 모달 컴포넌트 (외부 라이브러리 제거)
│   └── AlertDialog.tsx             # Alert 모달 컴포넌트
│
├── pages/
│   └── AuthCallbackPage.tsx        # 로그인 콜백 페이지
│
└── main.tsx                        # AuthProvider 설정
```

---

## 트러블슈팅

### 문제 1: Dialog/AlertDialog 외부 라이브러리 의존성

**증상**: Radix UI와 Lucide React 의존성 제거 필요

**원인**: 
- 프로젝트에서 외부 UI 라이브러리를 최소화하고 싶음
- `@radix-ui/react-dialog`와 `lucide-react` 사용 중

**해결**:
1. `Dialog.tsx`와 `AlertDialog.tsx`를 순수 React로 재구현
2. Context API로 상태 관리
3. `createPortal`로 모달 렌더링
4. Lucide React의 `X` 아이콘을 인라인 SVG로 대체
5. 키보드 이벤트 (ESC), 오버레이 클릭 등 직접 구현

**결과**: ✅ 외부 라이브러리 없이 Dialog/AlertDialog 동작

---

### 문제 2: Axios 미설치

**증상**: 
```
Failed to resolve import "axios" from "src/services/api/index.ts"
```

**원인**: axios 패키지가 설치되지 않음

**해결**:
```bash
pnpm add axios
```

**결과**: ✅ API 호출 가능

---

### 문제 3: 로그인 후 리다이렉트 처리

**증상**: 
- 백엔드 `/auth/kakao/callback`에서 JSON 응답만 반환
- 프론트엔드로 자동 리다이렉트 필요

**원인**: 
- 백엔드가 `res.json()`만 하면 브라우저에 JSON 텍스트만 표시됨
- 프론트엔드 React 앱으로 돌아오지 못함

**해결**:
1. 백엔드에서 프론트엔드로 리다이렉트하도록 수정
   ```typescript
   // 백엔드
   res.redirect('http://localhost:5173/auth/callback?success=true');
   ```

2. 프론트엔드에서 `/auth/callback` 라우트 추가
   ```typescript
   // Router.tsx
   {
     path: '/auth/callback',
     element: <AuthCallbackPage />,
   }
   ```

3. `AuthCallbackPage`에서 처리
   ```typescript
   useEffect(() => {
     const params = new URLSearchParams(window.location.search);
     if (params.get('success') === 'true') {
       alert('로그인에 성공했습니다! 🎉');
       navigate('/');
     }
   }, []);
   ```

**결과**: ✅ 로그인 후 자동으로 메인 페이지로 이동

---

### 문제 4: 컴포넌트 책임 분리

**증상**: `ProfileIcon`에 로그인/로그아웃 로직이 모두 포함되어 복잡함

**원인**: Single Responsibility Principle 위반

**해결**:
1. **ProfileIcon**: 아이콘만 표시 (순수 UI)
   ```typescript
   <ProfileIcon user={user} onClick={onClick} />
   ```

2. **AuthProfileButton**: 인증 기능 담당
   - ProfileIcon 사용
   - Dialog/AlertDialog 관리
   - 로그인/로그아웃 로직

3. **LoginButton**: 로그인 버튼 + 모달

4. **Header**: 조건부 렌더링만
   ```typescript
   {isLoggedIn ? <AuthProfileButton /> : <LoginButton />}
   ```

**결과**: 
- ✅ 각 컴포넌트가 하나의 책임만 가짐
- ✅ 재사용성 증가
- ✅ 테스트 용이성 향상

---

### 문제 5: 로그아웃 후 상태 업데이트 안 됨

**증상**: 
- 로그아웃 후에도 `AuthProfileButton`이 계속 표시됨
- 로그인 버튼으로 전환되지 않음

**원인**: 
- `Header`와 `AuthProfileButton`이 각각 독립적인 `useAuth()` 인스턴스 사용
- `AuthProfileButton`에서 `refetch()` 호출해도 `Header`는 업데이트 안 됨

```
Header (useAuth 인스턴스 1) → isLoggedIn: true
AuthProfileButton (useAuth 인스턴스 2) → refetch() 호출
→ Header는 여전히 isLoggedIn: true
```

**해결**: Context API로 전역 상태 관리

1. `AuthContext.tsx` 생성
   ```typescript
   export const AuthProvider = ({ children }) => {
     const [user, setUser] = useState(null);
     // 전역 상태 관리
     return <AuthContext.Provider value={...}>{children}</AuthContext.Provider>;
   };
   ```

2. `main.tsx`에서 앱 전체를 감쌈
   ```typescript
   <AuthProvider>
     <Router />
   </AuthProvider>
   ```

3. 모든 컴포넌트에서 동일한 상태 공유
   ```typescript
   // Header, AuthProfileButton 모두
   const { isLoggedIn, refetch } = useAuth(); // 같은 Context
   ```

**결과**: 
- ✅ 로그아웃 시 즉시 모든 컴포넌트 업데이트
- ✅ `LoginButton`으로 자동 전환

---

### 문제 6: 무한 리프레시

**증상**: 
- 메인 페이지 접속 시 무한 새로고침 발생
- 브라우저가 계속 리로드됨

**원인**: 
```typescript
// API Interceptor (잘못된 코드)
if (error.response?.status === 401) {
  window.location.href = '/';  // ← 무한 루프!
}
```

**문제 흐름**:
```
1. 메인 페이지 로드
2. useAuth → /auth/me 호출
3. 로그인 안 됨 → 401 응답
4. Interceptor가 window.location.href = '/' 실행
5. 메인 페이지 새로고침 (1번으로)
6. 무한 반복... 💥
```

**해결**:
1. Interceptor에서 401 자동 리다이렉트 제거
   ```typescript
   api.interceptors.response.use(
     (response) => response,
     (error: AxiosError) => {
       // 401을 그냥 에러로 반환 (리다이렉트 안 함)
       return Promise.reject(error);
     }
   );
   ```

2. AuthContext에서 401을 정상 상태로 처리
   ```typescript
   try {
     const response = await checkAuth();
     if (response.success) {
       setUser(response.data.user);
     } else {
       setUser(null);
     }
   } catch (error) {
     setUser(null);  // 401은 로그인 안 된 정상 상태
   }
   ```

**결과**: 
- ✅ 무한 리프레시 해결
- ✅ 로그인 안 된 상태에서도 정상 동작
- ✅ 401은 에러가 아닌 정상 케이스로 처리

---

### 문제 7: CORS 에러

**증상**: 
- API 호출 시 CORS 에러 발생
- 브라우저 콘솔에 CORS policy 에러

**원인**: 백엔드 CORS 설정 누락

**해결**: 백엔드에 CORS 미들웨어 추가

```typescript
// 백엔드 server.ts
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true  // 쿠키 허용
}));
```

**결과**: ✅ API 호출 정상 동작

---

## 사용 방법

### 개발 환경 설정

1. **의존성 설치**
   ```bash
   pnpm install
   ```

2. **환경 변수 설정** (`.env`)
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

3. **개발 서버 실행**
   ```bash
   pnpm dev
   ```

### 백엔드 요구 사항

1. **CORS 설정**
   ```typescript
   app.use(cors({
     origin: 'http://localhost:5173',
     credentials: true
   }));
   ```

2. **세션 설정**
   ```typescript
   app.use(session({
     secret: 'your-secret',
     resave: false,
     saveUninitialized: false,
     cookie: {
       httpOnly: true,
       secure: false,  // 개발 환경
       maxAge: 1000 * 60 * 60 * 24  // 1일
     }
   }));
   ```

3. **엔드포인트 구현**
   - `GET /auth/kakao` - 카카오 로그인 페이지로 리다이렉트
   - `GET /auth/kakao/callback` - 카카오 콜백 처리 후 프론트엔드로 리다이렉트
   - `GET /auth/me` - 현재 로그인 사용자 정보 반환
   - `POST /auth/logout` - 로그아웃 처리
   - `DELETE /auth/unlink` - 회원 탈퇴 (선택)

4. **리다이렉트 URL**
   ```typescript
   // 로그인 성공 시
   res.redirect('http://localhost:5173/auth/callback?success=true');
   
   // 로그인 실패 시
   res.redirect('http://localhost:5173/auth/callback?success=false&error=에러메시지');
   ```

### 사용자 플로우

1. **로그인**
   - 메인 페이지에서 "로그인" 버튼 클릭
   - 로그인 Dialog에서 "카카오로 시작하기" 클릭
   - 카카오 로그인 페이지에서 로그인
   - 자동으로 메인 페이지로 돌아옴
   - 프로필 아이콘 표시됨

2. **로그아웃**
   - 프로필 아이콘 클릭
   - 로그아웃 AlertDialog에서 "로그아웃" 클릭
   - 즉시 로그인 버튼으로 전환

---

## 주요 설계 원칙

### 1. Single Responsibility Principle (SRP)
- 각 컴포넌트는 하나의 책임만 가짐
- `ProfileIcon`: UI만
- `AuthProfileButton`: 인증 기능만
- `Header`: 레이아웃 및 조건부 렌더링만

### 2. 관심사 분리 (Separation of Concerns)
- UI 컴포넌트와 비즈니스 로직 분리
- Hooks으로 로직 추상화
- Context로 전역 상태 관리

### 3. 재사용성 (Reusability)
- `ProfileIcon`은 다른 곳에서도 사용 가능
- `useAuth` 훅은 어디서든 사용 가능
- Dialog/AlertDialog는 범용 컴포넌트

### 4. 예측 가능성 (Predictability)
- 일관된 네이밍 규칙
- 명확한 props 인터페이스
- TypeScript로 타입 안정성 보장

---

## 개선 가능한 부분

### 1. 에러 처리 강화
- 네트워크 에러 시 재시도 로직
- 사용자 친화적인 에러 메시지
- Toast 알림으로 UX 개선

### 2. 로딩 상태 개선
- 로그인 중 스켈레톤 UI
- 버튼 로딩 스피너
- 페이지 전환 애니메이션

### 3. 보안 강화
- HTTPS 적용 (프로덕션)
- CSRF 토큰
- Rate limiting

### 4. 테스트 추가
- 단위 테스트 (컴포넌트, 훅)
- 통합 테스트 (인증 플로우)
- E2E 테스트 (실제 사용자 시나리오)

---

## 참고 자료

- [카카오 로그인 REST API](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)
- [React Context API](https://react.dev/reference/react/useContext)
- [Axios 문서](https://axios-http.com/docs/intro)
- [프론트엔드 설계 가이드라인](./FRONTEND_INTEGRATION_GUIDE.md)

---

**작성자**: AI Assistant  
**최종 업데이트**: 2025-11-04  
**버전**: 1.0.0

