import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label: string;
  width?: string;
  className?: string;
}

const Input = ({ label, width = "full", className, ...rest }: InputProps) => {
  return (
    <View className={`w-${width} ${className} flex-col items-start gap-1`}>
      <Text className="text-sm font-medium mb-2">{label}</Text>
      <TextInput
        className="bg-white border border-input-gray rounded-lg p-4 text-base"
        placeholderTextColor="text-input-gray"
        {...rest}
      />
    </View>
  );
};

export default Input;
