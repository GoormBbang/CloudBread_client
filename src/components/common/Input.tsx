import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label: string;
  className?: string;
  // disabled prop 추가 (선택적)
  disabled?: boolean;
}

const Input = ({
  label,
  className,
  disabled = false, // props에서 disabled를 받아오고 기본값을 false로 설정
  ...rest
}: InputProps) => {
  const textInputStyle = disabled
    ? "bg-gray-100 text-gray-400" // 비활성화 상태 스타일
    : "bg-white text-black"; // 활성화 상태 스타일

  return (
    <View className={`${className} w-full`}>
      <Text
        className={`text-base font-bold mb-2 ${disabled ? "text-gray-400" : "text-gray-800"}`}
      >
        {label}
      </Text>
      <TextInput
        className={`w-full border border-input-gray rounded-lg p-4 text-base ${textInputStyle}`}
        editable={!disabled}
        placeholderTextColor={disabled ? "#CBD5E1" : "#9CA3AF"}
        style={{ textAlignVertical: "center" }}
        {...rest}
      />
    </View>
  );
};

export default Input;
