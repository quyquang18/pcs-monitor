import React, { useEffect, useContext, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  TextInput,
  StatusBar,
  Alert,
  TouchableOpacity
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import * as LocalAuthentication from 'expo-local-authentication';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/FontAwesome";
import * as SecureStore from "expo-secure-store";

import { Height_Width } from "~/constants";
import { windowHeight, statusBarHeight } from "~/constants";
import CustomButton from "~/components/CustomButton";
import { OpenSansText } from "~/components/StyledText";
import APIService from "~/utils/APIService";
import Settings from "~/utils/Settings";
import { Formik } from "formik";
import { AppContext } from "~/Context/AppContext";
import { Colors } from "~/constants";
import { showError } from "~/utils/toastMessage";

const LoginScreen = ({ navigation }) => {
  const [profileUser, setProfileUser] = useState();
  const [isOnFingerprint, setIsOnFingerprint] = useState(false);
  useEffect(() => {
    const init = async () => {
      const profile = await Settings.profile();
      const fingerprintStatus = await Settings.fingerprint();
      setIsOnFingerprint(fingerprintStatus);
      setProfileUser(JSON.parse(profile));
    };
    init();
  }, []);
  fetchPass = async () => {
    return await SecureStore.getItemAsync("password");
  };
  const ref_input2 = useRef();
  const { setUser, setIsLoading } = useContext(AppContext);
  const loginValidationSchema = Yup.object().shape({
    email: Yup.string().email("Please enter valid email").required("Email Address is Required"),
    password: Yup.string().required("Password is required").max(18, "The password being entered is too long"),
  });
  const handleLogin = async (values, actions) => {
    setIsLoading(true);
    APIService.signIn(values.email, values.password, async (success, json) => {
      actions.setSubmitting(false);
      if (success && json.result) {
        const { result } = json;
        if (result.locked) {
          actions.setErrors({ messageResponse: "Account is locked!" });
          return;
        }
        setUser({ isLoggedIn: true, role: json.result.role });
        Settings.setSessionKey(result.token);
        Settings.setRole(json.result.role);
        Settings.setProfile(
          JSON.stringify({
            name: json.result.name,
            id: json.result.id,
            email: json.result.email,
          })
        );

        const fetchpassFromSecureStore = await SecureStore.getItemAsync("password");
        if (!fetchpassFromSecureStore) {
          SecureStore.setItemAsync("password", JSON.stringify(values.password));
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        actions.setErrors({
          email: "",
          password: " ",
          messageResponse: "Invalid credentials!",
        });
      }
    });
  };
  const arlertComponent = (title, mess, btnTxt, btnFunc) => {
    return Alert.alert(title, mess, [{ text: btnTxt, onPress: btnFunc }]);
  };
  const handleBiometricAuth = async () => {
    if (isOnFingerprint) {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login With Biometrics",
        cancelLabel: "Cancel",
        disableDeviceFallback: true,
      });
      if (biometricAuth.success) {
        setIsLoading(true);
        let fetchpassFromSecureStore = await SecureStore.getItemAsync("password");
        fetchpassFromSecureStore = JSON.parse(fetchpassFromSecureStore);
        APIService.signIn(profileUser.email, fetchpassFromSecureStore, (success, json) => {
          if (success && json.result) {
            const { result } = json;
            if (result.locked) {
              return;
            }
            setUser({ isLoggedIn: true, role: json.result.role });
            Settings.setSessionKey(result.token);
            Settings.setRole(json.result.role);
            Settings.setProfile(
              JSON.stringify({
                name: json.result.name,
                id: json.result.id,
                email: json.result.email,
              })
            );
            setIsLoading(false);
          } else {
            setIsLoading(false);
            showError(json.error);
          }
        });
      }
    } else {
      return arlertComponent(
        "Error",
        "You have not enabled fingerprint login on this device. Go to Settings -> Fingerprint settings",
        "Ok",
        () => {}
      );
    }
  };
  const handleChangeAccount = () => {
    setProfileUser(null);
    SecureStore.setItemAsync("password", "");
    Settings.setProfile(
      JSON.stringify({
        name: "",
        id: "",
        email: "",
      })
    );
    Settings.setFingerprint(null);
  };
  const alertConfirmChangeAccount = () =>
    Alert.alert("Change Account", "Are you sure you want to change account ?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      { text: "OK", onPress: () => handleChangeAccount() },
    ]);
  let screenHeight = windowHeight - Height_Width.heightFormLogin;

  return (
    <ScrollView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <View>
        <Image
          source={require("~/assets/images/background-login.webp")}
          style={[styles.image, { height: screenHeight }]}
        />
      </View>

      <View style={styles.formWrapper}>
        <View>
          <OpenSansText style={styles.textTitle}>Login</OpenSansText>
        </View>
        <Formik
          validationSchema={loginValidationSchema}
          initialValues={{
            email: "",
            password: "",
            messageResponse: "",
          }}
          onSubmit={handleLogin}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            isValid,
            touched,
            resetForm,
            dirty,
          }) => {
            const isAccount = !!profileUser?.email;
            if (isAccount) {
              values.email = profileUser?.email || "";
            }
            return (
              <>
                <View style={[styles.inputWrapper, isAccount ? { backgroundColor: "#e5e5e5" } : {}]}>
                  <Icon name="envelope-o" size={22} color="#818181" />
                  <TextInput
                    onChangeText={handleChange("email")}
                    style={[styles.input, isAccount ? { color: "#0B7080" } : {}]}
                    placeholder="Enter Email"
                    placeholderTextColor="#818181"
                    onBlur={handleBlur("email")}
                    onSubmitEditing={() => ref_input2.current.focus()}
                    value={values.email}
                    returnKeyType="next"
                    editable={!isAccount}
                  />
                </View>
                {errors.email && touched.email && (
                  <Text
                    style={{
                      fontSize: 10,
                      color: "red",
                      alignSelf: "flex-start",
                      marginLeft: 22,
                    }}
                  >
                    {errors.email}
                  </Text>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={[
                      styles.inputWrapper,
                      isAccount && {
                        width: "80%",
                        justifyContent: "flex-start",
                      },
                    ]}
                  >
                    <Icon name="lock" size={22} color="#818181" />
                    <TextInput
                      onChangeText={handleChange("password")}
                      style={styles.input}
                      placeholder="Enter Password"
                      secureTextEntry={true}
                      placeholderTextColor="#818181"
                      onBlur={handleBlur("password")}
                      ref={ref_input2}
                      value={values.password}
                    />
                  </View>
                  {isAccount && (
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        height: 60,
                        width: "15%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => handleBiometricAuth()}
                    >
                      <Entypo
                        style={{
                          borderColor: "#ccc",
                          borderWidth: 1,
                          borderRadius: 10,
                          paddingHorizontal: 4,
                          paddingVertical: 8,
                          alignSelf: "flex-end",
                        }}
                        name="fingerprint"
                        color={Colors.primary}
                        size={40}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {errors.password && touched.password && (
                  <Text
                    style={{
                      fontSize: 10,
                      color: "red",
                      alignSelf: "flex-start",
                      marginLeft: 22,
                    }}
                  >
                    {errors.password}
                  </Text>
                )}
                {errors.messageResponse && <Text style={{ color: "red" }}>{errors.messageResponse}</Text>}
                {isAccount && (
                  <View
                    style={{
                      alignItems: "flex-end",
                      width: "100%",
                      marginRight: 12,
                      marginTop: 8,
                      marginBottom: 12,
                    }}
                  >
                    <OpenSansText
                      onPress={() => alertConfirmChangeAccount()}
                      style={{ fontSize: 16, color: "#1ED3BD" }}
                    >
                      {"Log in with another account"}
                    </OpenSansText>
                  </View>
                )}
                <View
                  style={{
                    width: "100%",
                    marginBottom: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 20,
                    marginLeft: 18,
                  }}
                >
                  <View style={{ marginRight: 6 }}>
                    <MaterialCommunityIcons name="check-decagram" size={28} color={"#0AD0EF"} />
                  </View>
                  <Text
                    style={{
                      color: "#000000",
                      fontSize: 14,
                      paddingTop: 10,
                      paddingBottom: 10,
                      lineHeight: 26,
                    }}
                  >
                    <Text>By using Luxas Monitor, you agree to our</Text>
                    <View style={{ marginLeft: 2 }}>
                      <Text
                        style={{ color: "#0A45EF", fontSize: 16 }}
                        onPress={() => navigation.navigate("PrivacyPolicyScreen")}
                      >
                        Privacy Policies
                      </Text>
                    </View>
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignSelf: "stretch",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <CustomButton
                    btn_text={"Sign In"}
                    on_press={() => handleSubmit()}
                    disabled={!isValid || !dirty}
                  />
                </View>
              </>
            );
          }}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    alignSelf: 'stretch',
    width: '100%',
    resizeMode: 'stretch'
  },
  formWrapper: {
    height: Height_Width.heightFormLogin + statusBarHeight + 20,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  textTitle: {
    fontSize: 30,
    fontWeight: '800',
    paddingTop: 12
  },
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ededed',
    width: '95%',
    borderRadius: 10,
    height: 60,
    paddingLeft: 20,
    marginTop: 15,
    marginBottom: 15
  },
  input: {
    flex: 1,
    position: 'relative',
    height: '100%',
    width: '90%',
    fontFamily: 'OpenSans-Medium',
    paddingLeft: 20
  },
  check_box: {}
});
