import React, { useState } from 'react';
import {
  Sprout,
  Sparkles,
  Droplets,
  FileDown,
  Info,
  CheckCircle2,
  TrendingUp,
  FlaskConical,
  Award,
  BookOpen,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { apiRequest } from '../../api/client';
import { RecommendedCropItem, ModelBenchmarkInfo } from '../../types';

export const CropRecommendationPage: React.FC = () => {
  const [category, setCategory] = useState<'AGRICULTURAL' | 'HORTICULTURAL' | 'ALL'>('AGRICULTURAL');
  const [modelAlgorithm, setModelAlgorithm] = useState<'XGBoost' | 'Random Forest' | 'SVM' | 'Decision Tree' | 'KNN'>('XGBoost');

  const [formData, setFormData] = useState({
    soilType: 'ALLUVIAL',
    soilPh: 6.8,
    nitrogen: 85,
    phosphorus: 50,
    potassium: 42,
    temperature: 24,
    rainfall: 210,
    humidity: 82,
    season: 'Kharif (Monsoon)',
    irrigationMethod: 'CANAL',
    farmSize: 5,
  });

  const [loading, setLoading] = useState(false);
  const [benchmarkInfo, setBenchmarkInfo] = useState<ModelBenchmarkInfo>({
    citation: 'Biplob Dey, Jannatul Ferdous, Romel Ahmed, Heliyon 10 (2024) e25112, Cell Press',
    primaryAlgorithm: 'XGBoost (AC-Model)',
    accuracy: '99.09%',
    aucScore: '1.00 (Perfect AUC)',
    categoryMode: 'Agricultural Crops (11 Grain, Pulse & Fiber crops)',
  });

  const [recommendations, setRecommendations] = useState<RecommendedCropItem[]>([
    {
      cropName: 'Basmati / Paddy Rice (धान)',
      category: 'AGRICULTURAL',
      suitabilityScore: 98,
      expectedYieldPerAcre: '22 - 28 Quintals',
      growingDurationDays: 120,
      waterRequirement: 'High (1200 - 1500 mm)',
      fertilizerGuide: 'NPK 80:48:40 kg/ha. Apply Nitrogen in 3 splits (basal, tillering, panicle initiation).',
      riskFactor: 'LOW',
      explanation:
        'Heliyon (2024) validates Rice requires medium NPK with top-tier rainfall (>180mm) and high relative humidity (>80%). Matches your soil (ALLUVIAL) with 98% affinity for Kharif season.',
      optimalNPK: { n: 80, p: 48, k: 40, ph: 6.4 },
    },
    {
      cropName: 'Tossa Jute / Golden Fiber (पटसन)',
      category: 'AGRICULTURAL',
      suitabilityScore: 92,
      expectedYieldPerAcre: '18 - 24 Quintals',
      growingDurationDays: 120,
      waterRequirement: 'High (1200 - 1600 mm)',
      fertilizerGuide: 'NPK 60:30:30 kg/ha with top dressing of Nitrogen at 4-6 weeks.',
      riskFactor: 'LOW',
      explanation:
        'Similar to Rice in high rainfall (>150mm) and high humidity requirements for optimal bast fiber elongation. Matches your soil (ALLUVIAL) with 92% affinity.',
      optimalNPK: { n: 78, p: 47, k: 40, ph: 6.7 },
    },
    {
      cropName: 'Hybrid Maize / Corn (मक्का)',
      category: 'AGRICULTURAL',
      suitabilityScore: 86,
      expectedYieldPerAcre: '25 - 32 Quintals',
      growingDurationDays: 105,
      waterRequirement: 'Moderate (500 - 600 mm)',
      fertilizerGuide: 'NPK 120:60:40 kg/ha + 25 kg Zinc Sulfate at basal application.',
      riskFactor: 'LOW',
      explanation:
        'Moderate rainfall and balanced NPK requirements. High yield return with low water stress in well-drained soils.',
      optimalNPK: { n: 78, p: 48, k: 20, ph: 6.2 },
    },
  ]);

  const handleCategoryChange = async (newCategory: 'AGRICULTURAL' | 'HORTICULTURAL' | 'ALL') => {
    setCategory(newCategory);
    setLoading(true);

    const res = await apiRequest('/ai/crop-recommendation', {
      method: 'POST',
      body: JSON.stringify({
        ...formData,
        category: newCategory,
      }),
    });

    setLoading(false);
    if (res.success && res.recommendations) {
      setRecommendations(res.recommendations);
      if (res.benchmark) {
        setBenchmarkInfo(res.benchmark);
      }
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await apiRequest('/ai/crop-recommendation', {
      method: 'POST',
      body: JSON.stringify({
        ...formData,
        category,
      }),
    });

    setLoading(false);
    if (res.success && res.recommendations) {
      setRecommendations(res.recommendations);
      if (res.benchmark) {
        setBenchmarkInfo(res.benchmark);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Research-Grade AI Agronomy Engine (Heliyon 2024 / Cell Press)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            AI Crop Recommendation (फसल चयन सलाहकार)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Precision multi-trait agronomic engine classifying 22 agricultural and horticultural crops under NPK, soil pH, and micro-climate parameters.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition self-start"
        >
          <FileDown className="w-4 h-4 text-emerald-600" />
          <span>Download Advisory (PDF)</span>
        </button>
      </div>

      {/* Research Accreditation Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 shadow-md border border-slate-700 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Peer-Reviewed Science Integration</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold">
              Dual-Category Machine Learning Architecture
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on the 2024 study in <em>Heliyon (Cell Press)</em>, separating <strong>Agricultural (AC)</strong> and <strong>Horticultural (HC)</strong> models prevents inter-class confusion and achieves up to <strong>99.30% Precision (AUC 1.0)</strong> with XGBoost.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2 shrink-0 text-xs">
            <div className="px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Top Model Precision</span>
                <span className="font-extrabold text-emerald-300 text-sm">99.30% (XGBoost)</span>
              </div>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Source Dataset</span>
                <span className="font-extrabold text-cyan-200 text-sm">2,200 ICFA Records</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Switcher Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-agro-600" />
            <span>Select Cultivation Domain (फसल श्रेणी चुनें):</span>
          </label>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            {benchmarkInfo.categoryMode}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleCategoryChange('AGRICULTURAL')}
            className={`p-4 rounded-2xl border text-left transition relative overflow-hidden flex flex-col justify-between ${
              category === 'AGRICULTURAL'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 dark:text-emerald-100 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🌾</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
                99.09% ACC
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm">Agricultural Crops (कृषि फसलें)</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Rice, Wheat, Maize, Chickpea, Cotton, Jute, Pulses (11 crops)
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleCategoryChange('HORTICULTURAL')}
            className={`p-4 rounded-2xl border text-left transition relative overflow-hidden flex flex-col justify-between ${
              category === 'HORTICULTURAL'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 dark:text-emerald-100 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🍎</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
                99.30% ACC
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm">Horticultural Crops (बागवानी)</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Mango, Banana, Grapes, Apple, Orange, Papaya, Coffee (11 crops)
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleCategoryChange('ALL')}
            className={`p-4 rounded-2xl border text-left transition relative overflow-hidden flex flex-col justify-between ${
              category === 'ALL'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 dark:text-emerald-100 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🌐</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300">
                98.51% ACC
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm">Unified Crop Engine (सभी फसलें)</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Full 22-Crop Mixed Search (Agri & Horticultural Combined)
              </p>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Input Form */}
        <div className="lg:col-span-1 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-base text-slate-900 dark:text-white">Soil & Weather Inputs</h2>
            </div>
            <span className="text-[11px] font-bold text-slate-400">7 Parameters</span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Soil Type (मिट्टी का प्रकार)
              </label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                  min="3.5"
                  max="9.5"
                  value={formData.soilPh}
                  onChange={(e) => setFormData({ ...formData, soilPh: parseFloat(e.target.value) || 6.5 })}
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
                  onChange={(e) => setFormData({ ...formData, nitrogen: parseInt(e.target.value) || 0 })}
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
                  onChange={(e) => setFormData({ ...formData, phosphorus: parseInt(e.target.value) || 0 })}
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
                  onChange={(e) => setFormData({ ...formData, potassium: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium"
                />
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
                  onChange={(e) => setFormData({ ...formData, temperature: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Humidity (%)
                </label>
                <input
                  type="number"
                  value={formData.humidity}
                  onChange={(e) => setFormData({ ...formData, humidity: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Rainfall (mm)
                </label>
                <input
                  type="number"
                  value={formData.rainfall}
                  onChange={(e) => setFormData({ ...formData, rainfall: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Season (मौसम)
                </label>
                <select
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Kharif (Monsoon)">Kharif (Monsoon / खरीफ)</option>
                  <option value="Rabi (Winter)">Rabi (Winter / रबी)</option>
                  <option value="Zaid (Summer)">Zaid (Summer / जायद)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                ML Model Architecture
              </label>
              <select
                value={modelAlgorithm}
                onChange={(e) => setModelAlgorithm(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium"
              >
                <option value="XGBoost">XGBoost Classifier (Heliyon Optimal - 99.3%)</option>
                <option value="Random Forest">Random Forest (Entropy Split - 98.7%)</option>
                <option value="SVM">Support Vector Machine (RBF Kernel - 98.2%)</option>
                <option value="Decision Tree">Decision Tree Classifier (98.0%)</option>
                <option value="KNN">K-Nearest Neighbors (Minkowski k=3 - 97.7%)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block animate-spin">⏳</span>
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{loading ? 'Evaluating Model...' : 'Generate Research Recommendations'}</span>
            </button>
          </form>
        </div>

        {/* Right: Recommendation Results */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Recommended Crops ({recommendations.length} Matches Found)</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Model: <strong>{modelAlgorithm}</strong></span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{benchmarkInfo.accuracy} Precision</span>
            </div>
          </div>

          <div className="space-y-4">
            {recommendations.map((crop, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 hover:border-emerald-500 transition relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{crop.cropName}</h3>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {crop.category || 'AGRI-HORTI'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          crop.riskFactor === 'LOW'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : crop.riskFactor === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        }`}
                      >
                        {crop.riskFactor} RISK
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Expected Growth Duration: <strong>{crop.growingDurationDays} Days</strong>
                    </p>
                  </div>

                  {/* Suitability Score Badge */}
                  <div className="flex items-center gap-3 sm:self-start">
                    <div className="text-right">
                      <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                        {crop.suitabilityScore}%
                      </span>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Suitability Score</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 font-bold shadow-inner">
                      <Sprout className="w-7 h-7" />
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Expected Yield / Acre</p>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">{crop.expectedYieldPerAcre}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Water Requirement</p>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">{crop.waterRequirement}</p>
                    </div>
                  </div>
                </div>

                {/* Soil NPK vs Optimal Crop Requirement Comparison */}
                {crop.optimalNPK && (
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-bold">
                      <span>Soil Nutrient Balance Comparison (Farmer vs Ideal Crop Requirement)</span>
                      <span className="text-[10px] text-slate-400">Optimal: N:{crop.optimalNPK.n} P:{crop.optimalNPK.p} K:{crop.optimalNPK.k}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-400 block text-[10px] font-bold">Nitrogen (N)</span>
                        <span className="font-extrabold text-slate-900 dark:text-white">{formData.nitrogen} / {crop.optimalNPK.n}</span>
                        <span className="text-[9px] text-slate-400 block">kg/ha</span>
                      </div>

                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-400 block text-[10px] font-bold">Phosphorus (P)</span>
                        <span className="font-extrabold text-slate-900 dark:text-white">{formData.phosphorus} / {crop.optimalNPK.p}</span>
                        <span className="text-[9px] text-slate-400 block">kg/ha</span>
                      </div>

                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-400 block text-[10px] font-bold">Potassium (K)</span>
                        <span className="font-extrabold text-slate-900 dark:text-white">{formData.potassium} / {crop.optimalNPK.k}</span>
                        <span className="text-[9px] text-slate-400 block">kg/ha</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Research-Backed Explainable AI Reasoning */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/70 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                    <Info className="w-4 h-4" />
                    <span>Scientific Agronomic Reasoning (Heliyon 2024 Validation)</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{crop.explanation}</p>
                </div>

                {/* Fertilizer guidance */}
                <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/40">
                  <strong className="text-slate-900 dark:text-white font-semibold">Recommended Fertilizer Dosage: </strong>
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
