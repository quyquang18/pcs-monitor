import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

function CustomSwitch({ value, onValueChange, textLeft, noAction }) {
  const [isEnabled, setIsEnabled] = useState(value);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    onValueChange(value);
  };
  return (
    <View style={styles.container}>
      {textLeft && (
        <Text style={{ color: '#fff', fontSize: 14, marginRight: 2 }}>
          {textLeft}
        </Text>
      )}
      <Switch
        trackColor={{ false: '#767577', true: '#1E9B03' }}
        thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={noAction ? onValueChange : toggleSwitch}
        value={isEnabled}
        style={
          Platform.OS === 'android'
            ? { transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }
            : {}
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  }
});
export default CustomSwitch;
