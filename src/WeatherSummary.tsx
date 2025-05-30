import React, { useEffect, useState } from "react";
import getCurrentDate from "./utils/getCurrentDate";
import { selectCoordinates } from "./store/locationStore";
import changeBackground from "./utils/changeBackground";
import { useSelector } from "react-redux";
import { EditableComponent } from "./EditableSection";
import isRaining from "./utils/isRaining";


const WeatherSummary: React.FC = () => {

    const [temperature, setTemp] = useState<string>('')
    const [weather, setWeather] = useState<string>('')
    const [editable, setEditable] = useState<boolean>(false);
    const [selectable, setSelectable] = useState<boolean>(false);

    const lat = useSelector(selectCoordinates).lat
    const lng = useSelector(selectCoordinates).lng

    // Fetch current weather data.
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`)
        .then(response => response.json())
        .then((data) => {
            if (Object.keys(data).includes("cod") && data['cod'] === 200) {
                setTemp(`${Math.round(data.main.temp - 273.15)}`)
                setWeather(data.weather[0].main)


            } else {
                console.error("OpenWeatherMap Current Weather API Error:");
            }
        })
        .catch(error => {
            console.error("Current Weather Fetch Error:", error);
        });

    // Change background only when the weather description changes.
    useEffect(() => {
        changeBackground(weather)
        isRaining(weather)
    }, [weather])

    return (
        <div className="weatherSummaryContainer">
            <div className="locationText">
                <EditableComponent editable={editable} selectable={selectable} setEditable={setEditable} setSelectable={setSelectable} />
            </div>
            {
                !editable ?
                <div className="dateText">
                    {getCurrentDate()}
                </div>: ""
            }
            {
                !editable ?
                <div className="tempText">
                    {temperature ? temperature + "°": ""}
                </div>: ''
            }
            {
                !editable ?
                <div className="descriptionText">
                    {weather}
                </div>: ''
            }
        </div>
    )
}

export default WeatherSummary