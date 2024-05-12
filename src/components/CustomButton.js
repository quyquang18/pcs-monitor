import React from "react";
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { Colors } from '~/constants';
import { OpenSansText } from '~/components/StyledText';

const CustomButton = ({
  on_press,
  textLeftIcon,
  btn_text,
  style,
  style_text,
  disabled = false,
  leftIcon
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        {
          justifyContent: 'center',
          width: '95%',
          backgroundColor: !disabled ? Colors.primary : Colors.disabled,
          height: 50,
          marginBottom: 25,
          borderRadius: 25
        },
        leftIcon ? { flexDirection: 'row', alignItems: 'center' } : {},
        style
      ]}
      onPress={on_press}
    >
      {!!textLeftIcon && (
        <OpenSansText
          style={{
            fontSize: 17,
            textAlign: 'center',
            position: 'relative',
            color: 'red',
            marginRight: 6
          }}
        >
          {textLeftIcon}
        </OpenSansText>
      )}
      {leftIcon && <View style={{ marginRight: 6 }}>{leftIcon}</View>}
      <OpenSansText
        style={[
          {
            fontSize: 15,
            letterSpacing: 1.5,
            textAlign: 'center',
            position: 'relative',
            color: Colors.white
          },
          style_text
        ]}
      >
        {btn_text}
      </OpenSansText>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({});
