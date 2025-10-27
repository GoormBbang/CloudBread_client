import apiClient from '../client';
import { ApiResponse } from "../types/common";
import {
  AiChatTopic,
  CreateSessionResponse,
  PostMessageResponse,
} from "../types/chatbot";

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

//영양분석 후 챗봇 메시지 전송
export const sendChatMessage = async (message: string, sessionId: string) => {
    const response = await apiClient.post<SendMessageResponse>('/nutrition-chat/message', {
        sessionId,
        message,
    });
    return response.data;
 
//////아래부터 일반 챗봇//////
  
//새 AI 채팅 세션 생성
export const createChatSession = async (payload: { topic: AiChatTopic }) => {
  const response = await apiClient.post<ApiResponse<CreateSessionResponse>>(
    "/ai-chat/session",
    payload,
    {
      timeout: 30000,
    }
  );
  return response.data;
};

//AI 채팅 메시지 전송
export const postChatMessage = async (payload: {
  sessionId: string;
  topic: AiChatTopic;
  message: string;
}): Promise<ApiResponse<PostMessageResponse>> => {
  const response = await apiClient.post<ApiResponse<PostMessageResponse>>(
    "/ai-chat/message",
    payload,
    {
      timeout: 30000,
    }
  );
  return response.data;

};
