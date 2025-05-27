import React from "react";
import { Map } from "./Map";
import { WeatherSummary } from "./WeatherSummary";
import { WeatherWarnings } from "./WeatherWarnings";
import { ForecastData } from "./ForecastData";
import { VehicleSelection } from "./VehicleSelection";
import { WeatherDetailsFocus } from "./WeatherDetailsFocus";
import { RecommendationsDetails } from "./RecommendationsDetails";
import jsonData from "./weatherAdvice.json";
import jsonDataWarning from "./weatherWarnings.json";
import { EditableComponent } from "./EditableSection";


// Renders the components of each main page.
export class Main extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            "alerts": null,
            "startLat": null,
			"startLong": null,
            "startName": null,
			"endLat": null,
			"endLong": null,
            "endName": "Destination",
            "forecastData": null,
            "currentWeatherData": null,
            "mapLineCoordinates": [],
            "startTime": null,
            "endTime": null,
            "vehicle" : "car",
        }

        this.updateDestinationInfo = this.updateDestinationInfo.bind(this)
		this.updateStartInfo = this.updateStartInfo.bind(this)
    }

    // Lifecycle component that comes built in when inherited from React.Component. This method runs as soon as this component is rendered to the DOM.
    // Purpose is to provide the user with a default location.
    componentDidMount() {
        this.updateStartInfo(51.513263, -0.089878, "City of London")
    }

    /**
     * 
     * @description Updates the start location information. Retrieves the weather data for the start location. If the user has a start and destination entered, then it also updates the map routing sequence.
     * @param {Number} lat - Latitude of the start location.
     * @param {Number} long - Longitude of the start location.
     * @param {String} name - Name of the start location.
     * @returns null/undefined
     * 
     */
    updateStartInfo(lat, long, name) {
		this.setState((state) => {
			return {
				"startLat": lat,
				"startLong": long,
				"startName": name,
			}
		})

        // Fetch weather forecast data on an hourly basis.
        fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + String(lat) + "&lon=" + String(long) + "&appid=" + process.env.REACT_APP_OPENWEATHER_API_KEY).then((response) => (response.json())).then((data) => {
            this.setState((state) => {
                return {
                    "forecastData": data,
                }
            })
        }).catch((error) => {
            console.log("Hourly Forecast Error")
        })

        // Fetch current weather data
        fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + String(lat) + "&lon=" + String(long) + "&appid=" + process.env.REACT_APP_OPENWEATHER_API_KEY).then((response) => (response.json())).then((data) => {
            this.setState((state) => {
                return {
                    "currentWeatherData": data,
                }
            })
        }).catch((error) => {
            console.log("Current Weather Error")
        })

        // Fetch weather alerts issued by national weather agencies.
        fetch("https://api.weatherapi.com/v1/forecast.json?key=" + process.env.REACT_APP_WEATHERAPI_API_KEY + "&q=London&days=1&aqi=no&alerts=yes").then((response) => {return response.json()}).then((data) => {
            console.log(data)
            this.setState((state) => {
                return {
                    "alerts": data.alerts.alert,
                }
            })
        }).catch((error) => {
            console.log("Weather Alerts Error")
        })


        // Fetches route information if both start and end locations are available
        if (this.state.endLat !== null && this.state.endLong !== null && this.state.endName !== null) {
            fetch("https://api.openrouteservice.org/v2/directions/driving-car?api_key=" + process.env.REACT_APP_OPEN_ROUTE_SECRVICES_API_KEY + "&start=" + String(long) + "," + String(lat) + "&end=" + String(this.state.endLong) + "," + String(this.state.endLat)).then((response) => {return response.json()}).then((data) => {
                let coordinates = []

                // An error code usually means that the API cannot find a route because the approximate distance is larger than 6000km. In this case, just add the start and end coordinates to give one straight line between the start and end place.
                if (data.error !== undefined) {
                    coordinates = [[lat, long], [this.state.endLat, this.state.endLong]]
                }

                // Gets the coordinates for the specific route (so that it can be placed as a line on the map).
                else {
                    coordinates = data.features[0].geometry.coordinates.map((item) => {return [item[1], item[0]]})
                }

                this.setState((state) => {
                    return {
                        "mapLineCoordinates": coordinates
                    }
                })
            })
        }

        return
	}

    /**
     * 
     * Updates the destination location information.
     * @param {Number} lat - Latitude of the destination location.
     * @param {Number} long - Longitude of the destination location.
     * @param {String} name - Name of the destination location.
     * @returns null/undefined.
     */
	updateDestinationInfo(lat, long, name) {
		this.setState((state) => {
			return {
				"endLat": lat,
				"endLong": long,
				"endName": name,
			}
		})

        // Fetches route information if both start and end locations are available
        if (this.state.startLat !== null && this.state.startLong !== null && this.state.startName !== null) {
            fetch("https://api.openrouteservice.org/v2/directions/driving-car?api_key=" + process.env.REACT_APP_OPEN_ROUTE_SECRVICES_API_KEY + "&start=" + String(this.state.startLong) + "," + String(this.state.startLat) + "&end=" + String(long) + "," + String(lat)).then((response) => {return response.json()}).then((data) => {
                let coordinates = []

                // An error code usually means that the API cannot find a route because the approximate distance is larger than 6000km. In this case, just add the start and end coordinates to give one straight line between the start and end place.
                if (data.error !== undefined) {
                    coordinates = [[this.state.startLat, this.state.startLong], [lat, long]]
                }

                // Gets the coordinates for the specific route (so that it can be placed as a line on the map).
                else {
                    coordinates = data.features[0].geometry.coordinates.map((item) => {return [item[1], item[0]]})
                }

                this.setState((state) => {
                    return {
                        "mapLineCoordinates": coordinates
                    }
                })
            })
        }
	}

        // Callback function to handle data received from the
    //child component
    setVehicle = (vehicle) => {
        // Update the name in the component's state
        this.setState((state) => {
            return {
                "vehicle": vehicle
            }
        })
    };

    // Callback function to handle data received from the
    //child component
    setTimes = (startTime, endTime) => {
        // Update the name in the component's state
        this.setState((state) => {
            return {
                "startTime": startTime,
                "endTime": endTime
            }
        })
    };

    render() {
        let elementsShown = null


        if (this.props.showing === "map") {
            elementsShown = (
                <main>
                    <div className="mainMap" style={{width: "90vw", height: "50vh", padding: "4vw"}}>
                        <Map startLat={this.state.startLat} startLong={this.state.startLong} endLat={this.state.endLat} endLong={this.state.endLong} mapLineCoordinates={this.state.mapLineCoordinates} />
                        <div className="mapText">
                            <div className = "locationInput">
                                <EditableComponent updateLocationInfo={this.updateStartInfo} name={this.state.startName} />
                                <img className="arrow" alt="arrow" src={ require('./css/assets/arrowRight.png') } />
                                <EditableComponent updateLocationInfo={this.updateDestinationInfo} name={this.state.endName}/>
                            </div>
                        </div>
                    </div>
                </main>

            )
        }

        else if (this.props.showing === "advice") {
            elementsShown = (
                <main>
                    <RecommendationsDetails data={jsonData} currentWeatherData = {this.state.currentWeatherData} vehicle={this.state.vehicle} warningsData = {jsonDataWarning} warnings={this.state.alerts === null ? null: this.state.alerts}/>
                </main>
            )
        }

        else if (this.props.showing === "details") {
            elementsShown = (
                <main>
                    <WeatherDetailsFocus currentWeatherData={this.state.currentWeatherData} forecastData={this.state.forecastData} />
                </main>
            )
        }

        else {
            elementsShown = (
                <main>
                    <section className="mapWidget">
                        <div className="mapImage2">
                            <Map startLat={this.state.startLat} startLong={this.state.startLong} endLat={this.state.endLat} endLong={this.state.endLong} mapLineCoordinates={this.state.mapLineCoordinates} />
                        </div>
                        <div className="mapText">
                            <div className = "locationInput">
                                <EditableComponent updateLocationInfo={this.updateStartInfo} name={this.state.startName} />
                                <img className="arrow" alt="arrow" src={ require('./css/assets/arrowRight.png') } />
                                <EditableComponent updateLocationInfo={this.updateDestinationInfo} name={this.state.endName}/>
                            </div>
                        </div>
                    </section>
                    <section className="Weather">
                        <WeatherSummary data={this.state.currentWeatherData} placeName={this.state.startName} />
                    </section>
                    <section className="warningsWidget">
                        <WeatherWarnings data = {jsonDataWarning} currentWeatherData = {this.state.currentWeatherData} vehicle={this.state.vehicle} warnings={this.state.alerts === null ? null: this.state.alerts} />
                    </section>
                    <section className="vehicleWidget">
                        <span className="vehicleText">Vehicle</span>
                        <VehicleSelection setVehicle={this.setVehicle}/>
                    </section>
                    <section className="weatherWidget">
                        <ForecastData data={this.state.forecastData} startTime={this.state.startTime} endTime={this.state.endTime} />
                    </section>
                </main>
            )
        }

        return elementsShown
    }

}