import { useNavigation } from "@react-navigation/native";
import { Bell, ChevronLeft } from "lucide-react-native";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface HeaderProps {
  title: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
}

export default function Header({
  title,
  leftComponent,
  rightComponent,
}: HeaderProps) {
  const navigation = useNavigation();
  return (
    <View className="w-screen h-24 bg-white flex flex-row items-center justify-between px-4 border-b border-gray-200">
      <TouchableOpacity
        className="flex-1 flex-row items-center justify-start mt-8"
        onPress={() => navigation.goBack()}
      >
        <ChevronLeft size={24} color="black" />
      </TouchableOpacity>
      <View className="flex-2 items-center justify-center">
        <Text className="text-lg font-bold text-black text-center mt-8">
          {title}
        </Text>
      </View>
      <View className="flex-1 flex-row items-center justify-end mt-8"></View>
    </View>
  );
}
