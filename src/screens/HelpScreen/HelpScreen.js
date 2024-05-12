import React from 'react';
import { SafeAreaView } from 'react-native';
import AppHeader from '~/components/AppHeader';
import { Colors } from '~/constants';
import DefaultLayout from '../DefaultLayout';
function HelpScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <AppHeader
        back
        title="Help"
        backgroundColor={Colors.primary}
        titleAlight={'center'}
        navigation={navigation}
      />
      <DefaultLayout></DefaultLayout>
    </SafeAreaView>
  );
}

export default HelpScreen;
