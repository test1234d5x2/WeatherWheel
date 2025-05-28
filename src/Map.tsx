import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, LayersControl, useMap } from 'react-leaflet';
import { Icon, LatLngExpression, LatLngBoundsExpression } from "leaflet";
import icon from 'leaflet/dist/images/marker-icon.png';


// Define the structure for the weather layer codes.
const WEATHER_LAYER_CODES: { [key: string]: string } = {
    "Temperature": "TA2",
    "Rain": "PA0",
    "Clouds": "CL",
};

/**
 * @interface ChangeCentreProps
 * @description Props for the ChangeCentre component.
 * @property {LatLngBoundsExpression | LatLngExpression[]} latLangBounds - The latitude and longitude bounds to fit the map to.
 */
interface ChangeCentreProps {
    latLangBounds: LatLngBoundsExpression | LatLngExpression[];
}

/**
 * @function ChangeCentre
 * @param {ChangeCentreProps} props - The properties passed to the component.
 * @description A functional component that uses the `useMap` hook to programmatically
 * change the map's view to fit a given set of latitude and longitude bounds.
 */
const ChangeCentre: React.FC<ChangeCentreProps> = ({ latLangBounds }: ChangeCentreProps) => {
    const map = useMap(); // Access the Leaflet map instance

    // Use useEffect to fit bounds when the component mounts or latLangBounds change
    useEffect(() => {
        // Ensure latLangBounds is not null/undefined and is an array-like structure
        // before attempting to fit the map.
        if (latLangBounds && Array.isArray(latLangBounds) && latLangBounds.length > 0) {
            // Leaflet's fitBounds has overloads. We need to help TypeScript
            // distinguish between LatLngBoundsExpression (a tuple of two LatLngTuples)
            // and LatLngExpression[] (a general array of LatLngExpressions).
            // A simple heuristic: if it has exactly two elements and they are arrays of numbers,
            // it's likely a LatLngBoundsLiteral.
            if (
                latLangBounds.length === 2 &&
                Array.isArray(latLangBounds[0]) && typeof latLangBounds[0][0] === 'number' && typeof latLangBounds[0][1] === 'number' &&
                Array.isArray(latLangBounds[1]) && typeof latLangBounds[1][0] === 'number' && typeof latLangBounds[1][1] === 'number'
            ) {
                // This matches the structure of LatLngBoundsLiteral
                map.fitBounds(latLangBounds as LatLngBoundsExpression);
            }
        }
    }, [map, latLangBounds]);

    return null; // This component doesn't render anything visually
};

/**
 * @interface MapProps
 * @description Props for the Map component.
 * @property {number[][]} mapLineCoordinates - An array of [latitude, longitude] pairs for the polyline.
 * @property {number | null} startLat - Latitude of the starting point, or null.
 * @property {number | null} startLong - Longitude of the starting point, or null.
 * @property {number | null} endLat - Latitude of the destination point, or null.
 * @property {number | null} endLong - Longitude of the destination point, or null.
 */
interface MapProps {
    mapLineCoordinates: number[][];
    startLat: number | null;
    startLong: number | null;
    endLat: number | null;
    endLong: number | null;
}

/**
 * @function MapInitializer
 * @description A helper component to get the Leaflet map instance using useMap()
 * and pass it to a callback in the parent component.
 * @param {object} props - The component props.
 * @param {function(L.Map): void} props.onMapReady - Callback to receive the map instance.
 */
const MapInitializer: React.FC<{ onMapReady: (map: L.Map) => void }> = ({ onMapReady }) => {
    const map = useMap(); // Get the map instance from the context
    useEffect(() => {
        onMapReady(map); // Call the parent's callback with the map instance
    }, [map, onMapReady]); // Dependencies: map instance and the callback itself
    return null; // This component doesn't render anything visible
};


/**
 * @function Map
 * @param {MapProps} props - The properties passed to the component.
 * @description Displays an interactive Leaflet map with an optional polyline,
 * start/end markers, and selectable weather overlay layers.
 */
export const Map: React.FC<MapProps> = ({
    mapLineCoordinates,
    startLat,
    startLong,
    endLat,
    endLong
}: MapProps) => {
    // State to hold the Leaflet map instance
    const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
    // State to hold the currently chosen weather layer
    const [chosenWeatherLayer, setChosenWeatherLayer] = useState<string | null>(null);

    // Callback to set the map instance when the MapInitializer component reports it's ready.
    // This now conforms to the `(map: L.Map) => void` signature that MapInitializer expects.
    const handleMapInstanceReady = useCallback((map: L.Map) => {
        setMapInstance(map);
    }, []);

    // This callback is now a placeholder for MapContainer's whenReady prop,
    // which your environment reports as expecting no arguments.
    // The actual map instance setting is handled by MapInitializer.
    const handleMapContainerReady = useCallback(() => {
        // This function will be called by MapContainer's whenReady prop.
        // We don't do anything here as MapInitializer handles getting the map instance.
    }, []);


    // Callback to update the chosen weather layer when a base layer is added
    const handleWeatherLayerAdd = useCallback((event: { name: string }) => {
        setChosenWeatherLayer(event.name);
    }, []);

    // Calculate default center coordinates for the map
    let defaultCentreLatLang: LatLngExpression = [55, -5]; // Default center for UK/Ireland area

    if (startLat !== null && startLong !== null && endLat !== null && endLong !== null) {
        defaultCentreLatLang = [(startLat + endLat) / 2, (startLong + endLong) / 2];
    } else if (startLat !== null && startLong !== null) {
        defaultCentreLatLang = [startLat, startLong];
    } else if (endLat !== null && endLong !== null) {
        defaultCentreLatLang = [endLat, endLong];
    }

    // Define the custom marker icon
    const defaultMarkerIcon = new Icon({
        iconUrl: icon,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // Marker for the starting point
    const startingPointMarker = startLat !== null && startLong !== null ? (
        <Marker position={[startLat, startLong]} icon={defaultMarkerIcon}>
            <Popup>
                Beginning
            </Popup>
        </Marker>
    ) : null;

    // Marker for the destination point
    const destinationMarker = endLat !== null && endLong !== null ? (
        <Marker position={[endLat, endLong]} icon={defaultMarkerIcon}>
            <Popup>
                Destination
            </Popup>
        </Marker>
    ) : null;

    // Determine the bounds for ChangeCentre component
    let boundsToFit: LatLngBoundsExpression | LatLngExpression[];
    if (startLat !== null && startLong !== null && endLat !== null && endLong !== null) {
        boundsToFit = [[startLat, startLong], [endLat, endLong]];
    } else {
        // If only one point or no points, just center on the default or available point
        boundsToFit = [defaultCentreLatLang];
    }


    return (
        <div style={{width: "100vw", height: "100vh"}}>
            <MapContainer center={defaultCentreLatLang} zoom={5} style={{ height: '100%', width: "100%" }} whenReady={handleMapContainerReady}>
                {/* MapInitializer is a child component that uses useMap() to get the map instance */}
                <MapInitializer onMapReady={handleMapInstanceReady} />

                {/* OpenStreetMap Tile Layer */}
                <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* LayersControl for weather overlays */}
                <LayersControl position="topright">
                    {Object.keys(WEATHER_LAYER_CODES).map((weatherLayerKey) => (
                        <LayersControl.BaseLayer name={weatherLayerKey} key={weatherLayerKey}>
                            <TileLayer
                                url={`https://maps.openweathermap.org/maps/2.0/weather/${WEATHER_LAYER_CODES[weatherLayerKey]}/{z}/{x}/{y}?appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`}
                                attribution="<a href='https://openweathermap.org/'>OpenWeather</a>"
                                eventHandlers={{
                                    add: () => handleWeatherLayerAdd({ name: weatherLayerKey }) // Pass the layer key to the handler
                                }}
                            />
                        </LayersControl.BaseLayer>
                    ))}
                </LayersControl>

                {/* Render Polyline if coordinates exist */}
                {mapLineCoordinates.length > 0 && (
                    // Cast mapLineCoordinates to LatLngExpression[] to satisfy Polyline's positions prop
                    <Polyline positions={mapLineCoordinates as LatLngExpression[]} pathOptions={{ color: "black", opacity: 1 }} />
                )}

                {/* Render Starting Point Marker */}
                {startingPointMarker}

                {/* Render Destination Marker */}
                {destinationMarker}

                {/* Adjust map center/zoom based on available coordinates */}
                <ChangeCentre latLangBounds={boundsToFit} />
            </MapContainer>
        </div>
    );
};
