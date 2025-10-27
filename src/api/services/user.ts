import apiClient from "../client";
import { ApiResponse } from "../types/common";
import { MetadataResponse, UpdateUserPayload } from "../types/user";

//건강정보 메타데이터가져오기

export const getMetadata = async (): Promise<ApiResponse<MetadataResponse>> => {
  const response =
    await apiClient.get<ApiResponse<MetadataResponse>>("/metadata");
  return response.data;
};

// 현재 로그인된 사용자의 상세 정보를 조회
export const getMyProfile = async (): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>("/users/me/ver2");
  return response.data;
};

//사용자의 수정된 정보 저장
export const updateMyProfile = async (
  payload: UpdateUserPayload
): Promise<ApiResponse<{ id: number }>> => {
  const response = await apiClient.put<ApiResponse<{ id: number }>>(
    "/users/me",
    payload
  );
  return response.data;
};

export const logoutUser = async () => {
  // 로그아웃은 보통 POST를 사용하며, 특별한 응답 본문이 없을 수 있습니다.
  const response = await apiClient.post("/users/logout");
  return response.data;
};
