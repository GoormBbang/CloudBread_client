// src/components/common/OnboardingProgressBar.tsx

import React from "react";
import { View, Text } from "react-native";

interface OnboardingProgressBarProps {
  step: number;
  maxStep: number;
  text: string;
  className?: string;
}

export default function ProgressBar({
  step,
  maxStep,
  text,
  className,
}: OnboardingProgressBarProps) {
  const progress = Math.max(0, Math.min(1, step / maxStep));

  return (
    <View className={`py-4 w-full bg-white rounded-lg  ${className}`}>
      <View className="h-2 bg-back-gray rounded-full mb-4">
        <View
          className="h-full bg-main-pink rounded-full w-full"
          style={{ width: `${progress * 100}%` }}
        />
      </View>

      <View className="flex-row items-center">
        <View className="w-8 h-8 rounded-full bg-main-pink items-center justify-center mr-2">
          <Text className="text-white font-bold text-sm">{step}</Text>
        </View>
        <Text className="text-gray-700 font-medium text-base">{text}</Text>
      </View>
    </View>
  );
}
