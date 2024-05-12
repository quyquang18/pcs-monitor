import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import PieChart from 'react-native-pie-chart';
import moment from 'moment';

import { Colors } from '~/constants';
import { OpenSansText } from '~/components/StyledText';

const widthScreen = Dimensions.get('window').width;

function StatChart({ data, visible, handleClose, ...rest }) {
  const {
    device: { name },
    machineName,
    machineId,
    productUnit,
    cycles,
  } = data;
  const stats = data.stats && data.stats[0];
  const totalProductQty = cycles?.productQty || 0 + stats?.productQty || 0;

  const rangeTime = new Date(rest.endTime) - new Date(rest.startTime);
  const start = moment(rest.startTime).format("DD/MM/YYYY HH:mm");
  const end = moment(rest.endTime).format("DD/MM/YYYY HH:mm");
  const totalOfflineTime = rangeTime - (stats.runtime + stats.waitingTime + stats.stopTime);
  const pies = [stats.runtime || 0, stats.waitingTime || 0, stats.stopTime || 0, totalOfflineTime || 1];

  const colorSet = [Colors.run, Colors.waiting, Colors.stop, Colors.offline];
  const labels = ["Run", "Waiting", "Stop", "Offline"];
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
  const optionModal = {
    animationIn: "slideInRight",
    animationOut: "slideOutRight",
    avoidKeyboard: true,
    coverScreen: true,
    hideModalContentWhileAnimating: true,
    useNativeDriver: true,
  };
  return (
    <Modal
      style={{ margin: 0, flex: 1 }}
      isVisible={visible}
      backdropTransitionOutTiming={0}
      backdropTransitionInTiming={0}
      {...optionModal}
      onBackdropPress={handleClose}
    >
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <OpenSansText
            style={{
              fontWeight: "600",
              fontSize: 18,
              marginVertical: 12,
              textAlign: "center",
            }}
          >
            {`Statistics Chart - ${name} (${machineName} - ${machineId})`}
          </OpenSansText>
          <OpenSansText
            style={{
              fontSize: 14,
              marginVertical: 12,
              textAlign: "center",
            }}
          >{`From ${start} to ${end}`}</OpenSansText>
          <View style={{ marginVertical: 22 }}>
            <PieChart
              widthAndHeight={widthScreen - 117}
              series={percents.datasets.data}
              sliceColor={percents.datasets.backgroundColor}
              coverFill={"#FFF"}
              coverRadius={0.7}
            />
            <View
              style={{
                position: "absolute",
                top: Math.floor((widthScreen - 137) / 2.8),
                left: Math.floor((widthScreen - 107) / 4.2),
              }}
            >
              {labels.map((label, index) => {
                const color = colorSet[index];
                const percent = (pies[index] * 100) / rangeTime;
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <View style={{ width: 30, height: 18, backgroundColor: color }} />
                    <OpenSansText
                      style={{
                        fontSize: 13,
                        textTransform: "uppercase",
                        marginLeft: 4,
                        fontWeight: "600",
                      }}
                    >{`${label} ${!rangeTime ? 0 : percent.toFixed(2)} %`}</OpenSansText>
                  </View>
                );
              })}
            </View>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <OpenSansText>Production Qty =</OpenSansText>
            <OpenSansText style={{ marginLeft: 4, fontWeight: "600" }}>{totalProductQty}</OpenSansText>
            <OpenSansText style={{ marginLeft: 8 }}>{productUnit || ""}</OpenSansText>
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    width: widthScreen - 100,
    paddingHorizontal: 8,
    backgroundColor: '#ccc',
    flex: 1
  },
  wrapperInput: {
    marginTop: 18
  },
  textLabel: {
    marginLeft: 12,
    marginBottom: 4
  }
});
export default StatChart;
