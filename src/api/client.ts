import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { useAuthStore } from "../store/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API 기본 설정
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
//const API_TIMEOUT = 10000;

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  //timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 (기존 코드와 동일)
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    console.log("accessToken:", accessToken);

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// --- 토큰 재발급 로직을 위한 변수 ---
/** * 토큰 재발급이 현재 진행 중인지 여부를 나타내는 플래그.
 * 여러 API 요청이 동시에 401 에러를 받을 때,
 * 토큰 재발급 요청이 중복으로 실행되는 것을 방지합니다.
 */
let isRefreshing = false;

/**
 * 토큰이 재발급되는 동안 실패한 요청들을 저장하는 큐.
 * 재발급이 성공하면, 이 큐에 쌓인 요청들을
 * 새 토큰으로 다시 시도합니다.
 */
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

/**
 * 큐에 쌓인 요청들을 처리하는 함수.
 * @param error 재발급 실패 시 에러 객체
 * @param newAccessToken 재발급 성공 시 새 액세스 토큰
 */
const processQueue = (
  error: AxiosError | null,
  newAccessToken: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(newAccessToken);
    }
  });
  failedQueue = [];
};
// --- 토큰 재발급 로직 끝 ---

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 2xx 응답은 그대로 반환
    return response;
  },
  async (error: AxiosError) => {
    // 1. 원본 요청 정보와 설정 가져오기
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 2. Zustand 스토어에서 필요한 함수들 가져오기
    const { signOut, setTokens } = useAuthStore.getState();

    // 3. 401 에러인지 확인
    //    && originalRequest.url이 리프레시 요청인지 확인 (무한 루프 방지)
    //    && _retry 플래그가 없는지 확인 (재시도한 요청인지 확인)
    if (
      error.response?.status === 401 &&
      originalRequest.url !== "/refresh-tokens" &&
      !originalRequest._retry
    ) {
      // 4. 현재 다른 요청이 토큰을 재발급 중인 경우
      if (isRefreshing) {
        // 큐에 현재 요청을 추가하고 대기
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newAccessToken) => {
            // 큐에서 처리되어 새 토큰을 받으면, 헤더를 업데이트하고 요청 재시도
            originalRequest.headers["Authorization"] =
              "Bearer " + newAccessToken;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // 5. 첫 401 에러인 경우, 토큰 재발급 시작
      originalRequest._retry = true; // 재시도 플래그 설정
      isRefreshing = true;

      const { refreshToken } = useAuthStore.getState();

      if (!refreshToken) {
        // 리프레시 토큰이 없으면 즉시 로그아웃 처리
        console.log("No refresh token available, logging out.");
        signOut();
        isRefreshing = false;
        processQueue(error, null); // 큐에 대기 중인 다른 요청들도 모두 실패 처리
        return Promise.reject(error);
      }

      try {
        console.log("Attempting to refresh token...");

        // 6. 토큰 재발급 API 호출 (제공된 스펙 기준)
        // 중요: 이 요청은 apiClient가 아닌 기본 axios를 사용해야 합니다.
        // (apiClient를 쓰면 인터셉터가 다시 동작하여 무한 루프에 빠짐)
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/refresh-tokens`,
          { refreshToken }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          refreshResponse.data;

        // 7. 성공: 새 토큰을 스토어에 저장
        setTokens({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
        console.log("Token refreshed successfully.");

        // 8. apiClient의 기본 헤더도 업데이트 (이후 요청을 위해)
        apiClient.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;

        // 9. 실패했던 원래 요청의 헤더를 새 토큰으로 변경
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // 10. 큐에 쌓여있던 다른 요청들 처리 (성공)
        processQueue(null, newAccessToken);

        // 11. 원래 요청 재시도
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        // 12. 실패: 리프레시 토큰이 유효하지 않음 (400, 404 등)
        console.error("Failed to refresh token:", refreshError.response?.data);

        // API 스펙에 따라 400, 404 에러 시 로그아웃 처리
        const errorCode = refreshError.response?.data?.code;
        if (errorCode === "TOKEN_404" || errorCode === "TOKEN_401") {
          signOut();
        }

        // 13. 큐에 쌓여있던 다른 요청들 처리 (실패)
        processQueue(refreshError, null);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false; // 재발급 프로세스 종료
      }
    }

    // 401이 아닌 다른 모든 에러는 그대로 반환
    return Promise.reject(error);
  }
);

// 토큰 관리 함수들
const TOKEN_KEY = "auth_token";

const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("토큰 가져오기 실패:", error);
    return null;
  }
};

const setAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("토큰 저장 실패:", error);
  }
};

const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("토큰 제거 실패:", error);
  }
};

export { setAuthToken, removeAuthToken, getAuthToken };
export default apiClient;
