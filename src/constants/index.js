import { Dimensions } from "react-native";
import { StatusBar, Platform } from "react-native";

export const Colors = {
  primary_btn: "#aa18ea",
  primary: "#00c853",
  disabled: "#bba69d",
  input_bg: "#3f3f5f7",
  black: "#333",
  white: "#fff",
  offline: "#bfbfbf",
  stop: "#E53935",
  run: "#43A047",
  waiting: "#FB8C00",
};
export const Height_Width = {
  heightFormLogin: 450,
  heightChart: 400,
  height_header: Platform.OS === "ios" ? 70 : 40,
  height_input_search: 44,
  height_row_table: 40,
};

export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;

const getStatusBarHeight = () => {
  if (Platform.OS === "android") {
    return StatusBar.currentHeight;
  } else if (Platform.OS === "ios") {
    return 20;
  }
  return 0;
};
export const statusBarHeight = getStatusBarHeight();
