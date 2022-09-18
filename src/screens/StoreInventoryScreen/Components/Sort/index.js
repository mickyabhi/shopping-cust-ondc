import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {scaledValue} from '../../../../utils/design.utils';
import sortIcon from '../../../../../assets/images/sort-icon.png';

const Sort = props => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.sortView}>
        <Text style={styles.sortText}>{props.name}</Text>
        <Image source={sortIcon} style={styles.sortImage} />
      </View>
    </TouchableOpacity>
  );
};

export default Sort;

const styles = StyleSheet.create({
  sortView: {
    width: scaledValue(375),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: scaledValue(1),
  },
  sortText: {fontSize: scaledValue(28), fontFamily: 'Lato-Semibold'},
  sortImage: {width: scaledValue(88), height: scaledValue(88)},
});
