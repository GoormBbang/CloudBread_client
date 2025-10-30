import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useAuthStore } from "../../store/authStore";
import SocialLoginButton, { AuthType } from "../../components/auth/SocialLoginButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { WebView, WebViewNavigation } from "react-native-webview";
const backgroundImage = require("../../../assets/image/signup/OnboardingBack.png");
const logoImage = require("../../../assets/image/signup/Logo.png");
const iconNutrition = require("../../../assets/icons/auth/onboarding-nutrition.png");
const iconHealth = require("../../../assets/icons/auth/onboarding-health.png");
const iconBaby = require("../../../assets/icons/auth/onboarding-baby.png");


const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants?.expoConfig?.extra as any)?.apiUrl ||
  "http://10.0.2.2:3000";
const DEEP_LINK_SCHEME = "CloudBread_client://";
const OAUTH_URLS: Record<AuthType, string> = {
  KAKAO: `${API_BASE_URL}/oauth2/authorization/kakao`,
  NAVER: `${API_BASE_URL}/oauth2/authorization/naver`,
  GOOGLE: `${API_BASE_URL}/oauth2/authorization/google`,
};
const FINAL_REDIRECT_URI_BASE = `${API_BASE_URL}/login/oauth2/code/`;
export default function OnboardingScreen({ navigation }: any) {
  const {signIn} = useAuthStore();

  const [isModal, setIsModal] = useState(false);
  const [loginUrl, setLoginUrl] = useState("");

  const handleSkip = () => {
    navigation.replace("Tab");
  };

  const goToNextStep = () => {
    navigation.navigate("Step2");
  };
    const handleLoginPress = (provider: AuthType): void => {
    const url = OAUTH_URLS[provider];
    setLoginUrl(url);
    setIsModal(true);
  };

  const INJECTED_JAVASCRIPT = `
    (function() {
      // pre 태그 안에 있는 JSON 텍스트를 가져옵니다.
      const bodyText = document.body.innerText;
      try {
        // JSON으로 파싱을 시도합니다.
        const data = JSON.parse(bodyText);
        // 성공하면 React Native로 데이터를 메시지로 보냅니다.
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      } catch (e) {
        // JSON 파싱 실패 시 아무것도 하지 않음 (로그인 페이지 등)
      }
    })();
  `;

  const onMessage = (event: any) => {
    //debugger;
    try {
      const data = JSON.parse(event.nativeEvent.data);

      // 받아온 데이터에 accessToken이 있는지 확인 (로그인 성공 데이터인지 판별)
      if (data.accessToken && data.user) {
        setIsModal(false); // 모달을 닫습니다.
        signIn({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
        });
        // Step2로 사용자 정보와 함께 이동합니다.
        navigation.navigate("Step2");
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
      console.log("로그인 실패" , message);
      //Alert.alert("로그인 처리 실패", message);
    }
  };

const handleNavigationStateChange = (navState: WebViewNavigation): void => {
    const { url } = navState;
    //debugger;
    if (url.startsWith(DEEP_LINK_SCHEME)) {
      setIsModal(false);
      try {
        const params = new URLSearchParams(url.substring(url.indexOf('?')));
        const accessToken = params.get("accessToken");
        const refreshToken = params.get("refreshToken");
        const user = JSON.parse(decodeURIComponent(params.get("user") || 'null'));

        if (accessToken && refreshToken && user) {
          signIn({ accessToken, refreshToken, user });
          navigation.navigate("Step2");
        } else {
          throw new Error("로그인 정보가 올바르지 않습니다.");
        }
      } catch (e) {
        if (e instanceof Error) {
          console.log("로그인 실패", e.message);
        } else {
          console.log("로그인 실패", "알 수 없는 오류가 발생했습니다.");
        }
      }
    }
  };

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      className="flex-1"
    >
      <SafeAreaView className="flex-1 flex justify-center">
      <View className="justify-between items-center p-8">
        <Image
          source={logoImage}
          resizeMode="contain"
          className="w-[100px] h-[100px] rounded-full mb-2"
        />

        <Text className="font-bold text-2xl text-gray-800 mb-2">
          열달의 식탁
        </Text>
        <Text className="text-center text-gray-600">
          임신 중 건강한 영양 관리를 {"\n"}스마트하게 도와드려요
        </Text>

        <View className="flex-row justify-center w-full my-8">
          <View className="items-center">
            <View className="w-14 h-14 bg-pink-100 rounded-full justify-center items-center">
              <Image
                source={iconNutrition}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </View>
            <Text className="mt-2 text-gray-700 font-semibold">영양분석</Text>
          </View>

          <View className="items-center mx-6">
            <View className="w-14 h-14 bg-teal-50 rounded-full justify-center items-center">
              <Image
                source={iconHealth}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </View>
            <Text className="mt-2 text-gray-700 font-semibold">건강관리</Text>
          </View>

          <View className="items-center">
            <View className="w-14 h-14 bg-sky-100 rounded-full justify-center items-center">
              <Image
                source={iconBaby}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </View>
            <Text className="mt-2 text-gray-700 font-semibold">태아케어</Text>
          </View>
        </View>
      </View>
        <View className="w-full px-8">
          <SocialLoginButton provider="KAKAO" onPress={() => handleLoginPress('KAKAO')} />
          <SocialLoginButton provider="NAVER" onPress={() => handleLoginPress('NAVER')} />
          <SocialLoginButton provider="GOOGLE" onPress={() => handleLoginPress('GOOGLE')} />
          <TouchableOpacity className="mt-4" onPress={handleSkip}>
            <Text className="text-center text-gray-500">
              개발용: Tab으로 이동
            </Text>
          </TouchableOpacity>
        </View>
      
      </SafeAreaView>
      <Modal visible={isModal} onRequestClose={() => setIsModal(false)} animationType="slide">
        <SafeAreaView className="flex-1">
           <WebView
            source={{ uri: loginUrl }}
            onNavigationStateChange={handleNavigationStateChange}
            incognito
            injectedJavaScript={INJECTED_JAVASCRIPT}
            onMessage={onMessage}
            mixedContentMode="always"
            originWhitelist={["*"]}
            thirdPartyCookiesEnabled
            domStorageEnabled
          />
        </SafeAreaView>
      </Modal>
    </ImageBackground>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   title: { fontSize: 24, fontWeight: "bold" },
//   skipButton: {
//     position: "absolute",
//     bottom: 30,
//     right: 20,
//     backgroundColor: "#007AFF",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   skipText: { color: "white", fontWeight: "bold" },
// });
