import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Header from "../../components/common/Header";
import { useFocusEffect } from "@react-navigation/native";
import {
  getActiveSession,
  saveActiveSession,
  ChatSessionData,
} from "../../store/chatStorage";
import { Message, AiChatTopic } from "../../api/types/chatbot";
import { usePostChatMessage } from "../../hooks/chatbot";
import AssistantHeader from "../../components/chatbot/AssistantHeader";

import MessageInputBar from "../../components/chatbot/MessageInputBar";
import MessageBubble from "../../components/chatbot/MessageBubble";

export default function ChatBotDetail({ navigation }: any) {
  const [session, setSession] = useState<ChatSessionData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);

  const { mutate: postMessageMutate, isPending } = usePostChatMessage();

  const scrollViewRef = useRef<ScrollView>(null);

  const callPostMessage = React.useCallback(
    (
      textToSend: string,
      topic: AiChatTopic,
      sessionId: string,
      optimisticMessage?: Message
    ) => {
      postMessageMutate(
        { sessionId, topic, message: textToSend },
        {
          onSuccess: (data) => {
            const assistantMessage: Message = {
              role: "assistant",
              content:
                data?.result?.response ||
                "AI가 응답을 생성하지 못했습니다. 다시 시도해주세요.",
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
            setSession((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                currentTopic: data?.result?.topic || prev.currentTopic,
              };
            });
          },
          onError: (error) => {
            console.error(error);
            Alert.alert("오류", "메시지 전송에 실패했습니다.");
            if (optimisticMessage) {
              setMessages((prev) =>
                prev.filter(
                  (msg) => msg.timestamp !== optimisticMessage.timestamp
                )
              );
            }
          },
        }
      );
    },
    [postMessageMutate]
  );

  useFocusEffect(
    React.useCallback(() => {
      const loadSession = async () => {
        setIsInitializing(true);
        const activeSession = await getActiveSession();

        if (!activeSession) {
          Alert.alert("세션 만료", "채팅 세션이 만료되었습니다.");
          navigation.goBack();
          return;
        }

        setSession(activeSession);
        setMessages(activeSession.messages);
        setIsInitializing(false);

        if (
          activeSession.messages.length > 0 &&
          activeSession.messages[activeSession.messages.length - 1].role ===
            "user"
        ) {
          const lastMessage =
            activeSession.messages[activeSession.messages.length - 1];
          callPostMessage(
            lastMessage.content,
            activeSession.currentTopic,
            activeSession.sessionId
          );
        }
      };

      loadSession();
    }, [navigation, callPostMessage])
  );

  // useEffect (동일)
  useEffect(() => {
    if (!isInitializing && session) {
      saveActiveSession({ ...session, messages: messages }).catch((err) =>
        console.error("Failed to save session on change:", err)
      );
    }

    if (messages.length > 0) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages, session, isInitializing]);

  // handleSend 핸들러 (동일)
  const handleSend = () => {
    if (isPending || !session) return;
    const textToSend = messageInput.trim();
    if (textToSend.length === 0) return;

    const userMessage: Message = {
      role: "user",
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessageInput("");
    setMessages((prev) => [...prev, userMessage]);

    callPostMessage(
      textToSend,
      session.currentTopic,
      session.sessionId,
      userMessage
    );
  };

  // 초기 로딩 화면 (동일)
  if (isInitializing || !session) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#E46592" />
        <Text>채팅방을 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  // 렌더링 (동일)
  return (
    <View className="flex-1 bg-white">
      <Header title="챗봇" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          className="flex-1"
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          <AssistantHeader variant="compact" />

          <View className="p-4">
            {/* [수정] import한 MessageBubble 컴포넌트 사용 */}
            {messages.map((msg, index) => (
              <MessageBubble key={msg.timestamp + index} message={msg} />
            ))}

            {isPending && (
              <View className="self-start p-3 px-4 my-1">
                <ActivityIndicator size="small" color="#E46592" />
              </View>
            )}
          </View>
        </ScrollView>

        {/* [수정] import한 MessageInputBar 컴포넌트 사용 */}
        <MessageInputBar
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          handleSend={handleSend}
          isPending={isPending}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
