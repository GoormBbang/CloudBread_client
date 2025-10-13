// API 공통 타입 정의
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  result? :T;
}

export interface NutritionStats {
  calories: {
    current: number;
    target: number;
    percentage: number;
  };
  protein: {
    current: number;
    target: number;
    percentage: number;
  };
  carbohydrates: {
    current: number;
    target: number;
    percentage: number;
  };
  fat: {
    current: number;
    target: number;
    percentage: number;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  pregnancyWeek: number;
  email?: string;
}

