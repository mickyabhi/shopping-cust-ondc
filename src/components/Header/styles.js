import {StyleSheet} from 'react-native';
import {scaledValue} from '../../utils/design.utils';

export const styles = StyleSheet.create({
  Appbar: {
    display: 'flex',
    justifyContent: 'space-between',
    elevation: 0,
    backgroundColor: 'transparent',
  },
  drawerIcon: {
    width: scaledValue(35.92),
    height: scaledValue(33.02),
    position: 'absolute',
  },
  textButton: {
    color: '#fff',
    fontSize: scaledValue(22),
    fontFamily: 'Lato-Regular',
    marginRight: scaledValue(27),
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backNavigationIcon: {
    width: scaledValue(20.08),
    height: scaledValue(34.27),
  },
  labelText: {
    color: '#fff',
    fontSize: scaledValue(26),
    marginRight: scaledValue(20.11),
    fontFamily: 'Lato-Semibold',
    width: scaledValue(368.63),
  },
  headerTitle: {
    fontSize: scaledValue(30),
    color: '#fff',
    fontFamily: 'Lato-Regular',
    lineHeight: scaledValue(36),
    textTransform: 'capitalize',
    width: scaledValue(380),
  },
  notificationTouchableOpacity: {
    marginLeft: scaledValue(1),
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerIconTouchableOpacity: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: {
    width: scaledValue(88),
    height: scaledValue(88),
  },
  avatarImage: {
    marginRight: scaledValue(16),
  },
  cartItemCount: {
    backgroundColor: 'green',
    width: scaledValue(26),
    height: scaledValue(26),
    borderRadius: scaledValue(50),
    fontSize: scaledValue(16),
    color: '#fff',
    textAlign: 'center',
    position: 'absolute',
    right: scaledValue(37),
    top: scaledValue(20),
  },
  notificationCount: {
    backgroundColor: 'green',
    width: scaledValue(26),
    height: scaledValue(26),
    borderRadius: scaledValue(50),
    fontSize: scaledValue(16),
    color: '#fff',
    textAlign: 'center',
    position: 'absolute',
    right: scaledValue(116),
    top: scaledValue(20),
  },
  cartIconView: {
    borderRadius: scaledValue(50),
    width: scaledValue(88),
    height: scaledValue(88),
    right: scaledValue(33),
  },

  fileIconView: {
    borderRadius: scaledValue(50),
    width: scaledValue(88),
    height: scaledValue(88),
  },
});
