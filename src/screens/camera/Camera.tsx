import { CameraIcon, ImageIcon, ChevronDown, ChevronUp, Bot } from 'lucide-react-native';
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import Button from '../../components/common/Button';
import Border from '../../components/common/Border';

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

export default function Camera() {
  const [showAllNutrition, setShowAllNutrition] = useState(false);
  
  const displayedNutrition = showAllNutrition 
    ? NUTRITION_INFO 
    : NUTRITION_INFO.slice(0, 4);

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
       onPress={() => {}} 
       className='rounded-[8px] h-12 mb-3' 
       icon={<CameraIcon fill="#ffffff" className='text-[#e46592]' size={22} strokeWidth={2}/>}
     />
     <Button 
       text="갤러리에서 선택" 
       onPress={() => {}} 
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


     <View className='w-full h-fit mt-4 border-[1px] border-gray-300 rounded-[8px] p-4'>
      <View className='w-full py-20 items-center justify-between'>
        <Text className='text-[16px] font-medium'>찍은사진</Text>
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
  <Button text="식단에 추가하기" onPress={() => {}} className='h-11 bg-main-pink rounded-[8px] mb-2' />
     <Button text="AI에게 물어보기" onPress={() => {}} className='h-11 bg-white rounded-[8px] border-[0.5px] border-main-pink mb-2' textColor='#e46592' icon={<Image source={require('../../../assets/image/bot.png')} style={{ width: 16, height: 16 }} resizeMode="contain" />} />
      <Button text="다시 촬영하기" onPress={() => {}} className='h-11 bg-white rounded-[8px] border-[1px] border-gray-300' textColor='#4b5563'  />
</View>

      </View>
     </View>
    </ScrollView>
  ); 
}
