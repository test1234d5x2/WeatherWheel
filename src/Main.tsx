import React, { useState, useEffect, useCallback } from "react";
import { WeatherSummary } from "./WeatherSummary";
import { WeatherWarnings } from "./WeatherWarnings";
import { ForecastData } from "./ForecastData";
import { VehicleSelection } from "./VehicleSelection";
import { EditableComponent } from "./EditableSection";
import jsonDataWarning from "./weatherWarnings.json";
import VehicleType from "./types/vehicleType";


// From WeatherDetailsFocus.tsx or similar for current weather data
interface CurrentWeatherData {
    weather: { id: number; main: string; description: string; icon: string; }[];
    main: { temp: number; feels_like: number; temp_min: number; temp_max: number; pressure: number; humidity: number; };
    wind: { speed: number; deg: number; };
    visibility: number;
    sys: { type: number; id: number; country: string; sunrise: number; sunset: number; };
    rain?: { '1h'?: number; '3h'?: number; };
    cod?: string
}

// From ForecastData.tsx for forecast data points
interface ForecastDataPoint {
    dt: number;
    dt_txt: string;
    main: { temp: number; feels_like: number; temp_min: number; temp_max: number; pressure: number; humidity: number; };
    weather: { id: number; main: string; description: string; icon: string; }[];
    clouds: { all: number };
    wind: { speed: number; deg: number };
    visibility: number;
    pop: number;
    sys: { pod: string };
}

// Full OpenWeatherMap Forecast API response structure
interface OpenWeatherForecastResponse {
    list: ForecastDataPoint[];
    city?: {
        id: number;
        name: string;
        coord: { lat: number; lon: number; };
        country: string;
        population: number;
        timezone: number;
        sunrise: number;
        sunset: number;
    };
    cod?: string;
    message?: number;
    cnt?: number;
}

// From WeatherWarnings.tsx for weather alerts
interface WeatherAPIAlert {
    headline: string;
    // Add other properties if they are part of your actual warning data.
    // e.g., description: string; severity: string; ends_utc: string;
}

// Full WeatherAPI Alerts response structure
interface WeatherAPIAlertsResponse {
    alerts: {
        alert: WeatherAPIAlert[];
    };
}

// From OpenRouteService API response for directions
interface OpenRouteServiceResponse {
    features?: {
        geometry: {
            coordinates: number[][];
        };
    }[];
    error?: {
        code: number;
        message: string;
    };
}

interface AdviceWarningsData {
    [vehicleType: string]: AdviceWarningTexts[];
}

interface AdviceWarningTexts {
    stormText: string[];
    rainText: string[];
    SnowText: string[];
    windText: string[];
    generalText: string[];
}


/**
 * @function Main
 * @description Renders the components of each main page (Home, Map, Advice, Details)
 * based on the `showing` prop, and manages various application states including
 * location, weather data, and vehicle selection.
 */
export const Main: React.FC = () => {
    const [alerts, setAlerts] = useState<WeatherAPIAlert[] | null>(null);
    const [startLocation, setStartLocation] = useState<{ lat: number | null; long: number | null; name: string | null }>({
        lat: null,
        long: null,
        name: null,
    });
    const [endLocation, setEndLocation] = useState<{ lat: number | null; long: number | null; name: string }>({
        lat: null,
        long: null,
        name: "Destination",
    });
    const [forecastData, setForecastData] = useState<OpenWeatherForecastResponse | null>(null);
    const [currentWeatherData, setCurrentWeatherData] = useState<CurrentWeatherData | null>(null);
    const [mapLineCoordinates, setMapLineCoordinates] = useState<number[][]>([]);
    const [vehicle, setVehicleState] = useState<VehicleType>("car");      // Renamed to avoid conflict with setVehicle callback

    // --- Callbacks for State Updates ---

    /**
     * @function updateStartInfo
     * @param {number} lat - Latitude of the start location.
     * @param {number} long - Longitude of the start location.
     * @param {string} name - Name of the start location.
     * @description Updates the start location information. This will trigger
     * useEffects to fetch weather and potentially route data.
     */
    const updateStartInfo = useCallback((lat: number, long: number, name: string): void => {
        setStartLocation({ lat, long, name });
    }, []); // No dependencies for this callback as it only sets state

    /**
     * @function updateDestinationInfo
     * @param {number} lat - Latitude of the destination location.
     * @param {number} long - Longitude of the destination location.
     * @param {string} name - Name of the destination location.
     * @description Updates the destination location information. This will trigger
     * a useEffect to fetch route data.
     */
    const updateDestinationInfo = useCallback((lat: number, long: number, name: string): void => {
        setEndLocation({ lat, long, name });
    }, []); // No dependencies for this callback as it only sets state

    /**
     * @function setVehicle
     * @param {VehicleType} newVehicle - The selected vehicle type.
     * @description Updates the vehicle type in the component's state.
     */
    const setVehicle = useCallback((newVehicle: VehicleType): void => {
        setVehicleState(newVehicle);
    }, []); // No dependencies for this callback as it only sets state

    /**
     * @function setTimes
     * @param {string} newStartTime - The selected start time string (e.g., "09:00").
     * @param {string} newEndTime - The selected end time string (e.g., "17:00").
     * @description Updates the start and end times in the component's state.
     */


    // --- useEffect Hooks for Data Fetching ---

    // Effect for initial default location setup (replaces componentDidMount)
    useEffect(() => {
        updateStartInfo(51.513263, -0.089878, "City of London");
    }, []); // Dependency: updateStartInfo (stable due to useCallback)

    // Effect for fetching weather data (forecast and current) based on start location
    useEffect(() => {
        if (startLocation.lat !== null && startLocation.long !== null) {
            // Fetch weather forecast data on an hourly basis.
            fetch(`https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${startLocation.lat}&lon=${startLocation.long}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`)
                .then(response => response.json())
                .then((data: OpenWeatherForecastResponse) => {
                    if (data.cod === "200") { // Check if API call was successful
                        setForecastData(data);
                    } else {
                        console.error("OpenWeatherMap Forecast API Error:", data.message);
                        setForecastData(null); // Clear data on error
                    }
                })
                .catch(error => {
                    console.error("Hourly Forecast Fetch Error:", error);
                    setForecastData(null); // Clear data on error
                });

            // Fetch current weather data
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${startLocation.lat}&lon=${startLocation.long}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`)
                .then(response => response.json())
                .then((data: CurrentWeatherData) => {
                    if (!Object.keys(data).includes("code")) { // OpenWeatherMap returns numerical cod for current weather
                        setCurrentWeatherData(data);
                    } else {
                        console.error("OpenWeatherMap Current Weather API Error:");
                        setCurrentWeatherData(null); // Clear data on error
                    }
                })
                .catch(error => {
                    console.error("Current Weather Fetch Error:", error);
                    setCurrentWeatherData(null); // Clear data on error
                });
        }
    }, [startLocation.lat, startLocation.long]); // Dependencies: latitude and longitude of start location

    // Effect for fetching weather alerts (Note: original code uses fixed "London" query)
    useEffect(() => {
        // The original code fetched alerts for "London" regardless of startName.
        // If you want to fetch for `startLocation.name`, change "London" to `${startLocation.name}`
        if (startLocation.name !== null) {
            fetch(`https://api.weatherapi.com/v1/forecast.json?key=${process.env.REACT_APP_WEATHERAPI_API_KEY}&q=London&days=1&aqi=no&alerts=yes`)
                .then(response => response.json())
                .then((data: WeatherAPIAlertsResponse) => {
                    setAlerts(data.alerts.alert);
                })
                .catch(error => {
                    console.error("Weather Alerts Fetch Error:", error);
                    setAlerts(null); // Clear alerts on error
                });
        }
    }, [startLocation.name]); // Dependency: name of start location (even if it's fixed to London in fetch)

    // Effect for fetching route information based on start and end locations
    useEffect(() => {
        if (startLocation.lat !== null && startLocation.long !== null && endLocation.lat !== null && endLocation.long !== null) {
            fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.REACT_APP_OPEN_ROUTE_SECRVICES_API_KEY}&start=${startLocation.long},${startLocation.lat}&end=${endLocation.long},${endLocation.lat}`)
                .then(response => response.json())
                .then((data: OpenRouteServiceResponse) => {
                    let coordinates: number[][] = [];
                    if (data.error !== undefined) {
                        // An error code usually means that the API cannot find a route because
                        // the approximate distance is larger than 6000km. In this case,
                        // just add the start and end coordinates to give one straight line.
                        console.warn("OpenRouteService Error:", data.error.message);
                        if (startLocation.lat && endLocation.lat && startLocation.long && endLocation.long) {
                            coordinates.push([startLocation.lat, startLocation.long], [endLocation.lat, endLocation.long])
                        }
                    } else if (data.features && data.features.length > 0) {
                        // Gets the coordinates for the specific route (so that it can be placed as a line on the map).
                        coordinates = data.features[0].geometry.coordinates.map((item) => [item[1], item[0]]); // Convert [long, lat] to [lat, long]
                    }
                    setMapLineCoordinates(coordinates);
                })
                .catch(error => {
                    console.error("OpenRouteService Fetch Error:", error);
                    setMapLineCoordinates([]); // Clear coordinates on error
                });
        } else {
            // Clear map line coordinates if not both start and end locations are set
            setMapLineCoordinates([]);
        }
    }, [startLocation.lat, startLocation.long, endLocation.lat, endLocation.long]); // Dependencies: all coordinates


    return (
        <main>
            <section className="Weather">
                <a href="map">Map</a>
                <WeatherSummary data={currentWeatherData} placeName={startLocation.name || "Loading..."} />
            </section>
            <section className="weatherWidget">
                <ForecastData data={forecastData} />
            </section>
            <section style={{display: "flex", columnGap: "2rem"}}>
                <section className="warningsWidget">
                    <WeatherWarnings
                        data={jsonDataWarning as AdviceWarningsData} // Type assertion for imported JSON
                        currentWeatherData={currentWeatherData}
                        vehicle={vehicle}
                        warnings={alerts}
                    />
                </section>
                <section className="vehicleWidget">
                    <span className="vehicleText">Vehicle</span>
                    <VehicleSelection setVehicle={setVehicle} />
                </section>
            </section>

        </main>
    );
};
