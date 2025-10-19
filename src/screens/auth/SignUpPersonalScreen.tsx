import React, { useState, useEffect } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import Button from "../../components/common/Button";
import ProgressBar from "../../components/auth/ProgressBar";
import Input from "../../components/common/Input";
import DatePickerInput from "../../components/common/DatePickerInput";
import { useAuthStore } from "../../store/authStore";
import { useUpdateUserDetails } from "../../hooks/auth";
import { useGetMyProfile } from "../../hooks/user";

export default function SignUpPersonalScreen({ navigation }: any) {
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isSuccess,
  } = useGetMyProfile();

  const today = new Date().toISOString().split("T")[0];

  const [birthDate, setBirthDate] = useState(today);
  const [pregnancyStartDate, setPregnancyStartDate] = useState(today);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const { user } = useAuthStore();
  const { mutate: updateDetails, isPending } = useUpdateUserDetails();

  useEffect(() => {
    if (isSuccess && profileData) {
      if (profileData.height || profileData.weight) {
        navigation.replace("Tab");
      }
    }
  }, [isSuccess, profileData, navigation]);

  const handleNextStep = () => {
    if (!birthDate || !weight || !height || !pregnancyStartDate) {
      return;
    }

    const payload = {
      birthDate: birthDate,
      weight: parseFloat(weight),
      height: parseFloat(height),
      dueDate: pregnancyStartDate,
    };
    updateDetails(payload);
  };
  if (isProfileLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#EC4899" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-between items-center p-8 bg-white">
      <View className="flex flex-col w-full">
        <ProgressBar step={2} maxStep={3} text="개인 정보 입력" />
        <View className="flex justify-center items-center p-4">
          {user?.profileImageUrl && (
            <Image
              source={{ uri: user.profileImageUrl }}
              resizeMode="cover"
              className="w-[120px] h-[120px] rounded-full mb-2"
            />
          )}
          <Text className="text-lg font-semibold">{user?.nickname} 님</Text>
        </View>
        <DatePickerInput
          label="생년월일"
          value={birthDate}
          onDateChange={setBirthDate}
        />
        <View className="flex-row w-full mb-4">
          <View className="flex-1 mr-2">
            <Input
              label="체중(kg)"
              placeholder="체중"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1 ml-2">
            <Input
              label="키(cm)"
              placeholder="키"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
          </View>
        </View>
        <DatePickerInput
          label="임신 시작일"
          value={pregnancyStartDate}
          onDateChange={setPregnancyStartDate}
        />
      </View>
      <Button
        text={isPending ? "저장 중..." : "다음"}
        onPress={handleNextStep}
        className="h-12 w-full"
        disabled={isPending}
      />
    </View>
  );
}
