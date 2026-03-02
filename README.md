<div align="center">

# 요정: 요약의 정석 - Frontend

**글을 읽고 요약하는 능력을 체계적으로 훈련할 수 있는 AI 기반 학습 플랫폼**

</div>



## 💻 프로젝트 소개

<요정: 요약의 정석>은 글 읽기/쓰기 능력을 키우고 싶은 모든 사람을 위한 AI 기반 학습 플랫폼입니다.

사용자가 제출한 요약문을 AI가 다각도로 분석하고, 구체적이고 실행 가능한 피드백을 제공하여 체계적인 학습을 지원합니다.

### 주요 기능

- 🤖 **AI 기반 요약 평가 및 피드백**
  - AI를 활용한 정교한 다단계 평가
  - 핵심 포인트 커버리지, 논리 흐름, 표현 정확성, 비판적 사고 분석

- 📊 **학습 기록 및 통계 관리**
  - 주간 학습 횟수, 평균 점수, 연속 학습 일수 추적
  - 개인 맞춤형 학습 히스토리 제공

- 📈 **학습 히스토리 분석**
  - 기간별 학습 패턴 분석
  - 성장 추이 시각화 데이터 제공

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
