import React from "react";


// Displays weather warnings (issued by local national weather agencies) to the user's perferred starting location.
export class WeatherWarnings extends React.Component {

    constructor(props) {
        super(props)

        this.state = {}
    }

        // Determining the advice text based on weather conditions.
    setText(){

        if (this.props.currentWeatherData === null) {
            return 
        }

        let adviceWarnings = this.props.data
        let weather = this.props.currentWeatherData.weather[0].main
        let vehicle = this.props.vehicle
        adviceWarnings = adviceWarnings[vehicle][0]

        if (weather === "Thunderstorm"){
            return adviceWarnings.stormText
        }  
        else if (weather === "Drizzle" || weather === "Rain"){
            return adviceWarnings.rainText
        }
        else if (weather === "Snow"){
            return adviceWarnings.SnowText
        }
        else if (weather === "Atmosphere Group"){
            return adviceWarnings.windText
        }
        else{
            return adviceWarnings.generalText
        }
    }


    render() {
        // Checks for null props data. Stops an undefined error from occurring if there's nothing to display.
        if (this.props.warnings === null) {
            return 
        }

        let warnings = this.props.warnings.map((item) => {return <div>{item.headline}</div>})
        let text = this.setText()

        if (text === undefined) {
            return
        }

        return (
            <div>
                <div className="warningsTitle">
                    Warnings
                </div>

                <div className="warningComponent">

                {
                warnings.map((item) => {return (
                    
                    <div className="warning"> 
                        <div className="warningsSymbol">
                            <img alt="WarningSymbol" src={ require('./css/assets/warningSymbol.png') } />
                        </div>
                        <div className="warningsText">
                            {item}
                        </div>
                    </div>
                )})}
            </div>
            <div>
            <div className="adviceText">
                {text.map((item) => {return (
                    
                    <div className="warning"> 
                        <div className="warningsSymbol">
                            <img alt="WarningSymbol" src={ require('./css/assets/warningSymbol.png') } />
                        </div>
                        <div className="warningsText">
                            {item}
                        </div>
                    </div>
                )})}
            </div>
            </div>

            </div>
        )
    }

}