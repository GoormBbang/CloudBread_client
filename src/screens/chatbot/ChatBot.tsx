// src/screens/ai-chat/ChatBot.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Baby, MessageCircle, Pill, Send, Utensils } from "lucide-react-native";
import Header from "../../components/common/Header";
import CategoryCard from "../../components/chatbot/CategoryCard";
import FaqButton from "../../components/chatbot/FaqButton";
import AssistantHeader from "../../components/chatbot/AssistantHeader";
import { useCreateChatSession } from "../../hooks/chatbot"; // [수정]
import { AiChatTopic } from "../../api/types/chatbot"; // [수정]

export default function ChatBot() {
  const [message, setMessage] = useState("");

  // --- [수정] ---
  const { mutate: createSession, isPending: isCreatingSession } =
    useCreateChatSession();
  // --- [수정 끝] ---

  // 1. '어떤 것이 궁금하신가요?' 카드 클릭 핸들러
  const handleCategoryPress = (topic: AiChatTopic) => {
    // API 훅 호출 (초기 메시지 없음)
    createSession({ topic });
  };

  // 2. '자주 묻는 질문' 클릭 핸들러
  const handleFaqPress = (question: string) => {
    // API 훅 호출 (초기 메시지로 FAQ 질문 전달)
    createSession({
      topic: "PREGNANCY", // FAQ는 '임신' 토픽으로 고정
      initialMessage: question, // [추가]
    });
  };

  // 3. 하단 입력창 전송 핸들러
  const handleSendFreeQuestion = () => {
    if (message.trim().length === 0) return;
    // API 훅 호출 (초기 메시지로 입력 텍스트 전달)
    createSession({
      topic: "FREE",
      initialMessage: message,
    });
    setMessage(""); // 입력창 비우기
  };

  // (카테고리 및 faqs 데이터는 동일)
  const categories = [
    {
      icon: Utensils,
      title: "음식 정보",
      description: "영양 성분, 칼로리, 식단 추천",
      topic: "FOOD_INFO",
    },
    {
      icon: Pill, // [수정] 아이콘 변경
      title: "임부 금기 약물",
      description: "부작용 및 복용 가능 여부",
      topic: "PREGNANCY_DRUG",
    },
    {
      icon: Baby,
      title: "임신 관련",
      description: "임신 중 주의사항, 증상 관리",
      topic: "PREGNANCY",
    },
    {
      icon: MessageCircle,
      title: "자유 질문",
      description: "궁금한 것을 자유롭게 물어보기",
      topic: "FREE",
    },
  ];

  const faqs = [
    "임신 중 카페인 섭취량은 얼마나 괜찮나요?",
    "엽산 영양제는 언제부터 먹어야 하나요?",
    "임신 중 먹으면 안 되는 음식이 있나요?",
  ];

  return (
    <View className="flex-1 bg-white">
      <Header title="챗봇" />
      <KeyboardAvoidingView
        behavior={"padding"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <ScrollView className="flex-1">
          <AssistantHeader />

          <View className="p-4">
            <Text className="text-xl font-bold text-gray-800 mb-3">
              어떤 것이 궁금하신가요?
            </Text>
            {categories.map((item) => (
              <CategoryCard
                key={item.topic}
                IconComponent={item.icon}
                title={item.title}
                description={item.description}
                onPress={() => handleCategoryPress(item.topic as AiChatTopic)}
              />
            ))}
          </View>

          <View className="mb-6 p-4">
            <Text className="text-xl font-bold text-[#396438] mb-3">
              자주 묻는 질문
            </Text>
            {faqs.map((question) => (
              <FaqButton
                key={question}
                question={question}
                onPress={() => handleFaqPress(question)}
              />
            ))}
          </View>
        </ScrollView>

        <View className="flex-row items-center p-4 border-t border-gray-200 bg-white">
          <TextInput
            className="flex-1 bg-gray-100 rounded-2xl h-10 px-4 mr-3"
            placeholder="궁금한 것을 입력해주세요..."
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity
            className="w-10 h-10 bg-pink-500 rounded-full justify-center items-center"
            onPress={handleSendFreeQuestion}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>

        {isCreatingSession && (
          <View className="absolute inset-0 bg-black/30 justify-center items-center">
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text className="text-white mt-2">채팅방에 입장하는 중...</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
