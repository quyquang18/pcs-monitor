import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

function InputSearch({ style, onChangeText }) {
  const [isFocused, setIsFocused] = useState(false);
  handleFocus = () => {
    setIsFocused(true);
  };
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          borderColor: '#0000003b',
          borderRadius: 8,
          borderWidth: 1
        },
        isFocused ? styles.isfocus : styles.noFocus,
        style
      ]}
    >
      <Ionicons
        name="search"
        size={26}
        color="#0000008a"
        style={{
          paddingHorizontal: 8,
          borderRightWidth: 1,
          borderRightColor: '#0000008a'
        }}
      />
      <TextInput
        onChangeText={onChangeText}
        style={{
          width: '50%',
          height: '100%',
          paddingLeft: 8,
          flex: 1
        }}
        placeholder="Search ..."
        onBlur={() => setIsFocused(false)}
        onFocus={handleFocus}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  isfocus: {
    borderWidth: 2,
    borderColor: "#00c853",
  },
});
export default InputSearch;
