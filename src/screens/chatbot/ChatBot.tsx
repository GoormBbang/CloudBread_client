import React from "react";
import { View, Text } from "react-native";
import Header from "../../components/common/Header";

export default function ChatBot() {
  return (
    <View className="flex-1">
      <Header title="챗봇" />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>챗봇 화면</Text>
      </View>
    </View>
  );
}
