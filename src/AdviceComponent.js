import React from "react";



// Displays advice to the user.
export class AdviceComponent extends React.Component {

    constructor(props) {
        super(props)

        this.state = {}
    }


    // Determining the advice text based on weather conditions.
    setText(){

        if (this.props.currentWeatherData === null) {
            return
        }

        let data= this.props.data
        let weather = this.props.currentWeatherData.weather[0].main
        let vehicle = this.props.vehicle
        data = data[vehicle][0]

        if (weather === "Thunderstorm"){
            return data.stormText
        }  
        else if (weather === "Drizzle" || weather === "Rain"){
            return data.rainText
        }
        else if (weather === "Snow"){
            return data.SnowText
        }
        else if (weather === "Atmosphere Group"){
            return data.windText
        }
        else{
            return data.generalText
        }
    }

    render() {

        // If currentWeatherData prop is null, the component doesn't render anything
        if (this.props.currentWeatherData === null) {
            return
        }

        let text = this.setText()

        if (text === undefined) {
            return
        }

        return (
            <div className="adviceText">
                    <ol>{text.map(txt => <p>{txt}</p>)}</ol>
            </div>
        )
    }

}
