import React from "react";
import { TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ArrowLeft } from "lucide-react-native";

// 설정 관련 스크린들을 import 합니다.
import Setting from "../screens/setting/Setting";
import SettingHealthScreen from "../screens/setting/SettingHealthScreen";
import NotificationSettingsScreen from "../screens/setting/NotificationSettingsScreen";

export type SettingsStackParamList = {
  Settings: undefined; // 초기 설정 화면
  EditHealthProfile: undefined; // 개인정보 수정 화면
  NotificationSettings: undefined; // 알림 설정 화면
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: "white",
        },
        headerTintColor: "black",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerBackTitleVisible: false,
        // 사용자 정의 뒤로가기 버튼
        headerLeft: () =>
          navigation.canGoBack() ? (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color="black" />
            </TouchableOpacity>
          ) : null,
      })}
    >
      <Stack.Screen
        name="Settings"
        component={Setting}
        options={{ title: "설정" }} // 헤더 타이틀 설정
      />
      <Stack.Screen
        name="EditHealthProfile"
        component={SettingHealthScreen}
        options={{ title: "개인정보 수정" }}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
        options={{ title: "알림 설정" }}
      />
    </Stack.Navigator>
  );
}
