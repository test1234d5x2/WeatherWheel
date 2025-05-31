import React, { useEffect, useState } from "react";
import ForecastData from "./ForecastData";
import { VehicleSelection } from "./VehicleSelection";
import WeatherSummary from "./WeatherSummary";
import Advice from "./Advice";




export const Main: React.FC = () => {
    // TODO: Move to Weather Warnings now that we have Redux global state.
    // useEffect(() => {
    //     const name = selectPlaceName(store.getState())

    //     if (name !== null) {
    //         fetch(`https://api.weatherapi.com/v1/forecast.json?key=${process.env.REACT_APP_WEATHERAPI_API_KEY}&q=${name}&days=1&aqi=no&alerts=yes`)
    //             .then(response => response.json())
    //             .then((data: WeatherAPIAlertsResponse) => {
    //                 setAlerts(data.alerts.alert);
    //             })
    //             .catch(error => {
    //                 console.error("Weather Alerts Fetch Error:", error);
    //                 setAlerts(null); // Clear alerts on error
    //             });
    //     }
    // }, []);

    return (
        <main>
            <div className="mainPage">
                <section className="Weather">
                    <WeatherSummary />
                </section>
                <section className="weatherWidget">
                    <span className="arrow">&#8592;</span>
                    <ForecastData />
                    <span className="arrow">&#8594;</span>
                </section>
                <section style={{display: "flex", columnGap: "2rem"}}>
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
