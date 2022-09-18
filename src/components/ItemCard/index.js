import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import ButtonUi from '../Button';
import FastImage from 'react-native-fast-image';
import dummyImage from '../../../assets/images/dummy-product-img.png';
import {styles} from './styles';
import {scaledValue} from '../../utils/design.utils';
import ItemCountButton from '../../components/ItemsCountButton';
import {API} from 'aws-amplify';
import * as mutations from '../../graphql/mutations';
import * as queries from '../../graphql/queries';
import {useDispatch} from 'react-redux';
import {fetchCurrentCarts} from '../../screens/AppStore/actions';
import {useNavigation} from '@react-navigation/core';

const ItemCard = props => {
  const navigation = useNavigation();
  const [itemQuantity, setItemQuantity] = useState(props?.quantity);
  const dispatch = useDispatch();
  useEffect(() => {
    setItemQuantity(props?.quantity);
  }, [props?.quantity]);

  const deleteCart = async (cart, cartId) => {
    if (cart?.length === 0) {
      await API.graphql({
        query: mutations.deleteOndcCart,
        variables: {input: {id: cartId}},
      }).then(() => {
        dispatch(fetchCurrentCarts());
        navigation.navigate('CartScreen');
      });
    }
  };

  const loadCart = async id => {
    await API.graphql({
      query: queries.getOndcCart,
      variables: {id},
    }).then(resp =>
      deleteCart(resp?.data?.getOndcCart?.ondcCartItems?.items, id),
    );
  };

  const decItemQuantity = async item => {
    if (item) {
      if (itemQuantity == 1) {
        await API.graphql({
          query: mutations.deleteOndcCartItem,
          variables: {input: {id: item?.id}},
        }).then(resp => {
          loadCart(resp?.data?.deleteOndcCartItem?.ondcCartId);
          props?.refreshCartItems();
        });
      } else {
        await API.graphql({
          query: mutations.updateOndcCartItem,
          variables: {input: {id: item?.id, quantity: itemQuantity - 1}},
        }).then(resp => {
          setItemQuantity(resp?.data?.updateOndcCartItem?.quantity);
          dispatch(fetchCurrentCarts());
          props?.refreshCartItems();
        });
      }
    }
  };
  const incItemQuantity = async item => {
    if (item) {
      await API.graphql({
        query: mutations.updateOndcCartItem,
        variables: {input: {id: item?.id, quantity: itemQuantity + 1}},
      }).then(resp => {
        setItemQuantity(resp?.data?.updateOndcCartItem?.quantity);
        dispatch(fetchCurrentCarts());
        props?.refreshCartItems();
      });
    }
  };
  return (
    <>
      {props?.productName && (
        <TouchableOpacity onPress={props?.onPress} style={styles.itemCardView}>
          <View style={styles.productCardView}>
            <FastImage
              source={
                props?.productImage !== null
                  ? {uri: props?.productImage}
                  : dummyImage
              }
              resizeMode="contain"
              style={styles.productImg}
            />
          </View>
          <View style={styles.productDetailView}>
            <Text numberOfLines={2} style={styles.productName}>
              {props?.productName}
            </Text>
            <Text style={styles.soldByText}>
              Sold by:
              <Text style={{color: '#F77F34'}}>{props?.vendorName}</Text>
            </Text>
            <View style={styles.discountContainer}>
              <Text style={styles.priceText}>{props?.price?.toFixed(2)}</Text>
              <Text style={styles.sellingPrice}>₹ {props?.sellingPrice}</Text>
              {/* <View style={styles.discountView}>
            <Text style={styles.discountText}>{props?.discount}</Text>
          </View> */}
            </View>
            <View style={styles.buttonView(props.buttonMarginRight)}>
              {props?.counterValueButton ? (
                <ItemCountButton
                  quantity={itemQuantity}
                  subtractionClickHandler={() => decItemQuantity(props?.item)}
                  additionClickHandler={() => incItemQuantity(props?.item)}
                  width={scaledValue(125)}
                  height={scaledValue(55)}
                  borderWidth={scaledValue(3)}
                  quantityTextSize={scaledValue(28)}
                  minusText={scaledValue(34)}
                  plusText={scaledValue(38)}
                />
              ) : (
                <ButtonUi
                  title="+ ADD"
                  borderColor={'#F8993A'}
                  fontFamily="Lato-Bold"
                  borderRadius={scaledValue(16)}
                  onPress={props?.additionClickHandler}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default ItemCard;
