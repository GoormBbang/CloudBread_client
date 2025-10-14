import React from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";

interface ButtonProps {
  text: string; // 버튼에 표시될 텍스트
  onPress: () => void; // 버튼을 눌렀을 때 실행될 함수
  disabled?: boolean; // 버튼 비활성화 여부
  className?: string; // 버튼 스타일용 클래스
  variant?: "SOLID" | "SOFT" | "CUSTOM"; // 진한색 | 연한색 | 커스텀
  icon?: React.ReactNode; // 아이콘 (선택사항)
  style?: ViewStyle; // React Native 스타일
  textColor?: string; // 텍스트 색상 (hex 코드)
}

function Button({
  text,
  onPress,
  disabled = false,
  className,
  variant = "SOLID",
  icon,
  style,
  textColor,
}: ButtonProps) {
  const variantStyle = {
    SOLID: {
      background: "bg-main-pink",
      color: "text-white",
    },
    SOFT: {
      background: "bg-btn-pink",
      color: "text-black",
    },
    CUSTOM: {
      background: "", // 커스텀에서는 배경색 없음 (className에서 지정)
      color: "", // 기본 텍스트 색상
    },
  };
  const disabledStyle = disabled ? "opacity-80" : "";

  return (
    <Pressable
      className={`rounded-md items-center justify-center w-full ${variantStyle[variant].background} ${disabledStyle} ${className}`}
      style={style}
      onPress={onPress}
      disabled={disabled}
    >
      <View className="flex-row items-center justify-center gap-2">
        {icon && (
          <View className="items-center justify-center">
            {icon}
          </View>
        )}
        <Text 
          className={`text-[16px] font-medium ${variantStyle[variant].color}`}
          style={[
            textColor ? { color: textColor } : undefined,
            { textAlignVertical: 'center' }
          ]}
        >
          {text}
        </Text>
      </View>
    </Pressable>
  );
}

export default Button;
