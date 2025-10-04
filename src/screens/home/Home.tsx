import { CloudSun, Moon, RefreshCcw, RefreshCw, Sun, User2 } from "lucide-react-native";
import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Container from "../../components/common/Container";
import PercentageBar from "../../components/common/PercentageBar";

export default function Home() {
  return (
    <SafeAreaView style={styles.safeArea} edges={Platform.OS === 'web' ? [] : ['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.header}>
        <User2 size={30} color="#000" />
        <View style={styles.headerText}>
          <Text style={styles.userName}>김지연님</Text>
          <Text style={styles.weekInfo}>임신 24주차</Text>
        </View>
      </View>
      <View style={styles.section}>
          <Text style={styles.sectionTitle}>이번 주차 팁!</Text>
           <View style={styles.tipsContainer}>
            <View style={styles.tipItem}>
              <Image source={require("../../../assets/image/home/home-baby-info.png")} style={styles.tipImage} resizeMode="contain" />
              <Text style={styles.tipText}>태아정보</Text>
            </View>
            <View style={styles.tipItem}>
              <Image source={require("../../../assets/image/home/home-health-info.png")} style={styles.tipImage} resizeMode="contain" />
              <Text style={styles.tipText}>건강정보</Text>
            </View>
            <View style={styles.tipItem}>
              <Image source={require("../../../assets/image/home/home-food-info.png")} style={styles.tipImage} resizeMode="contain" />
              <Text style={styles.tipText}>영양정보</Text>
            </View>
          </View>
           <Container className="w-full px-4">
             <View className="flex-row justify-between items-center mb-4">
               <Text className="text-base font-regular text-[16px] text-black">오늘의 영양 분석</Text>
               <Text className="text-[12px] font-light text-[#6b7280]">2025.09.20</Text>
             </View>
             <View className="flex-row justify-around items-center">
               <PercentageBar 
                 percentage={75} 
                 size={70} 
                 color="#E46592" 
                 label="칼로리"
               />
               <PercentageBar 
                 percentage={60} 
                 size={70} 
                 color="#89B9AD" 
                 label="단백질"
               />
               <PercentageBar 
                 percentage={85} 
                 size={70}  
                 color="#4ECDC4" 
                 label="탄수화물"
               />
             </View>
           </Container>
        </View>
           <View className="px-4 mt-4 w-full flex-row items-center justify-between">
            <Text className="text-lg mb-[6px]">오늘의 AI 추천 식단</Text>
            <View className="flex-row items-center"><RefreshCw size={12} strokeWidth={3}  color="#e46592" className="mr-1" />
             <Text className="text-[#4b5563] text-[14px]">새로고침</Text></View>
            
           </View>

           <View className="px-4 mt-4 w-full">

           <Container className="mb-4">
            <View className="flex-row items-center justify-between w-full">
            <View className="flex-row items-center mb-2">
            <Sun size={14} strokeWidth={4}  color="#e46592" className="mr-1" />
            <Text className="text-[#11827] text-[16px]">아침</Text>
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

           <Container className="mb-4">
            <View className="flex-row items-center justify-between w-full">
            <View className="flex-row items-center mb-2">
            <CloudSun size={14} strokeWidth={3.5}  color="#e46592" className="mr-1" />
            <Text className="text-[#11827] text-[16px]">점심</Text>
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

           <Container className="mb-4">
            <View className="flex-row items-center justify-between w-full">
            <View className="flex-row items-center mb-2">
            <Moon size={14} strokeWidth={3.5}  color="#e46592" className="mr-1" />
            <Text className="text-[#11827] text-[16px]">저녁</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    width: '100%',
    height: 80,
    backgroundColor: '#FFE2E2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  headerText: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
  },
  weekInfo: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 6,
    color: '#000',
  },
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  tipItem: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  tipImage: {
    width: 44,
    height: 44,
  },
  tipText: {
    fontSize: 12,
    fontWeight: '300',
    color: '#4b5563',
    marginTop: 4,
  }
});
