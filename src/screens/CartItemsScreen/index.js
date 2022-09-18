import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {scaledValue} from '../../utils/design.utils';
import ItemCard from '../../components/ItemCard';
import DividerLine from '../../components/Divider';
import {API} from 'aws-amplify';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import {useDispatch} from 'react-redux';
import {fetchCurrentCarts, showLoading} from '../AppStore/actions';
import {useNavigation} from '@react-navigation/core';
import Header from '../../components/Header';
import backNavigationIcon from '../../../assets/images/BackIcon.png';
import cartIcon from '../../../assets/images/cartIcon.png';
import {analytic} from '../../utils/analytics';
import Footer from '../../components/Footer';
import addMoreIcon from '../../../assets/images/addmore-icon.png';
import {initOrder} from '../../services/ONDCAdapterService';

const CartItemCard = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  const [cartValue, setCartValue] = useState(null);

  const loadCartItems = async cartId => {
    if (cartId) {
      const cartItems = await API.graphql({
        query: queries.ondcCartsItemsByCartId,
        variables: {ondcCartId: cartId, limit: 10000},
      })
        .then(resp => resp?.data?.ondcCartsItemsByCartId?.items)
        .catch(err => console.log('err', err));

      let setTotalCartValue = 0;
      cartItems.forEach(cartItems => {
        if (cartItems?.mrp) {
          setTotalCartValue += cartItems?.mrp * cartItems?.quantity;
        }
      });

      setCartValue(setTotalCartValue);

      if (cartItems?.length == 0) {
        await API.graphql({
          query: mutations.deleteOndcCart,
          variables: {input: {id: cartId}},
        }).then(() => dispatch(fetchCurrentCarts()));
        return;
      }
      setCartItems(cartItems);
      dispatch(showLoading(false));
    }
  };

  useEffect(() => {
    loadCartItems(props?.route?.params?.cartId);
  }, [props?.route?.params?.cartId]);

  return (
    <>
      <Header
        backNavigationIcon={backNavigationIcon}
        headerTitle={props?.route?.params?.storeName}
        cartIcon={cartIcon}
        onPress={() => {
          analytic().trackEvent('StoreInventory', {
            CTA: 'backIcon',
          });
          navigation.goBack();
        }}
      />
      <View style={styles.storeProductView}>
        <FlatList
          data={cartItems}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <ItemCard
              item={item}
              cartId={props?.cartId}
              vendorName={props?.cartName}
              productImage={item?.img}
              productName={item?.name}
              sellingPrice={item?.mrp}
              quantity={item?.quantity}
              discount="1% off"
              buttonMarginRight={scaledValue(73)}
              counterValueButton
              onPress={() =>
                navigation.navigate('ItemScreen', {
                  item,
                  storeId: props?.route?.params?.storeId,
                })
              }
              refreshCartItems={() =>
                loadCartItems(props?.route?.params?.cartId)
              }
            />
          )}
          ItemSeparatorComponent={() => (
            <DividerLine width={scaledValue(616)} />
          )}
        />
      </View>
      <Footer
        cartValue={cartValue || 0}
        onPress={() => {
          analytic().trackEvent('Cart', {
            CTA: 'proceedToCheckout',
          });
          //   navigation.navigate('PaymentScreen', {cartValue});
          console.log('cartItems', cartItems);
          initOrder(
            {
              id: '5666-ONDC-1',
              locations: [
                {
                  id: '5666-ONDC-1-3308_location',
                },
              ],
            },
            [
              {
                id: '5666-ONDC-1-29',
                quantity: {
                  count: 2,
                },
              },
            ],
            {
              name: 'Sathis palaniappan ',
              address: {
                door: '22/A, Akshaya homes, 5th floor, ',
                name: 'Puttappa Layout, New thippasandra layout',
                locality: 'Puttappa Layout, New thippasandra layout',
                city: 'Bangalore',
                state: 'Karnataka',
                country: '',
                area_code: '560075',
              },
              email: 'sathis palaniappan @gmail.com',
              phone: '9740068310',
              created_at: '2022-06-10T09:53:55.742Z',
              updated_at: '2022-06-10T09:53:55.742Z',
            },
            {
              collected_by: 'BAP',
              collected_by_status: 'Agree',
              type: 'ON-ORDER',
            },
            {
              type: 'Delivery',
              tracking: false,
              end: {
                location: {
                  gps: '12.96979,77.6565',
                  address: {
                    door: '22/A, Akshaya homes, 5th floor, ',
                    name: 'Puttappa Layout, New thippasandra layout',
                    locality: 'Puttappa Layout, New thippasandra layout',
                    city: 'Bangalore',
                    state: 'Karnataka',
                    country: '',
                    area_code: '560075',
                  },
                },
                contact: {
                  phone: '9740068310',
                },
              },
            },
            console.log('init', init),
          );
        }}
        footerTitle="Checkout"
      />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Home');
        }}
        style={styles.plusIconRight}>
        <Image source={addMoreIcon} style={styles.plusIcon} />
      </TouchableOpacity>
    </>
  );
};

export default CartItemCard;

const styles = StyleSheet.create({
  storeProductView: {
    elevation: 1,
    marginHorizontal: scaledValue(34),
    marginTop: scaledValue(26),
    borderRadius: scaledValue(32),
    paddingVertical: scaledValue(26),
    paddingHorizontal: scaledValue(30),
  },
  storeName: {
    color: 'gray',
    fontSize: scaledValue(24),
    fontFamily: 'Lato-Bold',
    marginBottom: scaledValue(26),
  },
  plusIcon: {
    width: scaledValue(122),
    height: scaledValue(122),
  },
  plusIconRight: {
    left: scaledValue(314),
    position: 'absolute',
    bottom: scaledValue(56),
  },
});
