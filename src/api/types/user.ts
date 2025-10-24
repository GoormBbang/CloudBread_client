export interface User {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

// 소셜 로그인 응답
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// 개인정보 입력 요청
export interface UserDetailsPayload {
  birthDate: string;
  weight: number;
  height: number;
  dueDate: string;
}

export interface MetaItem {
  id: number;
  name: string;
}

export interface MetadataResponse {
  dietTypes: MetaItem[];
  healthTypes: MetaItem[];
  allergies: MetaItem[];
}

// 건강정보 입력 요청
export interface UserHealthInfoPayload {
  dietTypeIds?: number[];
  healthTypeIds?: number[];
  allergyIds?: number[];
  otherHealthFactors?: string;
}

// 프로필 (이름, 생년월일)
export interface UserProfile {
  nickname: string;
  birthDate: string;
}