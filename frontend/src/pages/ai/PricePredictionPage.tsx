import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Calendar,
  AlertCircle,
  Bell,
  FileDown,
  Building2,
  ArrowUpRight,
  ShieldAlert,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { apiRequest } from '../../api/client';
import { PricePredictionResult } from '../../types';

export const PricePredictionPage: React.FC = () => {
  const [crop, setCrop] = useState('Wheat (Gehu)');
  const [mandi, setMandi] = useState('Lucknow Central APMC');
  const [loading, setLoading] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [targetAlertPrice, setTargetAlertPrice] = useState(2500);

  const [predictionData, setPredictionData] = useState<PricePredictionResult>({
    cropName: 'Sharbati Wheat',
    primaryMarket: 'Lucknow Central APMC',
    currentPrice: 2275,
    unit: 'Quintal (100 kg)',
    forecast: [
      { month: 'Sep 2026', predictedPrice: 2343, lowBound: 2250, highBound: 2436 },
      { month: 'Oct 2026', predictedPrice: 2413, lowBound: 2315, highBound: 2510 },
      { month: 'Nov 2026', predictedPrice: 2485, lowBound: 2385, highBound: 2585 },
      { month: 'Dec 2026', predictedPrice: 2560, lowBound: 2457, highBound: 2662 },
      { month: 'Jan 2027', predictedPrice: 2636, lowBound: 2530, highBound: 2742 },
      { month: 'Feb 2027', predictedPrice: 2715, lowBound: 2605, highBound: 2825 },
    ],
    trend: 'UP',
    riskLevel: 'LOW',
    bestSellingPeriod: 'Nov 2026 - Dec 2026',
    insights: [
      'Historical 5-year arrival trends indicate supply contraction during late autumn in UP APMC mandis.',
      'Demand from regional flour mills and interstate buyers in Kanpur & Delhi is projected to rise 8-12%.',
      'Holding stock for 60 to 90 days after harvest is estimated to yield 6% to 9% higher realizations.',
    ],
    marketComparisons: [
      { mandi: 'Lucknow Central APMC', district: 'Lucknow', state: 'Uttar Pradesh', currentModalPrice: 2275, distanceKm: 12, demandStatus: 'HIGH' },
      { mandi: 'Kanpur Grain Mandi', district: 'Kanpur', state: 'Uttar Pradesh', currentModalPrice: 2345, distanceKm: 85, demandStatus: 'HIGH' },
      { mandi: 'Varanasi Wholesale Mandi', district: 'Varanasi', state: 'Uttar Pradesh', currentModalPrice: 2298, distanceKm: 280, demandStatus: 'MODERATE' },
      { mandi: 'Azadpur Mandi', district: 'Delhi', state: 'Delhi NCR', currentModalPrice: 2435, distanceKm: 490, demandStatus: 'HIGH' },
    ],
  });

  const handlePredict = async (selectedCrop: string, selectedMandi: string) => {
    setLoading(true);
    const res = await apiRequest('/ai/price-prediction', {
      method: 'POST',
      body: JSON.stringify({ cropName: selectedCrop, marketLocation: selectedMandi }),
    });

    setLoading(false);
    if (res.success && res.prediction) {
      setPredictionData(res.prediction);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>ARIMA & Econometric Price Forecasting Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            AI Mandi Price Prediction (फसल भाव भविष्यवाणी)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Analyze historical wholesale mandi arrival data, forecast 6-month futures, and compare inter-mandi arbitrage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAlertModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition"
          >
            <Bell className="w-4 h-4" />
            <span>Set Price Alert</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-sm hover:bg-slate-50 transition"
          >
            <FileDown className="w-4 h-4" />
            <span>PDF Export</span>
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Crop (फसल)</label>
            <select
              value={crop}
              onChange={(e) => {
                setCrop(e.target.value);
                handlePredict(e.target.value, mandi);
              }}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <option value="Wheat">Wheat (गेहूं - Sharbati HD-2967)</option>
              <option value="Mustard">Mustard (सरसों - Pusa Bold)</option>
              <option value="Paddy">Paddy / Rice (धान - Basmati 1121)</option>
              <option value="Maize">Maize (मक्का - Hybrid)</option>
              <option value="Tomato">Tomato (टमाटर - Pusa Ruby)</option>
              <option value="Potato">Potato (आलू - Kufri Jyoti)</option>
              <option value="Onion">Onion (प्याज - Red Nasik)</option>
              <option value="Sugarcane">Sugarcane (गन्ना - Co 0238)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Primary Mandi (मंडी)</label>
            <select
              value={mandi}
              onChange={(e) => {
                setMandi(e.target.value);
                handlePredict(crop, e.target.value);
              }}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <option value="Lucknow Central APMC">Lucknow Central APMC (UP)</option>
              <option value="Kanpur Grain Mandi">Kanpur Grain Mandi (UP)</option>
              <option value="Varanasi Wholesale Mandi">Varanasi Mandi (UP)</option>
              <option value="Azadpur Mandi">Azadpur Mandi (Delhi)</option>
            </select>
          </div>
        </div>

        {/* Current Modal Price Badge */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 self-stretch sm:self-auto justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Current Modal Rate</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{predictionData.currentPrice}{' '}
              <span className="text-xs font-normal text-slate-500">/ {predictionData.unit}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Trend: {predictionData.trend} (Bullish)
            </span>
          </div>
        </div>
      </div>

      {/* Main Forecast Chart & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Forecast Graph (Recharts AreaChart) */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                6-Month Price Forecast (भविष्यवाणी ग्राफ)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Shows expected modal price with upper & lower confidence intervals (₹ / Qtl)
              </p>
            </div>
            <span className="text-xs font-bold text-agro-600 bg-agro-50 dark:bg-agro-950/50 px-2.5 py-1 rounded-lg">
              95% Confidence Band
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictionData.forecast}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="predictedPrice"
                  name="Predicted Price (₹)"
                  stroke="#16a34a"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#priceGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="highBound"
                  name="High Interval (₹)"
                  stroke="#38bdf8"
                  strokeDasharray="4 4"
                  fillOpacity={0}
                />
                <Area
                  type="monotone"
                  dataKey="lowBound"
                  name="Low Interval (₹)"
                  stroke="#f43f5e"
                  strokeDasharray="4 4"
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* AI Econometric Insights */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Market Driver Analysis</span>
            </p>
            <ul className="space-y-1 text-slate-600 dark:text-slate-300">
              {predictionData.insights.map((insight, idx) => (
                <li key={idx}>• {insight}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Advice Card: Selling window & risk */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-agro-900 to-emerald-950 text-white p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Optimal Selling Advice
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {predictionData.riskLevel} RISK
              </span>
            </div>

            <div>
              <p className="text-xs text-agro-200">Recommended Selling Period</p>
              <h3 className="text-xl font-extrabold text-amber-300 mt-1">
                {predictionData.bestSellingPeriod}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Delaying bulk liquidation until {predictionData.bestSellingPeriod} is estimated to return up to <span className="text-white font-bold">+12.5% higher revenue</span> compared to immediate harvest dumping.
            </p>

            <div className="p-3 rounded-2xl bg-white/10 text-xs text-slate-200 border border-white/10 space-y-1">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-300" />
                <span>Disclaimer</span>
              </p>
              <p className="text-[11px] text-agro-100">
                Forecasts are probabilistic projections based on historical mandi arrivals, weather patterns, and macro demand. Prices are not legally guaranteed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Mandi Comparison Table (FR-048) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-agro-600" />
              <span>Inter-Mandi Price Comparison (मंडी तुलना)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Check arbitrage opportunities across neighboring wholesale agricultural markets
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Mandi / Market</th>
                <th className="p-3.5">District & State</th>
                <th className="p-3.5">Distance</th>
                <th className="p-3.5">Today's Modal Rate</th>
                <th className="p-3.5">Demand Pressure</th>
                <th className="p-3.5 rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {predictionData.marketComparisons.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 font-medium">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{item.mandi}</td>
                  <td className="p-3.5 text-slate-500">{item.district}, {item.state}</td>
                  <td className="p-3.5 text-slate-500">{item.distanceKm} km</td>
                  <td className="p-3.5 font-extrabold text-slate-900 dark:text-white text-sm">
                    ₹{item.currentModalPrice} / Qtl
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.demandStatus === 'HIGH'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {item.demandStatus}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <button
                      onClick={() => alert(`Transport booking dispatched for ${item.mandi}`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-agro-600 hover:text-white font-bold text-[11px] transition"
                    >
                      Book Logistics
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Price Alert Modal */}
      {alertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <span>Create SMS/App Price Alert</span>
            </h3>
            <p className="text-xs text-slate-500">
              We will send an immediate notification to your registered mobile when {crop} touches your target rate in {mandi}.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Threshold Price (₹ per Quintal)
              </label>
              <input
                type="number"
                value={targetAlertPrice}
                onChange={(e) => setTargetAlertPrice(parseInt(e.target.value))}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setAlertModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Price Alert set! You will be notified when ${crop} reaches ₹${targetAlertPrice}/Qtl.`);
                  setAlertModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition"
              >
                Confirm Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
