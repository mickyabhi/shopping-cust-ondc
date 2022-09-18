import {StyleSheet} from 'react-native';
import {scaledValue} from '../../utils/design.utils';

export const styles = StyleSheet.create({
  itemScreenUpperView: {
    flex: 1,
  },
  itemCard2View: {
    flexDirection: 'row',
    paddingHorizontal: scaledValue(49),
    paddingBottom: scaledValue(35),
    paddingTop: scaledValue(22),
  },
  viewAllIconImg: {
    width: scaledValue(15.24),
    height: scaledValue(8.93),
    marginLeft: scaledValue(4.15),
    transform: [{rotate: '270deg'}],
    marginTop: scaledValue(8),
  },
  itemDetailView: {
    paddingTop: scaledValue(23),
    paddingHorizontal: scaledValue(47),
    paddingBottom: scaledValue(38),
  },
  deliveredMsgText: {
    fontSize: scaledValue(32),
    fontFamily: 'Lato-Medium',
    paddingBottom: scaledValue(25.63),
  },
  discountContainer: {flexDirection: 'row'},
  priceText: {
    color: 'gray',
    fontSize: scaledValue(32),
    textDecorationLine: 'line-through',
  },
  sellingPrice: {
    color: '#000000',
    marginLeft: scaledValue(24.34),
    fontSize: scaledValue(32),
  },
  discountView: {
    backgroundColor: '#F8993A',
    marginLeft: scaledValue(24.34),
    borderRadius: scaledValue(8),
  },
  discountText: {
    color: '#ffffff',
    fontFamily: 'Lato-Bold',
    fontSize: scaledValue(32),
    paddingHorizontal: scaledValue(15),
    paddingVertical: scaledValue(5),
  },
  ratingView: {
    backgroundColor: '#F8993A',
    flexDirection: 'row',
    alignItems: 'center',
    width: scaledValue(100.48),
    height: scaledValue(41.44),
    paddingHorizontal: scaledValue(16.8),
    borderRadius: scaledValue(4),
    marginRight: scaledValue(17.51),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaledValue(26.37),
  },
  ratingText: {
    fontSize: scaledValue(23),
    color: '#ffffff',
    fontFamily: 'Lato-Bold',
  },
  numberRating: {
    color: '#989898',
    fontSize: scaledValue(20),
    fontFamily: 'Lato-Semibold',
  },
  divider: {
    borderColor: '#EDEDED',
    backgroundColor: '#EDEDED',
    borderWidth: scaledValue(2),
    marginTop: scaledValue(27.19),
  },
  soldbyText: {
    fontSize: scaledValue(24),
    fontFamily: 'Lato-Regular',
    color: 'gray',
  },
  storeName: {
    color: '#F77F34',
    fontFamily: 'Lato-Bold',
  },
  soldByView: {
    marginTop: scaledValue(32),
  },
  storeRatingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  ratingNumText: {
    marginLeft: scaledValue(28.42),
    color: '#989898',
    fontSize: scaledValue(20),
  },
  discountDes: {
    fontSize: scaledValue(20),
    fontFamily: 'Lato-Regular',
  },
  productDes: {
    fontSize: scaledValue(26),
    marginTop: scaledValue(27),
    fontFamily: 'Lato-Regular',
  },
  buttonView: {
    flexDirection: 'row',
    marginTop: scaledValue(61.98),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productImg: {
    width: scaledValue(660),
    height: scaledValue(435),
    marginTop: scaledValue(20),
    marginBottom: scaledValue(40.37),
  },
});
