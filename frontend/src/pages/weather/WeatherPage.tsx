import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  Sun,
  ShieldCheck,
  Calendar,
  CloudRain,
  Compass,
  Thermometer,
} from 'lucide-react';
import { apiRequest } from '../../api/client';

export const WeatherPage: React.FC = () => {
  const [district, setDistrict] = useState('Lucknow');
  const [weatherData, setWeatherData] = useState<any>({
    location: { district: 'Lucknow', state: 'Uttar Pradesh' },
    current: {
      tempC: 31,
      condition: 'Partly Cloudy',
      humidity: 62,
      windKmph: 14,
      rainfallProb: 10,
      uvIndex: 7,
    },
    forecast7Days: [
      { day: 'Today (Aug 15)', maxTemp: 32, minTemp: 24, condition: 'Sunny', rainChance: 10 },
      { day: 'Tomorrow (Aug 16)', maxTemp: 31, minTemp: 23, condition: 'Partly Cloudy', rainChance: 20 },
      { day: 'Mon (Aug 17)', maxTemp: 30, minTemp: 22, condition: 'Light Rain', rainChance: 65 },
      { day: 'Tue (Aug 18)', maxTemp: 29, minTemp: 22, condition: 'Thunderstorm', rainChance: 80 },
      { day: 'Wed (Aug 19)', maxTemp: 31, minTemp: 23, condition: 'Partly Cloudy', rainChance: 30 },
      { day: 'Thu (Aug 20)', maxTemp: 33, minTemp: 25, condition: 'Clear Sky', rainChance: 5 },
      { day: 'Fri (Aug 21)', maxTemp: 34, minTemp: 25, condition: 'Sunny', rainChance: 0 },
    ],
    agroAdvisory: [
      'Rainfall expected on Aug 17 & 18: Postpone pesticide and fertilizer sprays until Aug 19.',
      'High humidity on Tue: Ensure proper field drainage in standing paddy crops.',
      'Ideal soil temperature (26-28°C) for land preparation for upcoming Rabi sowing.',
    ],
  });

  useEffect(() => {
    apiRequest(`/weather?district=${district}`).then((res) => {
      if (res.success && res.weather) {
        setWeatherData(res.weather);
      }
    });
  }, [district]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-bold mb-2">
            <CloudSun className="w-3.5 h-3.5" />
            <span>ICAR & IMD Agromet Advisory Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Agricultural Weather & Advisory (मौसम एवं कृषि सलाह)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Micro-climate forecasts and timely farm advisories for sowing, irrigation, and pesticide spraying.
          </p>
        </div>

        <div>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white shadow-sm"
          >
            <option value="Lucknow">Lucknow (Uttar Pradesh)</option>
            <option value="Kanpur">Kanpur (Uttar Pradesh)</option>
            <option value="Varanasi">Varanasi (Uttar Pradesh)</option>
            <option value="Delhi">Delhi NCR (Azadpur Region)</option>
            <option value="Ludhiana">Ludhiana (Punjab)</option>
          </select>
        </div>
      </div>

      {/* Main Weather Hero Card */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Current Conditions • {weatherData.location.district}, {weatherData.location.state}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-5xl sm:text-6xl font-black">{weatherData.current.tempC}°C</span>
              <div>
                <p className="text-lg font-bold">{weatherData.current.condition}</p>
                <p className="text-xs text-blue-200">Wind Direction: North-East (NE)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center text-xs bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
            <div>
              <Droplets className="w-5 h-5 mx-auto text-blue-300 mb-1" />
              <p className="text-blue-200 text-[10px]">Humidity</p>
              <p className="font-extrabold text-sm">{weatherData.current.humidity}%</p>
            </div>
            <div>
              <Wind className="w-5 h-5 mx-auto text-blue-300 mb-1" />
              <p className="text-blue-200 text-[10px]">Wind Speed</p>
              <p className="font-extrabold text-sm">{weatherData.current.windKmph} km/h</p>
            </div>
            <div>
              <CloudRain className="w-5 h-5 mx-auto text-blue-300 mb-1" />
              <p className="text-blue-200 text-[10px]">Rain Probability</p>
              <p className="font-extrabold text-sm">{weatherData.current.rainfallProb}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast & Agromet Advisory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 7-Day Day-by-Day Forecast */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span>7-Day Agricultural Forecast</span>
          </h2>

          <div className="space-y-2.5">
            {weatherData.forecast7Days.map((day: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs font-medium"
              >
                <div className="w-36 font-bold text-slate-900 dark:text-white">{day.day}</div>
                <div className="text-slate-500">{day.condition}</div>
                <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>{day.rainChance}% rain</span>
                </div>
                <div className="text-right font-bold text-slate-900 dark:text-white">
                  {day.maxTemp}° / <span className="text-slate-400 font-normal">{day.minTemp}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agromet Advisory Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-base">
              <ShieldCheck className="w-5 h-5" />
              <h3>KVK Agromet Advisory for Farmers</h3>
            </div>

            <ul className="space-y-3 text-xs text-emerald-950 dark:text-emerald-200">
              {weatherData.agroAdvisory.map((adv: string, idx: number) => (
                <li key={idx} className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200/60 dark:border-emerald-800/60 leading-relaxed font-medium">
                  🌱 {adv}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
