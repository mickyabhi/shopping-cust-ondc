import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {Appbar, IconButton} from 'react-native-paper';
import {scaledValue} from '../../utils/design.utils';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {Avatar} from 'react-native-paper';
import {analytic} from '../../utils/analytics';
import Badge from '../Badge';
import {
  fetchCurrentCarts,
  fetchNotification,
} from '../../screens/AppStore/actions';
import {useDispatch, useSelector} from 'react-redux';
import {API} from 'aws-amplify';
import * as queries from '../../graphql/queries';
import * as subscriptions from '../../graphql/subscriptions';
import {styles} from './styles';

const Header = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [cartQuantities, setCartQuantities] = useState(null);
  const currentCarts = useSelector(state => state?.currentCarts);
  const notification = useSelector(state => state?.notifications);
  const userData = useSelector(state => state?.userData);

  const unReadNotification = () => {
    return notification?.filter(item => item?.isRead != true);
  };
  useEffect(() => {
    unReadNotification();
  }, [notification]);

  useEffect(() => {
    dispatch(fetchCurrentCarts());
    const topicId = userData?.id?.replace('+', '_');

    const subscription = API.graphql({
      query: subscriptions.onCreateNotificationByTopic,
      variables: {topic: 'CAU' + topicId},
    }).subscribe({
      next: () => {
        dispatch(fetchNotification('CAU' + topicId));
        dispatch(fetchCurrentCarts());
      },
      error: error => {
        console.log('subscribe.error', JSON.stringify(error));
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (currentCarts == null) return;

    setCartQuantities(null);
    let count = 0;

    currentCarts?.forEach(async element => {
      const cartItem = await API.graphql({
        query: queries.ondcCartsItemsByCartId,
        variables: {ondcCartId: element.id, limit: 10000},
      }).then(resp =>
        resp.data.ondcCartsItemsByCartId.items.map(item => item.quantity),
      );

      count += cartItem.reduce((a, b) => a + b, 0);
      setCartQuantities(count);
    });
  }, [currentCarts]);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="#F78326" />
      <LinearGradient colors={['#F78326', '#F8993A']}>
        <Appbar.Header style={styles.Appbar}>
          <View style={styles.leftIcons}>
            <IconButton
              style={styles.drawerIconTouchableOpacity}
              icon={props.drawerIcon || props.backNavigationIcon}
              color="#fff"
              size={props.drawerIcon ? scaledValue(88) : scaledValue(26)}
              onPress={props.onPress}
            />
            {props.titleText && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SetLocationScreen');
                }}>
                <Text
                  allowFontScaling={false}
                  style={styles.labelText}
                  numberOfLines={1}>
                  {props?.titleText}
                </Text>
              </TouchableOpacity>
            )}

            {props.avatarImage && (
              <Avatar.Image
                size={scaledValue(85)}
                source={{uri: props?.avatarImage}}
                style={styles.avatarImage}
              />
            )}

            {props.headerTitle && (
              <Text
                numberOfLines={1}
                allowFontScaling={false}
                style={styles.headerTitle}>
                {props.headerTitle}
              </Text>
            )}
            {props?.dropDownIcon && props?.titleText && (
              <IconButton
                icon={props.dropDownIcon}
                color="#fff"
                size={scaledValue(21.22)}
                onPress={() => {
                  analytic().trackEvent('HomePage', {
                    CTA: 'homePageDropDownIcon',
                  });
                  navigation.navigate('SetLocationScreen');
                }}
              />
            )}
          </View>
          <View style={styles.rightIcons}>
            {props.searchIcon && (
              <IconButton
                style={styles.fileIconView}
                icon={props.searchIcon}
                color="#fff"
                size={scaledValue(88)}
                onPress={props?.searchOnPress}
              />
            )}
            {props?.fileIcon && (
              <IconButton
                style={styles.fileIconView}
                icon={props?.fileIcon}
                color="#fff"
                size={scaledValue(88)}
                onPress={() => {
                  analytic().trackEvent('HomePage', {
                    CTA: 'notification',
                  });
                }}
              />
            )}
            {props?.cartIcon && (
              <>
                <IconButton
                  style={styles.cartIconView}
                  icon={props?.cartIcon}
                  color="#fff"
                  size={scaledValue(88)}
                  onPress={() => {
                    analytic().trackEvent('HomePage', {
                      CTA: 'Cart',
                    });
                    navigation.navigate('CartScreen');
                  }}
                />
              </>
            )}
            {/* <TouchableOpacity onPress={props?.markAllAsReadHandler}>
              <Text allowFontScaling={false} style={styles.textButton}>
                {props.textButton}
              </Text>
            </TouchableOpacity> */}
          </View>
          {props?.cartIcon && <Badge cartItems={cartQuantities} />}
          {props?.notificationBell && (
            <Badge notification={unReadNotification()?.length} />
          )}
        </Appbar.Header>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Header;
