import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import Header from "../../components/common/Header";
import DateInput from "../../components/common/DateInput";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useState } from "react";
import { updateUserName } from "../../api/services/profile";
import Toast from "react-native-toast-message";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootNavigator";

type ChangeNameRouteProp = RouteProp<RootStackParamList, 'ChangeName'>;

export default function ChangeName() {
    const navigation = useNavigation();
    const route = useRoute<ChangeNameRouteProp>();
    const [name, setName] = useState(route.params?.nickname || "");


    const handleChangeName = (text: string) => {
        setName(text);
    }

    const handleUpdateName = async () => {
        try{
            const res=await updateUserName(name);
            if(res.isSuccess) {
                Toast.show({
                    text1: "이름이 변경되었습니다",
                    type: "success",
                });
                navigation.navigate('Profile' as never);
            }
        } catch (error) {
            console.error("Error updating name:", error);
        }
    }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View className="flex-1 bg-white">
        <Header title="프로필 설정" />
      <View className="flex-1 px-4 py-10">
        <View className="mb-8">
            <Text className="text-2xl font-bold">생일을</Text>
            <Text className="text-2xl font-bold">입력해주세요</Text>
        </View>
        <Input 
          label="이름" 
          className="w-full text-[#6b7280]" 
          value={name}
          onChangeText={handleChangeName}
        />
        
        <Button text="변경하기" onPress={handleUpdateName} className="w-full h-12 mt-10 px-2 text-[12px]" />
      </View>

    </View>
  </TouchableWithoutFeedback>
  );
}