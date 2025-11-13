import React from 'react';

// Components
import { CustomIcon } from '../Icon';

// Interfaces
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { CustomText } from '../CustomText';
import { ICustomIconTextField } from './interfaces';

const CustomIconButtom: React.FC<ICustomIconTextField & { disabled?: boolean }> = ({
  icon,
  label,
  onPress,
  height = 50,
  width,
  borderColor = '#000',
  backgroundColor = '#fff',
  textColor = '#ffff',
  borderRadius = 6,
  padding = 10,
  textStyle,
  disabled = false,
  className,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          borderColor,
          backgroundColor,
          borderRadius,
          padding,
          ...(height && { height }),
          ...(width && { width }),
          opacity: disabled ? 0.5 : 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        } as ViewStyle,
      ]}
      className={className}
    >
      {icon && (
        <View style={{ position: 'absolute', left: 18 }}>
          <CustomIcon icon={icon} />
        </View>
      )}
      <CustomText variant='heading3' fontWeight='semibold' style={[styles.text, { color: textColor }, textStyle, { flex: 1,lineHeight:20, fontSize: 16, textAlign: 'center', fontWeight: '800' }]}>
        {label}
      </CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 20,
  },
  icon: {
    marginRight: 10,
    height: '100%',
    width: 'auto',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CustomIconButtom;
