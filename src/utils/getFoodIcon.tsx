import React from "react";
import { Text, View, Image } from "react-native";

interface FoodIconProps {
 name: string;
 size?: number;
}

const FoodCatogory = ({ name, size }: FoodIconProps) => {
 const getIconByName = () => {
  const foodName = name.toLowerCase();
  
  let source;
  let defaultWidth = 21;
  let defaultHeight = 18;

  if (foodName.includes("볶음")) {
   source = require("../../assets/icons/foodCategory/fry.png");
   defaultWidth = 25; defaultHeight = 25;
  } else if (foodName.includes("튀김")) {
   source = require("../../assets/icons/foodCategory/fried.png");
   defaultWidth = 25; defaultHeight = 25;
  } else if (foodName.includes("구이")) {
   source = require("../../assets/icons/foodCategory/roast.png");
   defaultWidth = 23; defaultHeight = 23;
  } else if (foodName.includes("국") || foodName.includes("탕")) {
   source = require("../../assets/icons/foodCategory/pot-of-food.png");
   defaultWidth = 24; defaultHeight = 24;
  } else if (foodName.includes("찌개") || foodName.includes("전골")) {
   source = require("../../assets/icons/foodCategory/ep_food.png");
   defaultWidth = 21; defaultHeight = 18;
  } else if (foodName.includes("밥") || foodName.includes("김밥")) {
   source = require("../../assets/icons/foodCategory/rice.png");
   defaultWidth = 24; defaultHeight = 24;
  } else if (foodName.includes("면") || foodName.includes("만두")) {
   source = require("../../assets/icons/foodCategory/noodle.png");
   defaultWidth = 21; defaultHeight = 18;
  } else if (foodName.includes("죽") || foodName.includes("스프")) {
   source = require("../../assets/icons/foodCategory/Group.png");
   defaultWidth = 21; defaultHeight = 18;
  } else if (foodName.includes("빵") || foodName.includes("과자")) {
   source = require("../../assets/icons/foodCategory/bread.png");
   defaultWidth = 21; defaultHeight = 18;
  } else if (foodName.includes("음료") || foodName.includes("차")) {
   source = require("../../assets/icons/foodCategory/drink.png");
   defaultWidth = 23; defaultHeight = 23;
  } else if (foodName.includes("생채") || foodName.includes("무침") || foodName.includes("나물") || foodName.includes("숙채") || foodName.includes("채소") || foodName.includes("해조")) {
   source = require("../../assets/icons/foodCategory/natural-food.png");
   defaultWidth = 21; defaultHeight = 18;
  } else if (foodName.includes("유제품") || foodName.includes("빙과")) {
   source = require("../../assets/icons/foodCategory/organic-food.png");
   defaultWidth = 21; defaultHeight = 18;
  } else if (foodName.includes("조림") || foodName.includes("찜")) {
   source = require("../../assets/icons/foodCategory/steamed.png");
   defaultWidth = 21; defaultHeight = 18;
  } else if (foodName.includes("전") || foodName.includes("적") || foodName.includes("부침")) {
   source = require("../../assets/icons/foodCategory/pizza.png");
   defaultWidth = 21; defaultHeight = 18;
  } else if (foodName.includes("김치")) {
   source = require("../../assets/icons/foodCategory/kimchi.png");
   defaultWidth = 21; defaultHeight = 18;
  } else if (foodName.includes("장") || foodName.includes("양념")) {
   source = require("../../assets/icons/foodCategory/sauce.png");
   defaultWidth = 21; defaultHeight = 18;
  } else if (foodName.includes("장아찌") || foodName.includes("절임")) {
   source = require("../../assets/icons/foodCategory/jang-ajji.png");
   defaultWidth = 21; defaultHeight = 18;
  } else if (foodName.includes("젓갈")) {
   source = require("../../assets/icons/foodCategory/jeotgal.png");
   defaultWidth = 21; defaultHeight = 18;
  } else if (foodName.includes("생선") || foodName.includes("어류") || foodName.includes("육류") || foodName.includes("고기")) {
   source = require("../../assets/icons/foodCategory/fish.png");
   defaultWidth = 21; defaultHeight = 18;
  } else if (foodName.includes("곡류") || foodName.includes("서류")) {
   source = require("../../assets/icons/foodCategory/raw-rice.png");
   defaultWidth = 21; defaultHeight = 18;
  } else if (foodName.includes("과일")) {
   source = require("../../assets/icons/foodCategory/fruit.png");
   defaultWidth = 21; defaultHeight = 18;
  } else if (foodName.includes("두류") || foodName.includes("견과") || foodName.includes("종실")) {
   source = require("../../assets/icons/foodCategory/peanut.png");
   defaultWidth = 21; defaultHeight = 18;
  } else {
   source = require("../../assets/icons/foodCategory/natural-food.png");
   defaultWidth = 21; defaultHeight = 18;
  }

  const style = {
   width: size ? size : defaultWidth,
   height: size ? size : defaultHeight,
 };

  return <Image source={source} style={style} resizeMode="contain" />;
 };

 return getIconByName();
}

interface FoodItem {
 name: string;
 calories: number;
}

const MealItem = ({ name, calories }: FoodItem) => {

 return (
  <View className="bg-[#F9FAFB] p-3 rounded-lg flex-row items-center mb-2">
   
   <View className="w-10 h-10 bg-gray-200 rounded-lg mr-3 justify-center items-center">
    <FoodCatogory name={name} size={24} />
   </View>

   <View>
    <Text className="font-semibold">{name} </Text>
    <Text className="text-gray-500">{calories} kcal</Text>
   </View>
  </View>
 );
};

export default MealItem;

