import React, { useEffect, useState, useContext } from "react";
import { View, ImageBackground, Text, TouchableOpacity, Alert } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Avatar } from "react-native-paper";

import Settings from "../utils/Settings";
import { OpenSansText } from "./StyledText";
import { AppContext } from "~/Context/AppContext";

const CustomDrawer = (props) => {
  const [useProfile, setUserProfile] = useState();
  const { setUser } = useContext(AppContext);

  const logout = () => {
    setUser({ isLoggedIn: false, role: "" });
  };

  useEffect(() => {
    const init = async () => {
      const profile = await Settings.profile();
      if (profile) {
        setUserProfile(JSON.parse(profile));
      }
    };
    init();
  }, []);

  const alertConfirmLogout = () =>
    Alert.alert("Dialog", "Do you want to log out ?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      { text: "OK", onPress: () => logout() },
    ]);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("~/assets/images/menu-bg.webp")}
        style={{ padding: 15, alignItems: "center" }}
      >
        <Avatar.Text
          size={52}
          label={useProfile?.name[0]}
          color={"#fff"}
          style={{ backgroundColor: "#BCC118" }}
          labelStyle={{ fontFamily: "OpenSans-SemiBold", fontSize: 32 }}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            paddingVertical: 2,
            marginTop: 16,
            paddingHorizontal: 12,
            borderRadius: 5,
            zIndex: 1,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderStyle: "dotted",
            borderColor: "#ccc",
          }}
          onPress={() =>
            props.navigation.navigate("Profile", {
              userId: useProfile.id,
            })
          }
        >
          <MaterialCommunityIcons name="gesture-tap-button" color={"#fff"} size={22} />
          <OpenSansText
            style={{
              color: "#fff",
              fontSize: 18,
              marginBottom: 5,
              fontWeight: "700",
              marginLeft: 5,
            }}
          >
            {useProfile?.name}
          </OpenSansText>
        </TouchableOpacity>
      </ImageBackground>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            marginTop: 0,
          }}
        >
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          padding: 15,
          borderTopWidth: 1,
          borderTopColor: "#ccc",
        }}
      >
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("ContactUs", {
              userId: useProfile?.id,
            })
          }
          style={{ paddingVertical: 15 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign name="contacts" size={22} />
            <Text
              style={{
                fontSize: 15,
                marginLeft: 5,
                fontFamily: "Roboto-Medium",
              }}
            >
              Contact us
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alertConfirmLogout()} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="exit-outline" size={22} />
            <Text
              style={{
                fontSize: 15,
                marginLeft: 5,
                fontFamily: "Roboto-Medium",
              }}
            >
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;
