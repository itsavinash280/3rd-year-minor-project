import React, { useState, useEffect } from 'react';
import {
  Users,
  Send,
  Sparkles,
  MessageSquare,
  CheckCircle,
  Star,
  ShieldCheck,
  Camera,
} from 'lucide-react';
import { apiRequest } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { ExpertConsultation } from '../../types';

export const ExpertConsultationPage: React.FC = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<ExpertConsultation[]>([]);
  const [selectedExpert, setSelectedExpert] = useState('Dr. Anita Verma (Agronomist)');
  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fallbackConsultations: ExpertConsultation[] = [
    {
      _id: 'c-1',
      farmerId: { id: 'u-1', name: 'Ramashankar Yadav', email: 'farmer1@asraverse.in', phone: '+91 98765 00100', role: 'FARMER', isVerified: true },
      expertId: { id: 'e-1', name: 'Dr. Anita Verma (KVK Agronomist)', email: 'anita.verma@kvk.org.in', phone: '+91 98765 00002', role: 'EXPERT', isVerified: true },
      subject: 'Yellow Spots on Tomato Leaves during Monsoon',
      question:
        'Namaste Madam. My Tomato plants are showing dark concentric circles on the lower leaves. AI detected Early Blight. Can I use Neem Oil with Mancozeb spray together?',
      images: ['https://images.unsplash.com/photo-1592417817098-8f3d6eb19657?auto=format&fit=crop&w=800&q=80'],
      response:
        'Namaste Ramashankar Ji. Yes, the AI diagnosis of Alternaria solani (Early Blight) is accurate. Avoid mixing Neem oil and chemical fungicides simultaneously in the same tank. First, spray Mancozeb 75% WP @ 2g/L. After 7 days, follow up with 10,000 ppm Neem Oil spray @ 5ml/L as maintenance. Also prune lower infected foliage.',
      status: 'ANSWERED',
      createdAt: '2026-08-15T09:00:00.000Z',
    },
  ];

  const expertsList = [
    { name: 'Dr. Anita Verma', role: 'Principal Agronomist (KVK Lucknow)', rating: 4.9, cases: 480, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' },
    { name: 'Prof. Rajesh Kumar', role: 'Plant Pathologist (NAU)', rating: 4.8, cases: 620, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80' },
    { name: 'Dr. Suresh Patel', role: 'Soil Scientist (ICAR)', rating: 4.9, cases: 390, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80' },
  ];

  useEffect(() => {
    apiRequest('/experts/consultations').then((res) => {
      if (res.success && res.consultations && res.consultations.length > 0) {
        setConsultations(res.consultations);
      } else {
        setConsultations(fallbackConsultations);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsSubmitting(true);
    const res = await apiRequest('/experts/consultations', {
      method: 'POST',
      body: JSON.stringify({ subject: subject || 'Crop Consultation', question }),
    });

    setIsSubmitting(false);

    const newEntry: ExpertConsultation = {
      _id: 'c-' + Date.now(),
      farmerId: { id: user?.id || 'u-1', name: user?.name || 'Kisan Bhai', email: user?.email || '', phone: user?.phone || '', role: 'FARMER', isVerified: true },
      subject: subject || 'General Agronomy Consultation',
      question,
      images: [],
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };

    setConsultations([newEntry, ...consultations]);
    setSubject('');
    setQuestion('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agro-100 dark:bg-agro-950 text-agro-800 dark:text-agro-300 text-xs font-bold mb-2">
          <Users className="w-3.5 h-3.5" />
          <span>ICAR & KVK Certified Agricultural Specialists</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Expert Consultation (कृषि विशेषज्ञ परामर्श)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Direct consultation with certified agricultural scientists, plant pathologists, and soil agronomists.
        </p>
      </div>

      {/* Verified Experts Roster */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {expertsList.map((exp, i) => (
          <div
            key={i}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:border-agro-500 transition"
          >
            <img src={exp.avatar} alt={exp.name} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
            <div className="space-y-0.5">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{exp.name}</h3>
              <p className="text-xs text-slate-500 leading-tight">{exp.role}</p>
              <div className="flex items-center gap-2 text-[11px] text-amber-500 font-bold pt-1">
                <span className="flex items-center gap-0.5">★ {exp.rating}</span>
                <span className="text-slate-400 font-normal">({exp.cases} cases answered)</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Ask Question Form */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-agro-600" />
            <span>Submit Consultation Query</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject (विषय)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Pest control dosage for Paddy crop"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Detailed Question (अपना प्रश्न विस्तार से लिखें)
              </label>
              <textarea
                rows={5}
                required
                placeholder="Describe your crop condition, soil type, symptoms observed, and any fertilizer already applied..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-agro-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-agro-600 hover:bg-agro-700 text-white font-bold text-sm shadow-md shadow-agro-600/30 transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Sending Request...' : 'Submit to Specialist'}</span>
            </button>
          </form>
        </div>

        {/* Right: Consultation Q&A History */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-bold text-base text-slate-900 dark:text-white">Recent Consultation Cases</h2>

          {consultations.map((item) => (
            <div
              key={item._id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Farmer: {item.farmerId?.name || 'Kisan User'}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                    {item.subject}
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    item.status === 'ANSWERED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* Farmer Question */}
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl">
                ❓ {item.question}
              </p>

              {/* Expert Response */}
              {item.response && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
                  <div className="flex items-center justify-between text-emerald-900 dark:text-emerald-200 font-bold">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Specialist Recommendation ({typeof item.expertId === 'object' ? item.expertId.name : 'Dr. Anita Verma'})
                    </span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{item.response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
