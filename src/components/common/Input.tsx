import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string; // label을 optional로 변경 (수정된 부분)
  className?: string;
  // disabled prop 추가 (선택적)
  disabled?: boolean;
  variant?: "CAMERA"; // 스타일 분기를 위한 variant prop 추가 (수정된 부분)
}

const Input = ({
  label,
  className,
  disabled = false, // props에서 disabled를 받아오고 기본값을 false로 설정
  variant,
  ...rest
}: InputProps) => {
  const isCamera = variant === "CAMERA"; // CAMERA variant인지 확인

  const textInputStyle = disabled
    ? "bg-gray-100 text-gray-400" // 비활성화 상태 스타일
    : "bg-white text-black"; // 활성화 상태 스타일

  const paddingStyle = isCamera ? "px-4 py-1" : "p-4";
  const fontSizeStyle = isCamera ? "text-[14px]" : "text-base";

  return (
    <View className={`${className} w-full`}>
      {label && (
        <Text
          className={`text-base font-bold mb-2 ${disabled ? "text-gray-400" : "text-gray-800"}`}
        >
          {label}
        </Text>
      )}
      <TextInput
        className={`w-full border border-input-gray rounded-lg ${paddingStyle} ${fontSizeStyle} ${textInputStyle}`} // 동적 스타일 적용 (수정된 부분)
        editable={!disabled}
        placeholderTextColor={disabled ? "#CBD5E1" : "#9CA3AF"}
        style={{ textAlignVertical: "center" }}
        {...rest}
      />
    </View>
  );
};

export default Input;
