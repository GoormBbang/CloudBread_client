import React from "react";
import { View, Text, Switch, Image, ImageSourcePropType } from "react-native";

// 컴포넌트가 받을 props 타입을 정의합니다.
interface NotificationSettingRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  label: string;
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

const NotificationSettingItem: React.FC<NotificationSettingRowProps> = ({
  icon,
  title,
  description,
  label,
  isEnabled,
  onToggle,
}) => {
  return (
    <View className="mb-6">
      {/* 상단: 아이콘, 제목, 설명 */}
      <View className="flex-row items-center">
        {icon}
        <View className="ml-4 flex-1">
          <Text className="text-base font-bold text-gray-800">{title}</Text>
          <Text className="text-sm text-gray-500">{description}</Text>
        </View>
      </View>

      {/* 하단: 알림 설명, 토글 스위치 */}
      <View className="flex-row justify-between items-center mt-3 bg-gray-50 p-3 rounded-lg">
        <Text className="text-gray-700">{label}</Text>
        <Switch
          trackColor={{ false: "#E5E7EB", true: "#E46592" }} // false일 때와 true일 때의 트랙 색상
          thumbColor={isEnabled ? "white" : "#f4f3f4"} // 토글 버튼 색상
          ios_backgroundColor="#E5E7EB"
          onValueChange={onToggle}
          value={isEnabled}
        />
      </View>
    </View>
  );
};

export default NotificationSettingItem;
