import React from "react";
import { ForecastData } from "./ForecastData";

export class WeatherDetailsFocus extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let currentWeatherData = this.props.currentWeatherData;

        return (
            <div className="weather-details-focus-area"> 
                <div className="weatherWidget">               
                    <ForecastData data={this.props.forecastData} />
                </div>
                <div className="weatherContainer">
                    <div className="row">
                        <div className="column">
                            <p className="title"> Wind Speed: </p>
                            <p className="value">{currentWeatherData.wind.speed}m/s </p>
                        </div>
                        
                        <div className="column">
                            <p className="title"> Wind Direction:</p>
                            <p className="value">{currentWeatherData.wind.deg} ° </p>
                        </div>
                        <div className="column">
                            <p className="title"> Humidity: </p>
                            <p className="value">{currentWeatherData.main.humidity}% </p>
                        </div>

                        <div className="column"> 
                            <p className="title"> Pressure: </p>
                            <p className="value">{currentWeatherData.main.pressure}hPa </p>
                        </div>
                    </div>
                        <div className="row">
                            <div className="column">
                                <p className="title"> Feels Like: </p>
                                <p className="value">{Math.floor(currentWeatherData.main['feels_like'] - 273.15)}° </p>
                            </div>

                            <div className="column">
                                <p className="title"> Rainfall: </p>
                                <p className="value">{Object.keys(currentWeatherData).indexOf("rain") === -1 ? "No Rain" : String(currentWeatherData.rain['3h']) + "mm"} in the last 3 hours.</p>
                            </div>

                            <div className="column">
                                <p className="title"> Visibility: </p>
                                <p className="value">{currentWeatherData.visibility} metres </p>
                            </div>

                            <div className="column">
                                <p> <div className="title">Sunrise: </div><div className="title">{new Date(currentWeatherData.sys.sunrise * 1000).toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"})}</div> </p>
                                <p> <div className="title">Sunset: </div><div className="title">{new Date(currentWeatherData.sys.sunset * 1000).toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"})} </div></p>                               
                            </div>
                        </div>
                    </div>
            </div>
        );
    }
}