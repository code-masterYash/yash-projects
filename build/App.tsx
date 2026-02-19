
import React, { useState, useEffect, useCallback } from 'react';
import type { WeatherData } from './types';
import { fetchWeatherData } from './services/weatherService';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import { GitHubIcon } from './constants';

const App: React.FC = () => {
  const [city, setCity] = useState<string>('Delhi');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (searchCity: string) => {
    if (!searchCity) return;
    setIsLoading(true);
    setError(null);
    setWeatherData(null);
    try {
      const data = await fetchWeatherData(searchCity);
      setWeatherData(data);
      setCity(searchCity);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data. Please try another city.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleSearch(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat font-sans text-white antialiased" style={{ backgroundImage: "url('https://picsum.photos/seed/weather/1920/1080')" }}>
      <div className="min-h-screen w-full bg-black/40 backdrop-blur-sm">
        <main className="container mx-auto flex max-w-4xl flex-col p-4 sm:p-8">
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Weather India</h1>
             <a href="https://github.com/google/generative-ai-docs/tree/main/app-integrations/web/react" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                <GitHubIcon />
             </a>
          </header>

          <section className="my-8">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </section>

          <section>
            {isLoading && <Loader />}
            {error && <ErrorMessage message={error} />}
            {weatherData && (
              <div className="space-y-8">
                <CurrentWeather data={weatherData.current} />
                <Forecast data={weatherData.forecast} />
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;
