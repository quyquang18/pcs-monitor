import React, { useEffect, useState, memo, useContext } from "react";
import moment from "moment";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { Table, TableWrapper, Cell } from "react-native-table-component";
import _ from "lodash";

import { OpenSansText } from "~/components/StyledText";
import { formatTime } from "~/components/formatTime";
import GridCard from "./GridCard";
import { AppContext } from "~/Context/AppContext";
import { CheckStatusMC } from "~/utils/CheckStatusMC";

const arrWidthColTable = [60, 60, 60, 85, 110, 90, 110, 110, 70, 80, 80, 80, 60, 60, 80, 80, 80, 80, 80, 80];

function Results({ data, groups, startTime, endTime, listView, navigation, onGroup }) {
  const { orientationHoz } = useContext(AppContext);
  const [records, setRecords] = useState([]);
  useEffect(() => {
    if (_.isEqual(data, records)) {
      return;
    } else {
      setRecords(data);
    }
  }, [data]);

  const onView = (id) => {
    navigation.navigate("DeviceInfo", { deviceId: id });
  };

  return (
    <View>
      {listView && (
        <ScrollView style={{ flex: 1 }} horizontal>
          <Table>
            <TableWrapper style={[styles.row, { height: 60, backgroundColor: "#ccc" }]}>
              {[
                {
                  title: "Id No",
                  sortable: true,
                  getItem: (item) => item?.id,
                },
                {
                  title: "Start Time",
                  sortable: false,
                },
                {
                  title: "End Time",
                  sortable: false,
                },
                {
                  title: "Date",
                  sortable: false,
                },
                {
                  title: "Device Name",
                  sortable: false,
                },
                {
                  title: "Product Model",
                  sortable: false,
                },
                {
                  title: "Product Name",
                  sortable: false,
                },
                {
                  title: "MC/Name/Line",
                  sortable: false,
                },
                {
                  title: "MC ID/Line ID",
                  sortable: false,
                },
                {
                  title: "MC Model",
                  sortable: false,
                },
                {
                  title: "Status",
                  sortable: false,
                },
                {
                  title: "Production",
                  sortable: false,
                },
                {
                  title: "Cycles",
                  sortable: false,
                },
                {
                  title: "Setting Product Qty",
                  sortable: false,
                },
                {
                  title: "Total Actual Production",
                  sortable: false,
                },
                {
                  title: "Machine Runtime",
                  sortable: false,
                },
                {
                  title: "Machine Waiting",
                  sortable: false,
                },
                {
                  title: "Machine Stop",
                  sortable: false,
                },
                {
                  title: "Operation Rate %",
                  sortable: false,
                },
                {
                  title: "TaktTime",
                  sortable: false,
                },
              ].map((item, index) => (
                <Cell
                  key={index}
                  data={
                    <View
                      style={{
                        flexDirection: "row",
                        height: "100%",
                        alignItems: "center",
                        paddingHorizontal: 6,
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ fontSize: 13 }}>{item.title}</Text>
                    </View>
                  }
                  style={{ width: arrWidthColTable[index], height: 60 }}
                />
              ))}
            </TableWrapper>
            {records.map((item, index) => {
              const date = moment(item.createdAt || item.created_at).format("DD/MM/YYYY");
              const {
                machineId,
                machineName,
                productModel,
                productName,
                productUnit,
                model,
                stats,
                alarm,
                cycles,
                device: { name },
              } = item;
              const { productQty, numOfCycles, runtime, stopTime, waitingTime, online, status, tackTime } =
                stats && stats.length > 0 ? stats[0] : {};
              const { counterValue } = alarm || {};
              let StatusMC = CheckStatusMC(online, status);
              const start = moment(startTime).format("HH:mm");
              const end = moment(endTime).format("HH:mm");
              const rangeTime = new Date(endTime).getTime() - new Date(startTime).getTime();
              const operationRate = rangeTime === 0 ? 0 : (runtime * 100) / rangeTime;
              const settingProduct = alarm ? counterValue : 0;
              const productionCycles = numOfCycles || 0;
              const actualProduct = productQty || 0;
              const totalProduction = Number(settingProduct) * productionCycles + Number(actualProduct);
              return (
                <TableWrapper style={[styles.row]} key={index}>
                  <Cell style={[{ width: arrWidthColTable[0] }, styles.cell]} data={index + 1} />
                  <Cell
                    style={[{ width: arrWidthColTable[1] }, styles.cell]}
                    data={<Text style={{ fontSize: 12 }}>{start}</Text>}
                  />
                  <Cell
                    style={[{ width: arrWidthColTable[2] }, styles.cell]}
                    data={<Text style={{ fontSize: 12 }}>{end}</Text>}
                  />
                  <Cell
                    style={[{ width: arrWidthColTable[3] }, styles.cell]}
                    data={<Text style={{ fontSize: 12 }}>{date}</Text>}
                  />
                  <Cell
                    style={[{ width: arrWidthColTable[4] }, styles.cell]}
                    data={<Text style={{ fontSize: 12 }}>{name}</Text>}
                  />
                  <Cell
                    style={[{ width: arrWidthColTable[5] }, styles.cell]}
                    data={<Text style={{ fontSize: 12 }}>{productModel}</Text>}
                  />
                  <Cell
                    style={[{ width: arrWidthColTable[6] }, styles.cell]}
                    data={<Text style={{ fontSize: 12 }}>{productName}</Text>}
                  />
                  <Cell
                    style={[{ width: arrWidthColTable[7] }, styles.cell]}
                    data={<Text style={{ fontSize: 12 }}>{machineName}</Text>}
                  />
                  <Cell
                    style={[{ width: arrWidthColTable[8] }, styles.cell]}
                    data={<Text style={{ fontSize: 12 }}>{machineId}</Text>}
                  />
                  <Cell
                    style={[{ width: arrWidthColTable[9] }, styles.cell]}
                    data={<Text style={{ fontSize: 12 }}>{model}</Text>}
                  />
                  <Cell
                    style={[{ width: arrWidthColTable[10] }, styles.cell]}
                    data={<OpenSansText style={{ color: StatusMC.color }}>{StatusMC.onlineMC}</OpenSansText>}
                  />
                  <Cell
                    style={[{ width: arrWidthColTable[11] }, styles.cell]}
                    data={<Text style={{ fontSize: 12 }}>{`${productQty || 0} ${productUnit || ""}`}</Text>}
                  />
                  <Cell
                    style={[{ width: arrWidthColTable[12] }, styles.cell]}
                    data={<Text style={{ fontSize: 12 }}>{`${productionCycles}`}</Text>}
                  />
                  <Cell
                    style={[{ width: arrWidthColTable[13] }, styles.cell]}
                    data={<Text style={{ fontSize: 12 }}>{`${settingProduct}`}</Text>}
                  />
                  <Cell
                    style={[{ width: arrWidthColTable[14] }, styles.cell]}
                    data={<Text style={{ fontSize: 12 }}>{`${totalProduction} ${productUnit || ""}`}</Text>}
                  />
                  <Cell
                    style={[{ width: arrWidthColTable[15] }, styles.cell]}
                    data={<Text style={{ fontSize: 12 }}>{runtime ? formatTime(runtime) : 0}</Text>}
                  />
                  <Cell
                    style={[{ width: arrWidthColTable[15] }, styles.cell]}
                    data={<Text style={{ fontSize: 12 }}>{waitingTime ? formatTime(waitingTime) : 0}</Text>}
                  />
                  <Cell
                    style={[{ width: arrWidthColTable[16] }, styles.cell]}
                    data={<Text style={{ fontSize: 12 }}>{stopTime ? formatTime(stopTime) : 0}</Text>}
                  />
                  <Cell
                    style={[{ width: arrWidthColTable[17] }, styles.cell]}
                    data={<Text style={{ fontSize: 12 }}>{(operationRate || 0).toFixed(2)}</Text>}
                  />
                  <Cell
                    style={[{ width: arrWidthColTable[17] }, styles.cell]}
                    data={<Text style={{ fontSize: 12 }}>{`${tackTime || 0} s/p`}</Text>}
                  />
                </TableWrapper>
              );
            })}
          </Table>
        </ScrollView>
      )}

      {!listView && (
        <View
          style={{
            flex: 1,
            backgroundColor: "#ccc",
            width: "100%",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
          }}
        >
          {records?.map((item, index) => (
            <View key={index} style={orientationHoz ? { width: "48%" } : { width: "100%" }}>
              <GridCard
                data={item}
                groups={groups.filter((g) => g.devices.find((e) => e.id === item.device.id))}
                onView={(id) => onView(id)}
                onGroup={onGroup}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    minHeight: 60,
    backgroundColor: "#80CB97",
  },
  row: { flexDirection: "row", backgroundColor: "#FFF1C1", height: 40 },
  text: { fontSize: 13, textAlign: "center" },
  cell: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 6,
  },
});
export default memo(Results, (prevProps, nextProps) => {
  return _.isEqual(prevProps.data, nextProps.data) && !!prevProps.listView === !!nextProps.listView;
});
