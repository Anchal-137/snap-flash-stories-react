
import { useState, useEffect } from 'react';

interface WeatherLocation {
  name: string;
  region: string;
  country: string;
  localtime: string;
}

interface WeatherCurrent {
  temperature: number;
  weather_icons: string[];
  weather_descriptions: string[];
  wind_speed: number;
  humidity: number;
  feelslike: number;
  uv_index: number;
  visibility: number;
}

export interface WeatherData {
  location: WeatherLocation;
  current: WeatherCurrent;
}

interface UseWeatherReturn {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  fetchWeather: (query?: string) => Promise<void>;
}

export const useWeather = (autoFetch = false): UseWeatherReturn => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const apiKey = '5703ff755402c2b2a19ab3aec79acc20';

  const fetchWeatherByCoords = async (latitude: number, longitude: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://api.weatherstack.com/current?access_key=${apiKey}&query=${latitude},${longitude}`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.info || 'Failed to fetch weather data');
      }
      
      setWeatherData(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherByQuery = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://api.weatherstack.com/current?access_key=${apiKey}&query=${query}`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.info || 'Failed to fetch weather data');
      }
      
      setWeatherData(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeather = async (query?: string) => {
    if (query) {
      return fetchWeatherByQuery(query);
    }
    
    try {
      // Get user's location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000, // Increased timeout
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      return fetchWeatherByCoords(latitude, longitude);
    } catch (err: any) {
      // If geolocation fails, try with a default location
      console.warn('Geolocation failed, using default location:', err);
      try {
        return await fetchWeatherByQuery('New York');
      } catch (defaultErr) {
        setError(err.message || 'Failed to get location');
        throw err;
      }
    }
  };

  // Auto fetch weather when component mounts if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      fetchWeather().catch(err => {
        console.error('Auto fetch weather error:', err);
      });
    }
  }, [autoFetch]);

  return {
    weatherData,
    isLoading,
    error,
    fetchWeather
  };
};
