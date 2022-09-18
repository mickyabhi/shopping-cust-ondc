import React, {useEffect, useState} from 'react';
import {StatusBar, View, SafeAreaView, Image, Text} from 'react-native';
import DesignImage from '../../../assets/images/white_board.png';
import {scaledValue} from '../../utils/design.utils';
import tickImage from '../../../assets/images/tick_image.png';
import ButtonUi from '../../components/Button';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {analytic} from '../../utils/analytics';
import {styles} from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {getScratchCard, saveScratchCard} from '../AppStore/actions';
import {getItemFromAsyncStorage} from '../../utils/storage.utils';
import ScratchCardModal from './Component/ScratchCardModal';

const PaymentSuccess = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [cartValue] = useState(props?.route?.params?.cartValue);
  const scratchCard = useSelector(state => state?.scratchCard);
  const [showScratchCard, setShowScratchCard] = useState(false);
  const requestForScratchCard = async cartValue => {
    let currentUserId = await getItemFromAsyncStorage('current_user_id');
    currentUserId = currentUserId.slice(3);
    if (currentUserId && cartValue) {
      dispatch(
        getScratchCard(
          currentUserId,
          '0',
          cartValue,
          props?.route?.params?.shortId,
        ),
      );
    }
  };

  console.log('scratchCard', scratchCard);

  useEffect(() => {
    requestForScratchCard(cartValue);
  }, [cartValue]);

  useEffect(() => {
    if (scratchCard != null) {
      setShowScratchCard(true);
    }
  }, [scratchCard]);

  return (
    <SafeAreaView style={styles.paymentSuccessView}>
      <StatusBar hidden={true} showHideTransition="fade" />
      <LinearGradient
        colors={['#F78326', '#F8993A', '#F78326']}
        useAngle={true}
        angle={90}
        style={styles.paymentSuccessMainView}>
        <Image
          source={DesignImage}
          style={styles.designImage}
          resizeMode="stretch"
        />
        <Image source={tickImage} style={styles.tickImage} />
        <Text allowFontScaling={false} style={styles.paymentIdText}>
          Payment of your order ID {props?.route?.params?.shortId} is successful
        </Text>
        <View style={styles.paymentScreenSecondary}>
          <View style={styles.orderCard}>
            <View style={styles.orderCardTextView}>
              <Text allowFontScaling={false} style={styles.rsLeftText}>
                Order Amount
              </Text>
              <Text allowFontScaling={false} style={styles.rsRightText}>
                ₹{cartValue}
              </Text>
            </View>
            <View style={styles.orderCardTextView}>
              <Text allowFontScaling={false} style={styles.orderLeftText}>
                Payment ID
              </Text>
              <Text allowFontScaling={false} style={styles.orderIdRightText}>
                {props?.route?.params?.paymentId}
              </Text>
            </View>
            <View style={styles.orderCardTextView}>
              <Text allowFontScaling={false} style={styles.orderStatusLeftText}>
                Status
              </Text>
              <Text
                allowFontScaling={false}
                style={styles.orderStatusRightText}>
                Acknowledge
              </Text>
            </View>
          </View>

          <ButtonUi
            width={scaledValue(666)}
            height={scaledValue(103)}
            color={'#fff'}
            backgroundColor={'#F8993A'}
            borderColor={'#F8993A'}
            title={'Done'}
            fSize={scaledValue(30)}
            borderRadius={scaledValue(8)}
            onPress={() => {
              analytic().trackEvent('PaymentSuccessScreen', {
                CTA: 'paymentDone',
              });
              navigation.replace('Home');
            }}
          />
          <View style={styles.emptyView} />
        </View>
      </LinearGradient>
      <ScratchCardModal
        scratchCard={scratchCard?.ScratchcardEarned}
        visible={showScratchCard}
        hideModal={() => {
          setShowScratchCard(false);
          dispatch(saveScratchCard(null));
        }}
      />
    </SafeAreaView>
  );
};

export default PaymentSuccess;
