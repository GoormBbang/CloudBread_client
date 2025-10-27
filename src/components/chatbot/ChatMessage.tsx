import React from "react";
import { View, Text, Image } from "react-native";
import { ChatMessage as ChatMessageType } from "../../api/services/chatbot";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <View
      className={`flex-row mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <View className="w-10 h-10 rounded-full bg-pink-100 mr-2 items-center justify-center overflow-hidden">
          <Image
            source={require("../../../assets/image/bot.png")}
            className="w-8 h-8"
            resizeMode="contain"
          />
        </View>
      )}
      
      <View className={`max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <View
          className={`rounded-2xl px-4 py-3 ${
            isUser ? "bg-pink-500" : "bg-gray-100"
          }`}
        >
          <Text
            className={`text-base ${isUser ? "text-white" : "text-gray-800"}`}
          >
            {message.content}
          </Text>
        </View>
        <Text className="text-xs text-gray-400 mt-1 px-2">
          {formatTime(message.timestamp)}
        </Text>
      </View>

      {isUser && (
        <View className="w-10 h-10 rounded-full bg-pink-500 ml-2 items-center justify-center">
          <Text className="text-white font-bold text-lg">나</Text>
        </View>
      )}
    </View>
  );
};

const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "오후" : "오전";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${ampm} ${displayHours}:${displayMinutes}`;
};

export default ChatMessage;

