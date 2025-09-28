import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function OnboardingScreen({ navigation }: any) {
  const handleSkip = () => {
    // 개발용: 바로 TabNavigation으로 이동
    navigation.replace("Tab");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to CloudBread!</Text>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>개발용: Tab으로 이동</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  skipButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  skipText: { color: "white", fontWeight: "bold" },
});
