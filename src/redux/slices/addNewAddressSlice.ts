import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AddNewAddressState {
  _id: string;
  zoneId: string;
  zoneTitle: string;
  location: string;
  locationType: string;
  latitude: string;
  longitude: string;
  otherDetails: string;
}

const initialState: AddNewAddressState = {
  _id: '',
  zoneId: '',
  zoneTitle: '',
  location: '',
  locationType: '',
  latitude: '',
  longitude: '',
  otherDetails: '',
};

const addNewAddressSlice = createSlice({
  name: 'addNewAddress',
  initialState,
  reducers: {
    updateZone(state, action: PayloadAction<{ id: string; title: string }>) {
      state.zoneId = action.payload.id;
      state.zoneTitle = action.payload.title;
    },
    updateLocation(state, action: PayloadAction<string>) {
      state.location = action.payload;
    },
    updateLocationType(state, action: PayloadAction<string>) {
      state.locationType = action.payload;
    },
    updateLatitude(state, action: PayloadAction<string>) {
      state.latitude = action.payload;
    },
    updateLongitude(state, action: PayloadAction<string>) {
      state.longitude = action.payload;
    },
    updateOtherDetails(state, action: PayloadAction<string>) {
      state.otherDetails = action.payload;
    },
    updateAddressId(state, action: PayloadAction<string>) {
      state._id = action.payload;
    },
    resetAddress() {
      return initialState;
    },
  },
});

export const { updateAddressId, updateZone, updateLocation, updateLocationType, updateLatitude, updateLongitude, updateOtherDetails, resetAddress } =
  addNewAddressSlice.actions;

export default addNewAddressSlice.reducer;
