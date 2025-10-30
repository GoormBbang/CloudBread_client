export const getCalendarFood = (category: string): string => {
 switch (category) {
  case "밥류":
   return "🍚";
  case "국 및 탕류":
   return "🍲";
  case "찌개 및 전골류":
   return "🥘";
  case "볶음류":
   return "🍳";
  case "튀김류":
   return "🍟";
  case "구이류":
   return "🍖";
  case "면 및 만두류":
   return "🍜";
  case "빵 및 과자류":
   return "🍞";
  case "음료 및 차류":
   return "☕️";
  case "생채, 무침류":
   return "🥗";
  case "유제품류 및 빙과류":
   return "🥛";
  case "나물, 숙채류":
   return "🌿";
  case "조림류":
   return "🍲"; 
  case "전, 적 및 부침류":
   return "🥞";
  case "찜류":
   return "🥘"; 
  case "죽 및 스프류":
   return "🥣";
  case "김치류":
   return "🥬"; 
  case "장류, 양념류":
   return "🧂";
  case "장아찌, 절임류":
   return "🥒";
  case "젓갈류":
   return "🦐";
  case "수,조,어,육류":
   return "🐟";
  case "곡류, 서류 제품":
   return "🌾";
  case "과일류":
   return "🍎";
  case "두류 견과 및 종실류":
   return "🥜";
  case "채소, 해조류":
   return "🥦";

  // 위에 없는 카테고리일 경우
  default:
   return "🍽️";
 }
};