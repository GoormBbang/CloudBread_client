import React from 'react';
import { Pressable, Text, Image, View } from 'react-native';

export type AuthType = "KAKAO" | "NAVER" | "GOOGLE";
type SocialLoginButtonProps = {
  provider: AuthType;
  onPress?: () => void;
}
const providerConfig = {
  KAKAO: {
    logo: require('../../../assets/image/signup/KakaoLogo.png'), 
    className: 'bg-yellow-400',
    textColor: 'text-black',
    text: '카카오로 시작하기',
  },
  NAVER: {
    logo: require('../../../assets/image/signup/NaverLogo.png'), 
    className: 'bg-[#03C75A]',
    textColor: 'text-white',
    text: '네이버로 시작하기',
  },
  GOOGLE: {
    logo: require('../../../assets/image/signup/GoogleLogo.png'), 
    className: 'bg-white border border-gray-200',
    textColor: 'text-black',
    text: 'Google로 시작하기',
  },
};

const SocialLoginButton = ({ provider, onPress } : SocialLoginButtonProps) => {
  const config = providerConfig[provider];
  if (!config) return null;

  return (
    <Pressable
      className={`
        flex-row items-center w-full py-3.5 px-5 rounded-xl mb-3
        ${config.className}
        active:opacity-70
      `}
      onPress={onPress}
    >
      <Image source={config.logo} className="w-6 h-6 mr-6" />
      <View className="flex-1 items-center">
        <Text className={`text-base font-semibold ${config.textColor}`}>
          {config.text}
        </Text>
      </View>
    </Pressable>
  );
};

export default SocialLoginButton;