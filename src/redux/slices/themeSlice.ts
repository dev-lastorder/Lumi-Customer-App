import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';
import type { ThemeState } from '../types';

const initialOsTheme = 'light';

const initialState: ThemeState = {
  // currentTheme: initialOsTheme,
  currentTheme: "light",
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.currentTheme = action.payload;
    },
    toggleTheme: (state) => {
      state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
    },
    applyOsTheme: (state) => {
      const osTheme = Appearance.getColorScheme() ?? 'light';
      state.currentTheme = osTheme;
    },
  },
});

export const { setTheme, toggleTheme, applyOsTheme } = themeSlice.actions;

export default themeSlice.reducer;
