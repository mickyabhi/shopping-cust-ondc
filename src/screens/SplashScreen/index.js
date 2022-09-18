/* eslint-disable no-undef */
import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import splashBackgroundImage from '../../../assets/images/SplashImg.png';
import auth from '@react-native-firebase/auth';
import {getItemFromAsyncStorage} from '../../utils/storage.utils';
import {
  isEmptyString,
  loadAmplifyAuth,
  signOutUser,
} from '../../utils/common.utils';
import {API} from 'aws-amplify';
import * as queries from '../../graphql/queries';
import {useDispatch} from 'react-redux';
import {showAlertToast} from '../AppStore/actions';
import {AlertMessage} from '../../utils/constants';
import crashlytics from '@react-native-firebase/crashlytics';
// import {Dialog, Button, Paragraph} from 'react-native-paper';
// import {Linking} from 'react-native';
// import database from '@react-native-firebase/database';
// import Config from 'react-native-config';
const SplashScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  //   const [showForceUpdate, setShowForceUpdate] = useState(null);

  const initApp = async () => {
    const lat = await getItemFromAsyncStorage('latitude');
    const long = await getItemFromAsyncStorage('longitude');

    const currentUserId = await getItemFromAsyncStorage('current_user_id');

    const user = auth()?.currentUser;
    if (user == null || isEmptyString(currentUserId)) {
      await signOutUser().then(navigation.replace('LoginScreen'));
      return;
    }

    const userInfo = await API.graphql({
      query: queries.getUser,
      variables: {id: currentUserId},
    })
      .then(resp => resp.data.getUser)
      .catch(error => {
        crashlytics()?.recordError(error);
        dispatch(
          showAlertToast({
            alertMessage: error?.message || AlertMessage.SOMETHING_WENT_WRONG,
          }),
        );
      });

    // const minAppVersion = await database()
    //   .ref('/AppForceUpdateVersion/customer')
    //   .once('value')
    //   .then(snapshot => parseInt(snapshot.val()))
    //   .catch(err => {
    //     console.log('database.AppForceUpdateVersion/customer', err);
    //     return parseInt(Config.VERSION_CODE);
    //   });

    // const forceUpdateRequired = Config.VERSION_CODE < minAppVersion;

    // if (forceUpdateRequired) {
    //   setShowForceUpdate(true);
    //   return;
    // }

    if (userInfo == null) {
      navigation.replace('DeliveryLocationScreen', {
        latitude: lat,
        longitude: long,
      });
      return;
    }

    navigation.replace('Drawer');
    await loadAmplifyAuth();
    return;
  };

  useEffect(() => {
    initApp();
  }, []);

  //   const forceUpgradeDialog = () => (
  //     <Dialog visible={true}>
  //       <Dialog.Title>New version available</Dialog.Title>
  //       <Dialog.Content>
  //         <Paragraph>
  //           Please, update B.Local app to new version to enjoy awesome shopping
  //           experience.
  //         </Paragraph>
  //       </Dialog.Content>
  //       <Dialog.Actions>
  //         <Button
  //           color="#F79939"
  //           onPress={() => {
  //             Linking.openURL(
  //               'https://play.google.com/store/apps/details?id=' +
  //                 Config.APPLICATION_ID,
  //             );
  //           }}>
  //           Update
  //         </Button>
  //       </Dialog.Actions>
  //     </Dialog>
  //   );

  return (
    <SafeAreaView style={styles.mainView}>
      <StatusBar backgroundColor="#F5842E" />
      <ImageBackground
        source={splashBackgroundImage}
        style={styles.splashImage}
      />
      {/* {showForceUpdate && forceUpgradeDialog()} */}
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  splashImage: {
    flex: 1,
  },
});
