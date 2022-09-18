import {StyleSheet} from 'react-native';
import {scaledValue} from '../../utils/design.utils';

export const styles = StyleSheet.create({
  CountButtonView: (width, height, borderWidth) => ({
    width: width,
    height: height,
    borderWidth: borderWidth,
    borderRadius: scaledValue(16),
    borderColor: '#FD7609',
    flexDirection: 'row',
  }),
  countButtonTitle: quantityTextSize => ({
    color: '#fff',
    fontSize: quantityTextSize,
  }),
  subtractionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countView: {
    flex: 1,
    backgroundColor: '#F78B1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: plusText => ({
    color: '#F78B1E',
    fontSize: plusText,
  }),
  minusText: minusText => ({
    color: '#F78B1E',
    fontSize: minusText,
  }),
});
