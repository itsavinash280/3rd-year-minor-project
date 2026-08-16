import React, { useState, useEffect } from 'react';
import {
  Award,
  Search,
  ExternalLink,
  CheckCircle2,
  FileText,
  Building,
  ShieldCheck,
} from 'lucide-react';
import { apiRequest } from '../../api/client';
import { GovernmentScheme } from '../../types';

export const GovernmentSchemesPage: React.FC = () => {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const fallbackSchemes: GovernmentScheme[] = [
    {
      _id: 'sch-1',
      title: 'PM-KISAN Samman Nidhi Yojana',
      category: 'Financial Assistance',
      description:
        'Direct income support of ₹6,000 per year in three equal 4-monthly installments of ₹2,000 directly into bank accounts of eligible farmer families.',
      eligibility: [
        'All landholding farmer families having cultivable land in their names.',
        'Aadhaar mandatory linked with active DBT bank account.',
      ],
      benefits: '₹6,000 per year directly credited via PFMS Direct Benefit Transfer.',
      documentsRequired: ['Aadhaar Card', 'Land Ownership (Khatauni/Khasra)', 'Bank Passbook'],
      applicationUrl: 'https://pmkisan.gov.in',
      officialSource: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
      lastVerifiedDate: 'Aug 2026',
    },
    {
      _id: 'sch-2',
      title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      category: 'Crop Insurance',
      description:
        'Comprehensive crop insurance policy covering non-preventable natural risks from pre-sowing to post-harvest loss at extremely low farmer premium rates.',
      eligibility: [
        'All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.',
      ],
      benefits:
        'Max premium rate of only 2% for Kharif crops, 1.5% for Rabi crops, and 5% for Annual Commercial/Horticultural crops. Balance subsidized by Govt.',
      documentsRequired: ['Land Registry Document', 'Crop Sowing Certificate', 'Aadhaar Card', 'Bank Account details'],
      applicationUrl: 'https://pmfby.gov.in',
      officialSource: 'PMFBY Portal, Govt of India',
      lastVerifiedDate: 'Aug 2026',
    },
    {
      _id: 'sch-3',
      title: 'Kisan Credit Card (KCC) Scheme',
      category: 'Credit & Loans',
      description:
        'Subsidized institutional credit for agricultural operations, farm maintenance, and post-harvest liquidity without collateral up to ₹1.6 Lakhs.',
      eligibility: [
        'All farmers, individual or joint borrowers, tenant farmers, and Self Help Groups (SHGs).',
      ],
      benefits:
        'Effective concessional interest rate of 4% per annum (upon timely loan repayment with 3% prompt repayment incentive).',
      documentsRequired: ['KCC Application Form', 'Land Records', 'Identity & Address Proof'],
      applicationUrl: 'https://www.myscheme.gov.in/schemes/kcc',
      officialSource: 'Reserve Bank of India & NABARD',
      lastVerifiedDate: 'Aug 2026',
    },
    {
      _id: 'sch-4',
      title: 'Soil Health Card Scheme (मृदा स्वास्थ्य कार्ड)',
      category: 'Soil & Fertility',
      description:
        'Issues comprehensive soil test reports detailing 12 critical nutrients and customized dosage recommendations for every individual farm plot.',
      eligibility: ['Open for all farmers in India across all states.'],
      benefits: 'Free testing of N, P, K, Sulfur, Zinc, Iron, pH, and Organic Carbon every 2 years.',
      documentsRequired: ['Aadhaar Card', 'Soil Sample details'],
      applicationUrl: 'https://soilhealth.dac.gov.in',
      officialSource: 'Department of Agriculture & Cooperation',
      lastVerifiedDate: 'Aug 2026',
    },
  ];

  useEffect(() => {
    apiRequest('/schemes').then((res) => {
      if (res.success && res.schemes && res.schemes.length > 0) {
        setSchemes(res.schemes);
      } else {
        setSchemes(fallbackSchemes);
      }
    });
  }, []);

  const categories = ['ALL', 'Financial Assistance', 'Crop Insurance', 'Credit & Loans', 'Soil & Fertility'];

  const filteredSchemes = schemes.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>Verified Government of India Schemes</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Government Schemes & Subsidies (सरकारी योजनाएं)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore direct income support, low-interest crop credit, weather insurance, and soil health subsidies.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-2.5">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search schemes (e.g. PM-KISAN, Crop Insurance, KCC)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme._id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between hover:border-amber-500 transition space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  {scheme.category}
                </span>
                <span className="text-[10px] text-slate-400">Verified: {scheme.lastVerifiedDate || '2026'}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {scheme.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {scheme.description}
              </p>

              {/* Benefits highlight */}
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                <span className="font-bold text-emerald-800 dark:text-emerald-300">Key Benefits: </span>
                <span className="text-slate-700 dark:text-slate-300">{scheme.benefits}</span>
              </div>

              {/* Eligibility */}
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">Eligibility Criteria:</span>
                <ul className="text-slate-500 dark:text-slate-400 space-y-0.5 list-disc pl-4">
                  {scheme.eligibility.map((el, i) => (
                    <li key={i}>{el}</li>
                  ))}
                </ul>
              </div>

              {/* Documents Required */}
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">Required Documents:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {scheme.documentsRequired.map((doc, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium"
                    >
                      📄 {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 truncate max-w-[200px]">{scheme.officialSource}</span>
              <a
                href={scheme.applicationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition shrink-0"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
