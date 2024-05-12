import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CustomDrawer from '../components/CustomDrawer';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from '~/constants';

import DashBoardScreen from '~/screens/DashBoardScreen';
import MonitorScreen from '~/screens/MonitorScreen';
import DeviceScreen from '~/screens/DeviceScreen';
import ReportScreen from '~/screens/ReportScreen';
import UsersScreen from '~/screens/UsersScreen';
import DeviceInfoScreen from '~/screens/DeviceScreen/DeviceInfoScreen';
import ProFileScreen from '~/screens/UsersScreen/ProFileScreen';
import FeedbackScreen from '~/screens/FeedbackScreen';
import ContactUsScreen from '~/screens/ContactUsScreen';
import HelpScreen from '~/screens/HelpScreen';
import SettingsScreen from '~/screens/SettingsScreen';
import ConnectionSettings from '~/screens/ConnectionSettings';
import LoginScreen from '~/screens/LoginScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01
  }
};
const MainStack = ({ role }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {role === "ADMIN" ? (
        <>
          <Stack.Screen name="AdminStack" component={AdminStack} />
          <Stack.Screen name="DeviceInfo" component={DeviceInfoScreen} />
          <Stack.Screen name="Profile" component={ProFileScreen} />
          <Stack.Screen name="Feedback" component={FeedbackScreen} />
          <Stack.Screen name="ContactUs" component={ContactUsScreen} />
          <Stack.Screen name="Help" component={HelpScreen} />

          <Stack.Screen
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
            name="Connection Settings"
            component={ConnectionSettings}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="UserStack" component={UserStack} />
          <Stack.Screen name="Profile" component={ProFileScreen} />
          <Stack.Screen name="DeviceInfo" component={DeviceInfoScreen} />
          <Stack.Screen name="Feedback" component={FeedbackScreen} />
          <Stack.Screen name="ContactUs" component={ContactUsScreen} />
          <Stack.Screen name="Help" component={HelpScreen} />
          <Stack.Screen name="Connection Settings" component={ConnectionSettings} />
        </>
      )}
    </Stack.Navigator>
  );
};
const AdminStack = ({ role }) => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: Colors.primary_btn,
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#333",
        drawerLabelStyle: {
          marginLeft: -25,
          fontFamily: "Roboto-Medium",
          fontSize: 15,
        },
      }}
    >
      <Drawer.Screen
        name="DashBoard"
        component={DashBoardScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="view-dashboard-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Monitor"
        component={MonitorScreen}
        options={{
          drawerIcon: ({ color }) => <MaterialIcons name="computer" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Device"
        component={DeviceScreen}
        options={{
          drawerIcon: ({ color }) => <Feather name="hard-drive" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Report"
        component={ReportScreen}
        options={{
          drawerIcon: ({ color }) => <Feather name="bar-chart" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Users"
        component={UsersScreen}
        options={{
          drawerIcon: ({ color }) => <Feather name="users" size={22} color={color} />,
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color }) => <Feather name="settings" size={22} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
};
const UserStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: Colors.primary_btn,
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#333",
        drawerLabelStyle: {
          marginLeft: -25,
          fontFamily: "OpenSans-Medium",
          fontSize: 15,
        },
      }}
    >
      <Drawer.Screen
        name="Monitor"
        component={MonitorScreen}
        options={{
          drawerIcon: ({ color }) => <MaterialIcons name="computer" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Device"
        component={DeviceScreen}
        options={{
          drawerIcon: ({ color }) => <Feather name="hard-drive" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Report"
        component={ReportScreen}
        options={{
          drawerIcon: ({ color }) => <Feather name="bar-chart" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color }) => <Feather name="settings" size={22} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default MainStack;
