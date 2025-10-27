import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/home/Home";
import ChatBot from "../screens/chatbot/ChatBot";
import Camera from "../screens/camera/Camera";
import {
  Bot,
  CalendarDays,
  CameraIcon,
  House,
  UserRound,
} from "lucide-react-native";
import RecordNavigator from "./RecordNavigator";
import SettingNavigator from "./SettingNavigator";

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
      <Tab.Screen name="홈" component={Home} options={{ tabBarIcon: ({ focused }) => <House size={18} color={focused ? '#FF69B4' : 'black'} /> }} />
      <Tab.Screen name="챗봇" component={ChatBot} options={{ tabBarIcon: ({ focused }) => <Bot size={18} color={focused ? '#FF69B4' : 'black'} /> }} />
      <Tab.Screen name="촬영" component={Camera} options={{ tabBarIcon: ({ focused }) => <CameraIcon size={18} color={focused ? '#FF69B4' : 'black'} /> }} />
      <Tab.Screen name="기록" component={RecordNavigator} options={{ tabBarIcon: ({ focused }) => <CalendarDays size={18} color={focused ? '#FF69B4' : 'black'} /> }} />
      <Tab.Screen name="설정" component={SettingNavigator} options={{ tabBarIcon: ({ focused }) => <UserRound size={18} color={focused ? '#FF69B4' : 'black'} /> }} />
    </Tab.Navigator>
  );
}
