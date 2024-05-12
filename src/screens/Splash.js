import React, { useCallback, useContext } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useFonts } from 'expo-font';

import { Colors } from '~/constants';
import * as SplashScreen from 'expo-splash-screen';
import { AppContext } from '~/Context/AppContext';

SplashScreen.preventAutoHideAsync();

const Splash = ({ navigation }) => {
  const { setHasViewedOnboarding } = useContext(AppContext);
  const [fontsLoaded] = useFonts({
    "OpenSans-Bold": require("~/assets/fonts/android/OpenSans-Bold.ttf"),
    "OpenSans-Medium": require("~/assets/fonts/android/OpenSans-Medium.ttf"),
    "OpenSans-NormalItalic": require("~/assets/fonts/android/OpenSans-NormalItalic.ttf"),
    "OpenSans-Normal": require("~/assets/fonts/android/OpenSans-Normal.ttf"),
    "OpenSans-SemiBold": require("~/assets/fonts/android/OpenSans-SemiBold.ttf"),
    "Roboto-Bold": require("~/assets/fonts/android/Roboto-Bold.ttf"),
    "Roboto-Medium": require("~/assets/fonts/android/Roboto-Medium.ttf"),
    "Roboto-Regular": require("~/assets/fonts/android/Roboto-Regular.ttf"),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
      setHasViewedOnboarding(true);
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
  }
  return <View onLayout={onLayoutRootView} style={styles.container}></View>;
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});
