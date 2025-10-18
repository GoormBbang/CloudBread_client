import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getDailyFoodHistory,
  getFoodHistoryCalendar,
  getFoodHistorySummary,
  getNutritionBalance,
  getNutritionSummary,
  postAIFeedback,
} from "../api/services/nutrientDetail";

// 월별 식단 기록 조회를 위한 커스텀 훅
export const useGetFoodHistoryCalendar = (year: number, month: number) => {
  return useQuery({
    queryKey: ["foodHistory", year, month],
    queryFn: async () => {
      const res = await getFoodHistoryCalendar({ year, month });
      console.log("월별 응답", res);
      return res;
    },
    enabled: !!year && !!month,
    select: (data) => data.result,
  });
};

// 일별 상세 식단 요약 조회를 위한 커스텀 훅
export const useGetFoodHistorySummary = (date: string) => {
  return useQuery({
    queryKey: ["foodHistorySummary", date],
    queryFn: async () => {
      const res = await getFoodHistorySummary(date);
      console.log("요약 응답 ", res);
      return res;
    },
    enabled: !!date,
    select: (data) => data.result,
    throwOnError: (error: any) => {
      if (error.response?.data?.isSuccess === false) {
        return false;
      }
      return true;
    },
  });
};

// 특정 날짜의 모든 영양 정보를 가져오는 훅
export const useNutritionData = (date: string) => {
  const queryClient = useQueryClient();

  const results = useQueries({
    queries: [
      {
        queryKey: ["nutritionSummary", date],
        queryFn: () => getNutritionSummary(date),
      },
      {
        queryKey: ["nutritionBalance", date],
        queryFn: () => getNutritionBalance(date),
      },
      {
        queryKey: ["dailyFoodHistory", date],
        queryFn: () => getDailyFoodHistory(date),
      },
    ],
  });

  const summaryQuery = results[0];
  const balanceQuery = results[1];
  const historyQuery = results[2];

  const isLoading = results.some((query) => query.isLoading);
  const isError = results.some((query) => query.isError);

  const aiFeedbackMutation = useMutation({
    mutationFn: postAIFeedback,
    onSuccess: (data) => {
      console.log("AI Feedback", data.FeedbackSummary);
    },
  });

  return {
    summary: summaryQuery.data,
    balance: balanceQuery.data,
    history: historyQuery.data,
    isLoading,
    isError,
    generateFeedback: aiFeedbackMutation.mutate,
    feedback: aiFeedbackMutation.data,
    isGeneratingFeedback: aiFeedbackMutation.isPending,
  };
};
