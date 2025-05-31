import L from "leaflet"

export default function createCityLabel(city: string): L.DivIcon {
    return L.divIcon({
        className: "city-label",
        html: `<div class="city-label-text">${city}</div>`,
        iconSize: [0, 0]
    })
}