import React from "react";
import { ForecastData } from "./ForecastData"; // Assuming ForecastData is now a TSX component

// --- Interfaces for Current Weather Data ---
interface WindData {
    speed: number; // in m/s
    deg: number;   // in degrees
}

interface MainMetrics {
    humidity: number; // in %
    pressure: number; // in hPa
    feels_like: number; // in Kelvin
    temp?: number;
    temp_min?: number;
    temp_max?: number;
}

interface RainData {
    '1h'?: number; // Rain volume for the last 1 hour, mm
    '3h'?: number; // Rain volume for the last 3 hours, mm
}

interface SystemData {
    type: number;
    id: number;
    country: string;
    sunrise: number; // Unix timestamp
    sunset: number;  // Unix timestamp
}

// Minimal interface for currentWeatherData based on its usage in this component
interface CurrentWeatherData {
    wind: WindData;
    main: MainMetrics;
    visibility: number; // in metres
    sys: SystemData;
    rain?: RainData; // Optional property, only present if there's rain
    // You might want to add other common weather data fields here like `weather: WeatherCondition[]`, `coord`, `name`, `dt` if they are part of your actual API response and might be used elsewhere.
}

// --- Interfaces for Forecast Data (reusing from ForecastData component) ---
// Note: You would typically define these in a shared types file or within ForecastData.tsx
interface WeatherCondition {
    id: number;
    main: string;
    description: string;
    icon: string;
}

interface ForecastMainData {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
}

interface ForecastDataPoint {
    dt: number;
    dt_txt: string;
    main: ForecastMainData;
    weather: WeatherCondition[];
    clouds: { all: number };
    wind: { speed: number; deg: number };
    visibility: number;
    pop: number;
    sys: { pod: string };
}

// --- Props Interface for WeatherDetailsFocus Component ---
interface WeatherDetailsFocusProps {
    currentWeatherData: CurrentWeatherData | null; // Can be null if data hasn't loaded yet
    forecastData: {
        list: ForecastDataPoint[];
    } | null; // Can be null if data hasn't loaded yet
}

/**
 * @function WeatherDetailsFocus
 * @param {WeatherDetailsFocusProps} props - The properties passed to the component.
 * @description Displays detailed current weather information and a forecast summary.
 */
export const WeatherDetailsFocus: React.FC<WeatherDetailsFocusProps> = ({ currentWeatherData, forecastData }) => {
    // If currentWeatherData is null, don't render the details section
    if (currentWeatherData === null) {
        return (
            <div className="weather-details-focus-area">
                 <div className="weatherWidget">               
                    {/* Render ForecastData only if forecastData is available */}
                    <ForecastData data={forecastData} startTime={null} endTime={null} />
                </div>
                {/* Optionally display a loading message or placeholder for current weather */}
                <p>Loading current weather details...</p>
            </div>
        );
    }

    // Determine rainfall text
    const rainfallText: string = currentWeatherData.rain?.['3h'] !== undefined
        ? `${currentWeatherData.rain['3h']}mm in the last 3 hours.`
        : "No Rain";

    return (
        <div className="weather-details-focus-area">
            <div className="weatherWidget">
                {/* Pass forecastData to the ForecastData component */}
                <ForecastData data={forecastData} startTime={null} endTime={null} />
            </div>
            <div className="weatherContainer">
                <div className="row">
                    <div className="column">
                        <p className="title"> Wind Speed: </p>
                        <p className="value">{currentWeatherData.wind.speed}m/s </p>
                    </div>

                    <div className="column">
                        <p className="title"> Wind Direction:</p>
                        <p className="value">{currentWeatherData.wind.deg}° </p>
                    </div>
                    <div className="column">
                        <p className="title"> Humidity: </p>
                        <p className="value">{currentWeatherData.main.humidity}% </p>
                    </div>

                    <div className="column">
                        <p className="title"> Pressure: </p>
                        <p className="value">{currentWeatherData.main.pressure}hPa </p>
                    </div>
                </div>
                <div className="row">
                    <div className="column">
                        <p className="title"> Feels Like: </p>
                        <p className="value">{Math.floor(currentWeatherData.main.feels_like - 273.15)}° </p>
                    </div>

                    <div className="column">
                        <p className="title"> Rainfall: </p>
                        <p className="value">{rainfallText}</p>
                    </div>

                    <div className="column">
                        <p className="title"> Visibility: </p>
                        <p className="value">{currentWeatherData.visibility} metres </p>
                    </div>

                    <div className="column">
                        <p>
                            <div className="title">Sunrise: </div>
                            <div className="title">
                                {new Date(currentWeatherData.sys.sunrise * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                        </p>
                        <p>
                            <div className="title">Sunset: </div>
                            <div className="title">
                                {new Date(currentWeatherData.sys.sunset * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
