import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Checkbox, { CheckboxData } from "../../components/common/Checkbox";
import MultiSelectFilter from "../../components/common/MultiSelectFilter";
import DatePickerInput from "../../components/common/DatePickerInput";
import {
  useGetMyProfile,
  useUpdateMyProfile,
  useGetMetadata,
} from "../../hooks/user";
import { useAuthStore } from "../../store/authStore";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/common/Header";

// 타입 정의 (api/types/user.ts 파일 등에 위치하는 것이 이상적)
interface Item {
  id: number;
  name: string;
}

export default function SettingHealthScreen() {
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useGetMyProfile();
  const {
    data: metadata,
    isLoading: isMetadataLoading,
    isError: isMetadataError,
  } = useGetMetadata();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateMyProfile();

  const today = new Date().toISOString().split("T")[0];
  const [nickname, setNickname] = useState("");
  const [dueDate, setDueDate] = useState(today);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [selectedDietIds, setSelectedDietIds] = useState<number[]>([]);
  const [selectedHealthIds, setSelectedHealthIds] = useState<number[]>([]);
  const [selectedAllergyIds, setSelectedAllergyIds] = useState<number[]>([]);
  const [otherHealthFactors, setOtherHealthFactors] = useState("");
  const { user } = useAuthStore();
  const navigation = useNavigation();
  useEffect(() => {
    if (profileData) {
      setNickname(profileData.nickname || "");
      setHeight(profileData.height?.toString() || "");
      setWeight(profileData.weight?.toString() || "");
      setDueDate(profileData.dueDate || today);
      setOtherHealthFactors(profileData.other_health_factors || "");
      setSelectedDietIds(
        profileData.dietTypes?.map((item: Item) => item.id) || []
      );
      setSelectedHealthIds(
        profileData.healthTypes?.map((item: Item) => item.id) || []
      );
      setSelectedAllergyIds(
        profileData.allergies?.map((item: Item) => item.id) || []
      );
    }
  }, [profileData]);

  const handleToggleId = (
    id: number,
    selectedIds: number[],
    setter: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    setter(
      selectedIds.includes(id)
        ? selectedIds.filter((currentId) => currentId !== id)
        : [...selectedIds, id]
    );
  };

  const handleSave = () => {
    const payload = {
      nickname: nickname,
      dueDate: dueDate,
      height: parseFloat(height) || null,
      weight: parseFloat(weight) || null,
      dietTypeIds: selectedDietIds,
      healthTypeIds: selectedHealthIds,
      allergyIds: selectedAllergyIds,
      otherHealthFactors: otherHealthFactors,
    };
    updateProfile(payload);
  };

  if (isProfileLoading || isMetadataLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isProfileError || isMetadataError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>데이터를 불러오는 데 실패했습니다.</Text>
      </View>
    );
  }

  const dietItems: CheckboxData[] =
    metadata?.result?.dietTypes.map((item: Item) => ({
      id: item.id,
      label: item.name,
      checked: selectedDietIds.includes(item.id),
    })) || [];

  const healthItems: CheckboxData[] =
    metadata?.result?.healthTypes.map((item: Item) => ({
      id: item.id,
      label: item.name,
      checked: selectedHealthIds.includes(item.id),
    })) || [];

  const handleNavigateToEditProfile = () => {
    // 'EditProfile'은 네비게이터에 등록된 실제 화면 이름으로 바꿔주세요.
    navigation.navigate("EditProfile" as never);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Header title="개인 정보 수정" />
      <ScrollView
        className="flex-1 bg-white flex"
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={handleNavigateToEditProfile}
          activeOpacity={0.8} // 터치 시 투명도 (0 ~ 1)
        >
          <View className="flex justify-center items-center w-full">
            {user?.profileImageUrl && (
              <Image
                source={{ uri: user.profileImageUrl }}
                resizeMode="cover"
                className="w-[120px] h-[120px] rounded-full mb-2"
              />
            )}
            <Input
              label="닉네임"
              value={nickname}
              onChangeText={setNickname}
              placeholder="닉네임을 입력하세요"
              disabled={true}
            />
          </View>
        </TouchableOpacity>

        <DatePickerInput
          label="출산 예정일"
          value={dueDate}
          onDateChange={setDueDate}
          className="mt-4"
        />
        <View className="flex-row w-full mb-4">
          <View className="flex-1 mr-2">
            <Input
              label="체중(kg)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1 ml-2">
            <Input
              label="키(cm)"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Checkbox
          groupLabel="평소 식단"
          items={dietItems}
          onItemPress={(id) =>
            handleToggleId(id, selectedDietIds, setSelectedDietIds)
          }
        />
        <Checkbox
          groupLabel="개인 건강상태 (중복선택가능)"
          items={healthItems}
          onItemPress={(id) =>
            handleToggleId(id, selectedHealthIds, setSelectedHealthIds)
          }
        />
        <MultiSelectFilter
          title="알레르기"
          items={metadata?.result?.allergies || []}
          selectedItems={selectedAllergyIds}
          onSelectionChange={setSelectedAllergyIds}
        />
        <Input
          label="기타 건강상태"
          value={otherHealthFactors}
          onChangeText={setOtherHealthFactors}
          placeholder="기타 건강상태나 특이사항을 입력해주세요"
          multiline
        />

        <View className="mt-8 mb-4">
          <Button
            text={isUpdating ? "저장 중..." : "저장하기"}
            onPress={handleSave}
            disabled={isUpdating}
            style={{ paddingVertical: 20 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
