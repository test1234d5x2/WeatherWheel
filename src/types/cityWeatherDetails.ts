import CityDetails from "./cityDetails"

export default interface CityWeatherDetails extends CityDetails {
    temperature: string
    clouds: string
    rain: string
    snow: string
    wind: string
    pressure: string
}