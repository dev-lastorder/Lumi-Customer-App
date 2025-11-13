import { TextStyle } from 'react-native';
import Colors from './Colors';
import { head } from 'lodash';
import adjust from '../helpers/adjust';

// Updated font sizes to be numbers (without 'px' suffix)
export const fontSizes = {
  sxx: 10, // 10px as a number
  xs: 12, // 12px as a number
  sm: 14, // 14px as a number
  md: 16, // 16px as a number
  lg: 18, // 18px as a number
  xl: 20, // 20px as a number
  '2xl': 24, // 24px as a number
  '3xl': 30, // 30px as a number
  '4xl': 36, // 36px as a number
} as const;

export const fontWeights = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  black: '900',
} as const;

export type FontWeight = keyof typeof fontWeights;

export const textVariants = {
  defaults: {
    fontSize: fontSizes.sm, // 14
    fontWeight: fontWeights.normal,
    lineHeight: adjust(20),
  },
  heading1: {
    fontSize: fontSizes['3xl'], // 30
    fontWeight: fontWeights.bold,
    lineHeight: adjust(36),
  },
  heading2: {
    fontSize: fontSizes['2xl'], // 24
    fontWeight: fontWeights.bold,
    lineHeight: adjust(38),
  },
  heading3: {
    fontSize: fontSizes.xl, // 20
    fontWeight: fontWeights.semibold,
    lineHeight: adjust(26),
  },
  subheading: {
    fontSize: fontSizes.lg, // 18
    fontWeight: fontWeights.medium,
    lineHeight: adjust(24),
  },
  body: {
    fontSize: fontSizes.md, // 16
    fontWeight: fontWeights.normal,
    lineHeight: adjust(22),
  },
  caption: {
    fontSize: fontSizes.xs, // 12
    fontWeight: fontWeights.normal,
    color: Colors.common.grey,
    lineHeight: adjust(18),
  },
  button: {
    fontSize: fontSizes.md, // 16
    fontWeight: fontWeights.medium,
    textAlign: 'center',
    lineHeight: adjust(20),
  },
  label: {
    fontSize: fontSizes.sm, // 14
    fontWeight: fontWeights.medium,
    lineHeight: adjust(18),
  },
} as const;

export type TextVariant = keyof typeof textVariants;
