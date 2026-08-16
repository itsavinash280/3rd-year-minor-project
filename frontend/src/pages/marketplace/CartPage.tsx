import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, discount, total, applyCoupon, appliedCoupon } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    const res = await applyCoupon(couponCode);
    setCouponMessage(res.message);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-4 animate-in fade-in">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Agricultural Cart is Empty</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Explore fresh grains, certified seeds, pulses, and organic vegetables direct from Indian farmers.
        </p>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-agro-600 hover:bg-agro-700 text-white font-bold text-sm shadow-md transition"
        >
          <span>Browse Marketplace</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Shopping Cart ({cart.length} Commodities)
          </h1>
          <p className="text-sm text-slate-500 mt-1">Review produce quantities and apply agricultural discount coupons</p>
        </div>
        <Link to="/marketplace" className="text-xs font-bold text-agro-600 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.listing._id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col sm:flex-row items-center gap-5 justify-between"
            >
              <img
                src={item.listing.images[0] || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80'}
                alt={item.listing.title}
                className="w-24 h-24 rounded-2xl object-cover shrink-0"
              />

              <div className="flex-1 space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-agro-600 bg-agro-50 dark:bg-agro-950 px-2 py-0.5 rounded">
                  {item.listing.cropCategory}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{item.listing.title}</h3>
                <p className="text-xs text-slate-500">
                  Rate: ₹{item.listing.pricePerUnit} / {item.listing.unit}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 text-xs">
                  <button
                    onClick={() => updateQuantity(item.listing._id, item.quantity - 1)}
                    className="px-3 py-1.5 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 font-bold text-slate-900 dark:text-white">
                    {item.quantity} {item.listing.unit}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.listing._id, item.quantity + 1)}
                    className="px-3 py-1.5 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[90px]">
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                    ₹{item.listing.pricePerUnit * item.quantity}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.listing._id)}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Order Summary</h3>

            {/* Coupon Box */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Apply Kisan Coupon
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. KRISHI10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {couponMessage}
                </p>
              )}
            </form>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span>Commodities Subtotal</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Coupon Discount ({appliedCoupon})</span>
                  <span>- ₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Mandi Cess & Platform Fee</span>
                <span className="text-emerald-600 font-bold">FREE (0%)</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Estimated Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 rounded-2xl bg-agro-600 hover:bg-agro-700 text-white font-bold text-sm shadow-md shadow-agro-600/30 transition flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
