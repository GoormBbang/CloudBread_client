import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Header from "../../components/common/Header";
import { useNavigation, CommonActions } from "@react-navigation/native";

export default function Setting() {
  const navigation = useNavigation();

  useEffect(() => {
    // Setting 탭이 활성화되면 Profile 화면으로 이동
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Profile',
      })
    );
  }, []);

  return (
    <View className="flex-1">
      <Header title="설정" />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>설정 화면</Text>
      </View>
    </View>
  );
}
