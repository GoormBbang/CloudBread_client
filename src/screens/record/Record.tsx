import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
import { RootStackNavigationProp } from "../../navigation/RootNavigator";
import { useNavigation } from "@react-navigation/native";
// 한국어 설정
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

// 영양소 아이템을 위한 타입 정의
type NutrientProps = {
  icon: any; // require()의 반환 타입
  name: string;
  amount: string;
};

// 영양소 아이템 컴포넌트
const NutrientItem: React.FC<NutrientProps> = ({ icon, name, amount }) => (
  <View className="items-center space-y-1">
    <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center">
      <Image source={icon} className="w-10 h-10" resizeMode="contain" />
    </View>
    <Text className="text-sm text-gray-600">{name}</Text>
    <Text className="text-sm font-semibold">{amount}</Text>
  </View>
);

export default function Record() {
  const [selectedDate, setSelectedDate] = useState("2024-01-15");
  const [selectedMeal, setSelectedMeal] = useState<"아침" | "점심" | "저녁">(
    "아침"
  );
  const navigation = useNavigation<RootStackNavigationProp>();
  const markedDates: MarkedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: "#FFD6E5", // 핑크색 배경
      selectedTextColor: "#E54B8A", // 핑크색 텍스트
    },
    "2024-01-03": { marked: true, dotColor: "#E54B8A" }, // 기록이 있는 날짜 표시 예시
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 헤더 부분 (실제로는 React Navigation 헤더를 사용) */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity>
          {/* 실제 앱에서는 아이콘 라이브러리 사용 권장 */}
          <Text className="text-2xl">‹</Text>
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold">기록</Text>
        <View className="w-6" />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* 캘린더 */}
        <Calendar
          current={"2024-02-01"}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          // 헤더 커스텀 (월/년)
          renderHeader={(date) => {
            const month = date?.toString("MMMM");
            const year = date?.getFullYear();
            return (
              <View>
                <Text className="text-lg font-bold">{`${year}년 ${month}`}</Text>
              </View>
            );
          }}
          // 캘린더 테마 커스텀
          theme={{
            textSectionTitleColor: "#b6c1cd", // 요일 색상
            selectedDayBackgroundColor: "light-pink",
            selectedDayTextColor: "main-pink",
            todayTextColor: "main-pink",
            dayTextColor: "#2d4150",
            textDisabledColor: "#d9e1e8", // 다른 달 날짜
            dotColor: "main-pink",
            selectedDotColor: "#ffffff",
            arrowColor: "black",
            monthTextColor: "black",
            indicatorColor: "blue",
            textDayFontWeight: "300",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "300",
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14,
          }}
        />
        <View className="h-full bg-light-pink-2 bg-opacity-90">
          {/* 식사 탭 */}
          <View className="flex-row justify-around bg-white rounded-xl mx-4 my-6 p-1">
            {["아침", "점심", "저녁"].map((meal) => (
              <TouchableOpacity
                key={meal}
                onPress={() => setSelectedMeal(meal as any)}
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

          {/* 식단 상세 카드 */}
          <View className="bg-gray-50 rounded-lg p-4 mx-4 mt-6">
            <Text className="font-bold text-base mb-4">
              점심을 적당히 먹었어요!
            </Text>
            <View className="flex-row space-x-2">
              <View className="bg-white rounded-lg p-2 px-3 border border-gray-200">
                <Text>
                  🍚 현미밥 <Text className="text-gray-500">320 kcal</Text>
                </Text>
              </View>
              <View className="bg-white rounded-lg p-2 px-3 border border-gray-200">
                <Text>
                  🍲 미역국 <Text className="text-gray-500">85 kcal</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* 오늘의 영양 요약 */}
          <TouchableOpacity
            className="mt-4 mr-4"
            onPress={() => navigation.navigate("NutritionDetail")}
          >
            <Text className="text-right text-gray-500">
              오늘의 영양요약 &gt;
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/*
 'stylesheet.calendar.header': {
                week: {
                    marginTop: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                }

                <View className="flex-row justify-around">
            <NutrientItem
              icon={require("../../assets/images/carbohydrate.png")}
              name="탄수화물"
              amount="200g"
            />
            <NutrientItem
              icon={require("../../assets/images/protein.png")}
              name="단백질"
              amount="200g"
            />
            <NutrientItem
              icon={require("../../assets/images/fat.png")}
              name="지방"
              amount="200g"
            />
            <NutrientItem
              icon={require("../../assets/images/sugar.png")}
              name="당류"
              amount="200g"
            />
          </View>
        </View>
            } 
        
        
        <View className="px-6">
          <Text className="text-right font-bold text-gray-600 mb-4">
            총 405 kcal
          </Text>
          
 'stylesheet.calendar.header': {
                week: {
                    marginTop: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                }

                <View className="flex-row justify-around">
            <NutrientItem
              icon={require("../../assets/images/carbohydrate.png")}
              name="탄수화물"
              amount="200g"
            />
            <NutrientItem
              icon={require("../../assets/images/protein.png")}
              name="단백질"
              amount="200g"
            />
            <NutrientItem
              icon={require("../../assets/images/fat.png")}
              name="지방"
              amount="200g"
            />
            <NutrientItem
              icon={require("../../assets/images/sugar.png")}
              name="당류"
              amount="200g"
            />
          </View>
        </View>    */
