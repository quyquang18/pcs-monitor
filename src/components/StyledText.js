import * as React from "react";
import { Text, StyleSheet } from "react-native";


const OpenSansFont = {
  normal: 'Normal',
  bold: 'Bold',
  100: 'Normal',
  200: 'Normal',
  300: 'Normal',
  400: 'Normal',
  500: 'Normal',
  600: 'SemiBold',
  700: 'Bold',
  800: 'Bold'
};

const disableStyles = {
  fontStyle: "normal",
  fontWeight: "normal",
};

export function OpenSansText(props) {
  const { fontWeight = '400', fontStyle } = StyleSheet.flatten(
    props.style || {}
  );
  const fontFamily = `OpenSans-${OpenSansFont[fontWeight]}${
    fontStyle === 'italic' ? 'Italic' : ''
  }`;

  return (
    <Text
      {...props}
      style={[props.style, { fontFamily: fontFamily }, disableStyles]}
    />
  );
}
