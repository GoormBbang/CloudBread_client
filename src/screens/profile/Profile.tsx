import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import Button from "../../components/common/Button";
import { ChevronRight } from "lucide-react-native";
import Border from "../../components/common/Border";
import Header from "../../components/common/Header";
import { useEffect, useState } from "react";
import { getUserInfo } from "../../api/services/home";
import { UserInfoType } from "../../api/types/home";
import { useNavigation, CommonActions, useFocusEffect } from "@react-navigation/native";
import { getUserProfile, updateProfileImage } from "../../api/services/profile";
import { UserProfile } from "../../api/types/user";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import * as ImagePicker from 'expo-image-picker';
import Toast from "react-native-toast-message";
import React from "react";

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Profile() {
  const navigation = useNavigation<ProfileNavigationProp>();
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
const [profileData, setProfileData] = useState<UserProfile | null>(null);

const fetchUserInfo = async () => {
  const res = await getUserInfo();
  const profileData = await getUserProfile();
  console.log(profileData);
  if(res.isSuccess) {
    setUserInfo(res.result);
  }
  if(profileData.isSuccess) {
    setProfileData(profileData.result);
  
}
}

useEffect(() => {
  fetchUserInfo();
}, []);

// ChangeName이나 ChangeBirth에서 돌아올 때마다 프로필 정보 새로고침
useFocusEffect(
  React.useCallback(() => {
    fetchUserInfo();
  }, [])
);

// 이미지 선택 및 업로드
const handleChangeProfileImage = async () => {
  // 권한 요청
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (status !== 'granted') {
    Alert.alert(
      '권한 필요',
      '프로필 이미지를 변경하려면 사진 라이브러리 접근 권한이 필요합니다.',
      [{ text: '확인' }]
    );
    return;
  }

  // 이미지 선택
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    const imageUri = result.assets[0].uri;
    
    try {
      // 이미지 업로드
      const response = await updateProfileImage(imageUri);
      
      if (response.isSuccess) {
        Toast.show({
          text1: '프로필 이미지가 변경되었습니다',
          type: 'success',
        });
        
        // 사용자 정보 다시 가져오기
        await fetchUserInfo();
      } else {
        Toast.show({
          text1: '이미지 업로드 실패',
          text2: '다시 시도해주세요',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('프로필 이미지 업로드 오류:', error);
      Toast.show({
        text1: '이미지 업로드 중 오류가 발생했습니다',
        type: 'error',
      });
    }
  }
};


  return (
    <View className="flex-1 bg-white">
      <Header title="프로필" />
      <View style={{ flex: 1, alignItems: "center" , padding: 40, marginTop: 20}}>
     
     <View className="flex-col items-center gap-2">
      <Image source={{ uri: userInfo?.profileImageUrl }} resizeMode="contain" className="w-20 h-20 rounded-full" />
     <Button text="프로필 이미지 변경" onPress={handleChangeProfileImage} className="w-full h-[38px] px-2 text-[12px]" />
     </View>
     
     <View className="w-full mt-20" >
     <TouchableOpacity className="flex-row justify-between items-center gap-2 w-full" onPress={() => {
       navigation.navigate('ChangeName', { nickname: profileData?.nickname || '' });
     }}>
      <Text className="text-[20px] font-bold">이름</Text>
      <View className="flex-row items-center gap-2"><Text className="text-[16px] font-medium text-[#525252]">{profileData?.nickname}</Text><ChevronRight size={16} color="#525252" /></View>
     </TouchableOpacity>
     <TouchableOpacity className="flex-row justify-between items-center gap-2 w-full mt-4 mb-7" onPress={() => {
       navigation.navigate('ChangeBirth');
     }}>
      <Text className="text-[20px] font-bold">생년월일</Text>
      <View className="flex-row items-center gap-2">
        <Text className="text-[16px] font-medium text-[#525252]">
          {profileData?.birthDate ? Array.isArray(profileData.birthDate) ? profileData.birthDate : profileData.birthDate : '생일정보 입력하기'}
        </Text>
        <ChevronRight size={16} color="#525252" />
      </View>
     </TouchableOpacity>
     <Border className="w-full mt-8" borderColor="gray" borderStyle="solid"/>
     </View>

    

  <View className="w-full mt-8 items-center justify-center mt-8">
  <Text className="text-[13px] font-medium text-[#ef4444]">회원탈퇴</Text>
</View>
      </View>
    </View>
  );
}