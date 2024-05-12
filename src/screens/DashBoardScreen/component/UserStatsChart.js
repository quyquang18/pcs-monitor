import React from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { BarGroup, CartesianChart } from 'victory-native';
import { LinearGradient, useFont, vec } from '@shopify/react-native-skia';
import _ from 'lodash';

import { OpenSansText } from '~/components/StyledText';

const UserStatsChart = ({ data }) => {
  const months = [];
  if (data && data.userInMonths) {
    let date = moment();
    data.userInMonths.forEach(() => {
      months.push(date.format('MMM DD'));
      date.subtract(1, 'month');
    });
    months.reverse();
  }
  let maxValueY = 10;
  const builDataChart = () => {
    const userInMonths = data ? data.userInMonths : [];
    const activeUserInMonths = data ? data.activeUserInMonths : [];
    maxValueY = Math.max(userInMonths);
    let dataClone = [];
    if (data && userInMonths) {
      userInMonths.forEach((currentValue, index) => {
        let objData = {};
        objData.label = months[index];
        objData.userInMonths = currentValue;
        objData.activeUserInMonths = activeUserInMonths[index] || 0;
        dataClone.push(objData);
      });
    }
    return dataClone;
  };
  const stats = builDataChart();
  const fontSize = 12;
  const font = useFont(
    require('~/assets/fonts/android/OpenSans-Bold.ttf'),
    fontSize
  );
  const lenghtData = stats.length;

  return (
    <View style={{ width: '100%', marginTop: 18, backgroundColor: '#767272' }}>
      <View>
        <OpenSansText
          style={{
            fontWeight: '700',
            color: '#fff',
            fontSize: 18,
            alignSelf: 'flex-start',
            marginBottom: 12
          }}
        >
          User Statistics
        </OpenSansText>
        <TouchableOpacity
          style={{
            paddingHorizontal: 6,
            borderRadius: 5,
            backgroundColor: '#464545f7',
            alignSelf: 'flex-end',
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 2
          }}
        >
          <OpenSansText
            style={{ fontWeight: '600', color: '#fff', fontSize: 14 }}
          >
            LAST 6 MONTHS
          </OpenSansText>
        </TouchableOpacity>
      </View>
      {stats && stats.length > 0 && (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 12
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{ backgroundColor: '#4caf50', width: 20, height: 10 }}
              ></View>
              <Text style={{ color: '#fff', marginLeft: 12 }}>User gain</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 22
              }}
            >
              <View
                style={{ backgroundColor: '#1165F0', width: 20, height: 10 }}
              ></View>
              <Text style={{ color: '#fff', marginLeft: 12 }}>Active User</Text>
            </View>
          </View>
          <View style={{ height: 220 }}>
            <CartesianChart
              data={stats}
              xKey="label"
              yKeys={['userInMonths', 'activeUserInMonths']}
              domain={{ y: [0, 10] }}
              padding={{ left: 0, right: 0, bottom: 15, top: 15 }}
              domainPadding={{ left: 30, right: 30, top: 30 }}
              axisOptions={{
                font,
                tickCount: { y: 4, x: lenghtData },
                lineColor: '#d4d4d8',
                labelColor: '#0AEDCB'
              }}
            >
              {({ points, chartBounds }) => {
                return (
                  <BarGroup
                    chartBounds={chartBounds}
                    betweenGroupPadding={0.5}
                    withinGroupPadding={0.1}
                  >
                    <BarGroup.Bar
                      points={points.userInMonths}
                      animate={{ type: 'timing' }}
                    >
                      <LinearGradient
                        start={vec(0, 0)}
                        end={vec(0, 540)}
                        colors={['#4caf50', '#4EA731']}
                      />
                    </BarGroup.Bar>
                    <BarGroup.Bar
                      points={points.activeUserInMonths}
                      animate={{ type: 'timing' }}
                    >
                      <LinearGradient
                        start={vec(0, 0)}
                        end={vec(0, 500)}
                        colors={['#1165F0', '#184692']}
                      />
                    </BarGroup.Bar>
                  </BarGroup>
                );
              }}
            </CartesianChart>
          </View>
        </View>
      )}
    </View>
  );
};

export default UserStatsChart;
