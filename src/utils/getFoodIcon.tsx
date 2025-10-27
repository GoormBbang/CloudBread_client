// 1. [수정] JSX를 사용하기 위해 React 임포트가 필수입니다.
import React from "react";

// 2. React Native 컴포넌트 임포트
import { Text, View } from "react-native";

// 3. lucide-react-native 아이콘 임포트
import {
  Soup, // 밥, 국, 찌개용
  Leaf, // 야채, 샐러드, 김치용
  Drumstick, // 고기, 닭, 볶음용
  Fish, // 생선, 연어용
  Apple, // 과일, 바나나용
  HelpCircle,
  Utensils,
  CookingPot, // 기타, 알 수 없음
  // (코드에서 사용하지 않는 ChevronLeft, ChevronRight, Bot은 제거해도 됩니다)
} from "lucide-react-native";

// 4. [수정] 누락되었던 FoodItem 타입 정의 추가
interface FoodItem {
  name: string;
  calories: number;
  // (이전 코드의 foodId, imageUrl 등 다른 속성이 있다면 여기에 추가하세요)
}

// 5. getFoodIcon 헬퍼 함수 (수정 없음, 위치만 이동)
const getFoodIcon = (foodName: string) => {
  const name = foodName.toLowerCase(); // 소문자로 변환하여 비교
  const iconSize = 24;
  const iconColor = "#4B5563"; // gray-600

  // 키워드 기반으로 아이콘 반환
  if (name.includes("밥") || name.includes("김밥") || name.includes("죽")) {
    return <CookingPot size={iconSize} color={iconColor} />; // 밥그릇 아이콘으로 Soup 사용
  }
  if (name.includes("국") || name.includes("찌개") || name.includes("탕")) {
    return <Soup size={iconSize} color={iconColor} />;
  }
  if (
    name.includes("샐러드") ||
    name.includes("야채") ||
    name.includes("브로콜리") ||
    name.includes("김치") ||
    name.includes("나물")
  ) {
    return <Leaf size={iconSize} color={iconColor} />;
  }
  if (name.includes("닭") || name.includes("치킨") || name.includes("오리")) {
    return <Drumstick size={iconSize} color={iconColor} />;
  }
  if (
    name.includes("돼지") ||
    name.includes("소") ||
    name.includes("고기") ||
    name.includes("볶음")
  ) {
    return <Drumstick size={iconSize} color={iconColor} />;
  }
  if (
    name.includes("연어") ||
    name.includes("생선") ||
    name.includes("고등어")
  ) {
    return <Fish size={iconSize} color={iconColor} />;
  }

  if (
    name.includes("바나나") ||
    name.includes("사과") ||
    name.includes("과일")
  ) {
    return <Apple size={iconSize} color={iconColor} />;
  }

  // 일치하는 키워드가 없으면 기본 아이콘 (물음표)
  return <Utensils size={iconSize} color={iconColor} />;
};

// 6. MealItem 컴포넌트
const MealItem = ({ name, calories }: FoodItem) => {
  // 헬퍼 함수를 호출하여 음식 이름에 맞는 아이콘을 가져옵니다.
  const foodIcon = getFoodIcon(name);

  return (
    <View className="bg-[#F9FAFB] p-3 rounded-lg flex-row items-center mb-2">
      {/* 스크린샷과 동일하게 아이콘을 회색 배경의 박스 안에 표시합니다. */}
      <View className="w-10 h-10 bg-gray-200 rounded-lg mr-3 justify-center items-center">
        {foodIcon}
      </View>
      <View>
        <Text className="font-semibold">{name} </Text>
        <Text className="text-gray-500">{calories} kcal</Text>
      </View>
    </View>
  );
};

// 7. [추가] 컴포넌트를 다른 파일에서 사용할 수 있도록 export
export default MealItem;
