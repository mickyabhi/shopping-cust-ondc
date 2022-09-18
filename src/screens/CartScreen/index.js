import React, {useEffect, useState} from 'react';
import {View, FlatList} from 'react-native';
import Header from '../../components/Header';
import {useNavigation} from '@react-navigation/native';
import backIcon from '../../../assets/images/BackIcon.png';
import {analytic} from '../../utils/analytics';
import {styles} from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {fetchCurrentCarts} from '../AppStore/actions';
import CartStoreCard from '../CartStoreScreen/Component/CartStoreCard';
import DeleteCartModal from '../CartStoreScreen/Component/DeleteCartModal';
import {API} from 'aws-amplify';
import * as mutations from '../../graphql/mutations';

const Cart = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const currentCarts = useSelector(state => state?.currentCarts);
  const [deleteCartModal, setDeleteCartModal] = useState(false);
  const [selectedCartForAction, setSelectedCartForAction] = useState(null);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    dispatch(fetchCurrentCarts());
  }, []);

  const viewStoreCartHandler = (cartId, storeId, storeName) => {
    navigation.navigate('CartItemScreen', {cartId, storeId, storeName});
  };

  const deleteCart = async cartId => {
    setDeleteCartModal(false);
    if (cartId) {
      await API.graphql({
        query: mutations.deleteOndcCart,
        variables: {input: {id: cartId}},
      }).then(() => dispatch(fetchCurrentCarts()));
    }
  };

  return (
    <>
      <Header
        backNavigationIcon={backIcon}
        headerTitle="Carts"
        onPress={() => {
          analytic().trackEvent('Cart', {
            CTA: 'backIcon',
          });
          navigation.goBack();
        }}
      />
      <View style={styles.cartUpperView}>
        <FlatList
          data={currentCarts}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <CartStoreCard
              storeName={item?.storeName}
              cartId={item.id}
              onPress={() =>
                viewStoreCartHandler(item?.id, item?.storeId, item?.storeName)
              }
              onPressDelete={() => {
                analytic().trackEvent('CartStore', {
                  CTA: 'deleteCartStoreCard',
                });
                setDeleteCartModal(true);
                setSelectedCartForAction(item);
                setCart(item);
              }}
            />
          )}
        />
      </View>
      {selectedCartForAction && (
        <DeleteCartModal
          visible={deleteCartModal}
          onDismiss={() => {
            analytic().trackEvent('CartStore', {
              CTA: 'hideDeleteCartModal',
            });
            setSelectedCartForAction(null);
            setDeleteCartModal(false);
          }}
          selectedStoreName={cart?.storeName}
          onPress={() => deleteCart(cart?.id)}
        />
      )}
    </>
  );
};

export default Cart;
