import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text } from "react-native";
import RangeSlider from 'rn-range-slider';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '~/constants';

const PROGRES_HEIGHT = 64;

const TimeRangeSliderOneThumb = ({ data }) => {
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState();
  const [min, setMin] = useState(new Date(data[0]?.startTime).getTime() / 1000);
  const [max, setMax] = useState(new Date(data[data?.length - 1]?.endTime).getTime() / 1000);
  const Thumb = () => {
    return (
      <View style={styles.thumb}>
        <MaterialCommunityIcons style={styles.topThumb} name="menu-down" color={"#18E7B5"} size={22} />
        <View style={styles.bottomThumb}>
          <MaterialCommunityIcons name="menu-up" color={"#18E7B5"} size={22} />
        </View>
      </View>
    );
  };

  const Rail = () => {
    return <View style={[styles.rail]} />;
  };
  const RailSelected = () => {
    return <View style={[styles.rootSelectRail]} />;
  };
  const Notch = (props) => {
    return <View style={styles.rootNoths} {...props} />;
  };
  const Label = ({ value, ...restProps }) => {
    return (
      <View style={styles.rootLabel} {...restProps}>
        <Text style={styles.text}>{moment(value * 1000).format("HH:mm:ss")}</Text>
      </View>
    );
  };
  useEffect(() => {
    setMin(new Date(data[0]?.startTime).getTime() / 1000);
    setMax(new Date(data[data?.length - 1]?.endTime).getTime() / 1000);
  }, [data]);
  const renderBackgroundSlider = () => {
    const firstTime = new Date(data[0].startTime).getTime();
    const lastTime = new Date(data[data?.length - 1].endTime).getTime();
    return (
      <View
        style={{
          position: "absolute",
          top: -15,
          left: 9,
          zIndex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <View style={{ alignItems: "flex-start" }}>
          <Text
            style={[
              {
                fontSize: 12,
                color: "#000",
              },
            ]}
          >
            {moment(new Date(firstTime)).format("HH:mm:ss")}
          </Text>
          <View
            style={{
              borderRightWidth: 1,
              borderRightColor: "#000",
              borderStyle: Platform.OS !== "ios" ? "dashed" : "solid",
              height: 64,
            }}
          ></View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={[
              {
                fontSize: 12,
                color: "#000",
              },
            ]}
          >
            {moment(new Date(lastTime)).format("HH:mm:ss")}
          </Text>
          <View
            style={{
              borderRightWidth: 1,
              borderRightColor: "#000",
              borderStyle: Platform.OS !== "ios" ? "dashed" : "solid",
              height: 64,
            }}
          ></View>
        </View>
      </View>
    );
  };

  const renderThumb = useCallback((name) => <Thumb name={name} />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value) => <Label value={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const handleValueChange = useCallback((lowValue, highValue) => {
    setLow(lowValue);
    setHigh(highValue);
  }, []);

  return (
    <View style={{ marginHorizontal: -12 }}>
      <RangeSlider
        min={min}
        max={max}
        step={10}
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        renderLabel={renderLabel}
        renderNotch={renderNotch}
        disableRange={true}
        onValueChanged={handleValueChange}
      />
      <View
        style={{
          position: "absolute",
          top: 42,
          zIndex: -1,
          marginHorizontal: 2,
          paddingLeft: 9,
          paddingRight: 8,
        }}
      >
        {renderBackgroundSlider()}
        <View style={{ flexDirection: "row" }}>
          {data?.map((item, index) => {
            let color;
            let total = data.reduce((acc, obj) => acc + obj.time, 0);

            if (item.status === "OFFLINE") color = Colors.offline;
            if (item.status === "RUN") color = Colors.run;
            if (item.status === "ONLINE") color = Colors.stop;
            if (item.status === "WAITTING") color = Colors.waiting;
            let percent = (item.time / total) * 100;
            return (
              <View
                key={index}
                style={{
                  backgroundColor: color,
                  width: `${percent}%`,
                  height: PROGRES_HEIGHT,
                }}
              ></View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  thumb: {
    width: 20,
    height: PROGRES_HEIGHT + 4,
    left: 0,
    top: 0,
    bottom: 0,
    borderColor: "#7f7f7f",
  },

  topThumb: {
    position: "absolute",
    top: -7,
    right: 0,
  },
  bottomThumb: {
    position: "absolute",
    bottom: -7,
    right: 0,
  },
  rail: {
    height: PROGRES_HEIGHT,
    backgroundColor: "transparent",
    width: "100%",
  },
  rootSelectRail: {
    height: PROGRES_HEIGHT,
    backgroundColor: "transparent",
    width: "100%",
  },
  rootNoths: {
    width: 8,
    height: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#4499ff",
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 8,
  },
  rootLabel: {
    alignItems: "center",
    padding: 8,
    backgroundColor: "#4499ff",
    borderRadius: 4,
  },
  text: {
    fontSize: 12,
    color: "#fff",
  },
});

export default TimeRangeSliderOneThumb;
