import React, { useState, useEffect, useCallback } from "react";
import { WeatherWarnings } from "./WeatherWarnings";
import ForecastData from "./ForecastData";
import { VehicleSelection } from "./VehicleSelection";
import { EditableComponent } from "./EditableSection";
import jsonDataWarning from "./weatherWarnings.json";
import VehicleType from "./types/vehicleType";
import { store } from "./store";
import { useDispatch } from "react-redux";
import { selectCoordinates, selectPlaceName, setMapLocation } from "./store/locationStore";
import LocationState from "./types/locationState";
import WeatherSummary from "./WeatherSummary";



// From WeatherWarnings.tsx for weather alerts
interface WeatherAPIAlert {
    headline: string;
    // Add other properties if they are part of your actual warning data.
    // e.g., description: string; severity: string; ends_utc: string;
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


export const Main: React.FC = () => {
    const [alerts, setAlerts] = useState<WeatherAPIAlert[] | null>(null);

    const dispatch = useDispatch()


    const updateLocationInfo = useCallback((lat: number, lng: number, name: string): void => {
        const newLocation: LocationState = {
            name: name,
            coordinates: {lat, lng}
        }
        dispatch(setMapLocation(newLocation))
    }, []);



    // TODO: Move to Weather Warnings now that we have Redux global state.
    // useEffect(() => {
    //     const name = selectPlaceName(store.getState())

    //     if (name !== null) {
    //         fetch(`https://api.weatherapi.com/v1/forecast.json?key=${process.env.REACT_APP_WEATHERAPI_API_KEY}&q=${name}&days=1&aqi=no&alerts=yes`)
    //             .then(response => response.json())
    //             .then((data: WeatherAPIAlertsResponse) => {
    //                 setAlerts(data.alerts.alert);
    //             })
    //             .catch(error => {
    //                 console.error("Weather Alerts Fetch Error:", error);
    //                 setAlerts(null); // Clear alerts on error
    //             });
    //     }
    // }, []);


    // TODO: Move the whole function below to the map.
    // useEffect(() => {
    //     if (startLocation.lat !== null && startLocation.long !== null && endLocation.lat !== null && endLocation.long !== null) {
    //         fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.REACT_APP_OPEN_ROUTE_SECRVICES_API_KEY}&start=${startLocation.long},${startLocation.lat}&end=${endLocation.long},${endLocation.lat}`)
    //             .then(response => response.json())
    //             .then((data: OpenRouteServiceResponse) => {
    //                 let coordinates: number[][] = [];
    //                 if (data.error !== undefined) {
    //                     // An error code usually means that the API cannot find a route because
    //                     // the approximate distance is larger than 6000km. In this case,
    //                     // just add the start and end coordinates to give one straight line.
    //                     console.warn("OpenRouteService Error:", data.error.message);
    //                     if (startLocation.lat && endLocation.lat && startLocation.long && endLocation.long) {
    //                         coordinates.push([startLocation.lat, startLocation.long], [endLocation.lat, endLocation.long])
    //                     }
    //                 } else if (data.features && data.features.length > 0) {
    //                     // Gets the coordinates for the specific route (so that it can be placed as a line on the map).
    //                     coordinates = data.features[0].geometry.coordinates.map((item) => [item[1], item[0]]); // Convert [long, lat] to [lat, long]
    //                 }
    //                 setMapLineCoordinates(coordinates);
    //             })
    //             .catch(error => {
    //                 console.error("OpenRouteService Fetch Error:", error);
    //                 setMapLineCoordinates([]); // Clear coordinates on error
    //             });
    //     } else {
    //         // Clear map line coordinates if not both start and end locations are set
    //         setMapLineCoordinates([]);
    //     }
    // }, [startLocation.lat, startLocation.long, endLocation.lat, endLocation.long]); // Dependencies: all coordinates


    return (
        <main>
            <div className="mainPage">
                <section className="Weather">
                    <a href="map">Map</a>
                    <WeatherSummary />
                </section>
                <section className="weatherWidget">
                    <span className="arrow">&#8592;</span>
                    <ForecastData />
                    <span className="arrow">&#8594;</span>
                </section>
                <section style={{display: "flex", columnGap: "2rem"}}>
                    <section className="warningsWidget">
                        <WeatherWarnings />
                    </section>
                    <section className="vehicleWidget">
                        <span className="vehicleText">Vehicle</span>
                        <VehicleSelection />
                    </section>
                </section>
            </div>
            
        </main>
    );
};
