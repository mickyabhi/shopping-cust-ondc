import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, FlatList, Text, TouchableOpacity} from 'react-native';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';
import ProductCard from '../../components/ProductCards';
import {scaledValue} from '../../utils/design.utils';
import dropDownIcon from '../../../assets/images/DropDown.png';
import drawerIcon from '../../../assets/images/icon-menu.png';
import searchBarIcon from '../../../assets/images/SearchIcon.png';
import crossIcon from '../../../assets/images/cross-icon.png';
import fileIcon from '../../../assets/images/file-icon.png';
import cartIcon from '../../../assets/images/cartIcon.png';
import LogoutModal from './Components/LogoutModal';
import RateUsModal from './Components/RateUsModal';
import {useSelector, useDispatch} from 'react-redux';
import {
  showLogOutModal,
  showRateUsModal,
  fetchProductByMasterCategory,
  fetchUserData,
  fetchNotification,
  fetchAllProducts,
  showLoading,
} from '../AppStore/actions';
import {analytic} from '../../utils/analytics';
import {sortCategory} from '../../utils/constants';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {getItemFromAsyncStorage} from '../../utils/storage.utils';
import messaging from '@react-native-firebase/messaging';
import crashlytics from '@react-native-firebase/crashlytics';
import CategoryChip from '../../components/Chip';

const Home = props => {
  const isFocused = useIsFocused();
  const focusInput = useRef();
  const dispatch = useDispatch();
  const categoryRef = useRef();
  const navigation = useNavigation();
  const [searchValue, setSearchValue] = useState('');
  const logoutModalState = useSelector(state => state?.logOutModal);
  const rateUsModalState = useSelector(state => state?.rateUsModal);
  const categories = useSelector(state => state?.categories);
  const subCategories = useSelector(state => state?.subCategories);
  const productByMasterCat = useSelector(
    state => state?.productByMasterCategory,
  );
  const userData = useSelector(state => state?.userData);
  const userAddress = useSelector(state => state?.userData?.addresses?.items);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  useEffect(() => {
    filterProductByMasterCat();
  }, [selectedCategory]);
  const setLocation = async () => {
    if (userLocation != null) return;

    const lat = await getItemFromAsyncStorage('latitude');
    const long = await getItemFromAsyncStorage('longitude');

    setUserLocation({
      latitude: lat,
      longitude: long,
    });
  };

  const handleOnKeyPress = key => {
    if (key === 'Enter' && searchValue !== '') {
      navigation.navigate('StoreInventory', {productName: searchValue});
    }
  };

  const getSelectedAddress = async () => {
    const address = await getItemFromAsyncStorage('selectedAddress');
    if (address != null) {
      setSelectedAddress(JSON.parse(address));
    } else {
      setSelectedAddress(
        userAddress?.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )[0],
      );
    }
  };

  const loadStoresData = () => {
    if (userData == null) dispatch(fetchUserData());
    if (userLocation == null) setLocation();
  };

  if (userData && userData?.id) {
    dispatch(fetchNotification('CAU' + userData?.id?.replace('+', '_')));
  }

  useEffect(() => {
    getSelectedAddress();

    if (userData?.id) {
      let topic = 'CAU' + userData?.id;
      topic = topic.replace('+', '_');
      console.log('subscribeToTopic.topic', topic);
      messaging()
        .subscribeToTopic(topic)
        .then(() => console.log('subscribeToTopic.success', topic))
        .catch(error => {
          crashlytics()?.recordError(error);
          console.log('subscribeToTopic.error', error);
          return null;
        });
    }
  }, [userAddress]);

  useEffect(() => {
    dispatch(showLoading(true));
    dispatch(fetchAllProducts());
    loadStoresData();
    dispatch(fetchProductByMasterCategory('All'));
  }, []);

  const focusSearchBar = () => {
    if (props?.route?.params?.isSearchFocused) {
      setSearchValue('');
      focusInput.current.focus();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      focusSearchBar();
    }, 500);
  }, [isFocused]);

  const filterProductByMasterCat = () => {
    if (selectedSubCategory === null) {
      return productByMasterCat;
    } else {
      return productByMasterCat?.filter(
        product => product?.category === selectedSubCategory,
      );
    }
  };

  const onCategorySelected = category => {
    analytic().trackEvent('HomePage', {
      CTA: 'selectedCategory',
      data: category,
    });

    setSelectedCategory(category);
    setSelectedSubCategory(null);
    dispatch(fetchProductByMasterCategory(category));
  };

  const handleNotificationNavigation = notification => {
    if (notification?.orderId != null) {
      navigation.navigate('OrdersDetailScreen', {
        orderId: notification?.orderId,
      });
    }
    if (notification?.conversationId != null) {
      navigation.navigate('ChatScreen', {
        conversationId: notification?.conversationId,
        storeId: notification?.storeId,
        shortId: notification?.shortId,
        storeName: notification?.storeName,
        storeImage: notification?.sortedStoreImage,
      });
    }
  };

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(notification => {
        if (notification) {
          notification = JSON.parse(notification?.data?.body);
          handleNotificationNavigation(notification);
        }
      });
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        remoteMessage = JSON.parse(remoteMessage?.data?.body);
        handleNotificationNavigation(remoteMessage);
      }
    });
    messaging().onMessage(message => {
      console.log('message.OS', message);
    });
  }, []);

  const filterSubCat = () => {
    if (selectedCategory !== 'All') {
      return [...new Set(productByMasterCat?.map(item => item?.category))];
    } else {
      return subCategories;
    }
  };

  const catHandler = index => {
    if (categories != null) {
      categoryRef.current.scrollToIndex({animated: true, index});
    }
  };

  const productCardHandler = itemName => {
    navigation.navigate('StoreInventory', {productName: itemName});
  };

  return (
    <View style={styles.homeView}>
      <Header
        drawerIcon={drawerIcon}
        titleText={`${selectedAddress?.address ||
          ''} ${selectedAddress?.location || ''} ${selectedAddress?.landmark ||
          ''}${selectedAddress?.city || ''} ${selectedAddress?.state ||
          ''} ${selectedAddress?.pincode || ''}`}
        dropDownIcon={dropDownIcon}
        fileIcon={fileIcon}
        cartIcon={cartIcon}
        onPress={() => {
          analytic().trackEvent('HomeScreen', {
            CTA: 'Drawer',
          });
          navigation.toggleDrawer();
        }}
      />

      <View style={styles.itemsAvatar}>
        <SearchBar
          inputRef={focusInput}
          placeholder="Search for Products, Brands and More"
          color="#B2B2B2"
          size={scaledValue(33.94)}
          crossIconSize={scaledValue(63)}
          icon={searchBarIcon}
          crossIcon={crossIcon}
          value={searchValue}
          onKeyPress={e => handleOnKeyPress(e.nativeEvent.key)}
          onChangeText={text => {
            setSearchValue(text);
          }}
          onPress={() => {
            if (searchValue !== '') {
              productCardHandler(searchValue);
            }
          }}
          onSubmitEditing={() => handleOnKeyPress('Enter')}
          crossButton={() => setSearchValue('')}
          showCrossButton={searchValue !== ''}
        />
        <FlatList
          ref={categoryRef}
          data={sortCategory(categories)}
          showsHorizontalScrollIndicator={false}
          horizontal
          keyExtractor={index => index}
          renderItem={({item, index}) => (
            <CategoryChip
              catName={item}
              mode="outlined"
              backgroundColor={
                selectedCategory === item ? '#fff' : 'transparent'
              }
              selectedColor={selectedCategory === item ? '#F6692F' : '#fff'}
              onPress={() => {
                onCategorySelected(item);
                catHandler(index);
              }}
            />
          )}
        />
        <FlatList
          data={filterSubCat()}
          showsHorizontalScrollIndicator={false}
          horizontal
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedSubCategory(item);
              }}>
              <Text style={styles.subCatText(item, selectedSubCategory)}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.lowerView}>
        <FlatList
          data={filterProductByMasterCat()}
          showsVerticalScrollIndicator={false}
          numColumns={3}
          renderItem={({item}) => (
            <ProductCard
              productName={item?.description}
              item={item}
              onPress={() => productCardHandler(item?.description)}
            />
          )}
        />
      </View>

      {logoutModalState && (
        <LogoutModal
          visible={logoutModalState}
          onDismiss={() => {
            analytic().trackEvent('HomePage', {
              CTA: 'logoutCancel',
            });
            dispatch(showLogOutModal(false));
          }}
        />
      )}

      <RateUsModal
        visible={rateUsModalState}
        onDismiss={() => {
          analytic().trackEvent('HomePage', {
            CTA: 'rateUsLater',
          });
          dispatch(showRateUsModal(false));
        }}
      />
    </View>
  );
};
export default Home;
const styles = StyleSheet.create({
  homeView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemsAvatar: {
    paddingHorizontal: scaledValue(32),
    backgroundColor: '#F8993A',
    paddingBottom: scaledValue(39.38),
    borderBottomLeftRadius: scaledValue(20),
    borderBottomRightRadius: scaledValue(20),
  },
  lowerView: {
    flex: 1,
    paddingVertical: scaledValue(21.96),
    alignItems: 'center',
  },
  subCatText: (item, selectedSubCategory) => ({
    marginRight: scaledValue(35.41),
    color: '#ffffff',
    fontSize: scaledValue(26),
    fontFamily: 'Lato-Bold',
    textAlign: 'center',
    paddingBottom: scaledValue(10),
    borderBottomColor: item === selectedSubCategory ? '#ffffff' : '#F8993A',
    borderBottomWidth:
      item === selectedSubCategory ? scaledValue(4) : scaledValue(0),
  }),
});
