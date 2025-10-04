import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, Platform, StyleSheet } from "react-native";
import RootNavigator from "./src/navigation/RootNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#f5f5f5' : '#ffffff',
    ...Platform.select({
      web: {
        alignItems: 'center',
        justifyContent: 'center',
      }
    })
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 400 : undefined,
    backgroundColor: '#ffffff',
    ...Platform.select({
      web: {
        height: '100vh',
        boxShadow: '0 0 30px rgba(0,0,0,0.15)',
        overflow: 'hidden',
      }
    })
  }
});


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
