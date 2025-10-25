import React, { useState, useEffect } from "react"; // useEffect 추가
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { ChevronLeft, ChevronRight, Bot } from "lucide-react-native";
import NutrientBalanceBar from "../../components/record/NutrientBalanceBar";
import { useNutritionData } from "../../hooks/nutrientDetail";
import { NUTRIENT_NAMES } from "../../constants/nutrientName";
import Header from "../../components/common/Header";
import { RootStackParamList } from "../../navigation/RootNavigator";

type NutritionDetailRouteProp = RouteProp<
  RootStackParamList,
  "NutritionDetail"
>;

interface FoodItem {
  name: string;
  calories: number;
  imageUrl?: string | null;
  foodId: number; // key로 사용하기 위해 foodId 추가
}
const MealItem = ({ name, calories, imageUrl }: FoodItem) => (
  <View className="bg-gray-100 p-3 rounded-lg flex-row items-center mb-2">
    {imageUrl ? (
      <Image source={{ uri: imageUrl }} className="w-10 h-10 rounded-md mr-3" />
    ) : (
      <View className="w-10 h-10 bg-gray-200 rounded-md mr-3" />
    )}
    <View>
      <Text className="font-semibold">{name}</Text>
      <Text className="text-gray-500">{calories} kcal</Text>
    </View>
  </View>
);

const formatDateForUI = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`;
};

const formatDateForApi = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export default function NutritionDetailScreen() {
  const route = useRoute<NutritionDetailRouteProp>();

  const [currentDate, setCurrentDate] = useState(
    new Date(route.params?.date || new Date())
  );

  const {
    summary,
    balance,
    history,
    isLoading,
    isError,
    generateFeedback,
    feedback,
    isGeneratingFeedback,
  } = useNutritionData(formatDateForApi(currentDate));

  // --- [변경] 화면 데이터 로드 시 피드백 자동 생성 ---
  useEffect(() => {
    if (summary && !feedback && !isGeneratingFeedback) {
      generateFeedback();
    }
  }, [summary, feedback, isGeneratingFeedback, generateFeedback]); // 의존성 배열에 관련 상태 및 함수 추가

  const changeDate = (amount: number) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + amount);
      return newDate;
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#FF69B4" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-red-500">데이터를 불러오는 데 실패했습니다.</Text>
      </SafeAreaView>
    );
  }

  const mealTypeMap: { [key: string]: string } = {
    BREAKFAST: "아침",
    LUNCH: "점심",
    DINNER: "저녁",
    SNACK: "간식",
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Header title="기록" />
      {/* 날짜 네비게이터 */}
      <View className="flex-row items-center justify-between p-4 bg-white">
        {/* <TouchableOpacity onPress={() => changeDate(-1)}>
            <ChevronLeft color="gray" size={20} />
          </TouchableOpacity> */}
        <Text className="font-semibold">{formatDateForUI(currentDate)}</Text>
        {/* <TouchableOpacity onPress={() => changeDate(1)}>
            <ChevronRight color="gray" size={20} />
          </TouchableOpacity> */}
      </View>

      <View className="p-4 space-y-4">
        {/* 오늘의 영양 요약 카드 */}
        {summary[0] && (
          <View className="bg-white p-4 rounded-lg shadow-sm">
            <Text className="text-base font-bold text-gray-700 mb-2">
              오늘의 영양 요약
            </Text>
            <View className="flex-row justify-around items-center">
              <View className="items-center">
                <Text className="text-4xl font-bold">
                  {summary[0].totalCalories}
                </Text>
                <Text className="text-gray-500">kcal</Text>
                <Text
                  className={`text-xs px-2 py-1 rounded-full mt-1 ${
                    summary[0].comment === "목표 달성"
                      ? "text-green-600 bg-green-100"
                      : "text-red-600 bg-red-100"
                  }`}
                >
                  {summary[0].comment}
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-4xl font-bold">
                  {summary[0].lackedValue}g
                </Text>
                <Text className="text-gray-500">
                  {NUTRIENT_NAMES[summary[0].lackedNutrient]}
                </Text>
                <Text className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full mt-1">
                  가장 부족
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* 영양소 밸런스 바 */}
        {balance && (
          <NutrientBalanceBar
            title="영양소 밸런스"
            nutrients={{
              carbs: {
                current: balance.balance.carbs.actual,
                total: balance.balance.carbs.recommended,
                color: "#FF8989",
              },
              protein: {
                current: balance.balance.protein.actual,
                total: balance.balance.protein.recommended,
                color: "#FEA405",
              },
              fat: {
                current: balance.balance.fat.actual,
                total: balance.balance.fat.recommended,
                color: "#89AC46",
              },
            }}
          />
        )}

        {/* AI 영양 피드백 카드 */}
        <View className="bg-white p-4 rounded-lg flex-col space-y-2">
          <View className="flex flex-row items-center">
            <Bot size={24} color="#EC4899" />
            <Text className="font-bold text-pink-600 ml-2">AI 영양 피드백</Text>
          </View>
          {/* --- [변경] 버튼 제거 및 텍스트 표시 로직 수정 --- */}
          <View className="flex-1 bg-pink-50 p-3 rounded-md min-h-[60px] justify-center">
            {isGeneratingFeedback ? (
              <Text className="text-gray-500">
                AI가 피드백을 생성하고 있어요...
              </Text>
            ) : (
              <Text className="leading-6">
                {feedback
                  ? feedback.FeedbackSummary
                  : "오늘 식단에 대한 피드백이 없습니다."}
              </Text>
            )}
          </View>
        </View>

        {/* 오늘 먹은 음식 리스트 */}
        {history && (
          <View className="bg-white p-4 rounded-lg">
            <Text className="text-base font-bold text-gray-700 mb-2">
              오늘 먹은 음식
            </Text>
            {history.meal_type && Object.keys(history.meal_type).length > 0 ? (
              Object.entries(history.meal_type).map(([mealType, foods]) => {
                if (!Array.isArray(foods) || foods.length === 0) {
                  return null;
                }
                return (
                  <View key={mealType} className="mb-3">
                    <Text className="font-semibold text-gray-500 mb-2">
                      {mealTypeMap[mealType] || mealType}
                    </Text>
                    {foods.map((food) => (
                      <MealItem key={food.foodId} {...food} />
                    ))}
                  </View>
                );
              })
            ) : (
              <Text className="text-gray-500 text-center py-4">
                오늘 먹은 음식이 없습니다.
              </Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
