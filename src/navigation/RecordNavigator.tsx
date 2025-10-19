import React from "react";
import { TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ArrowLeft } from "lucide-react-native";

import Record from "../screens/record/Record";
import NutritionDetail from "../screens/record/NutritionDetailScreen";

export type RecordStackParamList = {
  Record: undefined;
  NutritionDetail: { date: string };
};
const Stack = createNativeStackNavigator<RecordStackParamList>();

export default function RecordNavigator() {
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
        title: "기록",

        headerBackTitleVisible: false,

        headerLeft: () =>
          navigation.canGoBack() ? (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color="black" />
            </TouchableOpacity>
          ) : null,
      })}
    >
      <Stack.Screen name="Record" component={Record} />
      <Stack.Screen name="NutritionDetail" component={NutritionDetail} />
    </Stack.Navigator>
  );
}
