import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type?: string;
  data?: any;
  lastEventId?: string;
  receivedAt: string;
  isRead: boolean;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  
  // 알림 추가 (중복 제거)
  addNotification: (notification: Omit<Notification, 'isRead'>) => void;
  
  // 알림 읽음 처리
  markAsRead: (id: string) => void;
  
  // 모든 알림 읽음 처리
  markAllAsRead: () => void;
  
  // 알림 삭제
  removeNotification: (id: string) => void;
  
  // 모든 알림 삭제
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => set((state) => {
    // 중복 제거 (같은 ID가 이미 있으면 업데이트)
    const exists = state.notifications.find(n => n.id === notification.id);
    
    let newNotifications: Notification[];
    if (exists) {
      // 기존 알림 업데이트
      newNotifications = state.notifications.map(n => 
        n.id === notification.id 
          ? { ...notification, isRead: n.isRead } 
          : n
      );
    } else {
      // 새 알림 추가 (최신순으로 정렬)
      newNotifications = [
        { ...notification, isRead: false },
        ...state.notifications
      ];
    }

    const unreadCount = newNotifications.filter(n => !n.isRead).length;

    return {
      notifications: newNotifications,
      unreadCount,
    };
  }),

  markAsRead: (id) => set((state) => {
    const newNotifications = state.notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    );
    const unreadCount = newNotifications.filter(n => !n.isRead).length;

    return {
      notifications: newNotifications,
      unreadCount,
    };
  }),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true })),
    unreadCount: 0,
  })),

  removeNotification: (id) => set((state) => {
    const newNotifications = state.notifications.filter(n => n.id !== id);
    const unreadCount = newNotifications.filter(n => !n.isRead).length;

    return {
      notifications: newNotifications,
      unreadCount,
    };
  }),

  clearNotifications: () => set({
    notifications: [],
    unreadCount: 0,
  }),
}));

