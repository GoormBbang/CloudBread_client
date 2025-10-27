import { EventSourcePolyfill } from 'event-source-polyfill';
import { useAuthStore } from '../../store/authStore';

let eventSource: EventSourcePolyfill | null = null;
let notificationListeners: ((notification: any) => void)[] = [];

// 알림 수신 리스너 등록
export function addNotificationListener(callback: (notification: any) => void) {
  notificationListeners.push(callback);
  return () => {
    notificationListeners = notificationListeners.filter(cb => cb !== callback);
  };
}

// 모든 리스너에게 알림 전파
function notifyListeners(notification: any) {
  notificationListeners.forEach(callback => {
    try {
      callback(notification);
    } catch (error) {
      console.error('❌ 알림 리스너 실행 중 오류:', error);
    }
  });
}

// 알림 스트림 시작
export function startNotificationStream() {
  if (eventSource) {
    console.log('⚠️ 알림 스트림이 이미 실행 중입니다.');
    return;
  }

  const { accessToken } = useAuthStore.getState();
  if (!accessToken) {
    console.error('❌ 액세스 토큰이 없어 알림 스트림을 시작할 수 없습니다.');
    return;
  }

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';
  const url = `${API_BASE_URL}/notifications/subscribe?token=${encodeURIComponent(accessToken)}`;

  console.log('🔔 알림 스트림 시작:', url);

  try {
    eventSource = new EventSourcePolyfill(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      heartbeatTimeout: 86400000, // 24시간
    });

    // 알림 이벤트 수신
    eventSource.addEventListener('notification', (event: any) => {
      try {
        console.log('📩 알림 수신:', event.data);
        const notification = JSON.parse(event.data);
        const lastId = event.lastEventId;
        
        // 알림 객체에 lastEventId 추가
        const notificationWithId = {
          ...notification,
          lastEventId: lastId,
          receivedAt: new Date().toISOString(),
        };

        // 모든 리스너에게 알림 전파
        notifyListeners(notificationWithId);
      } catch (error) {
        console.error('❌ 알림 파싱 오류:', error);
      }
    });

    // Keepalive 이벤트 (연결 유지)
    eventSource.addEventListener('keepalive', () => {
      console.log('💓 Keepalive 수신');
    });

    // 연결 성공
    eventSource.onopen = () => {
      console.log('✅ 알림 스트림 연결 성공');
    };

    // 오류 처리 (자동 재연결)
    eventSource.onerror = (error: any) => {
      console.error('❌ 알림 스트림 오류:', error);
      // EventSource는 자동으로 재연결을 시도합니다
    };

  } catch (error) {
    console.error('❌ 알림 스트림 시작 실패:', error);
    eventSource = null;
  }
}

// 알림 스트림 중지
export function stopNotificationStream() {
  if (eventSource) {
    console.log('🔕 알림 스트림 중지');
    eventSource.close();
    eventSource = null;
  }
}

// 알림 스트림 상태 확인
export function isNotificationStreamActive(): boolean {
  return eventSource !== null && eventSource.readyState === EventSourcePolyfill.CONNECTING || eventSource?.readyState === EventSourcePolyfill.OPEN;
}

// 알림 스트림 재시작
export function restartNotificationStream() {
  stopNotificationStream();
  setTimeout(() => {
    startNotificationStream();
  }, 1000);
}

