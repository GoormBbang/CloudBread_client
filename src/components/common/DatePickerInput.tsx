import { CalendarDays } from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  FlatList,
  ViewStyle, // 1. style prop의 타입을 위해 ViewStyle을 import 합니다.
} from "react-native";
import { Calendar, LocaleConfig, DateData } from "react-native-calendars";
import XDate from "xdate";

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
  style?: ViewStyle;
  className?: string;
}

const DatePickerInput = ({
  label,
  value,
  onDateChange,
  style,
  className,
}: DatePickerInputProps) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempDate, setTempDate] = useState(value);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const handleConfirm = () => {
    onDateChange(tempDate);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setTempDate(value);
    setModalVisible(false);
    setShowYearPicker(false);
  };

  const openModal = () => {
    setTempDate(value || new Date().toISOString().split("T")[0]);
    setModalVisible(true);
  };

  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  const handleYearSelect = (year: number) => {
    const month = tempDate.substring(5, 7);
    const day = tempDate.substring(8, 10);
    setTempDate(`${year}-${month}-${day}`);
    setShowYearPicker(false);
  };

  const renderCustomHeader = (date?: XDate) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return (
      <View className="flex-row items-center mb-2 justify-center">
        <TouchableOpacity onPress={() => setShowYearPicker(true)}>
          <Text className="text-xl font-bold text-[#E17A9B]">{year}년</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 ml-2">{month}월</Text>
      </View>
    );
  };

  return (
    <View className={`w-full mb-4 ${className || ""}`} style={style}>
      <Text className="text-base font-bold mb-2">{label}</Text>

      <View className="flex-row items-center w-full rounded-lg border border-gray-200 px-3">
        <TextInput
          className="flex-1 h-12 text-base text-gray-800"
          value={value}
          placeholder="YYYY-MM-DD"
          editable={false}
        />
        <TouchableOpacity onPress={openModal}>
          <CalendarDays size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCancel}
      >
        <Pressable
          className="flex-1 justify-center items-center bg-black/50"
          onPress={handleCancel}
        >
          <Pressable className="w-11/12 bg-white rounded-2xl p-4 shadow-lg">
            {showYearPicker ? (
              <View className="h-[400px]">
                <Text className="text-center text-lg font-bold mb-4">
                  연도 선택
                </Text>
                <FlatList
                  data={years}
                  keyExtractor={(item) => item.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="py-3 items-center"
                      onPress={() => handleYearSelect(item)}
                    >
                      <Text className="text-lg">{item}</Text>
                    </TouchableOpacity>
                  )}
                  initialScrollIndex={years.indexOf(
                    new Date(tempDate).getFullYear()
                  )}
                  getItemLayout={(data, index) => ({
                    length: 46,
                    offset: 46 * index,
                    index,
                  })}
                />
              </View>
            ) : (
              <>
                <Calendar
                  current={tempDate}
                  onDayPress={(day: DateData) => setTempDate(day.dateString)}
                  markedDates={{
                    [tempDate]: { selected: true, selectedColor: "#E17A9B" },
                  }}
                  renderHeader={renderCustomHeader}
                  theme={{
                    arrowColor: "#E17A9B",
                    todayTextColor: "#E17A9B",
                  }}
                />
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
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default DatePickerInput;
