import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import CustomModalInDown from "~/components/CustomModalInDown";
import { OpenSansText } from "~/components/StyledText";
import AppHeader from "~/components/AppHeader";
import DefaultLayout from "../DefaultLayout";
import { Colors } from "~/constants";
import ChangePassModal from './ChangePassModal';

export default function SettingsScreen({ navigation }) {
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleChangePass, setVisibleChangePasss] = useState(false);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <AppHeader back title="Settings" titleAlight={"center"} navigation={navigation} />
      <DefaultLayout fullHeight>
        <ChangePassModal visible={visibleChangePass} handleClose={() => setVisibleChangePasss(false)} />
        <CustomModalInDown visible={visibleModal} handleClose={() => setVisibleModal(false)}>
          <View style={{ height: 100, width: "100%" }}></View>
        </CustomModalInDown>
        <View style={{ height: "100%", backgroundColor: "#e5e5e5" }}>
          <TouchableOpacity style={styles.btnSetting} onPress={() => setVisibleModal("fingerprint")}>
            <Entypo name="fingerprint" color={Colors.primary} size={26} />
            <OpenSansText style={{ fontSize: 16, fontWeight: "600", marginLeft: 12 }}>
              {"Fingerprint settings"}
            </OpenSansText>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.btnSetting} onPress={() => setVisibleModal("language")}>
            <MaterialIcons name="language" color={Colors.primary} size={26} />
            <OpenSansText style={{ fontSize: 16, fontWeight: "600", marginLeft: 12 }}>
              {"Language settings"}
            </OpenSansText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSetting} onPress={() => setVisibleModal("fontSize")}>
            <MaterialIcons name="format-size" color={Colors.primary} size={26} />
            <OpenSansText style={{ fontSize: 16, fontWeight: "600", marginLeft: 12 }}>
              {"Font size settings"}
            </OpenSansText>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.btnSetting} onPress={() => setVisibleChangePasss(true)}>
            <MaterialIcons name="security" color={Colors.primary} size={26} />
            <OpenSansText style={{ fontSize: 16, fontWeight: "600", marginLeft: 12 }}>
              {"Change Password"}
            </OpenSansText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnSetting}
            onPress={() =>
              navigation.navigate({
                name: "Connection Settings",
                key: "ConnectionSetting",
              })
            }
          >
            <MaterialCommunityIcons name="cast-connected" color={Colors.primary} size={26} />
            <OpenSansText style={{ fontSize: 16, fontWeight: "600", marginLeft: 12 }}>
              {"Connection settings"}
            </OpenSansText>
          </TouchableOpacity>
        </View>
      </DefaultLayout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    backgroundColor: '#e5e5e5',
    width: '100%',
    height: '100%'
  },
  btnSetting: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 20,
    paddingLeft: 18,
    backgroundColor: '#ffff'
  }
});
