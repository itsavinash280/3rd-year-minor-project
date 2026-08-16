import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Package,
  TrendingUp,
  ShieldCheck,
  Search,
  Star,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Buyer Procurement Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Welcome, {user?.name || 'Agro Wholesale Buyer'}! 🌾
            </h1>
            <p className="text-xs text-slate-300">
              Procure wholesale grade commodities direct from 10,000+ verified Indian farm gates.
            </p>
          </div>

          <Link
            to="/marketplace"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs shadow transition self-start"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Search Produce Mandi</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Total Orders Placed</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">18 Shipments</p>
          <p className="text-emerald-600 font-bold text-[11px]">100% On-Time Delivery</p>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Active In-Transit Freight</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">2 Deliveries</p>
          <p className="text-blue-600 font-bold text-[11px]">Arriving today by 6:00 PM</p>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Total Procurement Value</p>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">₹8,45,200</p>
          <p className="text-slate-400 font-medium text-[11px]">Direct Escrow protected</p>
        </div>
      </div>

      {/* Recommended Bulk Listings */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-slate-900 dark:text-white">
            Recommended High-Demand Batches
          </h2>
          <Link to="/marketplace" className="text-xs font-bold text-agro-600 hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {[
            { title: 'Sharbati Wheat HD-2967', seller: 'Ramashankar Yadav (Lucknow)', qty: '150 Qtl', price: '₹2,350 / Qtl', img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80' },
            { title: 'Basmati Paddy 1121', seller: 'Baldev Singh (Kanpur)', qty: '220 Qtl', price: '₹3,400 / Qtl', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' },
            { title: 'Yellow Mustard Seeds', seller: 'Harish Chandra (Rae Bareli)', qty: '80 Qtl', price: '₹5,800 / Qtl', img: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between space-y-3">
              <div className="flex gap-3">
                <img src={item.img} alt={item.title} className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-slate-500 text-[11px]">{item.seller}</p>
                  <p className="font-bold text-agro-600 mt-1">{item.price}</p>
                </div>
              </div>
              <Link
                to="/marketplace"
                className="w-full py-2 text-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition"
              >
                Procure Batch
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
