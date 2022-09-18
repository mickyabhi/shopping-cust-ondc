import {StyleSheet} from 'react-native';
import {scaledValue} from '../../utils/design.utils';

export const styles = StyleSheet.create({
  textItemsName: {
    fontSize: scaledValue(30),
    marginBottom: scaledValue(13),
    fontFamily: 'Lato-Medium',
    lineHeight: scaledValue(36),
  },
  textPrices: {
    fontSize: scaledValue(28),
    marginRight: scaledValue(12.46),
    fontFamily: 'Lato-Medium',
    lineHeight: scaledValue(34),
  },
  discountsText: {
    fontSize: scaledValue(22),
    alignSelf: 'center',
    fontFamily: 'Lato-Regular',
    lineHeight: scaledValue(27),
    textDecorationLine: 'line-through',
  },
  textsPercentage: {
    fontSize: scaledValue(22),
    color: '#F78B1E',
    fontFamily: 'Lato-Medium',
    lineHeight: scaledValue(27),
  },
  pricesView: {
    flexDirection: 'row',
    marginBottom: scaledValue(7),
  },
  ItemDetail: {
    flex: 1,
    marginTop: scaledValue(38),
  },
  imagesView: {
    marginTop: scaledValue(20),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaledValue(40.37),
    backgroundColor: '#F5F5F5',
    width: scaledValue(660),
    height: scaledValue(435),
  },
  smallImg: {
    width: scaledValue(128),
    height: scaledValue(97),
    marginBottom: scaledValue(15),
  },
  bigImg: {
    width: scaledValue(440.02),
    height: scaledValue(350.96),
  },
  DotsMainView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
