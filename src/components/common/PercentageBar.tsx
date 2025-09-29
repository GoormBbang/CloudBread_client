import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface PercentageBarProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
}

export default function PercentageBar({
  percentage,
  size = 120,
  strokeWidth = 6,
  color = "#E7E2E2",
  backgroundColor = "#F3F4F6",
  label
}: PercentageBarProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View className="items-center justify-center">
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} className="absolute">
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-270 ${size / 2} ${size / 2})`}
          />
        </Svg>
        {/* Center content */}
        <View 
          style={{
            position: 'absolute',
            top: size / 2 - 12, // 텍스트 높이의 절반만큼 위로
            left: size / 2 - 20, // 텍스트 너비의 절반만큼 왼쪽으로
            justifyContent: 'center',
            alignItems: 'center',
            width: 40,
            height: 24
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#000000', textAlign: 'center' }}>
            {percentage}%
          </Text>
        </View>
      </View>
      {label && (
        <Text className="text-xs text-gray-500 mt-2">{label}</Text>
      )}
    </View>
  );
}
