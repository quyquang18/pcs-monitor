import React from 'react';
import { View, Dimensions, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import * as Device from 'expo-device';
import { RadioButton, Switch } from 'react-native-paper';
import * as LocalAuthentication from 'expo-local-authentication';
import { OpenSansText } from '~/components/StyledText';
import Settings from '~/utils/Settings';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';
const widthScreen = Dimensions.get('window').width;

export default function CustomModalInDown({ visible, handleClose }) {
  const [checkedLanguage, setCheckedLanguage] = React.useState('english');
  const [checkedfontSize, setCheckedfontSize] = React.useState('small');
  const [isOnFingerprint, setIsOnFingerprint] = React.useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      const fingerprintStatus = await Settings.fingerprint();
      setIsOnFingerprint(fingerprintStatus);
    };
    fetchData();
    return () => {};
  }, []);

  React.useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  });
  const fallBackToDefaultAuth = () => {};
  const arlertComponent = (title, mess, btnTxt, btnFunc) => {
    return Alert.alert(title, mess, [{ text: btnTxt, onPress: btnFunc }]);
  };
  const handleBiometricAuth = async () => {
    let fetchUUID = await SecureStore.getItemAsync("secure_deviceid");
    if (!fetchUUID) {
      let uuid = uuidv4();
      await SecureStore.setItemAsync("secure_deviceid", JSON.stringify(uuid));
      fetchUUID = await SecureStore.getItemAsync("secure_deviceid");
    }
    const isbiomectricAvailable = await LocalAuthentication.hasHardwareAsync();
    if (!isbiomectricAvailable) {
      return arlertComponent("Please Enter Your Password", "Biometric Auth Not Supported", "Ok", () =>
        fallBackToDefaultAuth()
      );
    }
    let supportedBiometrics;
    if (isbiomectricAvailable)
      supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) {
      return arlertComponent("Biometric Record Not Found", "Please Login With Password", "Ok", () =>
        fallBackToDefaultAuth()
      );
    }

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login With Biometrics",
      cancelLabel: "Cancel",
      disableDeviceFallback: true,
    });
    if (biometricAuth.success) {
      if (!isOnFingerprint) {
        setIsOnFingerprint(true);
        await Settings.setFingerprint(true);
      } else {
        setIsOnFingerprint(false);
        await Settings.setFingerprint(false);
      }
    }
  };

  return (
    <Modal
      style={{ margin: 0, justifyContent: "flex-end" }}
      isVisible={!!visible}
      onBackdropPress={handleClose}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      backdropTransitionInTiming={0}
      backdropTransitionOutTiming={0}
      avoidKeyboard={true}
      coverScreen={true}
      hideModalContentWhileAnimating={true}
      useNativeDriver={true}
    >
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <OpenSansText
            style={{
              fontWeight: "600",
              fontSize: 16,
              marginVertical: 12,
              marginTop: Platform.OS === "ios" ? 20 : 0,
            }}
          >
            {visible === "language" && "Change Language"}
            {visible === "fingerprint" && "Fingerprint settings"}
            {visible === "fontSize" && "Font size"}
          </OpenSansText>
          <OpenSansText onPress={handleClose} style={{ color: "#0B8073" }}>
            Close
          </OpenSansText>
        </View>
        {/* {visible === 'language' && (
          <RadioButton.Group
            onValueChange={(value) => setCheckedLanguage(value)}
            value={checkedLanguage}
          >
            <View style={styles.row}>
              <RadioButton value="vietnamese" />
              <OpenSansText>Vietnamese</OpenSansText>
            </View>
            <View style={styles.row}>
              <RadioButton value="english" />
              <OpenSansText>English</OpenSansText>
            </View>
          </RadioButton.Group>
        )} */}
        {visible === "fingerprint" && (
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
            >
              {isBiometricSupported ? (
                <>
                  <OpenSansText>Log in with fingerprint</OpenSansText>
                  <Switch value={isOnFingerprint} onValueChange={() => handleBiometricAuth()} />
                </>
              ) : (
                <OpenSansText>Fingerprint login function is not supported on this device</OpenSansText>
              )}
            </View>
          </View>
        )}
        {/* {visible === 'fontSize' && (
          <RadioButton.Group
            onValueChange={(value) => setCheckedfontSize(value)}
            value={checkedfontSize}
          >
            <View style={styles.row}>
              <RadioButton value="small" />
              <OpenSansText>Small font size</OpenSansText>
            </View>
            <View style={styles.row}>
              <RadioButton value="normal" />
              <OpenSansText>Normal font size</OpenSansText>
            </View>
            <View style={styles.row}>
              <RadioButton value="large" />
              <OpenSansText>Large font size</OpenSansText>
            </View>
          </RadioButton.Group>
        )} */}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    alignSelf: 'flex-end',
    width: widthScreen,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    padding: 12,
    borderTopRightRadius: 10
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center'
  }
});
