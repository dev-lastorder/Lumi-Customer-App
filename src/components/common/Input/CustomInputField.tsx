import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

// Components
import { CustomIcon } from '@/components/common/Icon';

// Interfaces
import { InputWithLabelProps } from './interface';

// Redux
import { useAppSelector } from '@/redux';
import { useTheme } from '@react-navigation/native';
import { useThemeColor } from '@/hooks';

const InputWithLabel: React.FC<InputWithLabelProps> = ({
  label,
  iconName,
  type = 'default',
  maxLength = 35,
  disabled = false,
  keyboardType = 'default',
  iconPosition = 'left',
  value,
  onChangeText = () => { },
  errorMessage,
  showErrorMessage = false,
}) => {
  const [focused, setFocused] = useState(false);
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const { dark } = useTheme();
  const appTheme = useThemeColor();

  const typeColor = !dark ? '#fff' : '#000'; // Default color based on theme
  const handleBlur = () => {
    setFocused(false);
  };

  const borderColor = errorMessage
    ? 'red'
    : focused
      ? '#007AFF' // iOS blue
      : '#ccc';

  return (
    <View style={[styles.container, { borderColor }, { marginBottom: !!errorMessage && showErrorMessage ? 20 : null }]}>
      {iconName && iconPosition === 'left' && <CustomIcon icon={{ type, name: iconName, size: 30, color: errorMessage ? 'red' : '#555' }} />}

      <View style={styles.inputContainer}>
        {(focused || value) && <Text style={[styles.label, errorMessage && { color: 'red' }]}>{label}</Text>}
        <TextInput
          style={[styles.input, { color: appTheme.text }]}
          placeholder={!focused ? label : ''}
          keyboardAppearance={currentTheme}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize="none"
          editable={!disabled}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
        />
      </View>
      {!!errorMessage && showErrorMessage && <Text style={[styles.error, errorMessage && { color: 'red' }]}>{errorMessage}</Text>}

      {iconName && iconPosition === 'right' && <CustomIcon icon={{ type, name: iconName, size: 20, color: errorMessage ? 'red' : '#555' }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginVertical: 8,
  },
  icon: {
    marginHorizontal: 4,
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    position: 'absolute',
    fontSize: 11,
    top: -2,
    color: '#555',
  },
  error: {
    position: 'absolute',
    fontSize: 12,
    bottom: -15,
    color: '#555',
  },
  input: {
    marginTop: 3,
    height: 45,
    fontSize: 16,
  },
});

export default InputWithLabel;
