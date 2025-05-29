export default function changeBackground(description: string) {
    if (description === "Thunderstorm") {
        document.body.style.backgroundImage = "linear-gradient(to bottom right, #18191A, #4f4f4f)";
    } else if (description === "Drizzle") {
        document.body.style.backgroundImage = "linear-gradient(to bottom right, #61cdf4, #050854)";
    } else if (description === "Rain") {
        document.body.style.backgroundImage = "linear-gradient(to bottom right, #2c68f2, #050854)";
    } else if (description === "Snow") {
        document.body.style.backgroundImage = "linear-gradient(to bottom right, #61cdf4, #ac94f4)";
    } else if (description === "Clear") {
        document.body.style.backgroundImage = "linear-gradient(to bottom right, #61cdf4, #2c68f2)";
    } else if (description === "Atmosphere Group") {
        document.body.style.backgroundImage = "linear-gradient(to bottom right, #bda18c, #18191A)";
    } else {
        document.body.style.backgroundImage = "linear-gradient(to bottom right,rgb(101, 102, 104), #18191A)";
    }
}