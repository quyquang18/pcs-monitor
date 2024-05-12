import React, { useState, useEffect } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
  SafeAreaView
} from 'react-native';
import { getWifiInfo, start, stop } from 'react-native-esp-smartconfig';
import { TextInput, Button } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

import AppHeader from '~/components/AppHeader';
import DefaultLayout from '../DefaultLayout';
import { Colors } from '~/constants';
import { showError } from '~/utils/toastMessage';

const ACCESS_FINE_LOCATION = 'android.permission.ACCESS_FINE_LOCATION';

const checkAndroidPerm = async (callback) => {
  const already = await PermissionsAndroid.check(ACCESS_FINE_LOCATION);
  if (already) {
    callback();
  } else {
    const granted = await PermissionsAndroid.request(ACCESS_FINE_LOCATION);
    if (granted === 'granted') {
      setTimeout(() => {
        callback();
      }, 1000);
    } else {
      Alert.alert(
        'Permission denied!',
        'Location permission is needed to retrive current wifi SSID.\nPlease grant the permission by going to Settings->App Info and restart the application.'
      );
    }
  }
};

export default function ConnectionSettings({ navigation }) {
  const [apSsid, setSsid] = useState('');
  const [apBssid, setBssid] = useState('');
  const [apPass, setPass] = useState('');
  const [sending, setSending] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [wifiState, setWifiState] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 10);
    checkWifiInfo();
  };
  checkWifiInfo = () => {
    if (Platform.OS === 'android') {
      checkAndroidPerm(() => {
        getWifiInfo()
          .then(feedWifiInfo)
          .catch((error) => {
            Alert.alert('Error', error?.message);
          });
      });
    } else if (Platform.OS === 'ios') {
      // refetchNetInfo().then(feedNetInfoWifi);
      getWifiInfo()
        .then(feedWifiInfo)
        .catch((error) => {
          Alert.alert('Error', error?.message);
        });
    }
  };
  useEffect(() => {
    checkWifiInfo();
  }, []);
  const feedWifiInfo = (state) => {
    if (state.ssid === '<unknown ssid>') state.ssid = '';
    if (state.bssid === '02:00:00:00:00:00') state.bssid = '';
    setWifiState(state);
    if (state && state.isConnected && state.isWifi) {
      setSsid(state.ssid || '');
      setBssid(state.bssid || '');
    }
  };

  const handleStart = () => {
    if (!apBssid || !apSsid) {
      showError('Please check if your device has location enabled');
    } else if (!apPass) {
      showError('Password can not be blank');
    } else {
      setSending(true);
      start({
        bssid: apBssid,
        ssid: apSsid,
        password: apPass
      })
        .then((result) => {
          if (result && result.length > 0) {
            const firstDevice = result[0];
            Alert.alert(
              'Found',
              `Handshaked with device- bssid: ${firstDevice?.bssid}, ip: ${firstDevice?.ipv4}`
            );
          }
        })
        .catch((error) => {
          Alert.alert('Error', 'No device responded');
        })
        .finally(() => setSending(false));
    }
  };

  const handleCancel = () => {
    stop();
    setSending(false);
  };
  const isfeq24 = wifiState?.frequency === 2412 || 2462;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <AppHeader
        back
        // backPoint={{
        //   name: "Settings",
        //   key: "Settings",
        // }}
        title="Conection Settings"
        backgroundColor={Colors.primary}
        titleAlight={"center"}
        navigation={navigation}
      />
      <DefaultLayout isRefresh onRefresh={onRefresh} refreshing={refreshing}>
        <View style={styles.container}>
          <View style={styles.box}>
            <Text style={{ paddingRight: 22, fontSize: 16 }}>Your phone has location enabled</Text>
            {wifiState?.ssid?.length > 0 ? (
              <AntDesign name={"checkcircle"} color={"green"} size={22} />
            ) : (
              <AntDesign name={"closecircle"} color={"red"} size={22} />
            )}
          </View>
          <View style={styles.box}>
            <Text style={{ paddingRight: 22, fontSize: 16 }}>Your wifi network frequency is 2.4GHz</Text>
            {isfeq24 ? (
              <AntDesign name={"checkcircle"} color={"green"} size={22} />
            ) : (
              <AntDesign name={"closecircle"} color={"red"} size={22} />
            )}
          </View>
          <TextInput style={styles.input} label="BSSID" value={apBssid} disabled={true} />
          <TextInput style={styles.input} label="SSID" value={apSsid} disabled={true} />
          <TextInput
            style={styles.input}
            value={apPass}
            placeholder="Password"
            secureTextEntry={!showPass}
            forceTextInputFocus={false}
            right={
              <TextInput.Icon icon={!showPass ? "eye-off" : "eye"} onPress={() => setShowPass(!showPass)} />
            }
            onChangeText={setPass}
          />
          <View
            style={{
              height: 100,
              alignItems: "center",
              justifyContent: "center",
            }}
          ></View>
          <View style={styles.button}>
            {sending ? (
              <Button loading mode="contained" onPress={handleCancel}>
                CanCel
              </Button>
            ) : (
              <Button mode="contained" onPress={handleStart}>
                Start
              </Button>
            )}
          </View>
        </View>
      </DefaultLayout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    backgroundColor: '#ffffff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 12
  },
  box: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 5,
    height: 42,
    borderColor: '#ccc',
    marginTop: 12
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 16,
    width: '100%',
    paddingHorizontal: 24
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#cccccc',
    paddingHorizontal: 16,
    width: '100%',
    marginTop: 12
  },
  button: {
    width: '90%',
    marginTop: 22
  }
});
