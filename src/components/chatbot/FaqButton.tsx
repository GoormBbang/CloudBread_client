import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface FaqButtonProps {
  question: string;
  onPress?: () => void;
}

export default function FaqButton({ question, onPress }: FaqButtonProps) {
  return (
    <TouchableOpacity
      className="bg-white p-3.5 rounded-lg border mb-2"
      style={{
        borderWidth: 1,
        borderColor: "rgba(57, 100, 56, 0.5)",
      }}
      onPress={onPress}
    >
      <Text className="text-gray-700">“{question}”</Text>
    </TouchableOpacity>
  );
}
