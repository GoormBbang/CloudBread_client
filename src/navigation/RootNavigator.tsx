import React from "react";

import OnboardingScreen from "../screens/auth/OnboardingScreen";
import TabNavigation from "./TabNavigation";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Onboarding: undefined;
  Tab: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Tab" component={TabNavigation} />
    </Stack.Navigator>
  );
}
