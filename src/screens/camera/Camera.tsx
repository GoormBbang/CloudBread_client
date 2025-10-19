import { CameraIcon, ImageIcon, ChevronDown, ChevronUp, Bot, Square, CircleQuestionMark } from 'lucide-react-native';
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import Button from '../../components/common/Button';
import Border from '../../components/common/Border';
import FoodTimeModal from '../../components/common/modal/FoodTimeModal';
import { postImageUpload, postSelectedFood } from '../../api/services/camera';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../../navigation/TabNavigation';

type CameraNavigationProp = BottomTabNavigationProp<TabParamList, '촬영'>;

export default function Camera() {
  const navigation = useNavigation<CameraNavigationProp>();
  const [showAllNutrition, setShowAllNutrition] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [showFoodTimeModal, setShowFoodTimeModal] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [photoAnalysisId, setPhotoAnalysisId] = useState<string | null>(null);
  const [nutritionInfo, setNutritionInfo] = useState<any[]>([]);
  const [foodInfo, setFoodInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  

//이미지 업로드 및 SSE 구독
const ImageUploadApi = async (imageUri: string) => {
  
    const response = await postImageUpload(imageUri , {
      onStatus: (status) => console.log('SSE status:', status),
      onCandidates: (candidates) => setCandidates(candidates),
      onError: (error) => console.error('SSE error:', error),
      onOpen: () => console.log('SSE opened'),
    });

    setPhotoAnalysisId(response);
    
}

//음식 선택 후 step2로 이동
const handleSelectFood = async() => {
  if(!photoAnalysisId || !selectedFood) return;
  
  setIsLoading(true); // 로딩 시작
  
  try {
    const res = await postSelectedFood(photoAnalysisId, selectedFood);
    
    if(res.isSuccess) {
      const selectedData = res.result.selected;
      const nutrientsObj = selectedData.nutrients || {};
      
      console.log('🔍 nutrients 객체:', nutrientsObj);
      
      // 객체를 배열로 변환
      const nutrientsArray = Object.values(nutrientsObj);
      console.log('🔍 nutrients 배열:', nutrientsArray);
      console.log('🔍 nutrients 길이:', nutrientsArray.length);
      
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
    console.error('음식 선택 오류:', error);
    setIsLoading(false);
  }
}

  const openCamera = async () => {
    try {
      // 카메라 권한 확인
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.status !== 'granted') {
        Alert.alert('권한 필요', '카메라 사용을 위해 권한이 필요합니다.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('이미지 선택됨:', result.assets[0].uri);
        setSelectedImage(result.assets[0].uri);
        setStep(1);
        // Alert.alert('성공', '사진이 선택되었습니다!');
      } else {
      
      }
    } catch (error) {
      console.error('카메라 실행 오류:', error);
      // Alert.alert('오류', `카메라 오류: ${error.message || error}`);
    }
  };

  const openGallery = async () => {
    try {
      // 갤러리 권한 요청
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '갤러리 접근을 위해 권한이 필요합니다.');
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
        setStep(1);
      }
    } catch (error) {
      console.log('갤러리 실행 오류:', error);
    }
  };

  // 섭취 기록 저장 후 홈으로 이동
  const handleNavigateToHome = () => {
    navigation.navigate('홈');
  };

  return (
    <ScrollView 
      style={{ flex: 1 }} 
      contentContainerStyle={{ flexGrow: 1 }} 
      className='mx-4'
      showsVerticalScrollIndicator={false}
    >
     <View className="w-full bg-[#FFe2e2b3] rounded-[8px] items-center justify-center border-[#e46592] pb-8 border-[1px] mt-10">
     <CameraIcon className="text-[#ffe2e2b3] mt-9" fill="#e46592" size={30} strokeWidth={2}/>
     <Text className="text-[18px] mt-4">음식 사진 촬영</Text>
     <Text className="text-[#4b5563] mt-2 mb-6">카메라로 촬영하거나 갤러리에서 선택하세요</Text>
     <View className='px-8 w-full'>
     
       <Button 
         text="카메라 촬영" 
         onPress={openCamera} 
         className='rounded-[8px] h-12 mb-3' 
         icon={<CameraIcon fill="#ffffff" className='text-[#e46592]' size={22} strokeWidth={2}/>}
       />
       <Button 
         text="갤러리에서 선택" 
         onPress={openGallery}
         variant="CUSTOM"
         className='rounded-[8px] h-12 bg-[#ffe2e2b3]'
         textColor="#e46592"
         style={{
           borderWidth: 1,
           borderColor: '#e46592',
         }}
         icon={<ImageIcon fill="#ffe2e2b3" className='text-[#e46592]' size={20} strokeWidth={2}/>}
       />
     </View>
     </View>

     {step===1&&(
      <View className='w-full h-fit mt-4 border-[1px] border-gray-300 rounded-[8px] p-4 bg-white'>
         <View className='w-full py-4 items-center justify-center'>
        {selectedImage ? (
          <Image 
            source={{ uri: selectedImage }} 
            style={{ width: 400, height:300, borderRadius: 8 }}
            resizeMode="contain"
          />
        ) : (
          <View className='w-48 h-32 bg-gray-100 rounded-[8px] items-center justify-center'>
            <Text className='text-gray-400'>사진을 촬영해주세요</Text>
          </View>
        )}
      </View>

      <View className='w-full h-fit pt-4 px-1'>
        <Text className='text-[16px] font-bold mb-3'>먹은 음식을 선택해주세요!</Text>
     {candidates.map((item,index)=>(
 <View key={index} className='w-full h-fit flex-col'>
  <View className='w-full h-fit flex-row justify-between items-center'>
  <Text className='text-[14px] font-medium py-4'>{item.name}</Text>
  <Square size={20} strokeWidth={2} color={'#e46592'} fill={selectedFood === item.foodId ? '#e46592' : 'transparent'} onPress={() => setSelectedFood(item.foodId)} />
 </View>
 <Border borderWidth='thin' borderColor='lightPink' />
 </View>

     ))}
     
     <View className='w-full h-fit flex-row items-center my-4'>
     <CircleQuestionMark size={16} strokeWidth={2} />
     <Text className='text-[10px] font-medium ml-2'>원하는 음식이 없나요? 챗봇에서 직접 알려주세요.</Text>
     </View>
      </View>

<Button text="챗봇에서 직접입력" onPress={()=>{}} className='h-11 bg-white rounded-[8px] border-[1px] border-[#e46592] mb-2' textColor='#4b5563' icon={<Image source={require('../../../assets/image/bot.png')} style={{ width: 16, height: 16 }} resizeMode="contain" />}/>
      <Button 
        text={isLoading ? "로딩중..." : "다음"} 
        onPress={handleSelectFood} 
        className='h-11 bg-main-pink rounded-[8px] mb-2' 
        disabled={isLoading}
      />
      </View>
     )}

{/* 로딩 화면 */}
{isLoading && (
  <View className='w-full h-fit mt-4 border-[1px] border-gray-300 rounded-[8px] p-8 bg-white items-center justify-center'>
    <View className='w-full py-12 items-center justify-center'>
      <ActivityIndicator size="large" color="#e46592" />
      <Text className='text-[16px] font-medium text-[#e46592] mt-6'>영양 정보를 불러오는 중...</Text>
      <Text className='text-[12px] text-[#4b5563] mt-2'>잠시만 기다려주세요</Text>
    </View>
  </View>
)}

{step === 2 && !isLoading && (
     <View className='w-full h-fit mt-4 border-[1px] border-gray-300 rounded-[8px] p-4'>
      <View className='w-full py-4 items-center justify-center'>
        {selectedImage ? (
          <Image 
            source={{ uri: selectedImage }} 
            style={{ width: 400, height:300, borderRadius: 8 }}
            resizeMode="contain"
          />
        ) : (
          <View className='w-48 h-32 bg-gray-100 rounded-[8px] items-center justify-center'>
            <Text className='text-gray-400'>사진을 촬영해주세요</Text>
          </View>
        )}
      </View>

      <View className='w-full h-fit border-t-[1px] border-gray-300 pt-4 px-1'>
        <View className='w-full h-fit flex-row items-end'>
          <Text className='text-[20px] font-medium mr-2'>{foodInfo?.name}</Text>
          {/* 모든 음식의 양을 100g 기준으로 표시 */}
          <Text className='text-[14px] font-light text-[#4b5563]'>100g 기준</Text>
          </View>
          <View className='w-full flex-row justify-between mt-4'>
            <View className='flex-1 flex-col justify-center items-center'>
              <Text className='text-[24px] font-medium text-[#e46592]'>{foodInfo?.calories}</Text>
              <Text className='text-[12px] font-light text-[#4b5563]'>칼로리</Text>
            </View>
           
              <View className='flex-1 flex-col justify-center items-center'>
                <Text className='text-[24px] font-medium text-[#e46592]'>320g</Text>
                <Text className='text-[12px] font-light text-[#4b5563]'>단백질</Text>
              </View>
            <View className='flex-1 flex-col justify-center items-center'>
              <Text className='text-[24px] font-medium text-[#e46592]'>12g</Text>
              <Text className='text-[12px] font-light text-[#4b5563]'>지방</Text>
            </View>
            <View className='flex-1 flex-col justify-center items-center'>
              <Text className='text-[24px] font-medium text-[#e46592]'>25g</Text>
              <Text className='text-[12px] font-light text-[#4b5563]'>탄수화물</Text>
            </View>
          </View>
          
           <View className='w-full mt-4'>
             <Text className='text-[14px] text-[#4b5563] mb-3'>상세 영양 정보</Text>

             {nutritionInfo && nutritionInfo.length > 0 ? (
               nutritionInfo.slice(0, showAllNutrition ? nutritionInfo.length : 4).map((item, index)=>(
                <View key={index} className='w-full mt-3'>
                 <View className='flex-row justify-between mb-2 w-full'>
                   <Text className='text-[14px]'>{item.kname}</Text>
                   <Text className='text-[14px] font-medium'>{item.value}{item.unit}</Text>
                 </View>
                 <Border/>
                </View>
               ))
             ) : (
               <Text className='text-[12px] text-gray-400 mt-2'>영양 정보가 없습니다.</Text>
             )}
             
             {nutritionInfo && nutritionInfo.length > 4 && (
               <View className='w-full mt-4'>
                 <Button
                   text={showAllNutrition ? "접기" : "더보기"}
                   onPress={() => setShowAllNutrition(!showAllNutrition)}
                   variant="CUSTOM"
                   className='h-10 bg-gray-100 rounded-[6px]'
                   textColor="#4b5563"
                   icon={showAllNutrition ? 
                     <ChevronUp size={16} color="#4b5563" /> : 
                     <ChevronDown size={16} color="#4b5563" />
                   }
                 />
               </View>
             )}
           


            </View>
            <View>
  <Button text="식단에 추가하기" onPress={() => {setShowFoodTimeModal(true)}} className='h-11 bg-main-pink rounded-[8px] mb-2' />
     <Button text="AI에게 물어보기" onPress={() => {}} className='h-11 bg-white rounded-[8px] border-[0.5px] border-main-pink mb-2' textColor='#e46592' icon={<Image source={require('../../../assets/image/bot.png')} style={{ width: 16, height: 16 }} resizeMode="contain" />} />
      <Button text="다시 촬영하기" onPress={() => {}} className='h-11 bg-white rounded-[8px] border-[1px] border-gray-300' textColor='#4b5563'  />
</View>

      </View>
       
      </View>
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
  ); 
}
