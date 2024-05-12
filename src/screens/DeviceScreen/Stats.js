import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import PieChart from 'react-native-pie-chart';
import { Card, Switch } from 'react-native-paper';
import APIService from '~/utils/APIService';
import { OpenSansText } from '~/components/StyledText';
import { Colors } from '~/constants';
import { ActivityIndicator } from 'react-native-paper';
import { formatTime } from "~/components/formatTime";
import { CheckStatusMC } from "~/utils/CheckStatusMC";

const Stats = ({ info, deviceId }) => {
  const [realtime, setRealTime] = useState(false);
  const [stats, setStats] = useState({});
  const [latestStats, setLatestStats] = useState({});
  const [loading, setLoading] = useState(false);
  const pollingInt = useRef(null);
  const { endTime, productQty, numOfCycles, status, online } = latestStats;
  const { tackTime, runtime, waitingTime, stopTime, operationRate, offlineTime } = stats;

  const statusMC = CheckStatusMC(online, status);
  const { productUnit } = info?.settings && info.settings.length > 0 ? info.settings[0] : {};

  const pies = [runtime, stopTime, waitingTime || 0, offlineTime || 1];
  const total = pies.reduce((prev, next) => prev + parseInt(next, 10), 0);
  const colorSet = [Colors.run, Colors.stop, Colors.waiting, Colors.offline];
  const labels = ["Run time", "Stop time", "Waiting Time", "Offline Time"];
  const percents = {
    fill: true,
    datasets: {
      data: pies,
      backgroundColor: colorSet,
      borderWidth: 1,
      borderColor: "#fff",
      hoverBorderColor: "#fff",
    },
    labels,
  };
  const buildDataStats = (inputData) => {
    let data = {
      tackTime: 0,
      runtime: 0,
      stopTime: 0,
      waitingTime: 0,
      offlineTime: 0,
      operationRate: 0,
      UPH: 0,
    };
    let totalTime = 0;
    if (inputData?.data.length > 0) {
      inputData?.data.forEach((element) => {
        if (element.status === "OFFLINE") {
          data.offlineTime += element.time;
        } else {
          totalTime += element.time;
          if (element.status === "RUN") {
            data.runtime += element.time;
          }
          if (element.status === "WAITTING") {
            data.waitingTime += element.time;
          }
          if (element.status === "ONLINE") {
            data.stopTime += element.time;
          }
        }
      });
    }
    data.operationRate = totalTime === 0 ? 0 : (data.runtime * 100) / totalTime;
    const hours = data.runtime / 3600;
    data.UPH =
      hours !== 0
        ? hours < 1
          ? Math.floor((inputData?.dataStats?.productQty / (hours * 60)) * 60)
          : Math.floor(inputData?.dataStats?.productQty / hours)
        : 0;
    return data;
  };

  const fetchData = (polling) => {
    if (!polling) setLoading(true);
    APIService.getDeviceStats(deviceId, (success, json) => {
      if (json?.result) {
        setLatestStats(json.result);
      }
    });

    APIService.getRunStopStatsByDeviceId(deviceId, null, (success, json) => {
      if (json.result && Array.isArray(json.result.data)) {
        const dataBuild = buildDataStats(json.result);
        setStats(dataBuild);
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    clearInterval(pollingInt.current);
    if (realtime) {
      pollingInt.current = setInterval(() => {
        fetchData(true);
      }, 4000);
    }
  }, [realtime]);
  useEffect(() => {
    fetchData();
  }, [deviceId]);
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
      <OpenSansText style={{ fontWeight: 600, fontSize: 16, padding: 6 }}>Statistics</OpenSansText>
      <Card.Content>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Start time:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${moment(endTime)
            .startOf("day")
            .format("DD/MM/YYYY HH:mm:ss")}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>End time:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${moment(endTime).format(
            "DD/MM/YYYY HH:mm:ss"
          )}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Device Status:</OpenSansText>
          <OpenSansText
            style={[
              styles.text2,
              {
                backgroundColor: "#ccc",
                paddingVertical: 2,
                borderRadius: 4,
                color: online === "ONLINE" ? "#34C90C" : "#C92A0C",
              },
            ]}
          >{`${online || "N/A"}`}</OpenSansText>
        </View>

        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>M/C Status:</OpenSansText>
          <OpenSansText
            style={[
              styles.text2,
              {
                backgroundColor: "#ccc",
                paddingVertical: 2,
                borderRadius: 4,
                color: statusMC.color,
              },
            ]}
          >
            {statusMC.onlineMC || "N/A"}
          </OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Number of cycles:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${numOfCycles || 0}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Product quantity:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${productQty || 0} ${productUnit || ""}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Operation rate %:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${(operationRate || 0).toFixed(2)}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Run time:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${runtime ? `${formatTime(runtime)}` : 0}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Waiting time:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${
            waitingTime ? `${formatTime(waitingTime)}` : 0
          }`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Stop time:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${stopTime ? `${formatTime(stopTime)}` : 0}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Offline time:</OpenSansText>
          <OpenSansText style={styles.text2}>
            {`${offlineTime ? `${formatTime(offlineTime)}` : 0}`}
          </OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>TaktTime:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${tackTime || 0} s/p`}</OpenSansText>
        </View>
        <View style={{}}>
          {loading ? (
            <View
              style={{
                height: 120,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator animating={true} color={"red"} />
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                marginTop: 12,
              }}
            >
              <PieChart
                widthAndHeight={100}
                series={percents.datasets.data}
                sliceColor={percents.datasets.backgroundColor}
                coverFill={"#FFF"}
              />
              <View>
                {labels.map((label, index) => {
                  const color = colorSet[index];
                  const percent = (pies[index] * 100) / total;
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 6,
                      }}
                    >
                      <View
                        style={{
                          height: 12,
                          width: 20,
                          backgroundColor: color,
                          marginRight: 8,
                        }}
                      />
                      <Text>{`${label} :  ${percent.toFixed(3)}%`}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </Card.Content>
      <Card.Actions>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 13, color: "#000" }}>Live Sync</Text>
          <Switch color={"#42B21E"} value={realtime} onValueChange={() => setRealTime(!realtime)} />
        </View>
      </Card.Actions>
    </Card>
  );
};
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
export default Stats;
