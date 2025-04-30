export interface WeatherDisplay {
    locationName: string;
    temperature: number;
    feelsLike: number;
    uv: number;
    condition: string;
    favorite: boolean;
    lastFetchTime: number
}

export enum UnitType {
    FAHRENHEIT = "°F",
    CELSIUS = "°C"
}