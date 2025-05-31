import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, LayersControl, useMap, useMapEvents } from 'react-leaflet';
import { Icon, LatLngExpression, LatLngBoundsExpression } from "leaflet";
import standardIcon from './css/assets/marker-icon-standard.png';
import startIcon from './css/assets/marker-icon-start.png'
import destinationIcon from './css/assets/marker-icon-destination.png'
import { selectCoordinates, selectPlaceName } from "./store/locationStore";
import { useSelector } from "react-redux";
import createCityLabel from "./utils/createLabel";
import cities from './data/capital_cities.json'

// TODO: Remove city labels when zooming out based on the significance of the population value. Code is half implemented.


interface CityDetails {
    name: string
    population: number
    lat: number
    lng: number
}


interface CityWeatherDetails extends CityDetails {
    temperature: number
    clouds: number
    rain: number
    snow: number
    wind: number
    pressure: number
}

interface LegendItemKey {
    hexCode: string
    value: string
}

const LegendItem: React.FC<LegendItemKey> = ({ hexCode, value }: LegendItemKey) => {
    return (
        <div className="legendItem">
            <div className="colourBox" style={{ backgroundColor: `#${hexCode}` }}></div>
            <span>{value}</span>
        </div>
    )
}

// Define the structure for the weather layer codes.
const WEATHER_LAYER_CODES: { [key: string]: string } = {
    "Temperature": "TA2",
    "Rain": "PA0",
    "Clouds": "CL",
    "Wind": "WS10",
    "Snow": "SD0",
    "Pressure": "APM"
};


const WEATHER_LAYER_LEGENDS: { [key: string]: LegendItemKey[] } = {
    "Temperature": [
        { hexCode: "821692", value: "-40°C" },
        { hexCode: "8257DB", value: "-30°C" },
        { hexCode: "208CEC", value: "-20°C" },
        { hexCode: "20C4E8", value: "-10°C" },
        { hexCode: "23DDDD", value: "0°C" },
        { hexCode: "C2FF28", value: "10°C" },
        { hexCode: "FFF028", value: "20°C" },
        { hexCode: "FFC228", value: "25°C" },
        { hexCode: "FC8014", value: "30°C" }
    ],
    "Rain": [
        { hexCode: "7878BE19", value: "0.5mm" },
        { hexCode: "6E6ECD33", value: "1mm" },
        { hexCode: "5050E1B2", value: "10mm" },
        { hexCode: "1414FFE5", value: "140mm" }
    ],
    "Clouds": [
        { hexCode: "F7F7FF66", value: "50%" },
        { hexCode: "F6F5FF8C", value: "60%" },
        { hexCode: "F4F4FFBF", value: "70%" },
        { hexCode: "E9E9DFCC", value: "80%" },
        { hexCode: "DEDEDED8", value: "90%" },
        { hexCode: "D2D2D2FF", value: "100%" },
        { hexCode: "D2D2D2FF", value: "200%" }
    ],
    "Wind": [
        { hexCode: "EECECC66", value: "5m/s" },
        { hexCode: "B364BCB3", value: "15m/s" },
        { hexCode: "3F213BCC", value: "25m/s" },
        { hexCode: "744CACE6", value: "50m/s" },
        { hexCode: "4600AFFF", value: "100m/s" },
        { hexCode: "0D1126FF", value: "200m/s" }
    ],
    "Snow": [
        { hexCode: "EDEDED", value: "0.05m" },
        { hexCode: "D9F0F4", value: "0.1m" },
        { hexCode: "A5E5EF", value: "0.2m" },
        { hexCode: "7DDEED", value: "0.3m" },
        { hexCode: "35D2EA", value: "0.4m" },
        { hexCode: "00CCE8", value: "0.5m" },
        { hexCode: "706DCE", value: "0.6m" },
        { hexCode: "514FCC", value: "0.7m" },
        { hexCode: "3333CC", value: "0.8m" },
        { hexCode: "1818CC", value: "0.9m" },
        { hexCode: "C454B7", value: "1.2m" },
        { hexCode: "C12CB0", value: "1.5m" },
        { hexCode: "BF00A8", value: "1.8m" },
        { hexCode: "85408C", value: "2.5m" },
        { hexCode: "7F2389", value: "3.0m" },
        { hexCode: "790087", value: "4.0m" },
        { hexCode: "E80068", value: "15m" }
    ],
    "Pressure": [
        { hexCode: "0073FF", value: "94000hPa" },
        { hexCode: "00AAFF", value: "96000hPa" },
        { hexCode: "4BD0D6", value: "98000hPa" },
        { hexCode: "8DE7C7", value: "100000hPa" },
        { hexCode: "B0F720", value: "101000hPa" },
        { hexCode: "F0B800", value: "102000hPa" },
        { hexCode: "FB5515", value: "104000hPa" },
        { hexCode: "F3363B", value: "106000hPa" },
        { hexCode: "C60000", value: "108000hPa" }
    ]
}


const MapInitializer: React.FC<{ onMapReady: (map: L.Map) => void }> = ({ onMapReady }) => {
    const map = useMap()
    useEffect(() => {
        onMapReady(map);
    }, [map, onMapReady]);
    return null;
};


export const Map: React.FC = () => {
    const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
    const [chosenWeatherLayer, setChosenWeatherLayer] = useState<string | null>(null)
    const [allCities, setAllCities] = useState<CityDetails[]>([])
    const [currentZoom, setCurrentZoom] = useState<number>(5)


    const handleMapInstanceReady = useCallback((map: L.Map) => {
        setMapInstance(map);
    }, []);

    const handleWeatherLayerAdd = useCallback((event: { name: string }) => {
        setChosenWeatherLayer(event.name);
    }, []);

    const chosenPlace = useSelector(selectPlaceName)
    const lat = useSelector(selectCoordinates).lat
    const lng = useSelector(selectCoordinates).lng
    let defaultCentreLatLang: LatLngExpression = [lat, lng];

    // if (startLat !== null && startLong !== null && endLat !== null && endLong !== null) {
    //     defaultCentreLatLang = [(startLat + endLat) / 2, (startLong + endLong) / 2];
    // } else if (startLat !== null && startLong !== null) {
    //     defaultCentreLatLang = [startLat, startLong];
    // } else if (endLat !== null && endLong !== null) {
    //     defaultCentreLatLang = [endLat, endLong];
    // }


    const defaultMarkerIcon = new Icon({
        iconUrl: standardIcon,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const startMarkerIcon = new Icon({
        iconUrl: startIcon,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const destinationMarkerIcon = new Icon({
        iconUrl: destinationIcon,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });


    useEffect(() => {
        const fetchCountries = async () => {
            const cityDetailsList: CityDetails[] = cities.map((city) => {
                return {
                    name: city.name,
                    population: city.population,
                    lat: city.lat,
                    lng: city.lon
                }
            })

            setAllCities(cityDetailsList)
        }

        fetchCountries()
    }, [])


    const chosenWeatherPlaceMarker = (
        <Marker position={defaultCentreLatLang} icon={defaultMarkerIcon}>
            <Popup>
                {chosenPlace}
            </Popup>
        </Marker>
    )



    // Marker for the starting point
    // const startingPointMarker = startLat !== null && startLong !== null ? (
    //     <Marker position={[startLat, startLong]} icon={defaultMarkerIcon}>
    //         <Popup>
    //             Beginning
    //         </Popup>
    //     </Marker>
    // ) : null;

    // // Marker for the destination point
    // const destinationMarker = endLat !== null && endLong !== null ? (
    //     <Marker position={[endLat, endLong]} icon={defaultMarkerIcon}>
    //         <Popup>
    //             Destination
    //         </Popup>
    //     </Marker>
    // ) : null;

    // Determine the bounds for ChangeCentre component
    // let boundsToFit: LatLngBoundsExpression | LatLngExpression[];
    // if (startLat !== null && startLong !== null && endLat !== null && endLong !== null) {
    //     boundsToFit = [[startLat, startLong], [endLat, endLong]];
    // } else {
    //     // If only one point or no points, just center on the default or available point
    //     boundsToFit = [defaultCentreLatLang];
    // }

    
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <MapContainer center={defaultCentreLatLang} zoom={currentZoom} style={{ height: '100%', width: "100%" }}>
                <MapInitializer onMapReady={handleMapInstanceReady} />

                <MapEventsHandler setZoom={setCurrentZoom} />

                <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <LayersControl position="topright" sortLayers>
                    {Object.keys(WEATHER_LAYER_CODES).map((weatherLayerKey) => (
                        <LayersControl.BaseLayer name={weatherLayerKey} key={weatherLayerKey}>
                            <TileLayer
                                url={`https://maps.openweathermap.org/maps/2.0/weather/${WEATHER_LAYER_CODES[weatherLayerKey]}/{z}/{x}/{y}?appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`}
                                attribution="<a href='https://openweathermap.org/'>OpenWeather</a>, <a href='https://simplemaps.com/data/world-cities'>Simple Maps World Cities</a>"
                                eventHandlers={{
                                    add: () => handleWeatherLayerAdd({ name: weatherLayerKey })
                                }}
                            />
                        </LayersControl.BaseLayer>
                    ))}
                </LayersControl>

                {/* {mapLineCoordinates.length > 0 && (
                    <Polyline positions={mapLineCoordinates as LatLngExpression[]} pathOptions={{ color: "black", opacity: 1 }} />
                )} */}

                {chosenWeatherPlaceMarker}

                {/* {startingPointMarker} */}
                {/* {destinationMarker} */}

                {
                    chosenWeatherLayer && currentZoom > 4 ? allCities.map((cityDetails: CityDetails) => {
                        return (
                            <Marker key={cityDetails.name} position={[cityDetails.lat, cityDetails.lng]} icon={createCityLabel(cityDetails.name)}>
                                <Popup>
                                    {cityDetails.name}
                                </Popup>
                            </Marker>
                        )
                    }) : ""
                }

                {
                    chosenWeatherLayer ? 
                    <div className="mapLegendContainer">
                        {WEATHER_LAYER_LEGENDS[chosenWeatherLayer].map((item: LegendItemKey) => <LegendItem hexCode={item.hexCode} value={item.value} />)}
                    </div>: ''
                }
            </MapContainer>

        </div>
    );
};





// Routing For Later Implementation

// TODO: Move the whole function below to the map.
// useEffect(() => {
//     if (startLocation.lat !== null && startLocation.long !== null && endLocation.lat !== null && endLocation.long !== null) {
//         fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.REACT_APP_OPEN_ROUTE_SECRVICES_API_KEY}&start=${startLocation.long},${startLocation.lat}&end=${endLocation.long},${endLocation.lat}`)
//             .then(response => response.json())
//             .then((data) => {
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
// }, [startLocation.lat, startLocation.long, endLocation.lat, endLocation.long]);


// Component to get and manage map events like zoom
function MapEventsHandler({ setZoom }: { setZoom: (i: number) => void }) {
    useMapEvents({
        zoomend: (e) => {
            setZoom(e.target.getZoom());
        },
    });
    return null;
}