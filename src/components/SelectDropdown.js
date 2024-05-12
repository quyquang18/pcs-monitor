import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SelectDropdown = ({
  onChange,
  listData,
  leftIconName,
  value,
  search,
  style,
  label,
  inputSearchStyle,
  selectedTextStyle,
  noBorder
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const buildData = listData.map((item) => {
    let objData = {};
    objData.label = item;
    objData.value = item;
    return objData;
  });
  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'green' }]}>
          {label}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {label && renderLabel()}
      <Dropdown
        style={[
          styles.dropdown,
          { borderWidth: noBorder ? 0 : 1.5 },
          isFocus && {
            borderColor: 'green',
            borderStyle: 'solid'
          },
          style
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={[styles.selectedTextStyle, selectedTextStyle]}
        inputSearchStyle={[styles.inputSearchStyle, inputSearchStyle]}
        iconStyle={styles.iconStyle}
        data={buildData}
        search={search}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? `${label}` : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onChange(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => {
          if (leftIconName) {
            return (
              <MaterialCommunityIcons
                style={styles.icon}
                color={isFocus ? 'green' : 'black'}
                name={leftIconName}
                size={22}
              />
            );
          } else {
            return null;
          }
        }}
      />
    </View>
  );
};

export default SelectDropdown;

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: '#ccc',
    paddingVertical: 6,
    marginBottom: 12
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingHorizontal: 8
  },
  icon: {
    marginRight: 5
  },
  label: {
    position: 'absolute',
    backgroundColor: '#ccc',
    left: 22,
    top: -3,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14
  },
  placeholderStyle: {
    fontSize: 16
  },
  selectedTextStyle: {
    fontSize: 16
  },
  iconStyle: {
    width: 20,
    height: 20
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16
  }
});
