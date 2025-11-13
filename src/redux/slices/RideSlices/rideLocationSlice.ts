import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RideLocationState {
    fromLocation: string;
    toLocation: string;
    fromCoords: { lat: string; lng: string } | null;
    toCoords: { lat: string; lng: string } | null;
}

const initialState: RideLocationState = {
    fromLocation: '',
    toLocation: '',
    fromCoords: null,
    toCoords: null,
};

const rideLocationSlice = createSlice({
    name: 'rideLocation',
    initialState,
    reducers: {
        setFromSliceLocation: (state, action: PayloadAction<string>) => {
            state.fromLocation = action.payload;
        },
        setToSliceLocation: (state, action: PayloadAction<string>) => {
            state.toLocation = action.payload;
        },
        setFromSliceCoords: (state, action: PayloadAction<{ lat: string; lng: string }>) => {
            state.fromCoords = action.payload;
        },
        setToSliceCoords: (state, action: PayloadAction<{ lat: string; lng: string }>) => {
            state.toCoords = action.payload;
        },
        resetLocations: (state) => {
            state.fromLocation = '';
            state.toLocation = '';
            state.fromCoords = null;
            state.toCoords = null;
        },
    },
});

export const { setFromSliceLocation, setToSliceLocation, setFromSliceCoords, setToSliceCoords, resetLocations } = rideLocationSlice.actions;

export default rideLocationSlice.reducer;
