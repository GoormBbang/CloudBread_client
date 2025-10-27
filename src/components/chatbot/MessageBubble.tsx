import React from "react";
import { View, Text } from "react-native";
import { Message } from "../../api/types/chatbot";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";
  return (
    <View
      className={`
        p-3 px-4 rounded-2xl max-w-[80%] my-1
        ${isUser ? "bg-[#E46592] self-end" : "bg-gray-200 self-start"}
        ${isUser ? "rounded-br-none" : "rounded-bl-none"}
      `}
    >
      <Text className={isUser ? "text-white" : "text-black"}>
        {message.content}
      </Text>
    </View>
  );
};

export default MessageBubble;
