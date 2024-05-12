import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, View } from 'react-native';

import AppHeader from '~/components/AppHeader';
import { Colors } from '~/constants';
import APIService from '~/utils/APIService';
import Settings from '~/utils/Settings';
import TotalCustomers from './component/TotalCustomers';
import ActiveUserStats from './component/ActiveUserStats';
import TrafficHits from './component/TrafficHits';
import UserStatsChart from './component/UserStatsChart';
import DefaultLayout from '../DefaultLayout';
import { AppContext } from '~/Context/AppContext';

export default function DashBoardScreen({ navigation }) {
  const { setIsLoading } = useContext(AppContext);
  const [data, setData] = useState({});
  const validateToken = async () => {
    let sessionKey = await Settings.sessionKey();
    if (!sessionKey) {
      navigation.navigate('LoginScreen');
    }
    APIService.verifyUserToken(sessionKey, (success, json) => {
      setIsLoading(true);
      if (success && json.result) {
        const { result } = json;
        Settings.setSessionKey(result.token);
        setIsLoading(false);
      } else {
        Settings.setSessionKey(null);
        navigation.navigate('LoginScreen');
        setIsLoading(false);
      }
    });
  };
  const fetchStatistics = () => {
    setIsLoading(true);
    APIService.getDashboard((success, json) => {
      if (success && json.result) {
        setData(json.result);
        setIsLoading(false);
      }
    });
  };
  useEffect(() => {
    validateToken();
    fetchStatistics();
  }, [navigation]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <AppHeader
        title={'DashBoard'}
        headerBg={Colors.primary}
        iconColor={Colors.black}
        menu
        titleAlight="left"
        optionalBadge={5}
        navigation={navigation}
        right="more-vertical"
        optionalBtn="bell"
      />
      <DefaultLayout>
        <View
          style={{
            paddingHorizontal: 4,
            paddingTop: 6,
            backgroundColor: '#fffff'
          }}
        >
          <TotalCustomers data={data} />
          <ActiveUserStats data={data} />
          <TrafficHits data={data} />
          <UserStatsChart data={data} />
        </View>
      </DefaultLayout>
    </SafeAreaView>
  );
}
