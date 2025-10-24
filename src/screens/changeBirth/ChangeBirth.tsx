import { Text, View, TouchableWithoutFeedback, Keyboard } from "react-native";
import Header from "../../components/common/Header";
import DateInput from "../../components/common/DateInput";
import { useState } from "react";
import Button from "../../components/common/Button";
import { updateUserBirthDate } from "../../api/services/profile";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";


export default function ChangeBirth() {
    const navigation = useNavigation();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleDateChange = (date: string) => {
    console.log("Selected date:", date);
    setSelectedDate(date);
    // 여기서 날짜 데이터를 처리할 수 있습니다
  };

  const handleUpdateBirthDate = async () => {
    if (!selectedDate || selectedDate === null) {
      setErrorMessage("생일을 올바르게 입력해주세요");
      return;
    }
    try {
      const response = await updateUserBirthDate(selectedDate as string);
      console.log("selectedDate:", selectedDate);
      if(response.isSuccess) {
        Toast.show({
          text1: "생일이 변경되었습니다",
          type: "success",
        });
        navigation.navigate('Profile' as never);
      }
    } catch (error) {
      console.error("Error updating birth date:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white">
          <Header title="프로필 설정" />
        <View className="flex-1 px-4 py-10">
          <View className="mb-8">
              <Text className="text-2xl font-bold">생일을</Text>
              <Text className="text-2xl font-bold">입력해주세요</Text>
          </View>
          <DateInput 
            label="생년월일" 
            className="w-full text-[#6b7280]" 
            onDateChange={handleDateChange}
          />
          {errorMessage && <Text className="text-red-500 text-sm">{errorMessage}</Text>}
          <Button text="변경하기" onPress={handleUpdateBirthDate} className="w-full h-12 mt-10 px-2 text-[12px]" />
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
}