# 프론트엔드 연동 가이드

**작성일**: 2025-11-04
**백엔드 서버**: http://localhost:3000
**프론트엔드 포트**: 5173

---

## 📋 목차

1. [카카오 로그인 플로우](#카카오-로그인-플로우)
2. [API 엔드포인트](#api-엔드포인트)
3. [React 구현 예시](#react-구현-예시)
4. [Axios 설정](#axios-설정)
5. [주의사항](#주의사항)
6. [CORS 설정](#cors-설정)

---

## 카카오 로그인 플로우

```
1. 사용자가 "카카오 로그인" 버튼 클릭
   ↓
2. 프론트엔드: window.location.href = 'http://localhost:3000/auth/kakao'
   ↓
3. 백엔드: 사용자를 카카오 로그인 페이지로 리다이렉트
   ↓
4. 사용자: 카카오에서 로그인
   ↓
5. 카카오: 백엔드 콜백 URL로 리다이렉트 (인가 코드 포함)
   ↓
6. 백엔드: 토큰 요청 → 사용자 정보 조회 → DB 저장 → 세션 생성
   ↓
7. 백엔드: JSON 응답 반환 { success: true, data: { user } }
   ↓
8. 프론트엔드: 사용자 정보 저장 및 로그인 완료 처리
```

---

## API 엔드포인트

### 1. 카카오 로그인 시작

**URL**: `GET http://localhost:3000/auth/kakao`

**설명**: 사용자를 카카오 로그인 페이지로 리다이렉트

**사용법**:
```javascript
window.location.href = 'http://localhost:3000/auth/kakao';
```

---

### 2. 카카오 로그인 콜백 (자동 호출)

**URL**: `GET http://localhost:3000/auth/kakao/callback?code={인가코드}`

**설명**: 카카오에서 자동으로 호출. 프론트엔드에서 직접 호출하지 않음.

**응답 예시**:
```json
{
  "success": true,
  "message": "로그인 성공",
  "data": {
    "user": {
      "id": 1,
      "kakao_id": 123456789,
      "nickname": "홍길동",
      "email": "hong@example.com",
      "profile_image": "https://..."
    }
  }
}
```

---

### 3. 현재 사용자 정보 조회

**URL**: `GET http://localhost:3000/auth/me`

**설명**: 세션 기반으로 현재 로그인한 사용자 정보 조회

**요청**:
```javascript
fetch('http://localhost:3000/auth/me', {
  credentials: 'include'  // 쿠키 포함 필수!
})
```

**응답 (성공)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "kakao_id": 123456789,
      "nickname": "홍길동",
      "email": "hong@example.com",
      "profile_image": "https://..."
    }
  }
}
```

**응답 (로그인 안 됨)**:
```json
{
  "success": false,
  "message": "로그인이 필요합니다."
}
```

---

### 4. 로그아웃

**URL**: `POST http://localhost:3000/auth/logout`

**설명**: 카카오 로그아웃 + 세션 삭제

**요청**:
```javascript
fetch('http://localhost:3000/auth/logout', {
  method: 'POST',
  credentials: 'include'
})
```

**응답**:
```json
{
  "success": true,
  "message": "로그아웃 성공"
}
```

---

### 5. 회원 탈퇴

**URL**: `DELETE http://localhost:3000/auth/unlink`

**설명**: 카카오 연결 해제 + DB에서 삭제

**요청**:
```javascript
fetch('http://localhost:3000/auth/unlink', {
  method: 'DELETE',
  credentials: 'include'
})
```

**응답**:
```json
{
  "success": true,
  "message": "회원 탈퇴가 완료되었습니다."
}
```

---

## 기본 사용 예시

### 카카오 로그인 시작

```javascript
// 카카오 로그인 버튼 클릭 시
window.location.href = 'http://localhost:3000/auth/kakao';
```

### 로그인 상태 확인

```javascript
const response = await fetch('http://localhost:3000/auth/me', {
  credentials: 'include' // 쿠키 포함 필수!
});
const data = await response.json();

if (data.success) {
  console.log('로그인된 사용자:', data.data.user);
} else {
  console.log('로그인 필요');
}
```

### 로그아웃

```javascript
const response = await fetch('http://localhost:3000/auth/logout', {
  method: 'POST',
  credentials: 'include' // 쿠키 포함 필수!
});
const data = await response.json();

if (data.success) {
  console.log('로그아웃 완료');
}
```

### 회원 탈퇴

```javascript
const response = await fetch('http://localhost:3000/auth/unlink', {
  method: 'DELETE',
  credentials: 'include' // 쿠키 포함 필수!
});
const data = await response.json();

if (data.success) {
  console.log('회원 탈퇴 완료');
}
```

---

## Axios 설정

### Axios 인스턴스 생성

```javascript
// api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true  // 쿠키 포함 (중요!)
});

export default api;
```

### 사용 예시

```javascript
import api from './api/axios';

// 로그인 상태 확인
const checkAuth = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

// 로그아웃
const logout = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

// 회원 탈퇴
const unlink = async () => {
  const { data } = await api.delete('/auth/unlink');
  return data;
};
```

---

## 주의사항

### ⚠️ 필수: credentials: 'include'

세션 기반 인증을 사용하므로 **모든 API 요청에 쿠키를 포함**해야 합니다.

**fetch 사용 시**:
```javascript
fetch(url, {
  credentials: 'include'  // 필수!
})
```

**axios 사용 시**:
```javascript
axios.create({
  withCredentials: true  // 필수!
})
```

### ⚠️ 카카오 개발자 콘솔 설정

카카오 개발자 콘솔(https://developers.kakao.com)에서:
- **Redirect URI**: `http://localhost:3000/auth/kakao/callback`
- 프론트엔드 포트(5173)가 아니라 **백엔드 포트(3000)**로 설정!

### ⚠️ 로그인 후 리다이렉트 처리

카카오 로그인 후 백엔드가 JSON 응답을 반환하므로, 프론트엔드에서 적절히 처리해야 합니다.

현재 백엔드는 `/auth/kakao/callback`에서 JSON 응답을 반환합니다. 프론트엔드에서 이를 처리하는 방법:

**방법 1**: 백엔드에서 프론트엔드로 리다이렉트하도록 수정
```typescript
// auth.controller.ts 수정 예시
res.redirect('http://localhost:5173?login=success');
```

**방법 2**: 프론트엔드에서 콜백 페이지 생성하여 로그인 상태 확인 후 메인 페이지로 이동

---

## CORS 설정

### 백엔드에 CORS 추가 필요

백엔드 `server.ts`에 다음 코드 추가:

```typescript
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:5173',  // 프론트엔드 주소
  credentials: true  // 쿠키 허용
}));
```

**설치**:
```bash
npm install cors
npm install -D @types/cors
```

---

## 환경변수 설정 (프론트엔드)

프론트엔드에서 환경변수로 API URL 관리:

```env
# .env
VITE_API_URL=http://localhost:3000
```

```javascript
// api/axios.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});
```

---

## 프로덕션 배포 시 주의사항

### 1. 백엔드 URL 변경
```env
# 프로덕션 환경
VITE_API_URL=https://api.yourdomain.com
```

### 2. 카카오 Redirect URI 추가
카카오 개발자 콘솔에서 프로덕션 URL 추가:
```
https://api.yourdomain.com/auth/kakao/callback
```

### 3. CORS 설정 업데이트
```typescript
app.use(cors({
  origin: 'https://yourdomain.com',  // 프로덕션 프론트엔드 주소
  credentials: true
}));
```

### 4. 쿠키 Secure 설정
프로덕션에서는 HTTPS 필수:
```typescript
// server.ts
session({
  cookie: {
    secure: process.env.NODE_ENV === 'production',  // HTTPS에서만 쿠키 전송
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
})
```

---

## 트러블슈팅

### 문제 1: 로그인 후 사용자 정보가 안 불러와져요

**원인**: `credentials: 'include'`를 빼먹었을 가능성

**해결**:
```javascript
fetch(url, {
  credentials: 'include'  // 추가!
})
```

### 문제 2: CORS 에러가 발생해요

**원인**: 백엔드 CORS 설정 누락

**해결**: 백엔드에 CORS 미들웨어 추가 (위 CORS 설정 참고)

### 문제 3: 카카오 로그인 후 "Redirect URI mismatch" 에러

**원인**: 카카오 개발자 콘솔의 Redirect URI가 잘못 설정됨

**해결**: `http://localhost:3000/auth/kakao/callback`으로 정확히 설정

### 문제 4: 로그인 후 아무 반응이 없어요

**원인**: 콜백 처리 로직 누락

**해결**: 위의 "로그인 후 리다이렉트 처리" 섹션 참고

---

**문서 버전**: 1.0
**최종 업데이트**: 2025-11-04
