import { useAuthStore } from "../../store/authStore";
import apiClient, { getAuthToken } from "../client";

// 알림 구독 API
export const subscribeAlarm = async () => {
    // const token = await getAuthToken();
    const {accessToken} = useAuthStore.getState();
    console.log('🔍 token:', accessToken);
  try {
    const response = await apiClient.get(`/notifications/subscribe?token=${accessToken}`);
    console.log('✅ 알림 구독 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 알림 구독 실패:', error);
    throw error;
  }
};

// 알림 구독 해지 API
export const unsubscribeAlarm = async () => {
  try {
    const response = await apiClient.delete('/notifications/unsubscribe');
    console.log('✅ 알림 구독 해지 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 알림 구독 해지 실패:', error);
    throw error;
  }
};

