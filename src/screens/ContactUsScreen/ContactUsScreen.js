import React from "react";
import { SafeAreaView, View, Linking, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";

import AppHeader from "~/components/AppHeader";
import { OpenSansText } from "~/components/StyledText";
import DefaultLayout from "~/screens/DefaultLayout";

function ContactUsScreen({ navigation }) {
  const fullAddress = "38/5 Van Kiep Street Ward 3, Binh Thanh District, Ho Chí Minh City, Viet Nam";
  const url = Platform.select({
    ios: `maps:0,0?q=${fullAddress}`,
    android: `geo:0,0?q=${fullAddress}`,
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader back title="Contact us" titleAlight={"center"} navigation={navigation} />
      <DefaultLayout>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 40,
          }}
        >
          <View
            style={{
              padding: 20,
              backgroundColor: "#e5e5e5",
              borderRadius: 12,
            }}
          >
            <MaterialIcons name="quick-contacts-mail" size={62} color="#F7BD09" />
          </View>
          <OpenSansText style={{ marginTop: 12, fontSize: 18, fontWeight: "700" }}>
            QUICK CONTACT
          </OpenSansText>
        </View>
        <View style={styles.row}>
          <OpenSansText style={[styles.text, { letterSpacing: 6, fontSize: 18 }]}>0937511617</OpenSansText>
          <AntDesign
            onPress={() => Linking.openURL(`tel:0937511617`)}
            name="phone"
            size={28}
            color="#fff"
            style={[styles.icon, { backgroundColor: "#209B1A" }]}
          ></AntDesign>
        </View>
        <View style={styles.row}>
          <OpenSansText style={styles.text}>sale-luxas@.com.vn</OpenSansText>
          <FontAwesome
            onPress={() => Linking.openURL("mailto:sale-luxas@.com.vn?subject=send to Luxas&body=")}
            name="send"
            size={28}
            color="#fff"
            style={styles.icon}
          ></FontAwesome>
        </View>
        <View style={styles.row}>
          <OpenSansText style={styles.text}>
            38/5 Van Kiep Street Ward 3, Binh Thanh District, Ho Chí Minh City, Viet Nam
          </OpenSansText>
          <Entypo
            onPress={() => Linking.openURL(url)}
            name="location"
            size={28}
            color="#fff"
            style={[styles.icon, { backgroundColor: "#AFD31E" }]}
          ></Entypo>
        </View>
      </DefaultLayout>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  text: {
    fontWeight: "700",
    paddingHorizontal: 12,
    borderWidth: 1,
    width: "70%",
    borderColor: "#ccc",
    paddingVertical: 6,
    borderRadius: 5,
    backgroundColor: "#e5e5e5",
  },
  icon: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    marginLeft: 12,
    backgroundColor: "#0CC697",
  },
});
export default ContactUsScreen;
