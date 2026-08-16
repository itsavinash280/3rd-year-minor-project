import React, { useState, useEffect } from 'react';
import {
  User,
  Save,
  ShieldCheck,
  MapPin,
  Sprout,
  Droplets,
  Award,
  Lock,
  CheckCircle,
} from 'lucide-react';
import { apiRequest } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { FarmerProfile } from '../../types';

export const FarmerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<FarmerProfile>({
    userId: user?.id || 'demo-1',
    farmName: `${user?.name || 'Ramashankar'}'s Krishi Farm`,
    farmSize: 5,
    sizeUnit: 'ACRES',
    soilType: 'ALLUVIAL',
    soilPh: 6.8,
    nitrogen: 140,
    phosphorus: 45,
    potassium: 40,
    irrigationMethod: 'CANAL',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    village: 'Malihabad',
    pincode: '226101',
    cropsGrown: ['Wheat', 'Paddy', 'Mustard', 'Tomato'],
    farmingExperienceYears: 8,
    aadhaarMasked: 'XXXX-XXXX-9876',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    apiRequest('/farms').then((res) => {
      if (res.success && res.profile) {
        setProfile(res.profile);
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await apiRequest('/farms', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
    setIsSaving(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Farm & Kisan Profile (कृषि फार्म प्रोफाइल)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your farm location, soil profile, and verified agricultural credentials.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal & Farm Identity Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-agro-600" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">Farm & Land Identity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Farm Name (खेत का नाम)
              </label>
              <input
                type="text"
                required
                value={profile.farmName}
                onChange={(e) => setProfile({ ...profile, farmName: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Farm Size
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={profile.farmSize}
                  onChange={(e) => setProfile({ ...profile, farmSize: parseFloat(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit</label>
                <select
                  value={profile.sizeUnit}
                  onChange={(e) => setProfile({ ...profile, sizeUnit: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 font-medium"
                >
                  <option value="ACRES">Acres</option>
                  <option value="HECTARES">Hectares</option>
                  <option value="BIGHA">Bigha</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Village</label>
              <input
                type="text"
                value={profile.village}
                onChange={(e) => setProfile({ ...profile, village: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">District</label>
              <input
                type="text"
                value={profile.district}
                onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">State</label>
              <input
                type="text"
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Pincode</label>
              <input
                type="text"
                value={profile.pincode}
                onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Soil & Agronomy Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-agro-600" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">Soil & Irrigation Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Soil Type (मृदा प्रकार)
              </label>
              <select
                value={profile.soilType}
                onChange={(e) => setProfile({ ...profile, soilType: e.target.value as any })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2"
              >
                <option value="ALLUVIAL">Alluvial Soil (जलोढ़ मिट्टी)</option>
                <option value="BLACK">Black Cotton Soil (काली मिट्टी)</option>
                <option value="RED">Red Soil (लाल मिट्टी)</option>
                <option value="CLAY">Clay Soil (चिकनी मिट्टी)</option>
                <option value="LOAM">Loam Soil (दोमट मिट्टी)</option>
                <option value="SANDY">Sandy Soil (बलुई मिट्टी)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Irrigation System
              </label>
              <select
                value={profile.irrigationMethod}
                onChange={(e) => setProfile({ ...profile, irrigationMethod: e.target.value as any })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2"
              >
                <option value="CANAL">Canal Irrigation (नहर)</option>
                <option value="BOREWELL">Borewell Tubewell (नलकूप)</option>
                <option value="DRIP">Drip Irrigation (ड्रिप)</option>
                <option value="SPRINKLER">Sprinkler (फव्वारा)</option>
                <option value="RAIN">Rainfed Only (वर्षा आधारित)</option>
              </select>
            </div>
          </div>

          {/* Masked Aadhaar Info (FR-012) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Masked Aadhaar Verification Status (FR-012)</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Verified UIDAI
              </span>
            </div>
            <p className="font-mono text-sm text-slate-600 dark:text-slate-300">
              {profile.aadhaarMasked || 'XXXX-XXXX-9876'}
            </p>
            <p className="text-[11px] text-slate-400">
              Your Aadhaar is protected in compliance with UIDAI security regulations and masked for privacy.
            </p>
          </div>
        </div>

        {/* Action Button & Confirmation */}
        <div className="flex items-center justify-between pt-2">
          {savedMessage ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-pulse">
              <CheckCircle className="w-4 h-4" />
              <span>Farm Profile successfully updated in database!</span>
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-agro-600 hover:bg-agro-700 text-white font-bold text-sm shadow-md shadow-agro-600/30 transition"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
