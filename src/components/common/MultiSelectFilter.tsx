import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MetaItem } from "../../api/types/user";

type MultiSelectFilterProps = {
  title: string;
  items: MetaItem[];
  selectedItems: number[];
  onSelectionChange: (selectedIds: number[]) => void;
};

export default function MultiSelectFilter({
  title,
  items,
  selectedItems,
  onSelectionChange,
}: MultiSelectFilterProps) {
  const handlePress = (id: number) => {
    // 이미 선택된 항목인지 확인
    const isSelected = selectedItems.includes(id);

    let newSelection: number[];

    if (isSelected) {
      // 이미 선택된 항목이면 제거
      newSelection = selectedItems.filter((selected) => selected !== id);
    } else {
      // 선택되지 않은 항목 배열에 추가
      newSelection = [...selectedItems, id];
    }

    // 부모 컴포넌트로 변경된 선택 목록을 전달
    onSelectionChange(newSelection);
  };

  return (
    <View className="w-full my-2">
      <Text className="text-base font-bold mb-3">{title}</Text>

      <View className="w-full flex-row flex-wrap items-start p-4 border border-gray-200 rounded-xl min-h-[100px]">
        {items.map((item) => {
          const isSelected = selectedItems.includes(item.id);

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => handlePress(item.id)}
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
                {item?.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
