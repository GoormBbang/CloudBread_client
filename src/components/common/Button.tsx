import React from "react";
import { Pressable, Text } from "react-native";

interface ButtonProps {
  text: string; // 버튼에 표시될 텍스트
  onPress: () => void; // 버튼을 눌렀을 때 실행될 함수
  disabled?: boolean; // 버튼 비활성화 여부
  className?: string; // 추가적인 커스텀 클래스
  variant?: "SOLID" | "SOFT"; // 진한색 | 연한색
}

function Button({
  text,
  onPress,
  disabled = false,
  className,
  variant = "SOLID",
}: ButtonProps) {
  const style = {
    SOLID: {
      background: "bg-main-pink",
      color: "text-white",
    },
    SOFT: {
      background: "bg-btn-pink",
      color: "text-black",
    },
  };
  const disabledStyle = disabled ? "opacity-80" : "";

  return (
    <Pressable
      className={`py-4 rounded-md items-center justify-center ${className} w-full ${style[variant].background} ${disabledStyle}`}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className={`text-base font-semibold ${style[variant].color} `}>
        {text}
      </Text>
    </Pressable>
  );
}

export default Button;
