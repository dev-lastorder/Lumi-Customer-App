import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import { Colors, fontSizes, fontWeights, textVariants } from '@/utils';
import { fontFamilyMapping } from './constants';
import { CustomTextProps, FontWeightName } from './interfaces';
import adjust from '@/utils/helpers/adjust';

const getTextColor = ({
  theme,
  baseVariantStyle,
  lightColor,
  darkColor,
}: {
  theme: 'dark' | 'light';
  baseVariantStyle: TextStyle;
  lightColor?: string;
  darkColor?: string;
}) => {
  const fallbackColor = theme === 'dark' ? Colors.dark.text : Colors.light.text;

  if (theme === 'dark') {
    return darkColor ?? baseVariantStyle.color ?? fallbackColor;
  }

  return lightColor ?? baseVariantStyle.color ?? fallbackColor;
};

const getFontFamily = ({
  familyName,
  weight,
}: {
  familyName: keyof typeof fontFamilyMapping;
  weight: FontWeightName;
}) => {
  const map = fontFamilyMapping[familyName];
  const family = map?.[weight];

  if (!family) {

    return map['normal'] ?? 'System';
  }

  return family;
};

const getFontSize = ({
  fontSizeProp,
  baseStyle,
  responsive,
}: {
  fontSizeProp?: keyof typeof fontSizes;
  baseStyle: TextStyle;
  responsive: boolean;
}) => {
  const size = fontSizeProp
    ? fontSizes[fontSizeProp]
    : (baseStyle.fontSize as number | undefined) ?? fontSizes.md;

  return responsive ? adjust(size) : size;
};

export function CustomText({
  style,
  lightColor,
  darkColor,
  variant = 'body',
  fontWeight: fontWeightNameProp = 'normal',
  fontSize: fontSizeProp,
  responsive = true,
  isDefaultColor = true,
  children,
  fontFamily: fontFamilyNameProp = 'Poppins',
  className,
  ...otherProps
}: CustomTextProps) {
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);

  const baseStyle: TextStyle = {
    ...textVariants.defaults,
    ...(textVariants[variant] || textVariants.body),
  };

  const color = getTextColor({ theme:'light', baseVariantStyle: baseStyle, lightColor, darkColor });
  const fontSize = getFontSize({ fontSizeProp, baseStyle, responsive });

  const resolvedWeight: FontWeightName =
    fontWeightNameProp ??
    (Object.keys(fontWeights) as FontWeightName[]).find((key) => fontWeights[key] === baseStyle.fontWeight) ??
    'normal';

  const fontFamily = getFontFamily({
    familyName: fontFamilyNameProp,
    weight: resolvedWeight,
  });

  const finalStyle = StyleSheet.flatten([
    baseStyle,
    isDefaultColor && { color },
    { fontSize },
    { fontFamily },
    style,
  ]);

  return (
    <Text style={finalStyle} className={className} {...otherProps}>
      {children}
    </Text>
  );
}
