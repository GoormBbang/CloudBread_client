import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Send } from "lucide-react-native";

interface MessageInputBarProps {
  messageInput: string;
  setMessageInput: (text: string) => void;
  handleSend: () => void;
  isPending: boolean;
}

const MessageInputBar: React.FC<MessageInputBarProps> = ({
  messageInput,
  setMessageInput,
  handleSend,
  isPending,
}) => {
  return (
    <View className="flex-row items-center px-4 py-6 border-t border-gray-200 bg-white">
      <TextInput
        className="flex-1 bg-gray-100 rounded-2xl h-10 px-4 mr-3"
        placeholder="궁금한 것을 입력해주세요..."
        value={messageInput}
        onChangeText={setMessageInput}
        editable={!isPending}
        // 키보드의 '보내기' 버튼으로도 전송되도록 추가
        onSubmitEditing={handleSend}
        returnKeyType="send"
      />
      <TouchableOpacity
        style={{ backgroundColor: "#E46592" }}
        className="w-10 h-10 rounded-full justify-center items-center"
        onPress={handleSend}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Send size={20} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default MessageInputBar;
