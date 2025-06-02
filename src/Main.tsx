import React, { useEffect, useState } from "react";
import ForecastData from "./ForecastData";
import { VehicleSelection } from "./VehicleSelection";
import WeatherSummary from "./WeatherSummary";
import Advice from "./Advice";
import { selectWeather } from "./store/weatherStore";
import { useSelector } from "react-redux";
import changeBackground from "./utils/changeBackground";




export const Main: React.FC = () => {
    const backgroundStyle = changeBackground(useSelector(selectWeather))

    return (
        <main style={{backgroundImage: backgroundStyle}}>
            <div className="mainPage">
                <section className="Weather">
                    <WeatherSummary />
                </section>
                <section className="weatherWidget">
                    <ForecastData />
                </section>
                <section className="side-by-side-section">
                    <section className="adviceWidget">
                        <div className="adviceTitle">Driving Advice</div>
                        <Advice />
                    </section>
                    <section className="vehicleWidget">
                        <span className="vehicleText">Vehicle</span>
                        <section className="vehicleSelector">
                            <VehicleSelection />
                        </section>
                    </section>
                </section>
            </div>
        </main>
    );
};
