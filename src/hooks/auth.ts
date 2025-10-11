import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updateUserDetails } from '../api/services/auth';
import { UserDetailsPayload } from '../api/types/user';

//TODO : 아직 진행중
export const useUpdateUserDetails = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UserDetailsPayload) => updateUserDetails(userData),
    
    onSuccess: (data) => {
      console.log('User details updated successfully:', data);
      
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      
      navigation.navigate('Step3' as never); // 성공 후 Step3로 이동
    },
    onError: (error) => {
      console.error('❌ Failed to update user details:', error);
      const message = (error as any).response?.data?.message || '정보 업데이트에 실패했습니다.';
      Alert.alert('오류', message);
    },
  });
};