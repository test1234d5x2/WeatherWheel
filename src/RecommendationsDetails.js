import React from "react";
import jsonData from "./weatherAdvice.json"; // Importing weather advice data from a JSON file
import { AdviceComponent } from "./AdviceComponent";
import { WeatherWarnings } from "./WeatherWarnings";
import jsonDataWarning from "./weatherWarnings.json";

// Display driving recommendations to the user based on vehicle type. Also display an warnings available.
export class RecommendationsDetails extends React.Component {

    constructor(props) {
        super(props)

        this.state = {}
    }
    
    render() {

        //<WeatherWarnings data = {this.props.jsonDataWarning} currentWeatherData = {this.props.currentWeatherData} vehicle={this.props.vehicle} warnings={this.props.warnings} />
        //<AdviceComponent data={this.props.jsonData} currentWeatherData = {this.props.currentWeatherData} vehicle={this.props.vehicle}/>
        return (
            <div className="RecommendationsPageContainer">
                <div className="adviceContainer">
                    <p className="adviceText">Advice</p>
                    <AdviceComponent data={this.props.data} currentWeatherData = {this.props.currentWeatherData} vehicle={this.props.vehicle}/>
                </div>
                
                <div className="warningsContainer">
                <WeatherWarnings data = {this.props.warningsData} currentWeatherData = {this.props.currentWeatherData} vehicle={this.props.vehicle} warnings={this.props.warnings} />
                </div>
            </div>
        )
    }
}


/* 

Based on the Highway Code.
Link:
https://www.gov.uk/guidance/the-highway-code/driving-in-adverse-weather-conditions-226-to-237


Rain:
- In wet weather, stopping distances will be at least double those required for stopping on dry roads.
- The rain and spray from vehicles may make it difficult to see and be seen.
- If the steering becomes unresponsive, it probably means that water is preventing the tyres from gripping the road. Ease off the accelerator and slow down gradually.


Snow & Ice:
- You must be able to see, so clear all snow and ice from all your windows.
- Check your planned route is clear of delays and that no further snowfalls or severe weather are predicted.
- Keep well back from the road user in front as stopping distances can be ten times greater than on dry roads.
- Drive at a slow speed in as high a gear as possible; accelerate and brake very gently.
- Drive particularly slowly on bends where loss of control is more likely. Brake progressively on the straight before you reach a bend. Having slowed down, steer smoothly round the bend, avoiding sudden actions.
- Check your grip on the road surface when there is snow or ice by choosing a safe place to brake gently. If the steering feels unresponsive this may indicate ice and your vehicle losing its grip on the road. When travelling on ice, tyres make virtually no noise.


Wind:
- High-sided vehicles are most affected by windy weather, but strong gusts can also blow a car, cyclist, motorcyclist or horse rider off course.
- In very windy weather your vehicle may be affected by turbulence created by large vehicles. Motorcyclists are particularly affected, so keep well back from them when they are overtaking a high-sided vehicle.


Fog:
- Keep a safe distance behind the vehicle in front. Rear lights can give a false sense of security.
- Be able to pull up well within the distance you can see clearly. This is particularly important on motorways and dual carriageways, as vehicles are travelling faster.
- You must not use front or rear fog lights unless visibility is seriously reduced as they dazzle other road users and can obscure your brake lights. You must switch them off when visibility improves.


Hot:
- Keep your vehicle well ventilated to avoid drowsiness. 
- Be aware that the road surface may become soft or if it rains after a dry spell it may become slippery. These conditions could affect your steering and braking.
- If you are dazzled by bright sunlight, slow down and if necessary, stop.


*/