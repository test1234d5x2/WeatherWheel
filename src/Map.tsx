import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, LayersControl, useMap, useMapEvents } from 'react-leaflet';
import { Icon, LatLngExpression, LatLngBoundsExpression, latLng, LatLng } from "leaflet";
import standardIcon from './css/assets/marker-icon-standard.png';
import startIcon from './css/assets/marker-icon-start.png'
import destinationIcon from './css/assets/marker-icon-destination.png'
import { selectCoordinates, selectPlaceName, setMapLocation } from "./store/locationStore";
import { useDispatch, useSelector } from "react-redux";
import createCityLabel from "./utils/createLabel";
import cities from './data/capital_cities.json'
import CityWeatherDetails from "./types/cityWeatherDetails";
import WEATHER_LAYER_CODES from "./constants/weatherLayerCodes";
import getCorrectValue from "./utils/getCorrectValue";
import LegendItemKey, { WEATHER_LAYER_LEGENDS } from "./constants/weatherLayerLegendItems";
import changeBackground from "./utils/changeBackground";
import { selectWeather } from "./store/weatherStore";
import ForecastData from "./ForecastData";
import WeatherSummary from "./WeatherSummary";

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
    const dispatch = useDispatch()
    const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
    const [mapLineCoordinates, setMapLineCoordinates] = useState<LatLng[]>()
    const [chosenWeatherLayer, setChosenWeatherLayer] = useState<string | null>(null)
    const [allCities, setAllCities] = useState<CityWeatherDetails[]>([])
    const [visibleCities, setVisibleCities] = useState<CityWeatherDetails[]>([])
    const [currentZoom, setCurrentZoom] = useState<number>(5)
    const [showDetailedInfo, setShowDetailedInfo] = useState<boolean>(false)
    const [leftPanelWidth, setLeftPanelWidth] = useState<number>(window.innerWidth * 0.25);
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const [startCoordinates, setStartCoordinates] = useState<LatLng>()
    const [destinationCoordinates, setDestinationCoordinates] = useState<LatLng>()



    useEffect(() => {
        if (startCoordinates && destinationCoordinates ) {
            fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.REACT_APP_OPEN_ROUTE_SECRVICES_API_KEY}&start=${startCoordinates.lng},${startCoordinates.lat}&end=${destinationCoordinates.lng},${destinationCoordinates.lat}`)
                .then(response => response.json())
                .then((data) => {
                    let coordinates: LatLng[] = [];
                    console.log(data)
                    if (data.error !== undefined) {
                        // An error code usually means that the API cannot find a route because
                        // the approximate distance is larger than 6000km. In this case,
                        // just add the start and end coordinates to give one straight line.
                        console.warn("OpenRouteService Error:", data.error.message);
                        coordinates.push(startCoordinates, destinationCoordinates)
                    } else if (data.features && data.features.length > 0) {
                        coordinates = data.features[0].geometry.coordinates.map((item: number[]) => [item[1], item[0]]);
                    }
                    setMapLineCoordinates(coordinates);
                })
                .catch(error => {
                    console.error("OpenRouteService Fetch Error:", error);
                    setMapLineCoordinates([]);
                });
        } else {
            setMapLineCoordinates([]);
        }
    }, [startCoordinates, destinationCoordinates]);


    const leftPanel = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMouseMoveResize = (e: MouseEvent) => {
            if (isResizing) {
                const newWidth = e.clientX
                setLeftPanelWidth(Math.max(window.innerWidth * 0.25, Math.min(window.innerWidth * 0.5, newWidth)))
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMoveResize);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMoveResize);
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


    const chosenWeatherPlaceMarker = <Marker position={defaultCentreLatLang} icon={defaultMarkerIcon} />
    const startingPointMarker = startCoordinates ? <Marker position={startCoordinates} icon={startMarkerIcon} /> : ""
    const destinationMarker = destinationCoordinates ? <Marker position={destinationCoordinates} icon={destinationMarkerIcon} /> : ""

    const backgroundStyle = changeBackground(useSelector(selectWeather))

    const chosenCity = useSelector(selectCoordinates)

    return (
        <div className="map-container">
            {
                showDetailedInfo ?
                    <section className="side-panel" style={{ width: `${leftPanelWidth}px`, backgroundImage: backgroundStyle }} ref={leftPanel}>
                        <div className="detailed-city-info-section-container">
                            <div className="material-symbols-outlined icon close-icon" onClick={() => setShowDetailedInfo(false)}>close</div>
                            <div className="detailed-city-info-section">
                                <WeatherSummary />
                                <section className="weatherWidget">
                                    <ForecastData />
                                </section>
                                <div>
                                    <span className="clickable" onClick={() => setStartCoordinates(latLng(chosenCity.lat, chosenCity.lng))}>Set as Starting Place</span>
                                </div>
                                <div>
                                    <span className="clickable" onClick={() => setDestinationCoordinates(latLng(chosenCity.lat, chosenCity.lng))}>Set as Destination</span>
                                </div>
                            </div>
                        </div>
                        <div className="draggable-section" onMouseDown={handleMouseDownResizer}></div>
                    </section> : ''
            }

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

                {mapLineCoordinates && mapLineCoordinates.length > 0 && (
                    <Polyline positions={mapLineCoordinates as LatLngExpression[]} pathOptions={{ color: "black", opacity: 1 }} />
                )}

                {chosenWeatherPlaceMarker}

                {startingPointMarker}
                {destinationMarker}

                {
                    chosenWeatherLayer ? visibleCities.map((cityDetails: CityWeatherDetails) => {
                        return (
                            <Marker
                                key={cityDetails.id}
                                position={[cityDetails.lat, cityDetails.lng]}
                                icon={createCityLabel(cityDetails.name, getCorrectValue(chosenWeatherLayer.toLowerCase(), cityDetails))}
                                eventHandlers={{
                                    click: (event) => {
                                        dispatch(setMapLocation({ name: cityDetails.name, coordinates: { lat: cityDetails.lat, lng: cityDetails.lng } }))
                                        setShowDetailedInfo(true)

                                    }
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
        </div>
    );
};



function MapEventsHandler({ setZoom }: { setZoom: (i: number) => void }) {
    useMapEvents({
        zoomend: (e) => {
            setZoom(e.target.getZoom());
        },
    });
    return null;
}