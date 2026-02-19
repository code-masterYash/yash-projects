
export type WeatherCondition = "Sunny" | "Cloudy" | "Rain" | "Thunderstorm" | "Snow" | "Mist" | "Clear";

export interface CurrentWeather {
  city: string;
  temperature: number;
  feelsLike: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  pressure: number;
}

export interface ForecastDay {
  day: string;
  tempMax: number;
  tempMin: number;
  condition: WeatherCondition;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastDay[];
}
