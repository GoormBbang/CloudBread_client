/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./App.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "main-pink": "#E46592", // 메인 포인트 컬러
        "sub-green": "#89B9AD", // 보조 색상
        "accent-cyan": "#4ECDC4", // 강조 색상
        "light-pink": "#F9C4D4", // 연한 배경 핑크(보통 30%로 사용)
        "text-gray": "#E5BBB5", // 텍스트용 회색
        "btn-pink": "#F3F4F6", //취소 버튼같은 핑크
        "back-gray": "#E7E2E2", // 배경/탭/그래프 배경될 회색
        "input-gray": "#D1D5DB", //input border,placehorder 등 ..
      },
    },
  },
  plugins: [],
};
