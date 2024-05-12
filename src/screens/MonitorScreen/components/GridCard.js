import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Card } from 'react-native-paper';

import { Colors } from '~/constants';
import { formatTime } from "~/components/formatTime";
import { showInfo } from '~/utils/toastMessage';
import { OpenSansText } from '~/components/StyledText';
import PieChart from 'react-native-pie-chart';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CheckStatusMC } from "~/utils/CheckStatusMC";
function GridCard({ data, groups, onView, onGroup }) {
  const [isShowMore, setIsShowMore] = useState(false);

  const {
    device: { name, deviceId, id },
    machineId,
    machineName,
    productModel,
    productName,
    productUnit,
    model,
    stats,
    status: lastStatus,
    alarm,
  } = data;
  const { status, productQty, numOfCycles, runtime, stopTime, waitingTime, operationRate, UPH, online } =
    stats && stats.length > 0 ? stats[0] : {};
  const { counterValue } = alarm || {};
  let statusMC = CheckStatusMC(online, status);
  const offlineTime = 24 * 3600 * 1000 - runtime - stopTime;
  const pies = [runtime || 0, stopTime || 0, waitingTime, offlineTime || 1];
  const colorSet = [Colors.run, Colors.stop, Colors.waiting, Colors.offline];
  const percents = {
    fill: true,
    datasets: {
      data: pies,
      backgroundColor: colorSet,
      borderWidth: 1,
      borderColor: "#fff",
      hoverBorderColor: "#fff",
    },
  };
  const settingProduct = alarm ? counterValue : 0;
  const productionCycles = numOfCycles || 0;
  const actualProduct = productQty || 0;
  const totalProduction = Number(settingProduct) * productionCycles + Number(actualProduct);

  const _onClick = () => {
    if (stats?.length === 0) {
      showInfo("No There is no data for the device");
    } else {
      onView(id);
    }
  };
  return (
    <View style={{ flex: 1, marginTop: 12 }}>
      <Card style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 16 }}>
        <View>
          <View style={styles.wrapperText}>
            <OpenSansText style={styles.text1}>Machine name:</OpenSansText>
            <OpenSansText style={[styles.text2, { fontWeight: "700", fontSize: 14 }]}>{`${
              machineName || "N/A"
            } (${machineId || "N/A"})`}</OpenSansText>
          </View>
          <View style={styles.wrapperText}>
            <OpenSansText style={styles.text1}>Machine Model:</OpenSansText>
            <OpenSansText style={styles.text2}>{`${model || "N/A"}`}</OpenSansText>
          </View>
          {isShowMore && (
            <>
              <View style={styles.wrapperText}>
                <OpenSansText style={styles.text1}>Device:</OpenSansText>
                <OpenSansText style={[styles.text2]}>{`${name || deviceId}`}</OpenSansText>
              </View>

              <View style={styles.wrapperText}>
                <OpenSansText style={styles.text1}>Machine Number:</OpenSansText>
                <OpenSansText style={styles.text2}>{`${machineId || "N/A"}`}</OpenSansText>
              </View>
              <View style={styles.wrapperText}>
                <OpenSansText style={styles.text1}>Product Name:</OpenSansText>
                <OpenSansText style={styles.text2}>{`${productModel || "N/A"}`}</OpenSansText>
              </View>
              <View style={styles.wrapperText}>
                <OpenSansText style={styles.text1}>Product Model:</OpenSansText>
                <OpenSansText style={styles.text2}>{`${productName || "N/A"}`}</OpenSansText>
              </View>
              <View style={styles.wrapperText}>
                <OpenSansText style={styles.text1}>Number of cycles:</OpenSansText>
                <OpenSansText style={styles.text2}>{`${productionCycles}`}</OpenSansText>
              </View>
              <View style={styles.wrapperText}>
                <OpenSansText style={styles.text1}>Actual product Qty:</OpenSansText>
                <OpenSansText style={styles.text2}>{`${actualProduct} ${productUnit || ""}`}</OpenSansText>
              </View>
              <View style={styles.wrapperText}>
                <OpenSansText style={styles.text1}>Setting product Qty:</OpenSansText>
                <OpenSansText style={styles.text2}>{`${settingProduct} ${productUnit || ""}`}</OpenSansText>
              </View>
              <View style={styles.wrapperText}>
                <OpenSansText style={styles.text1}>Total Actual Production:</OpenSansText>
                <OpenSansText style={styles.text2}>{`${totalProduction} ${productUnit || ""}`}</OpenSansText>
              </View>
              <View style={styles.wrapperText}>
                <OpenSansText style={styles.text1}>Operation rate %:</OpenSansText>
                <OpenSansText style={styles.text2}>{`${(operationRate || 0).toFixed(2)}`}</OpenSansText>
              </View>
              <View style={styles.wrapperText}>
                <OpenSansText style={styles.text1}>TaktTime:</OpenSansText>
                <OpenSansText style={styles.text2}>{` ${UPH || 0} s/p`}</OpenSansText>
              </View>
              <View style={styles.wrapperText}>
                <OpenSansText style={styles.text1}>M/C Runtime:</OpenSansText>
                <OpenSansText style={styles.text2}>{`${runtime ? formatTime(runtime) : 0}`}</OpenSansText>
              </View>
              <View style={styles.wrapperText}>
                <OpenSansText style={styles.text1}>M/C Waiting:</OpenSansText>
                <OpenSansText style={styles.text2}>{`${
                  waitingTime ? formatTime(waitingTime) : 0
                }`}</OpenSansText>
              </View>
              <View style={styles.wrapperText}>
                <OpenSansText style={styles.text1}>M/C Stop time:</OpenSansText>
                <OpenSansText style={styles.text2}>{`${stopTime ? formatTime(stopTime) : 0}`}</OpenSansText>
              </View>
            </>
          )}
        </View>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            marginTop: 8,
            paddingBottom: 6,
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
          }}
        >
          <OpenSansText style={[styles.text1, { marginRight: 6, width: "auto" }]}>
            Belong to group:
          </OpenSansText>
          {groups?.map((e, index) => (
            <TouchableOpacity
              key={index}
              style={{
                minWidth: 60,
                height: 20,
                paddingHorizontal: 4,
                backgroundColor: e.color,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4,
                marginLeft: 4,
              }}
              onPress={() => onGroup(e)}
            >
              <Text>{e.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "#0CC697",
            width: 52,
            alignSelf: "flex-end",
            alignItems: "center",
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
          onPress={() => setIsShowMore(!isShowMore)}
        >
          <MaterialIcons name={isShowMore ? "expand-less" : "expand-more"} size={32} color="#fff" />
        </TouchableOpacity>
        <View
          style={{
            paddingTop: 12,
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: "35%" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 6,
              }}
            >
              <OpenSansText
                style={{
                  marginLeft: 6,
                  width: "60%",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                Device
              </OpenSansText>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 20,
                  backgroundColor: online === "ONLINE" ? "#34C90C" : "#C92A0C",
                }}
              ></View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 4,
                marginTop: 4,
              }}
            >
              <OpenSansText
                style={{
                  marginLeft: 6,
                  width: "60%",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                M/C
              </OpenSansText>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 20,
                  backgroundColor: statusMC.color,
                }}
              ></View>
            </View>
          </View>

          <View
            style={{
              marginRight: 22,
              flexDirection: "row",
              alignItems: "center",
              width: "70%",
            }}
          >
            <View style={{ width: "50%" }}>
              <View
                style={{
                  position: "absolute",
                  zIndex: 1,
                  top: "-30%",
                  left: "29%",
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Text>00:00:00</Text>
                  <FontAwesome style={{ marginVertical: -10 }} name="caret-down" size={24} />
                  <View style={{ width: 1, height: 20, backgroundColor: "#000" }} />
                </View>
                <View
                  style={{
                    position: "absolute",
                    top: 45,
                    left: "20%",
                    zIndex: 1,
                    transform: [{ rotate: "230deg" }],
                  }}
                >
                  <FontAwesome name="rotate-right" size={38} />
                </View>
              </View>
              <PieChart
                style={{ alignSelf: "center" }}
                widthAndHeight={80}
                series={percents.datasets.data}
                sliceColor={percents.datasets.backgroundColor}
                coverRadius={0.5}
                coverFill={"#FFF"}
              />
            </View>
            <View
              style={{
                width: "40%",
              }}
            >
              <Text
                style={{
                  paddingVertical: 2,
                  backgroundColor: Colors.run,
                  textAlign: "center",
                  fontSize: 12,
                  color: "#fff",
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              >
                RUN
              </Text>
              <Text
                style={{
                  paddingVertical: 2,
                  backgroundColor: Colors.waiting,
                  textAlign: "center",
                  fontSize: 12,
                  color: "#fff",
                }}
              >
                WAITTING
              </Text>
              <Text
                style={{
                  paddingVertical: 2,
                  backgroundColor: Colors.stop,
                  textAlign: "center",
                  fontSize: 12,
                  color: "#fff",
                }}
              >
                STOP
              </Text>
              <Text
                style={{
                  paddingVertical: 2,
                  backgroundColor: Colors.offline,
                  textAlign: "center",
                  fontSize: 12,
                  color: "#fff",
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }}
              >
                OFF
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={_onClick}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              flexDirection: "row",
              backgroundColor: "#07CAFA",
              width: "40%",
              alignSelf: "center",
              alignItems: "center",
              paddingVertical: 6,
              marginTop: 18,
              borderRadius: 5,
            }}
          >
            <MaterialIcons name={"preview"} size={22} color="#000" />
            <Text style={{ fontSize: 14, marginLeft: 6 }}>View Detail</Text>
          </View>
        </TouchableOpacity>
      </Card>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapperText: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
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
export default GridCard;
