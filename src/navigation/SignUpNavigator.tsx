import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../screens/auth/OnboardingScreen";
import SignUpPersonalScreen from "../screens/auth/SignUpPersonalScreen";
import SignUpHealthScreen from "../screens/auth/SignUpHealthScreen";

export type OnboardingStackParamList = {
  Step1: undefined;
  Step2: undefined;
  Step3: undefined;
};

const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();

export default function SignUpNavigator() {
  return (
    <OnboardingStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          flex: 1,
          backgroundColor: "#FFFFFF",
        },
      }}
    >
      <OnboardingStack.Screen name="Step1" component={OnboardingScreen} />
      <OnboardingStack.Screen name="Step2" component={SignUpPersonalScreen} />
      <OnboardingStack.Screen name="Step3" component={SignUpHealthScreen} />
    </OnboardingStack.Navigator>
  );
}
