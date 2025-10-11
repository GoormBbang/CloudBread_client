import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type MultiSelectFilterProps = {
  title: string; 
  items: string[]; 
  selectedItems: string[]; 
  onSelectionChange: (selected: string[]) => void;
};

export default function MultiSelectFilter({
  title,
  items,
  selectedItems,
  onSelectionChange,
}: MultiSelectFilterProps) {
  const handlePress = (item: string) => {
    // 이미 선택된 항목인지 확인
    const isSelected = selectedItems.includes(item);

    let newSelection: string[];

    if (isSelected) {
      // 이미 선택된 항목이면 제거
      newSelection = selectedItems.filter((selected) => selected !== item);
    } else {
      // 선택되지 않은 항목 배열에 추가
      newSelection = [...selectedItems, item];
    }

    // 부모 컴포넌트로 변경된 선택 목록을 전달
    onSelectionChange(newSelection);
  };

  return (
    <View className="w-full my-2">
      <Text className="text-lg font-bold text-gray-800 mb-3">{title}</Text>

      <View className="w-full flex-row flex-wrap items-start p-4 border border-gray-200 rounded-xl min-h-[100px]">
        {items.map((item) => {
          const isSelected = selectedItems.includes(item);

          return (
            <TouchableOpacity
              key={item}
              onPress={() => handlePress(item)}
              className={`
                p-2 px-4 m-1 rounded-full border
                ${
                  isSelected
                    ? "bg-main-pink border-pink-400"
                    : "bg-pink-100 border-pink-200"
                }
              `}
            >
              <Text
                className={`
                  font-semibold 
                  ${isSelected ? "text-white" : "text-pink-800"}
                `}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
