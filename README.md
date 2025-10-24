# Yojeong FE

## 🚀 프로젝트 시작 방법

### 의존성 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

### 빌드

```bash
pnpm build
```

### 프로덕션 프리뷰

```bash
pnpm preview
```

### 린트 검사

```bash
pnpm lint
```

## 📦 설치된 패키지

### Dependencies

- **React**: ^19.1.1 - UI 라이브러리
- **React DOM**: ^19.1.1 - React 웹 렌더러
- **React Router**: ^7.9.4 - 라우팅 라이브러리
- **React Router DOM**: ^7.9.4 - React Router의 DOM 바인딩
- **TanStack Query**: ^5.90.5 - 서버 상태 관리 라이브러리
- **TanStack Query DevTools**: ^5.90.2 - React Query 개발자 도구
- **Tailwind CSS**: ^4.1.16 - 유틸리티 기반 CSS 프레임워크
- **@tailwindcss/vite**: ^4.1.16 - Tailwind CSS Vite 플러그인

### Dev Dependencies

- **Vite**: 7.1.14 (rolldown-vite) - 빌드 도구
- **TypeScript**: ~5.9.3 - 타입스크립트
- **ESLint**: ^9.36.0 - 코드 린터
- **@vitejs/plugin-react**: ^5.0.4 - React Vite 플러그인
- **babel-plugin-react-compiler**: ^19.1.0-rc.3 - React 컴파일러 플러그인
- 기타 TypeScript, ESLint 관련 플러그인

## 📁 폴더 구조

```
yojeong_fe/
├── public/              # 정적 파일
├── src/
│   ├── assets/         # 이미지, 폰트 등 리소스
│   ├── components/     # 재사용 가능한 컴포넌트
│   ├── hooks/          # 커스텀 React Hooks
│   ├── pages/          # 페이지 컴포넌트
│   ├── router/         # 라우팅 설정
│   ├── services/       # API 서비스 로직
│   ├── types/          # TypeScript 타입 정의
│   ├── utils/          # 유틸리티 함수
│   ├── main.tsx        # 앱 진입점
│   └── index.css       # 전역 스타일
├── eslint.config.js    # ESLint 설정
├── tsconfig.json       # TypeScript 설정
├── vite.config.ts      # Vite 설정
└── package.json        # 프로젝트 의존성 및 스크립트
```
