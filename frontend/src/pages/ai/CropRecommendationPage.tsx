import React, { useState } from 'react';
import {
  Sprout,
  Sparkles,
  Droplets,
  Calendar,
  AlertTriangle,
  FileDown,
  Info,
  CheckCircle2,
  TrendingUp,
  FlaskConical,
} from 'lucide-react';
import { apiRequest } from '../../api/client';
import { RecommendedCropItem } from '../../types';

export const CropRecommendationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    soilType: 'ALLUVIAL',
    soilPh: 6.8,
    nitrogen: 140,
    phosphorus: 45,
    potassium: 40,
    temperature: 26,
    rainfall: 650,
    humidity: 60,
    season: 'Rabi (Winter)',
    irrigationMethod: 'CANAL',
    farmSize: 5,
  });

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendedCropItem[]>([
    {
      cropName: 'HD-2967 Sharbati Wheat',
      suitabilityScore: 96,
      expectedYieldPerAcre: '22 - 26 Quintals',
      growingDurationDays: 135,
      waterRequirement: 'Moderate (400-500 mm)',
      fertilizerGuide: 'NPK 120:60:40 kg/ha. Apply Nitrogen in 3 splits. Zinc Sulfate @ 25 kg/ha at sowing.',
      riskFactor: 'LOW',
      explanation:
        'Wheat is highly recommended because your Alluvial soil pH (6.8), moderate winter temperature (26°C), and canal irrigation provide optimal conditions for high grain weight and gluten quality.',
    },
    {
      cropName: 'Yellow Mustard (Pusa Bold)',
      suitabilityScore: 92,
      expectedYieldPerAcre: '9 - 13 Quintals',
      growingDurationDays: 110,
      waterRequirement: 'Low (250-350 mm)',
      fertilizerGuide: 'NPK 80:40:40 kg/ha + 20 kg Elemental Sulfur/ha for enhanced oil content.',
      riskFactor: 'LOW',
      explanation:
        'Mustard is recommended for low irrigation requirements and high oilseed profit margins in North Indian plains.',
    },
    {
      cropName: 'Organic Tomato (Pusa Ruby)',
      suitabilityScore: 86,
      expectedYieldPerAcre: '130 - 170 Quintals',
      growingDurationDays: 90,
      waterRequirement: 'Moderate (Drip Recommended)',
      fertilizerGuide: 'Vermi-compost 5 tons/acre + Bio-fertilizers (Azotobacter & PSB).',
      riskFactor: 'MEDIUM',
      explanation:
        'Provides rapid 90-day cash flow during Rabi season, with high local APMC demand in nearby cities.',
    },
  ]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await apiRequest('/ai/crop-recommendation', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    setLoading(false);
    if (res.success && res.recommendations) {
      setRecommendations(res.recommendations);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Soil & Climate Agronomy Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            AI Crop Recommendation (फसल चयन सलाहकार)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enter your farm soil parameters and environmental conditions to receive explainable crop recommendations.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold shadow-sm hover:bg-slate-50 transition self-start"
        >
          <FileDown className="w-4 h-4" />
          <span>Download Report (PDF)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Input Form */}
        <div className="lg:col-span-1 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <FlaskConical className="w-5 h-5 text-agro-600" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">Farm Soil & Climate Data</h2>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Soil Type (मिट्टी का प्रकार)
              </label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-agro-500 focus:outline-none"
              >
                <option value="ALLUVIAL">Alluvial Soil (जलोढ़ मिट्टी)</option>
                <option value="BLACK">Black Cotton Soil (काली मिट्टी)</option>
                <option value="RED">Red Soil (लाल मिट्टी)</option>
                <option value="CLAY">Clay Soil (चिकनी मिट्टी)</option>
                <option value="LOAM">Loam Soil (दोमट मिट्टी)</option>
                <option value="SANDY">Sandy Soil (बलुई मिट्टी)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Soil pH ({formData.soilPh})
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="4"
                  max="9"
                  value={formData.soilPh}
                  onChange={(e) => setFormData({ ...formData, soilPh: parseFloat(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nitrogen N (kg/ha)
                </label>
                <input
                  type="number"
                  value={formData.nitrogen}
                  onChange={(e) => setFormData({ ...formData, nitrogen: parseInt(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phosphorus P (kg/ha)
                </label>
                <input
                  type="number"
                  value={formData.phosphorus}
                  onChange={(e) => setFormData({ ...formData, phosphorus: parseInt(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Potassium K (kg/ha)
                </label>
                <input
                  type="number"
                  value={formData.potassium}
                  onChange={(e) => setFormData({ ...formData, potassium: parseInt(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Season (मौसम)
                </label>
                <select
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Rabi (Winter)">Rabi (Winter / रबी)</option>
                  <option value="Kharif (Monsoon)">Kharif (Monsoon / खरीफ)</option>
                  <option value="Zaid (Summer)">Zaid (Summer / जायद)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Irrigation Method
                </label>
                <select
                  value={formData.irrigationMethod}
                  onChange={(e) => setFormData({ ...formData, irrigationMethod: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium"
                >
                  <option value="CANAL">Canal (नहर)</option>
                  <option value="BOREWELL">Borewell (नलकूप)</option>
                  <option value="DRIP">Drip Irrigation (ड्रिप)</option>
                  <option value="SPRINKLER">Sprinkler (फव्वारा)</option>
                  <option value="RAIN">Rainfed Only (वर्षा आधारित)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Avg Temp (°C)
                </label>
                <input
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseInt(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Farm Size (Acres)
                </label>
                <input
                  type="number"
                  value={formData.farmSize}
                  onChange={(e) => setFormData({ ...formData, farmSize: parseInt(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-agro-600 to-emerald-600 hover:from-agro-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md shadow-agro-600/30 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block animate-spin">⏳</span>
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{loading ? 'Analyzing Agronomy Models...' : 'Run AI Recommendation'}</span>
            </button>
          </form>
        </div>

        {/* Right: Recommendation Results */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Recommended Crops ({recommendations.length} Matches Found)</span>
            </h2>
            <span className="text-xs text-slate-400">Ranked by Suitability Score</span>
          </div>

          <div className="space-y-4">
            {recommendations.map((crop, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 hover:border-agro-500 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{crop.cropName}</h3>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          crop.riskFactor === 'LOW'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {crop.riskFactor} RISK
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Expected Duration: {crop.growingDurationDays} Days
                    </p>
                  </div>

                  {/* Suitability Score */}
                  <div className="flex items-center gap-3 sm:self-start">
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-agro-600 dark:text-agro-400">
                        {crop.suitabilityScore}%
                      </span>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Suitability</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-agro-50 dark:bg-agro-950/60 border border-agro-200 dark:border-agro-800 flex items-center justify-center text-agro-600 font-bold">
                      <Sprout className="w-7 h-7" />
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-agro-600" />
                      Expected Yield / Acre
                    </p>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {crop.expectedYieldPerAcre}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                      <Droplets className="w-3.5 h-3.5 text-blue-500" />
                      Water Requirement
                    </p>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {crop.waterRequirement}
                    </p>
                  </div>
                </div>

                {/* FR-027 Explainable Reasoning */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/70 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                    <Info className="w-4 h-4" />
                    <span>Why was this crop recommended? (वैज्ञानिक कारण)</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{crop.explanation}</p>
                </div>

                {/* Fertilizer guidance */}
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Fertilizer Guidance: </span>
                  {crop.fertilizerGuide}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
