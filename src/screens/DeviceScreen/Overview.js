import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

import { Roles } from '~/utils/Settings';
import { OpenSansText } from '~/components/StyledText';
import CustomButton from '~/components/CustomButton';
import AssignOwner from './AssignOwner';
import EditDevice from './EditDevice';
import { AppContext } from '~/Context/AppContext';
import { CheckStatusMC } from "~/utils/CheckStatusMC";

function Overview({ data, handleRefeshData }) {
  const { user } = useContext(AppContext);
  const [visibleAssign, setVisibleAssign] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const assigned = data?.company?.role !== Roles.ADMIN;
  const isAdmin = user.role === Roles.ADMIN;

  const onAssign = () => {
    setVisibleAssign(true);
  };

  const onEdit = (setting) => {
    setVisibleEdit(true);
    setSelectedSetting(setting);
  };
  const renderSetting = (setting, index) => {
    const {
      settingId,
      boardId,
      productModel,
      productName,
      productUnit,
      machineId,
      machineName,
      model,
      process,
      workshop,
    } = setting;
    return (
      <View key={index}>
        <OpenSansText style={{ fontWeight: 700, fontSize: 18, alignSelf: "center" }}>Settings</OpenSansText>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Setting Id:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${settingId || ""}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Device Id:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${boardId || ""}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Product Model:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${productModel || ""}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Product Name:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${productName || ""}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Product Unit:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${productUnit || ""}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Machine Number:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${machineId || ""}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Machine Name:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${machineName || ""}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Machine Model:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${model || ""}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Process:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${process || ""}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Workshop:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${workshop || ""}`}</OpenSansText>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: 12,
          }}
        >
          <CustomButton
            style={{
              borderRadius: 5,
              width: "40%",
              backgroundColor: "#B3B625",
              height: 42,
            }}
            btn_text="Edit"
            on_press={() => onEdit(setting)}
          />
          {isAdmin ? (
            <CustomButton
              style={{ borderRadius: 5, width: "40%", height: 42 }}
              btn_text="Assign"
              on_press={() => onAssign()}
            />
          ) : (
            <View></View>
          )}
        </View>
      </View>
    );
  };
  const handleEditSuccess = () => {
    setVisibleEdit(false);
    handleRefeshData();
  };
  const handleAssignSuccess = () => {
    setVisibleAssign(false);
    handleRefeshData();
  };
  return (
    <Card
      mode="container"
      style={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        backgroundColor: "#ccc",
        minHeight: 580,
      }}
    >
      <Card.Content>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Name:</OpenSansText>
          <OpenSansText style={styles.text2}>{data?.name || ""}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Board Id:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${data?.deviceId || ""}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Company:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${assigned ? data?.company?.name : "Luxas"}`}</OpenSansText>
        </View>
        {!data?.settings || data?.settings.length === 0
          ? renderSetting({})
          : data?.settings?.map((setting, index) => renderSetting(setting, index))}
      </Card.Content>
      <AssignOwner
        visible={visibleAssign}
        device={data}
        handleClose={() => setVisibleAssign(false)}
        assignSuccess={handleAssignSuccess}
      />
      <EditDevice
        visible={visibleEdit}
        device={data}
        setting={selectedSetting}
        handleClose={() => setVisibleEdit(false)}
        updateSuccess={handleEditSuccess}
      />
    </Card>
  );
}
const styles = StyleSheet.create({
  wrapperText: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#9E9E75'
  },
  text1: {
    fontWeight: 600,
    marginRight: 12,
    width: '50%',
    fontSize: 14
  },
  text2: {
    fontSize: 13
  }
});
export default Overview;
