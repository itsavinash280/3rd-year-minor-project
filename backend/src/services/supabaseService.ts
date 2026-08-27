import { supabaseAdmin } from '../config/supabase.js';

export const SupabaseService = {
  // 1. Users & Auth Sync
  async syncUser(userData: {
    name: string;
    email: string;
    phone: string;
    role: string;
    googleId?: string;
    avatar?: string;
  }) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .upsert(
        {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          google_id: userData.googleId,
          avatar: userData.avatar,
        },
        { onConflict: 'email' }
      )
      .select()
      .single();

    if (error) {
      console.warn('[Supabase Sync User Warning]:', error.message);
      return null;
    }
    return data;
  },

  // 2. Crop Listings
  async getCropListings(filter?: { category?: string; district?: string }) {
    let query = supabaseAdmin.from('crop_listings').select('*').eq('status', 'AVAILABLE');
    if (filter?.category) query = query.eq('crop_category', filter.category);
    if (filter?.district) query = query.eq('district', filter.district);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createCropListing(listing: any) {
    const { data, error } = await supabaseAdmin.from('crop_listings').insert([listing]).select().single();
    if (error) throw error;
    return data;
  },

  // 3. Orders & Items
  async createOrder(order: any, items: any[]) {
    const { data: createdOrder, error: orderErr } = await supabaseAdmin
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (orderErr) throw orderErr;

    if (items && items.length > 0) {
      const orderItems = items.map((i) => ({ ...i, order_id: createdOrder.id }));
      const { error: itemsErr } = await supabaseAdmin.from('order_items').insert(orderItems);
      if (itemsErr) throw itemsErr;
    }

    return createdOrder;
  },

  // 4. Disease Detection
  async saveDiseaseDetection(scan: any) {
    const { data, error } = await supabaseAdmin.from('disease_detections').insert([scan]).select().single();
    if (error) throw error;
    return data;
  },

  // 5. Crop Recommendations
  async saveCropRecommendation(rec: any) {
    const { data, error } = await supabaseAdmin.from('crop_recommendations').insert([rec]).select().single();
    if (error) throw error;
    return data;
  },

  // 6. Real-Time Mandi Prices
  async getMarketPrices(cropName?: string, district?: string) {
    let query = supabaseAdmin.from('market_prices').select('*').order('date', { ascending: false });
    if (cropName) query = query.ilike('crop_name', `%${cropName}%`);
    if (district) query = query.eq('district', district);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // 7. Government Schemes
  async getGovernmentSchemes(category?: string) {
    let query = supabaseAdmin.from('government_schemes').select('*');
    if (category) query = query.eq('category', category);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // 8. Expert Consultations
  async createConsultation(consultation: any) {
    const { data, error } = await supabaseAdmin
      .from('expert_consultations')
      .insert([consultation])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
