import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {scaledValue} from '../../utils/design.utils';
import giftIcon from '../../../assets/images/giftIcon.png';
import {TouchableRipple} from 'react-native-paper';

const RewardCard = props => {
  return (
    <>
      {props?.isScratched === 'Y' && (
        <TouchableRipple onPress={props?.onPress} style={styles.scratchedCard}>
          <>
            <Image style={styles.giftImg} source={giftIcon} />
            {props?.activateMessage !== '' && (
              <View style={styles.activeMsgView}>
                <Text style={styles.activeMsgText}>
                  {props?.activateMessage}
                </Text>
              </View>
            )}
          </>
        </TouchableRipple>
      )}
      {props?.isScratched !== 'Y' && (
        <View style={styles.unScratchedCard}>
          <Text style={styles.titleText}>{props?.title}</Text>
          <Image source={giftIcon} style={styles.giftIcon} />
          <Text style={styles.msgText}>{props?.message}</Text>
          <Text style={styles.amountText}>₹ {props?.amount}</Text>
          <Text style={styles.expiryMsgText}>{props?.expiryMessage}</Text>
        </View>
      )}
    </>
  );
};

export default RewardCard;

const styles = StyleSheet.create({
  scratchedCard: {
    width: scaledValue(299),
    height: scaledValue(299),
    backgroundColor: '#00A74E',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaledValue(26),
    marginLeft: scaledValue(34),
    marginBottom: scaledValue(34),
  },
  unScratchedCard: {
    width: scaledValue(299),
    height: scaledValue(299),
    borderRadius: scaledValue(26),
    borderColor: '#707070',
    borderWidth: scaledValue(0.5),
    alignItems: 'center',
    paddingVertical: scaledValue(10.31),
    marginLeft: scaledValue(34),
    marginBottom: scaledValue(34),
  },
  titleText: {
    color: '#4A4A4A',
    fontFamily: 'Lato-Medium',
    fontSize: scaledValue(25),
    marginBottom: scaledValue(6.8),
  },
  expiryMsgText: {
    color: '#4A4A4A',
    fontSize: scaledValue(17),
    marginTop: scaledValue(6),
  },
  amountText: {
    color: '#4A4A4A',
    fontFamily: 'Lato-SemiBold',
    fontSize: scaledValue(45),
  },
  msgText: {
    fontSize: scaledValue(25),
    fontFamily: 'Lato-Medium',
    color: '#4A4A4A',
    width: scaledValue(250),
    marginVertical: scaledValue(6),
    textAlign: 'center',
  },
  activeMsgView: {
    width: scaledValue(298.15),
    height: scaledValue(60.11),
    backgroundColor: '#fff',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  giftImg: {
    width: scaledValue(126.2),
    height: scaledValue(126.2),
  },
  activeMsgText: {
    fontSize: scaledValue(17),
    fontFamily: 'Lato-Medium',
  },
  giftIcon: {
    width: scaledValue(94.89),
    height: scaledValue(89.88),
  },
});
