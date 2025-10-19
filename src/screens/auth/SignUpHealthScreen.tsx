import React, { useEffect, useState } from "react";
import { View, Text, ScrollView,KeyboardAvoidingView,Platform } from "react-native";
import Button from "../../components/common/Button";
import ProgressBar from "../../components/auth/ProgressBar";
import Input from "../../components/common/Input";
import Checkbox, { CheckboxData } from "../../components/common/Checkbox";
import MultiSelectFilter from "../../components/common/MultiSelectFilter";
import { useGetMetadata, useUpdateUserHealthInfo } from "../../hooks/auth";


export default function SignUpHealthScreen({ navigation }: any) {
  const [selectedDietIds, setSelectedDietIds] = useState<number[]>([]);
  const [selectedHealthIds, setSelectedHealthIds] = useState<number[]>([]);
  const [selectedAllergyIds, setSelectedAllergyIds] = useState<number[]>([]);
  const [otherHealthFactors, setOtherHealthFactors] = useState('');

  const { data: metadata, isLoading, error } = useGetMetadata();
  const { mutate: updateUserHealth, isPending } = useUpdateUserHealthInfo();
  const handleCheckboxToggle = (
    id: number,
    selectedIds: number[],
    setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    // 이미 선택된 ID라면 배열에서 제거, 아니면 추가
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };
  const goToNextStep = () => {
    // 다음 스텝으로 이동
    //navigation.replace("Tab");
    const payload = {
      dietTypeIds: selectedDietIds,
      healthTypeIds: selectedHealthIds, // API 명세에 따라 healthTypeIds 또는 healthConditionIds로
      allergyIds: selectedAllergyIds,
      otherHealthFactors: otherHealthFactors,
    };

    console.log("Sending health info:", payload);
    updateUserHealth(payload);
  };
  // justify-between  items-center p-8
  if (isLoading) {
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
      </View>
      <Button text="완료" onPress={goToNextStep} className="h-12" />
    </ScrollView>
    </KeyboardAvoidingView>
  );
  }

  if (error) {
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
      </View>
      <Button text="완료" onPress={goToNextStep} className="h-12" />
    </ScrollView>
    </KeyboardAvoidingView>
  );
  }
  
  if(metadata){
    console.log(metadata?.result?.allergies);
    //dietTypes
    //healthTypes
  }
  const dietItems: CheckboxData[] = metadata?.result?.dietTypes.map(item => ({
    id: item.id, // id를 넘겨주는 것이 중요
    label: item.name,
    checked: selectedDietIds.includes(item.id),
  })) || [];

  const healthItems: CheckboxData[] = metadata?.result?.healthTypes.map(item => ({
    id: item.id,
    label: item.name,
    checked: selectedHealthIds.includes(item.id),
  })) || [];

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
          items={dietItems}
          onItemPress={(id) => handleCheckboxToggle(id, selectedDietIds, setSelectedDietIds)}
          className="w-full"
        />
        <Checkbox
          groupLabel="개인 건강상태 (중복선택가능)"
          items={healthItems}
          onItemPress={(id) => handleCheckboxToggle(id, selectedHealthIds, setSelectedHealthIds)}
            className="w-full"
        />
        <MultiSelectFilter
          title="알레르기"
          items={metadata?.result?.allergies || []}
          selectedItems={selectedAllergyIds}
          onSelectionChange={setSelectedAllergyIds}
        />
        <Input
          label="기타 건강 상태"
          placeholder="기타 건강상태나 특이사항을 입력해주세요"
           value={otherHealthFactors}   
          onChangeText={setOtherHealthFactors} 
        />
      </View>
      <Button text="완료" onPress={goToNextStep} className="h-12" />
    </ScrollView>
    </KeyboardAvoidingView>
  );
}
