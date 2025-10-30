import {
  CameraIcon,
  ImageIcon,
  Square,
  CircleQuestionMark,
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Button from "../../components/common/Button";
import Border from "../../components/common/Border";
import FoodTimeModal from "../../components/common/modal/FoodTimeModal";
import NutritionDetail from "../../components/common/NutritionDetail";
import {
  getFoodSuggest,
  postImageUpload,
  postSelectedFood,
} from "../../api/services/camera";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../../navigation/TabNavigation";
import Header from "../../components/common/Header";
import { CompositeNavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Input from "../../components/common/Input";

// type CameraNavigationProp = BottomTabNavigationProp<TabParamList, '촬영'>;
type CameraNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "촬영">,
  NativeStackNavigationProp<RootStackParamList>
>;

type suggestionType = {
  foodId: string;
  name: string;
  category: string;
  calories: number;
};

export default function Camera() {
  const navigation = useNavigation<CameraNavigationProp>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [showFoodTimeModal, setShowFoodTimeModal] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [photoAnalysisId, setPhotoAnalysisId] = useState<string | null>(null);
  const [nutritionInfo, setNutritionInfo] = useState<any[]>([]);
  const [foodInfo, setFoodInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [foodInput, setFoodInput] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<suggestionType[]>([]);

  // 화면 포커스 해제 시 상태 초기화
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // 다른 탭으로 이동할 때 모든 상태 초기화
        setSelectedImage(null);
        setStep(0);
        setSelectedFood(null);
        setShowFoodTimeModal(false);
        setCandidates([]);
        setPhotoAnalysisId(null);
        setNutritionInfo([]);
        setFoodInfo(null);
        setIsLoading(false);
        setFoodInput("");
        setShowSuggestions(false);
        setSuggestions([]);
      };
    }, [])
  );

  // 음식 입력값에 따른 필터링된 추천 리스트
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!foodInput.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const suggestionsData = await getFoodSuggest(foodInput);
        setSuggestions(suggestionsData.result.slice(0, 5)); // 최대 5개까지만 표시
      } catch (error) {
        console.error("음식 추천 조회 오류:", error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [foodInput]);

  // 음식 입력 핸들러
  const handleFoodInputChange = (text: string) => {
    setFoodInput(text);
    setShowSuggestions(text.length > 0);
  };

  // 추천 음식 선택 핸들러
  const handleSuggestionSelect = (suggestion: suggestionType) => {
    setFoodInput(suggestion.name);
    setSelectedFood(suggestion.foodId);
    setShowSuggestions(false);
  };

  //이미지 업로드 및 SSE 구독
  const ImageUploadApi = async (imageUri: string) => {
    const response = await postImageUpload(imageUri, {
      onStatus: (status) => console.log("SSE status:", status),
      onCandidates: (candidates) => {
        console.log("Received candidates:", candidates);
        console.log("First candidate structure:", candidates[0]);
        setCandidates(candidates);
        setIsLoading(false);
      },
      onError: (error) => console.error("SSE error:", error),
      onOpen: () => console.log("SSE opened"),
    });

    setPhotoAnalysisId(response);
  };

  //음식 선택 후 step2로 이동
  const handleSelectFood = async () => {
    if (!selectedFood) return;

    setIsLoading(true); // 로딩 시작

    try {
      const res = await postSelectedFood(photoAnalysisId || "", selectedFood);

      if (res.isSuccess) {
        const selectedData = res.result.selected;
        const nutrientsObj = selectedData.nutrients || {};

        console.log(selectedData);
        // 객체를 배열로 변환
        const nutrientsArray = Object.values(nutrientsObj);

        // 데이터 설정
        setFoodInfo(selectedData);
        setNutritionInfo(nutrientsArray);

        // step 변경 및 로딩 종료
        setStep(2);
        setIsLoading(false);
      } else {
        console.log("선택된 음식 정보 조회 실패");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("음식 선택 오류:", error);
      setIsLoading(false);
    }
  };

  const openCamera = async () => {
    try {
      // 카메라 권한 확인
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.status !== "granted") {
        Alert.alert("권한 필요", "카메라 사용을 위해 권한이 필요합니다.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log("이미지 선택됨:", result.assets[0].uri);
        setSelectedImage(result.assets[0].uri);
        ImageUploadApi(result.assets[0].uri);
        setIsLoading(true);
        setStep(1);
      }
    } catch (error) {
      console.error("카메라 실행 오류:", error);
      setIsLoading(false);
    }
  };

  const openGallery = async () => {
    try {
      // 갤러리 권한 요청
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("권한 필요", "갤러리 접근을 위해 권한이 필요합니다.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        // console.log('이미지 선택됨:', result.assets[0].uri);
        setSelectedImage(result.assets[0].uri);
        ImageUploadApi(result.assets[0].uri);
        setIsLoading(true);
        setStep(1);
      }
    } catch (error) {
      console.log("갤러리 실행 오류:", error);
    }
  };

  // 섭취 기록 저장 후 홈으로 이동
  const handleNavigateToHome = () => {
    navigation.navigate("홈");
  };

  // 다시 촬영하기 핸들러
  const handleRetake = () => {
    setStep(0);
    setSelectedImage(null);
    setSelectedFood(null);
    setCandidates([]);
    setPhotoAnalysisId(null);
    setNutritionInfo([]);
    setFoodInfo(null);
    setFoodInput("");
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="촬영" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 200 }}
          className="mx-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
          automaticallyAdjustKeyboardInsets={true}
        >
          <View className="w-full bg-[#FFe2e2b3] rounded-[8px] items-center justify-center border-[#e46592] pb-8 border-[1px] mt-10">
            <CameraIcon
              className="text-[#ffe2e2b3] mt-9"
              fill="#e46592"
              size={30}
              strokeWidth={2}
            />
            <Text className="text-[18px] mt-4">음식 사진 촬영</Text>
            <Text className="text-[#4b5563] mt-2 mb-6">
              카메라로 촬영하거나 갤러리에서 선택하세요
            </Text>
            <View className="px-8 w-full">
              <Button
                text="카메라 촬영"
                onPress={openCamera}
                className="rounded-[8px] h-12 mb-3"
                icon={
                  <CameraIcon
                    fill="#ffffff"
                    className="text-[#e46592]"
                    size={22}
                    strokeWidth={2}
                  />
                }
              />
              <Button
                text="갤러리에서 선택"
                onPress={openGallery}
                variant="CUSTOM"
                className="rounded-[8px] h-12 bg-[#ffe2e2b3]"
                textColor="#e46592"
                style={{
                  borderWidth: 1,
                  borderColor: "#e46592",
                }}
                icon={
                  <ImageIcon
                    fill="#ffe2e2b3"
                    className="text-[#e46592]"
                    size={20}
                    strokeWidth={2}
                  />
                }
              />
            </View>
          </View>

          {step === 1 && (
            <View className="w-full h-fit mt-4 border-[1px] border-gray-300 rounded-[8px] p-4 bg-white">
              <View className="w-full py-4 items-center justify-center">
                {selectedImage ? (
                  <Image
                    source={{ uri: selectedImage }}
                    style={{ width: 400, height: 300, borderRadius: 8 }}
                    resizeMode="contain"
                  />
                ) : (
                  <View className="w-48 h-32 bg-gray-100 rounded-[8px] items-center justify-center">
                    <Text className="text-gray-400">사진을 촬영해주세요</Text>
                  </View>
                )}
              </View>

              <View className="w-full h-fit pt-4 px-1">
                <Text className="text-[16px] font-bold mb-3">
                  먹은 음식을 선택해주세요!
                </Text>
                {Array.isArray(candidates) &&
                  candidates.map((item, index) => (
                    <View key={index} className="w-full h-fit flex-col">
                      <View className="w-full h-fit flex-row justify-between items-center">
                        <Text className="text-[14px] font-medium py-4">
                          {item?.name || "음식 정보 없음"}
                        </Text>
                        <Square
                          size={20}
                          strokeWidth={2}
                          color={"#e46592"}
                          fill={
                            selectedFood === item?.foodId
                              ? "#e46592"
                              : "transparent"
                          }
                          onPress={() => setSelectedFood(item?.foodId)}
                        />
                      </View>
                      <Border borderWidth="thin" borderColor="lightPink" />
                    </View>
                  ))}

                <View className="w-full h-fit flex-row items-center mt-4">
                  <CircleQuestionMark size={16} strokeWidth={2} />
                  <Text className="text-[14px] font-semibold ml-2">
                    원하는 음식이 없나요? 직접 입력해주세요!
                  </Text>
                </View>
              </View>

              <View className="relative mt-2">
                <Input
                  className="w-full h-11 bg-white rounded-[8px] border-[1px] border-[#e46592] mb-2"
                  placeholder="음식 이름을 입력해주세요."
                  value={foodInput}
                  onChangeText={handleFoodInputChange}
                  variant="CAMERA"
                />

                {/* 음식 추천 리스트 */}
                {showSuggestions && suggestions.length > 0 && (
                  <View
                    className="absolute left-0 right-0 bg-white border-[1px] border-[#e46592] rounded-[8px] z-10 shadow-lg"
                    style={{
                      top: 46,
                      maxHeight: 200,
                      elevation: 5,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                    }}
                  >
                    <ScrollView
                      nestedScrollEnabled={true}
                      showsVerticalScrollIndicator={false}
                      style={{ maxHeight: 200 }}
                    >
                      {suggestions.map((suggestion, index) => (
                        <TouchableOpacity
                          key={suggestion.foodId}
                          onPress={() => handleSuggestionSelect(suggestion)}
                          className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                        >
                          <Text className="text-[14px] text-gray-700">
                            {suggestion.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <Button
                text={isLoading ? "로딩중..." : "다음"}
                onPress={handleSelectFood}
                className="h-11 bg-main-pink rounded-[8px] mb-2"
                disabled={isLoading}
              />
            </View>
          )}

          {step === 2 && !isLoading && (
            <NutritionDetail
              foodName={foodInfo?.name}
              portion="100g 기준"
              imageUri={selectedImage || undefined}
              calories={foodInfo?.calories}
              protein={320}
              fat={12}
              carbs={25}
              detailedNutrients={nutritionInfo}
              onAddToMeal={() => setShowFoodTimeModal(true)}
              onAskAI={() => {
                navigation.navigate("ChatBotFood", {
                  foodId: selectedFood || "",
                  photoAnalysisId: photoAnalysisId || "",
                });
              }}
              onRetake={handleRetake}
            />
          )}

          {/* 식단 시간 모달 */}
          <FoodTimeModal
            foodId={selectedFood || ""}
            photoAnalysisId={photoAnalysisId || ""}
            visible={showFoodTimeModal}
            onClose={() => setShowFoodTimeModal(false)}
            onSuccess={handleNavigateToHome}
          />
        </ScrollView>

        {/* 로딩 화면 - 화면 전체 중앙에 고정 */}
        {isLoading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
            }}
          >
            <ActivityIndicator size="large" color="#e46592" />
            <Text className="text-[16px] font-medium text-[#e46592] mt-6">
              영양 정보를 분석 중입니다.
            </Text>
            <Text className="text-[12px] text-[#4b5563] mt-2">
              잠시만 기다려주세요.
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
