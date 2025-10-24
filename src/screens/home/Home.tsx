import { ChevronRight, CloudSun, Moon, RefreshCw, Sun, User2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Modal } from "react-native";
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
    const data = await postTodayFoodListRefresh();
    if(data.isSuccess) {
      console.log('오늘의 AI 추천 식단 새로고침:', data.result);
      fetchTodayAIRecommendation();
    }
  }

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
  
  // 식사 타입에 따른 한글 이름 반환
  const getMealName = (mealType: string) => {
    switch(mealType) {
      case 'BREAKFAST':
        return '아침';
      case 'LUNCH':
        return '점심';
      case 'DINNER':
        return '저녁';
      default:
        return mealType;
    }
  };

  // 음식 카테고리에 따른 배경색 반환
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '밥': '#89b9ad',
      '국': '#e46592',
      '반찬': '#4ECDC4',
      '김치': '#FF6B6B',
      '과일': '#FFD93D',
      '기타': '#95a5a6'
    };
    return colors[category] || '#89b9ad';
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
        <Text className="text-sm text-gray-500">{userInfo?.dueDate}주차</Text>
        </View>
        </View>
        <ChevronRight size={16} strokeWidth={3} color="black" />
      </TouchableOpacity>
      </View>
     
      <View className="px-4 mt-4 w-full">
          <Text className="text-lg mb-[6px]">이번 주차 팁!</Text>
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
               <Text className="text-base font-regular text-[16px] text-black">오늘의 영양 분석</Text>
               <Text className="text-[12px] font-light text-[#6b7280]">단위: %</Text>
               </View>
               <Text className="text-[12px] font-light text-[#6b7280]">2025.09.20</Text>
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
           <View className="px-4 mt-4 w-full flex-row items-center justify-between">
            <Text className="text-lg mb-[6px]">오늘의 AI 추천 식단</Text>
            <TouchableOpacity className="flex-row items-center" onPress={()=>
              fetchTodayFoodListRefresh()
            }>
              <RefreshCw size={12} strokeWidth={3} color="#e46592" style={{ marginRight: 4 }} />
              <Text className="text-[#4b5563] text-[14px]">새로고침</Text>
            </TouchableOpacity>
            
           </View>

           <View className="px-4 mt-4 w-full">
           {todayAIRecommendation.length > 0 ? (
             todayAIRecommendation.map((meal, index) => (
               <View key={index} className="mb-6">
                 <Container>
                   <View className="flex-row items-center justify-between w-full">
                     <View className="flex-row items-center justify-center mb-2">
                       <Text className="text-[#118270] text-[16px] text-center">{getMealName(meal.mealType)}</Text>
                     </View>
                     <View className="flex-row items-center justify-between w-min px-2 py-1.5 bg-[#f9c4d44d] rounded-lg">
                       <Text className="text-[#1f2937] text-[12px]">{meal.totalKcal}kcal</Text>
                     </View>
                   </View>
                   
                   {meal.items.map((food, foodIndex) => (
                     <TouchableOpacity key={foodIndex} className="flex-row items-center mb-2"  onPress={()=>{onClickFoodDetail(food.foodId.toString());}}>
                       <View 
                         className='w-12 h-12 rounded-[4px] flex items-center justify-center mr-2'
                         style={{ backgroundColor: getCategoryColor(food.foodCategory) }}
                       >
                         <Text className="text-white text-[12px] text-center">{food.foodCategory}</Text>
                       </View>
                       <View className="flex-col gap-1 flex-1" >
                         <Text numberOfLines={1} ellipsizeMode="tail">{food.name}</Text>
                         <Text className="text-[#4b5563] text-[12px]" numberOfLines={1} ellipsizeMode="tail">{food.portionLabel}</Text>
                       </View>
                     </TouchableOpacity>
                   ))}
                 </Container>
               </View>
             ))
           ) : (
             <View className="mb-6">
               <Container>
                 <Text className="text-center text-[#4b5563] py-8">추천 식단을 불러오는 중입니다...</Text>
               </Container>
             </View>
           )}
           </View>
    </ScrollView>

      {/* 태아 정보 모달 */}
      <BabyInfoModal
        visible={babyInfoModalVisible}
        onClose={() => setBabyInfoModalVisible(false)}
        weekNumber={userInfo?.dueDate || 20}
      />
      {/* 엄마 정보 모달 */}
      <MomInfoModal
        visible={momInfoModalVisible}
        onClose={() => setMomInfoModalVisible(false)}
        weekNumber={userInfo?.dueDate || 20}
      />
      {/* 영양 정보 모달 */}
      <NutritionInfoModal
        visible={nutritionInfoModalVisible}
        onClose={() => setNutritionInfoModalVisible(false)}
        weekNumber={userInfo?.dueDate || 20}
      />

      {/* 음식 상세 영양 정보 모달 */}
      <Modal
        visible={isOpenFoodDetailModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsOpenFoodDetailModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-[20px] max-h-[90%] min-h-[60%]">
            <View className="flex-row justify-between items-center px-4 py-4 border-b border-gray-200">
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
                />
              )}
              <View className="py-10">
                <Button text="식단에 추가" onPress={() => {}} className="w-full h-10" />
              </View>
            </ScrollView>
           
          </View>
         
        </View>
      </Modal>
    </>
  );
}
