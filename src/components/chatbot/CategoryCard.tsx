import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LucideIcon } from "lucide-react-native";

interface CategoryCardProps {
  IconComponent: LucideIcon;
  title: string;
  description: string;
  onPress?: () => void;
  iconColor?: string;
}

export default function CategoryCard({
  IconComponent,
  title,
  description,
  onPress = () => {},
  iconColor = "#FFFFFF",
}: CategoryCardProps) {
  return (
    <TouchableOpacity
      className="bg-white p-4 rounded-lg flex-row items-center mb-3 border border-[#F5BCBC]"
      onPress={onPress}
    >
      <View className="w-12 h-12 bg-[#F5BCBC] rounded-full justify-center items-center mr-4">
        <IconComponent size={24} color={iconColor} strokeWidth={2.5} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800">{title}</Text>
        <Text className="text-sm text-gray-500">{description}</Text>
      </View>
    </TouchableOpacity>
  );
}
