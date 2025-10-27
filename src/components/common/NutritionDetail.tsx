import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import Button from './Button';
import Border from './Border';

interface NutrientItem {
  kname: string;
  value: number;
  unit: string;
}

interface MacroNutrient {
  name: string;
  value: number | string;
  unit: string;
}

interface NutritionDetailProps {
  // 음식 정보
  foodName?: string;
  portion?: string; // 예: "100g 기준"
  imageUri?: string;
  
  // 주요 영양소 (칼로리, 단백질, 지방, 탄수화물)
  calories?: number | string;
  protein?: number | string;
  fat?: number | string;
  carbs?: number | string;
  
  // 상세 영양 정보 배열
  detailedNutrients?: NutrientItem[];
  
  // 버튼 액션
  onAddToMeal?: () => void;
  onAskAI?: () => void;
  onRetake?: () => void;
  onBorder?: boolean;
  
  // 버튼 표시 여부
  showButtons?: boolean;
}

export default function NutritionDetail({
  foodName,
  portion = "100g 기준",
  imageUri,
  calories,
  protein,
  fat,
  carbs,
  detailedNutrients = [],
  onAddToMeal,
  onAskAI,
  onRetake,
  onBorder = true,
  showButtons = true,
}: NutritionDetailProps) {
  const [showAllNutrition, setShowAllNutrition] = useState(false);

  return (
    <View className='w-full h-fit mt-4 border-[1px] border-gray-300 rounded-[8px] p-4 bg-white'>
      {/* 이미지 섹션 */}
      {imageUri && (
        <View className='w-full py-4 items-center justify-center'>
          <Image 
            source={{ uri: imageUri }} 
            style={{ width: 400, height: 300, borderRadius: 8 }}
            resizeMode="contain"
          />
        </View>
      )}
{onBorder && (
<Border borderColor='gray' />)}
      <View className='w-full h-fit pt-3 px-1'>
        {/* 음식명 및 기준 */}
        {foodName && (
          <View className='w-full h-fit flex-row items-end'>
            <Text className='text-[22px] font-medium mr-2'>{foodName}</Text>
            <Text className='text-[14px] font-light text-[#4b5563]'>{portion}</Text>
          </View>
        )}

        {/* 주요 영양소 (4개) */}
        <View className='w-full flex-row justify-between mt-3'>
          {calories !== undefined && (
            <View className='flex-1 flex-col justify-center items-center gap-1'>
              <Text className='text-[24px] font-medium text-[#e46592]'>{calories}</Text>
              <Text className='text-[12px] font-light text-[#4b5563]'>칼로리</Text>
            </View>
          )}
          
          {protein !== undefined && (
            <View className='flex-1 flex-col justify-center items-center gap-1'>
              <Text className='text-[24px] font-medium text-[#e46592]'>{protein}</Text>
              <Text className='text-[12px] font-light text-[#4b5563]'>단백질(g)</Text>
            </View>
          )}
          
          {fat !== undefined && (
            <View className='flex-1 flex-col justify-center items-center gap-1'>
              <Text className='text-[24px] font-medium text-[#e46592]'>{fat}</Text>
              <Text className='text-[12px] font-light text-[#4b5563]'>지방(g)</Text>
            </View>
          )}
          
          {carbs !== undefined && (
            <View className='flex-1 flex-col justify-center items-center gap-1'>
              <Text className='text-[24px] font-medium text-[#e46592]'>{carbs}</Text>
              <Text className='text-[12px] font-light text-[#4b5563]'>탄수화물(g)</Text>
            </View>
          )}
        </View>

        {/* 상세 영양 정보 */}
        {detailedNutrients.length > 0 && (
          <View className='w-full mt-5'>
            <Text className='text-[14px] text-[#4b5563] mb-1'>상세 영양 정보</Text>

            {detailedNutrients
              .slice(0, showAllNutrition ? detailedNutrients.length : 4)
              .map((item, index) => (
                <View key={index} className='w-full mt-3'>
                  <View className='flex-row justify-between mb-2 w-full'>
                    <Text className='text-[14px]'>{item.kname}</Text>
                    <Text className='text-[14px] font-medium'>
                      {item.value}{item.unit}
                    </Text>
                  </View>
                  <Border />
                </View>
              ))}

            {detailedNutrients.length > 4 && (
              <View className='w-full mt-4'>
                <Button
                  text={showAllNutrition ? "접기" : "더보기"}
                  onPress={() => setShowAllNutrition(!showAllNutrition)}
                  variant="CUSTOM"
                  className='h-10 bg-gray-100 rounded-[6px]'
                  textColor="#4b5563"
                  icon={
                    showAllNutrition ? 
                      <ChevronUp size={16} color="#4b5563" /> : 
                      <ChevronDown size={16} color="#4b5563" />
                  }
                />
              </View>
            )}
          </View>
        )}

        {/* 액션 버튼 */}
        {showButtons && (
          <View className='mt-4'>
            {onAddToMeal && (
              <Button 
                text="식단에 추가하기" 
                onPress={onAddToMeal} 
                className='h-11 bg-main-pink rounded-[8px] mb-2' 
              />
            )}
            {onAskAI && (
              <Button 
                text="AI에게 물어보기" 
                onPress={onAskAI} 
                className='h-11 bg-white rounded-[8px] border-[0.5px] border-main-pink mb-2' 
                textColor='#e46592' 
                icon={
                  <Image 
                    source={require('../../../assets/image/bot.png')} 
                    style={{ width: 16, height: 16 }} 
                    resizeMode="contain" 
                  />
                } 
              />
            )}
            {onRetake && (
              <Button 
                text="다시 촬영하기" 
                onPress={onRetake} 
                className='h-11 bg-white rounded-[8px] border-[1px] border-gray-300' 
                textColor='#4b5563' 
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
}

