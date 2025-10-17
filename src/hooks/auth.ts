import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updateUserDetails, updateUserHealthInfo } from '../api/services/auth';
import { UserDetailsPayload, UserHealthInfoPayload } from '../api/types/user';
import { getMetadata } from '../api/services/user';

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

export const useUpdateUserHealthInfo = () => {
  const navigation = useNavigation();
  //const navigation = useNavigation<RootStackNavigationProp>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UserHealthInfoPayload) => updateUserHealthInfo(userData),

    onSuccess: (data) => {
      console.log('User health info updated successfully:', data);
      //Alert.alert('성공', '건강정보가 성공적으로 저장되었습니다.');
      
      queryClient.invalidateQueries({ queryKey: ['myHealthInfo'] });
      
      //navigation.navigate('Tab' as never);
      //navigation.replace("Tab");
      navigation.navigate('Success' as never);
    },
    onError: (error) => {
      console.error('❌ Failed to update user details:', error);
      const message = (error as any).response?.data?.message || '정보 업데이트에 실패했습니다.';
      Alert.alert('오류', message);
    },
  });
};

export const useGetMetadata = () => {
  return useQuery({
    queryKey: ['metadata'], 
    queryFn: getMetadata, 
  });
};