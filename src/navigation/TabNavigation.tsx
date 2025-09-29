import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/home/Home";
import ChatBot from "../screens/chatbot/ChatBot";
import Camera from "../screens/camera/Camera";
import Setting from "../screens/setting/Setting";
import { Bot, CalendarDays, CameraIcon, House, UserRound } from "lucide-react-native";
import Record from "../screens/record/Record";

export type TabParamList = {
  홈: undefined;
  챗봇: undefined;
  촬영: undefined;
  기록: undefined;
  설정: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigation() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="홈" component={Home} options={{ tabBarIcon: () => <House size={18} /> }} />
      <Tab.Screen name="챗봇" component={ChatBot} options={{ tabBarIcon: () => <Bot size={18} /> }} />
      <Tab.Screen name="촬영" component={Camera} options={{ tabBarIcon: () => <CameraIcon size={18} /> }} />
      <Tab.Screen name="기록" component={Record} options={{ tabBarIcon: () => <CalendarDays size={18} /> }} />
      <Tab.Screen name="설정" component={Setting} options={{ tabBarIcon: () => <UserRound size={18} /> }} />
    </Tab.Navigator>
  );
}
