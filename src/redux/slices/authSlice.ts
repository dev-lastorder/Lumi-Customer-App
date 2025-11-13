import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, IUser, LoginPayload } from '../types';

const initialState: AuthState = {
  isAuthenticated: false,
  user: {
    id: '',
    name: '',
    email: '',
    favourite: [],
  },
  token: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // # Example reducers - feel free to modify
    loginSuccess: (state, action: PayloadAction<LoginPayload>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'succeeded';
      state.error = null;
    },
    // logout: (state) => {

    //   AsyncStorage.clear().then(() => {
    //     state.isAuthenticated = false;
    //     state.user = null;
    //     state.token = null;
    //     state.status = 'idle';
    //     state.error = null;
    //   });
    // },

    logout(state) {
      state.isAuthenticated = false;
      state.user = {
        id: '',
        name: '',
        email: '',
      };
      (state.token = null), (state.status = 'idle'), (state.error = null);
    },
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = { ...state.user, ...action.payload };
    },
    setToken: (state, action: PayloadAction<IUser>) => {
      state.token = action.payload.token || '';
    },
    // # Add other reducers like loginRequest, loginFailure as needed
  },
});

export const { setUser, loginSuccess, setToken, logout } = authSlice.actions;

export default authSlice.reducer;
