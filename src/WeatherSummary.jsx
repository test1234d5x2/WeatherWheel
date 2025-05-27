import React from "react";
import getCurrentDate from "./utils/getCurrentDate";

// Displays the main details of today's weather at the user's preferred starting location.
export class WeatherSummary extends React.Component {

    constructor(props) {
        super(props)

        this.state = {}
    }

    
    setKeyValues(description){

                
        if (description === "Thunderstorm"){
            document.body.style.backgroundImage = "linear-gradient(to bottom right, #18191A, #4f4f4f)";
        }
        else if (description === "Drizzle"){
            document.body.style.backgroundImage = "linear-gradient(to bottom right, #61cdf4, #050854)";
        }
        else if (description === "Rain"){
            document.body.style.backgroundImage = "linear-gradient(to bottom right, #2c68f2, #050854)";
        }
        else if (description === "Snow"){
            document.body.style.backgroundImage = "linear-gradient(to bottom right, #61cdf4, #ac94f4)";
        }
        else if (description === "Clear"){
            document.body.style.backgroundImage = "linear-gradient(to bottom right, #61cdf4, #2c68f2)";
        }
        else if (description === "Atmosphere Group"){
            document.body.style.backgroundImage = "linear-gradient(to bottom right, #bda18c, #18191A)";
        }
        else{
            document.body.style.backgroundImage = "linear-gradient(to bottom right, #E4E6EB, #18191A)";
        }
    
    }

    render() {

      

        // Checks for undefined weather summary data. Stops an undefined error from occurring if there's nothing to display.
        if (this.props.data === null) {
            return
        }


        let name = this.props.placeName
        let weather = this.props.data.weather[0].main
        let temperature = Math.floor(this.props.data.main.temp - 273.15) // Converts the temperature from Kelvin to Celsius.

        //Sets the webpage background depending on the weather
        this.setKeyValues(weather)
        
        return (
            <div>
                <div className="locationText">
                    {name}
                </div>
                <div className="dateText">
                    {getCurrentDate()}
                </div>  
                <div className="tempText">
                    {temperature}°
                </div>
                <div className="descriptionText">
                    {weather}
                </div>
            </div>
        );
    }
}

