import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';


interface WeatherData {
    temperature: number
    weather: string
    visibility: number
    windSpeed: number
}

interface WeatherDataStoreType extends WeatherData {
    initial: boolean
}

const initialState: WeatherDataStoreType = {
    temperature: 0,
    weather: '',
    visibility: 0,
    windSpeed: 0,
    initial: true
}


export const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {
        setWeather: (state, action: PayloadAction<WeatherData>) => {
            state.temperature = action.payload.temperature
            state.weather = action.payload.weather
            state.visibility = action.payload.visibility
            state.windSpeed = action.payload.windSpeed
            state.initial = false
            
        },
    },
});

export const { setWeather } = weatherSlice.actions

export default weatherSlice.reducer


export const selectTemperature = (state: RootState) => state.weather.temperature
export const selectWeather = (state: RootState) => state.weather.weather
export const selectVisibility = (state: RootState) => state.weather.visibility
export const selectWindSpeed = (state: RootState) => state.weather.windSpeed
export const selectInitial = (state: RootState) => state.weather.initial