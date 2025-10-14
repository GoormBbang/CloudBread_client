import React, { useLayoutEffect } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Check, Search, Heart, Smile, Bell } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
//import { AuthStackParamList } from '../../navigation/AuthNavigator'; // 네비게이터 타입 경로

// 네비게이션 prop 타입을 정의합니다.
//type Props = StackScreenProps<AuthStackParamList, 'SignUpSuccess'>;

// 서비스 항목을 위한 작은 컴포넌트
const ServiceItem = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
  <View className="flex-row items-center mb-4">
    <Icon color="#E17A9B" size={22} className="mr-3" />
    <Text className="text-base text-gray-700">{text}</Text>
  </View>
);

export default function SignUpSuccessScreen({ navigation }: any) {
  // Zustand 스토어에서 사용자 정보를 가져옵니다.
  const { user } = useAuthStore();

  // 화면 헤더의 제목을 설정합니다.
  useLayoutEffect(() => {
    navigation.setOptions({
      title: '회원가입',
      headerBackVisible: false, // 뒤로가기 버튼 숨김
    });
  }, [navigation]);

  // '시작하기' 버튼 클릭 시 Tab 네비게이터로 이동 (뒤로가기 방지)
  const goToNextStep = () => {
    navigation.replace('Tab');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center px-6 pt-16">
        {/* 상단 완료 섹션 */}
        <View className="items-center">
          <View className="w-20 h-20 bg-pink-100 rounded-full justify-center items-center mb-6">
            <Check size={40} color="#E17A9B" strokeWidth={3} />
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            회원가입이 완료되었습니다!
          </Text>
          <Text className="text-base text-gray-500 mb-8">
            환영합니다! 이제 아래 서비스를 이용하실 수 있습니다.
          </Text>
        </View>

        {/* 사용자 정보 카드 */}
        {user && (
          <View className="w-full flex-row items-center bg-gray-50 rounded-lg p-4 mb-10">
            <Image
              source={{ uri: user.profileImageUrl }}
              className="w-12 h-12 rounded-full mr-4"
            />
            <View>
              <Text className="text-base font-bold text-gray-800">{user.nickname} 님</Text>
              {/* 이메일 정보가 있다면 user 객체에서 가져올 수 있습니다. */}
              {/* <Text className="text-sm text-gray-500">{user.email}</Text> */}
            </View>
          </View>
        )}

        {/* 이용 가능한 서비스 목록 */}
        <View className="w-full">
          <Text className="text-lg font-semibold text-gray-800 mb-5">
            이제 이용 가능한 서비스
          </Text>
          <ServiceItem icon={Search} text="임산부 맞춤 영양 분석" />
          <ServiceItem icon={Heart} text="개인 맞춤 건강 관리" />
          <ServiceItem icon={Smile} text="임산부를 위한 개인 맞춤형 식단 추천" />
          <ServiceItem icon={Bell} text="맞춤형 알림 서비스" />
        </View>
      </View>

      <Button text="시작하기" onPress={goToNextStep} />
    </SafeAreaView>
  );
}