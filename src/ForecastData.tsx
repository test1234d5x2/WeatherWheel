import React from "react";

// Define interfaces for the weather data structure
interface WeatherCondition {
    id: number;
    main: string; // e.g., "Thunderstorm", "Drizzle", "Rain", "Snow", "Clear", "Atmosphere Group", "Clouds"
    description: string;
    icon: string;
}

interface MainData {
    temp: number; // Temperature in Kelvin
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
}

interface ForecastDataPoint {
    dt: number;
    dt_txt: string; // Date and time in "YYYY-MM-DD HH:MM:SS" format
    main: MainData;
    weather: WeatherCondition[];
    clouds: { all: number };
    wind: { speed: number; deg: number };
    visibility: number;
    pop: number; // Probability of precipitation
    sys: { pod: string };
}

// Define the interface for the 'data' prop
interface ForecastDataProps {
    data: {
        list: ForecastDataPoint[];
    } | null; // 'data' can be null
}

/**
 * @function ForecastData
 * @param {ForecastDataProps} props - The properties passed to the component.
 * @description Displays the weather forecast to the user, filtered by a specified time range.
 */
export const ForecastData: React.FC<ForecastDataProps> = ({ data }: ForecastDataProps) => {
    // Early exit if data is not provided or its 'list' property is undefined
    if (data === null || data.list === undefined) {
        return null;
    }

    const forecastDataList: ForecastDataPoint[] = data.list;
    const forecast: [string, string, number, string][] = []; // [time, weather_main, temperature_celsius]

    // Forecast for the next 24 hours only.
    forecastDataList.forEach((dataPoint, index) => {
        if (index <= 24) {
            const dataPointDate = new Date(dataPoint.dt_txt);
            forecast.push([
                dataPointDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
                dataPoint.weather[0].main,
                Math.floor(dataPoint.main.temp - 273.15), // Converts temperature from Kelvin to Celsius
                dataPoint.weather[0].icon
            ]);
        }
    });

    return (
        <div className="forecast-data-section-container">
            <div className="forecast-data-section">
                {forecast.map((item, index) => (
                    <div className="forecast-singular-data-section" key={index}>
                        <span className="timesText">{item[0]}</span>
                        <span className="weatherSymbol">
                            <img alt="weatherSymbol" className="weatherSymbol" src={`https://openweathermap.org/img/wn/${item[3]}@2x.png`} />
                        </span>
                        <span className="temperatureText">{item[1]}</span>
                        <span className="temperatureText">{item[2]}°</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
