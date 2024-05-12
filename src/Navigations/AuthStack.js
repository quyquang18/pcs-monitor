import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from '~/screens/LoginScreen';
import PrivacyPolicyScreen from '~/screens/PrivacyPolicyScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
