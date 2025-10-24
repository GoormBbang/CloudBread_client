import React from "react";
import { View, Text } from "react-native";

// 단일 영양소 데이터 타입
interface NutrientData {
  current: number;
  total: number;
  color: string;
}

// 단일 영양소 행을 렌더링하는 헬퍼 컴포넌트
const NutrientProgressRow: React.FC<{ label: string; data: NutrientData }> = ({
  label,
  data,
}) => (
  <View className="mt-3">
    <View className="flex-row justify-between mb-1">
      <Text>{label}</Text>
      <Text className="font-semibold">
        {data.current}g / <Text className="text-gray-400">{data.total}g</Text>
      </Text>
    </View>
    <ProgressBar
      progress={(data.current / data.total) * 100}
      color={data.color}
    />
  </View>
);

// --- 메인 컴포넌트 ---

interface NutrientBalanceCardProps {
  title: string;
  nutrients: {
    carbs: NutrientData;
    protein: NutrientData;
    fat: NutrientData;
  };
}

// 프로그레스 바 컴포넌트 (참고용으로 포함)
const ProgressBar: React.FC<{ progress: number; color: string }> = ({
  progress,
  color,
}) => (
  <View className="h-2 bg-gray-200 rounded-full">
    <View
      style={{ width: `${progress}%`, backgroundColor: color }}
      className={`h-2 rounded-full`}
    />
  </View>
);

const NutrientBalanceBar: React.FC<NutrientBalanceCardProps> = ({
  title,
  nutrients,
}) => {
  return (
    <View className="bg-white p-4 my-4 rounded-lg space-y-3">
      <Text className="text-base font-bold text-gray-700">{title}</Text>
      <NutrientProgressRow label="탄수화물" data={nutrients.carbs} />
      <NutrientProgressRow label="단백질" data={nutrients.protein} />
      <NutrientProgressRow label="지방" data={nutrients.fat} />
    </View>
  );
};

export default NutrientBalanceBar;
