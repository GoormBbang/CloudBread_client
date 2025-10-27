import React, { useState, useRef, useEffect } from "react";
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text,
  Image,
} from "react-native";
import Header from "../../components/common/Header";
import ChatInput from "../../components/chatbot/ChatInput";
import {
  ChatMessage as ChatMessageType,
  postFoodInfo,
  sendChatMessage
} from "../../api/services/chatbot";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootNavigator";
import Button from "../../components/common/Button";
import Border from "../../components/common/Border";
import FoodTimeModal from "../../components/common/modal/FoodTimeModal";
import MessageBubble from "../../components/chatbot/MessageBubble";

interface NutrientInfo {
  value: number;
  unit: string;
  kname: string;
}

interface FoodNutrients {
  calcium?: NutrientInfo;
  carbs?: NutrientInfo;
  cholesterol?: NutrientInfo;
  fats?: NutrientInfo;
  folic_acid?: NutrientInfo;
  iron?: NutrientInfo;
  moisture?: NutrientInfo;
  proteins?: NutrientInfo;
  saturated_fat?: NutrientInfo;
  sodium?: NutrientInfo;
  sugars?: NutrientInfo;
}

interface FoodInfo {
  name: string;
  calories: number;
  foodId: string;
  nutrients: FoodNutrients;
}

export default function ChatBotFood({ route }: { route: RouteProp<RootStackParamList, 'ChatBotFood'> }) {
  const { foodId } = route.params;
  const { photoAnalysisId } = route.params;
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [foodInfo, setFoodInfo] = useState<FoodInfo | null>(null);
  const [foodNutrients, setFoodNutrients] = useState<FoodNutrients | null>(null);
  const [isAddToMealModalVisible, setIsAddToMealModalVisible] = useState(false);
  // 초기 로드: 대화 기록 가져오기
  useEffect(() => {
   loadFoodInfo();
  }, []);

  const loadFoodInfo = async () => {
    try {
      const foodInfo = await postFoodInfo(foodId || '');
      if(foodInfo.isSuccess) {
        setSessionId(foodInfo.result.sessionId);
        setFoodInfo(foodInfo.result.selectedFood);
        setFoodNutrients(foodInfo.result.selectedFood.nutrients);
      }
    } catch (error) {
      console.error("음식 정보 로드 실패:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };


  // 메시지 전송 처리
  const handleSendMessage = async (text: string) => {
  
    // 사용자 메시지 추가
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: text,
      role: "user",
      timestamp: new Date(),
    };
    

    setMessages((prev) => {
      const newMessages = [...prev, userMessage];
      return newMessages;
    });
    setIsLoading(true);

    // 스크롤을 맨 아래로
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // API 호출하여 봇 응답 받기

      const res = await sendChatMessage(text, sessionId || '');
      
      const botMessage: ChatMessageType = {
        id: Date.now().toString() + "_bot",
        content: res.result.response,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => {
        const newMessages = [...prev, botMessage];
        return newMessages;
      });

      // 봇 응답 후 스크롤
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      
      // 에러 발생 시 기본 메시지 표시
      const errorMessage: ChatMessageType = {
        id: Date.now().toString() + "_error",
        content: "죄송합니다. 일시적으로 응답할 수 없습니다. 잠시 후 다시 시도해주세요.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로딩 화면
  if (isInitialLoading) {
    return (
      <View className="flex-1 bg-white">
        <Header title="챗봇" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#EC4899" />
          <Text className="mt-4 text-gray-600">대화 기록을 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  // 메시지가 없을 때 환영 화면
  const EmptyState = () => (
    <View className="flex-1 justify-center items-center px-8">
      <Image
        source={require("../../../assets/image/bot.png")}
        className="w-24 h-24 mb-4"
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold text-gray-800 mb-2">
        영양 AI 챗봇
      </Text>
      <Text className="text-base text-gray-600 text-center">
        영양, 육아, 건강에 대해 궁금한 것을 물어보세요!
      </Text>
    </View>
  );

  console.log(messages);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <Header title="챗봇" />
      <View className="flex-col w-full h-50 bg-main-pink px-6 py-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white text-lg font-bold">분석 결과</Text>
          <Button text="식단에 추가히기" onPress={() => {setIsAddToMealModalVisible(true)}} textColor="#E46592" textSize={12} className="bg-white rounded-[3px] font-regular w-24 py-1" />
        </View>
        <Border borderColor="white"/>
        <View className="flex-col w-full mt-4">
        <View className="flex-row justify-between mb-4">
          <Text className="text-white text-md font-bold">음식명</Text>
          <Text className="text-white text-md font-regular">{foodInfo?.name}</Text></View>
        <View className="flex-row justify-between mb-4">
          <Text className="text-white text-md font-bold">예상 칼로리</Text>
          <Text className="text-white text-md font-regular">{foodInfo?.calories} kcal</Text></View>
        <View className="flex-row justify-between mb-4">
          <Text className="text-white text-md font-bold">주요영양성분</Text>
          <Text className="text-white text-md font-regular w-3/4 text-right">
            {foodNutrients ? Object.values(foodNutrients).map((nutrient) => nutrient.kname).join(", ") : ""}
          </Text>
        </View>
        </View>
        
        
        </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 8,
        }}
        ListEmptyComponent={EmptyState}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {isLoading && (
        <View className="px-4 py-2 flex-row items-center">
          <View className="bg-gray-100 rounded-2xl px-4 py-3 flex-row items-center">
            <ActivityIndicator size="small" color="#EC4899" />
            <Text className="ml-2 text-gray-600">답변 생성 중...</Text>
          </View>
        </View>
      )}

      <ChatInput onSend={handleSendMessage} disabled={isLoading} />

      {/* 식단에 추가하기 모달 */}
      <FoodTimeModal
        visible={isAddToMealModalVisible}
        foodId={foodId || ""}
        photoAnalysisId={photoAnalysisId || ""}
        onClose={() => setIsAddToMealModalVisible(false)}
        onSuccess={() => {}}
      />
    </KeyboardAvoidingView>
  );
}
