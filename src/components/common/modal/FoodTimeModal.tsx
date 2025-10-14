import { Square, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Border from "../Border";
import Button from "../Button";

interface FoodTimeModalProps {
  visible: boolean;
  onClose: () => void;
}

const {height:screenHeight} = Dimensions.get('window');

export default function FoodTimeModal({visible,onClose}:FoodTimeModalProps) {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  //화면 높이만큼 아래에 숨겨두고, 보일 때 0으로 이동
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    if (visible) {
      // 모달이 열릴 때 아래에서 위로 올라오는 애니메이션
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
        Animated.timing(slideAnim, {
            toValue: screenHeight,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }
  }, [visible, slideAnim]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
        onClose();
    });
  };
  return (
    <Modal 
      transparent={true} 
      visible={visible} 
      onRequestClose={handleClose} 
      animationType="none" 
      statusBarTranslucent={true}
      >
        <View className="flex-1 bg-black/50" style={{ zIndex: 9999 }}>
        <TouchableWithoutFeedback onPress={handleClose}>
            <View className="flex-1" />
        </TouchableWithoutFeedback>

        <Animated.View style={{transform: [{translateY: slideAnim}], zIndex: 10000}} className="bg-white rounded-t-3xl px-3 max-h-[40%] min-h-[40%]">
          {/* 헤더 */}
           <View className="w-full bg-white rounded-lg p-4 pt-6 flex-row justify-between items-center">
                <Text className="text-[18px] font-bold text-gray-800 mt-4">음식 섭취 시간을 선택해주세요!</Text>
                <TouchableOpacity
              onPress={handleClose}
              className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            >
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
            </View>
            <ScrollView className="w-full h-full bg-white rounded-lg p-4">
              <View className="w-full h-fit flex-row justify-between items-center">
                <Text className="text-[14px] font-medium text-gray-800 py-4">아침</Text>
                <Square strokeWidth={2} size={20} color={selectedTime === "아침" ? "#E46592" : "#6B7280"} fill={selectedTime === "아침" ? "#E46592" : "transparent"} onPress={() => setSelectedTime("아침")} />
              </View>
              <Border borderWidth='thin' borderColor='gray' />
              <View className="w-full h-fit flex-row justify-between items-center">
                <Text className="text-[14px] font-medium text-gray-800 py-4">점심</Text>
                <Square strokeWidth={2} size={20} color={selectedTime === "점심" ? "#E46592" : "#6B7280"} fill={selectedTime === "점심" ? "#E46592" : "transparent"} onPress={() => setSelectedTime("점심")} />
              </View>
              <Border borderWidth='thin' borderColor='gray' />
              <View className="w-full h-fit flex-row justify-between items-center">
                <Text className="text-[14px] font-medium text-gray-800 py-4">저녁</Text>
                <Square strokeWidth={2} size={20} color={selectedTime === "저녁" ? "#E46592" : "#6B7280"} fill={selectedTime === "저녁" ? "#E46592" : "transparent"} onPress={() => setSelectedTime("저녁")} />
              </View>

              <Button text="완료" onPress={handleClose} className="h-11 bg-main-pink rounded-[8px] mt-6" />
            </ScrollView>
        </Animated.View>
        </View>
    </Modal>
  );
}
