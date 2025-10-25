import apiClient from "../client";
import { ApiResponse } from "../types/common";
import {
  AiChatTopic,
  CreateSessionResponse,
  PostMessageResponse,
} from "../types/chatbot";

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
