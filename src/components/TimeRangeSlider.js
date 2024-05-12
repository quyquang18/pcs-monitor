import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import RangeSlider from 'rn-range-slider';
import moment from 'moment';

import { Colors } from '~/constants';

const PROGRES_HEIGHT = 32;
const THUMB_WIDTH = 2;
const THUMB_COLOR = '#000000';

const TimeRangeSlider = ({ startTime, endTime, showDetail, ...props }) => {
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(endTime);
  const [min, setMin] = useState(startTime);
  const [max, setMax] = useState(endTime);
  const Thumb = ({ name }) => {
    return (
      <View style={name === "high" ? styles.thumbHigh : styles.thumbLow}>
        <View style={name === "high" ? styles.topThumbHigh : styles.topThumbLow}></View>
        <View style={name === "high" ? styles.bottomThumbHigh : styles.bottomThumbLow}></View>
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

  const renderThumb = useCallback((name) => <Thumb name={name} />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value) => <Label value={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const handleValueChange = useCallback((lowValue, highValue) => {
    setLow(lowValue);
    setHigh(highValue);
  }, []);
  const handleSliderTouchEnd = useCallback((lowValue, highValue) => {
    props.handleChangeValue(lowValue, highValue);
  }, []);

  return (
    <View>
      {showDetail ? (
        <RangeSlider
          style={styles.slider}
          min={min}
          max={max}
          step={1000}
          renderThumb={renderThumb}
          renderRail={renderRail}
          renderRailSelected={renderRailSelected}
          renderLabel={renderLabel}
          renderNotch={renderNotch}
          onValueChanged={handleValueChange}
          onSliderTouchEnd={handleSliderTouchEnd}
        />
      ) : (
        <View style={{ height: 92 }}></View>
      )}
      <View
        style={{
          position: "absolute",
          top: 42,
          zIndex: -1,
        }}
      >
        <View style={{ flexDirection: "row", marginHorizontal: THUMB_WIDTH }}>
          {props.data?.data.map((item, index) => {
            let color;
            let total = props.data?.data.reduce((acc, obj) => acc + obj.time, 0);

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
  thumbLow: {
    width: THUMB_WIDTH,
    height: PROGRES_HEIGHT + 4,
    left: 0,
    top: 0,
    borderColor: "#7f7f7f",
    backgroundColor: THUMB_COLOR,
  },
  thumbHigh: {
    width: THUMB_WIDTH,
    height: PROGRES_HEIGHT + 4,
    right: 0,
    paddingRight: 0,
    marginRight: 0,
    borderWidth: 0,
    borderColor: "#7f7f7f",
    backgroundColor: THUMB_COLOR,
  },
  topThumbHigh: {
    width: 8,
    height: 2,
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: THUMB_COLOR,
  },
  bottomThumbHigh: {
    width: 8,
    height: 2,
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: THUMB_COLOR,
  },
  topThumbLow: {
    width: 8,
    height: 2,
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: THUMB_COLOR,
  },
  bottomThumbLow: {
    width: 8,
    height: 2,
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: THUMB_COLOR,
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

export default TimeRangeSlider;
