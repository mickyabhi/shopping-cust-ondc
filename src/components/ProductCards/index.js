import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native';
import {scaledValue} from '../../utils/design.utils';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';
import {PRODUCT_IMAGE_BASE_URL} from '../../utils/constants';

const ProductCard = props => {
  const navigation = useNavigation();
  const [productImage, setProductImage] = useState({
    uri: PRODUCT_IMAGE_BASE_URL + props?.item?.id + '%403x.png',
  });

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={props.onPress}>
        <View style={styles.storeCardView}>
          <FastImage
            source={productImage}
            style={styles.storeImg}
            onError={() => {
              setProductImage(
                require('../../../assets/images/dummy-product-img.png'),
              );
            }}
          />
        </View>
        <Text style={styles.productName}>{props.productName}</Text>
      </TouchableOpacity>
    </>
  );
};
export default ProductCard;
const styles = StyleSheet.create({
  storeImg: {
    width: scaledValue(154),
    height: scaledValue(154),
    borderRadius: scaledValue(8),
  },
  storeCardView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaledValue(20),
    borderRadius: scaledValue(8),
    elevation: 1,
    shadowColor: '#00000090',
    borderWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: '#00000029',
  },

  container: {
    width: scaledValue(212),
    paddingHorizontal: scaledValue(12),
    paddingTop: scaledValue(19.07),
    margin: scaledValue(13),
  },

  productName: {
    fontSize: scaledValue(21),
    textAlign: 'center',
    paddingVertical: scaledValue(8),
    fontFamily: 'Lato-Semibold',
  },
});
