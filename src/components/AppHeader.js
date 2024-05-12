import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { Colors } from '~/constants';
import MenuPopup from './MenuPopup';
import { Height_Width } from '~/constants';

const IconSize = 24;

const AppHeader = ({
  style,
  back,
  title,
  right,
  iconColor,
  titleAlight,
  navigation,
  backPoint
}) => {
  const LeftView = () => (
    <View style={styles.view}>
      {back ? (
        <TouchableOpacity
          onPress={() =>
            backPoint
              ? navigation.navigate({
                  name: backPoint.name,
                  key: backPoint.key
                })
              : navigation.goBack()
          }
        >
          <Feather name="arrow-left" size={IconSize} color={iconColor} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Feather name="menu" size={IconSize} color={Colors.black} />
        </TouchableOpacity>
      )}
    </View>
  );
  const RightView = () => (
    <View style={[styles.view, styles.rightView]}>
      {right && (
        <>
          <TouchableOpacity style={styles.rowView}>
            <Feather name={"bell"} size={IconSize} color={Colors.black} />
          </TouchableOpacity>
          <MenuPopup navigation={navigation} />
        </>
      )}
    </View>
  );
  const TitleView = () => (
    <View style={styles.titleView}>
      <Text
        style={{
          color: Colors.black,
          textAlign: titleAlight,
          marginLeft: titleAlight === 'center' ? -22 : 0,
          fontSize: 18,
          fontWeight: 'bold',
          fontFamily: 'OpenSans-SemiBold',
          backgroundColor: 'transparent'
        }}
      >
        {title}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.header, style]}>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={Colors.primary}
      />
      <LeftView />
      <TitleView />

      <RightView />
    </SafeAreaView>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  header: {
    height: Height_Width.height_header,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingBottom: 10,
    backgroundColor: Colors.primary
  },
  view: {
    marginHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row'
  },
  titleView: {
    flex: 1,
    fontSize: 20
  },
  rightView: {
    justifyContent: 'flex-end'
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  }
});
