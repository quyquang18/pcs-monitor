import React from 'react';
import { View, Text } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { OpenSansText } from '~/components/StyledText';

function ActiveUserStats({ data }) {
  const monthStats = data?.activeUserInMonths?.slice().reverse() || [];
  const delta = 100 * (monthStats[0] - monthStats[1]);
  const lastMonth = monthStats[1] || 1;
  const percent = delta / lastMonth;

  return (
    <View
      style={{
        backgroundColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 22,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 6
      }}
    >
      <View style={{}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}
        >
          <OpenSansText
            style={{ fontWeight: '700', color: '#546e7a', fontSize: 20 }}
          >
            ACTIVE USERS
          </OpenSansText>
          <OpenSansText
            style={{
              color: '#631F7B',
              fontWeight: 600,
              fontSize: 18,
              marginLeft: 32
            }}
          >
            {data?.userTotal || 0}
          </OpenSansText>
        </View>
        <View
          style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center' }}
        >
          <FontAwesome
            name={delta >= 0 ? 'arrow-circle-up' : 'arrow-circle-down'}
            size={28}
            color={delta >= 0 ? 'green' : 'red'}
          />
          <Text
            style={[
              delta >= 0 ? { color: 'green' } : { color: 'red' },
              { fontSize: 16, marginLeft: 4 }
            ]}
          >{`${percent}%`}</Text>
          <Text style={{ color: '#546e7a', marginLeft: 4 }}>
            Since last month
          </Text>
        </View>
      </View>
      <View style={{}}>
        <View
          style={{
            backgroundColor: '#1e88e5',
            width: 55,
            height: 55,
            borderRadius: 55 / 2,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FontAwesome5 name="user-check" size={32} color="#fff" />
        </View>
      </View>
    </View>
  );
}

export default ActiveUserStats;
