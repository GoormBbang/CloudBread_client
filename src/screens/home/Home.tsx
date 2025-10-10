import { ChevronRight, CloudSun, Moon, RefreshCw, Sun, User2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import Container from "../../components/common/Container";
import PercentageBar from "../../components/common/PercentageBar";
import { getTodayNutrition } from "../../api/services/home";
import { NutritionStats } from "../../api/types/common";

interface HomeProps {
  navigation: any;
}

export default function Home({ navigation }: HomeProps) {
  const [nutritionData, setNutritionData] = useState<NutritionStats | null>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchTodayNutrition = async () => {
  //     try {
  //       setLoading(true);
  //       const data = await getTodayNutrition();
  //       setNutritionData(data);
  //       console.log('✅ 영양 데이터:', data);
  //     } catch (error) {
  //       console.error('❌ API 호출 실패:', error);
  //       // 에러 처리 로직 추가 가능 (예: 토스트 메시지, 기본값 설정 등)
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchTodayNutrition();
  // }, []);

  return (
    <ScrollView 
      className="flex-1 bg-white mt-10"
      showsVerticalScrollIndicator={false}
    >
      
      <TouchableOpacity className="w-full h-20 bg-light-pink-2 flex flex-row items-center gap-2 px-4 justify-between" onPress={() => navigation.navigate("Profile")}>
        <View className="flex-row items-center gap-2">
        <User2 size={30} />
        <View className="flex-col">
        <Text className="text-base font-regular">김지연님</Text>
        <Text className="text-sm text-gray-500">임신 24주차</Text>
        </View>
        </View>
        <ChevronRight size={16} strokeWidth={3} color="black" />
      </TouchableOpacity>
     
      <View className="px-4 mt-4 w-full">
          <Text className="text-lg mb-[6px]">이번 주차 팁!</Text>
           <View className="flex-row items-center justify-between w-full px-8 gap-3 mb-10">
            <View className="flex-col items-center">
            <Image source={require("../../../assets/image/home/home-baby-info.png")} className="w-11 h-11" resizeMode="contain" />
            <Text className="text-[12px] font-light text-[#4b5563] mt-1">태아정보</Text>
            </View>
            <View className="flex-col items-center">
            <Image source={require("../../../assets/image/home/home-health-info.png")} className="w-11 h-11" resizeMode="contain" />
            <Text className="text-[12px] font-light text-[#4b5563] mt-1">건강정보</Text>
            </View>
            <View className="flex-col items-center">
            <Image source={require("../../../assets/image/home/home-food-info.png")} className="w-11 h-11" resizeMode="contain" />
            <Text className="text-[12px] font-light text-[#4b5563] mt-1">영양정보</Text>
            </View>
          </View>
           <Container className="w-full px-4">
             <View className="flex-row justify-between items-center mb-4">
               <Text className="text-base font-regular text-[16px] text-black">오늘의 영양 분석</Text>
               <Text className="text-[12px] font-light text-[#6b7280]">2025.09.20</Text>
             </View>
             <View className="flex-row justify-around items-center">
               <PercentageBar 
                 percentage={nutritionData?.calories.percentage || 0} 
                 size={70} 
                 color="#E46592" 
                 label="칼로리"
               />
               <PercentageBar 
                 percentage={nutritionData?.protein.percentage || 0} 
                 size={70} 
                 color="#89B9AD" 
                 label="단백질"
               />
               <PercentageBar 
                 percentage={nutritionData?.carbohydrates.percentage || 0} 
                 size={70}  
                 color="#4ECDC4" 
                 label="탄수화물"
               />
             </View>
           </Container>
        </View>
           <View className="px-4 mt-4 w-full flex-row items-center justify-between">
            <Text className="text-lg mb-[6px]">오늘의 AI 추천 식단</Text>
            <TouchableOpacity className="flex-row items-center" onPress={() => {
              const fetchTodayNutrition = async () => {
                try {
                  setLoading(true);
                  const data = await getTodayNutrition();
                  setNutritionData(data);
                } catch (error) {
                  console.error('❌ API 호출 실패:', error);
                } finally {
                  setLoading(false);
                }
              };
              fetchTodayNutrition();
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
    </ScrollView>
  );
}
