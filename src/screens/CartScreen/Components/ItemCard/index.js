import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import ButtonUi from '../../../../components/Button';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {analytic} from '../../utils/analytics';
import {PRODUCT_IMAGE_BASE_URL} from '../../utils/constants';
import {styles} from './styles';
import dummyImage from '../../../../../assets/images/dummy-product-img.png';
import {scaledValue} from '../../../../utils/design.utils';

const ItemCard = props => {
  const navigation = useNavigation();

  return (
    <View style={styles.itemCardView}>
      <TouchableOpacity
        style={styles.productCardView}
        onPress={() => navigation.navigate('ItemScreen')}>
        <FastImage
          source={dummyImage}
          style={styles.productImg}
          onError={() => {
            setProductImage(dummyImage);
          }}
        />
      </TouchableOpacity>
      <View style={styles.productDetailView}>
        <Text style={styles.productName}>{props.productName}</Text>
        <Text style={styles.soldbyText}>
          Sold by: <Text style={styles.storeNameText}>Super ITC</Text>
        </Text>
        <View style={styles.discountContainer}>
          <Text style={styles.priceText}>{props.price}</Text>
          <Text style={styles.sellingPrice}>{props.sellingPrice}</Text>
          <View style={styles.discountView}>
            <Text style={styles.discountText}>{props.discount}</Text>
          </View>
        </View>
        <View style={styles.buttonView}>
          <ButtonUi
            title="+ ADD"
            borderColor={'#F8993A'}
            fontFamily="Lato-Bold"
            borderRadius={scaledValue(16)}
            width={scaledValue(125)}
            onPress={() => {
              //   setQuantity(current => current + 1);
              //   props?.addItem();
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default ItemCard;
