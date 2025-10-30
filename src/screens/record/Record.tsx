import Header from "../../components/common/Header";
import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Calendar, LocaleConfig, DateData } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
import { useNavigation } from "@react-navigation/native";
import {
  useGetFoodHistoryCalendar,
  useGetFoodHistorySummary,
} from "../../hooks/nutrientDetail";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { getCalendarFood } from "../../utils/getCalendarFood";
//import { RecordStackParamList } from "../../navigation/RecordNavigator";

type NutritionDetail = NativeStackNavigationProp<
  RootStackParamList,
  "NutritionDetail"
>;

LocaleConfig.locales["kr"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
};
LocaleConfig.defaultLocale = "kr";

const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const NutrientItem: React.FC<{ icon: any; name: string; amount: string }> = ({
  icon,
  name,
  amount,
}) => (
  <View className="items-center space-y-1 flex-1">
    <View className="w-14 h-14 bg-gray-100 rounded-full items-center justify-center">
      <Image source={icon} className="w-8 h-8" resizeMode="contain" />
    </View>
    <Text className="text-sm text-gray-600">{name}</Text>
    <Text className="text-sm font-semibold">{amount}</Text>
  </View>
);

export default function Record() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [selectedMeal, setSelectedMeal] = useState<"아침" | "점심" | "저녁">(
    "아침"
  );
  const navigation = useNavigation<NutritionDetail>();

  const { data: foodHistory, isLoading: isCalendarLoading } =
    useGetFoodHistoryCalendar(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    );

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useGetFoodHistorySummary(selectedDate);

  const markedDates = useMemo((): MarkedDates => {
    const markings: MarkedDates = {};
    if (foodHistory?.days) {
      foodHistory.days.forEach((item) => {
        const dayString = `${foodHistory.year}-${String(
          foodHistory.month
        ).padStart(2, "0")}-${String(item.day).padStart(2, "0")}`;
        markings[dayString] = {
          dots: Array.from({ length: item.count }, (_, i) => ({
            key: String(i),
            color: "#E54B8A",
          })),
        };
      });
    }
    markings[selectedDate] = {
      ...(markings[selectedDate] || {}),
      selected: true,
      selectedColor: "#F9C4D4",
      selectedTextColor: "#E54B8A",
    };
    return markings;
  }, [foodHistory, selectedDate]);

  const availableMeals = useMemo(() => {
    if (!summaryData?.meals) return [];

    const mealTypeReverseMap: { [key: string]: "아침" | "점심" | "저녁" } = {
      BREAKFAST: "아침",
      LUNCH: "점심",
      DINNER: "저녁",
    };

    const availableMealSet = new Set(
      summaryData.meals
        .map((meal) => mealTypeReverseMap[meal.mealType])
        .filter(Boolean)
    );

    return ["아침", "점심", "저녁"].filter((meal) =>
      availableMealSet.has(meal as any)
    ) as ("아침" | "점심" | "저녁")[];
  }, [summaryData]);

  useEffect(() => {
    if (availableMeals.length > 0 && !availableMeals.includes(selectedMeal)) {
      setSelectedMeal(availableMeals[0]);
    }
  }, [availableMeals, selectedMeal]);

  const handleMonthChange = (date: DateData) => {
    setCurrentDate(new Date(date.dateString));
  };

  const renderMealDetails = () => {
    if (isSummaryLoading) {
      return <ActivityIndicator color="#E54B8A" className="my-10" />;
    }
    if (isSummaryError || !summaryData) {
      return (
        <Text className="text-center text-gray-500 py-10">
          기록된 식단이 없습니다.
        </Text>
      );
    }
    const mealTypeMapping = {
      아침: "BREAKFAST",
      점심: "LUNCH",
      저녁: "DINNER",
    };
    const selectedMealType = mealTypeMapping[selectedMeal];
    const mealInfo = summaryData.meals.find(
      (m) => m.mealType === selectedMealType
    );
    const intakeInfo = summaryData.intakeMessages.find(
      (i) => i.mealType === selectedMeal
    );

    if (!mealInfo || !intakeInfo) {
      return (
        <Text className="text-center text-gray-500 py-10">
          해당 끼니의 기록이 없습니다.
        </Text>
      );
    }
    return (
      <View className="bg-gray-50 rounded-lg p-4 mx-4 mt-2">
        <View className="flex flex-row justify-between items-center mb-2">
          <Text className="font-bold text-base text-gray-800">
            {`${intakeInfo.mealType}을 ${intakeInfo.level} 먹었어요!`}
          </Text>
          <Text className="font-medium text-base text-gray-600">
            총 {mealInfo.totalCalories} kcal
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {mealInfo.foods.map((food, index) => (
            <View
              key={index}
              className="bg-white rounded-lg p-2 px-3 border border-gray-200"
            >
              <Text>
                {getCalendarFood(food.category)} {food.foodName}{" "}
                <Text className="text-gray-500">{food.calories} kcal</Text>
              </Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          className="mt-4 flex flex-row justify-center items-center"
          onPress={() =>
            navigation.navigate("NutritionDetail", {
              date: selectedDate,
            })
          }
        >
          <Text className="text-right text-gray-500">오늘의 영양요약 &gt;</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <Header title="기록" />

      <Calendar
        current={currentDate.toISOString().split("T")[0]}
        markedDates={markedDates}
        markingType="multi-dot"
        onDayPress={(day) => setSelectedDate(day.dateString)}
        onMonthChange={handleMonthChange}
        renderHeader={(date) => {
          const headerDate = new Date(date?.toString() || Date.now());
          const month =
            LocaleConfig.locales["kr"]?.monthNames?.[headerDate.getMonth()] ||
            "";
          const year = headerDate.getFullYear();
          return (
            <Text className="text-lg font-bold">{`${year}년 ${month}`}</Text>
          );
        }}
        theme={{
          textSectionTitleColor: "black",
          arrowColor: "black",
        }}
      />

      {isCalendarLoading && (
        <ActivityIndicator size="large" color="#E54B8A" className="my-4" />
      )}
      <View className="h-full bg-light-pink-2 bg-opacity-90 pt-4">
        {!isCalendarLoading && foodHistory?.days.length === 0 && (
          <Text className="text-center text-gray-500 py-10">
            조회 가능한 식단이 없습니다.
          </Text>
        )}

        {!isCalendarLoading && foodHistory && foodHistory.days.length > 0 && (
          <>
            {/* ... (영양소 요약 부분은 동일) ... */}
            {!isSummaryLoading && !isSummaryError && summaryData && (
              <View className="px-4">
                <View className="flex-row justify-around bg-white rounded-xl p-4">
                  <NutrientItem
                    icon={require("../../../assets/icons/food/nutrientCarbs.png")}
                    name="탄수화물"
                    amount={`${summaryData.nutritionTotals.carbs}g`}
                  />
                  <NutrientItem
                    icon={require("../../../assets/icons/food/nutrientFats.png")}
                    name="단백질"
                    amount={`${summaryData.nutritionTotals.protein}g`}
                  />
                  <NutrientItem
                    icon={require("../../../assets/icons/food/nutrientProteins.png")}
                    name="지방"
                    amount={`${summaryData.nutritionTotals.fat}g`}
                  />
                  <NutrientItem
                    icon={require("../../../assets/icons/food/nutrientSugars.png")}
                    name="당류"
                    amount={`${summaryData.nutritionTotals.sugar}g`}
                  />
                </View>
              </View>
            )}
            {availableMeals.length > 0 && (
              <View className="flex-row justify-around bg-white rounded-xl mx-4 mt-6 p-1">
                {availableMeals.map((meal) => (
                  <TouchableOpacity
                    key={meal}
                    onPress={() => setSelectedMeal(meal)}
                    className={`flex flex-row items-center justify-center flex-1 p-2 rounded-lg ${
                      selectedMeal === meal ? "bg-white shadow" : ""
                    }`}
                  >
                    <Text className="text-center font-semibold">{meal}</Text>
                    {selectedMeal === meal && (
                      <View className="w-1.5 h-1.5 bg-main-pink rounded-full self-center ml-1" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {renderMealDetails()}
          </>
        )}
      </View>
    </ScrollView>
  );
}
