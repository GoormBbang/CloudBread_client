import React, { useRef, useState } from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface DateInputProps {
  label: string;
  className?: string;
  onDateChange?: (date: string) => void;
}

const DateInput = ({ label, className, onDateChange }: DateInputProps) => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const monthRef = useRef<TextInput>(null);
  const dayRef = useRef<TextInput>(null);

  const handleYearChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "");
    if (numericText.length <= 4) {
      setYear(numericText);
      if (numericText.length === 4) {
        monthRef.current?.focus();
      }
      updateFullDate(numericText, month, day);
    }
  };

  const handleMonthChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "");
    if (numericText.length <= 2) {
      setMonth(numericText);
      if (numericText.length === 2) {
        dayRef.current?.focus();
      }
      updateFullDate(year, numericText, day);
    }
  };

  const handleDayChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "");
    if (numericText.length <= 2) {
      setDay(numericText);
      updateFullDate(year, month, numericText);
    }
  };

  const updateFullDate = (y: string, m: string, d: string) => {
    if (onDateChange && y.length === 4 && m.length === 2 && d.length === 2) {
      onDateChange(`${y}-${m}-${d}`);
    }
  };

  return (
    <View className={`${className} flex flex-col items-start gap-1`}>
      <Text className="text-[16px] font-medium mb-2 text-[#6b7280]">{label}</Text>
      <View className="w-full bg-white border border-input-gray rounded-lg p-4 flex flex-row items-center">
        <TextInput
          className="flex-1 text-base text-black text-center"
          placeholder="YYYY"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          maxLength={4}
          value={year}
          onChangeText={handleYearChange}
        />
        <Text className="text-base text-gray-400 mx-1">/</Text>
        <TextInput
          ref={monthRef}
          className="flex-1 text-base text-black text-center"
          placeholder="MM"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          maxLength={2}
          value={month}
          onChangeText={handleMonthChange}
        />
        <Text className="text-base text-gray-400 mx-1">/</Text>
        <TextInput
          ref={dayRef}
          className="flex-1 text-base text-black text-center"
          placeholder="DD"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          maxLength={2}
          value={day}
          onChangeText={handleDayChange}
        />
      </View>
    </View>
  );
};

export default DateInput;

