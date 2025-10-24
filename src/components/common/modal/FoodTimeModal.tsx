import { Square, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Dimensions, Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Border from "../Border";
import Button from "../Button";
import { postSelectedTime } from "../../../api/services/camera";

interface FoodTimeModalProps {
  visible: boolean;
  foodId: string;
  photoAnalysisId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const timeList = [
  {
    name: "아침",
    value: "BREAKFAST",
  },
  {
    name: "점심",
    value: "LUNCH",
  },
  {
    name: "저녁",
    value: "DINNER",
  },
]

const {height:screenHeight} = Dimensions.get('window');

export default function FoodTimeModal({visible,onClose, foodId, photoAnalysisId, onSuccess}:FoodTimeModalProps) {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  //화면 높이만큼 아래에 숨겨두고, 보일 때 0으로 이동
  const [selectedTime, setSelectedTime] = useState<string>("");

const submitSelectedTime = async () => {
  const res = await postSelectedTime({foodId, photoAnalysisId, mealType: selectedTime, intakePercent: 100});
  if(res.isSuccess) {
    Alert.alert("성공", "섭취 기록이 저장되었습니다!", [
      {
        text: "확인",
        onPress: () => {
          // Alert 확인 후 모달 닫고 홈으로 이동
          Animated.timing(slideAnim, {
            toValue: screenHeight,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            onClose();
            // 애니메이션 완료 후 홈으로 이동
            if(onSuccess) {
              setTimeout(() => onSuccess(), 100);
            }
          });
        }
      }
    ]);
  }

}

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
            <View className="w-full h-fit">
            <ScrollView className="w-full bg-white rounded-lg p-4">
              
              {timeList.map((time) => (
                <View key={time.value}>
                    <View className="w-full h-fit flex-row justify-between items-center">
                    <Text className="text-[14px] font-medium text-gray-800 py-4">{time.name}</Text>
                    <Square strokeWidth={2} size={20} color={selectedTime === time.value ? "#E46592" : "#6B7280"} fill={selectedTime === time.value ? "#E46592" : "transparent"} onPress={() => setSelectedTime(time.value)} />
                  </View>
                  <Border borderWidth='thin' borderColor='gray' />
                </View>
              ))}
              
            </ScrollView>
            </View>
            <Button text="완료" onPress={submitSelectedTime} className="h-11 bg-main-pink rounded-[8px] mt-4" />
          </Animated.View>
        </View>
      </Modal>  
    );
}