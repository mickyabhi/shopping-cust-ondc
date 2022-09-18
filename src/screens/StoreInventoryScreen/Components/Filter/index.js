import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {scaledValue} from '../../../../utils/design.utils';
import filterIcon from '../../../../../assets/images/filter-icon.png';

const Filter = props => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.filterView}>
        <Text style={styles.filterText}>{props.name}</Text>
        <Image source={filterIcon} style={styles.filterImage} />
      </View>
    </TouchableOpacity>
  );
};

export default Filter;

const styles = StyleSheet.create({
  filterView: {
    width: scaledValue(375),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: scaledValue(1),
  },
  filterText: {fontSize: scaledValue(28), fontFamily: 'Lato-Semibold'},
  filterImage: {width: scaledValue(88), height: scaledValue(88)},
});
