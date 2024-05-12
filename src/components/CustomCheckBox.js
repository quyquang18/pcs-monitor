import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function CustomCheckBox({ ...props }) {
  return (
    <View style={styles.container}>
      <Pressable onPress={props.onPress}>
        {props.indeterminate ? (
          <MaterialIcons
            name={'indeterminate-check-box'}
            size={28}
            color="#546e7a"
          />
        ) : (
          <>
            {props.isChecked ? (
              <MaterialCommunityIcons
                name={'checkbox-marked'}
                size={28}
                color={props.color == 'primary' ? '#00c853' : '#546e7a'}
              />
            ) : (
              <MaterialCommunityIcons
                name={'checkbox-blank-outline'}
                size={28}
                color="#546e7a"
              />
            )}
          </>
        )}
      </Pressable>

      {props.title && <Text style={styles.title}>{props.title}</Text>}
    </View>
  );
}

export default CustomCheckBox;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%'
  },
  title: {
    fontSize: 16,
    color: '#000',
    marginLeft: 5,
    fontWeight: '600'
  }
});
