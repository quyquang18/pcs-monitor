import React from 'react';
import { View, Text } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

import { OpenSansText } from '~/components/StyledText';

function TrafficHits({ data }) {
  const hits = data?.traffic || 0;

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
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}
        >
          <OpenSansText
            style={{
              fontWeight: '700',
              color: '#546e7a',
              fontSize: 20
            }}
          >
            TRAFFIC
          </OpenSansText>
          <OpenSansText
            style={{
              color: '#631F7B',
              fontWeight: 600,
              fontSize: 18,
              marginLeft: 32
            }}
          >
            {`${hits}  hits`}
          </OpenSansText>
        </View>
        <View
          style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center' }}
        >
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
          <Entypo name="line-graph" size={32} color="#fff" />
        </View>
      </View>
    </View>
  );
}

export default TrafficHits;
