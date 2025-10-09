import React from "react";

import OnboardingScreen from "../screens/auth/OnboardingScreen";
import TabNavigation from "./TabNavigation";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/home/Home";
import Profile from "../screens/profile/Profile";

export type RootStackParamList = {
  Onboarding: undefined;
  Tab: undefined;
  Profile: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Tab" component={TabNavigation} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
