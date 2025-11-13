import { ZoneTypes } from '@/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocationState {
  type: ZoneTypes;
  label: string | null;
  selectedTitle: string;
  latitude: string | null;
  longitude: string | null;
  addressId?: string | null;
  zoneId?: string | null;
  zoneTitle: string | null;
  zoneCoordinates: number[][] | null;
  showLocationModal: boolean;
}

const initialState: LocationState = {
  type: null,
  label: null,
  selectedTitle: '',
  latitude: null,
  longitude: null,
  addressId: null,
  zoneId: null,
  zoneTitle: null,
  zoneCoordinates: null,
  showLocationModal: false,
};

const locationPickerSlice = createSlice({
  name: 'locationPicker',
  initialState,
  reducers: {
    setCurrentLocation(state, action: PayloadAction<{ latitude: string; longitude: string; title: string }>) {
      state.type = 'current';
      state.label = 'Current location';
      state.selectedTitle = action.payload.title;
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.addressId = null;
      state.zoneId = null;
      state.zoneTitle = null;
      state.zoneCoordinates = null;
    },
    setAddress(
      state,
      action: PayloadAction<{
        addressId: string;
        label: string;
        selectedTitle: string;
        latitude: string;
        longitude: string;
        zoneId: string;
        zoneTitle: string;
        zoneCoordinates: number[][];
      }>
    ) {
      state.type = 'address';
      state.addressId = action.payload.addressId;
      state.label = action.payload.label;
      state.selectedTitle = action.payload.selectedTitle;
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.zoneId = action.payload.zoneId;
      state.zoneTitle = action.payload.zoneTitle;
      state.zoneCoordinates = action.payload.zoneCoordinates;
    },
    setZone(
      state,
      action: PayloadAction<{
        addressId: string;
        label: string;
        selectedTitle: string;
        latitude: string;
        longitude: string;
        zoneId: string;
        zoneTitle: string;
        zoneCoordinates: number[][];      }>
    ) {
      state.type = 'zone';
      state.zoneId = action.payload.zoneId;
      state.zoneTitle = action.payload.zoneTitle;
      state.selectedTitle = action.payload.zoneTitle;
      state.label = action.payload.label;
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.addressId = action.payload.zoneId;
      state.zoneCoordinates = action.payload.zoneCoordinates;
    },
    resetLocation(state) {
      state.type = null;
      state.label = null;
      state.selectedTitle = '';
      state.latitude = null;
      state.longitude = null;
      state.addressId = null;
      state.zoneId = null;
      state.zoneTitle = null;
      state.zoneCoordinates = null;
    },
    setShowLocationModal(state, action) {
      state.showLocationModal = action.payload;
    },
  },
});

export const { setCurrentLocation, setAddress, setZone, resetLocation, setShowLocationModal } = locationPickerSlice.actions;
export default locationPickerSlice.reducer;
