import CityWeatherDetails from "../types/cityWeatherDetails";

export default function getCorrectValue(key: string, details: CityWeatherDetails): string {
    return JSON.parse(JSON.stringify(details))[key]
}