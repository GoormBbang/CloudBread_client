import AsyncStorage from "@react-native-async-storage/async-storage";
import { Message, AiChatTopic } from "../api/types/chatbot";

export const STORAGE_KEY = "chat-session";

export interface ChatSessionData {
  sessionId: string;
  expiresAt: string; // ISO string
  messages: Message[];
  currentTopic: AiChatTopic;
}

/**
 * 활성화된 채팅 세션을 AsyncStorage에 저장합니다 (비동기식)
 */
export const saveActiveSession = async (session: ChatSessionData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("Failed to save session:", error);
  }
};

/**
 * 활성화된 채팅 세션을 AsyncStorage에서 불러옵니다 (비동기식)
 */
export const getActiveSession = async (): Promise<ChatSessionData | null> => {
  try {
    const storedData = await AsyncStorage.getItem(STORAGE_KEY);
    if (!storedData) return null;

    const session: ChatSessionData = JSON.parse(storedData);

    // 2시간 유효기간 검사
    if (new Date() > new Date(session.expiresAt)) {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return session;
  } catch (error) {
    console.error("Failed to load session:", error);
    return null;
  }
};

/**
 * 활성화된 세션을 삭제합니다.
 */
export const clearActiveSession = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear session:", error);
  }
};
