// src/redux/store.ts - FIXED VERSION WITH AUTH PERSISTENCE
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

import addNewAddressReducer from './slices/addNewAddressSlice';
import authReducer from './slices/authSlice';  // Keep existing food delivery auth
import configurationReducer from './slices/configurationSlice';
import locationPickerSlice from './slices/locationPickerSlice';
import restaurantSlice from './slices/restaurantSlice';
import storeSlice from './slices/storeSlice';
import themeReducer from './slices/themeSlice';
import searchSlice from './slices/searchSlice';
import cartReducer from './slices/cartSlice';
import productModalReducer from './slices/productModalSlice';
import orderIdsReducer from './slices/orderIdsSlice';
import rideLocationReducer from './slices/RideSlices/rideLocationSlice';
import rideSelectionReducer from "./slices/RideSlices/rideSelectionSlice";
import rideCreationReducer from "./slices/RideSlices/rideCreationSlice";
import appConfigReducer from './slices/appConfigSlice';
import activeRideReducer from './slices/RideSlices/activeRideSlice';


import authSuperAppReducer from './slices/authSliceSuperApp';  // Add new super app auth

const rootReducer = combineReducers({
  auth: authReducer,                   // Food delivery auth (existing)
  authSuperApp: authSuperAppReducer,   // Super app auth (new) - THIS IS KEY!
  theme: themeReducer,
  configuration: configurationReducer,
  addNewAddress: addNewAddressReducer,
  locationPicker: locationPickerSlice,
  restaurant: restaurantSlice,
  store: storeSlice,
  search: searchSlice,
  cart: cartReducer,
  productModal: productModalReducer,
  ordersIds: orderIdsReducer,
  rideLocation: rideLocationReducer,
  rideSelection: rideSelectionReducer,
  rideCreation: rideCreationReducer,
  appConfig: appConfigReducer,
  activeRide : activeRideReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 1,
  // 🔥 CRITICAL: Make sure authSuperApp is persisted!
  whitelist: ['theme', 'locationPicker', 'auth', 'authSuperApp', 'cart'],
  // Add some debugging
  debug: __DEV__, // This will log persistence actions in dev mode
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

const persistor = persistStore(store, null, () => {
  // This callback runs when rehydration is complete
  console.log('🔄 Redux persist rehydration complete');
  const state = store.getState();
  console.log('🔐 Auth state after rehydration:', {
    isAuthenticated: state.authSuperApp?.isAuthenticated,
    hasUser: !!state.authSuperApp?.user,
    hasToken: !!state.authSuperApp?.token,
    userName: state.authSuperApp?.user?.name
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { persistor, store };