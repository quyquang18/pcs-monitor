import React, { useEffect, useState, useContext } from "react";
import { SafeAreaView, Alert, View, Text } from "react-native";

import AppHeader from "~/components/AppHeader";
import { Colors } from "~/constants";
import APIService from "~/utils/APIService";
import Results from "./Results";
import Toolbar from "~/components/Toolbar";
import DefaultLayout from "../DefaultLayout";
import { showError, showSuccess } from "~/utils/toastMessage";
import { AppContext } from "~/Context/AppContext";

function DeviceScreen({ navigation }) {
  const { orientationHoz } = useContext(AppContext);
  const [devices, setDevices] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const getDevices = () =>
    APIService.getDevices((success, json) => {
      if (success && json.result) {
        setDevices(json.result.filter((e) => !e.deleted));
      }
    });

  const deleteItems = () =>
    APIService.deleteDevices(selectedItems, (success, json) => {
      if (success && json.result) {
        setSelectedItems([]);
        getDevices();
        showSuccess("Deleted user successfully");
      } else {
        showError(json.error);
      }
    });

  const viewDevice = (device) => {
    navigation.navigate("DeviceInfo", { deviceId: device?.id });
  };

  const onRefresh = () => {
    setRefreshing(true);
    getDevices();
    setTimeout(() => {
      setRefreshing(false);
    }, 300);
  };
  useEffect(() => {
    getDevices();
  }, [navigation.navigate]);
  const alertConfirmDelete = () =>
    Alert.alert("Are you sure you want to delete devices?", "You cannot restore them!", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      { text: "OK", onPress: () => deleteItems() },
    ]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <AppHeader
        title={"Device"}
        headerBg={Colors.primary}
        iconColor={Colors.black}
        menu
        titleAlight="left"
        optionalBadge={5}
        navigation={navigation}
        right="more-vertical"
        optionalBtn="bell"
      />
      <DefaultLayout isRefresh onRefresh={onRefresh} refreshing={refreshing}>
        {!orientationHoz && (
          <Toolbar
            onSearch={(text) => setSearchText(text)}
            onDelete={selectedItems && selectedItems.length > 0 ? () => alertConfirmDelete() : null}
          />
        )}
        {selectedItems.length > 0 ? (
          <Text style={{ marginBottom: 2, marginLeft: 12 }}>{`Selected: ${selectedItems.length}`}</Text>
        ) : (
          <View style={{ height: 21 }}></View>
        )}
        <Results
          data={devices}
          searchText={searchText}
          selectedIds={selectedItems}
          onSelected={(ids) => setSelectedItems(ids)}
          onView={viewDevice}
        />
      </DefaultLayout>
    </SafeAreaView>
  );
}

export default DeviceScreen;
