import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/home/Home";
import ChatBot from "../screens/chatbot/ChatBot";
import Camera from "../screens/camera/Camera";
import Setting from "../screens/setting/Setting";
import { Bot, CalendarDays, CameraIcon, House, UserRound, ArrowLeft } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
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
    <Tab.Navigator screenOptions={{ 
      headerShown: true,
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: 'black', // 뒤로가기 버튼과 텍스트 색상
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 16 }}>
          <ArrowLeft size={24} color="black" />
        </TouchableOpacity>
      ),
      tabBarActiveTintColor: '#FF69B4', // 메인핑크 색상
      tabBarInactiveTintColor: 'black' // 비활성 색상 (회색)
    }}>
      <Tab.Screen name="홈" component={Home} options={{ tabBarIcon: ({ focused }) => <House size={18} color={focused ? '#FF69B4' : 'black'} /> }} />
      <Tab.Screen name="챗봇" component={ChatBot} options={{ tabBarIcon: ({ focused }) => <Bot size={18} color={focused ? '#FF69B4' : 'black'} /> }} />
      <Tab.Screen name="촬영" component={Camera} options={{ tabBarIcon: ({ focused }) => <CameraIcon size={18} color={focused ? '#FF69B4' : 'black'} /> }} />
      <Tab.Screen name="기록" component={Record} options={{ tabBarIcon: ({ focused }) => <CalendarDays size={18} color={focused ? '#FF69B4' : 'black'} /> }} />
      <Tab.Screen name="설정" component={Setting} options={{ tabBarIcon: ({ focused }) => <UserRound size={18} color={focused ? '#FF69B4' : 'black'} /> }} />
    </Tab.Navigator>
  );
}
