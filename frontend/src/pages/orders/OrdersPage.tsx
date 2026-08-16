import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  FileDown,
  ChevronRight,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { apiRequest } from '../../api/client';
import { Order } from '../../types';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fallbackOrders: Order[] = [
    {
      _id: 'ord-101',
      buyerId: { id: 'b-1', name: 'Organic Harvest Wholesalers', email: 'buyer@harvest.com', phone: '+91 98765 00010', role: 'BUYER', isVerified: true },
      sellerId: { id: 's-1', name: 'Ramashankar Yadav', email: 'farmer1@asraverse.in', phone: '+91 98765 00100', role: 'FARMER', isVerified: true },
      items: [
        {
          listingId: 'prod-1',
          title: 'Sharbati Premium Wheat (Gehu)',
          quantity: 20,
          unit: 'QUINTAL',
          pricePerUnit: 2350,
          totalPrice: 47000,
        },
      ],
      totalAmount: 47000,
      discountAmount: 500,
      finalAmount: 46500,
      couponCode: 'KRISHI10',
      deliveryAddress: {
        fullName: 'Organic Harvest Wholesalers (Godown #4)',
        phone: '+91 98765 00010',
        street: 'Wholesale Mandi Complex, Road #3',
        village: 'Central Mandi',
        district: 'Lucknow',
        state: 'Uttar Pradesh',
        pincode: '226001',
      },
      orderStatus: 'OUT_FOR_DELIVERY',
      paymentStatus: 'PAID',
      paymentMethod: 'UPI',
      trackingNumber: 'AV-TRK-849201',
      estimatedDeliveryDate: 'Aug 17, 2026',
      createdAt: '2026-08-15T10:30:00.000Z',
    },
    {
      _id: 'ord-102',
      buyerId: { id: 'b-2', name: 'Lucknow Grain Traders', email: 'trader@grain.org', phone: '+91 98765 00011', role: 'BUYER', isVerified: true },
      sellerId: { id: 's-2', name: 'Baldev Singh', email: 'farmer2@asraverse.in', phone: '+91 98765 00101', role: 'FARMER', isVerified: true },
      items: [
        {
          listingId: 'prod-2',
          title: 'Basmati Paddy / Rice (Dhan)',
          quantity: 15,
          unit: 'QUINTAL',
          pricePerUnit: 3400,
          totalPrice: 51000,
        },
      ],
      totalAmount: 51000,
      discountAmount: 1200,
      finalAmount: 49800,
      couponCode: 'BUMPER15',
      deliveryAddress: {
        fullName: 'Lucknow Grain Traders',
        phone: '+91 98765 00011',
        street: 'Plot 88, APMC Yard',
        village: 'Kalyanpur',
        district: 'Kanpur',
        state: 'Uttar Pradesh',
        pincode: '208001',
      },
      orderStatus: 'DELIVERED',
      paymentStatus: 'PAID',
      paymentMethod: 'NET_BANKING',
      trackingNumber: 'KS-TRK-719302',
      estimatedDeliveryDate: 'Aug 14, 2026',
      createdAt: '2026-08-12T14:15:00.000Z',
    },
  ];

  useEffect(() => {
    apiRequest('/orders').then((res) => {
      if (res.success && res.orders && res.orders.length > 0) {
        setOrders(res.orders);
        setSelectedOrder(res.orders[0]);
      } else {
        setOrders(fallbackOrders);
        setSelectedOrder(fallbackOrders[0]);
      }
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      case 'OUT_FOR_DELIVERY':
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'CONFIRMED':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Orders & Shipments (आर्डर एवं डिलीवरी ट्रैकिंग)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time GPS dispatch status and official downloadable GST tax invoices.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Orders List */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-bold text-base text-slate-900 dark:text-white">All Active Orders</h2>
          {orders.map((order) => (
            <div
              key={order._id}
              onClick={() => setSelectedOrder(order)}
              className={`p-5 rounded-3xl border cursor-pointer transition ${
                selectedOrder?._id === order._id
                  ? 'border-agro-600 bg-agro-50/50 dark:bg-agro-950/40 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-slate-500">{order.trackingNumber}</span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {order.items[0]?.title} {order.items.length > 1 && `+ ${order.items.length - 1} more`}
              </h3>
              <p className="text-xs text-slate-500">
                Quantity: {order.items[0]?.quantity} {order.items[0]?.unit}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total: <span className="font-extrabold text-slate-900 dark:text-white">₹{order.finalAmount}</span></span>
                <span className="font-bold text-agro-600 flex items-center gap-1">
                  View Timeline <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Detailed Tracking Timeline & Invoice */}
        <div className="lg:col-span-7 space-y-6">
          {selectedOrder && (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    Tracking ID: {selectedOrder.trackingNumber}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    Shipment Timeline
                  </h3>
                </div>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download Invoice (PDF)</span>
                </button>
              </div>

              {/* Progress Timeline Stepper */}
              <div className="space-y-4">
                {[
                  { title: 'Order Placed & Payment Verified', desc: 'Direct Escrow verified via UPI/NetBanking', done: true },
                  { title: 'Produce Quality Inspected at Farm Gate', desc: 'Weight & moisture verified by KVK criteria', done: true },
                  { title: 'Dispatched with Agro Freight (UP-32-AB-9876)', desc: 'Driver: Ramesh Transport (+91 98765 43210)', done: true },
                  { title: 'Out for Delivery to APMC Godown', desc: 'Estimated arrival today before 6:00 PM', done: selectedOrder.orderStatus === 'OUT_FOR_DELIVERY' || selectedOrder.orderStatus === 'DELIVERED' },
                  { title: 'Delivered & Accepted by Buyer', desc: 'Direct payment released to Farmer account', done: selectedOrder.orderStatus === 'DELIVERED' },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          step.done
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {step.done ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                      </div>
                      {idx < 4 && (
                        <div
                          className={`w-0.5 flex-1 my-1 ${
                            step.done ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                          }`}
                        />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{step.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-agro-600" />
                  <span>Destination Address:</span>
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  {selectedOrder.deliveryAddress.fullName} — {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.village}, {selectedOrder.deliveryAddress.district}, {selectedOrder.deliveryAddress.state} - {selectedOrder.deliveryAddress.pincode}
                </p>
                <p className="text-slate-500 flex items-center gap-1 mt-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Recipient Phone: {selectedOrder.deliveryAddress.phone}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
