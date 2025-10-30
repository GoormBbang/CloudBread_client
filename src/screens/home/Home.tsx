import { Bell, ChevronRight, RefreshCw, Loader2, Sun, Cloud, Moon, CloudSun } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Alert, Animated } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Container from "../../components/common/Container";
import PercentageBar from "../../components/common/PercentageBar";
import BabyInfoModal from "../../components/common/modal/BabyInfoModal";
import { getFoodNutritionDetail, getThisWeekTips, getTodayFoodList, getTodayNutrition, getUserInfo, postTodayFoodListRefresh } from "../../api/services/home";
import { NutrientInfo } from "../../api/types/common";
import { ThisWeekTipsType, TodayAIRecommendationType, UserInfoType } from "../../api/types/home";
import MomInfoModal from "../../components/common/modal/MomInfoModal";
import NutritionInfoModal from "../../components/common/modal/NutritionModal";
import NutritionDetail from "../../components/common/NutritionDetail";
import Button from "../../components/common/Button";
import Header from "../../components/common/Header";
import { startNotificationStream, stopNotificationStream, addNotificationListener } from "../../api/services/notificationStream";
import { useNotificationStore } from "../../store/notificationStore";
import NotificationBadge from "../../components/common/NotificationBadge";
import FoodTimeModal from "../../components/common/modal/FoodTimeModal";
import FoodCatogory from "../../components/common/FoodCatogory";
import { getFormattedToday } from "../../utils/getDate";


interface HomeProps {
  navigation: any;
}

export default function Home({ navigation }: HomeProps) {
  const [nutritionData, setNutritionData] = useState<NutrientInfo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfoType>();
  const [thisWeekTips, setThisWeekTips] = useState<ThisWeekTipsType>();
  // const [thisWeekBabyTips, setThisWeekBabyTips] = useState<ThisWeekBabyTipsType>();
  const [babyInfoModalVisible, setBabyInfoModalVisible] = useState(false);
  const [momInfoModalVisible, setMomInfoModalVisible] = useState(false);
  const [nutritionInfoModalVisible, setNutritionInfoModalVisible] = useState(false);
  const [todayAIRecommendation, setTodayAIRecommendation] = useState<TodayAIRecommendationType[]>([]);
  const [isOpenFoodDetailModal, setIsOpenFoodDetailModal] = useState(false);
  const [foodInfo,setFoodInfo] = useState<any>();
  const [nutritionInfo, setNutritionInfo] = useState<any>();
  const [isOpenFoodTimeModal, setIsOpenFoodTimeModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rotateAnim] = useState(new Animated.Value(0));
  
  // 알림 store
  const addNotification = useNotificationStore((state) => state.addNotification);
//프로필 정보 조회 api
  const fetchUserInfo = async () => {
    const data = await getUserInfo();
    if(data.isSuccess) {
      setUserInfo(data.result);
    }
    // setUserInfo(data.result);
  }
//이번 주차 팁 전제 조회 api
  const fetchThisWeekTips = async () => {
    const data = await getThisWeekTips();
    if(data.isSuccess) {
      setThisWeekTips(data.tips);
    }
  }

//오늘의 영양 분석 api
  const fetchTodayNutrition = async () => {
    try {
      setLoading(true);
      const data = await getTodayNutrition();
      if(data.isSuccess) {
        setNutritionData(data.result.nutrients);
        console.log('🔍 nutritionData:', data.result.nutrients);
      }
    } catch (error) {
      console.error('❌ API 호출 실패:', error);
      // 에러 처리 로직 추가 가능 (예: 토스트 메시지, 기본값 설정 등)
    } finally {
      setLoading(false);
    }
  };

  //오늘의 AI 추천 식단 조회 api
  const fetchTodayAIRecommendation = async () => {
    const data = await getTodayFoodList();
    if(data.isSuccess) {
      console.log('AI 추천 식단:', data.result.sections);
      setTodayAIRecommendation(data.result.sections);
    }
  }
 //오늘의 AI 추천 식단 -> 새로고침
  const fetchTodayFoodListRefresh = async () => {
    try {
      setIsRefreshing(true);
      setTodayAIRecommendation([]);
      
      // 회전 애니메이션 시작
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
      
      const data = await postTodayFoodListRefresh();
      if(data.isSuccess) {
        console.log('오늘의 AI 추천 식단 새로고침:', data.result);
        await fetchTodayAIRecommendation();
      }
    } catch (error) {
      console.error('❌ 새로고침 실패:', error);
    } finally {
      setIsRefreshing(false);
      rotateAnim.setValue(0);
    }
  }
console.log('🔍 todayAIRecommendation:', todayAIRecommendation);

  //오늘의 AI 추천 식단 -> 상세 음식 영양 정보 조회 api
  const fetchFoodNutritionDetail = async (foodId: string) => {
    try {
      const data = await getFoodNutritionDetail(foodId);
      console.log('🔍 foodNutritionDetail:', data);
      if(data.isSuccess) {
        // const nutrientsArray = Object.values(data.result.nutrients || {});
        setFoodInfo(data.result);
        setNutritionInfo(data.result.nutrients);
        setIsOpenFoodDetailModal(true);
      } else {
        console.error('❌ API 호출 실패:', data);
      }
    } catch (error) {
      console.error('❌ fetchFoodNutritionDetail 에러:', error);
    }
  }

  const onClickFoodDetail = (foodId: string) => {
    console.log('🔍 foodId:', foodId);
    fetchFoodNutritionDetail(foodId);
  }
  
  // 식사 타입에 따른 한글 이름과 아이콘 반환
  const getMealInfo = (mealType: string) => {
    switch(mealType) {
      case 'BREAKFAST':
        return { name: '아침', icon: <Sun size={16} color="#e46592" strokeWidth={3} /> };
      case 'LUNCH':
        return {  name: '점심', icon: <CloudSun size={16} color="#e46592" strokeWidth={3} />};
      case 'DINNER':  
        return { name: '저녁', icon: <Moon size={16} color="#e46592" strokeWidth={3} /> };
      default:
        return { name: mealType, icon: null };
    }
  };

  useEffect(() => {
    fetchTodayNutrition();
    fetchTodayAIRecommendation();
    }, []);

  // Profile 화면에서 돌아올 때마다 사용자 정보 새로고침
  useFocusEffect(
    React.useCallback(() => {
      fetchUserInfo();
    }, [])
  );


  return (
    <>
    <ScrollView 
      className="flex-1 bg-white w-full"
      showsVerticalScrollIndicator={false}
    >
       <Header title="홈" />
      
<View className="w-full bg-light-pink-2">
      <TouchableOpacity className="w-full h-20 flex flex-row items-center gap-2 px-4 justify-between" onPress={() => navigation.navigate("Profile")}>
        <View className="flex-row items-center gap-2">
        <Image source={{ uri: userInfo?.profileImageUrl }} className="w-10 h-10 rounded-full" resizeMode="contain" />
        <View className="flex-col">
        <Text className="text-base font-regular">{userInfo?.nickname}님</Text>
        <Text className="text-sm text-gray-500">{userInfo?.pregnancyWeek}주차</Text>
        </View>
        </View>
        <ChevronRight size={16} strokeWidth={3} color="black" />
      </TouchableOpacity>
      </View>
     
      <View className="px-4 mt-4 w-full">
          <Text className="text-lg mb-[6px] font-medium text-black ml-1">이번 주차 팁!</Text>
           <View className="flex-row items-center justify-between w-full px-8 gap-3 mb-10">
            <TouchableOpacity 
              className="flex-col items-center"
              onPress={() => setBabyInfoModalVisible(true)}
            >
            <Image source={require("../../../assets/image/home/home-baby-info.png")} className="w-11 h-11" resizeMode="contain" />
            <Text className="text-[12px] font-light text-[#4b5563] mt-1">태아정보</Text>
            </TouchableOpacity>
            <View className="flex-col items-center">
              <TouchableOpacity 
              className="flex-col items-center"
              onPress={() => setMomInfoModalVisible(true)}
            >
            <Image source={require("../../../assets/image/home/home-health-info.png")} className="w-11 h-11" resizeMode="contain" />
            <Text className="text-[12px] font-light text-[#4b5563] mt-1">건강정보</Text>
            </TouchableOpacity>
            </View>
            <View className="flex-col items-center">
              <TouchableOpacity 
              className="flex-col items-center"
              onPress={() => setNutritionInfoModalVisible(true)}
            >
            <Image source={require("../../../assets/image/home/home-food-info.png")} className="w-11 h-11" resizeMode="contain" />
            <Text className="text-[12px] font-light text-[#4b5563] mt-1">영양정보</Text>
            </TouchableOpacity>
            </View>
          </View>
           <Container className="w-full px-4">
             <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center gap-2">
               <Text className="text-[16px] font-medium text-black ml-1">오늘의 영양 분석</Text>
               <Text className="text-[12px] font-light text-[#6b7280]">단위: %</Text>
               </View>
               <Text className="text-[12px] font-light text-[#6b7280]">{getFormattedToday()}</Text>
             </View>
             <View className="flex-row justify-around items-center">
               <PercentageBar 
                 percentage={nutritionData?.[0]?.unit || 0} 
                 size={70} 
                 color="#E46592" 
                 label={nutritionData?.[0]?.name || "엽산"}
               />
               <PercentageBar 
                 percentage={nutritionData?.[1]?.unit || 0} 
                 size={70} 
                 color="#89B9AD" 
                 label={nutritionData?.[1]?.name || "칼슘"}
               />
               <PercentageBar 
                 percentage={nutritionData?.[2]?.unit || 0} 
                 size={70}  
                 color="#4ECDC4" 
                 label={nutritionData?.[2]?.name || "철분"}
               />
             </View>
           </Container>
        </View>
           <View className="px-4 mt-5 w-full flex-row items-center justify-between">
            <Text className="text-lg font-medium text-black ml-1">오늘의 AI 추천 식단</Text>
            <TouchableOpacity 
              className="flex-row items-center" 
              onPress={fetchTodayFoodListRefresh}
              disabled={isRefreshing}
            >
              <Animated.View
                style={{
                  transform: [{
                    rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg']
                    })
                  }],
                  marginRight: 4
                }}
              >
                <RefreshCw size={12} strokeWidth={3} color="#e46592" />
              </Animated.View>
              <Text className="text-[#4b5563] text-[14px]">새로고침</Text>
            </TouchableOpacity>
            
           </View>

           <View className="px-4 mt-2 w-full">
           {isRefreshing || todayAIRecommendation.length === 0 ? (
             <View className="mb-6">
               <Container>
                 <View className="flex-row items-center justify-center py-8">
                   <Animated.View
                     style={{
                       transform: [{
                         rotate: rotateAnim.interpolate({
                           inputRange: [0, 1],
                           outputRange: ['0deg', '360deg']
                         })
                       }],
                       marginRight: 8
                     }}
                   >
                     <Loader2 size={16} strokeWidth={2.5} color="#e46592" />
                   </Animated.View>
                   <Text className="text-center text-[#4b5563]">추천 식단을 불러오는 중...</Text>
                 </View>
               </Container>
             </View>
           ) : (
             todayAIRecommendation.map((meal, index) => {
               const mealInfo = getMealInfo(meal.mealType);
               return (
               <View key={index} className="mb-6">
                 <Container>
                   <View className="flex-row items-center justify-between w-full mb-2">
                     <View className="flex-row items-center gap-2 mb-2">
                       {mealInfo.icon}
                       <Text className="text-black text-[16px] text-center">{mealInfo.name}</Text>
                     </View>
                     <View className="flex-row items-center justify-between w-min px-2 py-1.5 bg-[#f9c4d44d] rounded-lg">
                       <Text className="text-[#1f2937] text-[12px]">{meal.totalKcal}kcal</Text>
                     </View>
                   </View>
                   
                   {meal.items.map((food, foodIndex) => (
                     <TouchableOpacity key={foodIndex} className="flex-row items-center mb-2"  onPress={()=>{onClickFoodDetail(food.foodId.toString());}}>
                       <View 
                         className='w-11 h-11 rounded-[4px] flex items-center justify-center mr-2'
                         style={{ backgroundColor: "#89B9AD80" }}
                       >
                        <FoodCatogory category={food.foodCategory} />
                       </View>
                       <View className="flex-col gap-1 flex-1" >
                         <Text numberOfLines={1} ellipsizeMode="tail">{food.name}</Text>
                         <Text className="text-[#4b5563] text-[12px]" numberOfLines={1} ellipsizeMode="tail">{food.portionLabel}</Text>
                       </View>
                     </TouchableOpacity>
                   ))}
                 </Container>
               </View>
               );
             })
           )}
           </View>
    </ScrollView>

      {/* 태아 정보 모달 */}
      <BabyInfoModal
        visible={babyInfoModalVisible}
        onClose={() => setBabyInfoModalVisible(false)}
        weekNumber={userInfo?.pregnancyWeek || 20}
      />
      {/* 엄마 정보 모달 */}
      <MomInfoModal
        visible={momInfoModalVisible}
        onClose={() => setMomInfoModalVisible(false)}
        weekNumber={userInfo?.pregnancyWeek || 20}
      />
      {/* 영양 정보 모달 */}
      <NutritionInfoModal
        visible={nutritionInfoModalVisible}
        onClose={() => setNutritionInfoModalVisible(false)}
        weekNumber={userInfo?.pregnancyWeek || 20}
      />

      {/* 음식 상세 영양 정보 모달 */}
      <Modal
        visible={isOpenFoodDetailModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsOpenFoodDetailModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-[20px] max-h-[90%] min-h-[65%]">
            <View className="flex-row justify-between items-center px-5 py-5 border-b border-gray-200">
              <Text className="text-[18px] font-medium">영양 정보</Text>
              <TouchableOpacity onPress={() => setIsOpenFoodDetailModal(false)}>
                <Text className="text-[16px] text-gray-500">✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
              {nutritionInfo && (
                <NutritionDetail
                  foodName={foodInfo?.name}
                  portion="100g 기준"
                  imageUri={undefined}
                  calories={foodInfo?.calories}
                  protein={nutritionInfo?.proteins?.value}
                  fat={nutritionInfo?.fats?.value}
                  carbs={nutritionInfo?.carbs?.value}
                  detailedNutrients={Object.entries(nutritionInfo)
                    .filter(([key]) => !['proteins', 'fats', 'carbs'].includes(key))
                    .map(([key, value]: [string, any]) => ({
                      kname: value?.kname || key,
                      value: value?.value || 0,
                      unit: value?.unit || '',
                    }))
                  }
                  showButtons={true}
                  onAddToMeal={()=>{setIsOpenFoodTimeModal(true)}}
                  onBorder={false}
                />
              )}
              {/* <View className="py-10">
                <Button text="식단에 추가" onPress={() => {setIsOpenFoodTimeModal(true)}} className="w-full h-10" />
              </View> */}

              
            </ScrollView>
           
          </View>
         
        </View>

        <FoodTimeModal
        visible={isOpenFoodTimeModal}
        foodId={foodInfo?.foodId}
        photoAnalysisId={foodInfo?.photoAnalysisId}
        onClose={() => setIsOpenFoodTimeModal(false)}
        onSuccess={() => {}}
        />
      </Modal>
    </>
  );
}
