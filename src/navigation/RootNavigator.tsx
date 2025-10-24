import React from "react";
import TabNavigation from "./TabNavigation";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import SignUpNavigator from "./SignUpNavigator";
import Profile from "../screens/profile/Profile";
import ChangeBirth from "../screens/changeBirth/ChangeBirth";
import ChangeName from "../screens/changeName/ChangeName";
import Camera from "../screens/camera/Camera";
import NutritionDetailScreen from "../screens/record/NutritionDetailScreen";
import Home from "../screens/home/Home";

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export type RootStackParamList = {
  Onboarding: undefined;
  Tab: undefined;
  Profile: undefined;
  ChangeBirth: undefined;
  ChangeName: { nickname? : string };
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
      <Stack.Screen name="ChangeBirth" component={ChangeBirth} />
      <Stack.Screen name="ChangeName" component={ChangeName} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Camera" component={Camera} />
      <Stack.Screen name="NutritionDetail" component={NutritionDetailScreen} />
    </Stack.Navigator>
  );
}
