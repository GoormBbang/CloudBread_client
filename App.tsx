import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View} from "react-native";
import RootNavigator from "./src/navigation/RootNavigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <View className="flex-1" style={{ backgroundColor: '#ffffff' }}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </View>
    </QueryClientProvider>
  );
}


/*
  
//기본 코드
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
}); */
