import React from "react";
import { View } from "react-native";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return <View className={`bg-white rounded-lg border border-gray-200 p-4 min-h-[120px] ${className || ''}`}>{children}</View>;
}
