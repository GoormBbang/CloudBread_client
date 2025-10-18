// 월별 식단 기록 API 응답 결과 타입
export interface CalendarDay {
  day: number;
  count: number;
}

export interface FoodHistoryCalendar {
  year: number;
  month: number;
  days: CalendarDay[];
}
import apiClient from "../client";
import { ApiResponse } from "../types/common";

// 월별 식단 기록 조회 API
export const getFoodHistoryCalendar = async ({
  year,
  month,
}: {
  year: number;
  month: number;
}): Promise<ApiResponse<FoodHistoryCalendar>> => {
  const response = await apiClient.get<ApiResponse<FoodHistoryCalendar>>(
    "/users/me/food-history/calendar",
    {
      params: {
        year,
        month,
      },
    }
  );
  return response.data;
};

// 일별 식단 기록 API 응답 결과 타입
export interface NutritionTotals {
  carbs: number;
  protein: number;
  fat: number;
  sugar: number;
}

export interface FoodItem {
  foodName: string;
  category: string;
  calories: number;
}

export interface MealDetail {
  mealType: "BREAKFAST" | "LUNCH" | "DINNER";
  totalCalories: number;
  foods: FoodItem[];
}

export interface IntakeMessage {
  mealType: "아침" | "점심" | "저녁";
  level: "적게" | "적당히" | "많이";
}

export interface FoodHistorySummary {
  date: string;
  totalCalories: number;
  nutritionTotals: NutritionTotals;
  meals: MealDetail[];
  intakeMessages: IntakeMessage[];
}

//일별 식단 상세조회
export const getFoodHistorySummary = async (
  date: string
): Promise<ApiResponse<FoodHistorySummary>> => {
  const response = await apiClient.get<ApiResponse<FoodHistorySummary>>(
    "/users/me/food-history/calendar-summary",
    {
      params: { date },
    }
  );
  return response.data;
};

//오늘의 영양 요약 조회
export const getNutritionSummary = async (date: string) => {
  const { data } = await apiClient.get<ApiResponse<any>>(
    `users/me/nutrition/summary?date=${date}`
  );
  return data.result;
};

//영양소 밸런스 조회
export const getNutritionBalance = async (date: string) => {
  const { data } = await apiClient.get<ApiResponse<any>>(
    `users/me/nutrition/balance?date=${date}`
  );
  return data.result;
};

//특정 날짜에 먹은 음식 리스트 조회
export const getDailyFoodHistory = async (date: string) => {
  const { data } = await apiClient.get<ApiResponse<any>>(
    `food-history/today?date=${date}`
  );
  //   if (data.isSuccess) {
  //     return data.result;
  //   }
  return data.result;
};

//AI 영양 피드백 생성 요청
export const postAIFeedback = async () => {
  const { data } = await apiClient.post<ApiResponse<any>>(
    "me/nutrition/feedback",
    {
      timeout: 10000,
    }
  );
  return data.result;
};
