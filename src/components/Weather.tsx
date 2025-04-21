
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { CloudSun, CloudRain, Thermometer } from 'lucide-react';

interface WeatherProps {
  weatherData: {
    location: {
      name: string;
      region: string;
      country: string;
      localtime: string;
    };
    current: {
      temperature: number;
      weather_icons: string[];
      weather_descriptions: string[];
      wind_speed: number;
      humidity: number;
      feelslike: number;
      uv_index: number;
      visibility: number;
    };
  };
  overlay?: boolean;
}

const Weather = ({ weatherData, overlay = false }: WeatherProps) => {
  const { theme } = useTheme();
  
  const getWeatherIcon = () => {
    if (weatherData.current.temperature > 20) {
      return <Thermometer size={24} className="mr-2 text-red-400" />;
    } else if (weatherData.current.temperature < 10) {
      return <CloudRain size={24} className="mr-2 text-blue-400" />;
    } else {
      return <CloudSun size={24} className="mr-2 text-yellow-400" />;
    }
  };
  
  if (overlay) {
    return (
      <div className="bg-black/50 backdrop-blur-sm text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getWeatherIcon()}
            <div>
              <h3 className="font-bold">{weatherData.location.name}</h3>
              <div className="flex items-center">
                <span className="text-xl font-medium">{weatherData.current.temperature}°C</span>
                <span className="mx-2 text-sm opacity-75">Feels like {weatherData.current.feelslike}°C</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm">{weatherData.current.weather_descriptions[0]}</p>
            <p className="text-xs">Humidity: {weatherData.current.humidity}%</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`rounded-lg p-4 shadow-md ${
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold">{weatherData.location.name}</h3>
        {getWeatherIcon()}
      </div>
      
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">{weatherData.current.temperature}°C</span>
          <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Feels like {weatherData.current.feelslike}°C
          </span>
        </div>
        
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {weatherData.current.weather_descriptions[0]}
        </p>
        
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="block">Humidity</span>
            <span className="font-medium">{weatherData.current.humidity}%</span>
          </div>
          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="block">Wind</span>
            <span className="font-medium">{weatherData.current.wind_speed} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
