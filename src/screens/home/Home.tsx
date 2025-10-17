import { ChevronRight, CloudSun, Moon, RefreshCw, Sun, User2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import Container from "../../components/common/Container";
import PercentageBar from "../../components/common/PercentageBar";
import BabyInfoModal from "../../components/common/modal/BabyInfoModal";
import { getThisWeekBabyTips, getThisWeekTips, getTodayAIRecommendation, getTodayNutrition, getUserInfo } from "../../api/services/home";
import { NutrientInfo } from "../../api/types/common";
import { ThisWeekTipsType, UserInfoType } from "../../api/types/home";
import MomInfoModal from "../../components/common/modal/MomInfoModal";
import NutritionInfoModal from "../../components/common/modal/NutritionModal";


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
    const data = await getTodayAIRecommendation();
    if(data.isSuccess) {
      // setTodayAIRecommendation(data.result);
    }
  }

  useEffect(() => {
    // fetchThisWeekTips();
    // fetchThisWeekBabyTips();
    fetchUserInfo();
    fetchTodayNutrition();
    // fetchTodayAIRecommendation();
  }, []);


  return (
    <ScrollView 
      className="flex-1 bg-white w-full"
      showsVerticalScrollIndicator={false}
    >
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
            <TouchableOpacity className="flex-row items-center" onPress={() => {
              // 백엔드 서버가 실행되지 않아 임시로 비활성화
              console.log('새로고침 버튼 클릭 - API 호출 비활성화됨');
              // const fetchTodayNutrition = async () => {
              //   try {
              //     setLoading(true);
              //     const data = await getTodayNutrition();
              //     setNutritionData(data);
              //   } catch (error) {
              //     console.error('❌ API 호출 실패:', error);
              //   } finally {
              //     setLoading(false);
              //   }
              // };
              // fetchTodayNutrition();
            }}>
              <RefreshCw size={12} strokeWidth={3} color="#e46592" style={{ marginRight: 4 }} />
              <Text className="text-[#4b5563] text-[14px]">새로고침</Text>
            </TouchableOpacity>
            
           </View>

           <View className="px-4 mt-4 w-full">

           <View className="mb-6">
           <Container>
            <View className="flex-row items-center justify-between w-full">
            <View className="flex-row items-center mb-2">
            <Sun size={14} strokeWidth={4} color="#e46592" style={{ marginRight: 4 }} />
            <Text className="text-[#118270] text-[16px]">아침</Text>
            </View>
            <View className="flex-row items-center justify-between w-min px-2 py-1.5 bg-[#f9c4d44d] rounded-lg">
              <Text className="text-[#1f2937] text-[12px]">520kcal</Text>
            </View>
            </View>
            <View className="flex-row items-center mb-2">
              <View className='w-12 h-12 bg-[#89b9ad] rounded-[4px] flex items-center justify-center mr-2'><Text className="text-white text-[12px]">밥</Text></View>
            <View className="flex-col gap-1">
              <Text>현미밥</Text>
              <Text className="text-[#4b5563] text-[12px]">1공기(210g)</Text>
            </View>
            </View>
            <View className="flex-row items-center mb-2">
              <View className='w-12 h-12 bg-[#89b9ad] rounded-[4px] flex items-center justify-center mr-2'><Text className="text-white text-[12px]">밥</Text></View>
            <View className="flex-col gap-1">
              <Text>현미밥</Text>
              <Text className="text-[#4b5563] text-[12px]">1공기(210g)</Text>
            </View>
            </View>
            <View className="flex-row items-center mb-2">
              <View className='w-12 h-12 bg-[#89b9ad] rounded-[4px] flex items-center justify-center mr-2'><Text className="text-white text-[12px]">밥</Text></View>
            <View className="flex-col gap-1">
              <Text>현미밥</Text>
              <Text className="text-[#4b5563] text-[12px]">1공기(210g)</Text>
            </View>
            </View>
           </Container>
           </View>

           <View className="mb-6">
           <Container>
            <View className="flex-row items-center justify-between w-full">
            <View className="flex-row items-center mb-2">
            <CloudSun size={14} strokeWidth={3.5} color="#e46592" style={{ marginRight: 4 }} />
            <Text className="text-[#118270] text-[16px]">점심</Text>
            </View>
            <View className="flex-row items-center justify-between w-min px-2 py-1.5 bg-[#f9c4d44d] rounded-lg">
              <Text className="text-[#1f2937] text-[12px]">520kcal</Text>
            </View>
            </View>
            <View className="flex-row items-center mb-2">
              <View className='w-12 h-12 bg-[#89b9ad] rounded-[4px] flex items-center justify-center mr-2'><Text className="text-white text-[12px]">밥</Text></View>
            <View className="flex-col gap-1">
              <Text>현미밥</Text>
              <Text className="text-[#4b5563] text-[12px]">1공기(210g)</Text>
            </View>
            </View>
            <View className="flex-row items-center mb-2">
              <View className='w-12 h-12 bg-[#89b9ad] rounded-[4px] flex items-center justify-center mr-2'><Text className="text-white text-[12px]">밥</Text></View>
            <View className="flex-col gap-1">
              <Text>현미밥</Text>
              <Text className="text-[#4b5563] text-[12px]">1공기(210g)</Text>
            </View>
            </View>
            <View className="flex-row items-center mb-2">
              <View className='w-12 h-12 bg-[#89b9ad] rounded-[4px] flex items-center justify-center mr-2'><Text className="text-white text-[12px]">밥</Text></View>
            <View className="flex-col gap-1">
              <Text>현미밥</Text>
              <Text className="text-[#4b5563] text-[12px]">1공기(210g)</Text>
            </View>
            </View>
           </Container>
           </View>

           <View className="mb-6">
           <Container>
            <View className="flex-row items-center justify-between w-full">
            <View className="flex-row items-center mb-2">
            <Moon size={14} strokeWidth={3.5} color="#e46592" style={{ marginRight: 4 }} />
            <Text className="text-[#118270] text-[16px]">저녁</Text>
            </View>
            <View className="flex-row items-center justify-between w-min px-2 py-1.5 bg-[#f9c4d44d] rounded-lg">
              <Text className="text-[#1f2937] text-[12px]">520kcal</Text>
            </View>
            </View>
            <View className="flex-row items-center mb-2">
              <View className='w-12 h-12 bg-[#89b9ad] rounded-[4px] flex items-center justify-center mr-2'><Text className="text-white text-[12px]">밥</Text></View>
            <View className="flex-col gap-1">
              <Text>현미밥</Text>
              <Text className="text-[#4b5563] text-[12px]">1공기(210g)</Text>
            </View>
            </View>
            <View className="flex-row items-center mb-2">
              <View className='w-12 h-12 bg-[#89b9ad] rounded-[4px] flex items-center justify-center mr-2'><Text className="text-white text-[12px]">밥</Text></View>
            <View className="flex-col gap-1">
              <Text>현미밥</Text>
              <Text className="text-[#4b5563] text-[12px]">1공기(210g)</Text>
            </View>
            </View>
            <View className="flex-row items-center mb-2">
              <View className='w-12 h-12 bg-[#89b9ad] rounded-[4px] flex items-center justify-center mr-2'><Text className="text-white text-[12px]">밥</Text></View>
            <View className="flex-col gap-1">
              <Text>현미밥</Text>
              <Text className="text-[#4b5563] text-[12px]">1공기(210g)</Text>
            </View>
            </View>
           </Container>
           </View>
           </View>

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
    </ScrollView>
  );
}
