import { CalendarDays } from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

// 캘린더 한글 설정
LocaleConfig.locales["ko"] = {
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
LocaleConfig.defaultLocale = "ko";

interface DatePickerInputProps {
  label: string;
  value: string; // YYYY-MM-DD 형식
  onDateChange: (date: string) => void;
}

const DatePickerInput = ({
  label,
  value,
  onDateChange,
}: DatePickerInputProps) => {
  const [isModalVisible, setModalVisible] = useState(false);
  // 모달 안에서만 사용할 임시 날짜 상태
  const [tempDate, setTempDate] = useState(value);

  const handleConfirm = () => {
    onDateChange(tempDate);
    setModalVisible(false);
  };

  const handleCancel = () => {
    // 임시 날짜를 원래 값으로 되돌리고 모달 닫기
    setTempDate(value);
    setModalVisible(false);
  };

  const openModal = () => {
    setTempDate(value || new Date().toISOString().split("T")[0]);
    setModalVisible(true);
  };

  return (
    <View className="w-full mb-4 ">
      {/* 라벨 */}
      <Text className="text-gray-600 text-sm font-medium mb-1">{label}</Text>

      {/* 인풋 영역 */}
      <View className="flex-row items-center w-full  rounded-lg border border-gray-200 px-3 ">
        <TextInput
          className="flex-1 h-12 text-base text-gray-800 "
          value={value}
          placeholder="YYYY-MM-DD"
          editable={false} // 직접 수정을 막고 캘린더로만 선택
        />
        <TouchableOpacity onPress={openModal}>
          <CalendarDays size={18} />
        </TouchableOpacity>
      </View>

      {/* 캘린더 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCancel}
      >
        <Pressable
          className="flex-1 justify-center items-center bg-black/50"
          onPress={handleCancel} // 배경 클릭 시 취소
        >
          <Pressable className="w-11/12 bg-white rounded-2xl p-4 shadow-lg">
            <Calendar
              current={tempDate}
              onDayPress={(day) => {
                setTempDate(day.dateString);
              }}
              markedDates={{
                [tempDate]: { selected: true, selectedColor: "#E17A9B" },
              }}
              theme={{
                arrowColor: "#E17A9B",
                todayTextColor: "#E17A9B",
              }}
            />
            {/* 선택된 날짜 표시 및 버튼 */}
            <View className="mt-4">
              <Text className="text-center text-sm text-gray-500 mb-1">
                선택된 날짜
              </Text>
              <Text className="text-center text-lg font-bold text-gray-800 mb-4">
                {new Date(tempDate).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="flex-1 bg-gray-200 rounded-lg py-3 mr-2"
                  onPress={handleCancel}
                >
                  <Text className="text-center text-base font-bold text-gray-700">
                    취소
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-[#E17A9B] rounded-lg py-3 ml-2"
                  onPress={handleConfirm}
                >
                  <Text className="text-center text-base font-bold text-white">
                    확인
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default DatePickerInput;
