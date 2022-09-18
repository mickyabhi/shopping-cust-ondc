import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {IconButton, Divider} from 'react-native-paper';
import {scaledValue} from '../../utils/design.utils';

const Rating = props => {
  return (
    <>
      <View style={styles.rateView}>
        <IconButton
          icon="star"
          color={props.activeRate >= 1 ? '#05A649' : '#00000029'}
          size={scaledValue(46.27)}
          onPress={() => {}}
        />
        <IconButton
          icon="star"
          color={props.activeRate >= 2 ? '#05A649' : '#00000029'}
          size={scaledValue(46.27)}
          onPress={() => {}}
        />
        <IconButton
          icon="star"
          color={props.activeRate >= 3 ? '#05A649' : '#00000029'}
          size={scaledValue(46.27)}
          onPress={() => {}}
        />
        <IconButton
          icon="star"
          color={props.activeRate >= 4 ? '#05A649' : '#00000029'}
          size={scaledValue(46.27)}
          onPress={() => {}}
        />
        <IconButton
          icon="star"
          color={props.activeRate >= 5 ? '#05A649' : '#00000029'}
          size={scaledValue(46.27)}
          onPress={() => {}}
        />
      </View>
    </>
  );
};

export default Rating;

const styles = StyleSheet.create({
  rateView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: scaledValue(314.27),
  },
  rateContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewText: {fontSize: scaledValue(24), color: '#FF8800'},
  submitReview: {
    marginVertical: scaledValue(35),
    textAlign: 'right',
    color: '#FF8800',
  },

  input: {
    color: '#000000',
  },
});
