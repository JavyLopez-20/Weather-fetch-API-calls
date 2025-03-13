import dotenv from 'dotenv';
dotenv.config();


// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
interface Weather {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;
  private geocodeURL: string;
  private weatherURL: string;
  public coordinates: Coordinates;
  public weather: Weather;
  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5/';
    this.apiKey = process.env.WEATHER_API_KEY || '';
    this.cityName = '';
    this.geocodeURL = `${this.baseURL}geo/1.0/direct`;
    this.weatherURL = `${this.baseURL}weather`;
    this.coordinates = { lat: 0, lon: 0 } as Coordinates;
    this.weather = {
      city: '',
      country: '',
      temperature: 0,
      humidity: 0,
      windSpeed: 0,
      description: '',
      icon: '',
    } as Weather;
  }
  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  public async fetchLocationData(query: string): Promise<Coordinates> {
    const response = await fetch(`${this.geocodeURL}?q=${query}&appid=${this.apiKey}`);
    if (!response.ok) {
      throw new Error(`Error fetching location data: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.length === 0) {
      throw new Error('No location data found');
    }
    const locationData: Coordinates = {
      lat: data[0].lat,
      lon: data[0].lon,
    };
    this.coordinates = locationData;
    return locationData;
  }
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  public destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  public buildGeocodeQuery(): string {
    return `${this.geocodeURL}?q=${this.cityName}&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  public buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.weatherURL}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  public async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  public async fetchWeatherData(coordinates: Coordinates): Promise<Weather> {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.statusText}`);
    }
    const weatherData = await response.json();
    return this.parseCurrentWeather(weatherData);
  }
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  public parseCurrentWeather(response: any): Weather {
    const weather: Weather = {
      city: response.name,
      country: response.sys.country,
      temperature: response.main.temp,
      humidity: response.main.humidity,
      windSpeed: response.wind.speed,
      description: response.weather[0].description,
      icon: response.weather[0].icon,
    };
    this.weather = weather;
    return weather;
  }
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  public buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecast: Weather[] = [];
    for (const data of weatherData) {
      const weather: Weather = {
        city: currentWeather.city,
        country: currentWeather.country,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      };
      forecast.push(weather);
    }
    return forecast;
  }
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  public async getWeatherForCity(city: string): Promise<Weather> {
    this.cityName = city;
    try {
      const locationData = await this.fetchAndDestructureLocationData(city);
      const weatherData = await this.fetchWeatherData(locationData);
      return weatherData;
    } catch (error) {
      throw new Error(`Error fetching weather data: ${error}`);
    }
  }
}

export default new WeatherService();
