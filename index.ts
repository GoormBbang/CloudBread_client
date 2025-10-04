import { registerRootComponent } from "expo";
import { Platform } from "react-native";

// 웹에서만 CSS 로드
if (Platform.OS === 'web') {
  require('./app.css');
}

import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
