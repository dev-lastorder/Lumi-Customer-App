export const fontFamilyMapping = {
  Poppins: {
    light: 'Poppins-Light',
    normal: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semibold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
    black: 'Poppins-Black',
  },
  Inter: {
    light: 'Inter-Light',
    normal: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    black: 'Inter-Black',
    italic: 'Inter-Italic',
    boldItalic: 'Inter-BoldItalic',
  },
} as const;

export type FontFamilyName = keyof typeof fontFamilyMapping;

// Default constants for header animation
export const DEFAULT_IMAGE_AREA_HEIGHT = 240;
export const DEFAULT_STICKY_HEADER_HEIGHT = 60; // Height of the solid part of the sticky header
