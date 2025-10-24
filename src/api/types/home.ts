export interface UserInfoType {
  id: number;
  nickname: string;
  dueDate: number | null;
  birth_date?: string | null;
  profileImageUrl?: string;
}

export interface ThisWeekTipsType {
tips: ThisWeekTipType[];
week_number: number;
}

export interface ThisWeekTipType {
id:number;
kind:string;
title:string;
description:string;
}

export interface TodayAIRecommendationType {
  mealType: string;
  totalKcal: number;
  items: TodayFoodListType[];
}

export interface TodayFoodListType{
  foodId: number;
  name: string;
  portionLabel: string;
  estCalories: number;
  foodCategory: string;
}