import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Header from "../../components/common/Header";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { UserRound, Bell, Shield } from "lucide-react-native";
import SettingItem from "../../components/setting/settingItem";
import { SettingsStackParamList } from "../../navigation/SettingNavigator";

type SettingScreenNavigationProp =
  NativeStackNavigationProp<SettingsStackParamList>;

export default function Setting() {
  const navigation = useNavigation<SettingScreenNavigationProp>();

  // 각 항목 클릭 시 이동할 함수 정의
  const handleNavigateToProfile = () =>
    navigation.navigate("EditHealthProfile");
  const handleNavigateToNotifications = () =>
    navigation.navigate("NotificationSettings");
  //const handleNavigateToPolicy = () => navigation.navigate("PrivacyPolicy");

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말로 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "확인", onPress: () => console.log("로그아웃 실행") },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
          <Header title="설정" />
      <View className="p-4">
        <SettingItem
          icon={<UserRound size={24} color="black" />}
          label="개인정보 수정"
          onPress={handleNavigateToProfile}
        />
        <SettingItem
          icon={<Bell size={24} color="black" />}
          label="알림 설정"
          onPress={handleNavigateToNotifications}
        />
        {/*
        <SettingItem
          icon={<Shield size={24} color="black" />}
          label="개인정보 처리방침"
          onPress={handleNavigateToPolicy}
        /> */}

        <TouchableOpacity onPress={handleLogout} className="items-end p-4">
          <Text className="text-gray-500">로그아웃</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
