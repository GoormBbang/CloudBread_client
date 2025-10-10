import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Button from "../../components/common/Button";
import ProgressBar from "../../components/auth/ProgressBar";
import Input from "../../components/common/Input";
import DatePickerInput from "../../components/common/DatePickerInput";

export default function SignUpPersonalScreen({ navigation }: any) {
  const today = new Date().toISOString().split("T")[0]; // 오늘 날짜 (YYYY-MM-DD)

  const [birthDate, setBirthDate] = useState(today);
  const [pregnancyStartDate, setPregnancyStartDate] = useState(today);
  const goToNextStep = () => {
    // 다음 스텝으로 이동
    navigation.navigate("Step3");
  };
  return (
    <View className="flex-1 justify-between  items-center p-8 ">
      <View className="flex flex-col w-full">
        <ProgressBar step={2} maxStep={3} text="개인 정보 입력" />
        <DatePickerInput
          label="생년월일"
          value={birthDate}
          onDateChange={setBirthDate}
        />

        <View className="flex-row w-full mb-4">
          <View className="flex-1 mr-4">
            <Input label="체중(kg)" placeholder="체중" />
          </View>
          <View className="flex-1">
            <Input label="키(cm)" placeholder="키" />
          </View>
        </View>
        <DatePickerInput
          label="임신 시작일"
          value={birthDate}
          onDateChange={setBirthDate}
        />
      </View>
      <Button text="다음" onPress={goToNextStep} />
    </View>
  );
}
