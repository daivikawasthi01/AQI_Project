export interface City {
  name: string;
  lat: number;
  lon: number;
}

export interface AirQualityData {
  hourly: {
    time: string[];
    pm10: number[];
    pm2_5: number[];
    carbon_monoxide: number[];
    nitrogen_dioxide: number[];
    sulphur_dioxide: number[];
    ozone: number[];
    european_aqi: number[];
  };
}