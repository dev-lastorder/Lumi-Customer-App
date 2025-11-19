import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RideState {
  onGoingActiveRideData: any | null; // replace 'any' with proper type if you have
}

const initialState: RideState = {
  onGoingActiveRideData: null,
};

const activeRideSlice = createSlice({
  name: "activeRide",
  initialState,
  reducers: {
    // Save the active ride
    setOnGoingRideData: (state, action: PayloadAction<any>) => {
      state.onGoingActiveRideData = action.payload;
    },

    // Clear active ride
    clearOnGoingRideData: (state) => {
      state.onGoingActiveRideData = null;
    },
  },
});

export const { setOnGoingRideData, clearOnGoingRideData } = activeRideSlice.actions;

export default activeRideSlice.reducer;
