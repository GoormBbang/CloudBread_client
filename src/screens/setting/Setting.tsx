import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import Header from "../../components/common/Header";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { UserRound, Bell, Shield } from "lucide-react-native";
import SettingItem from "../../components/setting/settingItem";
//import { SettingsStackParamList } from "../../navigation/SettingNavigator";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { useAuthStore } from "../../store/authStore";
import { useLogout } from "../../hooks/user";
import { clearActiveSession } from "../../store/chatStorage";

type SettingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EditHealthProfile"
>;

export default function Setting() {
  const navigation = useNavigation<SettingScreenNavigationProp>();
  const { signOut } = useAuthStore();
  const { mutate: logoutMutate, isPending } = useLogout();
  // 각 항목 클릭 시 이동할 함수 정의
  const handleNavigateToProfile = () =>
    navigation.navigate("EditHealthProfile");
  // const handleNavigateToNotifications = () =>
  //   navigation.navigate("NotificationSettings");
  //const handleNavigateToPolicy = () => navigation.navigate("PrivacyPolicy");

  const performLogout = () => {
    logoutMutate(undefined, {
      onSuccess: async () => {
        await clearActiveSession();
        signOut();

        navigation.reset({
          index: 0,
          routes: [{ name: "Onboarding" }],
        });
      },
      onError: (error) => {
        console.error("Logout failed:", error);
        Alert.alert("오류", "로그아웃에 실패했습니다. 다시 시도해주세요.");
      },
    });
  };

  const handleLogout = () => {
    if (isPending) return;

    Alert.alert("로그아웃", "정말로 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "확인",
        onPress: performLogout,
        style: "destructive",
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <Header title="설정" />
      <View className="p-4">
        <SettingItem
          icon={<UserRound size={24} color="black" />}
          label="개인정보 수정"
          onPress={handleNavigateToProfile}
        />
        {/* <SettingItem
          icon={<Bell size={24} color="black" />}
          label="알림 설정"
          onPress={handleNavigateToNotifications}
        /> */}
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
    </ScrollView>
  );
}