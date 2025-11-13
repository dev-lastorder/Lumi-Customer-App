import { useThemeColor } from '@/hooks';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import RNPickerSelect, { PickerStyle } from 'react-native-picker-select';
import { ICustomDropdownProps } from './interface';

const CustomDropdown: React.FC<ICustomDropdownProps> = ({
  label,
  value,
  errorMessage,
  showErrorMessage,
  items,
  onChange = () => {},
  placeholder,
}) => {
  const [focused, setFocused] = useState(false);
  const { colors, dark } = useTheme();
  const appTheme = useThemeColor();
  const pickerRef = useRef<RNPickerSelect>(null);

  const borderColor = errorMessage
    ? colors.notification
    : focused
    ? appTheme.primary
    : appTheme.border;
  const textColor = appTheme.text;
  const placeholderColor = appTheme.text;

  const pickerStyle: PickerStyle = {
    inputIOS: {
      color: textColor,
      paddingVertical: 12,
      paddingHorizontal: 10,
    },
    inputAndroid: {
      color: textColor,
      paddingVertical: 12,
      paddingHorizontal: 10,
    },
    placeholder: {
      color: placeholderColor,
    },
    iconContainer: {
      justifyContent: 'center',
      height: '100%',
      marginRight: 10,
    },
    modalViewBottom: {
      backgroundColor: appTheme.background,
    },
    modalViewMiddle: {
      backgroundColor: appTheme.background,
      borderTopWidth: 0,
    },
    done: {
      color: appTheme.text,
    },
  };

  return (
    <TouchableOpacity
      onPress={() => pickerRef.current?.togglePicker(true)}
      style={[
        styles.viewContainer,
        { borderColor, backgroundColor: appTheme.background },
      ]}>
      <View style={{ flex: 1 }}>
        <RNPickerSelect
          ref={pickerRef}
          value={value}
          onValueChange={(val) => onChange(val)}
          items={items}
          style={pickerStyle}
          placeholder={{ label: placeholder || 'Select an item', value: null }}
          useNativeAndroidPickerStyle={false}
          Icon={() => (
            <Ionicons name="chevron-down" size={24} color={placeholderColor} />
          )}
          onOpen={() => setFocused(true)}
          onClose={() => setFocused(false)}
          pickerProps={{
            itemStyle: { color: textColor, backgroundColor: appTheme.background },
          }}
          darkTheme={dark}
        />
      </View>
      {errorMessage && showErrorMessage && (
        <Text style={[styles.error, { color: colors.notification }]}>
          {errorMessage}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  } as ViewStyle,
  error: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    marginTop: 4,
    fontSize: 12,
  } as TextStyle,
  viewContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  } as ViewStyle,
});