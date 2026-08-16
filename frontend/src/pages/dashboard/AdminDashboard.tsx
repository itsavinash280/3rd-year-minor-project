import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  ShoppingBag,
  Package,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { apiRequest } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({
    totalUsers: 22,
    farmersCount: 10,
    buyersCount: 5,
    expertsCount: 3,
    transportCount: 3,
    totalListings: 20,
    totalOrders: 10,
    totalRevenue: 148500,
    totalAiDiseaseScans: 48,
    totalAiRecommendations: 62,
    pendingComplaints: 1,
  });

  const chartData = [
    { name: 'Mon', orders: 12, aiScans: 24, revenue: 28000 },
    { name: 'Tue', orders: 19, aiScans: 35, revenue: 42000 },
    { name: 'Wed', orders: 15, aiScans: 40, revenue: 35000 },
    { name: 'Thu', orders: 22, aiScans: 48, revenue: 58000 },
    { name: 'Fri', orders: 28, aiScans: 55, revenue: 64000 },
    { name: 'Sat', orders: 34, aiScans: 68, revenue: 89000 },
    { name: 'Sun', orders: 40, aiScans: 72, revenue: 95000 },
  ];

  const userList = [
    { id: '1', name: 'Ramashankar Yadav', role: 'FARMER', email: 'farmer1@asraverse.in', status: 'ACTIVE' },
    { id: '2', name: 'Dr. Anita Verma', role: 'EXPERT', email: 'anita.verma@kvk.org.in', status: 'ACTIVE' },
    { id: '3', name: 'Organic Harvest Wholesalers', role: 'BUYER', email: 'buyer.organic@harvest.com', status: 'ACTIVE' },
    { id: '4', name: 'Kisaan Express Logistics', role: 'TRANSPORT', email: 'logistics.ramesh@express.in', status: 'ACTIVE' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Platform Operations & Compliance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            National Agricultural Administration Center
          </h1>
          <p className="text-xs text-slate-300">
            Monitor AI model throughput, transaction volumes, user compliance, and dispute resolution.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Registered Users</p>
          <p className="text-xl font-black text-slate-900 dark:text-white">{stats.totalUsers}</p>
          <p className="text-[10px] text-agro-600 font-semibold">{stats.farmersCount} Farmers</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Active Listings</p>
          <p className="text-xl font-black text-slate-900 dark:text-white">{stats.totalListings}</p>
          <p className="text-[10px] text-slate-400">Verified Mandi</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Total Revenue</p>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-emerald-600 font-semibold">100% Escrow Cleared</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">AI Disease Scans</p>
          <p className="text-xl font-black text-teal-600 dark:text-teal-400">{stats.totalAiDiseaseScans}</p>
          <p className="text-[10px] text-teal-600 font-semibold">96.4% Accuracy</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">AI Crop Recs</p>
          <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{stats.totalAiRecommendations}</p>
          <p className="text-[10px] text-slate-400">Explainable ML</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Complaints</p>
          <p className="text-xl font-black text-amber-500">{stats.pendingComplaints}</p>
          <p className="text-[10px] text-slate-400">Pending Review</p>
        </div>
      </div>

      {/* Analytics Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">Weekly Platform AI & Transaction Activity</h2>
              <p className="text-xs text-slate-500">Comparing total orders placed vs automated AI diagnostics run</p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="aiScans" name="AI Disease Scans" fill="#0d9488" radius={[6, 6, 0, 0]} />
                <Bar dataKey="orders" name="Marketplace Orders" fill="#16a34a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health */}
        <div className="lg:col-span-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <span>Core Microservices Health</span>
          </h2>

          <div className="space-y-3 text-xs">
            {[
              { name: 'Crop Recommendation Engine', status: 'Operational', latency: '42ms' },
              { name: 'CNN Leaf Disease Classifier', status: 'Operational', latency: '120ms' },
              { name: 'ARIMA Mandi Price Forecaster', status: 'Operational', latency: '65ms' },
              { name: 'Multilingual Speech Processor', status: 'Operational', latency: '80ms' },
              { name: 'IMD Agromet Advisory Sync', status: 'Operational', latency: '110ms' },
              { name: 'Razorpay Escrow Gateway', status: 'Operational', latency: '95ms' },
            ].map((srv, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between font-medium"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{srv.name}</p>
                  <p className="text-[10px] text-slate-400">{srv.latency} latency</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {srv.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-base text-slate-900 dark:text-white">Platform Users & RBAC Accounts</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">User Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">Compliance Status</th>
                <th className="p-3.5 rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {userList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{u.name}</td>
                  <td className="p-3.5 text-slate-500">{u.email}</td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-agro-100 dark:bg-agro-950 text-agro-800 dark:text-agro-300">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5 text-emerald-600 font-bold">✓ {u.status}</td>
                  <td className="p-3.5">
                    <button
                      onClick={() => alert(`Status toggled for ${u.name}`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-[11px] transition"
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
