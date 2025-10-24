import apiClient from "../client";
import { ApiResponse, NutritionStats } from "../types/common";

export const getUserInfo = async (): Promise<any> => {
  const response = await apiClient.get<ApiResponse<any>>('/users/user-summary');
  console.log('🔑 getUserInfo:', response.data);
  return response.data;
};

//오늘의 영양정보
export const getTodayNutrition = async (): Promise<any> => {
  const response = await apiClient.get<ApiResponse<any>>('/users/me/today-nutrients-stats');
  // console.log('🔑 getTodayNutrition:', response.data);
  return response.data;
};

//이번 주차 팁 전체 조회
export const getThisWeekTips = async (): Promise<any> => {
  const response = await apiClient.get<ApiResponse<any>>('/users/me/tip');
  // console.log('🔑 getThisWeekTips:', response.data);
  return response.data;
};

//이번 주차 태아 팁 조회
export const getThisWeekBabyTips = async (): Promise<any> => {
  const response = await apiClient.get<ApiResponse<any>>('/users/me/tip/baby');
  // console.log('🔑 getThisWeekBabyTips:', response.data);
  return response.data;
};

//이번 주차 엄마(건강) 팁 조회
export const getThisWeekMomTips = async (): Promise<any> => {
  const response = await apiClient.get<ApiResponse<any>>('/users/me/tip/mom');
  // console.log('🔑 getThisWeekMomTips:', response.data);
  return response.data;
};

//이번 주차 영양 정보 팁 조회
export const getThisWeekNutritionTips = async (): Promise<any> => {
  const response = await apiClient.get('/users/me/tip/nutrition');
  // console.log('🔑 getThisWeekNutritionTips:', response.data);
  return response.data;
};

//오늘의 AI 추천 식단 조회 -> 새로고침
export const postTodayFoodListRefresh = async (): Promise<any> => {
  const response = await apiClient.post('/meal-plans/refresh');
  console.log('🔑 postTodayFoodListRefresh:', response.data);
  return response.data;
};

export const getTodayFoodList = async (): Promise<any> => {
  const response = await apiClient.post('/meal-plans/today');
  console.log('🔑 getTodayFoodList:', response.data);
  return response.data;
};

//오늘의 AI 추천 식단 상세 영양 정보 조회
export const getFoodNutritionDetail = async (foodId: string): Promise<any> => {
  const response = await apiClient.get(`/foods/${foodId}/detail`);
  console.log('🔑 getFoodNutritionDetail:', response.data);
  return response.data;
};