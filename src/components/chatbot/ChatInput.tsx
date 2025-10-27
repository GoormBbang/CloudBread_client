import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from "react-native";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false }) => {
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim() && !disabled) {
      onSend(inputText.trim());
      setInputText("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View className="flex-row items-center px-4 py-4 bg-white border-t border-gray-200">
        <TextInput
          className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-base mr-2"
          placeholder="메시지를 입력하세요..."
          placeholderTextColor="#9CA3AF"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
          editable={!disabled}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!inputText.trim() || disabled}
          className={`rounded-full w-10 h-10 items-center justify-center ${
            inputText.trim() && !disabled ? "bg-pink-500" : "bg-gray-300"
          }`}
        >
          <Text className="text-white font-bold text-lg">↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatInput;

