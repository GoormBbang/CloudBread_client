import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Bot, // AI 아이콘 예시
} from "lucide-react-native";
import NutrientBalanceBar from "../../components/record/NutrientBalanceBar";

// --- Helper Components ---

// 프로그레스 바 컴포넌트
interface ProgressBarProps {
  progress: number; // 0 to 100
  color: string;
}
const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color }) => (
  <View className="h-2 bg-gray-200 rounded-full">
    <View
      style={{ width: `${progress}%` }}
      className={`h-2 rounded-full ${color}`}
    />
  </View>
);

// 식사 아이템 컴포넌트
interface MealItemProps {
    name: string;
    calories: number;
}
const MealItem: React.FC<MealItemProps> = ({ name, calories }) => (
    <View className="bg-gray-100 p-3 rounded-lg flex-row items-center mb-2">
        <View className="w-10 h-10 bg-gray-200 rounded-md mr-3" />
        <View>
            <Text className="font-semibold">{name}</Text>
            <Text className="text-gray-500">{calories} kcal</Text>
        </View>
    </View>
);


// --- Main Screen Component ---

export default function NutritionDetailScreen() {
    // UI 표시를 위한 Mock 데이터
    const nutrients = {
        carbs: { current: 245, total: 280, color: 'bg-green-400' },
        protein: { current: 78, total: 95, color: 'bg-orange-400' },
        fat: { current: 65, total: 70, color: 'bg-yellow-400' },
    };
    const meals = {
        "아침": [{ name: "현미밥", calories: 320 }, { name: "미역국", calories: 85 }],
        "점심": [{ name: "연어 샐러드", calories: 420 }],
        "간식": [{ name: "바나나", calories: 103 }],
        "저녁": [{ name: "닭가슴살 볶음", calories: 350 }, { name: "브로콜리", calories: 55 }],
    };


  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* 헤더 */}
      <View className="flex-row items-center justify-between p-4 bg-white">
        <TouchableOpacity>
          <ChevronLeft color="black" size={24} />
        </TouchableOpacity>
        <Text className="text-lg font-bold">기록</Text>
        <TouchableOpacity>
          <MoreVertical color="black" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* 날짜 네비게이터 */}
        <View className="flex-row items-center justify-between p-4 bg-white">
          <TouchableOpacity>
            <ChevronLeft color="gray" size={20} />
          </TouchableOpacity>
          <Text className="font-semibold">2025년 1월 30일 목요일</Text>
          <TouchableOpacity>
            <ChevronRight color="gray" size={20} />
          </TouchableOpacity>
        </View>

        <View className="p-4 space-y-4">
          {/* 오늘의 영양 요약 카드 */}
          <View className="bg-white p-4 rounded-lg shadow-sm">
            <Text className="text-base font-bold text-gray-700 mb-2">오늘의 영양 요약</Text>
            <View className="flex-row justify-around items-center">
                <View className="items-center">
                    <Text className="text-4xl font-bold">1,856</Text>
                    <Text className="text-gray-500">kcal</Text>
                    <Text className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full mt-1">권장 섭취량 달성</Text>
                </View>
                <View className="items-center">
                    <Text className="text-4xl font-bold">78g</Text>
                    <Text className="text-gray-500">단백질</Text>
                    <Text className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full mt-1">부족</Text>
                </View>
            </View>
          </View>
          
          <NutrientBalanceBar title="영양소 밸런스" nutrients={nutrients}/>
          
          {/* AI 영양 피드백 카드 */}
          <View className="bg-white p-4 rounded-lg flex-col space-y-2 ">
            <View className="flex flex-row items-center justify-start">
                <Bot size={24} color="#EC4899" />
                <Text className="font-bold text-pink-600 ml-2">AI 영양 피드백</Text>
            </View>
              <View className="flex-1 bg-pink-50 p-2 rounded-md">
                <Text className="leading-6">
                    오늘 단백질 섭취가 목표량보다 부족합니다. 임신 중기에는 충분한 단백질 섭취가 중요해요. 저녁 식사에 생선이나 두부 요리를 추가해보세요.
                </Text>
              </View>
          </View>

          {/* 오늘 먹은 음식 리스트 */}
          <View className="bg-white p-4 rounded-lg">
             <Text className="text-base font-bold text-gray-700 mb-2">오늘 먹은 음식</Text>
             {Object.entries(meals).map(([mealType, foods]) => (
                <View key={mealType} className="mb-3">
                    <Text className="font-semibold text-gray-500 mb-2">{mealType}</Text>
                    {foods.map(food => <MealItem key={food.name} name={food.name} calories={food.calories} />)}
                </View>
             ))}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}