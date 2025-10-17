import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label: string;
  width?: string;
  className?: string;
}

const Input = ({ label, className, onChangeText ,...rest }: InputProps) => {
  return (
    <View className={`${className} flex flex-col items-start gap-1`}>
      <Text className="text-sm font-medium mb-2">{label}</Text>
      <TextInput
        className="w-full bg-white border border-input-gray rounded-lg p-4 text-base text-black"
        onChangeText={onChangeText}
        {...rest}
      />
    </View>
  );
};

export default Input;
