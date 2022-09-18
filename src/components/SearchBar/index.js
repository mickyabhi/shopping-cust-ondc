import React from 'react';
import {StyleSheet, TextInput, View, Platform} from 'react-native';
import {IconButton} from 'react-native-paper';
import {scaledValue} from '../../utils/design.utils';
const SearchBar = props => (
  <View style={styles.searchBar}>
    <IconButton
      onPress={props.onPress}
      size={props.size}
      icon={props?.icon}
      style={styles.searchIcon}
      color={props.color}
    />
    <TextInput
      ref={props?.inputRef}
      onSubmitEditing={props?.onSubmitEditing}
      onKeyPress={props?.onKeyPress}
      style={styles.searchBox}
      placeholder={props?.placeholder}
      allowFontScaling={false}
      onChangeText={props?.onChangeText}
      value={props?.value}
      enablesReturnKeyAutomatically={true}
      returnKeyType="send"
    />
    {props?.showCrossButton && (
      <IconButton
        onPress={props.crossButton}
        size={props.crossIconSize}
        icon={props?.crossIcon}
        style={styles.crossIcon}
        color={props.color}
      />
    )}
  </View>
);

export default SearchBar;
const styles = StyleSheet.create({
  searchBar: {
    borderRadius: scaledValue(16),
    justifyContent: 'center',
  },
  searchBox: {
    borderRadius: scaledValue(16),
    borderWidth: scaledValue(1),
    borderColor: '#CDD4D9',
    paddingLeft: scaledValue(114.03),
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  searchIcon: {
    position: 'absolute',
    left: scaledValue(32.03),
    zIndex: 1,
  },
  crossIcon: {
    position: 'absolute',
    right: scaledValue(-8),
  },
});
