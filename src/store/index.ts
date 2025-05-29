import { configureStore } from '@reduxjs/toolkit';
import locationReducer from './locationStore';
import vehicleReducer from './vehicleStore'

export const store = configureStore({
    reducer: {
        location: locationReducer,
        vehicle: vehicleReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;