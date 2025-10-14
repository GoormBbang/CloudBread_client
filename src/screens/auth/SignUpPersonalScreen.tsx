import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image
} from "react-native";
import Button from "../../components/common/Button";
import ProgressBar from "../../components/auth/ProgressBar";
import Input from "../../components/common/Input";
import DatePickerInput from "../../components/common/DatePickerInput";
import { useAuthStore } from "../../store/authStore";
import { useUpdateUserDetails } from "../../hooks/auth";

export default function SignUpPersonalScreen({ navigation }: any) {
  const today = new Date().toISOString().split("T")[0]; // 오늘 날짜 (YYYY-MM-DD)

  const [birthDate, setBirthDate] = useState(today);
  const [pregnancyStartDate, setPregnancyStartDate] = useState(today);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const { user } = useAuthStore();
  const { mutate: updateDetails, isPending } = useUpdateUserDetails();
  const goToNextStep = () => {
    navigation.navigate("Step3");
  }
  const handleNextStep = () => {
    if (!birthDate || !weight || !height || !pregnancyStartDate) {
      //전부 입력받기
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

  return (
    <View className="flex-1 justify-between  items-center p-8 ">
      <View className="flex flex-col w-full">
        <ProgressBar step={2} maxStep={3} text="개인 정보 입력" />
        <View className="flex justify-center items-center p-4">
          {user?.profileImageUrl &&
        <Image
          source={{ uri: user.profileImageUrl }}
          resizeMode="cover"
          className="w-[120px] h-[120px] rounded-full mb-2"
        />}
        <Text className="text-lg">
          {user?.nickname} 님
        </Text>
        </View>
        <DatePickerInput
          label="생년월일"
          value={birthDate}
          onDateChange={setBirthDate}
        />

        <View className="flex-row w-full mb-4">
          <View className="flex-1 mr-4">
            <Input label="체중(kg)" placeholder="체중"
            value={weight}
            onChangeText={setWeight} />
          </View>
          <View className="flex-1">
            <Input label="키(cm)" placeholder="키"
            value={height}
            onChangeText={setHeight} />
          </View>
        </View>
        <DatePickerInput
          label="임신 시작일"
          value={pregnancyStartDate}
          onDateChange={setPregnancyStartDate}
        />
      </View>
      <Button text={isPending ? "저장 중..." : "다음"} 

          onPress={goToNextStep} className="h-12" />

    </View>
  );
}
