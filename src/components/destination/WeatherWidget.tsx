"use client";

import { useEffect, useState } from "react";
import { Droplets, Wind, Thermometer, Sun, Compass } from "lucide-react";

interface Props {
  region: string;
  bestSeason: string;
}

interface LiveWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: number;
}

const REGION_COORDS: Record<string, { lat: number; lon: number; name: string }> = {
  alibaug: { lat: 18.6531, lon: 72.8777, name: "Alibaug" },
  raigad: { lat: 18.2357, lon: 73.4443, name: "Raigad" },
  sindhudurg: { lat: 16.0592, lon: 73.4687, name: "Sindhudurg" },
  tarkarli: { lat: 16.0354, lon: 73.4907, name: "Tarkarli" },
  malvan: { lat: 16.0617, lon: 73.4678, name: "Malvan" },
  ratnagiri: { lat: 16.9902, lon: 73.3120, name: "Ratnagiri" },
  dapoli: { lat: 17.7570, lon: 73.1834, name: "Dapoli" },
  guhagar: { lat: 17.4883, lon: 73.1970, name: "Guhagar" },
  vengurla: { lat: 15.8617, lon: 73.6333, name: "Vengurla" },
  sawantwadi: { lat: 15.9042, lon: 73.8208, name: "Sawantwadi" },
  devgad: { lat: 16.3764, lon: 73.3768, name: "Devgad" },
  kashid: { lat: 18.4357, lon: 72.9102, name: "Kashid" },
  murud: { lat: 18.3283, lon: 72.9628, name: "Murud" },
  ganpatipule: { lat: 17.1477, lon: 73.2687, name: "Ganpatipule" },
  chiplun: { lat: 17.5323, lon: 73.5186, name: "Chiplun" },
};

function getCoords(regionName: string) {
  const norm = regionName?.toLowerCase().trim() || "";
  for (const [key, value] of Object.entries(REGION_COORDS)) {
    if (norm.includes(key) || key.includes(norm)) {
      return value;
    }
  }
  return { lat: 16.9902, lon: 73.3120, name: regionName || "Kokan Coast" };
}

function getWeatherInfo(code: number, isDay: number = 1): { label: string; emoji: string } {
  switch (code) {
    case 0:
      return { label: isDay ? "Clear & Sunny" : "Clear Night", emoji: isDay ? "☀️" : "🌙" };
    case 1:
      return { label: isDay ? "Mainly Sunny" : "Mainly Clear", emoji: isDay ? "🌤️" : "🌤️" };
    case 2:
      return { label: "Partly Cloudy", emoji: "⛅" };
    case 3:
      return { label: "Overcast", emoji: "☁️" };
    case 45:
    case 48:
      return { label: "Misty Fog", emoji: "🌫️" };
    case 51:
    case 53:
    case 55:
      return { label: "Light Drizzle", emoji: "🌦️" };
    case 61:
    case 63:
    case 65:
      return { label: "Rainy", emoji: "🌧️" };
    case 80:
    case 81:
    case 82:
      return { label: "Passing Showers", emoji: "🌦️" };
    case 95:
    case 96:
    case 99:
      return { label: "Thunderstorms", emoji: "⛈️" };
    default:
      return { label: "Pleasant", emoji: "🌤️" };
  }
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const RAINFALL = [5, 5, 10, 15, 30, 250, 400, 380, 200, 80, 30, 10];

export default function WeatherWidget({ region, bestSeason }: Props) {
  const [weather, setWeather] = useState<LiveWeather | null>(null);
  const [loading, setLoading] = useState(true);

  const matched = getCoords(region);
  const currentMonth = new Date().getMonth();
  const maxRain = Math.max(...RAINFALL);

  useEffect(() => {
    let isMounted = true;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${matched.lat}&longitude=${matched.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=Asia%2FKolkata`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch weather");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data?.current) {
          setWeather({
            temperature: Math.round(data.current.temperature_2m),
            feelsLike: Math.round(data.current.apparent_temperature),
            humidity: data.current.relative_humidity_2m,
            windSpeed: Math.round(data.current.wind_speed_10m),
            weatherCode: data.current.weather_code,
            isDay: data.current.is_day ?? 1,
          });
        }
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [matched.lat, matched.lon]);

  const weatherInfo = weather ? getWeatherInfo(weather.weatherCode, weather.isDay) : null;

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#d6e2d4] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold tracking-wider uppercase text-[#2D6A4F] flex items-center gap-1.5">
          <span>🌦️</span> Climate & Weather
        </h3>

        {/* Live indicator badge */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Weather
        </span>
      </div>

      {/* Live Weather Card */}
      {loading ? (
        <div className="h-24 bg-[#edf3eb] rounded-2xl animate-pulse flex items-center justify-center">
          <p className="text-xs text-[#526b58] font-medium">Fetching real-time weather...</p>
        </div>
      ) : weather && weatherInfo ? (
        <div className="bg-[#edf3eb] rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{weatherInfo.emoji}</span>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-[#102416]">
                    {weather.temperature}°C
                  </span>
                  <span className="text-xs font-semibold text-[#526b58]">
                    {weatherInfo.label}
                  </span>
                </div>
                <p className="text-[11px] text-[#526b58] font-medium mt-0.5">
                  Feels like {weather.feelsLike}°C in {matched.name}
                </p>
              </div>
            </div>
          </div>

          {/* Micro Stats Grid */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#d8e5d5]">
            <div className="flex items-center gap-2 bg-white/70 px-2.5 py-1.5 rounded-xl text-xs font-medium text-[#142e1b]">
              <Droplets size={14} className="text-blue-500 shrink-0" />
              <span>Humidity: <strong>{weather.humidity}%</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 px-2.5 py-1.5 rounded-xl text-xs font-medium text-[#142e1b]">
              <Wind size={14} className="text-teal-600 shrink-0" />
              <span>Wind: <strong>{weather.windSpeed} km/h</strong></span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#edf3eb] rounded-2xl p-3.5 mb-4 text-center">
          <p className="text-xs text-[#526b58] font-medium">
            Tropical coastal climate with pleasant sea breezes.
          </p>
        </div>
      )}

      {/* Monthly Rainfall Pattern Chart */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[11px] font-bold text-[#142e1b]">Annual Rainfall Pattern (mm)</p>
          <span className="text-[10px] text-[#6b8571] font-medium">IMD Coastal Average</span>
        </div>

        <div className="flex items-end gap-1 h-14 pt-2">
          {RAINFALL.map((rain, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div
                className={`w-full rounded-t transition-all ${
                  i === currentMonth ? "bg-[#2D6A4F]" : "bg-[#2D6A4F]/25"
                }`}
                style={{ height: `${(rain / maxRain) * 44}px` }}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-1 mt-1.5">
          {MONTHS.map((m, i) => (
            <div
              key={m}
              className={`flex-1 text-center text-[8.5px] font-bold ${
                i === currentMonth ? "text-[#2D6A4F]" : "text-[#7f9884]"
              }`}
            >
              {m}
            </div>
          ))}
        </div>
      </div>

      {/* Best Season Recommendation */}
      {bestSeason && (
        <div className="flex items-center justify-between pt-3 mt-4 border-t border-[#edf3eb]">
          <span className="text-xs text-[#526b58] font-medium">Recommended travel window:</span>
          <span className="text-xs font-bold text-[#1a3824] bg-[#dce7da] px-3 py-1 rounded-full border border-[#cadbc7]">
            {bestSeason}
          </span>
        </div>
      )}
    </div>
  );
}