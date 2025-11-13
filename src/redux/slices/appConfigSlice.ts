import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  rateToBase: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppConfigState {
  currency: Currency | null;
  emergencyContact: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AppConfigState = {
  currency: null,
  emergencyContact: null,
  loading: false,
  error: null,
};



const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<Currency | null>) => {
      state.currency = action.payload;
    },
    setEmergencyContact: (state, action: PayloadAction<string>) => {
      state.emergencyContact = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    resetConfig: () => initialState,
  },
});

export const { setCurrency, setEmergencyContact, setLoading, setError, resetConfig } = appConfigSlice.actions;

export default appConfigSlice.reducer;
