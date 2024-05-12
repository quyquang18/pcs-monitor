import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, StyleSheet } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import Toast from 'react-native-toast-message';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AppNav from '~/Navigations/AppNav';
import { AppProvider } from "~/Context/AppContext";
ScreenOrientation.unlockAsync();

function App() {
  const toastConfig = {
    error: ({ text1, text2 }) => (
      <View style={styles.wrapperToast}>
        <View style={[styles.left, { backgroundColor: "#F10E0A" }]}>
          <Fontisto style={{ alignSelf: "center" }} name="close" size={30} color="#fff" />
        </View>
        <View style={styles.right}>
          <Text style={styles.text1}>{text1}</Text>
          <Text
            style={{
              fontSize: 14,
            }}
          >
            {text2}
          </Text>
        </View>
      </View>
    ),
    success: ({ text1, text2 }) => (
      <View style={styles.wrapperToast}>
        <View style={[styles.left, { backgroundColor: "#25810F" }]}>
          <MaterialIcons style={{ alignSelf: "center" }} name="done" size={30} color="#fff" />
        </View>
        <View style={styles.right}>
          <Text style={styles.text1}>{text1}</Text>
          <Text
            style={{
              fontSize: 14,
            }}
          >
            {text2}
          </Text>
        </View>
      </View>
    ),
    info: ({ text1, text2 }) => (
      <View style={styles.wrapperToast}>
        <View style={[styles.left, { backgroundColor: "#1161C7" }]}>
          <MaterialCommunityIcons style={{ alignSelf: "center" }} name="information" size={30} color="#fff" />
        </View>
        <View style={styles.right}>
          <Text style={{ fontSize: 15 }}>{text1}</Text>
        </View>
      </View>
    ),
    warningToast: ({ text1, text2 }) => (
      <View style={styles.wrapperToast}>
        <View style={styles.left}>
          <Entypo style={{ alignSelf: "center" }} name="warning" size={30} color="#fff" />
        </View>
        <View style={styles.right}>
          <Text style={styles.text1}>{text1}</Text>
          <Text
            style={{
              fontSize: 14,
            }}
          >
            {text2}
          </Text>
        </View>
      </View>
    ),
  };

  return (
    <AppProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppNav />
        <Toast config={toastConfig} position="top" topOffset={10} />
      </GestureHandlerRootView>
    </AppProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  wrapperToast: {
    height: 60,
    width: '60%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  left: {
    paddingHorizontal: 12,
    backgroundColor: '#EEDA14',
    height: '100%',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  right: {
    backgroundColor: '#fff',
    height: '100%',
    justifyContent: 'space-evenly',
    paddingHorizontal: 12,
    minWidth: '60%'
  },
  text1: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  text2: {
    fontSize: 14
  }
});
