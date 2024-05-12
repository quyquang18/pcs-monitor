import React, { useState, useEffect } from 'react';
import { View, SafeAreaView } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import APIService from '~/utils/APIService';
import AppHeader from '~/components/AppHeader';
import { Colors } from '~/constants';
import Overview from './Overview';
import Stats from './Stats';
import Alarm from './Alarm';
import RunStopStats from './RunStopStats';
import DefaultLayout from '~/screens/DefaultLayout';

function DeviceInfoScreen({ navigation, ...props }) {
  const deviceId = props?.route?.params?.deviceId;
  const [info, setInfo] = useState({});
  const [latestStats, setLatestStats] = useState({});
  const [runStopStats, setRunStopStats] = useState({ data: [], startTime: 0 });
  const [valueDisplay, setValueDisplay] = useState('deviceInfo');
  const buildDataStats = (inputData) => {
    let data = {
      tackTime: 0,
      runtime: 0,
      stopTime: 0,
      offlineTime: 0,
      operationRate: 0,
      UPH: 0
    };
    let totalTime = 0;
    if (inputData?.data.length > 0) {
      inputData?.data.forEach((element) => {
        if (element.status === 'OFFLINE') {
          data.offlineTime += element.time;
        } else {
          totalTime += element.time;
          if (element.status === 'RUN') {
            data.runtime += element.time;
          } else {
            data.stopTime += element.time;
          }
        }
      });
    }
    data.operationRate = totalTime === 0 ? 0 : (data.runtime * 100) / totalTime;
    const hours = data.runtime / 3600;
    data.tackTime = Math.floor(
      data.runtime / (inputData?.dataStats?.productQty || 1)
    );
    data.UPH =
      hours !== 0
        ? hours < 1
          ? Math.floor((inputData?.dataStats?.productQty / (hours * 60)) * 60)
          : Math.floor(inputData?.dataStats?.productQty / hours)
        : 0;
    return data;
  };
  const arrangeData = (inputData) => {
    inputData.data.sort(
      (a, b) => new Date(a.startTime) - new Date(b.startTime)
    );
  };
  const fetchData = () => {
    APIService.getDeviceById(deviceId, (success, json) => {
      if (json?.result) {
        setInfo(json.result);
      }
    });

    APIService.getRunStopStatsByDeviceId(deviceId,null, (success, json) => {
      if (json.result && Array.isArray(json.result.data)) {
        const dataBuild = buildDataStats(json.result);
        arrangeData(json.result);
        setRunStopStats(json.result);
        setLatestStats(dataBuild);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, [deviceId]);
  const handleRefeshData = () => {
    fetchData();
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        back
        title="Device Info"
        backgroundColor={Colors.primary}
        titleAlight={'center'}
        navigation={navigation}
      />
      <DefaultLayout>
        <View>
          <SegmentedButtons
            density="regular"
            value={valueDisplay}
            onValueChange={setValueDisplay}
            style={{ borderRadius: 0 }}
            buttons={[
              {
                value: 'deviceInfo',
                label: 'Device Info',
                icon: (props) => (
                  <Feather
                    name="hard-drive"
                    size={22}
                    color={'#000'}
                    {...props}
                  />
                ),
                checkedColor: '#086',
                style: [
                  { borderRadius: 0, borderColor: '#d9d9d9' },
                  valueDisplay === 'deviceInfo'
                    ? { borderWidth: 0, backgroundColor: '#ccc' }
                    : { borderWidth: 1, backgroundColor: '#fff' }
                ]
              },
              {
                value: 'statistics',
                label: 'Statistics',
                icon: (props) => (
                  <MaterialCommunityIcons
                    name="clipboard-list"
                    size={22}
                    color={'#000'}
                    {...props}
                  />
                ),
                checkedColor: '#086',
                style: [
                  { borderRadius: 0, borderColor: '#d9d9d9' },
                  valueDisplay === 'statistics'
                    ? { borderWidth: 0, backgroundColor: '#ccc' }
                    : { borderWidth: 1, backgroundColor: '#fff' }
                ]
              },
              {
                value: 'infoSetting',
                label: 'Info Setting',
                icon: (props) => (
                  <Feather
                    name="settings"
                    size={22}
                    color={'#000'}
                    {...props}
                  />
                ),
                checkedColor: '#086',
                style: [
                  { borderRadius: 0, borderColor: '#d9d9d9' },
                  valueDisplay === 'infoSetting'
                    ? { borderWidth: 0, backgroundColor: '#ccc' }
                    : { borderWidth: 1, backgroundColor: '#fff' }
                ]
              }
            ]}
          />
        </View>
        <View style={{ paddingBottom: 22 }}>
          {valueDisplay === 'deviceInfo' && (
            <Overview data={info} handleRefeshData={handleRefeshData} />
          )}
          {valueDisplay === 'statistics' && <Stats info={info} deviceId={deviceId} />}
          {valueDisplay === 'infoSetting' && <Alarm data={info} />}
          <RunStopStats latestStats={latestStats} {...runStopStats} />
        </View>
      </DefaultLayout>
    </SafeAreaView>
  );
}

export default DeviceInfoScreen;
