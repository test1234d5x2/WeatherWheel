import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import VehicleType from '../types/vehicleType';
import { RootState } from '.';


const initialState: VehicleType = {
    vehicle: "car"
};

export const vehicleSlice = createSlice({
    name: 'vehicle',
    initialState,
    reducers: {
        setVehicleType: (state, action: PayloadAction<VehicleType>) => {
            state.vehicle = action.payload.vehicle
        },
    },
});

export const { setVehicleType } = vehicleSlice.actions;
export default vehicleSlice.reducer;


export const selectVehicle = (state: RootState) => state.vehicle.vehicle