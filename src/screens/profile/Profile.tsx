import { View, Text, Image } from "react-native";

export default function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
     <View className="flex-col items-center gap-2">
      <Image source={require("../../../assets/image/profile/profile.png")} resizeMode="contain" className="w-20 h-20 rounded-full" />
     </View>
    </View>
  );
}