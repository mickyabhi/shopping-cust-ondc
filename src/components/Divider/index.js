import {StyleSheet} from 'react-native';
import React from 'react';
import {Divider} from 'react-native-paper';
import {scaledValue} from '../../utils/design.utils';

const DividerLine = props => {
  const styles = StyleSheet.create({
    divider: {
      backgroundColor: '#EDEDED',
      width: props.width,
      marginTop: scaledValue(22),
      marginBottom: scaledValue(16),
      borderWidth: scaledValue(1),
      borderColor: '#EDEDED',
    },
  });

  return <Divider style={styles.divider} />;
};

export default DividerLine;
