import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import {
  saveActiveSession,
  clearActiveSession,
  getActiveSession,
  ChatSessionData,
} from "../store/chatStorage";
import {
  AiChatTopic,
  CreateSessionResponse,
  Message,
  PostMessageResponse,
} from "../api/types/chatbot";
import { createChatSession, postChatMessage } from "../api/services/chatbot";
import { ApiResponse } from "../api/types/common";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ChatBotDetail"
>;

//하드코딩된 FAQ 답변
const FAQ_ANSWERS: Record<string, string> = {
  "임신 중 카페인 섭취량은 얼마나 괜찮나요?":
    "임신 중 카페인 섭취는 하루 200mg(커피 1~2잔) 이내로 권장됩니다. 하지만 개인차가 있으니 의사와 상담하는 것이 가장 좋습니다.",
  "엽산 영양제는 언제부터 먹어야 하나요?":
    "엽산은 임신 준비 기간(최소 1개월 전)부터 임신 초기 12주까지 꾸준히 섭취하는 것이 좋습니다.",
  "임신 중 먹으면 안 되는 음식이 있나요?":
    "날생선(회), 익히지 않은 육류, 생치즈, 알코올 등은 감염의 위험이 있으므로 피해야 합니다.",
};

const getHardcodedAnswer = (question: string): string | null => {
  return FAQ_ANSWERS[question] || null;
};

const TOPIC_TITLES: Record<AiChatTopic, string> = {
  FOOD_INFO: "음식 정보",
  PREGNANCY_DRUG: "임부 금기 약물",
  PREGNANCY: "임신 관련",
  FREE: "자유 질문",
};

type CreateSessionVariables = {
  topic: AiChatTopic;
  initialMessage?: string;
};
export const useCreateChatSession = () => {
  const navigation = useNavigation<NavigationProp>();

  return useMutation<void, Error, CreateSessionVariables, unknown>({
    mutationFn: async (variables: CreateSessionVariables) => {
      const { topic, initialMessage } = variables;
      const existingSession = await getActiveSession();

      // 기존 세션이 있다면
      if (existingSession) {
        // 세션이 존재하면 API 호출 없이, 요청받은 새 'topic'으로 덮어씀
        const updatedSession: ChatSessionData = {
          ...existingSession,
          currentTopic: topic,
          messages: [...existingSession.messages],
        };

        if (initialMessage) {
          const userMsg: Message = {
            role: "user",
            content: initialMessage,
            timestamp: new Date().toISOString(),
          };
          updatedSession.messages.push(userMsg);

          // 하드코딩된 답변
          const hardcodedAnswer = getHardcodedAnswer(initialMessage);
          if (hardcodedAnswer) {
            const assistantMsg: Message = {
              role: "assistant",
              content: hardcodedAnswer,
              timestamp: new Date().toISOString() + "_a",
            };
            updatedSession.messages.push(assistantMsg);
          }
        } else if (topic !== "FREE") {
          const title = TOPIC_TITLES[topic];

          const introBotMessage: Message = {
            role: "assistant",
            // title이 존재할 경우에만 메시지 생성
            content: title
              ? `${title}에 대해 어떤 점이 궁금하신가요?`
              : "어떤 점이 궁금하신가요?",
            timestamp: new Date().toISOString() + "_a",
          };
          updatedSession.messages.push(introBotMessage);
        }
        await saveActiveSession(updatedSession);
      } else {
        // 기존 세션이 없는 경우
        await clearActiveSession();

        // API를 호출하여 새 세션 생성
        const data = await createChatSession({ topic });
        const result = data.result;
        if (!result) throw new Error("AI 세션 응답 오류");

        // 새 세션 데이터 구성
        const newSession: ChatSessionData = {
          sessionId: result.sessionId,
          expiresAt: result.expiresAt,
          currentTopic: result.topic,
          messages: [],
        };

        if (initialMessage) {
          const userMsg: Message = {
            role: "user",
            content: initialMessage,
            timestamp: new Date().toISOString(),
          };
          newSession.messages.push(userMsg);

          const hardcodedAnswer = getHardcodedAnswer(initialMessage);
          if (hardcodedAnswer) {
            const assistantMsg: Message = {
              role: "assistant",
              content: hardcodedAnswer,
              timestamp: new Date().toISOString() + "_a",
            };
            newSession.messages.push(assistantMsg);
          }
        } else if (topic !== "FREE") {
          const title = TOPIC_TITLES[topic];
          const introBotMessage: Message = {
            role: "assistant",
            content: title
              ? `${title}에 대해 어떤 점이 궁금하신가요?`
              : "어떤 점이 궁금하신가요?",
            timestamp: new Date().toISOString() + "_a",
          };
          newSession.messages.push(introBotMessage);
        }
        await saveActiveSession(newSession);
      }
    },

    onSuccess: () => {
      navigation.navigate("ChatBotDetail");
    },

    onError: (error: Error) => {
      console.error("AI 채팅 세션 생성/업데이트 실패:", error);
      Alert.alert("오류", "채팅을 시작하지 못했습니다.");
    },
  });
};

type PostMessageVariables = {
  sessionId: string;
  topic: AiChatTopic;
  message: string;
};

// 메시지 전송용
export const usePostChatMessage = () => {
  return useMutation<
    ApiResponse<PostMessageResponse>, // TData
    Error, // TError
    PostMessageVariables, // TVariables
    unknown // TContext
  >({
    mutationFn: postChatMessage,
  });
};
