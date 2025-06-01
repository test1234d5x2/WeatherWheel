export default interface LegendItemKey {
    hexCode: string
    value: string
}


export const WEATHER_LAYER_LEGENDS: { [key: string]: LegendItemKey[] } = {
    "Temperature": [
        { hexCode: "821692", value: "-40°C" },
        { hexCode: "8257DB", value: "-30°C" },
        { hexCode: "208CEC", value: "-20°C" },
        { hexCode: "20C4E8", value: "-10°C" },
        { hexCode: "23DDDD", value: "0°C" },
        { hexCode: "C2FF28", value: "10°C" },
        { hexCode: "FFF028", value: "20°C" },
        { hexCode: "FFC228", value: "25°C" },
        { hexCode: "FC8014", value: "30°C" }
    ],
    "Rain": [
        { hexCode: "7878BE19", value: "0.5mm" },
        { hexCode: "6E6ECD33", value: "1mm" },
        { hexCode: "5050E1B2", value: "10mm" },
        { hexCode: "1414FFE5", value: "140mm" }
    ],
    "Clouds": [
        { hexCode: "F7F7FF66", value: "50%" },
        { hexCode: "F6F5FF8C", value: "60%" },
        { hexCode: "F4F4FFBF", value: "70%" },
        { hexCode: "E9E9DFCC", value: "80%" },
        { hexCode: "DEDEDED8", value: "90%" },
        { hexCode: "D2D2D2FF", value: "100%" },
        { hexCode: "D2D2D2FF", value: "200%" }
    ],
    "Wind": [
        { hexCode: "EECECC66", value: "5m/s" },
        { hexCode: "B364BCB3", value: "15m/s" },
        { hexCode: "3F213BCC", value: "25m/s" },
        { hexCode: "744CACE6", value: "50m/s" },
        { hexCode: "4600AFFF", value: "100m/s" },
        { hexCode: "0D1126FF", value: "200m/s" }
    ],
    "Snow": [
        { hexCode: "EDEDED", value: "0.05m" },
        { hexCode: "D9F0F4", value: "0.1m" },
        { hexCode: "A5E5EF", value: "0.2m" },
        { hexCode: "7DDEED", value: "0.3m" },
        { hexCode: "35D2EA", value: "0.4m" },
        { hexCode: "00CCE8", value: "0.5m" },
        { hexCode: "706DCE", value: "0.6m" },
        { hexCode: "514FCC", value: "0.7m" },
        { hexCode: "3333CC", value: "0.8m" },
        { hexCode: "1818CC", value: "0.9m" },
        { hexCode: "C454B7", value: "1.2m" },
        { hexCode: "C12CB0", value: "1.5m" },
        { hexCode: "BF00A8", value: "1.8m" },
        { hexCode: "85408C", value: "2.5m" },
        { hexCode: "7F2389", value: "3.0m" },
        { hexCode: "790087", value: "4.0m" },
        { hexCode: "E80068", value: "15m" }
    ],
    "Pressure": [
        { hexCode: "0073FF", value: "94000hPa" },
        { hexCode: "00AAFF", value: "96000hPa" },
        { hexCode: "4BD0D6", value: "98000hPa" },
        { hexCode: "8DE7C7", value: "100000hPa" },
        { hexCode: "B0F720", value: "101000hPa" },
        { hexCode: "F0B800", value: "102000hPa" },
        { hexCode: "FB5515", value: "104000hPa" },
        { hexCode: "F3363B", value: "106000hPa" },
        { hexCode: "C60000", value: "108000hPa" }
    ]
}