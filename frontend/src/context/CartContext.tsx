import React, { createContext, useContext, useState, useEffect } from 'react';
import { CropListing } from '../types';

export interface CartItemType {
  listing: CropListing;
  quantity: number;
}

interface CartContextType {
  cart: CartItemType[];
  cartCount: number;
  subtotal: number;
  discount: number;
  appliedCoupon: string | null;
  total: number;
  addToCart: (listing: CropListing, qty?: number) => void;
  removeFromCart: (listingId: string) => void;
  updateQuantity: (listingId: string, qty: number) => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItemType[]>(() => {
    const saved = localStorage.getItem('asraverse_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [discount, setDiscount] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('asraverse_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (listing: CropListing, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.listing._id === listing._id);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity += qty;
        return next;
      }
      return [...prev, { listing, quantity: qty }];
    });
  };

  const removeFromCart = (listingId: string) => {
    setCart((prev) => prev.filter((item) => item.listing._id !== listingId));
  };

  const updateQuantity = (listingId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(listingId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.listing._id === listingId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setAppliedCoupon(null);
    localStorage.removeItem('asraverse_cart');
  };

  const subtotal = cart.reduce((acc, item) => acc + item.listing.pricePerUnit * item.quantity, 0);
  const total = Math.max(0, subtotal - discount);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const norm = code.trim().toUpperCase();
    if (norm === 'KRISHI10' && subtotal >= 1000) {
      const disc = Math.min(500, Math.round(subtotal * 0.1));
      setDiscount(disc);
      setAppliedCoupon(norm);
      return { success: true, message: `Coupon KRISHI10 applied! Saved ₹${disc}` };
    } else if (norm === 'BUMPER15' && subtotal >= 2500) {
      const disc = Math.min(1200, Math.round(subtotal * 0.15));
      setDiscount(disc);
      setAppliedCoupon(norm);
      return { success: true, message: `Coupon BUMPER15 applied! Saved ₹${disc}` };
    } else if (norm === 'FARM50') {
      const disc = Math.min(250, Math.round(subtotal * 0.05));
      setDiscount(disc);
      setAppliedCoupon(norm);
      return { success: true, message: `Coupon FARM50 applied! Saved ₹${disc}` };
    }

    return { success: false, message: 'Invalid or inapplicable coupon code.' };
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        discount,
        appliedCoupon,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
