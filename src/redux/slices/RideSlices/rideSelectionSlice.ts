// store/slices/rideSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RideState {
  selectedRide: any | null;
}

const initialState: RideState = {
  selectedRide: null,
};

const rideSlice = createSlice({
  name: "ride",
  initialState,
  reducers: {
    setLastSelectedRide(state, action: PayloadAction<any>) {
      state.selectedRide = action.payload;
    },
    clearLastSelectedRide(state) {
      state.selectedRide = null;
    },
  },
});

export const { setLastSelectedRide, clearLastSelectedRide } = rideSlice.actions;
export default rideSlice.reducer;
