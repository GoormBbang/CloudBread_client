import apiClient from '../client';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface SendMessageRequest {
  sessionId?: string;
  message: string;
}

export interface SendMessageResponse {
  message: string;
  timestamp: string;
}

//챗봇으로 넘어갈 때 음식 정보 불러오기
export const postFoodInfo = async (foodId: string) => {
    const response = await apiClient.post(`/nutrition-chat/session`,{
        foodId: foodId,
    });
    return response.data;
};

//챗봇 메시지 전송
export const sendChatMessage = async (message: string, sessionId: string) => {
    const response = await apiClient.post<SendMessageResponse>('/nutrition-chat/message', {
        sessionId,
        message,
    });
    return response.data;
 
};
