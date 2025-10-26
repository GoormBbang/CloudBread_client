import React from "react";
import { View, Text } from "react-native";
import { Bot } from "lucide-react-native";

interface AiAssistantCardProps {
  variant?: "full" | "compact";
}

export default function AssistantHeader({
  variant = "full",
}: AiAssistantCardProps) {
  return (
    <View
      className={`bg-[#FFE2E2] ${variant === "full" ? " p-8" : "p-4"}  flex-column items-center`}
    >
      <View className="w-16 h-16 bg-[#E46592] rounded-full justify-center items-center mb-4 shadow-sm">
        <Bot size={36} color="white" />
      </View>

      <View className="flex-1 flex justify-center items-center">
        <Text
          className={`text-lg font-bold text-[#E46592] ${variant === "full" && "my-2"}`}
        >
          AI 건강 어시스턴트
        </Text>
        {variant === "full" && (
          <Text className="text-gray-600 leading-5 text-center">
            음식, 영양제, 상황별 문제 관련 궁금한 점을
            {"\n"}자유롭게 물어보세요.
            {"\n"}AI 건강 어시스턴트가 해결해드릴게요!
          </Text>
        )}
      </View>
    </View>
  );
}
