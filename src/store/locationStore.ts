import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import LocationState from '../types/locationState';
import { RootState } from '.';


const initialState: LocationState = {
    name: 'City of London',
    coordinates: { lat: 51.513263, lng: -0.089878 },
};

export const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setMapLocation: (state, action: PayloadAction<LocationState>) => {
            state.name = action.payload.name;
            state.coordinates = action.payload.coordinates;
        },
        updateCoordinates: (state, action: PayloadAction<{ lat: number; lng: number }>) => {
            state.coordinates = action.payload;
        },
        updateName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        }
    },
});

export const { setMapLocation, updateCoordinates, updateName } = locationSlice.actions;

export default locationSlice.reducer;


export const selectCoordinates = (state: RootState) => state.location.coordinates
export const selectPlaceName = (state: RootState) => state.location.name