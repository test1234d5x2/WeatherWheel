import React, { useCallback } from "react";

// --- Interfaces for Weather Data ---
// Define the structure for a single weather condition object.
interface WeatherWarningCondition {
    id: number;
    main: string; // e.g., "Thunderstorm", "Drizzle", "Rain", "Snow", "Atmosphere Group", "Clear", "Clouds"
    description: string;
    icon: string;
}

// Minimal interface for currentWeatherData based on its usage in this component
interface CurrentWeatherData {
    weather: WeatherWarningCondition[];
    // Add other properties if they are part of your actual API response and might be used elsewhere.
}

// Define the structure for the advice warnings text objects.
interface AdviceWarningTexts {
    stormText: string[];
    rainText: string[];
    SnowText: string[]; // Note: 'SnowText' is capitalized based on the original JS
    windText: string[];
    generalText: string[];
}

// Define the structure for the 'data' prop (advice warnings).
// It's an object where keys are vehicle types (strings) and values are arrays
// containing a single AdviceWarningTexts object.
interface AdviceWarningsData {
    [vehicleType: string]: AdviceWarningTexts[];
}

// Define the structure for a single warning item.
interface WarningItem {
    headline: string;
    // Add other properties if they are part of your actual warning data.
    // e.g., description: string; severity: string;
}

// Define the possible vehicle types as a union type.
type VehicleType = "car" | "motorbike" | "van"; // Assuming these are the types from VehicleSelection

// --- Props Interface for WeatherWarnings Component ---
interface WeatherWarningsProps {
    currentWeatherData: CurrentWeatherData | null; // Can be null if data isn't loaded yet
    data: AdviceWarningsData; // This is the `adviceWarnings` data from the original JS
    vehicle: VehicleType;
    warnings: WarningItem[] | null; // Can be null if no warnings or data not loaded
}

/**
 * @function WeatherWarnings
 * @param {WeatherWarningsProps} props - The properties passed to the component.
 * @description Displays weather warnings (issued by local national weather agencies)
 * and general weather advice based on the user's preferred starting location and vehicle type.
 */
export const WeatherWarnings: React.FC<WeatherWarningsProps> = ({
    currentWeatherData,
    data,
    vehicle,
    warnings
}) => {

    /**
     * @function setText
     * @description Determines the appropriate advice text based on current weather conditions and vehicle.
     * @returns {string[] | undefined} An array of strings representing the advice, or undefined if data is not available.
     */
    const setText = useCallback((): string[] | undefined => {
        // If current weather data is null, cannot determine advice, so return.
        if (currentWeatherData === null) {
            return undefined;
        }

        // Get the main weather condition string.
        const weather: string = currentWeatherData.weather[0].main;

        // Access the specific advice warnings data for the given vehicle.
        const adviceWarnings: AdviceWarningTexts | undefined = data[vehicle]?.[0];

        // If vehicle-specific advice is not found, return undefined.
        if (!adviceWarnings) {
            console.warn(`Advice warnings data not found for vehicle type: ${vehicle}`);
            return undefined;
        }

        // Determine which set of advice texts to return based on weather.
        if (weather === "Thunderstorm") {
            return adviceWarnings.stormText;
        } else if (weather === "Drizzle" || weather === "Rain") {
            return adviceWarnings.rainText;
        } else if (weather === "Snow") {
            return adviceWarnings.SnowText;
        } else if (weather === "Atmosphere Group") {
            return adviceWarnings.windText;
        } else {
            return adviceWarnings.generalText;
        }
    }, [currentWeatherData, data, vehicle]); // Dependencies: currentWeatherData, data, vehicle

    // Get the advice text using the memoized helper function.
    const adviceText: string[] | undefined = setText();

    // Early exit if warnings data is null or adviceText is undefined.
    if (warnings === null && adviceText === undefined) {
        return null; // Don't render anything if there's no data for either section
    }

    // Prepare warning headlines for rendering.
    const renderedWarnings = warnings?.map((item: WarningItem, index: number) => (
        <div key={`warning-${index}`} className="warning">
            <div className="warningsSymbol">
                <img alt="WarningSymbol" src={require('./css/assets/warningSymbol.png')} />
            </div>
            <div className="warningsText">
                {item.headline}
            </div>
        </div>
    ));

    // Prepare advice text for rendering.
    const renderedAdvice = adviceText?.map((item: string, index: number) => (
        <div key={`advice-${index}`} className="warning">
            <div className="warningsSymbol">
                <img alt="WarningSymbol" src={require('./css/assets/warningSymbol.png')} />
            </div>
            <div className="warningsText">
                {item}
            </div>
        </div>
    ));

    return (
        <div>
            {/* Render Warnings section only if there are warnings */}
            {renderedWarnings && renderedWarnings.length > 0 && (
                <>
                    <div className="warningsTitle">
                        Warnings
                    </div>
                    <div className="warningComponent">
                        {renderedWarnings}
                    </div>
                </>
            )}

            {/* Render Advice section only if there is advice text */}
            {renderedAdvice && renderedAdvice.length > 0 && (
                <div>
                    <div className="adviceText"> {/* This div was originally named "adviceText" in the JS */}
                        {renderedAdvice}
                    </div>
                </div>
            )}
        </div>
    );
};
