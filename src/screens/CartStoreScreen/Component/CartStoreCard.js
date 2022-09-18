import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {scaledValue} from '../../../utils/design.utils';
import Button from '../../../components/Button';
import {API} from 'aws-amplify';
import * as queries from '../../../graphql/queries';

const CartStoreCard = props => {
  const [cartValue, setCartValue] = useState(0);
  const [storeCartTotalItems, setStoreCartTotalItems] = useState(null);

  const loadStoreCartItem = async cartId => {
    const cartItem = await API.graphql({
      query: queries.ondcCartsItemsByCartId,
      variables: {ondcCartId: cartId},
    }).then(resp => resp.data.ondcCartsItemsByCartId.items);

    setStoreCartTotalItems(cartItem);

    let singleCartValue = 0;
    cartItem.forEach(cartItems => {
      if (cartItems.mrp) {
        singleCartValue += cartItems.mrp * cartItems.quantity;
      }
    });
    setCartValue(singleCartValue);
  };

  useEffect(() => {
    loadStoreCartItem(props.cartId);
  }, []);

  return (
    <View style={styles.CartStoreCardView}>
      <View style={styles.storeTitleView}>
        <Text allowFontScaling={false} style={styles.storeNameText}>
          {props?.storeName}
        </Text>
        {/* <Text allowFontScaling={false} style={styles.cardSmallerText}>
          city
        </Text> */}
      </View>
      <Text allowFontScaling={false} style={styles.subTitle}>
        {/* category */}
      </Text>
      <View style={styles.storeTitleView}>
        <View style={styles.orderValueTextView}>
          <Text allowFontScaling={false} style={styles.storeNameText}>
            Order Value:
          </Text>
          <Text allowFontScaling={false} style={styles.rsText}>
            ₹{cartValue?.toFixed(2)}
          </Text>
        </View>
        <Text allowFontScaling={false} style={styles.itemCountText}>
          {storeCartTotalItems?.length} Items
        </Text>
      </View>
      <View style={styles.buttonsView}>
        <Button
          borderRadius={scaledValue(8)}
          backgroundColor="gray"
          borderColor="gray"
          title="Delete cart"
          color="#fff"
          width={scaledValue(300)}
          height={scaledValue(57)}
          onPress={props.onPressDelete}
        />
        <Button
          borderRadius={scaledValue(8)}
          backgroundColor="#F8993A"
          borderColor="#F8993A"
          title="View Items"
          color="#fff"
          width={scaledValue(300)}
          height={scaledValue(57)}
          onPress={props.onPress}
        />
      </View>
    </View>
  );
};
export default CartStoreCard;
const styles = StyleSheet.create({
  CartStoreCardView: {
    width: scaledValue(668),
    borderRadius: scaledValue(8),
    paddingTop: scaledValue(19),
    paddingHorizontal: scaledValue(19),
    paddingBottom: scaledValue(28),
    borderWidth: scaledValue(1),
    borderColor: '#CDCDCD',
    shadowColor: '#CDCDCD',
    marginBottom: scaledValue(24),
  },
  storeTitleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  storeNameText: {
    fontSize: scaledValue(24),
    fontFamily: 'Lato-Semibold',
  },
  rsText: {
    fontSize: scaledValue(30),
    fontFamily: 'Lato-Semibold',
  },
  orderValueTextView: {
    flexDirection: 'row',
    fontSize: scaledValue(24),
  },
  buttonsView: {
    flexDirection: 'row',
    width: scaledValue(628),
    justifyContent: 'space-between',
    marginTop: scaledValue(14),
  },
  cardSmallerText: {
    color: '#CDCDCD',
    fontSize: scaledValue(18),
    fontFamily: 'Lato-Semibold',
  },
  subTitle: {
    color: '#CDCDCD',
    fontSize: scaledValue(18),
    marginBottom: scaledValue(14),
    marginTop: scaledValue(3),
  },
  itemCountText: {
    fontSize: scaledValue(24),
    fontFamily: 'Lato-Regular',
  },
});
