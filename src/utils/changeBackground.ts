export default function changeBackground(description: string): string {
    if (description === "Thunderstorm") {
        return "linear-gradient(to bottom right, #18191A, #4f4f4f)"
    } else if (description === "Drizzle") {
        return "linear-gradient(to bottom right, #61cdf4, #050854)"
    } else if (description === "Rain") {
        return "linear-gradient(to bottom right, #2c68f2, #050854)"
    } else if (description === "Snow") {
        return "linear-gradient(to bottom right, #61cdf4, #ac94f4)"
    } else if (description === "Clear") {
        return "linear-gradient(to bottom right, #61cdf4, #2c68f2)"
    } else if (description === "Atmosphere Group") {
        return "linear-gradient(to bottom right, #bda18c, #18191A)"
    } else {
        return "linear-gradient(to bottom right,rgb(101, 102, 104), #18191A)"
    }
}