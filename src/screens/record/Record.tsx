import React from "react";
import { View, Text } from "react-native";
import Header from "../../components/common/Header";

export default function Record() {
  return (
    <View className="flex-1">
      <Header title="기록" />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>기록 화면</Text>
      </View>
    </View>
  );
}
