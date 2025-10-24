import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import {
  getMyProfile,
  getMetadata,
  updateMyProfile,
} from "../api/services/user";
import { UpdateUserPayload } from "../api/types/user";

//내 프로필 정보를 조회하는 useQuery 훅
export const useGetMyProfile = () => {
  return useQuery({
    queryKey: ["myProfile"], // 쿼리 키를 'myProfile'로 지정
    queryFn: getMyProfile,
    select: (data) => data.result, // 성공 시 result 객체만 반환하도록 선택
  });
};

/**
 * 프로필 정보를 업데이트하는 useMutation 훅
 */
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UpdateUserPayload) => updateMyProfile(userData),
    onSuccess: (data) => {
      console.log("User profile updated successfully:", data);
      Alert.alert("성공", "정보가 성공적으로 저장되었습니다.");

      // 프로필 정보가 변경되었으므로, 'myProfile' 쿼리를 무효화하여 최신 데이터로 갱신
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
    onError: (error) => {
      console.error("❌ Failed to update user profile:", error);
      const message =
        (error as any).response?.data?.message ||
        "정보 업데이트에 실패했습니다.";
      Alert.alert("오류", message);
    },
  });
};

/**
 * 알레르기, 건강 상태 등 선택지 목록 데이터를 가져오는 useQuery 훅
 */
export const useGetMetadata = () => {
  return useQuery({
    queryKey: ["metadata"],
    queryFn: getMetadata,
  });
};
