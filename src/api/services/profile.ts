import apiClient from "../client";

export const updateUserBirthDate = async (birthDate: string) => {
  const response = await apiClient.put('/users/user-summary', { birthDate });
  return response.data;
};

export const updateUserName = async (nickname: string) => {
  const response = await apiClient.put('/users/user-summary', { nickname });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await apiClient.get('/users/profile');
  return response.data;
};

export const updateProfileImage = async (imageUri: string) => {
  const formData = new FormData();
  
  // 파일 확장자에 따른 MIME 타입 결정
  const getImageType = (uri: string) => {
    const extension = uri.toLowerCase().split('.').pop();
    switch (extension) {
      case 'png':
        return 'image/png';
      case 'jpg':
        return 'image/jpg';
      case 'jpeg':
        return 'image/jpeg';
      default:
        return 'image/jpeg';
    }
  };

  // 파일명 생성
  const getFileName = (uri: string) => {
    const extension = uri.toLowerCase().split('.').pop();
    return `profile.${extension || 'jpg'}`;
  };

  // 파일 객체 생성
  formData.append('file', {
    uri: imageUri,
    type: getImageType(imageUri),
    name: getFileName(imageUri),
  } as any);

  const response = await apiClient.post('/users/me/profile-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

//회원탈퇴
export const deleteUser = async () => {
  const response = await apiClient.delete('/users/me');
  return response.data;
};