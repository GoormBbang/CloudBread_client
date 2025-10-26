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
  FREE: "자유 질문", // (FREE는 보통 이 로직을 타지 않지만, 완전성을 위해 추가)
};

type CreateSessionVariables = {
  topic: AiChatTopic;
  initialMessage?: string; // API에는 없지만, onSuccess 로직에서 필요
};

export const useCreateChatSession = () => {
  const navigation = useNavigation<NavigationProp>();

  return useMutation<void, Error, CreateSessionVariables, unknown>({
    mutationFn: async (variables: CreateSessionVariables) => {
      const { topic, initialMessage } = variables;

      // 1. API 호출 전, 기존 세션 확인
      const existingSession = await getActiveSession();

      // 2. [Case 1: 세션 재사용]
      // 기존 세션이 있고, 선택한 토픽이 현재 토픽과 같은 경우
      if (existingSession) {
        // 재사용할 세션을 만듭니다.
        const updatedSession: ChatSessionData = {
          ...existingSession,
          messages: [...existingSession.messages], // 메시지 배열 복사
        };

        // (기존 onSuccess 로직과 동일)
        // initialMessage가 있다면 메시지 목록에 추가
        if (initialMessage) {
          const userMsg: Message = {
            role: "user",
            content: initialMessage,
            timestamp: new Date().toISOString(),
          };
          updatedSession.messages.push(userMsg);

          // 하드코딩된 답변 확인
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
          // topic을 사용해 TOPIC_TITLES 객체에서 title을 가져옴
          const title = TOPIC_TITLES[topic];

          const introBotMessage: Message = {
            role: "assistant",
            // title이 존재할 경우에만 메시지 생성
            content: title
              ? `${title}에 대해 어떤 점이 궁금하신가요?`
              : "어떤 점이 궁금하신가요?", // (혹시 모를 예외 처리)
            timestamp: new Date().toISOString() + "_a",
          };
          updatedSession.messages.push(introBotMessage);
        }
        // 수정된 세션을 저장 (API 호출 없음)
        await saveActiveSession(updatedSession);
      } else {
        // 3. [Case 2: 세션 신규 생성]
        // 기존 세션이 없거나, 토픽이 다른 경우
        await clearActiveSession(); // 기존 세션(있다면) 삭제

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

        // (기존 onSuccess 로직과 동일)
        // initialMessage가 있다면 메시지 목록에 추가
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
          // topic을 사용해 TOPIC_TITLES 객체에서 title을 가져옴
          const title = TOPIC_TITLES[topic];

          const introBotMessage: Message = {
            role: "assistant",
            // title이 존재할 경우에만 메시지 생성
            content: title
              ? `${title}에 대해 어떤 점이 궁금하신가요?`
              : "어떤 점이 궁금하신가요?", // (혹시 모를 예외 처리)
            timestamp: new Date().toISOString() + "_a",
          };
          newSession.messages.push(introBotMessage);
        }

        // 새 세션을 저장
        await saveActiveSession(newSession);
      }
    }, // --- mutationFn 끝 ---

    // 4. [수정] onSuccess는 네비게이션만 담당
    onSuccess: () => {
      navigation.navigate("ChatBotDetail");
    },

    // 5. onError는 동일
    onError: (error: Error) => {
      console.error("AI 채팅 세션 생성/업데이트 실패:", error);
      Alert.alert("오류", "채팅을 시작하지 못했습니다.");
    },
  });
};

// --- [수정 2] usePostChatMessage ---

// 1. `mutate` 함수에 전달될 Variables 타입을 정의합니다.
type PostMessageVariables = {
  sessionId: string;
  topic: AiChatTopic;
  message: string;
};

/**
 * AI 채팅 메시지를 전송하는 Mutation Hook (ChatBotDetail.tsx용)
 */
export const usePostChatMessage = () => {
  // 2. useMutation에 제네릭 타입을 명시합니다.
  return useMutation<
    ApiResponse<PostMessageResponse>, // TData
    Error, // TError
    PostMessageVariables, // TVariables
    unknown // TContext
  >({
    // 3. [FIX] mutationFn을 객체 내부에 정의합니다.
    mutationFn: postChatMessage,
  });
};
