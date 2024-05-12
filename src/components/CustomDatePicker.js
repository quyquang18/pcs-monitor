import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const MODE_VALUES = Platform.select({
  ios: Object.values(
    Object.freeze({
      ...Object.freeze({
        date: 'date',
        time: 'time'
      }),
      datetime: 'datetime',
      countdown: 'countdown'
    })
  ),
  android: Object.values(
    Object.freeze({
      date: 'date',
      time: 'time'
    })
  ),
  windows: []
});
const DISPLAY_VALUES = Platform.select({
  ios: Object.values(
    Object.freeze({
      default: 'default',
      spinner: 'spinner',
      compact: 'compact',
      inline: 'inline'
    })
  ),
  android: Object.values(
    Object.freeze({
      date: 'date',
      time: 'time'
    })
  ),
  windows: []
});

export default function CustomDatePicker({
  title,
  value,
  onChange,
  maximumDate,
  minimumDate
}) {
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDate(false);
    }
    if (event.type === "dismissed") {
      return;
    }
    if (event.type === "neutralButtonPressed") {
      onChange(new Date(0));
    } else {
      onChange(selectedDate);
    }
  };
  // const onChangeTime = (event, selectedTime) => {
  //   if (Platform.OS === 'android') {
  //     setShowTime(false);
  //   }
  //   if (event.type === 'dismissed') {
  //     return;
  //   }
  //   if (event.type === 'neutralButtonPressed') {
  //     onChange(new Date(0));
  //   } else {
  //     onChange(selectedTime);
  //   }
  // };

  const dateFormat = moment(value).format("DD/MM/YYYY");
  const timeFormat = moment(value).format("HH:mm");
  const date = new Date(value);
  return (
    <View>
      {showDate && (
        <DateTimePicker
          testID="dateTimePicker"
          minimumDate={minimumDate || null}
          maximumDate={maximumDate || null}
          timeZoneName={"Asia/Bangkok"}
          value={date}
          mode={MODE_VALUES[0]}
          display={DISPLAY_VALUES[0]}
          onChange={onChangeDate}
          minuteInterval={1}
        />
      )}
      {/* {showTime && (
        <DateTimePicker
          testID="dateTimePicker"
          timeZoneName={'Asia/Bangkok'}
          value={date}
          mode={MODE_VALUES[1]}
          is24Hour={true}
          display={DISPLAY_VALUES[0]}
          onChange={onChangeTime}
          minuteInterval={1}
        />
      )} */}
      <Text>{title}</Text>
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 1.5,
          paddingTop: 6,
          paddingBottom: 12,
          paddingHorizontal: 12,
          borderColor: "#546e7a",
        }}
      >
        <TouchableOpacity
          style={{
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 4,
            backgroundColor: "#876",
          }}
          onPress={() => setShowDate(true)}
        >
          <Text>{`${dateFormat}`}</Text>
        </TouchableOpacity>
        <View
          style={{
            marginLeft: 12,
            paddingVertical: 6,
            paddingHorizontal: 6,
            borderRadius: 4,
            backgroundColor: "#876",
          }}
          // onPress={() => setShowTime(true)}
        >
          <Text>{`${timeFormat}`}</Text>
        </View>
      </View>
    </View>
  );
}
