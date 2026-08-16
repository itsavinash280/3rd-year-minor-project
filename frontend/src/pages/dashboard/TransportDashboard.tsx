import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  CheckCircle,
  Clock,
  Phone,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TransportDashboard: React.FC = () => {
  const { user } = useAuth();

  const [deliveries, setDeliveries] = useState([
    {
      id: 'DEL-901',
      orderNumber: 'KS-TRK-849201',
      crop: 'Sharbati Wheat (20 Quintals)',
      pickup: 'Malihabad Farmers Hub, Gate #4, Lucknow',
      drop: 'Wholesale Mandi Complex, Road #3, Lucknow',
      buyerPhone: '+91 98765 00010',
      farmerPhone: '+91 98765 00100',
      vehicle: 'Eicher 10.50 (UP-32-AB-9876)',
      status: 'OUT_FOR_DELIVERY',
    },
    {
      id: 'DEL-902',
      orderNumber: 'KS-TRK-719302',
      crop: 'Basmati Paddy (15 Quintals)',
      pickup: 'Kalyanpur Farm Gate, Kanpur',
      drop: 'Plot 88, APMC Yard, Kanpur',
      buyerPhone: '+91 98765 00011',
      farmerPhone: '+91 98765 00101',
      vehicle: 'Tata 407 Agro Hauler (UP-78-CD-1234)',
      status: 'DELIVERED',
    },
  ]);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setDeliveries(
      deliveries.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
    alert(`Delivery status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
            Logistics & Freight Operator Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Welcome, {user?.name || 'Kisaan Express Logistics'}! 🚚
          </h1>
          <p className="text-xs text-slate-300">
            Manage farm-to-mandi agricultural freight dispatches and update real-time status.
          </p>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="space-y-4">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <Truck className="w-5 h-5 text-agro-600" />
          <span>Assigned Transport Shipments ({deliveries.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deliveries.map((d) => (
            <div
              key={d.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="font-mono text-xs font-bold text-slate-400">{d.orderNumber}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      d.status === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    }`}
                  >
                    {d.status}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white">{d.crop}</h3>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Pickup:</strong> {d.pickup}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Drop:</strong> {d.drop}</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-500">
                    <Truck className="w-4 h-4 text-slate-400" />
                    <span>Vehicle: {d.vehicle}</span>
                  </p>
                </div>
              </div>

              {/* Status Update Action */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  <a
                    href={`tel:${d.buyerPhone}`}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition"
                    title="Call Buyer"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

                {d.status !== 'DELIVERED' ? (
                  <button
                    onClick={() => handleUpdateStatus(d.id, 'DELIVERED')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Mark Delivered</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-600">✓ Trip Completed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
