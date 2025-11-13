import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ride: null,
  hourlyRide: false,
  hours: 1,
  scheduleRide: false,
  scheduleRideTime: null,
  myRideFare: null,
  familyRide: false,
  findingRide: false,
  rideKm: null,
  rideDuration: null,

};


const rideCreationSlice = createSlice({
  name: "rideCreation",
  initialState,
  reducers: {
    setRide(state, action) {
      state.ride = action.payload;
    },
    setHourlyRide: (state, action) => {
      state.hourlyRide = action.payload;
    },

    setSliceFindingRide: (state, action) => {
      state.findingRide = action.payload;
    },
    setRideKm: (state, action) => {
      state.rideKm = action.payload;
    },
    setRideDuration: (state, action) => {
      state.rideDuration = action.payload;
    },
    clearRide(state) {
      state.ride = null;
      state.scheduleRide = false;
      state.hourlyRide = false;
      state.scheduleRideTime = null;
      state.myRideFare = null;
      state.familyRide = false;
      state.findingRide = false;
        state.rideKm = null;
      state.rideDuration = null;

    },
    resetHourlyRide: (state) => {
      state.hourlyRide = false;
    },
    setRideHours: (state, action) => {
      state.hours = action.payload;
    },
    setFamilyRide: (state, action) => {
      state.familyRide = action.payload;
    },
    resetFamilyRide(state) {
      state.scheduleRide = false;
    },
    resetFindingRide: (state) => {
      state.findingRide = false;
    },

    setScheduleRide: (state, action) => {
      state.scheduleRide = action.payload;

    },
    resetScheduleRide(state) {
      state.scheduleRide = false;
    },
    setScheduleRideTime(state, action) {
      state.scheduleRideTime = action.payload;
    },
    clearScheduleRideTime(state) {
      state.scheduleRideTime = null
    },
    setMyRideFare(state, action) {
      state.myRideFare = action.payload;
    },
  },
});

export const { setRide, setRideKm,setRideDuration, clearRide, setHourlyRide, resetHourlyRide, setRideHours, setScheduleRide, resetScheduleRide, setScheduleRideTime, clearScheduleRideTime, setMyRideFare, setFamilyRide, resetFamilyRide, resetFindingRide, setSliceFindingRide } = rideCreationSlice.actions;
export default rideCreationSlice.reducer;
