import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API 기본 설정
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_TIMEOUT = 10000; // 10초

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 토큰이 있다면 헤더에 추가
    const token = await getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 요청 로깅 (개발 환경에서만)
    if (__DEV__) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 응답 로깅 (개발 환경에서만)
    if (__DEV__) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    
    return response;
  },
  (error) => {
    // 에러 로깅
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
    });
    
    // 401 에러 시 토큰 제거 및 로그인 페이지로 이동
    if (error.response?.status === 401) {
      removeAuthToken();
      // 여기서 로그인 페이지로 네비게이션 처리
    }
    
    return Promise.reject(error);
  }
);

// 토큰 관리 함수들
const TOKEN_KEY = 'auth_token';

const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('토큰 가져오기 실패:', error);
    return null;
  }
};

const setAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('토큰 저장 실패:', error);
  }
};

const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('토큰 제거 실패:', error);
  }
};

// 서버 연결 상태 확인 함수
export const checkServerConnection = async (): Promise<boolean> => {
  try {
    // 간단한 GET 요청으로 서버 상태 확인
    const response = await apiClient.get('/health', { timeout: 5000 });
    console.log('✅ 서버 연결 성공:', response.status);
    return true;
  } catch (error) {
    console.error('❌ 서버 연결 실패:', error);
    return false;
  }
};

// baseURL 정보 출력 함수
export const getApiInfo = () => {
  const baseURL = apiClient.defaults.baseURL;
  console.log('🌐 현재 API BaseURL:', baseURL);
  return baseURL;
};

export { setAuthToken, removeAuthToken };
export default apiClient;
