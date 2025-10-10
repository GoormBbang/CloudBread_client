import React, { useState } from "react";
import { View, Text, ScrollView,KeyboardAvoidingView,Platform } from "react-native";
import Button from "../../components/common/Button";
import ProgressBar from "../../components/auth/ProgressBar";
import Input from "../../components/common/Input";
import Checkbox, { CheckboxData } from "../../components/common/Checkbox";
import MultiSelectFilter from "../../components/common/MultiSelectFilter";

const ALLERGY_OPTIONS = [
  "알류(가금류)",
  "우유",
  "메밀",
  "땅콩",
  "대두",
  "밀",
  "고등어",
  "게",
  "새우",
  "돼지고기",
  "복숭아",
  "토마토",
  "아황산류",
  "호두",
  "닭고기",
  "쇠고기",
  "오징어",
  "조개류(굴, 전복, 홍합 포함)",
  "잣",
];

export default function SignUpHealthScreen({ navigation }: any) {
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [usualDietItems, setUsualDietItems] = useState<CheckboxData[]>([
    { label: "채식", checked: false },
    { label: "저염식", checked: false },
    { label: "저당식", checked: false },
    { label: "해당없음", checked: false },
  ]);
  const [personalHealthItems, setPersonalHealthItems] = useState<
    CheckboxData[]
  >([
    { label: "고혈압", checked: false },
    { label: "임신성 당뇨", checked: false },
    { label: "당뇨", checked: false },
  ]);
  const handleDietItemPress = (toggledLabel: string) => {
    setUsualDietItems((prevItems) =>
      prevItems.map((item) =>
        item.label === toggledLabel ? { ...item, checked: !item.checked } : item
      )
    );
  };
  const goToNextStep = () => {
    // 다음 스텝으로 이동
    navigation.navigate("Step3");
  };
  // justify-between  items-center p-8
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1, padding: 32, alignItems: "center" }}
    >
      <View className="w-full mb-6 ">
        <ProgressBar step={3} maxStep={3} text="건강 정보 입력(선택)" />
        <Text className="w-full px-4 py-5 bg-btn-pink rounded-xl text-center text-base mb-4">
          해당 건강정보를 통해 나에게 맞는{"\n"}건강 관리 팁과 식단을
          추천해드려요!
        </Text>
        <Checkbox
          groupLabel="평소 식단"
          items={usualDietItems}
          onItemPress={handleDietItemPress}
          className="w-full"
        />
        <Checkbox
          groupLabel="개인 건강상태 (중복선택가능)"
          items={personalHealthItems}
          onItemPress={handleDietItemPress}
          className="w-full"
        />
        <MultiSelectFilter
          title="알레르기"
          items={ALLERGY_OPTIONS}
          selectedItems={selectedAllergies}
          onSelectionChange={setSelectedAllergies}
        />
        <Input
          label="기타 건강 상태"
          placeholder="기타 건강상태나 특이사항을 입력해주세요"
        />
      </View>
      <Button text="완료" onPress={goToNextStep} />
    </ScrollView>
    </KeyboardAvoidingView>
  );
}
