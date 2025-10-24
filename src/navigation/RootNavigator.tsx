import React from "react";
import TabNavigation from "./TabNavigation";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpNavigator from "./SignUpNavigator";
import Profile from "../screens/profile/Profile";
import ChangeBirth from "../screens/changeBirth/ChangeBirth";
import ChangeName from "../screens/changeName/ChangeName";


export type RootStackParamList = {
  Onboarding: undefined;
  Tab: undefined;
  Profile: undefined;
  ChangeBirth: undefined;
  ChangeName: { nickname? : string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    >
      <Stack.Screen name="Onboarding" component={SignUpNavigator} />
      <Stack.Screen name="Tab" component={TabNavigation} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ChangeBirth" component={ChangeBirth} />
      <Stack.Screen name="ChangeName" component={ChangeName} />
    </Stack.Navigator>
  );
}
