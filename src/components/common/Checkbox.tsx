import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

interface CheckboxProps {
  label: string;
  checked?: boolean;
  onPress?: () => void;
  className?: string;
}

export const CheckboxItem = ({
  label,
  checked = false,
  onPress,
  className,
}: CheckboxProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center ${className} mb-1`}
      activeOpacity={0.7}
    >
      <View
        className={`
          w-4 h-4 rounded mr-2
          flex justify-center items-center 
          border
          ${
            checked
              ? "bg-[#E46592] border-main-pink"
              : "bg-white border-gray-300"
          }
        `}
      />
      <Text className="text-base text-gray-800">{label}</Text>
    </TouchableOpacity>
  );
};

export interface CheckboxData {
  id: number;
  label: string;
  checked: boolean;
}

interface CheckboxGroupProps {
  groupLabel: string;
  subTitle?: string;
  items: CheckboxData[];
  onItemPress: (id: number) => void;
  className?: string;
}

const Checkbox = ({
  groupLabel,
  subTitle,
  items,
  onItemPress,
  className,
}: CheckboxGroupProps) => {
  return (
    <View className={`w-full ${className} mb-2`}>
      <Text className="text-base font-bold mb-2">{groupLabel}</Text>
      <View className="w-full">
        {items.map((item, index) => (
          <CheckboxItem
            key={item.id}
            label={item.label}
            checked={item.checked}
            onPress={() => onItemPress(item.id)}
            className={index < items.length - 1 ? "mb-4" : ""}
          />
        ))}
      </View>
    </View>
  );
};

export default Checkbox;
