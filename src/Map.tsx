import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, LayersControl, useMap, useMapEvents } from 'react-leaflet';
import { Icon, LatLngExpression, LatLngBoundsExpression } from "leaflet";
import standardIcon from './css/assets/marker-icon-standard.png';
import startIcon from './css/assets/marker-icon-start.png'
import destinationIcon from './css/assets/marker-icon-destination.png'
import { selectCoordinates, selectPlaceName } from "./store/locationStore";
import { useSelector } from "react-redux";
import createCityLabel from "./utils/createLabel";
import cities from './data/capital_cities.json'
import CityWeatherDetails from "./types/cityWeatherDetails";
import WEATHER_LAYER_CODES from "./constants/weatherLayerCodes";
import getCorrectValue from "./utils/getCorrectValue";
import LegendItemKey, { WEATHER_LAYER_LEGENDS } from "./constants/weatherLayerLegendItems";
import changeBackground from "./utils/changeBackground";
import { selectWeather } from "./store/weatherStore";


const LegendItem: React.FC<LegendItemKey> = ({ hexCode, value }: LegendItemKey) => {
    return (
        <div className="legendItem">
            <div className="colourBox" style={{ backgroundColor: `#${hexCode}` }}></div>
            <span>{value}</span>
        </div>
    )
}


const WORLD_BOUNDS = [
    [-90, -210],
    [90, 210]
] as LatLngBoundsExpression


const MapInitializer: React.FC<{ onMapReady: (map: L.Map) => void }> = ({ onMapReady }) => {
    const map = useMap()
    useEffect(() => {
        onMapReady(map);
    }, [map]);
    return null;
};


export const Map: React.FC = () => {
    const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
    const [chosenWeatherLayer, setChosenWeatherLayer] = useState<string | null>(null)
    const [allCities, setAllCities] = useState<CityWeatherDetails[]>([])
    const [visibleCities, setVisibleCities] = useState<CityWeatherDetails[]>([])
    const [currentZoom, setCurrentZoom] = useState<number>(5)
    const [showDetailedInfo, setShowDetailedInfo] = useState<boolean>(false)
    const [leftPanelWidth, setLeftPanelWidth] = useState<number>(window.innerWidth * 0.25);
    const [isResizing, setIsResizing] = useState<boolean>(false);


    const leftPanel = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMouseMoveResize = (e: MouseEvent) => {
            if (isResizing) {
                const newWidth = e.clientX
                setLeftPanelWidth(Math.max(window.innerWidth * 0.25, Math.min(window.innerWidth * 0.75, newWidth)))
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMoveResize as unknown as EventListener);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMoveResize as unknown as EventListener);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    const handleMouseDownResizer = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsResizing(true);
    };

    const handleMapInstanceReady = (map: L.Map) => {
        setMapInstance(map);
    }

    const handleWeatherLayerAdd = (event: { name: string }) => {
        setChosenWeatherLayer(event.name);
    }

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
        const fetchData = async () => {
            const cityDetailsList: CityWeatherDetails[] = []

            for (let city of cities) {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`)
                const data = await response.json()
                const weatherDetails: CityWeatherDetails = {
                    id: city.id,
                    name: city.name,
                    population: city.population,
                    lat: city.lat,
                    lng: city.lon,
                    temperature: `${Math.round(data.main.temp - 273.15)}°C`,
                    clouds: `${data.clouds.all}%`,
                    rain: Object.keys(data).find((keys) => keys === "rain") ? `${data.rain['1h']}mm/h` : "0mm/h",
                    snow: Object.keys(data).find((keys) => keys === "snow") ? `${data.snow['1h']}mm/h` : "0mm/h",
                    wind: `${data.wind.speed}m/s`,
                    pressure: `${data.main.pressure}hPa`
                }

                if (city.population >= 3000000) {
                    cityDetailsList.push(weatherDetails)
                    setAllCities(cityDetailsList)
                }
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        if (currentZoom < 4) {
            setVisibleCities([])
        }
        else {
            setVisibleCities(allCities)
        }

    }, [currentZoom])


    const chosenWeatherPlaceMarker = (
        <Marker position={defaultCentreLatLang} icon={defaultMarkerIcon}>
            <Popup>
                {chosenPlace}
            </Popup>
        </Marker>
    )

    const backgroundStyle = changeBackground(useSelector(selectWeather))

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


    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <MapContainer center={defaultCentreLatLang} zoom={currentZoom} minZoom={3} style={{ height: '100%', width: "100%" }} worldCopyJump={false} maxBoundsViscosity={1.0} maxBounds={WORLD_BOUNDS}>
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
                    chosenWeatherLayer ? visibleCities.map((cityDetails: CityWeatherDetails) => {
                        return (
                            <Marker
                                key={cityDetails.id}
                                position={[cityDetails.lat, cityDetails.lng]}
                                icon={createCityLabel(cityDetails.name, getCorrectValue(chosenWeatherLayer.toLowerCase(), cityDetails))}
                                eventHandlers={{
                                    click: (event) => setShowDetailedInfo(true)
                                }}
                            >

                            </Marker>
                        )
                    }) : ""
                }

                {
                    chosenWeatherLayer ?
                        <div className="mapLegendContainer">
                            {WEATHER_LAYER_LEGENDS[chosenWeatherLayer].map((item: LegendItemKey) => <LegendItem hexCode={item.hexCode} value={item.value} />)}
                        </div> : ''
                }


            </MapContainer>

            {
                showDetailedInfo ?
                    <section className="side-panel" style={{ width: `${leftPanelWidth}px`, backgroundImage: backgroundStyle }} ref={leftPanel}>
                        <div className="detailed-city-info-section-container">
                            <div className="detailed-city-info-section">
                                <div className="material-symbols-outlined icon close-icon" onClick={() => setShowDetailedInfo(false)}>close</div>
                            </div>
                        </div>
                        <div className="draggable-section" onMouseDown={handleMouseDownResizer}></div>
                    </section> : ''
            }


        </div>
    );
};



// Routing For Later Implementation

// TODO: IMPLEMENT
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