import { configureStore } from '@reduxjs/toolkit';
import locationReducer from './locationStore';
import vehicleReducer from './vehicleStore'
import weatherReducer from './weatherStore'

export const store = configureStore({
    reducer: {
        location: locationReducer,
        vehicle: vehicleReducer,
        weather: weatherReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;