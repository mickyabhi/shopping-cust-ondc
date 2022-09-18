import React from 'react';
import {StyleSheet} from 'react-native';
import {Chip} from 'react-native-paper';
import {scaledValue} from '../../utils/design.utils';

const CategoryChip = props => {
  const styles = StyleSheet.create({
    chip: {
      marginRight: scaledValue(14.54),
      marginTop: scaledValue(47),
      marginBottom: scaledValue(42.88),
      borderColor: '#fff',
      borderWidth: scaledValue(3),
      height: scaledValue(75.4),
      backgroundColor: props.backgroundColor,
      borderRadius: scaledValue(38),
    },
    labelStyle: {
      fontSize: scaledValue(24),
      fontFamily: 'Lato-Bold',
    },
  });
  return (
    <Chip
      mode={props.mode}
      style={styles.chip}
      textStyle={styles.labelStyle}
      selectedColor={props.selectedColor}
      onPress={props.onPress}>
      {props.catName}
    </Chip>
  );
};

export default CategoryChip;
