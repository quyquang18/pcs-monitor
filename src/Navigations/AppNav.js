import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';

import AuthStack from './AuthStack';
import AppStack from './AppStack';
import Splash from '~/screens/Splash';
import { Colors } from '~/constants';
import { AppContext } from '~/Context/AppContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
function AppNav() {
  const { user, isLoading, hasViewedOnboarding } = useContext(AppContext);
  return (
    <>
      <NavigationContainer>
        {!hasViewedOnboarding ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={Splash} />
          </Stack.Navigator>
        ) : !user.isLoggedIn ? (
          <AuthStack />
        ) : (
          <AppStack role={user.role} />
        )}
      </NavigationContainer>
      <Spinner
        visible={isLoading}
        textContent={'Please wait...'}
        color={Colors.primary}
        overlayColor="rgba(25, 25, 25, 0.65)"
        textStyle={{ color: Colors.primary, marginTop: -20 }}
      />
    </>
  );
}

export default AppNav;
