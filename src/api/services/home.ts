import apiClient from "../client";
import { ApiResponse, NutritionStats } from "../types/common";

export const getTodayNutrition = async (): Promise<NutritionStats> => {
  const response = await apiClient.get<ApiResponse<NutritionStats>>('/users/me/today-nutrients-stats');
  return response.data.data;
};