import React from 'react';
import { Sprout, Phone, Mail, ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-agro-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span>AsraVerse AI</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Empowering 140M+ Indian farmers with artificial intelligence for crop yields, leaf disease detection, fair mandi prices, and direct marketplace trade.
            </p>
          </div>

          {/* Col 2: AI Capabilities */}
          <div className="space-y-2">
            <p className="text-white font-semibold text-sm">AI Capabilities</p>
            <ul className="space-y-1.5">
              <li>• Soil & Climate Crop Recommender</li>
              <li>• CNN Leaf Disease Diagnostics</li>
              <li>• Time-Series Mandi Price Forecasting</li>
              <li>• Multilingual Speech Assistant (Hindi/Hinglish)</li>
              <li>• Weather Agromet Advisory</li>
            </ul>
          </div>

          {/* Col 3: Key Portals */}
          <div className="space-y-2">
            <p className="text-white font-semibold text-sm">Staff & Partner Portals</p>
            <ul className="space-y-1.5">
              <li>
                <a href="/admin/login" className="hover:text-rose-400 flex items-center gap-1">
                  🏛️ Platform Admin Portal
                </a>
              </li>
              <li>
                <a href="/expert/login" className="hover:text-indigo-400 flex items-center gap-1">
                  🔬 ICAR / KVK Expert Workspace
                </a>
              </li>
              <li>
                <a href="/transport/login" className="hover:text-amber-400 flex items-center gap-1">
                  🚚 Logistics & Transport Fleet
                </a>
              </li>
              <li>
                <a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1 text-[11px] text-slate-400 pt-1">
                  PM-KISAN Samman Nidhi <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Emergency */}
          <div className="space-y-2">
            <p className="text-white font-semibold text-sm">Contact & Support</p>
            <div className="space-y-1.5">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Kisan Helpline: 1800-180-1551</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>support@asraverse.ai</span>
              </p>
              <p className="flex items-center gap-2 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Encrypted & Aadhaar Data Protected</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 AsraVerse AI Platform. Dedicated to the farmers of Bharat (India).</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-400">Terms of Service</a>
            <a href="#disclaimer" className="hover:text-slate-400">AI Medical Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
