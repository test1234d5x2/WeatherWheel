import React from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, LayersControl, useMap } from 'react-leaflet';
import { Icon } from "leaflet";
import icon from 'leaflet/dist/images/marker-icon.png';


const WEATHER_LAYER_CODES = {
    "Temperature": "TA2",
    "Rain": "PA0",
    "Clouds": "CL",
}


const ChangeCentre = (props) => {
	const map = useMap()
	map.fitBounds(props.latLangBounds)
}

export class Map extends React.Component {
    
    constructor(props) {
        super(props)

        this.state = {
			"map": null,
			"chosenWeatherLayer": null
		}

		this.setMap = this.setMap.bind(this)
		this.setChosenWeatherLayer = this.setChosenWeatherLayer.bind(this)
    }

	/**
	 * 
     * Method to set the map object in the component's state.
     * @param {Object} map - The map object to be set.
	 * @returns null/undefined
	 * 
     */
	setMap(map) {
		this.setState((state) => {
			return {
				"map": map
			}
		})
	}

	/**
	 * 
     * Method to set the chosen weather layer in the component's state.
     * @param {string} chosenWeatherLayer - The chosen weather layer. Can only be a value from the keys in WEATHER_LAYER_CODES.
	 * @returns null/undefined.
	 * 
     */
	setChosenWeatherLayer(chosenWeatherLayer) {
		this.setState((state) => {
			return {
				"chosenWeatherLayer": chosenWeatherLayer
			}
		})
	}

    render() {

		let defaultCentreLatLang = [55, -5]
		let coordinates = this.props.mapLineCoordinates
		let startLat = this.props.startLat 
		let startLong = this.props.startLong
		let endLat = this.props.endLat
		let endLong = this.props.endLong

		// Determines the centre coordinates for the map.
		if ([startLat, startLong, endLat, endLong].indexOf(null) === -1) {
			defaultCentreLatLang = [(startLat + endLat) / 2, (startLong + endLong) / 2]
		}

		else if ([startLat, startLong].indexOf(null) === -1) {
			defaultCentreLatLang = [startLat, startLong]
		}

		else if ([endLat, endLong].indexOf(null) === -1) {
			defaultCentreLatLang = [endLat, endLong]
		}


		let startingPointMarker = (
			<Marker position={[startLat, startLong]} icon={new Icon({iconUrl: icon, iconSize: [25, 41], iconAnchor: [12, 41]})}>
				<Popup>
					Beginning
				</Popup>
			</Marker>
		)

		let destinationMarker = (
			<Marker position={[endLat, endLong]} icon={new Icon({iconUrl: icon, iconSize: [25, 41], iconAnchor: [12, 41]})}>
				<Popup>
					Destination
				</Popup>
			</Marker>
		)


        return (
            <MapContainer center={defaultCentreLatLang} zoom={5} style={{ height: '100%', width: "100%" }} whenReady={this.setMap}>
                <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
				<LayersControl>
					{Object.keys(WEATHER_LAYER_CODES).map((weatherLayer) => {

						return (
							<LayersControl.BaseLayer name={weatherLayer}>
								<TileLayer url={"http://maps.openweathermap.org/maps/2.0/weather/" + WEATHER_LAYER_CODES[weatherLayer] + "/{z}/{x}/{y}?appid=" + process.env.REACT_APP_OPENWEATHER_API_KEY} attribution="<a href='https://openweathermap.org/'>OpenWeather</a>" eventHandlers={{add: (event) => {return this.setChosenWeatherLayer(weatherLayer)}}} />
							</LayersControl.BaseLayer>
						)
					})}
				</LayersControl>
                {coordinates.length === 0 ? "": <Polyline positions={coordinates} pathOptions={{color: "black", opacity: "1"}} />}
				{startLat !== null && startLong !== null ? startingPointMarker: ""}
				{endLat !== null && endLong !== null ? destinationMarker: ""}
				{
					startLat !== null && startLong !== null && endLat !== null && endLong !== null ? 
						<ChangeCentre latLangBounds={[[startLat, startLong], [endLat, endLong]]}/> :
						<ChangeCentre latLangBounds={[defaultCentreLatLang]} />
				}
            </MapContainer>
        )
    }
}