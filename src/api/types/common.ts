// API 공통 타입 정의
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// 개별 영양소 정보
export interface NutrientInfo {
  name: string;
  value: number;
  unit: number;
}

// 영양소 배열을 포함하는 응답 타입
export interface NutritionStats {
  nutrients: NutrientInfo[];
}

// 기존 타입 (하위 호환성을 위해 유지)
export interface LegacyNutritionStats {
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


