import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
} from 'react-native';
import { X } from 'lucide-react-native';
import Border from '../Border';
import { getThisWeekBabyTips } from '../../../api/services/home';
import { ThisWeekTipType } from '../../../api/types/home';


interface BabyInfoModalProps {
  visible: boolean;
  onClose: () => void;
  weekNumber?: number;
}

const { height: screenHeight } = Dimensions.get('window');

export default function BabyInfoModal({ visible, onClose, weekNumber = 20 }: BabyInfoModalProps) {
  const [thisWeekBabyTips, setThisWeekBabyTips] = useState<ThisWeekTipType>();
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  //화면 높이만큼 아래에 숨겨두고, 보일 때 0으로 이동

  useEffect(() => {
    if (visible) {
      // 모달이 열릴 때 아래에서 위로 올라오는 애니메이션
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // 모달이 닫힐 때 위에서 아래로 내려가는 애니메이션
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



  //이번 주차 태아 팁 조회 api
  const fetchThisWeekBabyTips = async () => {
    const data = await getThisWeekBabyTips();
    // console.log('🔑 fetchThisWeekBabyTips:', data.tips[0]);
      setThisWeekBabyTips(data.tips[0]);
 
  }

  useEffect(() => {
    fetchThisWeekBabyTips();
  }, []);

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
        
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            zIndex: 10000,
          }}
          className="bg-white rounded-t-3xl max-h-[80%] min-h-[70%]"
        >
          {/* 헤더 */}
          <View className="flex-row items-center justify-between p-6 mt-4">
           <View className="flex-row items-center gap-2">
           <Image source={require("../../../../assets/image/home/home-baby-info.png")} className="w-12 h-12" resizeMode="contain" />
           <View>
            <Text className="text-xl font-semibold text-gray-800">
              태아 정보
            </Text>
            <Text className="text-[16px] font-light text-gray-800">{thisWeekBabyTips?.title}</Text>
            </View>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mt-[-20px]"
            >
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* 콘텐츠 */}
          <ScrollView className="flex-1 px-6 py-4 mb-6" showsVerticalScrollIndicator={false}>
            {/* 기본 정보 카드 */}
            <View>
              <Text className="text-lg font-semibold pb-2">
              🌱 지금 아이는 이런 상태입니다
              </Text>

              <Border borderColor='pink'/>
            {/* 발달 정보 */}
            <View className='pt-2 px-2'>
              <Text className="text-gray-700 leading-5 text-[14px]">
                {thisWeekBabyTips?.description}
              </Text>
            </View>
            </View>

            {/* 주의사항
            <View className='pt-5'>
              <Text className="text-lg font-semibold">
              ⚠ 주의해주세요!
              </Text>
              <Border borderColor='pink'/>
              <View className="space-y-3">
                <Text className="text-gray-700 leading-5 text-[14px]">
                {thisWeekBabyTips?.description}
              </Text>
              </View>
            </View> */}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
