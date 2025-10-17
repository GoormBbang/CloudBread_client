import { CameraIcon, ImageIcon, ChevronDown, ChevronUp, Bot, Square, CircleQuestionMark } from 'lucide-react-native';
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import Button from '../../components/common/Button';
import Border from '../../components/common/Border';
import FoodTimeModal from '../../components/common/modal/FoodTimeModal';

const NUTRITION_INFO = [
  {
    name: '나트륨',
    value: '890mg',
  },
  {
    name: '단백질',
    value: '18g',
  },
  {
    name: '지방',
    value: '12g',
  },
  {
    name: '탄수화물',
    value: '25g',
  },
  {
    name: '칼로리',
    value: '320kcal',
  },
  {
    name: '나트륨',
    value: '890mg',
  },
  {
    name: '칼슘',
    value: '100mg',
  },
  {
    name: '철분',
    value: '10mg',
  },
  {
    name: '칼슘',
    value: '100mg',
  },
  {
    name: '철분',
    value: '10mg',
  },
]

const FOOD_LIST=[
  {name:'김치찌개', value:'김치찌개'},
  {name:'비빔밥', value:'비빔밥'},
  {name:'된장찌개', value:'된장찌개'},
]

export default function Camera() {
  const [showAllNutrition, setShowAllNutrition] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [showFoodTimeModal, setShowFoodTimeModal] = useState(false);
  
  const displayedNutrition = showAllNutrition 
    ? NUTRITION_INFO 
    : NUTRITION_INFO.slice(0, 4);

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
        console.log('이미지 선택됨:', result.assets[0].uri);
        setSelectedImage(result.assets[0].uri);
        setStep(1);
      }
    } catch (error) {
      console.log('갤러리 실행 오류:', error);
    }
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
     {FOOD_LIST.map((item,index)=>(
 <View key={index} className='w-full h-fit flex-col'>
  <View className='w-full h-fit flex-row justify-between items-center'>
  <Text className='text-[14px] font-medium py-4'>{item.name}</Text>
  <Square size={20} strokeWidth={2} color={'#e46592'} fill={selectedFood === item.value ? '#e46592' : 'transparent'} onPress={() => setSelectedFood(item.value)} />
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
      <Button text="다음" onPress={() => setStep(2)} className='h-11 bg-main-pink rounded-[8px] mb-2' />
      </View>
     )}

{step === 2 && (
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
          <Text className='text-[20px] font-medium mr-2'>김치찌개</Text>
          {/* 모든 음식의 양을 100g 기준으로 표시 */}
          <Text className='text-[14px] font-light text-[#4b5563]'>100g 기준</Text>
          </View>
          <View className='w-full flex-row justify-between mt-4'>
            <View className='flex-1 flex-col justify-center items-center'>
              <Text className='text-[24px] font-medium text-[#e46592]'>320</Text>
              <Text className='text-[12px] font-light text-[#4b5563]'>칼로리</Text>
            </View>
            <View className='flex-1 flex-col justify-center items-center'>
              <Text className='text-[24px] font-medium text-[#e46592]'>18g</Text>
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

             {displayedNutrition.map((item, index)=>(
                <View key={index} className='w-full mt-3'>
                 <View className='flex-row justify-between mb-2 w-full'>
                   <Text className='text-[14px]'>{item.name}</Text>
                   <Text className='text-[14px] font-medium'>{item.value}</Text>
                 </View>
                 <Border/>
                </View>
             ))}
             
             {NUTRITION_INFO.length > 4 && (
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
<FoodTimeModal visible={showFoodTimeModal} onClose={() => setShowFoodTimeModal(false)} />
    </ScrollView>
  ); 
}
