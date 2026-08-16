import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquareHeart,
  Send,
  Leaf,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ExpertDashboard: React.FC = () => {
  const { user } = useAuth();

  const [pendingCases, setPendingCases] = useState([
    {
      id: 'case-1',
      farmer: 'Ramashankar Yadav',
      location: 'Malihabad, Lucknow',
      crop: 'Tomato (Pusa Ruby)',
      query: 'Concentric brown rings on lower foliage. AI diagnosed Early Blight (94%). Should I spray Mancozeb or Copper Oxychloride?',
      aiDiagnosis: 'Tomato Early Blight (Alternaria solani) — 94.2% Confidence',
      status: 'PENDING_REVIEW',
    },
    {
      id: 'case-2',
      farmer: 'Baldev Singh',
      location: 'Kalyanpur, Kanpur',
      crop: 'Basmati Paddy',
      query: 'Leaves margins turn grayish-white and dry prematurely. Need confirmation on Streptocycline dosage per acre.',
      aiDiagnosis: 'Bacterial Leaf Blight (Xanthomonas oryzae) — 91.8% Confidence',
      status: 'PENDING_REVIEW',
    },
  ]);

  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const handleSendResponse = (caseId: string) => {
    alert(`Expert response submitted to Farmer! Verification badge updated.`);
    setPendingCases(pendingCases.filter((c) => c.id !== caseId));
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Agricultural Specialist Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Welcome, {user?.name || 'Dr. Anita Verma (Agronomist)'}!
          </h1>
          <p className="text-xs text-slate-300">
            Review AI plant pathology diagnoses, answer farmers' queries, and verify chemical/organic treatment guidelines.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Pending Farmer Questions</p>
          <p className="text-2xl font-black text-amber-500">{pendingCases.length} Cases</p>
          <p className="text-slate-500 text-[11px]">Average SLA: &lt; 2 Hours</p>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">AI Disease Verifications</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">482 Cases Verified</p>
          <p className="text-slate-500 text-[11px]">Model Accuracy Validated: 96.4%</p>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Specialist Rating</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">4.9 ★</p>
          <p className="text-emerald-600 font-bold text-[11px]">Top Agronomist in UP Region</p>
        </div>
      </div>

      {/* Review Queue */}
      <div className="space-y-4">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquareHeart className="w-5 h-5 text-emerald-600" />
          <span>Pending Farmer Consultation Queue ({pendingCases.length})</span>
        </h2>

        {pendingCases.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {item.location} • {item.crop}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                  Farmer: {item.farmer}
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Action Required
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <span className="font-bold text-slate-900 dark:text-white">Farmer Query: </span>
              {item.query}
            </div>

            <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
              <span>
                <strong className="font-bold">Automated AI Detection:</strong> {item.aiDiagnosis}
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Specialist Prescription & Advisory Response:
              </label>
              <textarea
                rows={3}
                placeholder="Write chemical/organic dosage, timing, and agricultural verification notes for this farmer..."
                value={replyText[item.id] || ''}
                onChange={(e) => setReplyText({ ...replyText, [item.id]: e.target.value })}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-agro-500"
              />
              <button
                onClick={() => handleSendResponse(item.id)}
                className="px-5 py-2.5 rounded-xl bg-agro-600 hover:bg-agro-700 text-white font-bold text-xs shadow transition flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Verify AI & Send Prescription</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
