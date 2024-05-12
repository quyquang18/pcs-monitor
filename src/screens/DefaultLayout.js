import React from 'react';
import {
  ScrollView,
  RefreshControl,
  SafeAreaView,
  Dimensions,
  View
} from 'react-native';
import { Height_Width } from '~/constants';
const screenHeight = Dimensions.get('window').height;
function DefaultLayout({
  children,
  refreshing = false,
  onRefresh,
  isRefresh,
  fullHeight,
  handleScroll
}) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        marginTop: Height_Width.height_header - (Platform.OS === 'ios' ? 20 : 0)
      }}
    >
      <ScrollView
        style={{ flex: 1, paddingTop: 0 }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        refreshControl={
          isRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              progressBackgroundColor="#ccc"
              colors={['green', '#ECA323', '#DE510E']}
            />
          ) : null
        }
      >
        {fullHeight ? (
          <View style={{ height: screenHeight - Height_Width.height_header }}>
            {children}
          </View>
        ) : (
          <ScrollView>{children}</ScrollView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default DefaultLayout;
