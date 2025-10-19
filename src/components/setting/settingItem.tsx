import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

interface SettingItemProps {
  icon: React.ReactNode; // 아이콘 컴포넌트
  label: string; // 설정 항목 이름
  onPress: () => void; // 클릭 시 실행될 함수
}

export default function SettingItem({
  icon,
  label,
  onPress,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between bg-white p-4 rounded-lg mb-3 border border-gray-200"
    >
      <View className="flex-row items-center">
        {icon}
        <Text className="text-base ml-3">{label}</Text>
      </View>
      <ChevronRight size={20} color="gray" />
    </TouchableOpacity>
  );
}
