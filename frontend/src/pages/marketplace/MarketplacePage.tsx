import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Filter,
  PlusCircle,
  Heart,
  ShoppingCart,
  Star,
  MapPin,
  CheckCircle,
  Tag,
} from 'lucide-react';
import { apiRequest } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { CropListing } from '../../types';

export const MarketplacePage: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [listings, setListings] = useState<CropListing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isOrganicOnly, setIsOrganicOnly] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Listing Form State
  const [newListing, setNewListing] = useState({
    title: '',
    cropCategory: 'Grains & Cereals',
    variety: 'Pusa Bold',
    quantityAvailable: 100,
    unit: 'QUINTAL',
    pricePerUnit: 2400,
    minOrderQuantity: 5,
    isOrganic: true,
    description: 'Fresh farm produce direct from our verified fields.',
    location: { village: 'Malihabad', district: 'Lucknow', state: 'Uttar Pradesh' },
  });

  const categories = [
    'ALL',
    'Grains & Cereals',
    'Oilseeds',
    'Vegetables',
    'Pulses',
    'Commercial Crops',
  ];

  // Default initial mock listings if backend is pending seed
  const fallbackListings: CropListing[] = [
    {
      _id: 'prod-1',
      sellerId: { _id: 's-1', name: 'Ramashankar Yadav', phone: '+91 98765 00100', rating: 4.8 },
      title: 'Sharbati Premium Wheat (Gehu)',
      cropCategory: 'Grains & Cereals',
      variety: 'HD-2967',
      quantityAvailable: 150,
      unit: 'QUINTAL',
      pricePerUnit: 2350,
      minOrderQuantity: 5,
      isOrganic: true,
      harvestDate: new Date().toISOString(),
      description: 'Golden Sharbati Wheat grain harvested organically without synthetic chemicals.',
      images: ['https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80'],
      location: { village: 'Malihabad', district: 'Lucknow', state: 'Uttar Pradesh' },
      status: 'AVAILABLE',
      rating: 4.8,
      totalReviews: 24,
    },
    {
      _id: 'prod-2',
      sellerId: { _id: 's-2', name: 'Baldev Singh', phone: '+91 98765 00101', rating: 4.9 },
      title: 'Basmati Paddy / Rice (Dhan)',
      cropCategory: 'Grains & Cereals',
      variety: 'Pusa 1121',
      quantityAvailable: 220,
      unit: 'QUINTAL',
      pricePerUnit: 3400,
      minOrderQuantity: 10,
      isOrganic: false,
      harvestDate: new Date().toISOString(),
      description: 'Long grain aromatic 1121 Basmati paddy direct from field.',
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
      location: { village: 'Kalyanpur', district: 'Kanpur', state: 'Uttar Pradesh' },
      status: 'AVAILABLE',
      rating: 4.9,
      totalReviews: 38,
    },
    {
      _id: 'prod-3',
      sellerId: { _id: 's-3', name: 'Harish Chandra Patel', phone: '+91 98765 00102', rating: 4.7 },
      title: 'Yellow Mustard Seeds (Sarson)',
      cropCategory: 'Oilseeds',
      variety: 'Pusa Bold',
      quantityAvailable: 80,
      unit: 'QUINTAL',
      pricePerUnit: 5800,
      minOrderQuantity: 2,
      isOrganic: true,
      harvestDate: new Date().toISOString(),
      description: 'High oil percentage (41%+) Yellow Mustard seeds.',
      images: ['https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80'],
      location: { village: 'Bachhrawan', district: 'Rae Bareli', state: 'Uttar Pradesh' },
      status: 'AVAILABLE',
      rating: 4.7,
      totalReviews: 19,
    },
    {
      _id: 'prod-4',
      sellerId: { _id: 's-4', name: 'Shivratan Kushwaha', phone: '+91 98765 00103', rating: 4.6 },
      title: 'Fresh Farm Tomatoes (Pusa Ruby)',
      cropCategory: 'Vegetables',
      variety: 'Pusa Ruby',
      quantityAvailable: 60,
      unit: 'QUINTAL',
      pricePerUnit: 1900,
      minOrderQuantity: 1,
      isOrganic: true,
      harvestDate: new Date().toISOString(),
      description: 'Crisp organic red tomatoes freshly picked at daybreak.',
      images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'],
      location: { village: 'Gosainganj', district: 'Lucknow', state: 'Uttar Pradesh' },
      status: 'AVAILABLE',
      rating: 4.6,
      totalReviews: 12,
    },
  ];

  useEffect(() => {
    apiRequest('/marketplace').then((res) => {
      if (res.success && res.listings && res.listings.length > 0) {
        setListings(res.listings);
      } else {
        setListings(fallbackListings);
      }
    });
  }, []);

  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.cropCategory === selectedCategory;
    const matchesOrg = !isOrganicOnly || item.isOrganic;
    return matchesSearch && matchesCat && matchesOrg;
  });

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiRequest('/marketplace', {
      method: 'POST',
      body: JSON.stringify(newListing),
    });

    if (res.success && res.listing) {
      setListings([res.listing, ...listings]);
    } else {
      // Local fallback append
      const fallbackItem: CropListing = {
        _id: 'prod-' + Date.now(),
        sellerId: { _id: user?.id || 'u-1', name: user?.name || 'Kisan Seller', phone: user?.phone || '+91 98765 00100', rating: 5.0 },
        title: newListing.title,
        cropCategory: newListing.cropCategory,
        variety: newListing.variety,
        quantityAvailable: Number(newListing.quantityAvailable),
        unit: newListing.unit as any,
        pricePerUnit: Number(newListing.pricePerUnit),
        minOrderQuantity: Number(newListing.minOrderQuantity),
        isOrganic: newListing.isOrganic,
        harvestDate: new Date().toISOString(),
        description: newListing.description,
        images: ['https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80'],
        location: newListing.location,
        status: 'AVAILABLE',
        rating: 5.0,
        totalReviews: 1,
      };
      setListings([fallbackItem, ...listings]);
    }
    setCreateModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agro-100 dark:bg-agro-950 text-agro-800 dark:text-agro-300 text-xs font-bold mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Direct Kisan-to-Buyer National Mandi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Crop Marketplace (फसल मंडी)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Buy and sell verified grains, oilseeds, and vegetables directly without middleman cuts.
          </p>
        </div>

        {/* Sell Crop Button (FR-016) */}
        {user?.role === 'FARMER' && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-agro-600 hover:bg-agro-700 text-white font-bold text-sm shadow-md shadow-agro-600/30 transition self-start"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Sell Produce (फसल बेचें)</span>
          </button>
        )}
      </div>

      {/* Search & Filter Controls */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="flex-1 flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 w-full">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search by crop name (e.g. Wheat, Mustard) or District..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Organic Filter Toggle */}
          <button
            onClick={() => setIsOrganicOnly(!isOrganicOnly)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 border w-full md:w-auto justify-center ${
              isOrganicOnly
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>🍃 100% Certified Organic Only</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-agro-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredListings.map((item) => {
          const sellerName = typeof item.sellerId === 'object' ? item.sellerId.name : 'Verified Farmer';
          return (
            <div
              key={item._id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-agro-500 transition flex flex-col justify-between group"
            >
              {/* Product Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={item.images[0] || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {item.isOrganic && (
                  <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                    🌿 Organic
                  </span>
                )}
                <span className="absolute bottom-3 right-3 bg-slate-950/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-lg backdrop-blur">
                  {item.quantityAvailable} {item.unit} available
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold uppercase tracking-wider">{item.cropCategory}</span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {item.rating || 4.8}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.location.district}, {item.location.state}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Price per {item.unit}</p>
                    <p className="text-xl font-extrabold text-agro-600 dark:text-agro-400">
                      ₹{item.pricePerUnit}
                    </p>
                  </div>
                  <button
                    onClick={() => addToCart(item, 1)}
                    className="p-2.5 rounded-xl bg-agro-600 hover:bg-agro-700 text-white shadow-md shadow-agro-600/30 active:scale-95 transition"
                    title="Add to Cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Listing Modal for Farmers (FR-016) */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-agro-600" />
              <span>List Crop For Sale (फसल बिक्री के लिए जोड़ें)</span>
            </h3>

            <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Crop Title / Variety
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sharbati Wheat HD-2967 Grade A"
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newListing.cropCategory}
                    onChange={(e) => setNewListing({ ...newListing, cropCategory: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 font-medium"
                  >
                    <option value="Grains & Cereals">Grains & Cereals</option>
                    <option value="Oilseeds">Oilseeds</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Commercial Crops">Commercial Crops</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unit
                  </label>
                  <select
                    value={newListing.unit}
                    onChange={(e) => setNewListing({ ...newListing, unit: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 font-medium"
                  >
                    <option value="QUINTAL">Quintal (100 kg)</option>
                    <option value="KG">Kilogram (KG)</option>
                    <option value="TON">Metric Ton</option>
                    <option value="BOX">Box / Crate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Available Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newListing.quantityAvailable}
                    onChange={(e) =>
                      setNewListing({ ...newListing, quantityAvailable: parseInt(e.target.value) })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Price per Unit (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newListing.pricePerUnit}
                    onChange={(e) =>
                      setNewListing({ ...newListing, pricePerUnit: parseInt(e.target.value) })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-1 font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={newListing.isOrganic}
                    onChange={(e) => setNewListing({ ...newListing, isOrganic: e.target.checked })}
                    className="rounded text-agro-600 focus:ring-agro-500 w-4 h-4"
                  />
                  <span>Is this crop 100% Certified Organic? (जैविक प्रमाणित)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-agro-600 hover:bg-agro-700 text-white font-bold transition shadow"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
