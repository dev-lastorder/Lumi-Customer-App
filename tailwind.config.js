/** @type {import('tailwindcss').Config} */
const { lightColors, darkColors, commonColors } = require('./src/utils/constants/Colors');

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      // --- Add Custom Colors ---
      colors: {
        // Define Semantic names using light theme as default
        primary: lightColors.primary,
        background: lightColors.background,
        bgLight: lightColors.bgLight,
        card: lightColors.card,
        'card-secondary': lightColors.cardSecondary,
        text: lightColors.text,
        border: lightColors.border,
        notification: lightColors.notification,
        'text-secondary': lightColors.textSecondary,
        'text-muted': lightColors.textMuted,
        accent: lightColors.accent,
        success: lightColors.success,
        warning: lightColors.warning,
        error: lightColors.error,
        disabled: lightColors.disabled,
        'button-text': lightColors.buttonText,
        'button-background': lightColors.buttonBackground,
        white: lightColors.white, // Explicit white/black might be needed
        black: lightColors.black,
        tint: lightColors.tint,
        'icon-background': lightColors?.iconBackground,
        'grey-shade': lightColors.greyShade,

        // Explicitly define the dark palette for NativeWind v4 preset mapping
        dark: {
          primary: darkColors.primary,
          background: darkColors.background,
          bgLight: darkColors.bgLight,
          card: darkColors.card,
          'card-secondary': darkColors.cardSecondary,
          text: darkColors.text,
          border: darkColors.border,
          notification: darkColors.notification,
          'text-secondary': darkColors.textSecondary,
          'text-muted': darkColors.textMuted,
          accent: darkColors.accent,
          success: darkColors.success,
          warning: darkColors.warning,
          error: darkColors.error,
          disabled: darkColors.disabled,
          'button-text': darkColors.buttonText,
          'button-background': darkColors.buttonBackground,
          white: darkColors.white,
          black: darkColors.black,
          tint: darkColors.tint,
          'icon-background': darkColors?.iconBackground,
          'grey-shade': darkColors?.greyShade,
        },

        // Common colors
        transparent: commonColors.transparent,
        grey: commonColors.grey,
        'light-grey': commonColors.lightGrey,
        'dark-grey': commonColors.darkGrey,
      },
      fontSize: {
        sxx: '10px',
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        black: '900',
      },
    },
  },
  plugins: [],
};
