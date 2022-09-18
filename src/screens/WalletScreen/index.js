import React, {useState} from 'react';
import {View, FlatList} from 'react-native';
import Back_Navigation_Icon from '../../../assets/images/BackIcon.png';
import {useNavigation} from '@react-navigation/core';
import {Divider} from 'react-native-paper';
import receivedIcon from '../../../assets/images/receivedIcon.png';
import paidIcon from '../../../assets/images/paidIcon.png';
import unusedIcon from '../../../assets/images/unusedIcon.png';
import unusedActiveIcon from '../../../assets/images/unused-active.png';
import receivedActiveIcon from '../../../assets/images/received-active.png';
import paidIconActive from '../../../assets/images/paid-active.png';
import rewardsIconActive from '../../../assets/images/rewards-active.png';
import rewards from '../../../assets/images/rewards.png';
import WalletHeader from '../../components/WalletHeader';
import {styles} from './styles';
import WalletAvatar from './Components/WalletAvatar';
import {WalletType} from '../../utils/constants';
import WalletCard from './Components/WalletCard';
import ScratchableCardModal from './Components/ScratchableCardModal';
import {useDispatch, useSelector} from 'react-redux';
import RewardCard from '../../components/RewardCard';
import {fetchWalletDetail, reqToAddCardInWallet} from '../AppStore/actions';

const WalletScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const walletData = useSelector(state => state.userWalletDetail);
  const [avatarIconHandler, setAvatarIconHandler] = useState('Received');
  const [cardIcon, setCardIcon] = useState(receivedActiveIcon);
  const [showScratchableModal, setShowScratchableModal] = useState(false);
  const [scratchCardModalData, setScratchCardModalData] = useState(null);
  const [walletListData, setWalletListData] = useState(
    walletData?.RecievedList,
  );
  console.log('walletData', walletData);
  const scratchHandler = value => {
    if (value == 25) {
      if (scratchCardModalData?.Scratchable == 'Y') {
        dispatch(
          reqToAddCardInWallet(scratchCardModalData?.RewardId, '8790969540'),
        );
      }
    }
  };
  return (
    <View style={styles.walletMainView}>
      <WalletHeader
        backNavigationIcon={Back_Navigation_Icon}
        headerTitle="Wallet"
        onPress={() => navigation.goBack()}
        balanceText="Wallet Balance"
        validityText={walletData?.ExpiryTitle}
        balance={walletData?.WalletBalance}
        walletBalanceTitle={walletData?.WalletBalanceTitle}
        expiryBalance={walletData?.ExpiryBalance}
        expiryTitle={walletData?.ExpiryTitle}
      />

      <View style={styles.walletDetailView}>
        <WalletAvatar
          avatarText="Received"
          avatarImage={
            avatarIconHandler == WalletType.RECEIVED
              ? receivedActiveIcon
              : receivedIcon
          }
          onPress={() => {
            setAvatarIconHandler('Received');
            setWalletListData(walletData?.RecievedList);
            setCardIcon(receivedActiveIcon);
          }}
          color={
            avatarIconHandler == WalletType.RECEIVED ? '#00A74E' : '#4A4A4A'
          }
        />
        <WalletAvatar
          avatarText="Paid"
          avatarImage={
            avatarIconHandler == WalletType.PAID ? paidIconActive : paidIcon
          }
          onPress={() => {
            setAvatarIconHandler('Paid');
            setWalletListData(walletData?.PaidList);
            setCardIcon(paidIconActive);
          }}
          color={avatarIconHandler == WalletType.PAID ? '#F16623' : '#4A4A4A'}
        />
        <WalletAvatar
          avatarText="Unused"
          avatarImage={
            avatarIconHandler == WalletType.UNUSED
              ? unusedActiveIcon
              : unusedIcon
          }
          onPress={() => {
            setAvatarIconHandler('Unused');
            setWalletListData(walletData?.UnusedList);
            setCardIcon(unusedActiveIcon);
          }}
          color={avatarIconHandler == WalletType.UNUSED ? '#F89A3A' : '#4A4A4A'}
        />
        <WalletAvatar
          avatarText="Rewards"
          avatarImage={
            avatarIconHandler == WalletType.REWARDS
              ? rewardsIconActive
              : rewards
          }
          isLast
          onPress={() => {
            setAvatarIconHandler('Rewards');
            setWalletListData(walletData?.RewardList);
            setCardIcon(rewardsIconActive);
          }}
          color={
            avatarIconHandler == WalletType.REWARDS ? '#00A74E' : '#4A4A4A'
          }
        />
      </View>

      {avatarIconHandler !== 'Rewards' && (
        <FlatList
          data={walletListData}
          renderItem={({item}) => (
            <WalletCard
              avatarIconHandler={avatarIconHandler}
              rewardTitle={item?.Title}
              cardIcon={cardIcon}
              rewardsText={item?.Message}
              expireDateText={item?.ExpiryMessage || item?.Date}
              rewardAmount={item?.Amount}
            />
          )}
          ItemSeparatorComponent={() => <Divider />}
        />
      )}
      {avatarIconHandler === 'Rewards' && (
        <View style={styles.rewardListView}>
          <FlatList
            data={walletListData}
            numColumns={2}
            renderItem={({item}) => (
              <RewardCard
                title={item?.Title}
                expiryMessage={item?.ExpiryMessage}
                isScratched={item?.Scratchable}
                message={item?.Message}
                amount={item?.Amount}
                activateMessage={item?.ActivateMessage}
                onPress={() => {
                  setShowScratchableModal(true);
                  setScratchCardModalData(item);
                }}
              />
            )}
          />
        </View>
      )}
      {scratchCardModalData && (
        <ScratchableCardModal
          visible={showScratchableModal}
          hideModal={() => {
            dispatch(fetchWalletDetail('8639833477'));
            setShowScratchableModal(false);
          }}
          scratchCardModalData={scratchCardModalData}
          onScratch={scratchHandler}
        />
      )}
    </View>
  );
};

export default WalletScreen;
