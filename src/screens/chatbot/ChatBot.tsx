import { Text, View } from "react-native";
import Header from "../../components/common/Header";

export default function ChatBot() {
    return (
        <View className="flex-1">
            <Header title="챗봇" />
            <View className="flex-1">
                <Text>ChatBot</Text>
            </View>
        </View>
    );
}