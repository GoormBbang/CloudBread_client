# 알림 기능 구현 가이드

## 📋 개요

SSE (Server-Sent Events) 방식을 사용한 실시간 알림 시스템입니다.

## 🏗️ 구조

### 1. 파일 구조

```
src/
├── api/
│   └── services/
│       ├── alarm.ts                     # 알림 구독/해지 API (사용 안함)
│       └── notificationStream.ts        # SSE 스트림 관리
├── store/
│   └── notificationStore.ts             # 알림 상태 관리 (Zustand)
├── components/
│   └── common/
│       └── NotificationBadge.tsx        # 알림 배지 UI
├── screens/
│   ├── home/
│   │   └── Home.tsx                     # 알림 스트림 시작 및 수신
│   └── notification/
│       └── NotificationList.tsx         # 알림 목록 화면
└── navigation/
    └── RootNavigator.tsx                # 알림 화면 라우팅
```

## 🔧 주요 기능

### 1. SSE 스트림 연결 (`notificationStream.ts`)

```typescript
// 스트림 시작
startNotificationStream();

// 스트림 중지
stopNotificationStream();

// 알림 수신 리스너 등록
const unsubscribe = addNotificationListener((notification) => {
  console.log('알림 수신:', notification);
});
```

**특징:**
- EventSourcePolyfill 사용 (React Native 호환)
- Authorization 헤더 자동 추가
- 자동 재연결 지원
- keepalive 이벤트 처리

### 2. 알림 Store (`notificationStore.ts`)

```typescript
interface Notification {
  id: string;
  title: string;
  message: string;
  type?: string;
  data?: any;
  lastEventId?: string;
  receivedAt: string;
  isRead: boolean;
}
```

**주요 메서드:**
- `addNotification()` - 알림 추가 (중복 제거)
- `markAsRead()` - 특정 알림 읽음 처리
- `markAllAsRead()` - 모든 알림 읽음 처리
- `removeNotification()` - 알림 삭제
- `clearNotifications()` - 모든 알림 삭제

### 3. Home 화면 통합

```typescript
useEffect(() => {
  // 알림 스트림 시작
  startNotificationStream();
  
  // 알림 수신 리스너
  const unsubscribe = addNotificationListener((notification) => {
    addNotification({
      id: notification.id || notification.lastEventId,
      title: notification.title,
      message: notification.message,
      receivedAt: new Date().toISOString(),
    });
  });

  return () => {
    unsubscribe();
    stopNotificationStream();
  };
}, []);
```

### 4. 알림 UI

- **배지:** 읽지 않은 알림 개수 표시
- **알림 목록:** 모든 알림 확인
- **인앱 알림:** Alert로 즉시 표시 (선택사항)

## 📡 SSE 서버 사양

### 엔드포인트
```
GET /notifications/subscribe?token={accessToken}
```

### 이벤트 타입

1. **notification** - 알림 수신
```json
{
  "id": "notification-123",
  "title": "새 알림",
  "message": "알림 내용",
  "type": "info",
  "data": {}
}
```

2. **keepalive** - 연결 유지
```
event: keepalive
data: ping
```

## 🚀 사용 방법

### 1. 패키지 설치

```bash
npm install event-source-polyfill date-fns
```

### 2. 환경 변수 설정

`.env` 파일에 API URL 추가:
```
EXPO_PUBLIC_API_URL=https://your-api-url.com/api
```

### 3. 알림 화면 이동

```typescript
navigation.navigate('NotificationList');
```

## 📱 화면 예시

### Home 화면
- 우측 상단 벨 아이콘
- 읽지 않은 알림 배지 표시
- 클릭 시 알림 목록으로 이동

### 알림 목록 화면
- 모든 알림 표시 (최신순)
- 읽지 않은 알림: 핑크색 배경
- 읽은 알림: 흰색 배경
- 개별 삭제 / 전체 삭제
- 전체 읽음 처리

## 🔄 생명주기

```
앱 시작 (Home 화면 마운트)
  ↓
SSE 스트림 연결
  ↓
알림 수신 대기
  ↓
알림 수신 → Store 저장 → UI 업데이트
  ↓
앱 종료 (Home 화면 언마운트)
  ↓
SSE 스트림 종료
```

## ⚠️ 주의사항

1. **토큰 관리**
   - `authStore`의 `accessToken` 자동 사용
   - 토큰 만료 시 재연결 필요

2. **메모리 관리**
   - 컴포넌트 언마운트 시 리스너 해제 필수
   - 스트림 종료 시 메모리 정리

3. **에러 처리**
   - 네트워크 오류 시 자동 재연결
   - 실패 시 조용히 처리 (앱 사용에 지장 없음)

4. **중복 방지**
   - 같은 ID의 알림은 중복 저장 안됨
   - lastEventId를 ID로 사용 가능

## 🎯 개선 가능 사항

1. **오프라인 지원**
   - AsyncStorage에 알림 저장
   - 재연결 시 미수신 알림 동기화

2. **푸시 알림 통합**
   - expo-notifications 사용
   - 백그라운드 알림 수신

3. **알림 필터링**
   - 타입별 필터링
   - 날짜별 필터링

4. **알림 설정**
   - 알림 타입별 on/off
   - 알림음 설정

## 📚 참고 자료

- [EventSource MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
- [event-source-polyfill](https://github.com/Yaffle/EventSource)
- [Zustand](https://github.com/pmndrs/zustand)

