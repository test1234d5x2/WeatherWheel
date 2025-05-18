import React from "react";


// Displays the forecast to the suer.
export class ForecastData extends React.Component {

    constructor(props) {
        super(props)

        // State is initialized but not used in this component
        this.state = {}
    }

    render() {
        // Early exit if data is not provided
        if (this.props.data === null || this.props.data.list === undefined) {
            return null;
        }
    
        const forecastData = this.props.data.list;
        const forecast = [];
        let startDate = new Date();
        let endDate = new Date();
    
        // Check if startTime and endTime are not null; otherwise, use default values
        const startTime = this.props.startTime || "00:00";
        const endTime = this.props.endTime || "23:59";
    
        startDate.setHours(parseInt(startTime.split(":")[0]), parseInt(startTime.split(":")[1]), 0, 0);
        endDate.setHours(parseInt(endTime.split(":")[0]), parseInt(endTime.split(":")[1]), 0, 0);
    
        // Correct endDate to the next day if it's before startDate
        if (endDate <= startDate) {
            endDate.setDate(endDate.getDate() + 1);
        }
    
        // Filter forecastData for the time range between startDate and endDate
        forecastData.forEach((dataPoint) => {
            const dataPointDate = new Date(dataPoint.dt_txt);
            if (dataPointDate >= startDate && dataPointDate <= endDate) {
                forecast.push([
                    dataPointDate.toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit", hourCycle: "h23"}),
                    dataPoint.weather[0].main,
                    Math.floor(dataPoint.main.temp - 273.15) // Converts temperature from Kelvin to Celsius
                ]);
            }
        });

        // Function to determine the path of the weather icon based on the forecast.
        const setPath = (description) => {
        
            if (description === "Thunderstorm"){
                return require('./css/assets/stormSymbol.png');
            }
            else if (description === "Drizzle"){
                return require('./css/assets/drizzleSymbol.png');
            }
            else if (description === "Rain"){
                return require('./css/assets/rainSymbol.png');
            }
            else if (description === "Snow"){
                return require('./css/assets/snowSymbol.png');
            }
            else if (description === "Clear"){
                return require('./css/assets/sunSymbol.png');
            }
            else if (description === "Atmosphere Group"){
                return require('./css/assets/windSymbol.png');
            }
            else{
                return require('./css/assets/cloudSymbol.png');
            }
        }
        

        return (
            <div className="forecast-data-section-container">
                <div className="forecast-data-section">
                    {forecast.map((item) => (
                        <div className="forecast-singular-data-section"> 
                            <span className="timesText">{item[0]}</span>
                            <span className="weatherSymbol"><img alt="weatherSymbol" className="weatherSymbol" src={setPath(item[1])} /></span>
                            <span className="temperatureText">{item[1]}</span>
                            <span className="temperatureText">{item[2]}°</span>
                        </div>
                    ))}
                </div>
            </div>
            
        )
    }

}