import apiClient from "../client";
import EventSource from "react-native-sse";

// SSE 커스텀 이벤트 타입 정의
type PhotoAnalysisEvents = "status" | "candidates";

// SSE 연결을 위한 타입 정의
export interface SSECallbacks {
  onStatus?: (status: string) => void;
  onCandidates?: (candidates: any[]) => void;
  onError?: (error: any) => void;
  onOpen?: () => void;
}

// SSE 연결 관리를 위한 변수
let eventSource: EventSource<PhotoAnalysisEvents> | null = null;

//이미지 업로드 및 SSE 구독
export const postImageUpload = async (
  imageUri: string,
  callbacks?: SSECallbacks
) => {
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
        return 'image/jpeg'; // 기본값
    }
  };

  // 파일명 생성
  const getFileName = (uri: string) => {
    const extension = uri.toLowerCase().split('.').pop();
    return `photo.${extension || 'jpg'}`;
  };

  // 파일 객체 생성
  formData.append('file', {
    uri: imageUri,
    type: getImageType(imageUri),
    name: getFileName(imageUri),
  } as any);

  const response = await apiClient.post('/photo-analyses', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  console.log('✅ Upload response:', response.data);
  
  // 업로드 성공 시 즉시 SSE 구독 시작
  if (response.data.isSuccess) {
    const photoAnalysisId = response.data.result?.photoAnalysisId;
    
    if (photoAnalysisId) {
      console.log('🆔 photo_analysis_id =', photoAnalysisId);
      
      
      // 콜백이 제공된 경우에만 SSE 구독
      if (callbacks) {
        subscribeToPhotoAnalysis(photoAnalysisId, callbacks);
      }
    } else {
      console.error('❌ photo_analysis_id를 응답에서 찾지 못했습니다.');
    }
  }
  
  return response.data.result?.photoAnalysisId;
};

// SSE 구독 시작
export const subscribeToPhotoAnalysis = (
  photoAnalysisId: string,
  callbacks: SSECallbacks
) => {
  // 기존 연결이 있다면 종료
  closeSSE();

  const baseURL = apiClient.defaults.baseURL || '';
  const url = `${baseURL}/photo-analyses/${photoAnalysisId}/events`;
  
  console.log('🔌 SSE 오픈:', url);
  
  // react-native-sse를 사용한 EventSource 생성
  eventSource = new EventSource<PhotoAnalysisEvents>(url, {
    headers: {
      // Authorization 헤더가 필요하다면 추가
      // 'Authorization': `Bearer ${token}`,
    },
  });

  // 연결 성공
  eventSource.addEventListener('open', (event) => {
    console.log('🟢 SSE 연결됨', event);
    callbacks.onOpen?.();
  });

  // 메시지 수신 (기본 message 이벤트)
  eventSource.addEventListener('message', (event) => {
    console.log('📨 [message] 원본:', event);
    try {
      if (event.data) {
        const payload = JSON.parse(event.data);
        console.log('📨 [message] 파싱됨:', payload);
      }
    } catch (err) {
      console.error('message 파싱 실패', err);
    }
  });

  // status 이벤트 수신
  eventSource.addEventListener('status', (event) => {
    console.log('📣 [status] 원본:', event);
    try {
      if (event.data) {
        const payload = JSON.parse(event.data);
        const status = payload?.status ?? 'UNKNOWN';
        console.log('📣 [status] 파싱됨:', payload);
        callbacks.onStatus?.(status);
      }
    } catch (err) {
      console.error('status 파싱 실패', err, event);
    }
  });

  // candidates 이벤트 수신
  eventSource.addEventListener('candidates', (event) => {
    console.log('🍱 [candidates] 원본:', event);
    try {
      if (event.data) {
        const payload = JSON.parse(event.data);
        console.log('🍱 [candidates] 파싱됨:', payload);
        if (Array.isArray(payload?.candidates)) {
          callbacks.onCandidates?.(payload.candidates);
        }
      }
      // 후보를 받으면 SSE 연결 종료 (선택사항)
      // closeSSE();
    } catch (err) {
      console.error('candidates 파싱 실패', err, event);
    }
  });

  // 에러 처리
  eventSource.addEventListener('error', (error) => {
    console.warn('⚠️ SSE 에러:', error);
    console.warn('⚠️ SSE 에러 상세:', JSON.stringify(error));
    callbacks.onError?.(error);
  });

  return eventSource;
};

// SSE 연결 종료
export const closeSSE = () => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
    console.log('🔒 SSE 수동 종료');
  }
};

//선택한 후보 음식 post
export const postSelectedFood = async (photoAnalysisId: string, foodId: string) => {
  const response = await apiClient.post(`/photo-analyses/${photoAnalysisId}/confirm`, {
   selectedFoodId: foodId,
  });
  return response.data;
};

interface SelectedTimeProps {
  foodId: string;
  photoAnalysisId?: string;
  mealType: string;
  intakePercent: number;
}

//선택한 시간 post
export const postSelectedTime = async ({foodId, photoAnalysisId, mealType, intakePercent}: SelectedTimeProps) => {
  const response = await apiClient.post(`/food-history`, {
   foodId,
   photoAnalysisId,
   mealType,
   intakePercent,
  });
  return response.data;
};

//음식명 직접 입력
export const getFoodSuggest = async (foodName: string) => {
  const response = await apiClient.get(`/foods/suggest?q=${foodName}&limit=10`);
  return response.data;
};