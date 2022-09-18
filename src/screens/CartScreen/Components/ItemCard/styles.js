import {StyleSheet} from 'react-native';
import {scaledValue} from '../../../../utils/design.utils';

export const styles = StyleSheet.create({
  itemCardView: {
    flexDirection: 'row',
    width: scaledValue(686),
  },
  itemImage: {
    width: scaledValue(100),
    height: scaledValue(100),
  },
  textItemName: isEmptyCartImage => ({
    fontSize: scaledValue(24),
    fontFamily: 'Lato-Medium',
    lineHeight: scaledValue(29),
    width: isEmptyCartImage !== true ? scaledValue(350) : scaledValue(480),
  }),
  textPrice: {
    fontSize: scaledValue(24),
    fontFamily: 'Lato-SemiBold',
    lineHeight: scaledValue(29),
  },
  textPercentage: {
    fontSize: scaledValue(18),
    color: '#F8993A',
    fontFamily: 'Lato-Medium',
    lineHeight: scaledValue(22),
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountText: {
    fontSize: scaledValue(18),
    marginLeft: scaledValue(25),
    textDecorationLine: 'line-through',
    fontFamily: 'Lato-Regular',
    lineHeight: scaledValue(22),
  },
  textsView: noImage => ({
    justifyContent: 'space-between',
    marginLeft: noImage == true ? scaledValue(23) : null,
  }),
  deleteIconStyle: {
    width: scaledValue(25.18),
    height: scaledValue(32.83),
  },

  productImg: {
    width: scaledValue(149),
    height: scaledValue(149),
    borderRadius: scaledValue(8),
  },
  productCardView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaledValue(14),
    paddingHorizontal: scaledValue(15),
    borderRadius: scaledValue(16),
    borderColor: '#F4F4F4',
    borderWidth: scaledValue(2),
    // elevation: 1,
    // shadowColor: '#00000090',
    // borderWidth: Platform.OS === 'ios' ? 1 : 0,
    // borderColor: '#00000029',
  },

  productName: {
    fontSize: scaledValue(25),
    fontFamily: 'Lato-Medium',
    paddingBottom: scaledValue(12),
  },
  productDetailView: {
    width: scaledValue(505),
    paddingLeft: scaledValue(25),
  },
  soldbyText: {
    color: 'gray',
    fontSize: scaledValue(18),
    fontFamily: 'Lato-Regular',
    paddingBottom: scaledValue(12),
  },
  discountContainer: {flexDirection: 'row'},
  discountView: {
    backgroundColor: '#F77F34',
    marginLeft: scaledValue(24.34),
    borderRadius: scaledValue(8),
  },
  priceText: {
    color: 'gray',
    fontSize: scaledValue(28),
    textDecorationLine: 'line-through',
  },
  sellingPrice: {
    color: '#000000',
    marginLeft: scaledValue(24.34),
    fontSize: scaledValue(28),
  },
  discountText: {
    color: '#ffffff',
    fontFamily: 'Lato-Bold',
    fontSize: scaledValue(32),
    paddingHorizontal: scaledValue(15),
    paddingVertical: scaledValue(5),
  },
  buttonView: {marginLeft: scaledValue(282)},
  storeNameText: {color: '#F77F34', fontSize: scaledValue(20)},
});
