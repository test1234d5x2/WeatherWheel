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
    startTime: string | null; // Can be null, e.g., "00:00"
    endTime: string | null;   // Can be null, e.g., "23:59"
}

/**
 * @function ForecastData
 * @param {ForecastDataProps} props - The properties passed to the component.
 * @description Displays the weather forecast to the user, filtered by a specified time range.
 */
export const ForecastData: React.FC<ForecastDataProps> = ({ data, startTime, endTime }: ForecastDataProps) => {
    // Early exit if data is not provided or its 'list' property is undefined
    if (data === null || data.list === undefined) {
        return null;
    }

    const forecastDataList: ForecastDataPoint[] = data.list;
    const forecast: [string, string, number][] = []; // [time, weather_main, temperature_celsius]

    let startDate = new Date();
    let endDate = new Date();

    // Use nullish coalescing to provide default string values if startTime or endTime are null
    const actualStartTime = startTime ?? "00:00";
    const actualEndTime = endTime ?? "23:59";

    // Set hours and minutes for startDate and endDate based on props
    startDate.setHours(parseInt(actualStartTime.split(":")[0]), parseInt(actualStartTime.split(":")[1]), 0, 0);
    endDate.setHours(parseInt(actualEndTime.split(":")[0]), parseInt(actualEndTime.split(":")[1]), 0, 0);

    // Correct endDate to the next day if it's before or equal to startDate
    if (endDate <= startDate) {
        endDate.setDate(endDate.getDate() + 1);
    }

    // Filter forecastDataList for the time range between startDate and endDate
    forecastDataList.forEach((dataPoint) => {
        const dataPointDate = new Date(dataPoint.dt_txt);
        if (dataPointDate >= startDate && dataPointDate <= endDate) {
            forecast.push([
                dataPointDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
                dataPoint.weather[0].main,
                Math.floor(dataPoint.main.temp - 273.15) // Converts temperature from Kelvin to Celsius
            ]);
        }
    });

    /**
     * @function setPath
     * @param {string} description - The main weather description (e.g., "Thunderstorm", "Clear").
     * @description Determines the path of the weather icon based on the forecast description.
     * @returns {string} The path to the weather icon image.
     * @note In a production React app, using `require()` for images might be handled by bundlers like Webpack.
     * For better type safety and direct import, consider importing images statically or using SVG/icon libraries.
     */
    const setPath = (description: string): string => {
        if (description === "Thunderstorm") {
            return require('./css/assets/stormSymbol.png');
        } else if (description === "Drizzle") {
            return require('./css/assets/drizzleSymbol.png');
        } else if (description === "Rain") {
            return require('./css/assets/rainSymbol.png');
        } else if (description === "Snow") {
            return require('./css/assets/snowSymbol.png');
        } else if (description === "Clear") {
            return require('./css/assets/sunSymbol.png');
        } else if (description === "Atmosphere Group") { // This typically covers fog, mist, haze, etc.
            return require('./css/assets/windSymbol.png'); // Using wind symbol for atmosphere group
        } else {
            // Default to cloud symbol for other conditions like "Clouds"
            return require('./css/assets/cloudSymbol.png');
        }
    };

    return (
        <div className="forecast-data-section-container">
            <div className="forecast-data-section">
                {forecast.map((item, index) => (
                    <div className="forecast-singular-data-section" key={index}>
                        <span className="timesText">{item[0]}</span>
                        <span className="weatherSymbol">
                            <img alt="weatherSymbol" className="weatherSymbol" src={setPath(item[1])} />
                        </span>
                        <span className="temperatureText">{item[1]}</span>
                        <span className="temperatureText">{item[2]}°</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
