import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, MapPin, RefreshCw, AlertTriangle } from 'lucide-react';

const getWeatherIcon = (text) => {
  if (!text) return <Sun size={48} />;
  const t = text.toLowerCase();
  if (t.includes("rain") || t.includes("drizzle") || t.includes("shower")) return <CloudRain size={48} />;
  if (t.includes("snow") || t.includes("ice") || t.includes("blizzard")) return <CloudRain size={48} color="#fff" />;
  if (t.includes("cloud") || t.includes("overcast")) return <Cloud size={48} />;
  if (t.includes("thunder") || t.includes("storm")) return <AlertTriangle size={48} />;
  return <Sun size={48} />;
};


export default function WeatherCard({ updateContext }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    const performFetch = async (lat, lon) => {
      try {
        const apiKey = import.meta.env.VITE_WEATHERAPI_KEY;
        const weatherRes = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`);
        const weatherData = await weatherRes.json();
        
        let city = weatherData.location?.name || "Unknown City";

        const result = {
          temperature: weatherData.current?.temp_c || 0,
          windspeed: weatherData.current?.wind_kph || 0,
          condition: weatherData.current?.condition?.text || "Unknown",
          city: city
        };

        setData(result);
        updateContext(result);
      } catch (err) {
        setError("Failed to fetch weather data.");
      } finally {
        setLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          performFetch(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.warn("Geolocation denied or error, falling back to Pune", err);
          // Fallback to Pune
          performFetch(18.52, 73.86);
        },
        { timeout: 5000 }
      );
    } else {
      performFetch(18.52, 73.86);
    }
  };

  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="dashboard-card card--weather">
      <div className="card-header">
        <h2>Weather</h2>
        <div className="icon-wrapper">
          <Cloud size={20} />
        </div>
      </div>

      {loading && !data ? (
        <div className="data-hero" style={{ opacity: 0.5 }}>--°C</div>
      ) : error ? (
        <div className="data-sub" style={{ color: 'var(--accent-currency)' }}>{error}</div>
      ) : data ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div>
            <div style={{ color: 'var(--accent-weather)', marginBottom: '8px' }}>
              {getWeatherIcon(data.condition)}
            </div>
          </div>
          <div>
            <div className="data-hero">{data.temperature}°</div>
            <div className="data-sub">
              {data.condition} • Wind: {data.windspeed} km/h
            </div>
            <div className="data-sub" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: 'var(--text-primary)' }}>
              <MapPin size={14} color="var(--accent-weather)" /> {data.city}
            </div>
          </div>
        </div>
      ) : null}

      <button className={`btn-refresh ${loading ? 'btn-refresh--loading' : ''}`} onClick={fetchWeather} disabled={loading}>
        <RefreshCw className="refresh-icon" /> {loading ? 'UPDATING...' : 'REFRESH'}
      </button>
    </div>
  );
}
