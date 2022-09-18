import {StyleSheet} from 'react-native';
import {scaledValue} from '../../utils/design.utils';

export const styles = StyleSheet.create({
  walletMainView: {
    flex: 1,
  },
  walletDetailView: {
    backgroundColor: '#E2DFDF',
    height: scaledValue(164),
    borderBottomLeftRadius: scaledValue(20),
    borderBottomRightRadius: scaledValue(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaledValue(48),
  },
  scratchCard: {
    height: scaledValue(299.05),
    width: scaledValue(298.92),
    borderRadius: scaledValue(12),
    backgroundColor: 'transparent',
  },
  rewardListView: {
    paddingHorizontal: scaledValue(24),
    paddingVertical: scaledValue(38),
  },
});
