import React, { useState } from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import CustomButton from "~/components/CustomButton";
import APIService from "~/utils/APIService";
import { OpenSansText } from "~/components/StyledText";
import { useEffect } from "react";

const widthScreen = Dimensions.get("window").width;

function AssignToGroup({ devices, assignGroup, onFetch, onClose }) {
  const [dataDevices, setDataDevices] = useState([]);
  const buildDataDevice = () => {
    const data = devices.filter((d) => {
      return d.productModel === assignGroup.productModel && d.model === assignGroup.model;
    });
    return data;
  };
  useEffect(() => {
    const dataBuild = buildDataDevice();
    setDataDevices(dataBuild);
  }, [devices]);
  const initSelected = assignGroup.devices?.map((e, index) => {
    const selected = devices.find((d) => d.device.id === e.id);
    return selected;
  });
  const [selectedDevices, setSelectedDevices] = useState(initSelected);

  const selectDevice = (device) => {
    const selected = selectedDevices.find((d) => d.device.id === device.device.id);
    if (selected) selectedDevices.splice(selectedDevices.indexOf(selected), 1);
    else selectedDevices.push(device);
    setSelectedDevices([...selectedDevices]);
  };

  const onAssign = async () => {
    await new Promise((resolve) => {
      const deviceIds = selectedDevices.map((e) => e.device.id);
      APIService.assignGroup(assignGroup?.id, deviceIds, (success, json) => {
        resolve(json);
      });
    });
    onFetch();
    onClose();
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ccc",
        padding: 12,
        width: widthScreen - 100,
        alignSelf: "flex-end",
      }}
    >
      <View style={{ paddingBottom: 6, borderBottomWidth: 1, marginBottom: 12 }}>
        <OpenSansText style={{ fontSize: 16, fontWeight: "600", alignSelf: "center" }}>
          Assign Device To Group
        </OpenSansText>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: 6,
          }}
        >
          <Text>{`Name: ${assignGroup.name}`}</Text>
          <Text style={{ marginLeft: 16 }}>{`Model: ${assignGroup.model}`}</Text>
          <Text>{`Product Model ${assignGroup.productModel}`}</Text>
        </View>
      </View>
      <KeyboardAwareScrollView>
        <View>
          {dataDevices?.map((e, index) => {
            const selected = selectedDevices.find((d) => d.device.id === e.device.id);
            return (
              <TouchableOpacity
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 6,
                  backgroundColor: "#10B5BD",
                  minHeight: 40,
                  marginBottom: 8,
                  borderRadius: 6,
                }}
                onPress={() => selectDevice(e)}
              >
                <Text
                  style={{ fontSize: 13, minWidth: "90%" }}
                >{`${e.device?.name} - ${e.machineName}(${e.machineId})`}</Text>
                {selected && <FontAwesome name="check-circle" size={22} color="green" />}
              </TouchableOpacity>
            );
          })}
        </View>
      </KeyboardAwareScrollView>
      <View style={{ bottom: 0, paddingTop: 12 }}>
        <CustomButton btn_text="Assign" on_press={onAssign} />
      </View>
    </View>
  );
}

export default AssignToGroup;
