import VehicleType from "../types/vehicleType"


const generatePrompt = (temperature: number, weather: string, visibility: number, windSpeed: number, vehicle: VehicleType) => { 
    return `
    "You are a highly concise, safety-focused AI assistant providing driving advice. Based on the following current weather conditions and vehicle type, generate **exactly two distinct sentences of essential driving advice**. Each sentence must be provided on a new line, separated by a newline character (\\n). Do not include any introductory phrases, bullet points, numbered lists, or concluding remarks beyond these two sentences. Be direct and actionable.

    **Current Weather Conditions:**
    - Temperature: ${temperature}°C
    - General Conditions: ${weather}
    - Visibility: ${visibility}m
    - Wind Speed/Direction: ${windSpeed}m/s

    **Vehicle Type: ${vehicle.vehicle}**

    **Example Output Format:**
    Sentence 1.
    <NEWLINE>
    Sentence 2.

    Example 1:
    Reduce your speed and increase your following distance in wet conditions.

    Be extra vigilant for slippery surfaces like painted lines.

    Example 2:
    Strong crosswinds can destabilize your vehicle, especially high-sided ones.

    Maintain a firm grip on the steering wheel and anticipate gusts.

    Generate advice for the current conditions:"
    `
}

export default generatePrompt