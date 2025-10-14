import apiClient  from "../client";
import { ApiResponse } from "../types/common";
import { MetadataResponse } from "../types/user";

//건강정보 메타데이터가져오기

export const getMetadata = async (): Promise<ApiResponse<MetadataResponse>> => {
  const response = await apiClient.get<ApiResponse<MetadataResponse>>('/metadata');
  return response.data;
};