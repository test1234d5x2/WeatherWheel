export default function isRaining(weather: string) {
    if (weather === "Thunderstorm" || weather === "Rain" || weather === "Drizzle") {
        document.getElementsByTagName("canvas")[0].style.bottom = "0"
    }
    else {
        document.getElementsByTagName("canvas")[0].style.bottom = "100vh"
    }
}