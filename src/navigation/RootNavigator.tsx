import React from "react";
import TabNavigation from "./TabNavigation";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import SignUpNavigator from "./SignUpNavigator";
import Home from "../screens/home/Home";
import Profile from "../screens/profile/Profile";
import Camera from "../screens/camera/Camera";
import NutritionDetailScreen from "../screens/record/NutritionDetailScreen";

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export type RootStackParamList = {
  Onboarding: undefined;
  Tab: undefined;
  Profile: undefined;
  Home: undefined;
  Camera: undefined;
  NutritionDetail: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "white",
        },
      }}
    >
      <Stack.Screen name="Onboarding" component={SignUpNavigator} />
      <Stack.Screen name="Tab" component={TabNavigation} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Camera" component={Camera} />
      <Stack.Screen name="NutritionDetail" component={NutritionDetailScreen} />
    </Stack.Navigator>
  );
}
