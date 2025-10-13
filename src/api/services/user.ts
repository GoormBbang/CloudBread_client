import apiClient  from "../client";
import { MetadataResponse } from "../types/user";

//건강정보 메타데이터가져오기
export const getMetadata = async (): Promise<MetadataResponse> => {
  const response = await apiClient.get<MetadataResponse>('/metadata');
  console.log('🔑 getMetadata - 토큰 사용:', response.data);
  return response.data;
};