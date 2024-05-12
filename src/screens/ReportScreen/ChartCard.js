import React from 'react';
import { View } from 'react-native';
import moment from 'moment';
import PieChart from 'react-native-pie-chart';
import { Card, Text } from 'react-native-paper';
import { isEmpty } from "lodash";

import { Colors } from "~/constants";
import { OpenSansText } from "~/components/StyledText";

const formatTime = (milliseconds) => {
  const timeInSeconds = parseInt(milliseconds, 10) / 1000;
  const seconds = Math.floor(timeInSeconds % 60);
  let remaining = Math.floor(timeInSeconds / 60);
  const minutes = Math.floor(remaining % 60);
  remaining = Math.floor(remaining / 60);
  const hours = Math.floor(remaining % 24);
  const days = Math.floor(remaining / 24);
  return `${days ? `${days}d ` : "0d "}${hours ? `${hours}h ` : "00h "}${minutes ? `${minutes}m ` : "00m "}${
    seconds ? `${seconds}s ` : "00s "
  }`;
};
function ChartCard({ data, handleClose, ...rest }) {
  const {
    device: { name },
    machineName,
    machineId,
    productUnit,
  } = data;

  const [records, setRecords] = React.useState({});
  React.useEffect(() => {
    const coppyData = { ...data };
    if (!isEmpty(coppyData)) {
      setRecords({ stats: coppyData.stats[0], cycles: coppyData.cycles });
    }
  }, [data]);
  const totalProductQty = (records?.cycles?.productQty || 0) + (records?.stats?.productQty || 0);
  const rangeTime = new Date(rest.endTime).getTime() - new Date(rest.startTime).getTime();
  const start = moment(rest.startTime).format("DD/MM/YYYY HH:mm");
  const end = moment(rest.endTime).format("DD/MM/YYYY HH:mm");
  const totalOfflineTime =
    rangeTime - (records?.stats?.runtime + records?.stats?.waitingTime + records?.stats?.stopTime);
  const pies = [
    records?.stats?.runtime || 0,
    records?.stats?.stopTime || 0,
    records?.stats?.waitingTime || 0,
    totalOfflineTime || 1,
  ];
  const total = pies.reduce((prev, next) => prev + parseInt(next, 10), 0);
  const labels = ["Run time", "Stop time", "Waiting time", "Offline time"];
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
    labels,
  };
  const isAllZero = percents.datasets.data.every((item) => item === 0);
  if (isAllZero) {
    percents.datasets.data.push(1);
    percents.datasets.backgroundColor.push("#fff");
  }
  return (
    <Card style={{ backgroundColor: "#ccc", marginBottom: 22, flex: 1, flexGrow: 1 }}>
      <Card.Title
        titleVariant="titleLarge"
        titleStyle={{ alignSelf: "center" }}
        subtitleStyle={{ alignSelf: "center" }}
        title={`Statistics Chart - ${name}`}
        subtitle={`(${machineName} - ${machineId})`}
      />
      <Card.Content>
        <OpenSansText
          style={{ fontWeight: "600", alignSelf: "center" }}
          variant="bodyMedium"
        >{`From ${start}  to  ${end}`}</OpenSansText>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <PieChart
            widthAndHeight={100}
            series={percents.datasets.data}
            sliceColor={percents.datasets.backgroundColor}
            coverFill={"#FFF"}
          />
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            marginTop: 12,
            paddingLeft: 12,
          }}
        >
          {labels.map((label, index) => {
            const color = colorSet[index];
            const percent = (pies[index] * 100) / total;
            return (
              <View key={index} style={{ flexDirection: "row", width: "100%", marginBottom: 12 }}>
                <View style={{ width: 20, height: 18, backgroundColor: color }} />
                <View style={{ flexDirection: "row", flex: 1, marginLeft: 8 }}>
                  <Text style={{ width: "30%" }}>{label}</Text>
                  <Text style={{ width: "40%" }}>{`${formatTime(pies[index])}`}</Text>
                  <Text>{`${!total ? 0 : percent.toFixed(2)}%`}</Text>
                </View>
              </View>
            );
          })}
        </View>
        <View
          style={{
            marginTop: 18,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text>Total Production Qty =</Text>
          <Text>{`${totalProductQty}  ${productUnit || ""}`}</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

export default ChartCard;
