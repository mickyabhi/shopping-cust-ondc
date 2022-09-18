import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Modal} from 'react-native-paper';
import {ScratchCard} from 'rn-scratch-card';
import greenCard from '../../../../../assets/images/greenCard.png';
import giftIcon from '../../../../../assets/images/giftIcon.png';
import {scaledValue} from '../../../../utils/design.utils';
const ScratchableCard = props => {
  console.log('scratchCardModalData', props?.scratchCardModalData);
  return (
    <Modal
      visible={props.visible}
      onDismiss={props.hideModal}
      contentContainerStyle={styles.scratchableCardView}>
      <>
        {props?.scratchCardModalData?.Scratchable === 'Y' && (
          <>
            <View style={styles.unScratchedCard}>
              <Text style={styles.titleText}>
                {props?.scratchCardModalData?.Title}
              </Text>
              <Image source={giftIcon} style={styles.giftIcon} />
              <Text style={styles.msgText}>
                {props?.scratchCardModalData?.Message}
              </Text>
              <Text style={styles.amountText}>
                ₹ {props?.scratchCardModalData?.Amount}
              </Text>
              <Text style={styles.expiryMsgText}>
                {props?.scratchCardModalData?.ExpiryMessage}
              </Text>
            </View>
            <ScratchCard
              source={greenCard}
              brushWidth={50}
              onScratch={props.onScratch}
              style={styles.scratchCard}
            />
          </>
        )}
        {props?.scratchCardModalData?.Scratchable !== 'Y' && (
          <View style={styles.unScratchedCard}>
            <Text style={styles.titleText}>
              {props?.scratchCardModalData?.Title}
            </Text>
            <Image source={giftIcon} style={styles.giftIcon} />
            <Text style={styles.msgText}>
              {props?.scratchCardModalData?.Message}
            </Text>
            <Text style={styles.amountText}>
              ₹ {props?.scratchCardModalData?.Amount}
            </Text>
            <Text style={styles.expiryMsgText}>
              {props?.scratchCardModalData?.ExpiryMessage}
            </Text>
          </View>
        )}
      </>
    </Modal>
  );
};

export default ScratchableCard;

const styles = StyleSheet.create({
  scratchCard: {
    width: scaledValue(551),
    height: scaledValue(551),
    backgroundColor: 'transparent',
    left: scaledValue(99),
  },
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
    width: scaledValue(523.57),
    height: scaledValue(523.57),
    borderRadius: scaledValue(31),
    borderColor: '#707070',
    borderWidth: scaledValue(0.5),
    alignItems: 'center',
    paddingVertical: scaledValue(33.31),
    position: 'absolute',
    backgroundColor: '#fff',
    right: scaledValue(113.43),
  },
  titleText: {
    color: '#4A4A4A',
    fontFamily: 'Lato-Medium',
    fontSize: scaledValue(42),
    marginBottom: scaledValue(22.8),
  },
  expiryMsgText: {
    color: '#4A4A4A',
    fontSize: scaledValue(24),
    marginTop: scaledValue(6),
  },
  amountText: {
    color: '#4A4A4A',
    fontFamily: 'Lato-SemiBold',
    fontSize: scaledValue(65),
    marginVertical: scaledValue(14),
  },
  msgText: {
    fontSize: scaledValue(28),
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
    width: scaledValue(147.4),
    height: scaledValue(147.4),
    marginBottom: scaledValue(12),
  },
});
