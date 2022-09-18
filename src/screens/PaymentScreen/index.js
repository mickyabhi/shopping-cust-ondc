import React, {useState} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import Header from '../../components/Header';
import {scaledValue} from '../../utils/design.utils';
import ButtonUi from '../../components/Button';
import BackIcon from '../../../assets/images/BackIcon.png';
import {useNavigation} from '@react-navigation/native';
import ApplyCouponModal from './Component/ApplyCouponModal';
import editIcon from '../../../assets/images/edit-icon.png';
import paytmImage from '../../../assets/images/paytm_Img.png';
import {analytic} from '../../utils/analytics';
const Payment = props => {
  console.log('props', props?.route?.params?.cartValue);
  const [showApplyCouponModal, setShowApplyCouponModal] = useState(false);
  const navigation = useNavigation();
  return (
    <View style={styles.paymentScreenView}>
      <Header
        backNavigationIcon={BackIcon}
        headerTitle="Payment"
        onPress={() => {
          analytic().trackEvent('PaymentScreen', {
            CTA: 'backIcon',
          });
          navigation.goBack();
        }}
      />
      <View style={styles.paymentScreenMainView}>
        <View style={styles.orderPaymentView}>
          <Text style={styles.orderPaymentText}>Shipping Address</Text>
          <Text style={styles.userNameText}>Abhilasha Mishra</Text>
          <Text style={styles.addressText}>
            531 Pittston Ave, Nandini Layout, PA 18505, Bengaluru - 560096
          </Text>
          <Image source={editIcon} style={styles.editIcon} />
        </View>

        <View style={styles.orderPaymentView}>
          <Text style={styles.orderPaymentText}>Payment Method</Text>
          <View style={styles.paymentView}>
            <Image source={paytmImage} style={styles.paymentIcon} />
            <Text style={styles.paymentText}>Visa **** 0959</Text>
          </View>
          <Image source={editIcon} style={styles.editIconPayment} />
        </View>

        <View style={styles.appliedCouponView}>
          <View style={styles.onlinePaymentTextView}>
            <Text allowFontScaling={false} style={styles.leftTextAppliedCoupon}>
              Price:
            </Text>
            <Text
              allowFontScaling={false}
              style={styles.rightTextAppliedCoupon}>
              ₹{props?.route?.params?.cartValue?.toFixed(2)}
            </Text>
          </View>
          <View style={styles.appliedCouponTextView}>
            <Text allowFontScaling={false} style={styles.leftTextAppliedCoupon}>
              Discounts:
            </Text>
            <Text
              allowFontScaling={false}
              style={styles.rightTextAppliedCoupon}>
              ₹0
            </Text>
          </View>

          <View style={styles.shippingText}>
            <Text allowFontScaling={false} style={styles.leftTextAppliedCoupon}>
              Shipping:
            </Text>
            <Text
              allowFontScaling={false}
              style={styles.rightTextAppliedCoupon}>
              Free
            </Text>
          </View>
        </View>
        <View style={styles.paymentTextView}>
          <Text allowFontScaling={false} style={styles.orderPaymentText2}>
            Total Price
          </Text>
          <Text allowFontScaling={false} style={styles.rsText2}>
            ₹ {props?.route?.params?.cartValue?.toFixed(2)}
          </Text>
        </View>
        <ButtonUi
          title="Proceed To Pay"
          width={scaledValue(666)}
          height={scaledValue(103)}
          color="#fff"
          fontFamily="Lato-Semibold"
          borderColor="#F8993A"
          backgroundColor="#F8993A"
          onPress={() => {
            analytic().trackEvent('PaymentScreen', {
              CTA: 'proceedToPay',
            });
            navigation.navigate('PaymentMethod');
          }}
        />
      </View>
      <ApplyCouponModal
        visible={showApplyCouponModal}
        onDismiss={() => {
          analytic().trackEvent('PaymentScreen', {
            CTA: 'hideApplyCouponModal',
          });
          setShowApplyCouponModal(false);
        }}
      />
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  paymentScreenView: {
    flex: 1,
  },
  paymentScreenMainView: {
    flex: 1,
    paddingVertical: scaledValue(26),
    paddingHorizontal: scaledValue(34),
  },
  orderPaymentView: {
    width: scaledValue(681),
    borderRadius: scaledValue(21),
    borderColor: '#E2E2E2',
    borderWidth: scaledValue(3),
    paddingLeft: scaledValue(43),
    paddingRight: scaledValue(27),
    paddingVertical: scaledValue(32.5),
    marginBottom: scaledValue(32),
  },
  orderPaymentText: {
    fontSize: scaledValue(28),
    color: '#F47329',
    fontFamily: 'Lato-Bold',
  },
  rsText: {
    fontSize: scaledValue(32),
    color: '#fff',
    fontFamily: 'Lato-Semibold',
    lineHeight: scaledValue(39),
  },
  orText: {
    fontSize: scaledValue(29),
    lineHeight: scaledValue(35),
    marginBottom: scaledValue(28),
    marginTop: scaledValue(30),
    marginLeft: scaledValue(7),
    fontFamily: 'Lato-Regular',
  },
  couponCodeText: {
    fontSize: scaledValue(26),
    lineHeight: scaledValue(32),
    marginLeft: scaledValue(7),
    color: '#4A4A4A',
    marginBottom: scaledValue(13.77),
    fontFamily: 'Lato-Regular',
  },
  applyCouponCodeInputText: {
    width: scaledValue(484.67),
    height: scaledValue(67.88),
    fontSize: scaledValue(25),
    fontFamily: 'Lato-Regular',
    color: 'black',
    backgroundColor: '#fff',
  },
  couponApplyView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: scaledValue(60),
    borderBottomWidth: 0.5,
    borderColor: 'gray',
    alignItems: 'flex-end',
  },
  appliedCouponView: {
    // borderColor: 'gray',
    // borderBottomWidth: 0.5,
    paddingVertical: scaledValue(26.24),
    marginTop: scaledValue(81.94),
  },
  paymentTextView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scaledValue(20),
    marginBottom: scaledValue(54.27),
    marginTop: scaledValue(25.76),
  },
  orderPaymentText2: {
    fontSize: scaledValue(28),
    fontFamily: 'Lato-Semibold',
    color: 'gray',
  },
  rsText2: {
    fontSize: scaledValue(32),
    fontFamily: 'Lato-Medium',
    lineHeight: scaledValue(39),
  },
  onlinePaymentTextView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scaledValue(28),
    paddingHorizontal: scaledValue(12),
  },
  appliedCouponTextView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scaledValue(12),
  },
  shippingText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scaledValue(12),
    marginTop: scaledValue(28),
  },
  leftTextAppliedCoupon: {
    color: 'gray',
    fontSize: scaledValue(28),
    fontFamily: 'Lato-Semibold',
  },
  rightTextAppliedCoupon: {
    fontSize: scaledValue(28),
    fontFamily: 'Lato-Bold',
  },
  userNameText: {
    fontSize: scaledValue(32),
    fontFamily: 'Lato-Medium',
    marginTop: scaledValue(19),
  },
  addressText: {
    width: scaledValue(500),
    color: 'grey',
    marginTop: scaledValue(16),
  },
  editIcon: {
    width: scaledValue(88),
    height: scaledValue(88),
    position: 'absolute',
    bottom: scaledValue(21),
    right: scaledValue(27),
  },
  editIconPayment: {
    width: scaledValue(88),
    height: scaledValue(88),
    alignSelf: 'flex-end',
  },
  paymentIcon: {
    width: scaledValue(56),
    height: scaledValue(36),
  },
  paymentView: {
    flexDirection: 'row',
    marginTop: scaledValue(46.5),
  },
  paymentText: {
    fontSize: scaledValue(28),
    fontFamily: 'Lato-Medium',
    color: '#000000',
    marginLeft: scaledValue(20),
  },
});
