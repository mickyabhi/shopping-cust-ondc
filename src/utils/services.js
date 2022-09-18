import * as mutations from '../graphql/mutations';
import {API} from 'aws-amplify';
import axios from 'axios';
import {firebase} from '@react-native-firebase/auth';
import Config from 'react-native-config';
import crashlytics from '@react-native-firebase/crashlytics';
import {WALLET_API_URL} from './constants';

const config = {
  headers: {
    userID: 'BLOCALEVIG',
    password: 'bloc@!2@22ev!g',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
};

export const sendNotificationToTopic = async (title, body, topic, metaData) => {
  const authToken = await firebase.auth().currentUser.getIdToken();
  topic = topic.replace('+', '_');

  let notification = {
    title,
    body,
    topic,
    isRead: false,
    metaData: JSON.stringify(metaData),
  };

  const notificationCheck = await axios.post(
    Config.NOTIFICATION_API,
    notification,
    {
      headers: {
        Authorization: authToken,
      },
    },
  );

  console.log('notificationCheck', notificationCheck);

  await API.graphql({
    query: mutations.createNotification,
    variables: {input: notification},
  })
    .then(resp => resp.data.createNotification)
    .catch(error => {
      crashlytics()?.recordError(error);
      console.log('createNotification.error', error);
      return null;
    });
};

export const walletDetailRequest = async phnNumber => {
  let mfsapiin = {
    ReqService: 'WAL_API_WALLETSCREEN',
    mobileNumber: phnNumber,
  };

  const walletCheck = await axios
    .post(
      WALLET_API_URL +
        `?mfsapiin={"ReqService":"WAL_API_WALLETSCREEN","mobileNumber":${phnNumber}}`,
      mfsapiin,
      config,
    )
    .then(resp => resp.data.ResultMessage)
    .catch(error => console.log('walletRequest.err--->', error));
  return walletCheck;
};

export const getScratchCardRequest = async (
  mobileNumber,
  discountedAmount,
  amountPaid,
  orderId,
) => {
  let mfsapiin = {
    mobileNumber: mobileNumber,
    discountedAmount: discountedAmount,
    amountPaid: amountPaid,
    OrderId: orderId,
    ReqService: 'WAL_API_GET_SCRATCH_CARD',
  };

  const scratchCard = await axios
    .post(
      WALLET_API_URL +
        `?mfsapiin={"mobileNumber":${mobileNumber},"discountedAmount":${discountedAmount},"amountPaid":${amountPaid},"OrderId":${orderId},"ReqService":"WAL_API_GET_SCRATCH_CARD"}`,
      mfsapiin,
      config,
    )
    .then(resp => resp.data.ResultMessage)
    .catch(error => console.log('getScratchCard.err--->', error));
  return scratchCard;
};

export const addScratchCardInWallet = async (rewardId, phnNumber) => {
  let mfsapiin = {
    ReqService: 'WAL_API_UPDATEREWARD',
    RewardId: rewardId,
    mobileNumber: phnNumber,
  };
  const scratchCardInWallet = await axios
    .post(
      WALLET_API_URL +
        `?mfsapiin={"ReqService":"WAL_API_UPDATEREWARD","RewardId":${rewardId},"mobileNumber":${phnNumber}}`,
      mfsapiin,
      config,
    )
    .then(resp => resp.data.ResultMessage)
    .catch(error => console.log('addScratchCardInWallet.err--->', error));
  return scratchCardInWallet;
};

export const getEligibleCouponsForCart = async () => {
  let mfsapiin = {
    ReqService: 'WAL_API_CASHBACK_COUPONS',
    mobileNumber: '8790969540',
    amount: '500',
  };
  const eligibleCoupon = await axios
    .post(
      WALLET_API_URL +
        `?mfsapiin={"ReqService":"WAL_API_CASHBACK_COUPONS","mobileNumber":"8790969540","amount":"500"}`,
      mfsapiin,
      config,
    )
    .then(resp => resp.data.ResultMessage)
    .catch(error => console.log('getEligibleCouponsForCart.err--->', error));
  return eligibleCoupon;
};
