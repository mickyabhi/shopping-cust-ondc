import {takeEvery, put} from 'redux-saga/effects';
import {
  actions,
  saveUserData,
  saveStoresList,
  saveStoreProducts,
  saveAllProducts,
  saveCategories,
  saveSubCategories,
  saveStoresByCategories,
  saveProductByMasterCategory,
  saveUserOrders,
  saveMessage,
  saveCurrentCarts,
  saveNotification,
  saveUserRazorPayPayments,
  showLoading,
  saveRating,
  showAlertToast,
  saveRazorPayOrder,
  saveRazorPayPayment,
  saveUserCarts,
  saveWalletDetail,
  saveScratchCard,
} from './actions';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  getItemFromAsyncStorage,
  setItemInAsyncStorage,
} from '../../utils/storage.utils';
import * as queries from '../../graphql/queries';
import {API} from 'aws-amplify';
import * as mutations from '../../graphql/mutations';
import {AlertMessage} from '../../utils/constants';
import {
  addScratchCardInWallet,
  getScratchCardRequest,
  walletDetailRequest,
} from '../../utils/services';

function* getUserData() {
  try {
    const currentUserId = yield getItemFromAsyncStorage('current_user_id');
    const currentUser = yield API.graphql({
      query: queries.getUser,
      variables: {id: currentUserId},
    }).then(res => res.data.getUser);
    yield put(saveUserData(currentUser));

    let address = yield getItemFromAsyncStorage('selectedAddress');
    if (address == null) {
      address = currentUser?.addresses?.items[0];
      yield setItemInAsyncStorage('selectedAddress', JSON.stringify(address));
    }
  } catch (error) {
    crashlytics()?.recordError(error);
    put(
      showAlertToast({
        alertMessage: error?.message || AlertMessage.SOMETHING_WENT_WRONG,
      }),
    );
  }
}

function* fetchStoreProducts({storeId}) {
  try {
    yield put(saveStoreProducts(null));

    let storeProducts = yield API.graphql({
      query: queries.productsByStoreId,
      variables: {
        filter: {
          isInInventory: {eq: true},
          deletedAt: {attributeExists: false},
          mrp: {ne: null},
          mrp: {attributeExists: true},
        },
        storeId: storeId,
        limit: 10000,
      },
    }).then(resp => resp?.data?.productsByStoreId?.items);

    storeProducts = storeProducts?.sort((a, b) =>
      a?.product?.description.localeCompare(b?.product?.description),
    );

    yield put(saveStoreProducts(storeProducts));
  } catch (error) {
    crashlytics()?.recordError(error);
    put(
      showAlertToast({
        alertMessage: error?.message || AlertMessage.SOMETHING_WENT_WRONG,
      }),
    );
  }
}

function* fetchAllProducts() {
  try {
    let productList = yield API.graphql({
      query: queries.listProducts,
      variables: {
        filter: {
          mrp: {ne: null},
        },
        limit: 10000,
      },
    }).then(resp => resp?.data?.listProducts?.items);

    yield put(saveAllProducts(productList));

    const productCategories = [
      ...new Set(productList.map(product => product?.masterCategory)),
    ];

    yield put(saveCategories([...productCategories, 'All']));

    const productSubCategories = [
      ...new Set(productList.map(product => product?.category)),
    ];

    yield put(saveSubCategories(productSubCategories));
  } catch (error) {
    crashlytics()?.recordError(error);
    put(
      showAlertToast({
        alertMessage: error?.message || AlertMessage.SOMETHING_WENT_WRONG,
      }),
    );
  }
}

function* fetchStoresList() {
  try {
    const storesList = yield API.graphql({
      query: queries.listStores,
      variables: {
        limit: 10000,
        filter: {
          latitude: {
            ne: null,
          },
          longitude: {
            ne: null,
          },
          deletedAt: {attributeExists: false},
        },
      },
    }).then(resp => resp?.data?.listStores?.items);

    yield put(saveStoresList(storesList));

    // const storeCategories = [
    //   ...new Set(storesList.map(store => store?.category)),
    // ];

    // yield put(saveCategories([...storeCategories, 'All']));
  } catch (error) {
    crashlytics()?.recordError(error);
    put(
      showAlertToast({
        alertMessage: error?.message || AlertMessage.SOMETHING_WENT_WRONG,
      }),
    );
  }
}

function* fetchStoresByCategory({category}) {
  try {
    const storesByCategory = yield API.graphql({
      query: queries.storeByCategory,
      variables: {category: category, limit: 10000},
    }).then(resp => resp.data.storeByCategory.items);

    yield put(saveStoresByCategories(storesByCategory));
  } catch (error) {
    crashlytics()?.recordError(error);
    put(
      showAlertToast({
        alertMessage: error?.message || AlertMessage.SOMETHING_WENT_WRONG,
      }),
    );
  }
}

function* fetchProductByMasterCategory({category}) {
  try {
    if (category === 'All') {
      let productList = yield API.graphql({
        query: queries.listProducts,
        variables: {
          filter: {
            mrp: {ne: null},
          },
          limit: 10000,
        },
      }).then(resp => resp?.data?.listProducts?.items);

      yield put(saveProductByMasterCategory(productList));
      yield put(showLoading(false));
    } else {
      const productByMasterCat = yield API.graphql({
        query: queries.productByMasterCategory,
        variables: {masterCategory: category, limit: 10000},
      }).then(resp => resp.data.productByMasterCategory.items);

      yield put(saveProductByMasterCategory(productByMasterCat));
    }
  } catch (error) {
    crashlytics()?.recordError(error);
    put(
      showAlertToast({
        alertMessage: error?.message || AlertMessage.SOMETHING_WENT_WRONG,
      }),
    );
  }
}

function* fetchUserOrders() {
  const currentUserId = yield getItemFromAsyncStorage('current_user_id');
  try {
    const userOrders = yield API.graphql({
      query: queries.ordersByUserId,
      variables: {userId: currentUserId, limit: 10000},
    }).then(resp => resp?.data?.ordersByUserId.items);

    userOrders?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    yield put(saveUserOrders(userOrders));
  } catch (error) {
    crashlytics()?.recordError(error);
    put(
      showAlertToast({
        alertMessage: error?.message || AlertMessage.SOMETHING_WENT_WRONG,
      }),
    );
  }
}

function* fetchChat({conversationId}) {
  try {
    if (conversationId != null) {
      const chat = yield API.graphql({
        query: queries.messagesByConversationId,
        variables: {conversationId: conversationId, limit: 10000},
      }).then(resp => resp.data.messagesByConversationId.items);
      yield put(saveMessage(chat));
    }
  } catch (error) {
    crashlytics()?.recordError(error);
    yield put(
      showAlertToast({
        alertMessage: error?.message || AlertMessage.SOMETHING_WENT_WRONG,
      }),
    );
  }
}

function* fetchCurrentCarts() {
  try {
    const userId = yield getItemFromAsyncStorage('current_user_id');
    const carts = yield API.graphql({
      query: queries.ondcCartsByUserId,
      variables: {
        userId,
        filter: {isOrderPlaced: {eq: false}},
        limit: 10000,
      },
    }).then(res => res.data.ondcCartsByUserId.items);
    yield put(saveCurrentCarts(carts));
  } catch (error) {
    crashlytics()?.recordError(error);
    put(
      showAlertToast({
        alertMessage: error?.message || AlertMessage.SOMETHING_WENT_WRONG,
      }),
    );
  }
}

function* submitInviteStore({inviteStoreReq}) {
  try {
    yield API.graphql({
      query: mutations.createInviteStore,
      variables: {input: inviteStoreReq},
    }).then(resp => resp);
  } catch (error) {
    crashlytics()?.recordError(error);
    put(
      showAlertToast({
        alertMessage: error?.message || AlertMessage.SOMETHING_WENT_WRONG,
      }),
    );
  }
}

function* submitRating({ratingReq}) {
  try {
    yield API.graphql({
      query: mutations.createOrderRating,
      variables: {input: ratingReq},
    }).then(resp => resp);
  } catch (error) {
    crashlytics()?.recordError(error);
    put(
      showAlertToast({
        alertMessage: error?.message || AlertMessage.SOMETHING_WENT_WRONG,
      }),
    );
  }
}

function* fetchNotifications({topic}) {
  try {
    const notifications = yield API.graphql({
      query: queries.notificationsByTopic,
      variables: {
        topic: topic,
        limit: 10000,
        filter: {title: {ne: 'Blocal Message'}},
      },
    }).then(resp => resp.data.notificationsByTopic.items);
    yield put(saveNotification(notifications));
  } catch (error) {
    crashlytics()?.recordError(error);
    put(
      showAlertToast({
        alertMessage: error?.message || AlertMessage.SOMETHING_WENT_WRONG,
      }),
    );
  }
}

function* fetchUserRazorPayPayments() {
  try {
    const currentUserId = yield getItemFromAsyncStorage('current_user_id');
    const userRazorPayPayments = yield API.graphql({
      query: queries.razorPayPaymentByUserId,
      variables: {userId: currentUserId, limit: 10000},
    }).then(resp => resp.data.razorPayPaymentByUserId.items);
    yield put(saveUserRazorPayPayments(userRazorPayPayments));
  } catch (error) {
    crashlytics()?.recordError(error);
    put(
      showAlertToast({
        alertMessage: error?.message || AlertMessage.SOMETHING_WENT_WRONG,
      }),
    );
  }
}

function* fetchRating({orderId}) {
  try {
    const ratingDetail = yield API.graphql({
      query: queries.orderRatingByOrderId,
      variables: {orderId: orderId, limit: 10000},
    }).then(resp => resp.data.orderRatingByOrderId.items);
    yield put(saveRating(ratingDetail));
  } catch (error) {
    crashlytics()?.recordError(error);
    put(
      showAlertToast({
        alertMessage: error?.message || AlertMessage.SOMETHING_WENT_WRONG,
      }),
    );
  }
}

function* fetchRazorPayOrder({orderIdForPayment, orderIdForOrder}) {
  try {
    if (orderIdForPayment != null) {
      const razorPayPayment = yield API.graphql({
        query: queries.razorPayPaymentByOrderId,
        variables: {orderId: orderIdForPayment, limit: 10000},
      }).then(resp => resp.data.razorPayPaymentByOrderId.items[0]);
      yield put(saveRazorPayPayment(razorPayPayment));
    }
    if (orderIdForOrder != null) {
      const razorPayOrder = yield API.graphql({
        query: queries.razorPayOrderByOrderId,
        variables: {orderId: orderIdForOrder, limit: 10000},
      }).then(resp => resp.data.razorPayOrderByOrderId.items[0]);
      yield put(saveRazorPayOrder(razorPayOrder));
      console.log('fetchRazorPayOrder', razorPayOrder);
    }
  } catch (error) {
    crashlytics()?.recordError(error);
    console.log('fetchRazorPayOrder.error', error);
    dispatch(
      showAlertToast({
        alertMessage: error?.message || AlertMessage.SOMETHING_WENT_WRONG,
      }),
    );
  }
}

function* fetchUserCarts() {
  try {
    yield put(saveUserCarts(null));
    const userId = yield getItemFromAsyncStorage('current_user_id');
    let carts = yield API.graphql({
      query: queries.cartsByUserId,
      variables: {userId, limit: 10000},
    }).then(res => res?.data?.cartsByUserId?.items);
    carts = carts?.filter(resp => resp.isOrderPlaced == false);
    console.log('fetchUserCarts.carts', carts);

    yield put(saveUserCarts(carts));
  } catch (error) {
    crashlytics()?.recordError(error);
    console.log('fetchUserCarts.error', error);
    put(
      showAlertToast({
        alertMessage: error?.message || AlertMessage.SOMETHING_WENT_WRONG,
      }),
    );
  }
}

function* fetchUserWalletDetail({phnNumber}) {
  try {
    const walletResp = yield walletDetailRequest(phnNumber);
    yield put(saveWalletDetail(walletResp));
  } catch (error) {
    crashlytics()?.recordError(error);
    put(
      showAlertToast({
        alertMessage: error?.message || AlertMessage.SOMETHING_WENT_WRONG,
      }),
    );
  }
}

function* getScratchCard({
  mobileNumber,
  discountedAmount,
  amountPaid,
  orderId,
}) {
  try {
    const scratchCard = yield getScratchCardRequest(
      mobileNumber,
      discountedAmount,
      amountPaid,
      orderId,
    );
    yield put(saveScratchCard(scratchCard));
  } catch (error) {
    crashlytics()?.recordError(error);
    put(
      showAlertToast({
        alertMessage: error?.message || AlertMessage.SOMETHING_WENT_WRONG,
      }),
    );
  }
}

function* reqToAddCardInWallet({rewardId, phnNumber}) {
  try {
    const scratchCardInWallet = yield addScratchCardInWallet(
      rewardId,
      phnNumber,
    );
    console.log('scratchCardInWallet>', scratchCardInWallet);
  } catch (error) {}
}

function* saga() {
  yield takeEvery(actions.FETCH_USER_DATA, getUserData);
  yield takeEvery(actions.FETCH_STORE_PRODUCTS, fetchStoreProducts);
  yield takeEvery(actions.FETCH_ALL_PRODUCTS, fetchAllProducts);
  yield takeEvery(actions.FETCH_STORES_LIST, fetchStoresList);
  yield takeEvery(actions.FETCH_STORES_BY_CATEGORY, fetchStoresByCategory);
  yield takeEvery(
    actions.FETCH_PRODUCT_BY_MASTER_CATEGORY,
    fetchProductByMasterCategory,
  );
  yield takeEvery(actions.FETCH_USER_ORDERS, fetchUserOrders);
  yield takeEvery(actions.FETCH_MESSAGE, fetchChat);
  yield takeEvery(actions.FETCH_CURRENT_CARTS, fetchCurrentCarts);
  yield takeEvery(actions.SUBMIT_INVITE_STORE, submitInviteStore);
  yield takeEvery(actions.SUBMIT_RATING, submitRating);
  yield takeEvery(actions.FETCH_NOTIFICATION, fetchNotifications);
  yield takeEvery(
    actions.FETCH_USER_RAZORPAY_PAYMENTS,
    fetchUserRazorPayPayments,
  );
  yield takeEvery(actions.FETCH_RATING, fetchRating);
  yield takeEvery(actions.FETCH_RAZOR_PAY_ORDER, fetchRazorPayOrder);
  yield takeEvery(actions.FETCH_USER_CARTS, fetchUserCarts);
  yield takeEvery(actions.FETCH_WALLET_DETAIL, fetchUserWalletDetail);
  yield takeEvery(actions.GET_SCRATCH_CARD, getScratchCard);
  yield takeEvery(actions.REQ_TO_ADD_CARD_IN_WALLET, reqToAddCardInWallet);
}
export default saga;
