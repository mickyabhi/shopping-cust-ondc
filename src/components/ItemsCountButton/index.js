import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from './styles';

const ItemsCountButton = props => {
  return (
    <View
      style={styles.CountButtonView(
        props.width,
        props.height,
        props.borderWidth,
      )}>
      <TouchableOpacity
        disabled={props?.disabled}
        onPress={props?.subtractionClickHandler}
        style={styles.subtractionButton}>
        <Text
          allowFontScaling={false}
          style={styles.minusText(props.minusText)}>
          -
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.countView}>
        <Text
          allowFontScaling={false}
          style={styles.countButtonTitle(props.quantityTextSize)}>
          {props?.quantity}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={props?.additionClickHandler}
        style={styles.addButton}>
        <Text allowFontScaling={false} style={styles.plusText(props.plusText)}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ItemsCountButton;
