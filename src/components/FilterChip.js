import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip } from 'react-native-paper';

const FilterChip = ({ label, onPress, onRemove, style }) => {
  return (
    <View style={[styles.container, style]}>
      {onRemove ? (
        <Chip
          onPress={onPress}
          onClose={() => onRemove()}
          style={styles.chip}
          closeIconAccessibilityLabel="Close icon accessibility label"
        >
          {label}
        </Chip>
      ) : (
        <Chip
          style={styles.chip}
          mode="flat"
          icon={'clock'}
          closeIcon
          onPress={onPress}
        >
          {label}
        </Chip>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    margin: 0,
    flex: 1
  },
  chip: {
    paddingHorizontal: 12,
    margin: 0,
    borderRadius: 4,
    height: '100%'
  }
});
export default FilterChip;
