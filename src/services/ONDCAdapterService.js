import uuid from 'react-native-uuid';
import axios from 'axios';
import Config from 'react-native-config';

const ONDC_ADAPTOR_API = Config.ONDC_ADAPTOR_API;

export const getONDCAdapterContext = (city, action) => {
  const uid = uuid.v4();
  return {
    domain: 'nic2004:52110',
    country: 'IND',
    city: city,
    action: action,
    core_version: '1.0.0',
    bap_id: 'ondc_buyer_1',
    bap_uri: ONDC_ADAPTOR_API,
    transaction_id: uid,
    message_id: uid,
  };
};

export const getONDCAdapterIntentMessage = name => {
  return {
    intent: {
      item: {
        descriptor: {
          name: name,
        },
      },
    },
  };
};

export const getONDCAdapterOrderMessage = (
  provider,
  items,
  billing,
  payment,
  fulfillment,
) => {
  return {
    order: {
      provider,
      items,
      billing,
      payment,
      fulfillment,
    },
  };
};

export const searchProduct = searchText => {
  const context = getONDCAdapterContext('std:080', 'search');
  const message = getONDCAdapterIntentMessage(searchText);
  return axios
    .post(ONDC_ADAPTOR_API + '/search', {context, message})
    .catch(() => null);
};

export const initOrder = async (
  provider,
  items,
  billing,
  payment,
  fulfillment,
) => {
  const context = getONDCAdapterContext('std:080', 'init');
  const message = getONDCAdapterOrderMessage(
    provider,
    items,
    billing,
    payment,
    fulfillment,
  );
  const init = await axios.post(ONDC_ADAPTOR_API + '/search', {
    context,
    message,
  });
  console.log('init', init);
};

export const checkOrderStatus = order_id => {
  const context = getONDCAdapterContext('std:080', 'status');
  const message = {
    order_id,
  };
  return axios.post(ONDC_ADAPTOR_API + '/search', {context, message});
};

export const checkResponse = (action, transaction_id, message_id) => {
  return axios
    .post(ONDC_ADAPTOR_API + '/response', {
      action,
      transaction_id,
      message_id,
    })
    .catch(() => null);
};

export const checkResponseFromSellers = (
  action,
  transaction_id,
  message_id,
  sellers,
) => {
  return axios.post(ONDC_ADAPTOR_API + '/response', {
    action,
    transaction_id,
    message_id,
    sellers,
  });
};
