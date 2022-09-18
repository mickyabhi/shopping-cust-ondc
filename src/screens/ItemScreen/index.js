import React, {useEffect, useState} from 'react';
import {ScrollView, View, BackHandler, Text} from 'react-native';
import Header from '../../components/Header';
import {scaledValue} from '../../utils/design.utils';
import {useNavigation} from '@react-navigation/native';
import Button from '../../components/Button';
import backIcon from '../../../assets/images/BackIcon.png';
import cartIcon from '../../../assets/images/cartIcon.png';
import searchIcon from '../../../assets/images/search.png';
import {analytic} from '../../utils/analytics';
import {Divider, IconButton} from 'react-native-paper';
import {styles} from './styles';
import Rating from '../../components/Rating';
import CounterButton from '../../components/ItemsCountButton';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';
import {fetchCurrentCarts, showAlertToast} from '../AppStore/actions';
import {API} from 'aws-amplify';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import {getItemFromAsyncStorage} from '../../utils/storage.utils';

const ItemScreen = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [itemQuantity, setItemQuantity] = useState(1);

  const addItemInCart = async (cart, cartItem) => {
    const isCartItemExist = await API.graphql({
      query: queries.getOndcCartItem,
      variables: {
        id: props?.route?.params?.storeId
          ? cartItem?.id
          : cartItem?.id + cart?.id,
      },
    })
      .then(resp => resp?.data?.getOndcCartItem)
      .catch(err => console.log('err', err));

    const ondcCartItemInput = {
      id: props?.route?.params?.storeId
        ? cartItem?.id
        : cartItem?.id + cart?.id,
      ondcCartId: cart?.id,
      name: cartItem?.descriptor?.name || cartItem?.name,
      img: cartItem?.descriptor?.images[0] || cartItem?.img,
      mrp: cartItem?.price?.value || cartItem?.mrp,
      quantity: isCartItemExist
        ? isCartItemExist?.quantity + itemQuantity
        : itemQuantity,
      availability: true,
      orderedQuantity: 0,
      ondcProductId: cartItem?.id,
    };

    if (isCartItemExist) {
      await API.graphql({
        query: mutations.updateOndcCartItem,
        variables: {input: ondcCartItemInput},
      })
        .then(() => {
          dispatch(
            showAlertToast({
              alertMessage:
                itemQuantity === 1
                  ? itemQuantity + ' item added in your cart'
                  : itemQuantity + ' items added in your cart',
            }),
          );
          dispatch(fetchCurrentCarts());
        })
        .catch(err => console.log('update.err', err));
      return;
    }

    if (cart && cartItem) {
      await API.graphql({
        query: mutations.createOndcCartItem,
        variables: {input: ondcCartItemInput},
      })
        .then(() => {
          dispatch(
            showAlertToast({
              alertMessage:
                itemQuantity === 1
                  ? itemQuantity + ' item added in your cart'
                  : itemQuantity + ' items added in your cart',
            }),
          );
          dispatch(fetchCurrentCarts());
        })
        .catch(err => console.log('err', err));
    }
  };

  const addToCartHandler = async item => {
    const userId = await getItemFromAsyncStorage('current_user_id');

    const storeCarts = await API.graphql({
      query: queries.ondcCartsByUserId,
      variables: {
        userId,
        filter: {
          isOrderPlaced: {
            eq: false,
          },
          storeId: {eq: item?.storeId || props?.route?.params?.storeId},
        },
      },
    })
      .then(resp => resp?.data?.ondcCartsByUserId?.items)
      .catch(err => console.log('storeErr', err));
    console.log('storeCarts', storeCarts);
    if (storeCarts?.length > 0) {
      addItemInCart(storeCarts[0], item);
      return;
    }
    if (item && userId) {
      const ondcCartInput = {
        userId,
        storeId: item?.storeId || props?.route?.params?.storeId,
        isOrderPlaced: false,
        storeName: item?.vendorName,
        originalCartValue: 0,
        updatedCartValue: 0,
      };
      await API.graphql({
        query: mutations.createOndcCart,
        variables: {input: ondcCartInput},
      })
        .then(res => addItemInCart(res?.data?.createOndcCart, item))
        .catch(err => console.log('err', err.errors));
    }
  };

  return (
    <View style={styles.itemScreenUpperView}>
      <Header
        backNavigationIcon={backIcon}
        cartIcon={cartIcon}
        // searchIcon={searchIcon}
        onPress={() => {
          analytic().trackEvent('ItemScreen', {
            CTA: 'backIcon',
          });
          navigation.goBack();
        }}
      />
      <ScrollView>
        <View style={styles.itemDetailView}>
          <FastImage
            source={{
              uri:
                props?.route?.params?.item?.descriptor?.images[0] ||
                props?.route?.params?.item?.img,
            }}
            style={styles.productImg}
            resizeMode="contain"
          />
          <Text allowFontScaling={false} style={styles.deliveredMsgText}>
            {props?.route?.params?.item?.descriptor?.name ||
              props?.route?.params?.item?.productName ||
              props?.route?.params?.item?.name}
          </Text>
          <View style={styles.discountContainer}>
            {/* <Text style={styles.priceText}>₹65</Text> */}
            <Text style={styles.sellingPrice}>
              ₹
              {props?.route?.params?.item?.price?.value ||
                props?.route?.params?.item?.sellingPrice ||
                props?.route?.params?.item?.mrp}
            </Text>
            <View style={styles.discountView}>
              {/* <Text style={styles.discountText}>1% off</Text> */}
            </View>
          </View>
          <View style={styles.ratingContainer}>
            <View style={styles.ratingView}>
              <Text style={styles.ratingText}>4.3</Text>
              <IconButton
                icon="star"
                color={'#ffffff'}
                size={scaledValue(22.38)}
                onPress={() => props.setActiveRate(1)}
              />
            </View>
            <Text style={styles.numberRating}>(55,205 ratings)</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.soldByView}>
            <Text style={styles.soldbyText}>
              Sold by:{' '}
              <Text style={styles.storeName}>
                {props?.route?.params?.item?.vendorName}
              </Text>
            </Text>
            <View style={styles.storeRatingView}>
              <Rating activeRate={4} />
              <Text style={styles.ratingNumText}>(555 ratings)</Text>
            </View>
            <Text style={styles.discountDes}>
              89% positive over the last 12 months
            </Text>
          </View>
          <Divider style={styles.divider} />
          <Text style={styles.productDes}>
            Okay, too many different words from coming at me from too many
            different sentences.
          </Text>
          <View style={styles.buttonView}>
            <CounterButton
              disabled={itemQuantity === 1}
              quantity={itemQuantity}
              additionClickHandler={() => setItemQuantity(itemQuantity + 1)}
              subtractionClickHandler={() => setItemQuantity(itemQuantity - 1)}
              width={scaledValue(219)}
              height={scaledValue(95)}
              borderWidth={scaledValue(4)}
              quantityTextSize={scaledValue(50)}
              minusText={scaledValue(60)}
              plusText={scaledValue(68)}
            />
            <Button
              title="Add To Cart"
              borderRadius={scaledValue(24)}
              width={scaledValue(371.37)}
              height={scaledValue(118.57)}
              backgroundColor="#F8993A"
              borderColor="#F8993A"
              color="#ffffff"
              fontSize={scaledValue(32)}
              fontFamily="Lato-Bold"
              onPress={() => {
                addToCartHandler(props?.route?.params?.item);
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ItemScreen;
