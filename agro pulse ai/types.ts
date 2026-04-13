export interface PriceRecord {
  date: string;
  market: string;
  crop: string;
  price: number;
}

export interface YieldRecord {
  state: string;
  district: string;
  season: string;
  crop: string;
  yield: number;
}

export interface SoilRecord {
  district: string;
  soil_type: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  rainfall: number; // mm
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy';
  riskLevel: 'Low' | 'Medium' | 'High';
}

export enum Tab {
  DASHBOARD = 'DASHBOARD',
  RECOMMENDATIONS = 'RECOMMENDATIONS',
  MARKET = 'MARKET'
}
