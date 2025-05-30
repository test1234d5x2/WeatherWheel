import React, { useEffect, useState } from "react";
import generateAdvice from "./utils/generateAdvice";
import generatePrompt from "./utils/generatePrompt";
import { selectInitial, selectTemperature, selectVisibility, selectWeather, selectWindSpeed } from "./store/weatherStore";
import { selectVehicle } from "./store/vehicleStore";
import { useSelector } from "react-redux";

const Advice: React.FC = () => {
    const temp = useSelector(selectTemperature)
    const weather = useSelector(selectWeather)
    const visibility = useSelector(selectVisibility)
    const windSpeed = useSelector(selectWindSpeed)
    const vehicle = useSelector(selectVehicle)
    const initial = useSelector(selectInitial)

    const [advice, setAdvice] = useState<string>('')

    useEffect(() => {
        if (!initial) {
            generateAdvice(generatePrompt(temp, weather, visibility, windSpeed, { vehicle })).then((advice: string) => {
                setAdvice(advice.trim())
            }).catch((err: Error) => {
                console.log(err)
            })
        }
    }, [temp, weather, visibility, windSpeed, vehicle])

    let shownElements = advice.split("\n").map((text: string) => {
        if (text !== "\\" && text.trim().length > 0) {
            return (
                <div className="adviceText">
                    {text}
                </div>
            )
        }
    })

    return (
        <React.Fragment>
            <div className="adviceSection">
                {shownElements}
            </div>
        </React.Fragment>
    )
}

export default Advice