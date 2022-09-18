import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {PRODUCT_IMAGE_BASE_URL} from '../../utils/constants';
import {styles} from './styles';

const ItemDetailCard = props => {
  const [productImage, setProductImage] = useState({
    uri: PRODUCT_IMAGE_BASE_URL + props?.item?.product?.id + '%403x.png',
  });

  useEffect(() => {
    setProductImage({
      uri: PRODUCT_IMAGE_BASE_URL + props?.item?.productId + '%403x.png',
    });
  }, [props]);

  return (
    <>
      <View style={styles.imagesView}>
        <FastImage
          onError={() => {
            setProductImage(dummyImg);
          }}
          source={productImage}
          style={styles.bigImg}
        />
      </View>
    </>
  );
};

export default ItemDetailCard;
