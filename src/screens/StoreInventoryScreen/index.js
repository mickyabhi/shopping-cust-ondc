import React, {useEffect, useState} from 'react';
import {View, FlatList, Text} from 'react-native';
import Header from '../../components/Header';
import ItemCard from '../../components/ItemCard';
import backNavigationIcon from '../../../assets/images/BackIcon.png';
import cartIcon from '../../../assets/images/cartIcon.png';
import searchIcon from '../../../assets/images/search.png';
import {useNavigation} from '@react-navigation/native';
import {analytic} from '../../utils/analytics';
import {styles} from './styles';
import Filter from './Components/Filter';
import Sort from './Components/Sort';
import {checkResponse, searchProduct} from '../../services/ONDCAdapterService';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchCurrentCarts,
  showAlertToast,
  showLoading,
} from '../AppStore/actions';
import {scaledValue} from '../../utils/design.utils';
import * as mutations from '../../graphql/mutations';
import * as queries from '../../graphql/queries';
import DividerLine from '../../components/Divider';
import {API} from 'aws-amplify';
import {getItemFromAsyncStorage} from '../../utils/storage.utils';

const StoreInventory = props => {
  const navigation = useNavigation();
  const [searchRequestData, setSearchRequestData] = useState(null);
  const [searchResponseData, setSearchResponseData] = useState([]);
  const [productName] = useState(props?.route?.params?.productName);
  const loadingState = useSelector(state => state?.loadingState);
  const [products, setProducts] = useState([]);
  const [productOrderIsAce, setProductOrderIsAce] = useState(true);
  const [activeSortButton, setActiveSortButton] = useState('Sort');
  const dispatch = useDispatch();
  const searchOndcProduct = async searchText => {
    if (searchText) {
      dispatch(showLoading(true));
      const response = await searchProduct(searchText);
      if (response == null) {
        dispatch(showLoading(false));
        return;
      }
      setSearchRequestData(response?.data);
    }
  };
  const checkSearchResponse = async message_id => {
    setSearchResponseData([]);
    const res = await checkResponse('on_search', message_id, message_id);
    if (res == null) {
      dispatch(showLoading(false));
      return;
    }
    setSearchResponseData(prev => [...prev, ...res?.data]);
  };

  useEffect(() => {
    if (searchRequestData != null) {
      setTimeout(() => {
        checkSearchResponse(searchRequestData?.context?.message_id);
      }, 10000);
    }
  }, [searchRequestData]);
  useEffect(() => {
    if (productName != null) {
      searchOndcProduct(productName);
    }
  }, [productName]);
  const mappingOfItems = () => {
    setProducts([]);
    if (searchResponseData?.length !== 0) {
      let filteredDescriptors = searchResponseData?.filter(item => {
        return (
          JSON?.parse(item?.json)?.message?.catalog?.['bpp/providers'] !=
            null &&
          JSON?.parse(item?.json)?.message?.catalog?.['bpp/descriptor'] !=
            null &&
          JSON?.parse(item?.json)?.message?.catalog?.['bpp/providers'][0]?.items
            ?.length !== 0
        );
      });
      filteredDescriptors = filteredDescriptors.map(
        item => JSON.parse(item?.json)?.message?.catalog?.['bpp/providers'][0],
      );

      filteredDescriptors?.forEach(store => {
        store?.items?.forEach(item => {
          item.vendorName = store?.descriptor?.name;
          item.storeId = store?.id;
          setProducts(curr => [...curr, item]);
        });
      });
      dispatch(showLoading(false));
    }
  };

  useEffect(() => {
    mappingOfItems();
  }, [searchResponseData]);

  const sortOrderOfProducts = () => {
    if (activeSortButton === 'Sort') {
      if (productOrderIsAce) {
        return products.sort((a, b) =>
          a?.descriptor?.name?.localeCompare(b?.descriptor?.name),
        );
      } else {
        return products.sort((a, b) =>
          b?.descriptor?.name?.localeCompare(a?.descriptor?.name),
        );
      }
    }
    if (activeSortButton === 'Filter') {
      if (productOrderIsAce) {
        return products.sort((a, b) => a?.price?.value - b?.price?.value);
      } else {
        return products.sort((a, b) => b?.price?.value - a?.price?.value);
      }
    }
  };

  const addItemInCart = async (cart, cartItem) => {
    const isCartItemExist = await API.graphql({
      query: queries.getOndcCartItem,
      variables: {id: cartItem?.id + cart?.id},
    })
      .then(resp => resp?.data?.getOndcCartItem)
      .catch(() => {
        dispatch(
          showAlertToast({
            alertMessage: 'Not able to add item in your cart',
          }),
        );
        dispatch(showLoading(false));
      });

    const ondcCartItemInput = {
      id: cartItem?.id + cart?.id,
      ondcCartId: cart?.id,
      ondcCartItemOndcCartId: cart?.id,
      name: cartItem?.descriptor?.name,
      img: cartItem?.descriptor?.images[0],
      mrp: cartItem?.price?.value,
      quantity: isCartItemExist ? isCartItemExist?.quantity + 1 : 1,
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
          dispatch(fetchCurrentCarts());
          dispatch(
            showAlertToast({
              alertMessage: '1 item added in your cart',
            }),
          );
          dispatch(showLoading(false));
        })
        .catch(() => {
          dispatch(
            showAlertToast({
              alertMessage: 'Not able to add item i your cart',
            }),
          );
          dispatch(showLoading(false));
        });
      return;
    }

    if (cart && cartItem) {
      await API.graphql({
        query: mutations.createOndcCartItem,
        variables: {input: ondcCartItemInput},
      })
        .then(() => {
          dispatch(fetchCurrentCarts());
          dispatch(
            showAlertToast({
              alertMessage: '1 item added in your cart',
            }),
          );
          dispatch(showLoading(false));
        })
        .catch(() => {
          dispatch(
            showAlertToast({
              alertMessage: 'Not able to add item in your cart',
            }),
          );
          dispatch(showLoading(false));
        });
    }
  };

  const addToCartHandler = async item => {
    const userId = await getItemFromAsyncStorage('current_user_id');
    dispatch(showAlertToast(null));
    dispatch(showLoading(true));
    const storeCarts = await API.graphql({
      query: queries.ondcCartsByUserId,
      variables: {
        userId,
        filter: {
          isOrderPlaced: {
            eq: false,
          },
          storeId: {eq: item?.storeId},
        },
      },
    })
      .then(resp => resp?.data?.ondcCartsByUserId?.items)
      .catch(() => {
        dispatch(
          showAlertToast({
            alertMessage: 'Not able to add item in your cart',
          }),
        );
        dispatch(showLoading(false));
      });
    if (storeCarts?.length > 0) {
      addItemInCart(storeCarts[0], item);
      return;
    }

    if (item && userId) {
      const ondcCartInput = {
        userId: userId,
        storeId: item?.storeId,
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
        .catch(() => {
          dispatch(
            showAlertToast({
              alertMessage: 'Not able to add item in your cart',
            }),
          );
          dispatch(showLoading(false));
        });
    }
  };

  return (
    <>
      <View style={styles.StoreInventoryOuterView}>
        <Header
          backNavigationIcon={backNavigationIcon}
          headerTitle={productName}
          searchIcon={searchIcon}
          cartIcon={cartIcon}
          onPress={() => {
            analytic().trackEvent('StoreInventory', {
              CTA: 'backIcon',
            });
            navigation.goBack();
          }}
          searchOnPress={() =>
            navigation.navigate('Home', {
              isSearchFocused: true,
            })
          }
        />
        <View style={styles.filterContainer}>
          <Sort
            name="Sort"
            onPress={() => {
              setProductOrderIsAce(!productOrderIsAce);
              setActiveSortButton('Sort');
            }}
          />
          <Filter
            name="Filter"
            onPress={() => {
              setProductOrderIsAce(!productOrderIsAce);
              setActiveSortButton('Filter');
            }}
          />
        </View>
        {!loadingState && products?.length === 0 && (
          <Text style={styles.noProductText}>No Products Listed</Text>
        )}
        <View style={styles.StoreInventoryMainView}>
          <FlatList
            data={sortOrderOfProducts()}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              return (
                products?.length !== 0 && (
                  <ItemCard
                    id={item?.id}
                    storeId={item?.storeId}
                    onPress={() => navigation.navigate('ItemScreen', {item})}
                    productName={item?.descriptor?.name || item?.productName}
                    sellingPrice={item?.price?.value || item?.sellingPrice}
                    vendorName={item?.vendorName}
                    productImage={
                      item?.descriptor?.images
                        ? item?.descriptor?.images[0]
                        : null
                    }
                    keyExtractor={(_, index) => index}
                    additionClickHandler={() => addToCartHandler(item)}
                  />
                )
              );
            }}
            ItemSeparatorComponent={() => (
              <DividerLine width={scaledValue(686)} />
            )}
          />
        </View>
      </View>
    </>
  );
};

export default StoreInventory;
