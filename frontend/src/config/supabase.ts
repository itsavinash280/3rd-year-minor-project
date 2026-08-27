import { createClient } from '@supabase/supabase-js';

// Supabase configuration from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseAnonKey.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper services for database tables
export const supabaseDb = {
  // Marketplace & Listings
  async getCropListings(category?: string, district?: string) {
    let query = supabase
      .from('crop_listings')
      .select('*')
      .eq('status', 'AVAILABLE')
      .order('created_at', { ascending: false });

    if (category && category !== 'ALL') query = query.eq('crop_category', category);
    if (district) query = query.eq('district', district);

    return await query;
  },

  async createCropListing(listingData: any) {
    return await supabase.from('crop_listings').insert([listingData]).select();
  },

  // Live Mandi Prices
  async getMarketPrices(cropName?: string, district?: string) {
    let query = supabase.from('market_prices').select('*').order('date', { ascending: false });
    if (cropName) query = query.ilike('crop_name', `%${cropName}%`);
    if (district) query = query.eq('district', district);
    return await query;
  },

  // Government Schemes
  async getGovernmentSchemes(category?: string) {
    let query = supabase.from('government_schemes').select('*').order('created_at', { ascending: false });
    if (category && category !== 'ALL') query = query.eq('category', category);
    return await query;
  },

  // AI Price Predictions
  async getPricePredictions(cropName?: string) {
    let query = supabase.from('price_predictions').select('*');
    if (cropName) query = query.ilike('crop_name', `%${cropName}%`);
    return await query;
  },

  // Orders
  async getUserOrders(userId: string) {
    return await supabase
      .from('orders')
      .select('*, order_items(*)')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false });
  },

  async createOrder(orderData: any, items: any[]) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (orderError) throw orderError;

    if (items && items.length > 0) {
      const formattedItems = items.map((item) => ({
        ...item,
        order_id: order.id,
      }));
      const { error: itemsError } = await supabase.from('order_items').insert(formattedItems);
      if (itemsError) throw itemsError;
    }

    return order;
  },

  // AI Scans and Disease Detection
  async saveDiseaseScan(scanData: any) {
    return await supabase.from('disease_detections').insert([scanData]).select().single();
  },

  async getFarmerDiseaseScans(farmerId: string) {
    return await supabase
      .from('disease_detections')
      .select('*')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false });
  },

  // AI Crop Recommendations
  async saveCropRecommendation(recommendationData: any) {
    return await supabase.from('crop_recommendations').insert([recommendationData]).select().single();
  },

  async getFarmerCropRecommendations(farmerId: string) {
    return await supabase
      .from('crop_recommendations')
      .select('*')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false });
  },

  // Expert Consultations
  async getExpertConsultations(userId: string) {
    return await supabase
      .from('expert_consultations')
      .select('*')
      .or(`farmer_id.eq.${userId},expert_id.eq.${userId}`)
      .order('created_at', { ascending: false });
  },

  async createConsultation(consultationData: any) {
    return await supabase.from('expert_consultations').insert([consultationData]).select().single();
  },

  // Active Coupons
  async getCoupons() {
    return await supabase.from('coupons').select('*').eq('is_active', true);
  },

  // User Notifications
  async getNotifications(userId: string) {
    return await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },
};
