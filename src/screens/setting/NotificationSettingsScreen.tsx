import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, Image } from "react-native";
import NotificationSettingRow from "../../components/setting/notificationSettingItem"; // 경로는 실제 프로젝트에 맞게 수정해주세요.
import Button from "../../components/common/Button"; // 기존에 사용하시던 Button 컴포넌트
//import AppleIco from "../../../assets/icons/setting/appleIco.svg";
const ClockIcon = () => (
  <View className="w-12 h-12 rounded-[8px] bg-[#E17A9B] justify-center items-center">
    <Image
      source={require("../../../assets/icons/setting/clockIco.png")}
      className="w-6 h-6"
    />
  </View>
);

const NutritionIcon = () => (
  <View className="w-12 h-12 rounded-[8px] bg-[#E17A9B] justify-center items-center">
    <Image
      source={require("../../../assets/icons/setting/appleIco.png")}
      className="w-[23px] h-[26px]"
    />
  </View>
);

export default function NotificationSettingsScreen() {
  const [isMealAlarmOn, setIsMealAlarmOn] = useState(true);
  const [isNutritionAlarmOn, setIsNutritionAlarmOn] = useState(true);

  const handleSave = () => {
    console.log("식단 알림:", isMealAlarmOn);
    console.log("영양 알림:", isNutritionAlarmOn);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text className="text-2xl font-bold text-gray-800">알림 관리</Text>
          <Text className="text-base text-gray-600 mt-1 mb-6">
            원하는 알림을 설정하여 건강한 습관을 유지하세요
          </Text>

          <View className="bg-[#FAFAFA] p-6 rounded-2xl ">
            <NotificationSettingRow
              icon={<ClockIcon />}
              title="식단 추천 알림"
              description="일정한 시간에 루틴을 알려드립니다"
              label="식단 알림"
              isEnabled={isMealAlarmOn}
              onToggle={setIsMealAlarmOn}
            />
            <NotificationSettingRow
              icon={<NutritionIcon />}
              title="영양 부족 안내"
              description="부족한 영양소를 알려드립니다"
              label="영양 알림"
              isEnabled={isNutritionAlarmOn}
              onToggle={setIsNutritionAlarmOn}
            />
          </View>
        </View>
      </ScrollView>
      <View className="px-4 pb-4">
        <Button text="설정 저장" onPress={handleSave} style={{ padding: 16 }} />
      </View>
    </SafeAreaView>
  );
}
