import { Text, View, Image } from "react-native";

export default function FoodCatogory({ category }: { category: string }) {
  
  const getCategoryColor = (category: string) => {
    switch (category) {
    case "빵 및 과자류" :
        return <Image source={require("../../../assets/icons/foodCategory/bread.png")} style={{ width: 21, height: 18}} />;
    case "음료 및 차류" :
        return <Image source={require("../../../assets/icons/foodCategory/drink.png")} style={{ width: 23, height: 23 }} />;
    case "국 및 탕류" :
        return <Image source={require("../../../assets/icons/foodCategory/pot-of-food.png")} style={{ width: 24, height: 24 }} />;
    case "볶음류" :
        return <Image source={require("../../../assets/icons/foodCategory/fry.png")} style={{ width: 25, height: 25 }} />;
    case "생채, 무침류" :
        return <Image source={require("../../../assets/icons/foodCategory/natural-food.png")} style={{ width: 21, height: 18 }} />;
    case "유제품류 및 빙과류" :
        return <Image source={require("../../../assets/icons/foodCategory/organic-food.png")} style={{ width: 21, height: 18 }} />;
   case "밥류" :
        return <Image source={require("../../../assets/icons/foodCategory/rice.png")} style={{ width: 24, height: 24 }} />;
   case "튀김류" :
        return <Image source={require("../../../assets/icons/foodCategory/fried.png")} style={{ width: 25, height: 25 }} />;
   case "찌개 및 전골류" :
        return <Image source={require("../../../assets/icons/foodCategory/ep_food.png")} style={{ width: 21, height: 18 }} />;
    case "면 및 만두류" :
        return <Image source={require("../../../assets/icons/foodCategory/noodle.png")} style={{ width: 21, height: 18 }} />;
    case "구이류" :
        return <Image source={require("../../../assets/icons/foodCategory/roast.png")} style={{ width: 23, height: 23 }} />;
    case "나물, 숙채류" :
        return <Image source={require("../../../assets/icons/foodCategory/natural-food.png")} style={{ width: 21, height: 18 }} />;
    case "조림류" :
        return <Image source={require("../../../assets/icons/foodCategory/steamed.png")} style={{ width: 21, height: 18 }} />;
    case "전, 적 및 부침류" :
        return <Image source={require("../../../assets/icons/foodCategory/pizza.png")} style={{ width: 21, height: 18 }} />;
    case "찜류" :
        return <Image source={require("../../../assets/icons/foodCategory/steamed.png")} style={{ width: 22, height: 22 }} />;
    case "죽 및 스프류" :
        return <Image source={require("../../../assets/icons/foodCategory/Group.png")} style={{ width: 21, height: 18 }} />;
    case "김치류" : //
        return <Image source={require("../../../assets/icons/foodCategory/kimchi.png")} style={{ width: 21, height: 18 }} />;
    case "장류, 양념류" :
        return <Image source={require("../../../assets/icons/foodCategory/sauce.png")} style={{ width: 21, height: 18 }} />;
    case "장아찌, 절임류" :
        return <Image source={require("../../../assets/icons/foodCategory/jang-ajji.png")} style={{ width: 21, height: 18 }} />;
    case "젓갈류" :
        return <Image source={require("../../../assets/icons/foodCategory/jeotgal.png")} style={{ width: 21, height: 18 }} />;    
    case "수,조,어,육류" :
        return <Image source={require("../../../assets/icons/foodCategory/fish.png")} style={{ width: 21, height: 18 }} />;
    case "곡류, 서류 제품" :
        return <Image source={require("../../../assets/icons/foodCategory/raw-rice.png")} style={{ width: 21, height: 18 }} />;
    case "과일류" :
        return <Image source={require("../../../assets/icons/foodCategory/fruit.png")} style={{ width: 21, height: 18 }} />;    
    case "두류 견과 및 종실류" :
        return <Image source={require("../../../assets/icons/foodCategory/peanut.png")} style={{ width: 21, height: 18 }} />;
    case "채소, 해조류" :
        return <Image source={require("../../../assets/icons/foodCategory/natural-food.png")} style={{ width: 21, height: 18 }} />;
    default:
        return <Image source={require("../../../assets/icons/foodCategory/natural-food.png")} style={{ width: 21, height: 18 }} />;
    }
  };

  return getCategoryColor(category);
}