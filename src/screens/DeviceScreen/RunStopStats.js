import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';

import CustomButton from '~/components/CustomButton';
import TimeLineStatus from '~/components/TimeLineStatus';
import { Colors } from '~/constants';
import TimeRangeSlider from '~/components/TimeRangeSlider';
import { formatTime } from "~/components/formatTime";
import TimeRangeSliderOneThumb from "~/components/TimeRangeSliderOneThumb";

export default function RunStopStats({ latestStats, ...props }) {
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [showDetail, setShowDetail] = useState();
  const [cycleStats, setCycleStats] = useState([]);
  const [dataStatus, setDataStatus] = useState();
  const [dataItemCycles, setDataItemCycles] = useState({});
  const { cycles, data } = props;

  useEffect(() => {
    setDataStatus(props?.data);
  }, [data]);
  const { tackTime, runtime, stopTime, operationRate, offlineTime } = latestStats;
  const timeWork = [runtime, stopTime, offlineTime];

  const startOfDay = moment().startOf("day").valueOf() / 1000;
  const endTime = new Date().getTime() / 1000;
  const arrangeData = (inputData) => {
    inputData.sort((a, b) => new Date(a?.startTime).getTime() - new Date(b?.startTime).getTime());
    return inputData;
  };
  const handleChangeValue = (valueLow, valueHigh) => {
    let rawData = props?.data.filter((item) => {
      let startTime = new Date(item.startTime).getTime();
      let endTime = new Date(item.endTime).getTime();
      return !(startTime >= valueLow * 1000 && endTime <= valueHigh * 1000);
    });

    let result = props?.data.filter((item) => {
      let startTime = new Date(item.startTime).getTime();
      let endTime = new Date(item.endTime).getTime();
      return startTime >= valueLow * 1000 && endTime <= valueHigh * 1000;
    });
    if (rawData?.length > 0) {
      const resultFilter = rawData
        .map((item, index) => {
          let startTime = new Date(item.startTime).getTime();
          let endTime = new Date(item.endTime).getTime();

          if (startTime <= valueLow * 1000 && endTime >= valueLow * 1000) {
            return {
              endTime: item.endTime,
              startTime: new Date(valueLow * 1000),
              time: endTime - valueLow * 1000,
              status: item.status,
            };
          } else if (startTime <= valueHigh * 1000 && endTime >= valueHigh * 1000) {
            return {
              endTime: new Date(valueHigh * 1000),
              startTime: item.startTime,
              time: valueHigh * 1000 - startTime,
              status: item.status,
            };
          } else {
            return null;
          }
        })
        .filter((item) => item !== null);
      let lastResult = [...result, ...resultFilter];
      lastResult = arrangeData(lastResult);

      setDataStatus(lastResult);
    }
  };

  const buildDataCycles = (valueLow, valueHigh) => {
    let rawData = data.filter((item) => {
      let startTime = new Date(item?.startTime).getTime();
      let endTime = new Date(item?.endTime).getTime();
      return !(startTime >= valueLow && endTime <= valueHigh);
    });
    let result = data.filter((item) => {
      let startTime = new Date(item?.startTime).getTime();
      let endTime = new Date(item.endTime).getTime();
      return startTime >= valueLow && endTime <= valueHigh;
    });

    if (rawData?.length > 0) {
      const resultFilter = rawData
        .map((item, index) => {
          let startTime = new Date(item?.startTime).getTime();
          let endTime = new Date(item.endTime).getTime();
          if (startTime <= valueLow && endTime >= valueLow && endTime >= valueHigh) {
            return {
              endTime: item.endTime,
              startTime: new Date(valueHigh),
              time: valueHigh - valueLow,
              status: item.status,
            };
          }
          if (startTime <= valueLow && endTime >= valueLow && endTime <= valueHigh) {
            return {
              endTime: item.endTime,
              startTime: new Date(endTime),
              time: endTime - valueLow,
              status: item.status,
            };
          } else if (startTime <= valueHigh && endTime >= valueHigh) {
            return {
              endTime: new Date(valueHigh),
              startTime: item?.startTime,
              time: valueHigh - startTime,
              status: item.status,
            };
          } else {
            return null;
          }
        })
        .filter((item) => item !== null && item?.time !== 0);
      let lastResult = [...result, ...resultFilter];
      lastResult = arrangeData(lastResult);
      return lastResult;
    }
  };

  useEffect(() => {
    if (cycles && cycles.length > 0) {
      const dataRaw = cycles?.map((e, index) => {
        const dataTimeLast = cycles[cycles?.length - 1]?.endTimeCycles;
        const lastTime = new Date(dataTimeLast).getTime() / 1000;
        const totalTime = lastTime - startOfDay;
        const startTime = new Date(e.startTimeCycles);
        const endTime = new Date(e.endTimeCycles);
        e.id = index;
        e.dataTime = buildDataCycles(startTime, endTime);
        e.totalTime = e?.dataTime?.reduce((acc, obj) => acc + obj?.time, 0) / 1000;
        e.percent = (e.totalTime * 100) / totalTime;
        let totalRunTime =
          e?.dataTime?.reduce((acc, obj) => acc + (obj?.status === "RUN" ? obj?.time : 0), 0) / 1000;
        e.tackTime = (totalRunTime / (e.productQty || 1)).toFixed(4);

        return e;
      });
      setCycleStats(dataRaw);
    }
  }, [cycles]);
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ marginVertical: 12 }}>Machine Status Statistics</Text>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <CustomButton
          style={{
            width: "40%",
            borderRadius: 5,
            backgroundColor: "#1AA09C",
            height: 30,
            marginBottom: 0,
          }}
          on_press={() => setShowDetail(!showDetail)}
          btn_text={!showDetail ? "View Detail" : "Hide Detail"}
          style_text={{ fontSize: 12 }}
        />
        <CustomButton
          style={{
            width: "40%",
            borderRadius: 5,
            backgroundColor: "#1AA09C",
            height: 30,
            marginBottom: 0,
          }}
          on_press={() => setVisibleFilter(true)}
          btn_text={"View TimeLine"}
          style_text={{ fontSize: 12 }}
        />
      </View>
      <View style={{ paddingHorizontal: 12 }}>
        {dataStatus?.length > 0 && (
          <View>
            {showDetail && (
              <TimeRangeSliderOneThumb
                startTime={startOfDay}
                endTime={endTime}
                handleChangeValue={handleChangeValue}
                data={dataStatus}
                showDetail={showDetail}
              ></TimeRangeSliderOneThumb>
            )}
            <TimeRangeSlider
              startTime={startOfDay}
              endTime={endTime}
              handleChangeValue={handleChangeValue}
              data={props}
              showDetail={showDetail}
            ></TimeRangeSlider>

            <TimeLineStatus
              handleClose={() => setVisibleFilter(false)}
              visible={visibleFilter}
              runStopStats={dataStatus}
            />
          </View>
        )}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            marginHorizontal: 2,
          }}
        >
          {cycleStats?.map((e, index) => {
            let colorBackground = "#E00EE0";
            if (+dataItemCycles?.id === index) colorBackground = "#1EBEF1";
            else if (index % 2 === 0) colorBackground = "#5B4F1B";
            return (
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: colorBackground,
                  height: 32,
                  width: `${e.percent}%`,
                }}
                onPress={() => setDataItemCycles(e)}
              ></TouchableOpacity>
            );
          })}
        </View>
      </View>
      <Text style={{ margin: 12 }}>Cycles stats</Text>
      <View style={{ marginTop: 12, paddingHorizontal: 12 }}>
        {dataItemCycles?.dataTime?.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              {dataItemCycles?.dataTime?.map((item, index) => {
                let color;
                if (item.status === "OFFLINE") color = Colors.offline;
                if (item.status === "RUN") color = Colors.run;
                if (item.status === "ONLINE") color = Colors.stop;
                if (item.status === "WAITTING") color = Colors.waiting;
                let percent = item.time / (dataItemCycles.totalTime * 10);
                return (
                  <View
                    key={index}
                    style={{
                      backgroundColor: color,
                      height: 60,
                      width: `${percent}%`,
                    }}
                  />
                );
              })}
            </View>
            <View
              style={{
                position: "absolute",
                left: "15%",
                top: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 14, color: "#fff" }}
              >{`Number of Cycles: ${dataItemCycles?.numOfCycles} , Tack Time: ${dataItemCycles?.tackTime}s/p`}</Text>
              <Text style={{ fontSize: 14, color: "#fff" }}>{`Total time: ${formatTime(
                dataItemCycles?.totalTime * 1000
              )}`}</Text>
            </View>
            <View style={{ position: "absolute", left: 10, bottom: -18 }}>
              <Text style={{ fontSize: 14 }}>
                {moment(new Date(dataItemCycles.startTimeCycles).getTime()).format("HH:mm:ss")}
              </Text>
            </View>
            <View style={{ position: "absolute", right: 0, bottom: -18 }}>
              <Text style={{ fontSize: 14 }}>
                {moment(new Date(dataItemCycles.endTimeCycles).getTime()).format("HH:mm:ss")}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                position: "absolute",
                top: -10,
                right: -8,
                cursor: "pointer",
              }}
              onPress={() => setDataItemCycles(false)}
            >
              <AntDesign name="minussquare" size={18} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

