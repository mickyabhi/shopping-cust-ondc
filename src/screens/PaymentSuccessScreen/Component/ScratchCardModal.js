import React from 'react';
import {StyleSheet, Text, Image} from 'react-native';
import {Modal} from 'react-native-paper';
import {scaledValue} from '../../../utils/design.utils';
import giftEarned from '../../../../assets/images/giftEarnedImg.png';
import noGiftEarned from '../../../../assets/images/noRewardEarned.png';
const ScratchCardModal = props => {
  return (
    <Modal
      visible={props?.visible}
      onDismiss={props?.hideModal}
      contentContainerStyle={styles.scratchCardModal}>
      <Image
        style={styles.imageStyle}
        source={props?.scratchCard === 'N' ? noGiftEarned : giftEarned}
      />
    </Modal>
  );
};

export default ScratchCardModal;

const styles = StyleSheet.create({
  scratchCardModal: {
    left: scaledValue(91),
  },
  imageStyle: {
    width: scaledValue(566),
    height: scaledValue(586),
  },
});
