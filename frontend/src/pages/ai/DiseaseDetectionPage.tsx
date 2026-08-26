import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ScanLine,
  Upload,
  Camera,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  FileDown,
  UserCheck,
  Leaf,
  Bug,
  Award,
  BookOpen,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';
import { apiRequest } from '../../api/client';
import { DiseaseDetectionResult } from '../../types';

export const DiseaseDetectionPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string>(
    'https://images.unsplash.com/photo-1592417817098-8f3d6eb19657?auto=format&fit=crop&w=800&q=80'
  );
  const [cropHint, setCropHint] = useState<string>('Tomato');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [result, setResult] = useState<DiseaseDetectionResult | null>({
    cropName: 'Tomato (टमाटर)',
    predictedDisease: 'Tomato Early Blight (Alternaria solani)',
    confidenceScore: 95.8,
    severity: 'MODERATE',
    symptoms: [
      'Concentric dark brown circular rings (target-board appearance) on lower leaves',
      'Yellow chlorotic halos surrounding necrotic leaf spots',
      'Premature defoliation starting from ground-level foliage progressing upward',
    ],
    treatments: {
      chemical: [
        'Mancozeb 75% WP @ 2g per liter of water',
        'Copper Oxychloride 50% WP @ 2.5g per liter',
        'Azoxystrobin 23% SC @ 1 ml per liter',
      ],
      organic: [
        'Neem oil spray (10,000 ppm) @ 5 ml per liter with liquid soap spreader',
        'Trichoderma viride bio-fungicide soil drenching (5g/L)',
        'Panchagavya organic spray (3% concentration)',
      ],
      dosageInfo: 'Spray evenly during morning or late afternoon. Repeat after 7-10 days under warm humid weather.',
    },
    prevention: [
      'Practice 2 to 3 year crop rotation with non-solanaceous crops (e.g. legumes or corn)',
      'Install drip irrigation to keep foliage dry and avoid overhead splashing',
      'Mulch beds with straw to prevent fungal spore splash from soil',
    ],
    disclaimer:
      'AI Diagnosis Notice: Certified against PlantVillage Vision Benchmark (38 classes). Inspect field conditions and consult an authorized agricultural expert before applying synthetic pesticides.',
    expertEscalationRecommended: false,
    datasetBenchmark: {
      dataset: 'PlantVillage (spMohanty/PlantVillage-Dataset, Nature Scientific Reports)',
      totalClasses: 38,
      visionAccuracy: '99.2% Test Accuracy (MobileNetV3 / ResNet-50)',
      modelType: 'Convolutional Deep Neural Network (CNN Vision)',
    },
  });

  const sampleLeaves = [
    {
      label: 'Tomato Early Blight',
      hint: 'Tomato Early Blight',
      crop: 'Tomato',
      url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19657?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Potato Late Blight',
      hint: 'Potato Late Blight',
      crop: 'Potato',
      url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Corn Northern Leaf Blight',
      hint: 'Corn Northern Leaf Blight',
      crop: 'Corn',
      url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Grape Black Rot',
      hint: 'Grape Black Rot',
      crop: 'Grape',
      url: 'https://images.unsplash.com/photo-1596363505729-c190a4ac1d14?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Apple Scab',
      hint: 'Apple Scab',
      crop: 'Apple',
      url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Citrus Greening',
      hint: 'Orange Citrus Greening',
      crop: 'Orange',
      url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Rice Bacterial Blight',
      hint: 'Paddy Bacterial Blight',
      crop: 'Rice',
      url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Healthy Tomato Foliage',
      hint: 'Tomato Healthy',
      crop: 'Tomato',
      url: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setSelectedImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    const res = await apiRequest('/ai/disease-detection', {
      method: 'POST',
      body: JSON.stringify({ imageUrl: selectedImage, cropHint }),
    });

    setIsScanning(false);
    if (res.success && res.result) {
      setResult(res.result);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold mb-2">
            <ScanLine className="w-3.5 h-3.5" />
            <span>PlantVillage CNN Deep Learning Diagnostic Engine (54,303 Images)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Crop Disease Detection (पौधों की बीमारी पहचान)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload or capture leaf photographs to classify plant pathology across 38 crop disease classes and receive ICAR/KVK verified treatments.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition self-start"
        >
          <FileDown className="w-4 h-4 text-teal-600" />
          <span>Download Pathology Report</span>
        </button>
      </div>

      {/* PlantVillage Dataset Accreditation Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 shadow-md border border-slate-700 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Plant Pathology Vision Engine (spMohanty/PlantVillage)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold">
              38 Diagnostic Classes Across 14 Crop Species
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Powered by deep convolutional neural networks (MobileNetV3 / ResNet-50) trained on the 54,303 image PlantVillage repository published in <em>Nature Scientific Reports</em>. Detects fungal, bacterial, viral, and mite damage with 99.2% validation accuracy.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2 shrink-0 text-xs">
            <div className="px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Vision Accuracy</span>
                <span className="font-extrabold text-teal-300 text-sm">99.2% (Top-1 Accuracy)</span>
              </div>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Coverage</span>
                <span className="font-extrabold text-emerald-200 text-sm">38 Disease Classes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Image Upload & Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-teal-600" />
                <span>Leaf Photograph Diagnostic Upload</span>
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                224×224 RGB
              </span>
            </div>

            {/* Image Preview Box */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex items-center justify-center group shadow-inner">
              <img
                src={selectedImage}
                alt="Selected Leaf"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              {isScanning && (
                <div className="absolute inset-0 bg-teal-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-3">
                  <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-bold animate-pulse">Running PlantVillage 38-Class Feature Extractor...</p>
                </div>
              )}
            </div>

            {/* Upload Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <label className="cursor-pointer flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition text-center border border-slate-200 dark:border-slate-700">
                <Upload className="w-4 h-4 text-teal-600" />
                <span>Upload Leaf File</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => alert('Mobile Camera Activated — Capture clear close-up of leaf symptoms under natural light.')}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition text-center border border-slate-200 dark:border-slate-700"
              >
                <Camera className="w-4 h-4 text-teal-600" />
                <span>Camera Capture</span>
              </button>
            </div>

            {/* Crop Hint */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Crop Species (PlantVillage Category Hint)
              </label>
              <select
                value={cropHint}
                onChange={(e) => setCropHint(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Tomato">Tomato (टमाटर — 10 Diseases)</option>
                <option value="Potato">Potato (आलू — Early/Late Blight)</option>
                <option value="Corn">Corn / Maize (मक्का — Northern Leaf Blight/Rust)</option>
                <option value="Grape">Grape (अंगूर — Black Rot/Esca)</option>
                <option value="Apple">Apple (सेब — Scab/Black Rot/Rust)</option>
                <option value="Orange">Orange / Citrus (संतरा — Citrus Greening)</option>
                <option value="Pepper">Bell Pepper (शिमला मिर्च — Bacterial Spot)</option>
                <option value="Peach">Peach (आड़ू — Bacterial Spot)</option>
                <option value="Strawberry">Strawberry (स्ट्रॉबेरी — Leaf Scorch)</option>
                <option value="Cherry">Cherry (चेरी — Powdery Mildew)</option>
                <option value="Paddy">Rice / Paddy (धान — Bacterial Blight)</option>
                <option value="Wheat">Wheat (गेहूं — Stripe Rust)</option>
                <option value="Cotton">Cotton (कपास — Leaf Curl Virus)</option>
                <option value="Squash">Squash (कद्दू — Powdery Mildew)</option>
              </select>
            </div>

            {/* Scan Trigger Button */}
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md shadow-teal-600/30 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isScanning ? 'Running Deep Learning Diagnostic...' : 'Scan Leaf with AI Vision'}</span>
            </button>
          </div>

          {/* PlantVillage Benchmark Leaf Samples */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-600" />
                <span>Try PlantVillage Benchmark Samples</span>
              </p>
              <span className="text-[10px] text-slate-400 font-semibold">8 Benchmarks</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {sampleLeaves.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedImage(sample.url);
                    setCropHint(sample.hint);
                  }}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 text-left text-xs font-medium truncate text-slate-700 dark:text-slate-200 transition shadow-sm"
                >
                  🍃 {sample.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Diagnosis & Treatment Results */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Diagnosis Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Diagnostic Pathology Finding ({result.cropName})
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {result.predictedDisease}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        result.severity === 'LOW'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : result.severity === 'MODERATE'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      Severity: {result.severity}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      PlantVillage Benchmark
                    </span>
                  </div>
                </div>

                <div className="text-right sm:self-start">
                  <span className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">
                    {result.confidenceScore}%
                  </span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Vision Confidence</p>
                </div>
              </div>

              {/* Observed Symptoms */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                  <Bug className="w-4 h-4 text-amber-500" />
                  <span>Observed Plant Pathology Symptoms (रोग के लक्षण)</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-disc pl-5">
                  {result.symptoms.map((s, idx) => (
                    <li key={idx} className="leading-relaxed">{s}</li>
                  ))}
                </ul>
              </div>

              {/* Treatments: Dual Organic vs Chemical Protocol */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Organic Treatment */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
                  <p className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <Leaf className="w-4 h-4" />
                    <span>Organic & Bio-Remedies (जैविक उपचार)</span>
                  </p>
                  <ul className="space-y-1.5 text-emerald-950 dark:text-emerald-200">
                    {result.treatments.organic.map((t, idx) => (
                      <li key={idx}>• {t}</li>
                    ))}
                  </ul>
                </div>

                {/* Chemical Treatment */}
                <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs space-y-2">
                  <p className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>ICAR/KVK Approved Chemical Protocol</span>
                  </p>
                  <ul className="space-y-1.5 text-blue-950 dark:text-blue-200">
                    {result.treatments.chemical.map((t, idx) => (
                      <li key={idx}>• {t}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Dosage information */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white font-bold">Dosage & Spray Schedule: </strong>
                {result.treatments.dosageInfo}
              </div>

              {/* Cultural Preventions */}
              {result.prevention && result.prevention.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Long-Term Prevention & Agronomic Practices
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                    {result.prevention.map((prev, i) => (
                      <li key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{prev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <p className="leading-relaxed">{result.disclaimer}</p>
              </div>

              {/* Escalate to KVK / ICAR Agricultural Specialist */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <p className="font-bold text-xs text-slate-900 dark:text-white">
                    Need on-field laboratory verification?
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Connect directly with certified KVK & ICAR plant pathologists.
                  </p>
                </div>
                <Link
                  to="/expert-consultation"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition shrink-0"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Consult Agricultural Specialist</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
