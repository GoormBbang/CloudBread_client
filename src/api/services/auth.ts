import apiClient from "../client";
import { ApiResponse } from "../types/common";
import { UserDetailsPayload, UserHealthInfoPayload } from "../types/user";

// 2단계 개인정보 입력
export const updateUserDetails = async (payload: UserDetailsPayload): Promise<ApiResponse<{id: number}>> => {
  const response = await apiClient.put<ApiResponse<{id: number}>>('/users/details', payload);
  return response.data;
};

//3단계 건강정보 입력
export const updateUserHealthInfo = async (payload: UserHealthInfoPayload): Promise<ApiResponse<{userId: number}>> => {
  const response = await apiClient.put<ApiResponse<{userId: number}>>('/users/health-info', payload);
  return response.data;
};