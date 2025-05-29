import React, { useEffect, useState } from "react";
import { selectCoordinates } from "./store/locationStore";
import { useSelector } from "react-redux";

interface ForecastDataPoint {
    timeText: string
    weatherText: string
    temp: number
    icon: string
}


const ForecastData: React.FC = () => {
    const lat = useSelector(selectCoordinates).lat
    const lng = useSelector(selectCoordinates).lng

    const [dataPoints, setDataPoints] = useState<ForecastDataPoint[]>([])

    useEffect(() => {
        fetch(`https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lng}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`)
        .then(response => response.json())
        .then((data) => {
            if (data.cod === "200") {
                let processedDataPoints: ForecastDataPoint[] = []

                

                processedDataPoints = data.list.map((dataPoint: any) => {return {
                    timeText: `${new Date(dataPoint.dt_txt).getHours()}:00`,
                    weatherText: dataPoint.weather[0].main,
                    temp: Math.round(dataPoint.main.temp - 273.15),
                    icon: dataPoint.weather[0].icon
                }})

                setDataPoints(processedDataPoints.slice(0, 25))
            } else {
                console.error("OpenWeatherMap Forecast API Error:", data.message);
            }
        })
        .catch(error => {
            console.error("Hourly Forecast Fetch Error:", error);
        });
    }, [lat, lng])
    


    return (
        <div className="forecast-data-section">
            {
                dataPoints.map((dataPoint: ForecastDataPoint) => {return (
                    <ForecastSingleDataPoint timeText={dataPoint.timeText} weatherText={dataPoint.weatherText} temp={dataPoint.temp} icon={dataPoint.icon} />
                )})
            }
        </div>
    )
}




interface ForecastDataPointProps extends ForecastDataPoint {}

const ForecastSingleDataPoint: React.FC<ForecastDataPointProps> = ({timeText, weatherText, temp, icon}: ForecastDataPointProps) => {
    return (
        <div className="forecast-singular-data-section">
            <span className="timesText">{timeText}</span>
            <span className="weatherSymbol">
                <img alt="weatherSymbol" className="weatherSymbol" src={`https://openweathermap.org/img/wn/${icon}@2x.png`} />
            </span>
            <span className="temperatureText">{weatherText}</span>
            <span className="temperatureText">{temp}°</span>
        </div>
    )
}

export default ForecastData