import React from "react";
import { View, TouchableHighlight, Text, StyleSheet, Button } from "react-native";
import { dataColor } from "~/utils/dataColor";
function CustomColorPicker({ onChange, value, onOk }) {
  const dataColors = dataColor.data;
  let foundItem = dataColors.find((item) => item.valueHEX === value);
  let stringRGB = foundItem ? foundItem.valueRGB : null;
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: 12 }}>
      {dataColors?.map((item, index) => (
        <TouchableHighlight
          key={index}
          style={[styles.colorSelect, { backgroundColor: item.valueHEX }]}
          onPress={() => {
            onChange(item);
          }}
        >
          <View></View>
        </TouchableHighlight>
      ))}
      <View
        style={{
          flexDirection: "row",
          padding: 8,
          justifyContent: "space-around",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text style={styles.text}>{value}</Text>
        <Text style={[styles.text, { minWidth: "40%" }]}>{stringRGB}</Text>
        <Button title="Ok" onPress={onOk} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  colorSelect: {
    width: 30,
    height: 30,
    margin: 4,
  },
  text: {
    color: "#fff",
    textTransform: "uppercase",
  },
});
export default CustomColorPicker;
