import React, { useEffect, useState, memo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import moment from "moment";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Table, TableWrapper, Cell } from "react-native-table-component";

import CustomCheckBox from "~/components/CustomCheckBox";
import StatChart from "./StatChart";
import { formatTime } from "~/components/formatTime";

function Results({ data, startTime, endTime, selectedIds, onSelect }) {
  const [records, setRecords] = useState([]);
  const [visibleChart, setVisibleChart] = useState(null);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const hideChart = () => {
    setVisibleChart(null);
  };

  const handleSelectAll = (event) => {
    let newSelectedItemIds;
    if (!isCheckAll) {
      newSelectedItemIds = data.map((item) => item.device?.id);
    } else {
      newSelectedItemIds = [];
    }
    setIsCheckAll(!isCheckAll);
    onSelect(newSelectedItemIds);
  };

  const handleSelectOne = (id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelectedItemIds = [];

    if (selectedIndex === -1) {
      newSelectedItemIds = newSelectedItemIds.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelectedItemIds = newSelectedItemIds.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelectedItemIds = newSelectedItemIds.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedItemIds = newSelectedItemIds.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }

    onSelect(newSelectedItemIds);
  };

  useEffect(() => {
    setRecords(data);
  }, [data]);

  const elementChecker = () => {
    return (
      <CustomCheckBox
        isChecked={selectedIds.length === data.length}
        color="primary"
        indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
        onPress={handleSelectAll}
      />
    );
  };

  const elementHead = (item) => {
    if (item.sortable) {
      return (
        <TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              height: "100%",
              alignItems: "center",
              paddingHorizontal: 6,
              justifyContent: "center",
            }}
          >
            <Text style={{ marginRight: 12 }}>{item.title}</Text>
            <FontAwesome5 name={"sort-up"} size={22} />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <View
          style={{
            flexDirection: "row",
            height: "100%",
            alignItems: "center",
            paddingHorizontal: 6,
            justifyContent: "center",
          }}
        >
          <Text style={{ marginRight: 12 }}>{item.title}</Text>
        </View>
      );
    }
  };
  const arrWidthColTable = [
    50, 60, 100, 100, 110, 100, 110, 110, 80, 80, 80, 80, 90, 90, 90, 90, 90, 90, 90, 60,
  ];

  return (
    <View>
      <ScrollView style={styles.container} horizontal>
        <Table style={{ alignSelf: "center" }}>
          <TableWrapper style={[styles.row, { height: 60, backgroundColor: "#ccc" }]}>
            <Cell
              style={[
                (style = {
                  width: arrWidthColTable[0],
                  paddingLeft: 10,
                }),
                styles.cell,
              ]}
              data={elementChecker()}
            />
            {[
              {
                title: "Id No",
                sortable: false,
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
              {
                title: "Chart",
                sortable: false,
              },
            ].map((item, index) => (
              <Cell
                key={index}
                data={elementHead(item)}
                style={{ width: arrWidthColTable[index + 1], height: 60 }}
              />
            ))}
          </TableWrapper>
          {records.map((item, index) => {
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
              device: { name, id },
            } = item;
            const { productQty, numOfCycles, runtime, stopTime, offlineTime, tackTime, waitingTime } =
              stats && stats.length > 0 ? stats[0] : {};
            const totalProductQty = cycles?.productQty || 0 + productQty || 0;
            const { counterValue } = alarm || {};
            const start = moment(startTime).format("DD/MM/YYYY HH:mm");
            const end = moment(endTime).format("DD/MM/YYYY HH:mm");
            const startTimeStamp = Math.floor(new Date(startTime).getTime() / 1000);
            const endTimeStamp = Math.floor(new Date(endTime).getTime() / 1000);
            const settingProduct = alarm ? counterValue : 0;
            const productionCycles = numOfCycles || 0;
            const totalTime = runtime + stopTime + offlineTime + waitingTime;
            const operationRate = totalTime === 0 ? 0 : (runtime * 100) / totalTime;
            const isSelected = selectedIds.indexOf(item.device?.id) !== -1;
            return (
              <TableWrapper
                style={[styles.row, isSelected ? { backgroundColor: "#0CC697" } : {}]}
                key={index}
              >
                <Cell
                  style={[{ width: arrWidthColTable[0], paddingLeft: 10 }, styles.cell]}
                  data={
                    <CustomCheckBox isChecked={isSelected} onPress={() => handleSelectOne(item.device?.id)} />
                  }
                />
                <Cell style={[{ width: arrWidthColTable[1] }, styles.cell]} data={index + 1} />
                <Cell style={[{ width: arrWidthColTable[2] }, styles.cell]} data={start} />
                <Cell style={[{ width: arrWidthColTable[3] }, styles.cell]} data={end} />
                <Cell style={[{ width: arrWidthColTable[4] }, styles.cell]} data={name} />
                <Cell style={[{ width: arrWidthColTable[5] }, styles.cell]} data={productModel} />
                <Cell style={[{ width: arrWidthColTable[6] }, styles.cell]} data={productName} />
                <Cell style={[{ width: arrWidthColTable[7] }, styles.cell]} data={machineName} />
                <Cell style={[{ width: arrWidthColTable[8] }, styles.cell]} data={machineId} />
                <Cell style={[{ width: arrWidthColTable[9] }, styles.cell]} data={model} />
                <Cell
                  style={[{ width: arrWidthColTable[10] }, styles.cell]}
                  data={`${productQty || 0} ${productUnit || ""}`}
                />
                <Cell style={[{ width: arrWidthColTable[11] }, styles.cell]} data={`${productionCycles}`} />
                <Cell style={[{ width: arrWidthColTable[12] }, styles.cell]} data={`${settingProduct}`} />
                <Cell
                  style={[{ width: arrWidthColTable[13] }, styles.cell]}
                  data={`${totalProductQty} ${productUnit || ""}`}
                />
                <Cell
                  style={[{ width: arrWidthColTable[14] }, styles.cell]}
                  data={runtime ? formatTime(runtime) : 0}
                />
                <Cell
                  style={[{ width: arrWidthColTable[15] }, styles.cell]}
                  data={waitingTime ? formatTime(waitingTime) : 0}
                />
                <Cell
                  style={[{ width: arrWidthColTable[16] }, styles.cell]}
                  data={stopTime ? formatTime(stopTime) : 0}
                />
                <Cell
                  style={[{ width: arrWidthColTable[17] }, styles.cell]}
                  data={(operationRate || 0).toFixed(2)}
                />
                <Cell style={[{ width: arrWidthColTable[18] }, styles.cell]} data={`${tackTime || 0} s/p`} />

                <Cell
                  style={[{ width: arrWidthColTable[19] }, styles.cell]}
                  data={
                    (runtime || stopTime || waitingTime) && (
                      <TouchableOpacity
                        onPress={() => {
                          setVisibleChart(item);
                        }}
                      >
                        <FontAwesome5 name="chart-pie" size={22} color="#F69314" />
                      </TouchableOpacity>
                    )
                  }
                ></Cell>
              </TableWrapper>
            );
          })}
        </Table>
        {visibleChart && (
          <StatChart
            visible
            startTime={startTime}
            endTime={endTime}
            data={visibleChart}
            handleClose={hideChart}
          />
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    height: '100%'
  },
  head: { height: 40, backgroundColor: '#808B97' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1', height: 40 },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB', borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff' },
  cell: {
    justifyContent: 'center',
    paddingHorizontal: 6,
    alignItems: 'center'
  }
});
export default memo(Results);
