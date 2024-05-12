import React from 'react';
import { View, StyleSheet } from 'react-native';
import moment from 'moment';
import { Card } from 'react-native-paper';

import { OpenSansText } from '~/components/StyledText';
function Alarm({ data }) {
  const {
    counterMode,
    counterValue,
    counterScale,
    relayOn,
    before,
    relayType,
    buzzer,
    createdAt,
    updatedAt
  } =
    data.alarm && data.alarm.length > 0
      ? data.alarm[0]
      : {
          counterMode: 'UP',
          counterValue: 0,
          counterScale: 1,
          relayOn: 0,
          before: 0,
          relayType: 'NC',
          buzzer: false,
          createdAt: null
        };

  return (
    <Card
      mode="container"
      style={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        backgroundColor: '#ccc',
        minHeight: 580
      }}
    >
      <Card.Title title=" Current parameter setting information" />
      <Card.Content>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Counter Mode:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${
            counterMode || 'N/A'
          }`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Counter Value:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${counterValue}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Counter Scale:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${counterScale}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Relay Mode:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${relayOn}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Offset Number:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${before}`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Relay Type:</OpenSansText>
          <OpenSansText style={styles.text2}>{`${
            relayType || 'N/A'
          }`}</OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Alarm:</OpenSansText>
          <OpenSansText style={styles.text2}>
            {`${buzzer ? 'ON' : 'OFF'}`}
          </OpenSansText>
        </View>
        <View style={styles.wrapperText}>
          <OpenSansText style={styles.text1}>Updated At:</OpenSansText>
          <OpenSansText style={styles.text2}>
            {`${moment(updatedAt || createdAt).format('YYYY-MM-DD HH:mm')}`}
          </OpenSansText>
        </View>
      </Card.Content>
    </Card>
  );
}
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
export default Alarm;
