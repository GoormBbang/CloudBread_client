export type AiChatTopic = "FOOD_INFO" | "PREGNANCY_DRUG" | "PREGNANCY" | "FREE";

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// API 응답 타입
export interface CreateSessionResponse {
  sessionId: string;
  topic: AiChatTopic;
  expiresAt: string;
}

export interface PostMessageResponse {
  sessionId: string;
  topic: AiChatTopic;
  response: string;
  message_history: Message[];
}
